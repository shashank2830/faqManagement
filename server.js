require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Faq = require("./models/Faq");
const methodOverride = require("method-override"); 
const { translateText } = require("./utils/translator");
const redisClient = require("./redisClient"); // Import Redis client

const adminRoutes = require("./routes/admin");


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());


app.set("view engine", "ejs"); // Set EJS as the template engine
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride("_method")); // Enable PUT/DELETE in forms
app.use(express.static("public")); // Serve static files


// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));   

// Default Route
app.get("/", (req, res) => {
  res.send("FAQ Management API is running...");     
});

app.use(express.json()); // Allows Express to parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data


app.use("/admin", adminRoutes);

app.post("/faq", async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debug request body
  
    const { question, answer } = req.body;
  
    if (!question || !answer) {
      return res.status(400).json({ message: "Question and Answer are required." });
    }
  
    // Translate to multiple languages
    const translations = {
      question_hi: await translateText(question, "hi"),
      question_bn: await translateText(question, "bn"),
      question_es: await translateText(question, "es"),
      answer_hi: await translateText(answer, "hi"),
      answer_bn: await translateText(answer, "bn"),
      answer_es: await translateText(answer, "es"),
    };
  
    // Debug translations
    console.log("Generated Translations:", translations);
  
    // Create and save the FAQ
    const faq = new Faq({ question, answer, translations });
    await faq.save();
  
    res.status(201).json(faq);
  } catch (error) {
    console.error("Error creating FAQ:", error.message);
    res.status(500).json({ message: error.message });
  }
});
  

app.get("/faq", async (req, res) => {
  try {
    const lang = req.query.lang || "en";
  
    // Ensure Redis is connected before use
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  
    // Check cache
    const cachedFaqs = await redisClient.get(`faqs_${lang}`);
    if (cachedFaqs) {
      console.log("🔴 Cache Hit");
      return res.json(JSON.parse(cachedFaqs));
    }
  
    console.log("🟢 Cache Miss - Fetching from MongoDB");
    const faqs = await Faq.find();
    const translatedFaqs = faqs.map((faq) => faq.getTranslatedFaq(lang));
  
    // Store in Redis cache with expiration time (1 hour)
    await redisClient.setEx(`faqs_${lang}`, 3600, JSON.stringify(translatedFaqs));
  
    res.json(translatedFaqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error.message);
    res.status(500).json({ message: error.message });
  }
});
  
  

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
