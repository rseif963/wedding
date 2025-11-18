import express from "express";
import { auth, permit } from "../middleware/auth.js";
import ClientProfile from "../models/ClientProfile.js";

const router = express.Router();

/* ===========================================================
   GET ALL CLIENTS (ADMIN ONLY)
   =========================================================== */
router.get("/", auth, permit("admin"), async (req, res) => {
  try {
    const clients = await ClientProfile.find()
      .populate("user", "email role")
      .sort({ createdAt: -1 });

    res.json(clients);
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===========================================================
   GET OWN PROFILE
   =========================================================== */
router.get("/me", auth, permit("client"), async (req, res) => {
  const profile = await ClientProfile.findOne({ user: req.user.id }).populate(
    "user",
    "email"
  );
  res.json(profile);
});

/* ===========================================================
   GET ALL (PROFILE + GUESTS + BUDGET + TASKS)
   =========================================================== */
router.get("/me/all", auth, permit("client"), async (req, res) => {
  try {
    const profile = await ClientProfile.findOne({ user: req.user.id }).populate(
      "user",
      "email"
    );

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json({
      profile: {
        brideName: profile.brideName,
        groomName: profile.groomName,
        weddingDate: profile.weddingDate,
        phone: profile.phone,
      },
      guests: profile.guests,
      budget: profile.budget,
      tasks: profile.tasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===========================================================
   UPDATE BASIC PROFILE
   =========================================================== */
router.put("/me", auth, permit("client"), async (req, res) => {
  const { brideName, groomName, weddingDate, phone } = req.body;

  const profile = await ClientProfile.findOneAndUpdate(
    { user: req.user.id },
    { brideName, groomName, weddingDate, phone },
    { new: true, upsert: true }
  );

  res.json(profile);
});

/* ===========================================================
   EXPECTED GUESTS
   =========================================================== */
router.put("/expected-guests", auth, permit("client"), async (req, res) => {
  const { expectedGuestsCount } = req.body;

  const profile = await ClientProfile.findOneAndUpdate(
    { user: req.user.id },
    { expectedGuestsCount },
    { new: true }
  );

  res.json({ expectedGuestsCount: profile.expectedGuestsCount });
});

/* ===========================================================
   =====================   GUESTS   ===========================
   =========================================================== */

router.post("/guests", auth, permit("client"), async (req, res) => {
  const { name, phone, email, rsvp, notes, table } = req.body;

  const profile = await ClientProfile.findOneAndUpdate(
    { user: req.user.id },
    { $push: { guests: { name, phone, email, rsvp, notes, table } } },
    { new: true }
  );

  res.json(profile.guests);
});

router.put("/guests/:guestId", auth, permit("client"), async (req, res) => {
  const { guestId } = req.params;

  const fieldsToUpdate = {};
  for (const key of Object.keys(req.body)) {
    fieldsToUpdate[`guests.$.${key}`] = req.body[key];
  }

  const profile = await ClientProfile.findOneAndUpdate(
    {
      user: req.user.id,
      "guests._id": guestId,
    },
    { $set: fieldsToUpdate },
    { new: true }
  );

  res.json(profile.guests);
});

router.delete("/guests/:guestId", auth, permit("client"), async (req, res) => {
  const { guestId } = req.params;

  const profile = await ClientProfile.findOneAndUpdate(
    { user: req.user.id },
    { $pull: { guests: { _id: guestId } } },
    { new: true }
  );

  res.json(profile.guests);
});

router.put("/toggle-guests", auth, permit("client"), async (req, res) => {
  const profile = await ClientProfile.findOneAndUpdate(
    { user: req.user.id },
    { showGuests: req.body.showGuests },
    { new: true }
  );

  res.json({ showGuests: profile.showGuests });
});

/* ===========================================================
   =====================   BUDGET   ===========================
   =========================================================== */

router.put("/budget/planned", auth, permit("client"), async (req, res) => {
  const { plannedAmount } = req.body;

  const profile = await ClientProfile.findOneAndUpdate(
    { user: req.user.id },
    { "budget.plannedAmount": plannedAmount },
    { new: true }
  );

  res.json(profile.budget);
});

router.post("/budget/item", auth, permit("client"), async (req, res) => {
  const { title, category, cost, paid, notes } = req.body;

  const profile = await ClientProfile.findOneAndUpdate(
    { user: req.user.id },
    { $push: { "budget.items": { title, category, cost, paid, notes } } },
    { new: true }
  );

  res.json(profile.budget);
});

/* ✅ FIXED — budget items no longer lose data */
router.put("/budget/item/:itemId", auth, permit("client"), async (req, res) => {
  const { itemId } = req.params;

  const updateFields = {};
  for (const key of Object.keys(req.body)) {
    updateFields[`budget.items.$.${key}`] = req.body[key];
  }

  const profile = await ClientProfile.findOneAndUpdate(
    { user: req.user.id, "budget.items._id": itemId },
    { $set: updateFields },
    { new: true }
  );

  res.json(profile.budget);
});

router.delete("/budget/item/:itemId", auth, permit("client"), async (req, res) => {
  const { itemId } = req.params;

  const profile = await ClientProfile.findOneAndUpdate(
    { user: req.user.id },
    { $pull: { "budget.items": { _id: itemId } } },
    { new: true }
  );

  res.json(profile.budget);
});

router.put("/budget/toggle", auth, permit("client"), async (req, res) => {
  const profile = await ClientProfile.findOneAndUpdate(
    { user: req.user.id },
    { "budget.showBudget": req.body.showBudget },
    { new: true }
  );

  res.json({ showBudget: profile.budget.showBudget });
});

/* ===========================================================
   =====================   TASKS   ===========================
   =========================================================== */

router.post("/tasks", auth, permit("client"), async (req, res) => {
  const { title, description, dueDate, category } = req.body;

  const profile = await ClientProfile.findOneAndUpdate(
    { user: req.user.id },
    { $push: { tasks: { title, description, dueDate, category } } },
    { new: true }
  );

  res.json(profile.tasks);
});

router.put("/tasks/:taskId", auth, permit("client"), async (req, res) => {
  const { taskId } = req.params;

  const updateFields = {};
  for (const key of Object.keys(req.body)) {
    updateFields[`tasks.$.${key}`] = req.body[key];
  }

  const profile = await ClientProfile.findOneAndUpdate(
    { user: req.user.id, "tasks._id": taskId },
    { $set: updateFields },
    { new: true }
  );

  res.json(profile.tasks);
});

router.delete("/tasks/:taskId", auth, permit("client"), async (req, res) => {
  const { taskId } = req.params;

  const profile = await ClientProfile.findOneAndUpdate(
    { user: req.user.id },
    { $pull: { tasks: { _id: taskId } } },
    { new: true }
  );

  res.json(profile.tasks);
});

router.put("/tasks/toggle", auth, permit("client"), async (req, res) => {
  const profile = await ClientProfile.findOneAndUpdate(
    { user: req.user.id },
    { showChecklist: req.body.showChecklist },
    { new: true }
  );

  res.json({ showChecklist: profile.showChecklist });
});

export default router;
