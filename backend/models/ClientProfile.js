import mongoose from "mongoose";

const ClientProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  phone: { type: String, required: true },  // 📌 New phone field
  brideName: String,
  groomName: String,
  weddingDate: Date,
  guests: [{ name: String, phone: String, email: String }],
  createdAt: { type: Date, default: Date.now },
});

const ClientProfile = mongoose.model("ClientProfile", ClientProfileSchema);
export default ClientProfile;