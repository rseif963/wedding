import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
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
    ],

    // Used for inbox preview
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    // Track unread counts per participant
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

ConversationSchema.index({ "participants.user": 1 });

export default mongoose.model("Conversation", ConversationSchema);
