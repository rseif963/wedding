"use client";

import { Bell, Search, Menu } from "lucide-react";
import Image from "next/image";

interface AdminHeaderProps {
  adminName?: string;
  onOpenSidebar: () => void;
}

export default function AdminHeader({
  adminName = "Admin",
  onOpenSidebar,
}: AdminHeaderProps) {
  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Sidebar toggle button (mobile) */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>

        <div className="text-lg font-semibold text-gray-800">Dashboard</div>

        {/* Search bar */}
        <div className="hidden sm:flex items-center bg-gray-100 px-3 py-2 rounded-lg">
          <Search size={16} className="text-gray-500" />
          <input
            className="ml-2 bg-transparent outline-none text-sm"
            placeholder="Search vendors, clients, posts..."
          />
        </div>
      </div>

      {/* Right side: admin info & notifications */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700">{adminName}</div>
            <div className="text-xs text-gray-500">Administrator</div>
          </div>

          <button className="relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
