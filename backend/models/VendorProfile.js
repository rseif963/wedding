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
    email: { type: String },
    profilePhoto: { type: String, default: "" },
    coverPhoto: { type: String, default: "" },

    serviceCategories: [
      {
        type: String,
      },
    ],

    serviceAreas: [
      {
        type: String,
      },
    ],

    pricingPackages: [
      {
        name: { type: String },
        price: { type: Number },
        currency: { type: String, default: "USD" },
        features: [{ type: String }],
      },
    ],

    verification: {
      emailVerified: { type: Boolean, default: false },
      documentsUploaded: { type: Boolean, default: false },
      documentType: { type: String }, // e.g. GST, PAN, etc
      documentUrl: { type: String },
    },

    availabilitySettings: {
      instantInquiries: { type: Boolean, default: true },
      showAvailabilityCalendar: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
    },

    status: {
      type: String,
      enum: ["active", "pending", "suspended"],
      default: "pending",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    topListing: {
      type: Boolean,
      default: false,
    },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const VendorProfile = mongoose.model("VendorProfile", VendorProfileSchema);
export default VendorProfile;
