import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "VendorProfile", required: true },
  plan: String,
  amount: Number,
  active: { type: Boolean, default: true },
  startedAt: Date,
  endsAt: Date,
});

const Subscription = mongoose.model("Subscription", SubscriptionSchema);
export default Subscription;