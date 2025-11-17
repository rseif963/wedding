"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { CalendarCheck, MessageSquare, Star } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function VendorStatsCards() {
  const {
    bookings,
    messages,
    reviews,
    vendorProfile,
    fetchVendorBookings,
    fetchMessages,
    fetchReviewsForVendor,
  } = useAppContext();

  // Fetch vendor data once vendorProfile loads
  useEffect(() => {
    if (!vendorProfile?._id) return;

    fetchVendorBookings();
    fetchMessages();
    fetchReviewsForVendor(vendorProfile._id);
  }, [vendorProfile?._id]);

  const stats = [
    {
      label: "Requests",
      value: bookings?.length || 0,
      icon: CalendarCheck,
      href: "/vdashboard/vendor/bookings",
    },
    {
      label: "Messages",
      value: messages?.length || 0,
      icon: MessageSquare,
      href: "/vdashboard/vendor/messages",
    },
    {
      label: "Reviews",
      value: reviews?.length || 0,
      icon: Star,
      href: "/vdashboard/vendor/reviews",
    },
  ];

  return (
    <div className="grid grid-cols-3 px-2 py-2 md:grid-cols-3 gap-2">
      {stats.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="bg-[#eee] p-2 rounded-lg shadow flex items-center justify-between hover:shadow-md transition"
        >
          <item.icon className="hidden w-6 h-6 text-[#311970]" />
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-gray-600">{item.label}</h3>
            <p className="text-lg font-bold text-[#311970]">{item.value}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
