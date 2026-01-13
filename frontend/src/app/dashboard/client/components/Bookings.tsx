"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Calendar, DollarSign } from "lucide-react";
import Image from "next/image";

export default function Bookings() {
  const {
    bookings,
    fetchClientBookings,
    posts,
    fetchPosts,
  } = useAppContext();

  const router = useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  // ✅ SAME getFullUrl LOGIC AS FEATURED VENDORS (SAFE)
  const getFullUrl = (path?: any) => {
    if (typeof path !== "string") {
      return "/assets/vendor-placeholder.png";
    }

    const cleaned = path.trim();

    if (!cleaned || cleaned === "undefined" || cleaned === "null") {
      return "/assets/vendor-placeholder.png";
    }

    if (cleaned.startsWith("http")) {
      return cleaned;
    }

    return `${API_URL}${cleaned}`;
  };

  const getDateString = (booking: any) => {
    if (!booking?.date) return "-";
    const d = new Date(booking.date);
    return Number.isNaN(d.getTime())
      ? booking.date
      : d.toLocaleDateString();
  };


  useEffect(() => {
    fetchClientBookings();
    fetchPosts(); // ✅ REQUIRED to access post.mainPhoto
  }, [fetchClientBookings, fetchPosts]);

  return (
    <div className="bg-white w-full h-[95vh] overflow-y-auto px-3 ">
      {/* Header */}
      <div className="mb-6 py-3">
        <h2 className="font-display text-3xl font-semibold text-[#311970]">
          Your Bookings
        </h2>
        <p className="text-gray-500">
          Manage your wedding vendors and services
        </p>
      </div>

      {/* Empty State */}
      {!bookings || bookings.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          No bookings yet
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
          {[...bookings]
            .sort((a, b) => String(b._id).localeCompare(String(a._id))) // ✅ NEWEST FIRST
            .map((booking: any) => {
              const v =
                typeof booking.vendor === "object"
                  ? booking.vendor
                  : null;

              // 🔑 FIND THE RELATED POST
              const post = posts?.find(
                (p: any) => String(p._id) === String(booking.post)
              );

              // ✅ YOUR REQUESTED PRIORITY
              const imageUrl = getFullUrl(
                post?.mainPhoto || v?.profilePhoto || v?.logo
              );

              // Price from post first, fallback to booking
              const price = post?.priceFrom ?? booking.price ?? 0;


              // Booking date
              const bookingDate = booking.eventDate
                ? new Date(booking.eventDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
                : "Date not set";

              return (
                <div
                  key={booking._id}
                  className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition"
                >
                  {/* IMAGE */}
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={imageUrl}
                      alt={v?.businessName || "Vendor"}
                      fill
                      className="object-cover"
                    />

                    {/* STATUS BADGE */}
                    <span
                      className={`absolute top-4 right-4 px-3 py-1 text-xs font-medium rounded-full
                        ${booking.status === "Accepted"
                          ? "bg-green-500 text-white"
                          : booking.status === "Pending"
                            ? "bg-yellow-400 text-white"
                            : "bg-red-500 text-white"
                        }`}
                    >
                      {booking.status === "Accepted"
                        ? "Confirmed"
                        : booking.status}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 space-y-3">
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-[#ebe9f7] text-[#311970]">
                      {v?.category || "Service"}
                    </span>

                    <h3 className="text-lg font-semibold text-[#311970] truncate">
                      {v?.businessName || "Unknown Vendor"}
                    </h3>

                    {/* DATE */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{getDateString(booking)}</span>
                    </div>


                    {/* PRICE */}
                    {/*<div className="flex items-center gap-1 text-sm text-gray-500">
                      From{" "}
                      <span className="font-semibold">
                        {price > 0 ? `Ksh ${price.toLocaleString()}` : "N/A"}
                      </span>
                    </div>*/}

                    {/* VIEW DETAILS BUTTON */}
                    {booking.status === "Accepted" && (
                      <button
                        onClick={() => {
                          const params = new URLSearchParams();
                          params.set("bookingId", booking._id);
                          router.push(`/dashboard/client/messages?${params.toString()}`);
                        }}
                        className="mt-4 w-full bg-[#311970] text-white py-3 rounded-xl font-medium hover:bg-[#4a22c6] transition"
                      >
                        Message
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
