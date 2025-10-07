import "dotenv/config";
import "express-async-errors";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";

// routes (ESM files below)
import authRoutes from "./routes/auth.js";
import clientRoutes from "./routes/clients.js";
import vendorRoutes from "./routes/vendors.js";
import postRoutes from "./routes/posts.js";
import bookingRoutes from "./routes/bookings.js";
import messageRoutes from "./routes/messages.js";
import reviewRoutes from "./routes/reviews.js";
import adminRoutes from "./routes/admin.js";
import blogRoutes from "./routes/blogs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// static uploads
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
app.use("/uploads", express.static(path.join(__dirname, UPLOAD_DIR)));

// mount routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/bookingRequests", bookingRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);

// error handler (must be after routes)
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("API is running ");
});

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });
