const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Groq } = require("groq-sdk");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const groq = new Groq({
  apiKey: "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", // 🔐 Hardcoded API Key (Replace this with your actual key)
});

app.post("/api/analyze", async (req, res) => {
  const { cropName, color, leafSpots, growthSpeed, soilCondition } = req.body;

  const prompt = `Analyze the crop health based on the following data:
- Crop: ${cropName}
- Color: ${color}
- Leaf Spots: ${leafSpots}
- Growth Speed: ${growthSpeed}
- Soil Condition: ${soilCondition}
Give a brief health status, possible issues, and an overall score out of 100.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    const result = chatCompletion.choices[0].message.content;
    res.send(result); // Just send plain text
  } catch (err) {
    console.error("❌ API Error:", err);
    res.status(500).send("Error analyzing crop data.");
  }
});

app.listen(3001, () => {
  console.log("🚀 Server running at http://localhost:3001");
});
