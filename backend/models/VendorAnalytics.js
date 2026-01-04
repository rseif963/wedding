import mongoose from "mongoose";

const VendorAnalyticsSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorProfile",
      required: true,
      index: true,
    },
    day: {  
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },
    profileViews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ✅ One record per vendor per day
VendorAnalyticsSchema.index(
  { vendorId: 1, day: 1 },
  { unique: true }
);

export default mongoose.model("VendorAnalytics", VendorAnalyticsSchema);
