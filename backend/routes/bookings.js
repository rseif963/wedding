import express from "express";
import { auth, permit } from "../middleware/auth.js";
import BookingRequest from "../models/BookingRequest.js";
import ClientProfile from "../models/ClientProfile.js";
import VendorProfile from "../models/VendorProfile.js";

const router = express.Router();

// client creates request
router.post("/", auth, permit("client"), async (req, res) => {
  const client = await ClientProfile.findOne({ user: req.user.id });
  if (!client) return res.status(400).json({ message: "Client profile required" });

  const { vendorId, service, date, message } = req.body;
  const vendor = await VendorProfile.findById(vendorId);
  if (!vendor) return res.status(404).json({ message: "Vendor not found" });

  const br = await BookingRequest.create({ client: client._id, vendor: vendor._id, service, date, message });
  res.json(br);
});

router.get("/vendor/me", auth, permit("vendor"), async (req, res) => {
  const vendor = await VendorProfile.findOne({ user: req.user.id });
  const requests = await BookingRequest.find({ vendor: vendor._id }).populate("client");
  res.json(requests);
});

// client lists their requests
router.get("/client/me", auth, permit("client"), async (req, res) => {
  const client = await ClientProfile.findOne({ user: req.user.id });
  const requests = await BookingRequest.find({ client: client._id }).populate("vendor");
  res.json(requests);
});

// update status (vendor)
router.put("/:id/status", auth, permit("vendor"), async (req, res) => {
  const { status } = req.body;
  const booking = await BookingRequest.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Not found" });

  const vendor = await VendorProfile.findOne({ user: req.user.id });
  if (!vendor || !booking.vendor.equals(vendor._id)) return res.status(403).json({ message: "Forbidden" });

  booking.status = status;
  await booking.save();
  res.json(booking);
});

export default router;
