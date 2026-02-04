import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import "express-async-errors";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";

// routes
import authRoutes from "./routes/auth.js";
import clientRoutes from "./routes/clients.js";
import vendorRoutes from "./routes/vendors.js";
import postRoutes from "./routes/posts.js";
import bookingRoutes from "./routes/bookings.js";
import messageRoutes from "./routes/messages.js";
import chatRoutes from './routes/chat.js';
import reviewRoutes from "./routes/reviews.js";
import adminRoutes from "./routes/admin.js";
import blogRoutes from "./routes/blogs.js";
import analyticsRoutes from "./routes/analytics.js";
import adminStatsRoutes from "./routes/stats.js";
import verificationRoutes from "./routes/verification.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/bookingRequests", bookingRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminStatsRoutes);
app.use("/api/verification", verificationRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("API is running ");
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // or your frontend URL
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("sendMessage", (messageData) => {
    const { receiverId } = messageData;
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", messageData);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    [...onlineUsers.entries()].forEach(([uid, sid]) => {
      if (sid === socket.id) onlineUsers.delete(uid);
    });
  });
});

connectDB()
  .then(() => {
    server.listen(PORT, () =>
      console.log(`Server running with Socket.IO on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });
