import mongoose from "mongoose";

// Message schema inside an inquiry
const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["Client", "Vendor"], required: true },
  content: { type: String, required: true },
  replyTo: { type: mongoose.Schema.Types.ObjectId, default: null }, // Optional threading
  attachments: [{ type: String }], // Optional files
  createdAt: { type: Date, default: Date.now },
});

// Main inquiry schema
const InquirySchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "ClientProfile", required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "VendorProfile", required: true },
  subject: { type: String, default: "New Inquiry" }, // Optional subject/title
  weddingDate: { type: Date }, // Optional, can be used for filters
  messages: [MessageSchema], // Chat history
  status: { type: String, enum: ["New", "Replied", "Archived"], default: "New" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook to update `updatedAt`
InquirySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Inquiry = mongoose.model("Inquiry", InquirySchema);

export default Inquiry;
