"use client";

import { LogOut, ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";

type VendorSidebarProps = {
  onLinkClick?: () => void; // ✅ allow sidebar close callback
};

export default function VendorSidebar({ onLinkClick }: VendorSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAppContext();
  const [viewportHeight, setViewportHeight] = useState("100vh");

  // ✅ Fix 100vh issue on mobile
  useEffect(() => {
    const updateHeight = () => setViewportHeight(`${window.innerHeight}px`);
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

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

  return (
    <aside
      className="w-64 bg-white shadow-lg flex flex-col"
      style={{ height: viewportHeight }}
    >
      <h2 className="text-2xl w-full p-4 font-bold text-white bg-[#311970] mb-4">Vendor</h2>

      {/* Navigation links */}
      <nav className="space-y-1 flex-1 overflow-y-auto">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onLinkClick} // ✅ closes sidebar on mobile
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
          onClick={onLinkClick} // ✅ also closes sidebar
          className="flex items-center gap-2 px-1 py-1 rounded-lg hover:bg-[#4527a0] transition w-full text-gray-700 hover:text-white"
        >
          <ArrowLeftCircle size={20} /> Exit
        </Link>

        <button
          onClick={() => {
            handleLogout();
            onLinkClick?.(); // ✅ optional chaining
          }}
          className="flex items-center gap-2 px-1 py-1 rounded-lg hover:bg-[#4527a0] transition w-full text-gray-700 hover:text-white"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}
