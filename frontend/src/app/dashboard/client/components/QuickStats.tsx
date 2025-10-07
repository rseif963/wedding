"use client";

import { Users, Calendar, Wallet, CheckSquare } from "lucide-react";

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
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

export default function QuickStats({ wedding, checklistCount, completedCount, bookingsCount }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard title="Guests" value={wedding.guestsCount} icon={<Users size={20} />} />
      <StatCard title="Bookings" value={bookingsCount} icon={<Calendar size={20} />} />
      <StatCard
        title="Budget"
        value={`${wedding.currency} ${wedding.budget.toLocaleString()}`}
        icon={<Wallet size={20} />}
      />
      <StatCard
        title="Checklist Progress"
        value={`${Math.round((completedCount / checklistCount) * 100)}%`}
        icon={<CheckSquare size={20} />}
      />
    </div>
  );
}
