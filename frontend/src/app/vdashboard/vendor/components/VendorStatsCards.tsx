"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Eye, MessageSquare, CalendarCheck, Star } from "lucide-react";
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

  // Assuming you track profile views somewhere - add it here, else hardcoded for example
  const profileViews = vendorProfile?.profileViews || 0;

  // Assuming you track new bookings count
 const bookingsPending = bookings?.filter(booking => booking.status === "Pending").length || 0;

  // Assuming inquiries = messages.length
  const inquiriesCount = messages?.length || 0;

  const stats = [
    {
      label: "Profile Views",
      value: profileViews,
      icon: Eye,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-500",
      badge: "+12%",
      badgeColor: "bg-green-100 text-green-600",
      href: "/vdashboard/vendor/profile",
    },
    {
      label: "Inquiries",
      value: inquiriesCount,
      icon: MessageSquare,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-500",
      badge: "+8%",
      badgeColor: "bg-green-100 text-green-600",
      href: "/vdashboard/vendor/inquiries",
    },
    {
      label: "Bookings Pending",
      value: bookingsPending,
      icon: CalendarCheck,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-500",
      badge: "2 new",
      badgeColor: "bg-gray-200 text-gray-600",
      href: "/vdashboard/vendor/bookings",
    },
    {
      label: "Rating",
     value: reviews?.length
  ? (
      reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0) /
      reviews.length
    ).toFixed(1)
  : "0.0",

      icon: Star,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-500",
      badge: `${reviews?.length || 32} reviews`,
      badgeColor: "bg-gray-200 text-gray-600",
      href: "/vdashboard/vendor/reviews",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
      {stats.map(({ label, value, icon: Icon, bgColor, iconColor, badge, badgeColor, href }) => (
        <Link
          key={label}
          href={href}
          className="bg-white p-5 rounded-xl shadow hover:shadow-md transition relative flex flex-col"
        >
          {/* Icon circle */}
          <div className={`w-10 h-10 rounded-md flex items-center justify-center ${bgColor} mb-4`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>

          {/* Label */}
          <h3 className="text-sm font-semibold text-gray-700 mb-1">{label}</h3>

          {/* Value */}
          <p className="text-2xl font-bold text-gray-900">{value}</p>

          {/* Badge */}
          {badge && (
            <span
              className={`absolute top-4 right-4 px-2 py-0.5 rounded-full text-xs font-semibold ${badgeColor}`}
            >
              {badge}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
