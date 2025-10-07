"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, DollarSign, FileText } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface StatsResponse {
  vendors: number;
  clients: number;
  monthlyEarnings: number;
  totalPosts: number;
}

export default function AdminStats() {
  const [stats, setStats] = useState<StatsResponse>({
    vendors: 0,
    clients: 0,
    monthlyEarnings: 0,
    totalPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get("/api/admin/stats"); // ✅ adjust endpoint if different
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
      toast.error("Failed to load admin stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const items = [
    { label: "Vendors", value: stats.vendors, icon: <Users size={20} /> },
    { label: "Clients", value: stats.clients, icon: <UserCheck size={20} /> },
    {
      label: "Monthly Earnings",
      value: `Ksh ${stats.monthlyEarnings.toLocaleString()}`,
      icon: <DollarSign size={20} />,
    },
    { label: "Blog Posts", value: stats.totalPosts, icon: <FileText size={20} /> },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
      {loading ? (
        <p className="col-span-4 text-center text-gray-500">Loading stats...</p>
      ) : (
        items.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-lg shadow p-5 flex items-center justify-between"
          >
            <div>
              <div className="text-xs text-gray-500">{s.label}</div>
              <div className="text-1xl font-semibold text-gray-900">{s.value}</div>
            </div>
            <div className="text-[#7c4dff]">{s.icon}</div>
          </div>
        ))
      )}
    </section>
  );
}
