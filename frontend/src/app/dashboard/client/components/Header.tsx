// components/Header.tsx
"use client";

import { useEffect } from "react";
import { Bell, Link, Menu } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function Header({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  const { clientProfile, fetchClientProfile } = useAppContext();

  // Ensure profile is loaded when header mounts
  useEffect(() => {
    if (!clientProfile) {
      fetchClientProfile();
    }
  }, [clientProfile, fetchClientProfile]);

  if (!clientProfile) {
    return (
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <h1 className="text-xl font-bold text-[#311970]">Loading…</h1>
      </header>
    );
  }

  // Extract details
  const brideName = clientProfile?.brideName || "";
  const groomName = clientProfile?.groomName || "";
  const weddingDate = clientProfile?.weddingDate || "";

  const brideFirst = brideName.split(" ")[0] || "";
  const groomFirst = groomName.split(" ")[0] || "";

  // Days to go
  let diffDays: number | null = null;
  if (weddingDate) {
    const wedding = new Date(weddingDate);
    if (!isNaN(wedding.getTime())) {
      const today = new Date();
      const diffTime = wedding.getTime() - today.getTime();
      diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
  }

  return (
    <header className="bg-white px-6 py-4 shadow flex items-center justify-between">
      {/* Left: Hamburger + Names */}
      <div className="flex items-center gap-3">
        {/* Hamburger menu (mobile only) */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>

        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-[#311970]">
            {brideFirst} & {groomFirst}
          </h1>

          {/* Countdown below names on small screens */}
          {diffDays !== null && (
            <p className="block sm:hidden text-gray-600 text-sm">
              {diffDays} days to go 🎉
            </p>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        {diffDays !== null && (
          <p className="hidden sm:block text-gray-700 font-medium">
            {diffDays} days to go 🎉
          </p>
        )}
        {/*<button className="relative text-gray-600 hover:text-[#311970]">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>*/}
      </div>
    </header>
  );
}
