"use client";

import {
  Home,
  Calendar,
  Users,
  CheckSquare,
  MessageSquare,
  CreditCard,
  LogOut,
  ArrowLeftCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
    { name: "Dashboard", icon: <Home size={20} />, href: "/dashboard/client" },
    {
      name: "Bookings",
      icon: <Calendar size={20} />,
      href: "/dashboard/client/bookings",
    },
    {
      name: "Messages",
      icon: <MessageSquare size={20} />,
      href: "/dashboard/client/messages",
    },
    {
      name: "Guestlist",
      icon: <Users size={20} />,
      href: "/dashboard/client/guestlist",
    },
    {
      name: "Checklist",
      icon: <CheckSquare size={20} />,
      href: "/dashboard/client/checklist",
    },
    {
      name: "Budget",
      icon: <CreditCard size={20} />,
      href: "/dashboard/client/budget",
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
    onClose();
  };

  const handleExit = () => {
    router.push("/vendors");
    onClose();
  };

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
          fixed w-64 bg-white border border-gray-300
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
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition
                  ${
                    active
                      ? "bg-[#311970] text-white"
                      : "text-gray-700 hover:bg-[#f5eaff]"
                  }
                `}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Exit + Logout */}
        <div className="px-3 pb-6 space-y-2 mt-auto">
          <button
            onClick={handleExit}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition text-sm w-full"
          >
            <ArrowLeftCircle size={16} /> Exit
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-red-100 hover:text-red-600 transition text-sm w-full"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
