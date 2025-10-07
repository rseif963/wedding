"use client";

import Link from "next/link";
import { CalendarCheck, MessageSquare, Star } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function VendorStatsCards() {
  const { bookings, messages, reviews } = useAppContext();

  const stats = [
    { label: "Requests", value: bookings?.length || 0, icon: CalendarCheck, href: "/vdashboard/vendor/bookings" },
    { label: "Messages", value: messages?.length || 0, icon: MessageSquare, href: "/vdashboard/vendor/messages" },
    { label: "Reviews", value: reviews?.length || 0, icon: Star, href: "/vdashboard/vendor/reviews" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {stats.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="bg-white p-4 rounded-lg shadow flex items-center justify-between hover:shadow-md transition"
        >
          {/* Icon */}
          <item.icon className="w-6 h-6 text-[#311970]" />

          {/* Text & Number */}
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-gray-600">{item.label}</h3>
            <p className="text-lg font-bold text-[#311970]">{item.value}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
