"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Users, X, Grid, FileText, BarChart2, DollarSign, LogOut } from "lucide-react";

export default function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  // Define links in an array for mapping
  const links = [
    { name: "Overview", href: "/admin-dashboard/admin", icon: <Grid size={18} /> },
    { name: "Vendors", href: "/admin-dashboard/admin/vendors", icon: <Users size={18} /> },
    { name: "Clients", href: "/admin-dashboard/admin/clients", icon: <Users size={18} /> },
    { name: "Analytics", href: "/admin-dashboard/admin/analytics", icon: <BarChart2 size={18} /> },
    { name: "Subscriptions", href: "/admin-dashboard/admin/subscriptions", icon: <DollarSign size={18} /> },
    { name: "Blog Manager", href: "/admin-dashboard/admin/blogs", icon: <FileText size={18} /> },
  ];

  return (
    <aside className="w-64 mt-2 min-h-screen bg-[#f6f4fb] text-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-300 sticky top-0 z-10 bg-white flex items-center justify-between">
        <Image
          src="/assets/logo.png"
          width={120}
          height={120}
          alt="Wedpine"
          className="select-none"
        />

        {/* Close button (mobile) */}
        <button
          className="md:hidden text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X size={26} />
        </button>
      </div>

      <nav className="flex-1 px-2 mt-3">
        {links.map(({ name, href, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={name}
              href={href}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-md transition
                ${isActive 
                  ? "bg-[#311970] text-white" 
                  : "text-gray-700 hover:bg-purple-200"
                }
              `}
            >
              {icon}
              {name}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-6">
        <button
          onClick={() => {
            // You can handle logout here if you have a logout handler, else just close
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-purple-200 text-gray-700 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
