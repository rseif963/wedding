"use client";
import { useAppContext } from "@/context/AppContext";


export default function VendorHeroPage() {
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
      </div>

    </div>
  );
}
