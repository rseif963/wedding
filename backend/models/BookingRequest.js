import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["Client", "Vendor"], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const BookingRequestSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "ClientProfile", required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "VendorProfile", required: true },
  service: { type: String},
  date: { type: Date, required: true }, // Booking date
  messages: [MessageSchema], // Array of messages between client and vendor
  status: { type: String, enum: ["Pending", "Accepted", "Declined"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const BookingRequest = mongoose.model("BookingRequest", BookingRequestSchema);
export default BookingRequest;
