import mongoose from "mongoose";

const ClientProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Basic Info
  phone: { type: String, required: true },
  brideName: String,
  groomName: String,
  weddingDate: Date,

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
      table: String,       // Optional: table assignment
      createdAt: { type: Date, default: Date.now },
    },
  ],

  // Expected number of guests (user sets this)
  expectedGuestsCount: { type: Number, default: 0 },

  // Toggle to enable/disable guest section
  showGuests: { type: Boolean, default: true },

  // ===========================
  //       BUDGET TRACKER
  // ===========================
  budget: {
    plannedAmount: { type: Number, default: 0 },  // User sets this
    actualSpent: { type: Number, default: 0 },    // Auto-calc optional

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

    showBudget: { type: Boolean, default: true }, // Toggle
  },

  tasks: [
    {
      title: { type: String, required: true },
      description: String,
      dueDate: Date,
      completed: { type: Boolean, default: false },
      category: String, // Optional: e.g. "Pre-wedding", "Ceremony", etc.
      createdAt: { type: Date, default: Date.now },
    },
  ],

  // Toggle checklist
  showChecklist: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },
});

const ClientProfile = mongoose.model("ClientProfile", ClientProfileSchema);
export default ClientProfile;
