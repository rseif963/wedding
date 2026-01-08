"use client";

import VendorStatsCards from "./components/VendorStatsCards";
import ProfileManager from "./components/ProfileManager";
import PostsManager from "./components/PostsManager";
import Subscriptions from "./components/Subscriptions";
import { useAppContext } from "@/context/AppContext";
import VendorInquiries from "./components/VendorInquiries";


export default function DashboardPage() {
  const { vendorProfile } = useAppContext();
  return (
    <div className="w-full"> {/* Background matches header */}
      {/* Welcome Header */}
      <div className="p-4 bg-[#eee] ">
        <h1 className="font-serif font-bold text-2xl text-gray-900">
          Welcome back, {vendorProfile?.businessName || "Business Name"}!
        </h1>

        {/* Subtitle */}
        <p className="text-base text-gray-600 mt-1">
          Here's what's happening with your business today.
        </p>

        {/* Existing content inside white background */}
        <VendorStatsCards />
      </div>

      <div className="w-full rounded-2xl">
        <ProfileManager />
      </div>
    </div>
  );
}
