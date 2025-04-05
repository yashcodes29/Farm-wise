import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Groq } from "groq-sdk";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// 📡 MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 🎯 Mongoose Schema
const commentSchema = new mongoose.Schema({
  author: String,
  comment: String,
  time: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  title: String,
  author: String,
  tags: [String],
  time: { type: Date, default: Date.now },
  comments: [commentSchema],
  replies: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
});

const ForumPost = mongoose.model("ForumPost", postSchema);

// 🛠️ Routes for Forum
app.get("/api/forum-posts", async (req, res) => {
  const posts = await ForumPost.find().sort({ time: -1 });
  res.json(posts);
});

app.post("/api/forum-posts", async (req, res) => {
  const newPost = new ForumPost(req.body);
  await newPost.save();
  res.status(201).json(newPost);
});

app.post("/api/forum-posts/:id/comments", async (req, res) => {
  const { author, comment } = req.body;
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  post.comments.push({ author, comment });
  post.replies = post.comments.length;
  await post.save();
  res.json(post);
});

app.patch("/api/forum-posts/:id/like", async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  post.likes += 1;
  await post.save();
  res.json(post);
});

// 📡 Groq API Setup
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Fetch API Key from .env
});

// 🛠️ Crop Health Analysis Route
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

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
