// routes/vendors.js
import express from "express";
import { auth, permit } from "../middleware/auth.js";
import VendorProfile from "../models/VendorProfile.js";
import VendorPost from "../models/VendorPost.js"; // ✅ import posts
import upload from "../utils/upload.js";

const router = express.Router();

/**
 * ✅ Get all vendors (admin only)
 * e.g. GET /api/vendors
 */
router.get("/", auth, permit("admin"), async (req, res) => {
  try {
    const vendors = await VendorProfile.find()
      .populate("user", "email role") // optional populate with user info
      .sort({ createdAt: -1 });
    res.json(vendors);
  } catch (err) {
    console.error("Error fetching vendors:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get my profile (vendor only)
router.get("/me", auth, permit("vendor"), async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({ user: req.user.id });
    res.json(profile);
  } catch (err) {
    console.error("Error fetching vendor profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update my vendor profile (logo upload allowed)
router.put(
  "/me",
  auth,
  permit("vendor"),
  upload.single("logo"),
  async (req, res) => {
    try {
      const updates = req.body;
      if (req.file) {
        updates.logo = `/${process.env.UPLOAD_DIR || "uploads"}/${req.file.filename}`;
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
  }
);

// ✅ Get all posts of the logged-in vendor
router.get("/me/posts", auth, permit("vendor"), async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const posts = await VendorPost.find({ vendor: profile._id }).sort({
      createdAt: -1,
    });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching vendor posts:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Public vendor profile by id
router.get("/:id", async (req, res) => {
  try {
    const profile = await VendorProfile.findById(req.params.id).populate(
      "user",
      "email"
    );
    if (!profile) return res.status(404).json({ message: "Not found" });
    res.json(profile);
  } catch (err) {
    console.error("Error fetching vendor profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Toggle featured (admin only) and update all posts for that vendor
router.put("/:id/feature", auth, permit("admin"), async (req, res) => {
  try {
    const { featured } = req.body;

    // Update vendor featured flag
    const vendor = await VendorProfile.findByIdAndUpdate(
      req.params.id,
      { featured },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // ✅ Update all posts for this vendor
    await VendorPost.updateMany({ vendor: vendor._id }, { featured });

    res.json({ success: true, vendor });
  } catch (err) {
    console.error("Error toggling vendor featured:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
