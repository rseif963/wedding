"use client";

import { Bell, Search, Menu } from "lucide-react";

interface AdminHeaderProps {
  adminName?: string;
  onOpenSidebar: () => void;
}

export default function AdminHeader({
  adminName = "Admin",
  onOpenSidebar,
}: AdminHeaderProps) {
  return (
    <header className="relative bg-white shadow">
      <div className="flex items-center justify-between px-6 py-4">

        {/* Mobile Menu */}
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-black/5"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        {/* Spacer (keeps layout balanced like client header) */}
        <div />

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search (desktop only) */}
          <div className="hidden sm:flex items-center bg-gray-100 px-3 py-2 rounded-lg">
            <Search size={16} className="text-gray-500" />
            <input
              className="ml-2 bg-transparent outline-none text-sm placeholder-gray-400"
              placeholder="Search vendors, clients, posts..."
            />
          </div>

          {/* Notifications */}
          <button className="relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
          </button>

          {/* Admin Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#311970] flex items-center justify-center shadow-md">
            <span className="text-white font-semibold text-sm">
              {adminName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
