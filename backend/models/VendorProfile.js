import mongoose from "mongoose";

const VendorProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    businessName: { type: String, required: true },
    category: { type: String },
    location: { type: String },
    website: { type: String },
    description: { type: String },
    logo: { type: String },
    phone: { type: String, required: true },

    // ✅ Add vendor account status
    status: {
      type: String,
      enum: ["active", "pending", "suspended"],
      default: "pending",
    },

    // ✅ Add featured flag for homepage
    featured: {
      type: Boolean,
      default: false,
    },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const VendorProfile = mongoose.model("VendorProfile", VendorProfileSchema);
export default VendorProfile;
