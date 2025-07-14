// --- Imports ---
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Groq } from "groq-sdk";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- MongoDB Connection (with error handling) ---
const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ Connected to MongoDB Atlas");
    } else {
      console.log("⚠️  MONGO_URI not found in .env - Forum features will be disabled");
    }
  } catch (err) {
    console.log("⚠️  MongoDB connection failed - Forum features will be disabled");
    console.log("   To enable forum features, add MONGO_URI to your .env file");
  }
};

connectDB();

// --- Forum Schemas ---
const replySchema = new mongoose.Schema({
  author: String,
  comment: String,
  time: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  author: String,
  comment: String,
  time: { type: Date, default: Date.now },
  replies: [replySchema],
});

const forumPostSchema = new mongoose.Schema({
  title: String,
  author: String,
  tags: [String],
  time: { type: Date, default: Date.now },
  replies: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: [commentSchema],
});

const ForumPost = mongoose.model("ForumPost", forumPostSchema);

// --- Forum Routes ---
app.get("/api/forum-posts", async (req, res) => {
  try {
    if (!process.env.MONGO_URI) {
      return res.status(503).json({ error: "Forum service unavailable - MongoDB not configured" });
    }
    const posts = await ForumPost.find().sort({ time: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.post("/api/forum-posts", async (req, res) => {
  try {
    if (!process.env.MONGO_URI) {
      return res.status(503).json({ error: "Forum service unavailable - MongoDB not configured" });
    }
    const { title, author, tags } = req.body;
    const newPost = new ForumPost({ title, author, tags });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

app.post("/api/forum-posts/:id/comments", async (req, res) => {
  try {
    if (!process.env.MONGO_URI) {
      return res.status(503).json({ error: "Forum service unavailable - MongoDB not configured" });
    }
    const { author, comment } = req.body;
    const { id } = req.params;
    const post = await ForumPost.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    post.comments.push({ author, comment });
    post.replies = post.comments.length;
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to post comment" });
  }
});

app.post("/api/forum-posts/:postId/comments/:commentIndex/reply", async (req, res) => {
  try {
    if (!process.env.MONGO_URI) {
      return res.status(503).json({ error: "Forum service unavailable - MongoDB not configured" });
    }
    const { postId, commentIndex } = req.params;
    const { author, comment } = req.body;
    const post = await ForumPost.findById(postId);
    if (!post || !post.comments[commentIndex])
      return res.status(404).json({ error: "Post or comment not found" });
    post.comments[commentIndex].replies.push({ author, comment });
    post.markModified("comments");
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to reply to comment" });
  }
});

// --- Groq SDK ---
let groq;
try {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
} catch (err) {
  console.log("⚠️  GROQ_API_KEY not found in .env - AI analysis will be disabled");
}

// --- Crop Health Analyzer Route ---
app.post("/api/analyze", async (req, res) => {
  const { cropName, color, leafSpots, growthSpeed, soilCondition } = req.body;

  if (!groq) {
    return res.status(503).json({ 
      error: "AI analysis service unavailable - GROQ_API_KEY not configured",
      message: "To enable AI crop analysis, add GROQ_API_KEY to your .env file"
    });
  }

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

// --- Resource Estimation Route ---
function validateInputs(crop, location, startDate, resources, farmSize) {
  const cropPattern = /^[a-zA-Z\s]+$/;
  const locationPattern = /^[a-zA-Z\s]+$/;
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const farmSizePattern = /^\d+(\.\d+)?$/;

  return (
    crop && cropPattern.test(crop) &&
    location && locationPattern.test(location) &&
    startDate && datePattern.test(startDate) &&
    Array.isArray(resources) && resources.length > 0 &&
    farmSize && farmSizePattern.test(farmSize) && Number(farmSize) > 0
  );
}

const fetchMonthlyWeather = async (location, startDate, months = 12) => {
  // Use OpenWeatherMap Geocoding API to get lat/lon
  const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`);
  const geoData = await geoRes.json();
  if (!geoData[0]) throw new Error("Location not found");
  const { lat, lon } = geoData[0];

  // Use One Call API for current and forecast (daily, up to 7 days)
  // For longer range, we simulate by repeating the 7-day forecast for each month
  const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`);
  const weatherData = await weatherRes.json();
  if (!weatherData.daily) throw new Error("Weather data not available");

  // Generate monthly weather by averaging available daily data for each month
  const start = new Date(startDate);
  let monthlyWeather = [];
  for (let i = 0; i < months; i++) {
    const monthDate = new Date(start.getFullYear(), start.getMonth() + i, 1);
    // Use the 7-day forecast as a proxy for each month (OpenWeatherMap free tier limitation)
    const daily = weatherData.daily[i % weatherData.daily.length];
    monthlyWeather.push({
      date: monthDate.toISOString().split("T")[0],
      temperature: daily.temp.day,
      rainfall: daily.rain || 0,
      weatherDesc: daily.weather[0]?.description || "",
    });
  }
  return monthlyWeather;
};

function getFarmingStage(monthIndex) {
  const stages = [
    "Land Preparation", "Sowing", "Early Growth", "Irrigation",
    "Fertilization", "Pest Control", "Weeding", "Flowering",
    "Fruit/Bulb Development", "Final Irrigation", "Ripening", "Harvesting"
  ];
  return stages[monthIndex % stages.length];
}

function getRecommendations(weather, crop, resources) {
  return resources.map((res) => {
    let advice = "", amount = "";

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
}

app.post("/api/resources", async (req, res) => {
  const { crop, location, startDate, resources, farmSize } = req.body;

  // Simple validation
  if (!crop || !location || !startDate || !resources || !resources.length || !farmSize) {
    return res.status(400).json({
      error: "All fields (crop, location, startDate, resources, farmSize) are required."
    });
  }

  if (!groq) {
    return res.status(503).json({
      error: "AI analysis service unavailable - GROQ_API_KEY not configured",
      message: "To enable AI crop analysis, add GROQ_API_KEY to your .env file"
    });
  }

  try {
    const prompt = `You are an expert farm planner. Given the following data, generate a detailed, actionable resource plan dont inlcucde any json, brackets or anythign, give proper in list or textual/paragraph/list format only, for the entire season.\n\nCrop: ${crop}\nLocation: ${location}\nStart Date: ${startDate}\nFarm Size: ${farmSize} acres\nResources to plan: ${resources.join(", ")}\n\nFor each resource, specify what to do, how much to use (scaled for farm size), and any special advice. Format as a resource, advice, and amount fields for each resource.`;
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });
    let aiPlan;
    try {
      aiPlan = JSON.parse(chatCompletion.choices[0].message.content);
    } catch {
      aiPlan = chatCompletion.choices[0].message.content;
    }
    res.json({ plan: aiPlan });
  } catch (error) {
    console.error("❌ Error generating plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Health Check Route ---
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    services: {
      server: "running",
      mongodb: process.env.MONGO_URI ? "configured" : "not configured",
      groq: process.env.GROQ_API_KEY ? "configured" : "not configured"
    },
    endpoints: [
      "GET  /api/health",
      "GET  /api/forum-posts",
      "POST /api/forum-posts", 
      "POST /api/forum-posts/:id/comments",
      "POST /api/forum-posts/:postId/comments/:commentIndex/reply",
      "POST /api/analyze",
      "POST /api/resources"
    ]
  });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Unified Farmhub server running at http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - GET  /api/forum-posts`);
  console.log(`   - POST /api/forum-posts`);
  console.log(`   - POST /api/forum-posts/:id/comments`);
  console.log(`   - POST /api/forum-posts/:postId/comments/:commentIndex/reply`);
  console.log(`   - POST /api/analyze`);
  console.log(`   - POST /api/resources`);
  console.log(`\n💡 To enable all features, create a .env file with:`);
  console.log(`   MONGO_URI=your_mongodb_connection_string`);
  console.log(`   GROQ_API_KEY=your_groq_api_key`);
  console.log(`   OPENWEATHER_API_KEY=your_openweather_api_key`);
}); 