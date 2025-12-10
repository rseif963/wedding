"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

export default function VendorHeader({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  const { vendorProfile } = useAppContext();

  const profilePhoto =
    vendorProfile?.profilePhoto || "/assets/avatar.png";

  return (
    <header className="bg-[#FAF5F5] h-16 border-b border-gray-300 flex items-center px-4 md:px-8 justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>

        {/* Desktop search bar */}
        <div className="hidden md:flex items-center w-72 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-gray-600">
          <Search size={18} className="mr-2" />
          <input
            type="text"
            placeholder="Search inquiries, bookings..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <Bell size={20} className="text-gray-700" />
          <span className="absolute top-0 right-0 block w-2 h-2 bg-purple-600 rounded-full"></span>
        </div>

        {/* MOBILE AVATAR ONLY */}
        <div className="w-8 h-8 rounded-full overflow-hidden md:hidden">
          <Image
            src={profilePhoto}
            alt="Profile photo"
            width={28}
            height={28}
            className="object-cover"
          />
        </div>

        {/* DESKTOP PROFILE BLOCK */}
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="font-semibold text-gray-800 text-sm">
              {vendorProfile?.businessName || "Business Name"}
            </p>
            <p className="text-xs text-gray-500">
              {vendorProfile?.category || "Category"}
            </p>
          </div>

          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={profilePhoto}
              alt="Profile photo"
              width={28}
              height={28}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
