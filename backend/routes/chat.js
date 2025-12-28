import express from "express";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

const router = express.Router();

/* =====================================================
   CONVERSATIONS
===================================================== */

/**
 * Create or get a conversation (Client ↔ Vendor)
 */
router.post("/conversation", async (req, res) => {
  const { clientUserId, vendorUserId } = req.body;

  try {
    let conversation = await Conversation.findOne({
      participants: {
        $all: [
          { $elemMatch: { user: clientUserId, role: "client" } },
          { $elemMatch: { user: vendorUserId, role: "vendor" } },
        ],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [
          { user: clientUserId, role: "client" },
          { user: vendorUserId, role: "vendor" },
        ],
        unreadCounts: {
          [clientUserId]: 0,
          [vendorUserId]: 0,
        },
      });
    }

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get inbox (all conversations for a user)
 */
router.get("/conversations/:userId", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      "participants.user": req.params.userId,
    })
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Mark conversation as read
 */
router.post("/conversation/read", async (req, res) => {
  const { conversationId, userId } = req.body;

  try {
    await Conversation.findByIdAndUpdate(conversationId, {
      $set: {
        [`unreadCounts.${userId}`]: 0,
      },
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =====================================================
   MESSAGES
===================================================== */

/**
 * Send message
 */
router.post("/message", async (req, res) => {
  const { conversationId, senderId, senderRole, content } = req.body;

  try {
    const message = await Message.create({
      conversation: conversationId,
      sender: {
        user: senderId,
        role: senderRole, // "client" | "vendor"
      },
      content,
    });

    const conversation = await Conversation.findById(conversationId);

    conversation.lastMessage = message._id;

    // Increment unread count for other participant
    conversation.participants.forEach((p) => {
      if (p.user.toString() !== senderId) {
        conversation.unreadCounts.set(
          p.user.toString(),
          (conversation.unreadCounts.get(p.user.toString()) || 0) + 1
        );
      }
    });

    await conversation.save();

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get messages for a conversation
 */
router.get("/messages/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversation: req.params.conversationId,
    })
      .sort({ createdAt: 1 })
      .limit(50);

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
