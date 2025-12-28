import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    sender: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      role: {
        type: String,
        enum: ["client", "vendor"],
        required: true,
      },
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    attachments: [
      {
        url: String,
        type: {
          type: String,
          enum: ["image", "file"],
        },
      },
    ],

    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

MessageSchema.index({ conversation: 1, createdAt: -1 });

export default mongoose.model("Message", MessageSchema);
