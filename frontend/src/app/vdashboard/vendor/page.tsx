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
    <div className="bg-[#eee] p-6"> {/* Background matches header */}
      {/* Welcome Header */}
      <h1 className="font-serif font-bold text-2xl text-gray-900">
        Welcome back, {vendorProfile?.businessName || "Business Name"}! ✨
      </h1>

      {/* Subtitle */}
      <p className="text-base text-gray-600 mt-1">
        Here's what's happening with your business today.
      </p>

      {/* The rest of your dashboard content */}
      <div className="bg-[#eee] mt-6 rounded-lg">
        {/* Existing content inside white background */}
        <VendorStatsCards />
        <div className="grid grid-cols-1 lg:grid-cols-3 mt-1">
          <div className="lg:col-span-3 space-y-0">
            <div className="w-full">
              <ProfileManager />
              <Subscriptions />
            </div>
          </div>     
        </div>
      </div>
    </div>
  );
}
