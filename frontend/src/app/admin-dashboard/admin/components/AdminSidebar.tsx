"use client";

import Link from "next/link";
import { Users, Grid, FileText, BarChart2, DollarSign, LogOut } from "lucide-react";

export default function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#0f1724] text-gray-100 flex flex-col">
      <div className="px-6 py-6 text-2xl font-bold text-[#7c4dff]">Wedpine Admin</div>

      <nav className="flex-1 px-4 space-y-2">
        <Link href="/admin-dashboard/admin" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-[#111827]">
          <Grid size={18} /> Overview
        </Link>
        <Link href="/admin-dashboard/admin/vendors" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-[#111827]">
          <Users size={18} /> Vendors
        </Link>
        <Link href="/admin-dashboard/admin/clients" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-[#111827]">
          <Users size={18} /> Clients
        </Link>
        <Link href="/admin-dashboard/admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-[#111827]">
          <BarChart2 size={18} /> Analytics
        </Link>
        <Link href="/admin-dashboard/admin/subscriptions" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-[#111827]">
          <DollarSign size={18} /> Subscriptions
        </Link>
        <Link href="/admin-dashboard/admin/blogs" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-[#111827]">
          <FileText size={18} /> Blog Manager
        </Link>
      </nav>

      <div className="px-4 py-6">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-[#111827]">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
