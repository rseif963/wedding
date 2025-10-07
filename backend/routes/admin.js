// routes/admin.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { auth, permit } from "../middleware/auth.js";
import VendorProfile from "../models/VendorProfile.js";
import ClientProfile from "../models/ClientProfile.js";
import VendorPost from "../models/VendorPost.js";
import User from "../models/User.js"; // Make sure this exists

const router = express.Router();

// ----------------------
// PUBLIC LOGIN ROUTE
// ----------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// ----------------------
// PROTECTED ROUTES
// ----------------------
router.use(auth, permit("admin"));

// 📌 Stats route (admin-only)
router.get("/stats", async (req, res) => {
  try {
    const vendors = await VendorProfile.countDocuments();
    const clients = await ClientProfile.countDocuments();
    const totalPosts = await VendorPost.countDocuments();

    res.json({
      vendors,
      clients,
      totalPosts,
      monthlyEarnings: 0, // placeholder
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

export default router;
