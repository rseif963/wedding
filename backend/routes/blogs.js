import express from "express";
import BlogPost from "../models/BlogPost.js";
import multer from "multer";
import imagekit from "../config/imagekit.js"; // ✅ Use your existing ImageKit config

const router = express.Router();

// ✅ Configure multer for in-memory storage (no local uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Create new blog post (upload image to ImageKit)
router.post("/", upload.single("mainPhoto"), async (req, res) => {
  try {
    const { title, description } = req.body;
    let uploadedImageUrl;

    // ✅ If image is included, upload to ImageKit
    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer, // file buffer from multer memory storage
        fileName: `blog_${Date.now()}`,
        folder: "/blogs", // optional folder name in ImageKit dashboard
      });
      uploadedImageUrl = uploadResponse.url;
    }

    const newPost = new BlogPost({
      title,
      description,
      author: "Admin",
      mainPhoto: uploadedImageUrl || undefined,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
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

// ✅ Update post (upload new image to ImageKit if provided)
router.put("/:id", upload.single("mainPhoto"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const updateData = { title, description };

    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `blog_${Date.now()}`,
        folder: "/blogs",
      });
      updateData.mainPhoto = uploadResponse.url;
    }

    const updated = await BlogPost.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update post", details: err.message });
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
