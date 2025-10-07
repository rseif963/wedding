"use client";

import { LogOut, ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext"; // 👈 import context

export default function VendorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAppContext(); // 👈 get logout function from context

  const links = [
    { href: "/vdashboard/vendor", label: "Dashboard" },
    { href: "/vdashboard/vendor/profile", label: "My Profile" },
    { href: "/vdashboard/vendor/posts", label: "My Posts" },
    { href: "/vdashboard/vendor/bookings", label: "Booking Requests" },
    { href: "/vdashboard/vendor/messages", label: "Messages" },
    { href: "/vdashboard/vendor/reviews", label: "Reviews" },
  ];

  const handleLogout = () => {
    logout(); // clear user + token from context/localStorage
    router.push("/"); // redirect home
  };

  return (
    <aside className="w-64 bg-white shadow-lg p-6 flex flex-col h-screen">
      <h2 className="text-2xl font-bold text-[#311970] mb-8">Vendor</h2>

      {/* Navigation links */}
      <nav className="space-y-2 flex-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-1 rounded-lg font-medium transition ${
                active
                  ? "bg-[#311970] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Exit + Logout pinned at bottom */}
      <div className="mt-auto px-2 space-y-2">
        <Link
          href="/vendors"
          className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#4527a0] transition w-full text-gray-700 hover:text-white"
        >
          <ArrowLeftCircle size={20} /> Exit
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#4527a0] transition w-full text-gray-700 hover:text-white"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}
