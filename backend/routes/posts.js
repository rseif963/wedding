import express from "express";
import upload from "../utils/upload.js";
import imagekit from "../config/imagekit.js";
import VendorProfile from "../models/VendorProfile.js";
import VendorPost from "../models/VendorPost.js";
import { auth, permit } from "../middleware/auth.js";

const router = express.Router();

// Helper function: upload file buffer to ImageKit
async function uploadToImageKit(file) {
  const result = await imagekit.upload({
    file: file.buffer,
    fileName: file.originalname,
    folder: "/vendor_uploads",
  });
  return result.url;
}

// Create post (vendor)
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
    try {
      const vendorProfile = await VendorProfile.findOne({ user: req.user.id });
      if (!vendorProfile)
        return res.status(400).json({ message: "Vendor profile required" });

      const { title, description, priceFrom } = req.body;

      // Upload files to ImageKit
      const mainPhotoUrl = req.files?.mainPhoto?.[0]
        ? await uploadToImageKit(req.files.mainPhoto[0])
        : undefined;

      const galleryImageUrls = req.files?.galleryImages
        ? await Promise.all(
            req.files.galleryImages.map((f) => uploadToImageKit(f))
          )
        : [];

      const galleryVideoUrls = req.files?.galleryVideos
        ? await Promise.all(
            req.files.galleryVideos.map((f) => uploadToImageKit(f))
          )
        : [];

      const post = new VendorPost({
        vendor: vendorProfile._id,
        title,
        description,
        priceFrom: Number(priceFrom) || 0,
        mainPhoto: mainPhotoUrl,
        galleryImages: galleryImageUrls,
        galleryVideos: galleryVideoUrls,
      });

      await post.save();
      res.json(post);
    } catch (err) {
      console.error("Error creating vendor post:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update post (vendor)
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
      if (!vendorProfile)
        return res.status(400).json({ message: "Vendor profile required" });

      const post = await VendorPost.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });

      if (post.vendor.toString() !== vendorProfile._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const {
        title,
        description,
        priceFrom,
        removeGalleryImages = "[]",
      } = req.body;
      const removeList = JSON.parse(removeGalleryImages);

      // Update text fields
      if (title) post.title = title;
      if (description) post.description = description;
      if (priceFrom) post.priceFrom = Number(priceFrom);

      // ✅ Update main photo (if provided)
      if (req.files?.mainPhoto?.[0]) {
        post.mainPhoto = await uploadToImageKit(req.files.mainPhoto[0]);
      }

      // ✅ Add new gallery images (keep old ones)
      if (req.files?.galleryImages?.length) {
        const newImages = await Promise.all(
          req.files.galleryImages.map((f) => uploadToImageKit(f))
        );
        post.galleryImages = [...post.galleryImages, ...newImages];
      }

      // ✅ Remove selected gallery images
      if (removeList.length > 0) {
        post.galleryImages = post.galleryImages.filter(
          (url) => !removeList.includes(url)
        );
      }

      // ✅ Add new videos (keep old)
      if (req.files?.galleryVideos?.length) {
        const newVideos = await Promise.all(
          req.files.galleryVideos.map((f) => uploadToImageKit(f))
        );
        post.galleryVideos = [...post.galleryVideos, ...newVideos];
      }

      // ✅ Remove selected gallery videos
      if (req.body.removeGalleryVideos) {
        const removeVideos = JSON.parse(req.body.removeGalleryVideos || "[]");
        if (removeVideos.length > 0) {
          post.galleryVideos = post.galleryVideos.filter(
            (url) => !removeVideos.includes(url)
          );
        }
      }

      await post.save();
      res.json(post);
    } catch (err) {
      console.error("Error updating vendor post:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// List posts
router.get("/", async (req, res) => {
  const q = {};
  if (req.query.vendor) q.vendor = req.query.vendor;
  const posts = await VendorPost.find(q).populate("vendor");
  res.json(posts);
});

// Get single post
router.get("/:id", async (req, res) => {
  const post = await VendorPost.findById(req.params.id).populate("vendor");
  if (!post) return res.status(404).json({ message: "Not found" });
  res.json(post);
});

export default router;
