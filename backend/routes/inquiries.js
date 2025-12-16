import express from "express";
import Inquiry from "@/models/Inquiry";
import mongoose from "mongoose";

const router = express.Router();

/**
 * GET /inquiries/:userId
 * Fetch all inquiries for a client or vendor
 */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ error: "Invalid user ID" });

    const inquiries = await Inquiry.find({
      $or: [{ client: userId }, { vendor: userId }],
    })
      .populate("client", "name email")
      .populate("vendor", "name email")
      .sort({ updatedAt: -1 });

    res.json(inquiries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /inquiries
 * Create a new inquiry
 * Body: { client, vendor, subject?, weddingDate?, message }
 */
router.post("/", async (req, res) => {
  try {
    const { client, vendor, subject, weddingDate, message, sender } = req.body;

    if (!client || !vendor || !message || !sender) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const inquiry = new Inquiry({
      client,
      vendor,
      subject,
      weddingDate,
      messages: [
        {
          sender,
          content: message,
        },
      ],
    });

    await inquiry.save();
    const populated = await inquiry
      .populate("client", "name email")
      .populate("vendor", "name email")
      .execPopulate();

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /inquiries/:inquiryId/messages
 * Add a message to an existing inquiry
 * Body: { sender, content, replyTo?, attachments? }
 */
router.post("/:inquiryId/messages", async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const { sender, content, replyTo, attachments } = req.body;

    if (!mongoose.Types.ObjectId.isValid(inquiryId)) {
      return res.status(400).json({ error: "Invalid inquiry ID" });
    }

    if (!sender || !content) {
      return res.status(400).json({ error: "Missing sender or content" });
    }

    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) return res.status(404).json({ error: "Inquiry not found" });

    inquiry.messages.push({
      sender,
      content,
      replyTo: replyTo || null,
      attachments: attachments || [],
    });

    inquiry.updatedAt = new Date();
    await inquiry.save();

    const populated = await inquiry
      .populate("client", "name email")
      .populate("vendor", "name email")
      .execPopulate();

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /inquiries/:inquiryId/messages
 * Get all messages for a specific inquiry
 */
router.get("/:inquiryId/messages", async (req, res) => {
  try {
    const { inquiryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(inquiryId)) {
      return res.status(400).json({ error: "Invalid inquiry ID" });
    }

    const inquiry = await Inquiry.findById(inquiryId)
      .populate("client", "name email")
      .populate("vendor", "name email");

    if (!inquiry) return res.status(404).json({ error: "Inquiry not found" });

    res.json(inquiry.messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * PATCH /inquiries/:inquiryId/status
 * Update the status of an inquiry
 * Body: { status: "New" | "Replied" | "Archived" }
 */
router.patch("/:inquiryId/status", async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(inquiryId)) {
      return res.status(400).json({ error: "Invalid inquiry ID" });
    }

    if (!["New", "Replied", "Archived"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      inquiryId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!inquiry) return res.status(404).json({ error: "Inquiry not found" });

    res.json(inquiry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
