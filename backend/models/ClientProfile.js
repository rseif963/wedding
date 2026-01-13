import mongoose from "mongoose";

const ClientProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Basic Info
  phone: { type: String, required: true },
  brideName: String,
  groomName: String,
  weddingDate: Date,

  // ===========================
  //        GUESTS
  // ===========================
  guests: [
    {
      name: { type: String, required: true },
      phone: String,
      email: String,
      rsvp: {
        type: String,
        enum: ["pending", "attending", "declined"],
        default: "pending",
      },
      notes: String,
      table: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],

  expectedGuestsCount: { type: Number, default: 0, required: true },
  showGuests: { type: Boolean, default: true, required: true },

  // ===========================
  //        BUDGET
  // ===========================
  budget: {
    plannedAmount: { type: Number, default: 0 },
    actualSpent: { type: Number, default: 0 },
    items: [
      {
        title: { type: String, required: true },
        category: String,
        cost: { type: Number, default: 0 },
        paid: { type: Boolean, default: false },
        notes: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    showBudget: { type: Boolean, default: true },
  },

  // ===========================
  //         TASKS
  // ===========================
  tasks: [
    {
      title: { type: String, required: true },
      description: String,
      dueDate: Date,
      completed: { type: Boolean, default: false },
      category: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  showChecklist: { type: Boolean, default: true },

  // ===========================
  //       LIKED POSTS
  // ===========================
  likedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

const ClientProfile = mongoose.model("ClientProfile", ClientProfileSchema);
export default ClientProfile;
