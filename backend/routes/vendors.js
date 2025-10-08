import express from "express";
import { auth, permit } from "../middleware/auth.js";
import VendorProfile from "../models/VendorProfile.js";
import VendorPost from "../models/VendorPost.js";
import upload from "../utils/upload.js";
import imagekit from "../config/imagekit.js";

const router = express.Router();

/**
 * ✅ Get all vendors (admin only)
 */
router.get("/", auth, permit("admin"), async (req, res) => {
  try {
    const vendors = await VendorProfile.find()
      .populate("user", "email role")
      .sort({ createdAt: -1 });
    res.json(vendors);
  } catch (err) {
    console.error("Error fetching vendors:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Get my profile (vendor only)
 */
router.get("/me", auth, permit("vendor"), async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({ user: req.user.id });
    res.json(profile);
  } catch (err) {
    console.error("Error fetching vendor profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Update vendor profile (upload logo to ImageKit)
 */
router.put("/me", auth, permit("vendor"), upload.single("logo"), async (req, res) => {
  try {
    const updates = req.body;

    if (req.file) {
      // ✅ Upload to ImageKit using buffer
      const result = await imagekit.upload({
        file: req.file.buffer, // file as buffer
        fileName: req.file.originalname,
        folder: "/vendor_logos",
      });
      updates.logo = result.url; // ✅ store the ImageKit URL
    }

    const profile = await VendorProfile.findOneAndUpdate(
      { user: req.user.id },
      updates,
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (err) {
    console.error("Error updating vendor profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Get all posts for this vendor
 */
router.get("/me/posts", auth, permit("vendor"), async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const posts = await VendorPost.find({ vendor: profile._id }).sort({
      createdAt: -1,
    });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching vendor posts:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Public vendor profile by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const profile = await VendorProfile.findById(req.params.id).populate("user", "email");
    if (!profile) return res.status(404).json({ message: "Not found" });
    res.json(profile);
  } catch (err) {
    console.error("Error fetching vendor profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Toggle featured (admin only) and update all posts for that vendor
 */
router.put("/:id/feature", auth, permit("admin"), async (req, res) => {
  try {
    const { featured } = req.body;
    const vendor = await VendorProfile.findByIdAndUpdate(req.params.id, { featured }, { new: true });

    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    await VendorPost.updateMany({ vendor: vendor._id }, { featured });
    res.json({ success: true, vendor });
  } catch (err) {
    console.error("Error toggling vendor featured:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
