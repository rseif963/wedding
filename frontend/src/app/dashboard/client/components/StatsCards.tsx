"use client";

import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

export default function StatsCards() {
  const {
    bookings,
    clientProfile,
    fetchClientBookings,
    fetchClientAll, // fetch profile + guests + tasks + budget
    fetchClientProfile, // optional, if you need basic profile separately
  } = useAppContext();

  // Fetch all client data on mount
  useEffect(() => {
    fetchClientBookings(); // bookings
    fetchClientAll(); // profile, checklist/tasks, guests, budget
    fetchClientProfile(); // basic profile if needed
  }, []);

  // Safely handle tasks/checklist
  const completedTasks =
    clientProfile?.tasks?.filter((t: any) => t.completed)?.length || 0;
  const totalTasks = clientProfile?.tasks?.length || 0;

  // Budget
  const budgetUsed =
    clientProfile?.budget?.items?.reduce((sum: number, item: any) => {
      return sum + (item.paid ? item.cost : 0);
    }, 0) || 0;
  const budgetTotal = clientProfile?.budget?.plannedAmount || 0;

  // Guests
  const guestsConfirmed =
    clientProfile?.guests?.filter((g: any) => g?.status === "RSVP")?.length || 0;
  const totalGuests = clientProfile?.guests?.length || 0;

  // Stats array
  const stats = [
    { label: "Total Bookings", value: bookings?.length || 0, color: "border-blue-500" },
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
