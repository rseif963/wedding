import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "VendorProfile", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ReviewSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "ClientProfile", required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "VendorProfile", required: true },
  
  // Overall rating
  rating: { type: Number, min: 1, max: 5, required: true },
  text: { type: String, required: true },

  // Category-specific ratings
  quality: { type: Number, min: 1, max: 5, default: 0 },
  responsiveness: { type: Number, min: 1, max: 5, default: 0 },
  professionalism: { type: Number, min: 1, max: 5, default: 0 },
  flexibility: { type: Number, min: 1, max: 5, default: 0 },
  value: { type: Number, min: 1, max: 5, default: 0 },

  // Vendor replies (supports multiple replies)
  replies: [ReplySchema],

  createdAt: { type: Date, default: Date.now },
});

// Export model
const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
export default Review;
