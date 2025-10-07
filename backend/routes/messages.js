import express from "express";
import { auth } from "../middleware/auth.js";
import Message from "../models/Message.js";
import VendorProfile from "../models/VendorProfile.js";
import User from "../models/User.js"; // 👈 make sure this exists

const router = express.Router();

// -------------------- SEND MESSAGE --------------------
router.post("/", auth, async (req, res) => {
  try {
    const { toVendorId, toUserId, text } = req.body;

    let msg;

    if (toVendorId) {
      // ✅ client → vendor
      const vendorProfile = await VendorProfile.findOne({ user: toVendorId });
      if (!vendorProfile) {
        return res.status(404).json({ message: "Vendor profile not found" });
      }

      msg = await Message.create({
        fromUser: req.user.id,
        toVendor: vendorProfile._id,
        text,
      });

      msg = await msg.populate([
        { path: "fromUser", select: "email" },
        { path: "toVendor", select: "businessName" },
      ]);
    }

    else if (toUserId) {
      // ✅ vendor → client
      const user = await User.findById(toUserId);
      if (!user) {
        return res.status(404).json({ message: "Client not found" });
      }

      msg = await Message.create({
        fromUser: req.user.id,
        toUser: toUserId, // 👈 store direct user ref
        text,
      });

      msg = await msg.populate([
        { path: "fromUser", select: "email" },
        { path: "toUser", select: "email" },
      ]);
    }

    else {
      return res.status(400).json({ message: "Recipient required" });
    }

    res.json(msg);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ message: "Failed to save message" });
  }
});

// -------------------- GET VENDOR MESSAGES --------------------
router.get("/vendor/me", auth, async (req, res) => {
  const vendor = await VendorProfile.findOne({ user: req.user.id });
  if (!vendor) return res.status(400).json({ message: "Vendor profile required" });

  const msgs = await Message.find({ toVendor: vendor._id })
    .populate("fromUser", "email")
    .populate("toVendor", "businessName");
  res.json(msgs);
});

// -------------------- FULL CONVERSATION --------------------
router.get("/conversation/:vendorUserId", auth, async (req, res) => {
  try {
    const { vendorUserId } = req.params;

    const vendorProfile = await VendorProfile.findOne({ user: vendorUserId });
    if (!vendorProfile) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    const msgs = await Message.find({
      $or: [
        // client → vendor
        { fromUser: req.user.id, toVendor: vendorProfile._id },
        // vendor → client
        { fromUser: vendorUserId, toUser: req.user.id }
      ],
    })
      .sort({ createdAt: 1 })
      .populate("fromUser", "email")
      .populate("toVendor", "businessName")
      .populate("toUser", "email");

    res.json(msgs);
  } catch (err) {
    console.error("Error fetching conversation:", err);
    res.status(500).json({ message: "Failed to fetch conversation" });
  }
});

// -------------------- CLIENT GET OWN MESSAGES --------------------
router.get("/client/me", auth, async (req, res) => {
  const msgs = await Message.find({ fromUser: req.user.id })
    .populate("toVendor", "businessName")
    .populate("fromUser", "email")
    .populate("toUser", "email");
  res.json(msgs);
});

export default router;
