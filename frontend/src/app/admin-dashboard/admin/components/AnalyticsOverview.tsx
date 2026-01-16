"use client";

import React, { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PURPLE = "#311970";

/* ---------------- HELPERS ---------------- */

const groupByMonth = (dates: string[]) => {
  const map: Record<string, number> = {};

  dates.forEach((date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return;

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map[key] = (map[key] || 0) + 1;
  });

  return Object.entries(map)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime()) // ✅ oldest → newest
    .map(([key, count]) => {
      const d = new Date(key + "-01");
      return {
        month: d.toLocaleString("default", { month: "short", year: "numeric" }),
        count,
      };
    });
};

const CATEGORY_COLORS = [
  "#311970",
  "#4b2ea6",
  "#6b4ccf",
  "#8b6ee8",
  "#b9a7f3",
  "#d6ccfa",
];


/* ---------------- COMPONENT ---------------- */

export default function AdminAnalytics() {
  const {
    vendors = [],
    clients = [],
    posts = [],
    fetchVendors,
    fetchClients,
    fetchPosts,
  } = useAppContext();

  useEffect(() => {
    fetchVendors();
    fetchClients();
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- NORMALIZED DATA ---------------- */

  // ✅ CLIENTS → guaranteed string[]
  const clientDates: string[] = clients
    .filter((c): c is { createdAt: string } => Boolean(c?.createdAt))
    .map((c) => c.createdAt);

  const clientGrowth = groupByMonth(clientDates);

  // ✅ VENDORS → SAME FIX (this removes the red line)
  const vendorDates: string[] = vendors
    .filter((v): v is { createdAt: string } => Boolean(v?.createdAt))
    .map((v) => v.createdAt);

  const vendorGrowth = groupByMonth(vendorDates);

  // ✅ CATEGORY DATA FROM POSTS
  const categoryMap: Record<string, number> = {};

  posts.forEach((post) => {
    const category = post.vendor?.category;
    if (!category) return;

    categoryMap[category] = (categoryMap[category] || 0) + 1;
  });

  const categoryData = Object.entries(categoryMap).map(
    ([name, value], index) => ({
      name,
      value,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    })
  );



  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-8">
      {/* VENDORS GROWTH */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold mb-1">Vendors Growth</h3>
        <p className="text-sm text-gray-500 mb-4">
          Vendor registrations per month
        </p>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={vendorGrowth}>
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke={PURPLE}
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* CLIENTS GROWTH */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold mb-1">Clients Growth</h3>
        <p className="text-sm text-gray-500 mb-4">
          Client registrations per month
        </p>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={clientGrowth}>
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke={PURPLE}
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* CATEGORY PIE */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold mb-1">Vendors by Category</h3>
        <p className="text-sm text-gray-500 mb-4">
          Based on vendor posts
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
            >
              {categoryData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {categoryData.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span>{cat.name}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
