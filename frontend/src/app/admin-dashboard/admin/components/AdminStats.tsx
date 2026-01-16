"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Store,
  CreditCard,
  TrendingUp,
  FileText,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const percentChange = (current: number, previous: number) => {
  if (previous === 0) return Math.min(100, current > 0 ? 100 : 0);
  return Math.min(100, Math.round(((current - previous) / previous) * 100));
};

export default function AdminStats() {
  const [stats, setStats] = useState<{
    clients: number;
    clientsLastMonth: number;
    vendors: number;
    vendorsLastMonth: number;
    totalPosts: number;
    totalPostsLastMonth: number;
    monthlyEarnings: number;
    monthlyEarningsLastMonth: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  const { vendors = [], clients = [], posts = [], fetchVendors, fetchClients, fetchPosts } =
    useAppContext();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchVendors(), fetchClients(), fetchPosts()]);

        // calculate stats
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const calcCount = (items: any[]) => ({
          thisMonth: items.filter(
            (i) =>
              i.createdAt &&
              new Date(i.createdAt).getFullYear() === now.getFullYear() &&
              new Date(i.createdAt).getMonth() === now.getMonth()
          ).length,
          lastMonth: items.filter(
            (i) =>
              i.createdAt &&
              new Date(i.createdAt).getFullYear() === lastMonth.getFullYear() &&
              new Date(i.createdAt).getMonth() === lastMonth.getMonth()
          ).length,
          total: items.length,
        });

        const vendorStats = calcCount(vendors);
        const clientStats = calcCount(clients);
        const postStats = calcCount(posts);

        setStats({
          vendors: vendorStats.total,
          vendorsLastMonth: vendorStats.lastMonth,
          clients: clientStats.total,
          clientsLastMonth: clientStats.lastMonth,
          totalPosts: postStats.total,
          totalPostsLastMonth: postStats.lastMonth,
          monthlyEarnings: 0, // keep as 0
          monthlyEarningsLastMonth: 0,
        });
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !stats) {
    return <div className="text-center text-gray-500">Loading stats...</div>;
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
      change: percentChange(stats.monthlyEarnings, stats.monthlyEarningsLastMonth),
      icon: TrendingUp,
    },
    {
      title: "Blog Posts",
      value: stats.totalPosts.toLocaleString(),
      change: percentChange(stats.totalPosts, stats.totalPostsLastMonth),
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
            <div className="h-1 bg-[#311970]" />

            <div className="px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                <p className="text-3xl font-semibold text-gray-900">{card.value}</p>
                {card.change > 0 && card.title !== "Active Subscriptions" && card.title !== "Monthly Revenue" && (
                  <p
                    className={`mt-1 text-sm font-medium ${
                      isPositive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isPositive ? `+${card.change}%` : `${card.change}%`} this month
                  </p>
                )}
              </div>

              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <Icon className="text-[#311970]" size={22} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
