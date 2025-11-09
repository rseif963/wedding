import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // 🔹 Sender (can be either a client or a vendor)
    sender: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      role: { type: String, enum: ["client", "vendor"], required: true },
    },

    // 🔹 Receiver (can be either a client or a vendor)
    receiver: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      role: { type: String, enum: ["client", "vendor"], required: true },
    },

    // 🔹 Conversation ID (for grouping messages between one client & one vendor)
    conversationId: {
      type: String,
      index: true,
    },

    // 🔹 Message content
    text: { type: String, default: "" },
    mediaUrl: { type: String }, // optional photo/video/audio/file
    mediaType: {
      type: String,
      enum: ["image", "video", "audio", "file", "none"],
      default: "none",
    },

    // 🔹 Message status
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 🔸 Auto-generate consistent conversationId (same for both participants)
messageSchema.pre("save", function (next) {
  if (!this.conversationId) {
    const ids = [this.sender.id.toString(), this.receiver.id.toString()].sort();
    this.conversationId = ids.join("_");
  }
  next();
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
