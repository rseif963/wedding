import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import User from "../models/User.js";
import ClientProfile from "../models/ClientProfile.js";
import VendorProfile from "../models/VendorProfile.js";

const router = express.Router();

// Register (no verification)
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
    const user = await User.create({
      email,
      password: hashed,
      role: role || "client",
    });

    // Save phone/email in profile
    if (user.role === "client") {
      await ClientProfile.create({ user: user._id, phone });
    }
    if (user.role === "vendor") {
      try {
        await VendorProfile.create({ user: user._id, phone, businessName });
      } catch (err) {
        console.error("VendorProfile creation error:", err.message);
      }
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      },
    );

    res.json({
      success: true,
      token,
      user: { id: user._id, email: user.email, role: user.role, phone },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );

  res.json({
    token,
    user: { id: user._id, email: user.email, role: user.role },
  });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    

    // Prevent attackers from detecting registered emails
    if (!user) {
      return res.json({
        message: "If an account exists, a reset code has been sent.",
      });
    }

    // Generate 6-digit code
    const resetCode = crypto.randomInt(100000, 999999).toString();

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();  
    await sendEmail({
      to: user.email,
      subject: "Your Password Reset Code",
      html: `
    <div style="font-family:sans-serif;line-height:1.6">
      <h2>Password Reset</h2>
      <p>Your password reset code is:</p>

      <div style="
        font-size:32px;
        font-weight:bold;
        letter-spacing:6px;
        margin:20px 0;
      ">
        ${resetCode}
      </div>

      <p>This code expires in <b>10 minutes</b>.</p>

      <p>If you did not request this, ignore this email.</p>
    </div>
  `,
    });

    res.json({
      message: "If an account exists, a reset code has been sent.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/verify-reset-code", async (req, res) => {
  const { email, code } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(code).digest("hex");

    const user = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired code",
      });
    }

    res.json({ message: "Code verified" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(code).digest("hex");

    const user = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired code",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
