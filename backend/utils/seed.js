import "dotenv/config";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import ClientProfile from "../models/ClientProfile.js";
import VendorProfile from "../models/VendorProfile.js";
import VendorPost from "../models/VendorPost.js";

const run = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await ClientProfile.deleteMany({});
    await VendorProfile.deleteMany({});
    await VendorPost.deleteMany({});

    // admin
    const adminPass = await bcrypt.hash("adminpass", 10);
    await User.create({ email: "admin@wedpine.com", password: adminPass, role: "admin" });

    // vendor
    const vendorPass = await bcrypt.hash("vendorpass", 10);
    const vendorUser = await User.create({ email: "vendor1@wedpine.com", password: vendorPass, role: "vendor" });
    const vendorProfile = await VendorProfile.create({
      user: vendorUser._id,
      businessName: "Dream Wedding Photography",
      category: "Photography",
      location: "Nairobi",
      description: "We capture moments",
    });

    // client
    const clientPass = await bcrypt.hash("clientpass", 10);
    const clientUser = await User.create({ email: "client1@wedpine.com", password: clientPass, role: "client" });
    await ClientProfile.create({ user: clientUser._id, brideName: "Mary", groomName: "John", weddingDate: "2025-12-20" });

    // sample post
    await VendorPost.create({
      vendor: vendorProfile._id,
      title: "Full day wedding photography",
      description: "All-day coverage, two photographers, online gallery",
      priceFrom: 50000,
    });

    console.log("Seeded data. Admin: admin@wedpine.com/adminpass, Vendor: vendor1@..., VendorPass: vendorpass, Client: client1@..., clientpass");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
