import mongoose from "mongoose";

const BookingRequestSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "ClientProfile", required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "VendorProfile", required: true },
  service: String,
  date: Date,
  message: String,
  status: { type: String, enum: ["Pending", "Accepted", "Declined"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const BookingRequest = mongoose.model("BookingRequest", BookingRequestSchema);
export default BookingRequest;