// routes/reviews.js
import express from "express";
import { auth, permit } from "../middleware/auth.js";
import Review from "../models/Review.js";
import ClientProfile from "../models/ClientProfile.js";
import VendorProfile from "../models/VendorProfile.js";

const router = express.Router();

// ================================
// Client posts a review
// ================================
router.post("/", auth, permit("client"), async (req, res) => {
  try {
    const client = await ClientProfile.findOne({ user: req.user.id });
    if (!client)
      return res.status(404).json({ error: "Client profile not found" });

    const {
      vendorId,
      rating,
      text,
      quality = 0,
      responsiveness = 0,
      professionalism = 0,
      flexibility = 0,
      value = 0,
    } = req.body;

    const review = await Review.create({
      client: client._id,
      vendor: vendorId,
      rating,
      text,
      quality,
      responsiveness,
      professionalism,
      flexibility,
      value,
      reply: "", // Initialize empty reply
    });

    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create review" });
  }
});

// ================================
// Vendor posts a reply to a review
// ================================
router.post("/:reviewId/reply", auth, permit("vendor"), async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Reply cannot be empty" });
    }

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    const vendor = await VendorProfile.findOne({ user: req.user.id });
    if (!vendor)
      return res.status(403).json({ error: "Vendor profile not found" });

    if (review.vendor.toString() !== vendor._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to reply to this review" });
    }

    // Add reply directly to review.reply
    review.reply = text;
    await review.save();

    // Return updated review with populated client & vendor info
    const updatedReview = await Review.findById(reviewId)
      .populate("client", "user name")
      .populate("vendor", "user name");

    res.json(updatedReview);
  } catch (err) {
    console.error("Reply error:", err);
    res.status(500).json({ error: "Failed to post reply" });
  }
});

// ================================
// Get all reviews for a vendor
// ================================
router.get("/vendor/:id", async (req, res) => {
  try {
    const reviews = await Review.find({ vendor: req.params.id })
      .populate("client", "user name")
      .populate("vendor", "user name"); // Only populate client & vendor

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

export default router;
