"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Store,
  CreditCard,
  TrendingUp,
  FileText,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface StatsResponse {
  vendors: number;
  vendorsLastMonth: number;
  clients: number;
  clientsLastMonth: number;
  monthlyEarnings: number;
  monthlyEarningsLastMonth: number;
  totalPosts: number;
  totalPostsLastMonth: number;
}

const percentChange = (current: number, previous: number) => {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
};

export default function AdminStats() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/api/admin/stats");
        setStats(data);
      } catch {
        toast.error("Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="text-center text-gray-500">Loading stats...</div>
    );
  }

  const cards = [
    {
      title: "Total Clients",
      value: stats.clients.toLocaleString(),
      change: percentChange(stats.clients, stats.clientsLastMonth),
      icon: Users,
    },
    {
      title: "Total Vendors",
      value: stats.vendors.toLocaleString(),
      change: percentChange(stats.vendors, stats.vendorsLastMonth),
      icon: Store,
    },
    {
      title: "Active Subscriptions",
      value: "0",
      change: 0,
      icon: CreditCard,
    },
    {
      title: "Monthly Revenue",
      value: `Ksh ${stats.monthlyEarnings.toLocaleString()}`,
      change: percentChange(
        stats.monthlyEarnings,
        stats.monthlyEarningsLastMonth
      ),
      icon: TrendingUp,
    },
    {
      title: "Blog Posts",
      value: stats.totalPosts.toLocaleString(),
      change: percentChange(
        stats.totalPosts,
        stats.totalPostsLastMonth
      ),
      icon: FileText,
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isPositive = card.change >= 0;

        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* PURPLE TOP BAR */}
            <div className="h-1 bg-purple-700" />

            <div className="px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  {card.title}
                </p>

                <p className="text-3xl font-semibold text-gray-900">
                  {card.value}
                </p>
              </div>

              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <Icon className="text-purple-700" size={22} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
