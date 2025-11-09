import express from "express";
import { auth } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import Message from "../models/Message.js";
import VendorProfile from "../models/VendorProfile.js";
import ClientProfile from "../models/ClientProfile.js";

const router = express.Router();

// ==========================
// 📁 Multer setup for file uploads
// ==========================
const uploadDir = "uploads/messages";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

const upload = multer({ storage });

// ==========================
// 📤 SEND MESSAGE (with optional media)
// ==========================
router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    const { toId, toRole, text } = req.body;
    let mediaUrl = null;
    let mediaType = "none";

    if (!toId || !toRole) {
      return res.status(400).json({ message: "Recipient ID and role required" });
    }

    // Validate receiver existence
    if (toRole === "vendor") {
      const vendor = await VendorProfile.findById(toId);
      if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    } else if (toRole === "client") {
      const client = await ClientProfile.findById(toId);
      if (!client) return res.status(404).json({ message: "Client not found" });
    }

    // Handle uploaded file (optional)
    if (req.file) {
      mediaUrl = `/uploads/messages/${req.file.filename}`;
      const mime = req.file.mimetype;
      if (mime.startsWith("image/")) mediaType = "image";
      else if (mime.startsWith("video/")) mediaType = "video";
      else if (mime.startsWith("audio/")) mediaType = "audio";
      else mediaType = "file";
    }

    // Build and save message
    const msg = await Message.create({
      sender: { id: req.user.id, role: req.user.role },
      receiver: { id: toId, role: toRole },
      text: text || "",
      mediaUrl,
      mediaType,
    });

    res.json(msg);
  } catch (err) {
    console.error("❌ Error sending message:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// ==========================
// 💬 GET CONVERSATION (by other user ID)
// ==========================
router.get("/conversation/:otherId", auth, async (req, res) => {
  try {
    const { otherId } = req.params;
    const ids = [req.user.id.toString(), otherId.toString()].sort();
    const conversationId = ids.join("_");

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("❌ Error fetching conversation:", err);
    res.status(500).json({ message: "Failed to fetch conversation" });
  }
});

// ==========================
// 📚 GET MY CHATS (latest per conversation)
// ==========================
router.get("/my-chats", auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ "sender.id": req.user.id }, { "receiver.id": req.user.id }],
    }).sort({ createdAt: -1 });

    const latestByChat = {};
    messages.forEach((msg) => {
      if (!latestByChat[msg.conversationId]) latestByChat[msg.conversationId] = msg;
    });

    res.json(Object.values(latestByChat));
  } catch (err) {
    console.error("❌ Error fetching chat list:", err);
    res.status(500).json({ message: "Failed to fetch chat list" });
  }
});

// ==========================
// 👁️ MARK AS SEEN
// ==========================
router.put("/:id/seen", auth, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    if (msg.receiver.id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    msg.seen = true;
    await msg.save();

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error marking as seen:", err);
    res.status(500).json({ message: "Failed to mark as seen" });
  }
});

export default router;
