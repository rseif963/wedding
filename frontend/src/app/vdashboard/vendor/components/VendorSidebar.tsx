"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  User,
  Images,
  MessageSquare,
  Calendar,
  Star,
  BarChart3,
  LogOut,
  ArrowLeftCircle,
  CreditCard,
  CalendarCheck,
  X,
} from "lucide-react";

type VendorSidebarProps = {
  onLinkClick?: () => void; 
  isOpen?: boolean;         
  closeSidebar?: () => void; 
};

export default function VendorSidebar({ onLinkClick, isOpen = true, closeSidebar }: VendorSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAppContext();
  const [viewportHeight, setViewportHeight] = useState("100vh");

  // Fix 100vh on mobile
  useEffect(() => {
    const updateHeight = () => setViewportHeight(`${window.innerHeight}px`);
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const links = [
    { href: "/vdashboard/vendor", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/vdashboard/vendor/profile", label: "Profile", icon: <User size={20} /> },
    { href: "/vdashboard/vendor/posts", label: "Portfolio", icon: <Images size={20} /> },
    { href: "/vdashboard/vendor/inquiries", label: "Inquiries", icon: <MessageSquare size={20} /> },
    { href: "/vdashboard/vendor/calendar", label: "Calendar", icon: <Calendar size={20} /> },
    { href: "/vdashboard/vendor/reviews", label: "Reviews", icon: <Star size={20} /> },
    { href: "/vdashboard/vendor/analytics", label: "Analytics", icon: <BarChart3 size={20} /> },
    { href: "/vdashboard/vendor/billing", label: "Billing", icon: <CreditCard size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
          fixed w-64 h-screen bg-white border border-gray-300 md:border-r md:border-t-0 md:border-b-0 md:border-l-0 
          flex flex-col overflow-y-auto no-scrollbar z-40
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-64 md:translate-x-0"}
        `}
      >
        {/* Logo section */}
        <div className="p-4 pb-4 border-b border-gray-300 sticky top-0 z-10 bg-white flex items-center justify-between">
          <Image
            src="/assets/logo.png"
            width={120}
            height={129}
            alt="Wedpine"
            className="select-none"
          />

          {/* 🔥 X button on small screens */}
          <button
            className="md:hidden text-gray-600 hover:text-black"
            onClick={closeSidebar}
          >
            <X size={26} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] transition font-medium
                  ${active
                    ? "bg-[#311970] text-white"
                    : "text-gray-700 hover:bg-[#f5eaff]"}
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Premium box */}
        <div className="mx-3 mb-4 p-4 rounded-xl bg-[#fdefff] border border-[#f5d9ff]">
          <div className="flex items-center gap-2 mb-2 text-[#311970] font-medium">
            <Star size={18} className="text-[#311970]" /> Go Premium
          </div>
          <p className="text-sm text-gray-600 leading-tight mb-3">
            Unlock all features and boost your visibility
          </p>
          <button className="w-full bg-[#311970] text-white py-2 rounded-lg text-sm font-medium">
            Coming Soon
          </button>
        </div>

        {/* Exit & Logout */}
        <div className="px-3 pb-6 space-y-2 mt-auto">
          <Link
            href="/vendors"
            onClick={onLinkClick}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 text-sm transition"
          >
            <ArrowLeftCircle size={16} /> Exit
          </Link>

          <button
            onClick={() => {
              handleLogout();
              onLinkClick?.();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-red-100 hover:text-red-600 transition text-sm w-full"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
