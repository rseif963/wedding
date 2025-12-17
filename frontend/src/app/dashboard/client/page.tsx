"use client";

import { useEffect, useState } from "react";
import { Calendar, Menu } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import StatsCards from "./components/StatsCards";
import Bookings from "./components/Bookings";
import BudgetTracker from "./components/BudgetTracker";
import Messages from "./components/Messages";
import GuestList from "./components/GuestList";


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
export default function ClientDashboard() {
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

  const weddingDate = clientProfile.weddingDate
    ? new Date(clientProfile.weddingDate).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : "";


  return (
    <div className="min-h-screen absolute inset-0 bg-gradient-to-b from-[#f4f1ff] via-[#faf9ff] to-white">
      <div className="relative px-6 pt-6 pb-14 mt-20 text-center">
        {/* Mobile menu */}
        
        {/* Welcome */}
        <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">
          Welcome back
        </p>

        {/* Names */}
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#1f1b2e] mb-3">
          {brideFirst} &amp; {groomFirst}
        </h1>

        {/* Date */}
        {weddingDate && (
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-10">
            <Calendar size={16} />
            <span>{weddingDate}</span>
          </div>
        )}

        {/* Countdown */}
        {timeLeft && (
          <div className="mx-auto max-w-md bg-white rounded-3xl shadow-lg px-8 py-6">
            <div className="grid grid-cols-4 gap-6 text-center">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((item, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-bold text-[#2f1c6b]">
                    {item.value}
                  </div>
                  <div className="text-xs uppercase tracking-wide text-gray-500 mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto">
          <StatsCards />
          <div className="w-full">
            <GuestList />
          </div>
        </main>
      </div>
    </div>
  );
}
