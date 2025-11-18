import express from "express";
import { auth } from "../middleware/auth.js";
import multer from "multer";
import Message from "../models/Message.js";
import VendorProfile from "../models/VendorProfile.js";
import ClientProfile from "../models/ClientProfile.js";
import imagekit from "../config/imagekit.js";

const router = express.Router();

/*******************************
 * MULTER MEMORY STORAGE
 *******************************/
const storage = multer.memoryStorage();
const upload = multer({ storage });

/*******************************
 * NORMALIZE USER IDs
 * Converts profile IDs → User IDs
 *******************************/
async function resolveRealUserId(role, profileId) {
  if (role === "client") {
    const c = await ClientProfile.findById(profileId).populate("user");
    if (!c) return null;
    return c.user._id.toString(); // REAL User ID
  }

  if (role === "vendor") {
    const v = await VendorProfile.findById(profileId).populate("user");
    if (!v) return null;
    return v.user._id.toString(); // REAL User ID
  }

  return null;
}

/*******************************
 * SEND MESSAGE
 *******************************/
router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    const { toId, toRole, text } = req.body;

    if (!toId || !toRole)
      return res.status(400).json({ message: "Recipient ID and role required" });

    /************************************
     * VALIDATE sender + receiver roles
     * (ONLY client ↔ vendor allowed)
     ************************************/
    if (req.user.role === toRole)
      return res.status(400).json({ message: "Same-role messaging not allowed" });

    /************************************
     * RESOLVE IDs → REAL User IDs
     ************************************/
    const senderUserId = req.user.id.toString();
    const receiverUserId = await resolveRealUserId(toRole, toId);

    if (!receiverUserId)
      return res.status(404).json({ message: "Recipient not found" });

    /************************************
     * FILE UPLOAD
     ************************************/
    let mediaUrl = null;
    let mediaType = "none";

    if (req.file) {
      const uploadRes = await imagekit.upload({
        file: req.file.buffer,
        fileName: `msg_${Date.now()}`,
        folder: "/messages",
      });

      mediaUrl = uploadRes.url;

      const mime = req.file.mimetype;
      if (mime.startsWith("image/")) mediaType = "image";
      else if (mime.startsWith("video/")) mediaType = "video";
      else if (mime.startsWith("audio/")) mediaType = "audio";
      else mediaType = "file";
    }

    /************************************
     * CONSISTENT CONVERSATION ID
     ************************************/
    const ids = [senderUserId, receiverUserId].sort();
    const conversationId = ids.join("_");

    /************************************
     * SAVE MESSAGE
     ************************************/
    const msg = await Message.create({
      sender: { id: senderUserId, role: req.user.role },
      receiver: { id: receiverUserId, role: toRole },
      conversationId,
      text: text || "",
      mediaUrl,
      mediaType,
      seen: false,
    });

    /************************************
     * SOCKET EMIT (if available)
     ************************************/
    if (req.io) {
      req.io.to(receiverUserId).emit("receiveMessage", msg);
      req.io.to(senderUserId).emit("receiveMessage", msg);
    }

    res.json(msg);
  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

/*******************************
 * GET FULL CONVERSATION
 *******************************/
router.get("/conversation/:otherId", auth, async (req, res) => {
  try {
    const senderUserId = req.user.id.toString();
    const otherUserId = req.params.otherId.toString();

    const ids = [senderUserId, otherUserId].sort();
    const conversationId = ids.join("_");

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    res.json(messages);
  } catch (err) {
    console.error("FETCH CONVO ERROR:", err);
    res.status(500).json({ message: "Failed to fetch conversation" });
  }
});

/*******************************
 * GET CHAT LIST (latest per conversation)
 *******************************/
router.get("/my-chats", auth, async (req, res) => {
  try {
    const me = req.user.id.toString();

    const messages = await Message.find({
      $or: [{ "sender.id": me }, { "receiver.id": me }],
    }).sort({ createdAt: -1 });

    const chatMap = {};

    for (const msg of messages) {
      if (!chatMap[msg.conversationId]) {
        const partnerId =
          msg.sender.id.toString() === me
            ? msg.receiver.id.toString()
            : msg.sender.id.toString();

        // Fetch partner profile
        let partner = null;

        const vendor = await VendorProfile.findOne({ user: partnerId });
        const client = await ClientProfile.findOne({ user: partnerId });

        if (vendor) partner = { name: vendor.businessName, avatar: vendor.photo, role: "vendor" };
        if (client) partner = { name: client.brideName || "Client", avatar: client.photo, role: "client" };

        chatMap[msg.conversationId] = {
          lastMessage: msg,
          partner,
        };
      }
    }

    res.json(Object.values(chatMap));
  } catch (err) {
    console.error("FETCH CHATS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch chat list" });
  }
});

/*******************************
 * MARK AS SEEN
 *******************************/
router.put("/:id/seen", auth, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    if (msg.receiver.id.toString() !== req.user.id.toString())
      return res.status(403).json({ message: "Not authorized" });

    msg.seen = true;
    await msg.save();

    res.json({ success: true });
  } catch (err) {
    console.error("MARK SEEN ERROR:", err);
    res.status(500).json({ message: "Failed to mark as seen" });
  }
});

export default router;
