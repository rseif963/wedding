"use client";

import { useEffect } from "react";
import { Users, Calendar, Wallet, CheckSquare } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-md bg-[#311970] text-white flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
  );
}

export default function QuickStats() {
  const { clientProfile, fetchClientAll, fetchClientBookings, bookings } = useAppContext();

  // Fetch all client-related data on mount
  useEffect(() => {
    fetchClientBookings(); // bookings
    fetchClientAll(); // profile, guests, tasks/checklist, budget
  }, []);

  // Safely compute values
  const guestsCount = clientProfile?.guests?.length || 0;
  const bookingsCount = bookings?.length || 0;

  const budgetAmount = clientProfile?.budget?.plannedAmount || 0;
  const currency = clientProfile?.budget || "Ksh"; // fallback currency

  const checklistCount = clientProfile?.tasks?.length || 0;
  const completedCount =
    clientProfile?.tasks?.filter((t: any) => t.completed)?.length || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard title="Guests" value={guestsCount} icon={<Users size={20} />} />
      <StatCard title="Bookings" value={bookingsCount} icon={<Calendar size={20} />} />
      <StatCard
        title="Budget"
        value={`${currency} ${budgetAmount.toLocaleString()}`}
        icon={<Wallet size={20} />}
      />
      <StatCard
        title="Checklist Progress"
        value={
          checklistCount > 0
            ? `${Math.round((completedCount / checklistCount) * 100)}%`
            : "0%"
        }
        icon={<CheckSquare size={20} />}
      />
    </div>
  );
}
