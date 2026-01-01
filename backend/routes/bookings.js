import express from "express";
import { auth, permit } from "../middleware/auth.js";
import BookingRequest from "../models/BookingRequest.js";
import ClientProfile from "../models/ClientProfile.js";
import VendorProfile from "../models/VendorProfile.js";
import VendorAnalytics from "../models/VendorAnalytics.js";

const router = express.Router();

/* ---------------------------------------------
   CLIENT CREATE BOOKING REQUEST
----------------------------------------------*/
router.post("/", auth, permit("client"), async (req, res) => {
  try {
    const client = await ClientProfile.findOne({ user: req.user.id });
    if (!client)
      return res.status(400).json({ message: "Client profile required" });

    const { vendorId, service, date, message } = req.body;

    const vendor = await VendorProfile.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    // Create BookingRequest with first message
    const booking = await BookingRequest.create({
      client: client._id,
      vendor: vendor._id,
      service,
      date,
      messages: message ? [{ sender: "Client", content: message }] : [],
    });

    // ✅ ANALYTICS: COUNT MONTHLY BOOKINGS / INQUIRIES
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM

    await VendorAnalytics.findOneAndUpdate(
      { vendorId: vendor._id, month },
      { $inc: { bookings: 1 } },
      { upsert: true }
    );

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Failed to create request" });
  }
});

/* ---------------------------------------------
   VENDOR - GET ALL REQUESTS FOR LOGGED-IN VENDOR
----------------------------------------------*/
router.get("/vendor/me", auth, permit("vendor"), async (req, res) => {
  try {
    const vendor = await VendorProfile.findOne({ user: req.user.id });
    const requests = await BookingRequest.find({ vendor: vendor._id }).populate(
      "client"
    );

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------------------------------------
   CLIENT - GET ALL THEIR BOOKING REQUESTS
----------------------------------------------*/
router.get("/client/me", auth, permit("client"), async (req, res) => {
  try {
    const client = await ClientProfile.findOne({ user: req.user.id });
    const requests = await BookingRequest.find({ client: client._id }).populate(
      "vendor"
    );

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------------------------------------
   ADD MESSAGE (CLIENT OR VENDOR)
   PUT /api/bookingRequests/:id/message
----------------------------------------------*/
router.put("/:id/message", auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content)
      return res.status(400).json({ message: "Message content required" });

    const booking = await BookingRequest.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Determine sender
    let sender = null;

    const client = await ClientProfile.findOne({ user: req.user.id });
    const vendor = await VendorProfile.findOne({ user: req.user.id });

    if (client && booking.client.equals(client._id)) sender = "Client";
    if (vendor && booking.vendor.equals(vendor._id)) sender = "Vendor";

    if (!sender) return res.status(403).json({ message: "Forbidden" });

    // Add new chat message
    booking.messages.push({ sender, content });
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.put("/:id/message/:messageId/reply", auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content required" });

    const booking = await BookingRequest.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Determine sender role
    let sender = null;
    const client = await ClientProfile.findOne({ user: req.user.id });
    const vendor = await VendorProfile.findOne({ user: req.user.id });

    if (client && booking.client.equals(client._id)) sender = "Client";
    if (vendor && booking.vendor.equals(vendor._id)) sender = "Vendor";
    if (!sender) return res.status(403).json({ message: "Forbidden" });

    // Make sure message exists
    const targetMessage = booking.messages.id(req.params.messageId);
    if (!targetMessage)
      return res.status(404).json({ message: "Message not found" });

    // Push reply message
    booking.messages.push({
      sender,
      content,
      replyTo: targetMessage._id,
    });

    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Failed to reply to message" });
  }
});

/* ---------------------------------------------
   VENDOR UPDATE BOOKING STATUS
----------------------------------------------*/
router.put("/:id/status", auth, permit("vendor"), async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await BookingRequest.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Not found" });

    const vendor = await VendorProfile.findOne({ user: req.user.id });
    if (!vendor || !booking.vendor.equals(vendor._id))
      return res.status(403).json({ message: "Forbidden" });

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

export default router;
