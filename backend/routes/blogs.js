import express from "express";
import BlogPost from "../models/BlogPost.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// ✅ Setup image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/blogs");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Create new post
router.post("/", upload.single("mainPhoto"), async (req, res) => {
  try {
    const { title, description } = req.body;

    const newPost = new BlogPost({
      title,
      description,
      author: "Admin",
      mainPhoto: req.file ? `/uploads/blogs/${req.file.filename}` : undefined,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post", details: err.message });
  }
});

// ✅ Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// ✅ Get single post
router.get("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// ✅ Update post
router.put("/:id", upload.single("mainPhoto"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const updateData = { title, description };

    if (req.file) {
      updateData.mainPhoto = `/uploads/blogs/${req.file.filename}`;
    }

    const updated = await BlogPost.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update post" });
  }
});

// ✅ Delete post
router.delete("/:id", async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
