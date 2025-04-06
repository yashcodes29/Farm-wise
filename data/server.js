const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { Groq } = require("groq-sdk");
const fetch = require("node-fetch"); // Only required if using external APIs

dotenv.config();

const app = express();
const PORT = 3001; // Unified port

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🔐 Groq API setup
const groq = new Groq({
  apiKey: "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", // Replace with your secure method in production
});

// -------- /api/analyze (Groq AI Crop Health Analysis) -------- //
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
    res.send(result);
  } catch (err) {
    console.error("❌ Groq API Error:", err);
    res.status(500).send("Error analyzing crop data.");
  }
});

// -------- /api/resources (Resource Estimation & Weather Plan) -------- //
function validateInputs(crop, location, startDate, resources) {
  const cropPattern = /^[a-zA-Z\s]+$/;
  const locationPattern = /^[a-zA-Z\s]+$/;
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  return (
    crop && cropPattern.test(crop) &&
    location && locationPattern.test(location) &&
    startDate && datePattern.test(startDate) &&
    Array.isArray(resources) && resources.length > 0
  );
}

const generateMockYearWeather = () => {
  const today = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date(today.getFullYear(), i, 1);
    return {
      date: date.toISOString().split("T")[0],
      temperature: Math.floor(20 + Math.random() * 15), // 20–35°C
      rainfall: Math.floor(Math.random() * 30), // 0–30 mm
    };
  });
};

function getFarmingStage(monthIndex) {
  const stages = [
    "Land Preparation", "Sowing", "Early Growth", "Irrigation",
    "Fertilization", "Pest Control", "Weeding", "Flowering",
    "Fruit/Bulb Development", "Final Irrigation", "Ripening", "Harvesting"
  ];
  return stages[monthIndex % stages.length];
}

const getRecommendations = (weather, crop, resources) => {
  return resources.map((res) => {
    let advice = "";
    let amount = "";

    if (res === "Water Usage") {
      if (weather.rainfall < 10) {
        advice = "Increase irrigation this month.";
        amount = "300-500 liters per acre";
      } else if (weather.rainfall > 25) {
        advice = "Reduce watering due to heavy rainfall.";
        amount = "100-200 liters per acre";
      } else {
        advice = "Maintain standard irrigation.";
        amount = "250-300 liters per acre";
      }
    }

    if (res === "Fertilizer") {
      if (weather.temperature > 30) {
        advice = "Apply fertilizer in early morning or evening.";
        amount = "50 kg/acre of NPK (10:26:26)";
      } else if (weather.temperature < 20) {
        advice = "Use slow-release fertilizer.";
        amount = "60 kg/acre of Urea";
      } else {
        advice = "Standard fertilizer application is ideal.";
        amount = "45 kg/acre of balanced fertilizer";
      }
    }

    if (res === "Pesticide") {
      if (weather.rainfall > 20) {
        advice = "Delay spraying until after rain.";
        amount = "1.5 liters/acre";
      } else {
        advice = "Spray pesticides in dry conditions.";
        amount = "1 liter/acre";
      }
    }

    return { resource: res, advice, amount };
  });
};

app.post("/api/resources", async (req, res) => {
  const { crop, location, startDate, resources } = req.body;

  if (!validateInputs(crop, location, startDate, resources)) {
    return res.status(400).json({
      error: "Invalid input. Please enter valid crop name, location, date, and resources.",
    });
  }

  try {
    const weatherData = generateMockYearWeather();
    const plan = weatherData.map((day, i) => ({
      date: day.date,
      temperature: day.temperature,
      rainfall: day.rainfall,
      stage: getFarmingStage(i),
      recommendations: getRecommendations(day, crop, resources),
    }));

    res.json({ plan });
  } catch (error) {
    console.error("❌ Error generating plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the unified server
app.listen(PORT, () => {
  console.log(`✅ Unified server running at http://localhost:${PORT}`);
});
