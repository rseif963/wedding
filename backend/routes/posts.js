import express from "express";
import upload from "../utils/upload.js";
import VendorProfile from "../models/VendorProfile.js";
import VendorPost from "../models/VendorPost.js";
import { auth, permit } from "../middleware/auth.js";

const router = express.Router();

// create post (vendor)
router.post(
  "/",
  auth,
  permit("vendor"),
  upload.fields([
    { name: "mainPhoto", maxCount: 1 },
    { name: "galleryImages", maxCount: 6 },
    { name: "galleryVideos", maxCount: 6 },
  ]),
  async (req, res) => {
    const vendorProfile = await VendorProfile.findOne({ user: req.user.id });
    if (!vendorProfile) return res.status(400).json({ message: "Vendor profile required" });

    const { title, description, priceFrom } = req.body;
    const post = new VendorPost({
      vendor: vendorProfile._id,
      title,
      description,
      priceFrom: Number(priceFrom) || 0,
      mainPhoto: req.files?.mainPhoto?.[0] ? `/${process.env.UPLOAD_DIR || "uploads"}/${req.files.mainPhoto[0].filename}` : undefined,
      galleryImages: (req.files?.galleryImages || []).map((f) => `/${process.env.UPLOAD_DIR || "uploads"}/${f.filename}`),
      galleryVideos: (req.files?.galleryVideos || []).map((f) => `/${process.env.UPLOAD_DIR || "uploads"}/${f.filename}`),
    });
    await post.save();
    res.json(post);
  }
);

// update post (vendor)
router.put(
  "/:id",
  auth,
  permit("vendor"),
  upload.fields([
    { name: "mainPhoto", maxCount: 1 },
    { name: "galleryImages", maxCount: 6 },
    { name: "galleryVideos", maxCount: 6 },
  ]),
  async (req, res) => {
    try {
      const vendorProfile = await VendorProfile.findOne({ user: req.user.id });
      if (!vendorProfile) return res.status(400).json({ message: "Vendor profile required" });

      const post = await VendorPost.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });

      // Ensure vendor owns this post
      if (post.vendor.toString() !== vendorProfile._id.toString()) {
        return res.status(403).json({ message: "Not authorized to update this post" });
      }

      const { title, description, priceFrom } = req.body;

      // Update fields if provided
      if (title !== undefined) post.title = title;
      if (description !== undefined) post.description = description;
      if (priceFrom !== undefined) post.priceFrom = Number(priceFrom) || 0;

      // Update files if new ones are uploaded
      if (req.files?.mainPhoto?.[0]) {
        post.mainPhoto = `/${process.env.UPLOAD_DIR || "uploads"}/${req.files.mainPhoto[0].filename}`;
      }
      if (req.files?.galleryImages?.length) {
        post.galleryImages = req.files.galleryImages.map(
          (f) => `/${process.env.UPLOAD_DIR || "uploads"}/${f.filename}`
        );
      }
      if (req.files?.galleryVideos?.length) {
        post.galleryVideos = req.files.galleryVideos.map(
          (f) => `/${process.env.UPLOAD_DIR || "uploads"}/${f.filename}`
        );
      }

      await post.save();
      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// list posts, optional vendor filter
router.get("/", async (req, res) => {
  const q = {};
  if (req.query.vendor) q.vendor = req.query.vendor;
  const posts = await VendorPost.find(q).populate("vendor");
  res.json(posts);
});

// get single post
router.get("/:id", async (req, res) => {
  const post = await VendorPost.findById(req.params.id).populate("vendor");
  if (!post) return res.status(404).json({ message: "Not found" });
  res.json(post);
});

export default router;