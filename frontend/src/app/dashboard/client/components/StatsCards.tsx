"use client";

import { useEffect } from "react";
import { Users, CheckSquare, DollarSign, CalendarClock } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function StatsCards() {
  const {
    bookings,
    clientProfile,
    fetchClientBookings,
    fetchClientAll,
  } = useAppContext();

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

  // Guests
  const guests: any[] = Array.isArray(clientProfile?.guests)
    ? clientProfile.guests
    : [];
  const attendingGuests = guests.filter(
    (g) => g.rsvp?.toLowerCase() === "attending"
  ).length;
  const totalGuests = guests.length;

  const stats = [
    {
      label: "Total Bookings",
      value: bookings?.length || 0,
      icon: <Users className="w-4 h-4 text-white" />,
      color: "bg-blue-500",
    },
    {
      label: "Tasks Completed",
      value: `${completedTasks} / ${totalTasks}`,
      icon: <CheckSquare className="w-4 h-4 text-white" />,
      color: "bg-green-500",
    },
    {
      label: "Budget Used",
      value: `Ksh${budgetUsed.toLocaleString()} / Ksh${budgetTotal.toLocaleString()}`,
      icon: <DollarSign className="w-4 h-4 text-white" />,
      color: "bg-purple-500",
    },
    {
      label: "Guests Attending",
      value: `${attendingGuests} / ${totalGuests}`,
      icon: <CalendarClock className="w-4 h-4 text-white" />,
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-2 w-full mt-2">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`p-5 rounded-2xl shadow-lg relative overflow-hidden bg-white flex flex-col`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${s.color}`}>
            {s.icon}
          </div>
          <span className="text-sm text-gray-500 uppercase tracking-wide mt-2">
            {s.label}
          </span>
          <p className="text-sm md:text-1xl font-bold text-gray-900 mt-1">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
