import mongoose from "mongoose";

const VendorVerificationSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "VendorProfile", required: true, unique: true },
  nationalIdFront: { type: String }, // URL or path to front image of ID
  nationalIdBack: { type: String },  // URL or path to back image of ID
  businessCertificate: { type: String }, // URL or path to business certificate
  verified: { type: Boolean, default: false }, // Admin verification status
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update updatedAt
VendorVerificationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const VendorVerification = mongoose.models.VendorVerification || mongoose.model("VendorVerification", VendorVerificationSchema);

export default VendorVerification;
