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
      <div className="flex items-center justify-between px-6 py-3">

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
      </div>
    </header>
  );
}
