const express = require("express");
const { Translate } = require("@google-cloud/translate").v2;
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Google Translate API setup
const translate = new Translate({
  projectId: "villaonclick",
  keyFilename: "./servicefile.json", // Add path to your credentials file
});

// Detect language and translate function
async function translateText(text, targetLanguage) {
  try {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Failed to translate text.");
  }
}

app.post("/translate", async (req, res) => {
  try {
    const { name, location } = req.body;

    // Translate 'name' field into English, Arabic, and Hebrew
    const [EnglishName, ArabicName, HebrewName] = await Promise.all([
      translateText(name, "en"),
      translateText(name, "ar"),
      translateText(name, "he"),
    ]);

    // Translate 'location' field into English, Arabic, and Hebrew
    const [EnglishLocation, ArabicLocation, HebrewLocation] = await Promise.all([
      translateText(location, "en"),
      translateText(location, "ar"),
      translateText(location, "he"),
    ]);

    res.json({
      EnglishName,
      ArabicName,
      HebrewName,
      EnglishLocation,
      ArabicLocation,
      HebrewLocation,
    });
  } catch (error) {
    console.error("Error during translation:", error);
    res.status(500).json({ error: "Failed to translate villa data." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
