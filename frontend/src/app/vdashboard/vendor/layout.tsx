"use client";

import { useState } from "react";
import VendorSidebar from "./components/VendorSidebar";
import VendorHeader from "./components/VendorHeader";
import { X } from "lucide-react";

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white relative">
      {/* Sidebar */}
      <div
        className={`fixed md:sticky inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 transition-transform duration-300 ease-in-out h-screen`}
      >
        {/* Close X (mobile only) */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
          className="absolute top-3 right-3 md:hidden p-2 rounded-md hover:bg-gray-100 z-50"
        >
          <X size={20} />
        </button>

        <VendorSidebar />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header (sticky at top) */}
        <div className="sticky top-0 z-40">
          <VendorHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
        </div>

        {/* Scrollable content */}
        <main className="p-1 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
