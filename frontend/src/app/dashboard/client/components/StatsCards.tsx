"use client";

import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

export default function StatsCards() {
  const {
    bookings,
    clientProfile,
    fetchClientBookings,
    fetchClientAll,
  } = useAppContext();

  // Fetch all client data on mount
  useEffect(() => {
    fetchClientBookings();
    fetchClientAll();
  }, []);

  // Tasks
  const completedTasks =
    clientProfile?.tasks?.filter((t: any) => t.completed)?.length || 0;
  const totalTasks = clientProfile?.tasks?.length || 0;

  // Budget
  const budgetUsed =
    clientProfile?.budget?.items?.reduce((sum: number, item: any) => {
      return sum + (item.paid ? item.cost : 0);
    }, 0) || 0;
  const budgetTotal = clientProfile?.budget?.plannedAmount || 0;

  // Guests — following your GuestList RSVP logic
  const guests: any[] = Array.isArray(clientProfile?.guests)
    ? clientProfile.guests
    : [];

  const attendingGuests = guests.filter(
    (g) => g.rsvp?.toLowerCase() === "attending"
  ).length;

  const totalGuests = guests.length;

  const stats = [
    { label: "Total Bookings", value: bookings?.length || 0, color: "border-blue-500" },
    { label: "Tasks Completed", value: `${completedTasks} / ${totalTasks}`, color: "border-green-500" },
    {
      label: "Budget Used",
      value: `Ksh${budgetUsed.toLocaleString()} / Ksh${budgetTotal.toLocaleString()}`,
      color: "border-purple-500",
    },
    {
      label: "Guests Attending",
      value: `${attendingGuests} / ${totalGuests}`,
      color: "border-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full mt-1">
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
