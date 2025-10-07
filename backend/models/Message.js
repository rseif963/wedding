import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // either vendor OR client will be set depending on direction
  toVendor: { type: mongoose.Schema.Types.ObjectId, ref: "VendorProfile" },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  text: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// optional: enforce at least one recipient
MessageSchema.pre("validate", function (next) {
  if (!this.toVendor && !this.toUser) {
    next(new Error("Message must have either toVendor or toUser"));
  } else {
    next();
  }
});

const Message = mongoose.model("Message", MessageSchema);
export default Message;
