"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Users,
  X,
  Grid,
  FileText,
  BarChart2,
  DollarSign,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [viewportHeight, setViewportHeight] = useState("100vh");

  // Fix 100vh on mobile (same as client sidebar)
  useEffect(() => {
    const updateHeight = () => setViewportHeight(`${window.innerHeight}px`);
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const links = [
    {
      name: "Overview",
      href: "/admin-dashboard/admin",
      icon: <Grid size={18} />,
    },
    {
      name: "Vendors",
      href: "/admin-dashboard/admin/vendors",
      icon: <Users size={18} />,
    },
    {
      name: "Clients",
      href: "/admin-dashboard/admin/clients",
      icon: <Users size={18} />,
    },
    {
      name: "Analytics",
      href: "/admin-dashboard/admin/analytics",
      icon: <BarChart2 size={18} />,
    },
    {
      name: "Subscriptions",
      href: "/admin-dashboard/admin/subscriptions",
      icon: <DollarSign size={18} />,
    },
    {
      name: "Blog Manager",
      href: "/admin-dashboard/admin/blogs",
      icon: <FileText size={18} />,
    },
  ];

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        style={{ height: viewportHeight }}
        className={`
          fixed w-64 bg-[#f6f4fb] border border-gray-300
          md:border-r md:border-t-0 md:border-b-0 md:border-l-0
          flex flex-col overflow-y-auto no-scrollbar z-40
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-64 md:translate-x-0"}
        `}
      >
        {/* Logo */}
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

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ name, href, icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={name}
                href={href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition
                  ${
                    isActive
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

        {/* Logout */}
        <div className="px-3 pb-6 mt-auto">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-red-100 hover:text-red-600 transition text-sm w-full"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
