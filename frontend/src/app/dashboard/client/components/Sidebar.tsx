"use client";

import {
  Home,
  Calendar,
  MessageSquare,
  Users,
  CheckSquare,
  CreditCard,
  LogOut,
  ArrowLeftCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext"; // 👈 use context

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAppContext(); // 👈 get logout from context

  const handleLogout = () => {
    logout(); // clear user/session from context
    router.push("/"); // 👈 redirect to home
    onClose(); // close sidebar if mobile
  };

  const handleExit = () => {
    router.push("/vendors"); // 👈 redirect to /vendors
    onClose(); // close sidebar if mobile
  };

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

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 h-screen bg-[#311970] text-white flex-col">
        <div className="px-6 py-6 text-2xl font-bold">Wedpine</div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 overflow-y-auto">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  active ? "bg-[#4527a0]" : "hover:bg-[#4527a0]"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Exit + Logout */}
        <div className="px-4 py-6 space-y-2">
          <button
            onClick={handleExit} // 👈 exit handler
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#4527a0] transition w-full"
          >
            <ArrowLeftCircle size={20} /> Exit
          </button>

          <button
            onClick={handleLogout} // 👈 logout handler
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#4527a0] transition w-full"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />

          {/* Sidebar content */}
          <aside className="relative bg-[#311970] text-white w-64 h-screen shadow-lg flex flex-col">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-md hover:bg-[#4527a0]"
              aria-label="Close sidebar"
            >
              <X size={24} />
            </button>

            <div className="px-6 py-6 text-2xl font-bold">Wedpine</div>

            <nav className="flex-1 px-4 overflow-y-auto">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={onClose} // 👈 close sidebar on link click
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg transition ${
                      active ? "bg-[#4527a0]" : "hover:bg-[#4527a0]"
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="px-2 py-4 text-sm space-y-1">
              <button
                onClick={handleExit} // 👈 exit handler closes sidebar
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#4527a0] transition w-full"
              >
                <ArrowLeftCircle size={20} /> Exit
              </button>

              <button
                onClick={handleLogout} // 👈 logout handler closes sidebar
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#4527a0] transition w-full"
              >
                <LogOut size={20} /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
