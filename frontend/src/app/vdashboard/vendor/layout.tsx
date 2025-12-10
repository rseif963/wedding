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
      {/* Mobile overlay for blur */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed h-screen h-[100vh] md:sticky inset-y-0 left-0 z-50 w-64 bg-white transform
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Close X (mobile only) */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
          className="absolute top-3 right-3 md:hidden p-2 rounded-md hover:bg-gray-100 z-50"
        >
          <X size={20} color={"white"} />
        </button>

        {/* Sidebar content */}
        <div className="h-screen overflow-y-auto">
          {/* Pass down the callback to close sidebar on link click */}
          <VendorSidebar onLinkClick={() => setIsSidebarOpen(false)} />
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header (sticky at top) */}
        <div className="sticky top-0 z-40">
          <VendorHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
