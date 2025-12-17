"use client";

import { useEffect, useState } from "react";
import { Calendar, Menu, Bell } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

function getTimeLeft(targetDate: string) {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const diff = Math.max(0, target - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Header({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  const { clientProfile, fetchClientProfile } = useAppContext();
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    if (!clientProfile) fetchClientProfile();
  }, [clientProfile, fetchClientProfile]);

  useEffect(() => {
    if (!clientProfile?.weddingDate) return;

    const update = () =>
      setTimeLeft(getTimeLeft(weddingDate));

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [clientProfile?.weddingDate]);

  if (!clientProfile) return null;

  const brideFirst = clientProfile.brideName?.split(" ")[0] ?? "";
  const groomFirst = clientProfile.groomName?.split(" ")[0] ?? "";
  const brideInitial = brideFirst.charAt(0).toUpperCase();
  const groomInitial = groomFirst.charAt(0).toUpperCase();


  const weddingDate = clientProfile.weddingDate
    ? new Date(clientProfile.weddingDate).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : "";

  return (
    <header className="relative bg-gradient-to-b from-[#f4f1ff] via-[#faf9ff] to-white">
      <div className="flex items-center justify-between px-6 py-4">

        {/* Mobile Menu */}
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-black/5"
        >
          <Menu size={22} />
        </button>

        {/* Spacer (keeps layout balanced) */}
        <div />

        {/* Right Side: Notifications + Initials */}
        <div className="flex items-center gap-4">

          {/* Notifications */}
          <div className="relative">
            <Bell size={20} className="text-gray-700" />
            <span className="absolute -top-1 -right-1 block w-2 h-2 bg-purple-600 rounded-full" />
          </div>

          {/* Couple Initials */}
          <div className="w-8 h-8 rounded-full bg-[#311970] flex items-center justify-center shadow-md">
            <span className="text-white font-semibold text-sm tracking-wide">
              {brideInitial}
              {groomInitial}
            </span>
          </div>

        </div>
      </div>
    </header>

  );
}
