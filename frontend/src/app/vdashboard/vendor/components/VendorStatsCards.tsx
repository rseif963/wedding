"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, MessageSquare, CalendarCheck, Star } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

type AnalyticsRow = {
  day: string; // YYYY-MM-DD
  profileViews: number;
};

export default function VendorStatsCards() {
  const {
    bookings,
    reviews,
    vendorProfile,
    fetchVendorBookings,
    fetchReviewsForVendor,
  } = useAppContext();

  const [analytics, setAnalytics] = useState<AnalyticsRow[]>([]);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    if (!vendorProfile?._id) return;

    fetchVendorBookings();
    fetchReviewsForVendor(vendorProfile._id);

    // Fetch analytics
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/api/analytics/vendor/${vendorProfile._id}`,
      { cache: "no-store" }
    )
      .then((res) => res.json())
      .then((data) => setAnalytics(Array.isArray(data) ? data : []))
      .catch(() => setAnalytics([]));
  }, [vendorProfile?._id]);

  /* ---------------- HELPERS ---------------- */
  const today = new Date();

  const isWithinDays = (dateStr: string, days: number) => {
    const d = new Date(dateStr);
    const diff = (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff < days;
  };

  /* ---------------- PROFILE VIEWS ---------------- */
  const totalProfileViews = analytics.reduce(
    (sum, a) => sum + (a.profileViews || 0),
    0
  );

  const viewsLast7Days = analytics
    .filter((a) => isWithinDays(a.day, 7))
    .reduce((s, a) => s + a.profileViews, 0);

  const viewsPrev7Days = analytics
    .filter(
      (a) => isWithinDays(a.day, 14) && !isWithinDays(a.day, 7)
    )
    .reduce((s, a) => s + a.profileViews, 0);

  const viewsChange =
    viewsPrev7Days > 0
      ? Math.round(((viewsLast7Days - viewsPrev7Days) / viewsPrev7Days) * 100)
      : viewsLast7Days > 0
        ? 100
        : 0;

  /* ---------------- INQUIRIES (UNREAD) ---------------- */
  const unreadInquiries = bookings?.filter((b: any) =>
    (b.messages || []).some((m: any) => m.sender === "Client" && !m.read)
  ).length || 0;

  const unreadThisWeek = bookings?.filter((b: any) =>
    (b.messages || []).some(
      (m: any) =>
        m.sender === "Client" &&
        !m.read &&
        isWithinDays(m.createdAt, 7)
    )
  ).length || 0;

  const unreadLastWeek = bookings?.filter((b: any) =>
    (b.messages || []).some(
      (m: any) =>
        m.sender === "Client" &&
        !m.read &&
        isWithinDays(m.createdAt, 14) &&
        !isWithinDays(m.createdAt, 7)
    )
  ).length || 0;

  const inquiriesChange =
    unreadLastWeek > 0
      ? Math.round(((unreadThisWeek - unreadLastWeek) / unreadLastWeek) * 100)
      : unreadThisWeek > 0
        ? 100
        : 0;

  /* ---------------- BOOKINGS ---------------- */
  const bookingsPending =
    bookings?.filter((b: any) => b.status === "Pending").length || 0;

  const allBookingsCount = bookings?.length || 0;

  const pendingBookings =
    bookings?.filter((b: any) => b.status === "Pending") || [];

  const pendingCount = pendingBookings.length;




  /* ---------------- RATINGS ---------------- */
  const rating =
    reviews?.length
      ? (
        reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
        reviews.length
      ).toFixed(1)
      : "0.0";

  /* ---------------- UI DATA ---------------- */
  const stats = [
    {
      label: "Profile Views",
      value: totalProfileViews,
      icon: Eye,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-500",
      badge: `${viewsChange >= 0 ? "+" : ""}${viewsChange}%`,
      badgeColor:
        viewsChange >= 0
          ? "bg-green-100 text-green-600"
          : "bg-red-100 text-red-600",
      href: "/vdashboard/vendor/profile",
    },
    {
      label: "Inquiries",
      value: unreadInquiries,
      icon: MessageSquare,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-500",
      badge: `${inquiriesChange >= 0 ? "+" : ""}${inquiriesChange}%`,
      badgeColor:
        inquiriesChange >= 0
          ? "bg-green-100 text-green-600"
          : "bg-red-100 text-red-600",
      href: "/vdashboard/vendor/inquiries",
    },
    {
      label: "Bookings Pending",
      value: pendingCount,
      icon: CalendarCheck,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-500",
      badge: pendingCount > 0 ? ` new` : "",
      badgeColor: "bg-yellow-200 text-yellow-700",
      href: "/vdashboard/vendor/bookings",
    },
    {
      label: "Rating",
      value: rating,
      icon: Star,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-500",
      badge: `${reviews?.length || 0} reviews`,
      badgeColor: "bg-gray-200 text-gray-600",
      href: "/vdashboard/vendor/reviews",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
      {stats.map(
        ({ label, value, icon: Icon, bgColor, iconColor, badge, badgeColor, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white p-5 rounded-xl shadow hover:shadow-md transition relative flex flex-col"
          >
            <div
              className={`w-10 h-10 rounded-md flex items-center justify-center ${bgColor} mb-4`}
            >
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>

            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              {label}
            </h3>

            <p className="text-2xl font-bold text-gray-900">{value}</p>

            {badge && (
              <span
                className={`absolute top-4 right-4 px-2 py-0.5 rounded-full text-xs font-semibold ${badgeColor}`}
              >
                {badge}
              </span>
            )}
          </Link>
        )
      )}
    </div>
  );
}
