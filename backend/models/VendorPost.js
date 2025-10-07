import mongoose from "mongoose";

const VendorPostSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "VendorProfile", required: true },
  title: String,
  description: String,
  priceFrom: Number,
  mainPhoto: String,
  galleryImages: [String],
  galleryVideos: [String],
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const VendorPost = mongoose.model("VendorPost", VendorPostSchema);
export default VendorPost;