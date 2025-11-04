"use client";

import { LogOut, ArrowLeftCircle, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";

export default function VendorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAppContext();
  const [open, setOpen] = useState(false); // ✅ Mobile sidebar toggle

  const links = [
    { href: "/vdashboard/vendor", label: "Dashboard" },
    { href: "/vdashboard/vendor/profile", label: "My Profile" },
    { href: "/vdashboard/vendor/posts", label: "My Posts" },
    { href: "/vdashboard/vendor/bookings", label: "Booking Requests" },
    { href: "/vdashboard/vendor/messages", label: "Messages" },
    { href: "/vdashboard/vendor/reviews", label: "Reviews" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) setOpen(false); // ✅ auto-close on mobile
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex justify-between items-center p-4 bg-[#311970] text-white fixed top-0 left-0 right-0 z-50 shadow-md">
        <h2 className="text-lg font-bold">Vendor</h2>
        <button onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col transform transition-transform duration-300 md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#311970]">Vendor Panel</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={`block px-5 py-2 mx-2 rounded-lg font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#311970] text-white shadow-md"
                    : "text-gray-700 hover:bg-purple-50 hover:text-[#311970]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-gray-100 p-4 space-y-2">
          <Link
            href="/vendors"
            onClick={handleLinkClick}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-[#311970] transition"
          >
            <ArrowLeftCircle size={20} /> Exit
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 w-full text-left rounded-lg text-gray-700 hover:bg-purple-50 hover:text-[#311970] transition"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Background overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
}
