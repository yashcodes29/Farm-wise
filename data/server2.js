import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Forum Post Schema
const replySchema = new mongoose.Schema({
  author: String,
  comment: String,
  time: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  author: String,
  comment: String,
  time: { type: Date, default: Date.now },
  replies: [replySchema]
});

const forumPostSchema = new mongoose.Schema({
  title: String,
  author: String,
  tags: [String],
  time: { type: Date, default: Date.now },
  replies: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: [commentSchema]
});

const ForumPost = mongoose.model("ForumPost", forumPostSchema);

// Routes

// Get all posts
app.get("/api/forum-posts", async (req, res) => {
  try {
    const posts = await ForumPost.find().sort({ time: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Create new post
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

// Add comment
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

// Reply to a comment
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
