import express from "express";
import mongoose from "mongoose";
import VendorAnalytics from "../models/VendorAnalytics.js";

const router = express.Router();

/* ---------------------------------------------
   COUNT PROFILE VIEW (DAILY)
----------------------------------------------*/
router.post("/profile-view", async (req, res) => {
  try {
    const { vendorId } = req.body;

    if (!vendorId || !mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    // YYYY-MM-DD
    const day = new Date().toISOString().slice(0, 10);

    await VendorAnalytics.findOneAndUpdate(
      {
        vendorId: new mongoose.Types.ObjectId(vendorId),
        day,
      },
      { $inc: { profileViews: 1 } },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Profile view error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------------------------------------
   GET DAILY ANALYTICS FOR A VENDOR
----------------------------------------------*/
router.get("/vendor/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    const data = await VendorAnalytics.find({
      vendorId: new mongoose.Types.ObjectId(vendorId),
    }).sort({ day: 1 });

    res.json(data);
  } catch (err) {
    console.error("Fetch analytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
