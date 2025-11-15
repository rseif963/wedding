import express from "express";
import { auth } from "../middleware/auth.js";
import multer from "multer";
import Message from "../models/Message.js";
import VendorProfile from "../models/VendorProfile.js";
import ClientProfile from "../models/ClientProfile.js";
import imagekit from "../config/imagekit.js"; // ✅ Use your existing ImageKit config

const router = express.Router();

// ==========================
// 📁 Multer setup for in-memory storage
// ==========================
const storage = multer.memoryStorage();
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

    // Validate receiver
    if (toRole === "vendor") {
      const vendor = await VendorProfile.findById(toId);
      if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    } else if (toRole === "client") {
      const client = await ClientProfile.findById(toId);
      if (!client) return res.status(404).json({ message: "Client not found" });
    }

    // Handle uploaded file
    if (req.file) {
      // Upload file to ImageKit
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `message_${Date.now()}`,
        folder: "/messages",
      });
      mediaUrl = uploadResponse.url;

      const mime = req.file.mimetype;
      if (mime.startsWith("image/")) mediaType = "image";
      else if (mime.startsWith("video/")) mediaType = "video";
      else if (mime.startsWith("audio/")) mediaType = "audio";
      else mediaType = "file";
    }

    // ✅ Create consistent conversation ID
    const ids = [req.user.id.toString(), toId.toString()].sort();
    const conversationId = ids.join("_");

    // ✅ Save message
    const msg = await Message.create({
      sender: { id: req.user.id, role: req.user.role },
      receiver: { id: toId, role: toRole },
      conversationId,
      text: text || "",
      mediaUrl,
      mediaType,
      seen: false,
    });

    // ✅ Emit real-time update (if socket is attached)
    if (req.io) {
      req.io.to(toId).emit("receiveMessage", msg);
      req.io.to(req.user.id.toString()).emit("receiveMessage", msg);
    }

    res.json(msg);
  } catch (err) {
    console.error("❌ Error sending message:", err);
    res.status(500).json({ message: "Failed to send message", details: err.message });
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
