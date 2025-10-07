"use client";

import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

export default function StatsCards() {
  const {
    bookings,
    clientProfile,
    fetchClientBookings,
    fetchClientProfile,
  } = useAppContext();

  // Fetch data on mount
  useEffect(() => {
    fetchClientBookings();
    fetchClientProfile();
  }, []);

  const totalBookings = bookings?.length || 0;

  const completedTasks =
    clientProfile?.checklist?.filter((t: any) => t.done)?.length || 0;
  const totalTasks = clientProfile?.checklist?.length || 0;

  const budgetUsed = clientProfile?.budget?.used || 0;
  const budgetTotal = clientProfile?.budget?.total || 0;

  const guestsConfirmed =
    clientProfile?.guests?.filter((g: any) => g?.status === "RSVP")?.length ||
    0;
  const totalGuests = clientProfile?.guests?.length || 0;

  const stats = [
    { label: "Total Bookings", value: totalBookings, color: "border-blue-500" },
    {
      label: "Tasks Completed",
      value: `${completedTasks} / ${totalTasks}`,
      color: "border-green-500",
    },
    {
      label: "Budget Used",
      value: `Ksh${budgetUsed.toLocaleString()} / Ksh${budgetTotal.toLocaleString()}`,
      color: "border-purple-500",
    },
    {
      label: "Guests RSVP’d",
      value: `${guestsConfirmed} / ${totalGuests}`,
      color: "border-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 w-full md:grid-cols-4 gap-3 mt-1">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`p-4 rounded-xl shadow bg-white border-t-4 ${s.color}`}
        >
          <h3 className="text-xs font-medium text-gray-600">{s.label}</h3>
          <p className="text-sm font-bold mt-1 text-gray-900">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
