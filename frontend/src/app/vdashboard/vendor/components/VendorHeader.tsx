"use client";

import { Bell, Menu } from "lucide-react";

export default function VendorHeader({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        {/* Hamburger menu (mobile only) */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>

        <h1 className="text-xl font-bold text-gray-800">Vendor Dashboard</h1>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-600 hover:text-[#311970]">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
