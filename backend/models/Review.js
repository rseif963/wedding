import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "ClientProfile", required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "VendorProfile", required: true },
  rating: { type: Number, min: 1, max: 5 },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", ReviewSchema);
export default Review;