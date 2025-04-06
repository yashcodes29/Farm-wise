const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
const PORT = 5000;
const API_KEY = process.env.VITE_OPENWEATHER_API_KEY;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Helper function to validate input
function validateInputs(crop, location, startDate, resources) {
  const cropPattern = /^[a-zA-Z\s]+$/;
  const locationPattern = /^[a-zA-Z\s]+$/;
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (
    !crop || !cropPattern.test(crop) ||
    !location || !locationPattern.test(location) ||
    !startDate || !datePattern.test(startDate) ||
    !Array.isArray(resources) || resources.length === 0
  ) {
    return false;
  }

  return true;
}

// Mock weather data for 12 months
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

// Generate farming stage descriptions
function getFarmingStage(monthIndex) {
  const stages = [
    "Land Preparation", "Sowing", "Early Growth", "Irrigation",
    "Fertilization", "Pest Control", "Weeding", "Flowering",
    "Fruit/Bulb Development", "Final Irrigation", "Ripening", "Harvesting"
  ];
  return stages[monthIndex % stages.length];
}

// Advice and resource estimation
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

    return {
      resource: res,
      advice,
      amount,
    };
  });
};

// Endpoint: /api/resources
app.post("/api/resources", async (req, res) => {
  const { crop, location, startDate, resources } = req.body;

  if (!validateInputs(crop, location, startDate, resources)) {
    return res.status(400).json({ error: "Invalid input. Please enter a valid crop name, location, start date (YYYY-MM-DD), and select at least one resource." });
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
    console.error("Error generating plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
