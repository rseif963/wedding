import express from "express";
import { auth, permit } from "../middleware/auth.js";
import Review from "../models/Review.js";
import ClientProfile from "../models/ClientProfile.js";

const router = express.Router();

// client posts review
router.post("/", auth, permit("client"), async (req, res) => {
  const client = await ClientProfile.findOne({ user: req.user.id });
  const { vendorId, rating, text } = req.body;
  const review = await Review.create({ client: client._id, vendor: vendorId, rating, text });
  res.json(review);
});

// get reviews for vendor
router.get("/vendor/:id", async (req, res) => {
  const reviews = await Review.find({ vendor: req.params.id }).populate("client");
  res.json(reviews);
});

export default router;
