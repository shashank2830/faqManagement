const express = require("express");
const router = express.Router();
const Faq = require("../models/Faq");

// Admin Dashboard - List FAQs
router.get("/", async (req, res) => {
  const faqs = await Faq.find();
  res.render("faqs/index", { faqs });
});

// New FAQ Form
router.get("/new", (req, res) => {
  res.render("faqs/new");
});

// Create FAQ
router.post("/", async (req, res) => {
  const { question, answer } = req.body;
  const faq = new Faq({ question, answer });
  await faq.save();
  res.redirect("/admin");
});

// Edit FAQ Form
router.get("/:id/edit", async (req, res) => {
  const faq = await Faq.findById(req.params.id);
  res.render("faqs/edit", { faq });
});

// Update FAQ
router.put("/:id", async (req, res) => {
  await Faq.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/admin");
});

// Delete FAQ
router.delete("/:id", async (req, res) => {
  await Faq.findByIdAndDelete(req.params.id);
  res.redirect("/admin");
});

module.exports = router;
