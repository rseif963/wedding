import express from "express";
import { auth, permit } from "../middleware/auth.js";
import Review from "../models/Review.js";
import ClientProfile from "../models/ClientProfile.js";

const router = express.Router();

// client posts review
// client posts review
router.post("/", auth, permit("client"), async (req, res) => {
  try {
    const client = await ClientProfile.findOne({ user: req.user.id });

    // Destructure category ratings from the request, defaulting to 0
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
    });

    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create review" });
  }
});


// get reviews for vendor
router.get("/vendor/:id", async (req, res) => {
  const reviews = await Review.find({ vendor: req.params.id }).populate("client");
  res.json(reviews);
});

export default router;
