const axios = require("axios");

// Function to translate text using MyMemory API
const translateText = async (text, targetLang) => {
  try {
    const response = await axios.get("https://api.mymemory.translated.net/get", {
      params: {
        q: text,
        langpair: `en|${targetLang}`, // Translate from English to target language
      },
    });

    return response.data.responseData.translatedText || text; // Return translated text or original text if failed
  } catch (error) {
    console.error(`Translation error for ${targetLang}:`, error.message);
    return text; // Fallback to original text
  }
};

module.exports = { translateText };
