import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import ClientProfile from "../models/ClientProfile.js";
import VendorProfile from "../models/VendorProfile.js";

const router = express.Router();

// 📌 Register (no verification)
router.post("/register", async (req, res) => {
  const { email, password, role, phone } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });

    // Hash password & create user
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, role: role || "client" });

    // ✅ Save phone/email in profile
    if (user.role === "client") {
      await ClientProfile.create({ user: user._id, phone });
    }
    if (user.role === "vendor") {
      await VendorProfile.create({ user: user._id, phone });
    }

    // Create token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.json({
      success: true,
      token,
      user: { id: user._id, email: user.email, role: user.role, phone },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

// 📌 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
});

export default router;
