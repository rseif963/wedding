"use client";

import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import VendorStatsCards from "./components/VendorStatsCards";
import ProfileManager from "./components/ProfileManager";
import PostsManager from "./components/PostsManager";
import Subscriptions from "./components/Subscriptions";
import VendorInquiries from "./components/VendorInquiries";

export default function DashboardPage() {
  const { vendorProfile, fetchVendorMe } = useAppContext();

  // State for controlling the visibility of the welcome pop-up
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  useEffect(() => {
    fetchVendorMe();
  }, []);
  // Check if the pop-up was shown before
  useEffect(() => {
    const isPopupShown = localStorage.getItem("hasShownWelcomePopup");
    if (!isPopupShown) {
      setShowWelcomePopup(true);
    }
  }, []);

  // Handle dismissing the pop-up
  const handleDismissPopup = () => {
    setShowWelcomePopup(false);
    localStorage.setItem("hasShownWelcomePopup", "true");
  };

  return (
    <div className="w-full">
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

      {/* Conditionally render the welcome pop-up */}
      {showWelcomePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
            {/* Pop-up Content */}
            <h2 className="text-2xl font-bold text-[#311970] mb-4">Welcome to Wedpine</h2>
            <p className="text-gray-700 text-base mb-6">
              Complete your profile to activate your vendor listing and begin receiving couple inquiries.
            </p>

            {/* Button to dismiss the pop-up */}
            <button
              onClick={handleDismissPopup}
              className="w-full bg-[#311970] text-white py-2 rounded-xl font-semibold hover:bg-[#261457]"
            >
              Set Up My Listing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
