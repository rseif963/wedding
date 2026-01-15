"use client";

import { useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-40">
          <AdminHeader
            adminName="Rashid"
            onOpenSidebar={() => setIsSidebarOpen(true)}
          />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-1">
          {children}
        </main>
      </div>
    </div>
  );
}
