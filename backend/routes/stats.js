import express from "express";
import { auth, permit } from "../middleware/auth.js";
import ClientProfile from "../models/ClientProfile.js";
import Vendor from "../models/VendorProfile.js";
import BlogPost from "../models/BlogPost.js";

const router = express.Router();

router.get("/stats", auth, permit("admin"), async (req, res) => {
  try {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    /* ================= CLIENTS ================= */
    const clients = await ClientProfile.countDocuments();

    const clientsThisMonth = await ClientProfile.countDocuments({
      createdAt: { $gte: startOfThisMonth },
    });

    const clientsLastMonth = await ClientProfile.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
    });

    /* ================= VENDORS ================= */
    const vendors = await Vendor.countDocuments();

    const vendorsThisMonth = await Vendor.countDocuments({
      createdAt: { $gte: startOfThisMonth },
    });

    const vendorsLastMonth = await Vendor.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
    });

    /* ================= BLOG POSTS ================= */
    const totalPosts = await BlogPost.countDocuments();

    const postsThisMonth = await BlogPost.countDocuments({
      createdAt: { $gte: startOfThisMonth },
    });

    const postsLastMonth = await BlogPost.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
    });

    res.json({
      clients,
      clientsThisMonth,
      clientsLastMonth,

      vendors,
      vendorsThisMonth,
      vendorsLastMonth,

      totalPosts,
      postsThisMonth,
      postsLastMonth,

      // subscriptions not ready yet
      activeSubscriptions: 0,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
