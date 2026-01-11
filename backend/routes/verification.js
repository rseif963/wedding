import express from "express";
import upload from "../utils/upload.js";
import imagekit from "../config/imagekit.js";
import VendorProfile from "../models/VendorProfile.js";
import VendorVerification from "../models/VendorVerification.js";
import { auth, permit } from "../middleware/auth.js";

const router = express.Router();

// Helper: upload file buffer to ImageKit
async function uploadToImageKit(file, folder = "/vendor_verification") {
  const result = await imagekit.upload({
    file: file.buffer,
    fileName: file.originalname,
    folder,
  });
  return result.url;
}

// Create or update verification documents
router.post(
  "/",
  auth,
  permit("vendor"),
  upload.fields([
    { name: "nationalIdFront", maxCount: 1 },
    { name: "nationalIdBack", maxCount: 1 },
    { name: "businessCertificate", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const vendorProfile = await VendorProfile.findOne({ user: req.user.id });
      if (!vendorProfile)
        return res.status(400).json({ message: "Vendor profile required" });

      // Find existing verification or create new
      let verification = await VendorVerification.findOne({ vendor: vendorProfile._id });
      if (!verification) {
        verification = new VendorVerification({ vendor: vendorProfile._id });
      }

      // Upload files if provided
      if (req.files?.nationalIdFront?.[0]) {
        verification.nationalIdFront = await uploadToImageKit(req.files.nationalIdFront[0]);
      }
      if (req.files?.nationalIdBack?.[0]) {
        verification.nationalIdBack = await uploadToImageKit(req.files.nationalIdBack[0]);
      }
      if (req.files?.businessCertificate?.[0]) {
        verification.businessCertificate = await uploadToImageKit(req.files.businessCertificate[0]);
      }

      await verification.save();

      // Only send a confirmation, not file URLs
      res.json({ message: "Documents uploaded successfully" });
    } catch (err) {
      console.error("Error saving vendor verification:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Vendor: fetch verification metadata (no file URLs)
router.get("/me", auth, permit("vendor"), async (req, res) => {
  try {
    const vendorProfile = await VendorProfile.findOne({ user: req.user.id });
    if (!vendorProfile)
      return res.status(400).json({ message: "Vendor profile required" });

    const verification = await VendorVerification.findOne({ vendor: vendorProfile._id });
    if (!verification)
      return res.status(404).json({ message: "Verification not found" });

    res.json({
      verified: verification.verified,
      createdAt: verification.createdAt,
    });
  } catch (err) {
    console.error("Error fetching verification metadata:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: get all verification records with file URLs
router.get("/", auth, permit("admin"), async (req, res) => {
  try {
    const verifications = await VendorVerification.find().populate("vendor");
    res.json(verifications); // ✅ Only admin can see the photos
  } catch (err) {
    console.error("Error fetching verifications:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: approve verification
router.put("/:id/approve", auth, permit("admin"), async (req, res) => {
  try {
    const verification = await VendorVerification.findById(req.params.id);
    if (!verification) return res.status(404).json({ message: "Verification not found" });

    verification.verified = true;
    await verification.save();
    res.json({ message: "Vendor verified", verification });
  } catch (err) {
    console.error("Error approving verification:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
