import express from "express";
import mongoose from "mongoose";
import { Resend } from "resend";
import VendorAnalytics from "../models/VendorAnalytics.js";
import Vendor from "../models/User.js";


const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);
/* ---------------------------------------------
   COUNT PROFILE VIEW (DAILY)
----------------------------------------------*/
router.post("/profile-view", async (req, res) => {
  try {
    const { vendorId } = req.body;

    if (!vendorId || !mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    const day = new Date().toISOString().slice(0, 10);

    // Increment views
    const analytics = await VendorAnalytics.findOneAndUpdate(
      {
        vendorId: new mongoose.Types.ObjectId(vendorId),
        day,
      },
      { $inc: { profileViews: 1 } },
      { upsert: true, new: true }
    );

    // 🔒 Send email only on FIRST view of the day
    if (analytics.profileViews === 1) {
      const vendor = await Vendor.findById(vendorId).select("email name");

      if (vendor?.email) {
        await resend.emails.send({
          from:`"Wedpine" <${process.env.EMAIL_FROM}>`,
          to: vendor.email,
          subject: "Someone viewed your profile",
          html: `
            <p>Hi ${vendor.businessName || "there"},</p>
            <p>Good news! Someone just viewed your profile today.</p>
            <p>Log in to see more details.</p>
            <br/>
            <p>— Your App Team</p>
          `,
        });
      }
    }

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
