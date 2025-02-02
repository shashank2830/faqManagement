const mongoose = require("mongoose");

const FaqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    translations: {
      question_hi: { type: String }, // Hindi
      question_bn: { type: String }, // Bengali
      question_es: { type: String }, // Spanish
      answer_hi: { type: String },
      answer_bn: { type: String },
      answer_es: { type: String },
    },
  },
  { timestamps: true }
);

// Method to get FAQ in requested language (fallback to English if unavailable)
FaqSchema.methods.getTranslatedFaq = function (lang) {
  return {
    question: this.translations[`question_${lang}`] || this.question, // Fallback to English
    answer: this.translations[`answer_${lang}`] || this.answer, // Fallback to English
  };
};



const Faq = mongoose.model("Faq", FaqSchema);
module.exports = Faq;