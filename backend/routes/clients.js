import express from "express";
import { auth, permit } from "../middleware/auth.js";
import ClientProfile from "../models/ClientProfile.js";

const router = express.Router();

/**
 * ✅ NEW: Get all clients (public)
 * e.g. GET /api/clients
 */
router.get("/", auth, permit("admin"), async (req, res) => {
  try {
    const clients = await ClientProfile.find()
      .populate("user", "email role") // include user info if needed
      .sort({ createdAt: -1 });

    res.json(clients);
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// get own profile
router.get("/me", auth, permit("client"), async (req, res) => {
  const profile = await ClientProfile.findOne({ user: req.user.id }).populate("user", "email");
  res.json(profile);
});

// update profile (including bride/groom/date)
router.put("/me", auth, permit("client"), async (req, res) => {
  const { brideName, groomName, weddingDate } = req.body;
  const profile = await ClientProfile.findOneAndUpdate(
    { user: req.user.id },
    { brideName, groomName, weddingDate },
    { new: true, upsert: true }
  );
  res.json(profile);
});

export default router;
