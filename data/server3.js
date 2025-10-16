// --- Imports ---
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Groq } from "groq-sdk";
import fetch from "node-fetch"; // If using external APIs

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

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
    const posts = await ForumPost.find().sort({ time: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.post("/api/forum-posts", async (req, res) => {
  try {
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
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // 🔐 Store securely in .env
});

// --- Crop Health Analyzer Route ---
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

// --- Resource Estimation Route ---
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
      temperature: Math.floor(20 + Math.random() * 15),
      rainfall: Math.floor(Math.random() * 30),
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

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Unified server running at http://localhost:${PORT}`);
});
