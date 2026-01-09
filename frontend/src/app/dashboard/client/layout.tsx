"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { X } from "lucide-react";

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <div
        className={`fixed md:sticky inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transformq1
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 transition-transform duration-300 ease-in-out h-screen`}
      >
        {/* Close X (mobile only) */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
          className="absolute top-3 right-3 md:hidden p-2 rounded-md hover:bg-gray-100 z-50"
        >
        </button>
       
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header (sticky at top) */}
        <div className="sticky top-0 z-40">
          <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
        </div>

        {/* Scrollable content */}
        <main className="p-1 flex-1">{children}</main>
      </div>
    </div>
  );
}
