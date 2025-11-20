"use client";

import { Bell, Menu } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function VendorHeader(
  {
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  const { vendorProfile, fetchVendorMe } = useAppContext();
  return (
    <header className="bg-white shadow px-1 md:px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-1">
        {/* Hamburger menu (mobile only) */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>

        <h1 className="md:text-xl text-center font-bold text-gray-800">Welcome, {vendorProfile?.businessName || "Vendor"}</h1>
      </div>
    </header>
  );
}
