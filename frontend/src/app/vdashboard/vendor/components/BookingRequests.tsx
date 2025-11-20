"use client";

import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

export default function VendorBookings() {
  const { bookings, fetchVendorBookings, respondBooking } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const loadBookings = async () => {
      try {
        setLoading(true);
        await fetchVendorBookings();
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    timeout = setTimeout(() => {
      loadBookings();
    }, 300);

    return () => clearTimeout(timeout);
  }, [fetchVendorBookings]);

  const handleBookingStatus = async (bookingId: string, status: "Accepted" | "Declined") => {
    try {
      await respondBooking(bookingId, status); // Update status in MongoDB
    } catch (err) {
      console.error(err);
      toast.error("Failed to update booking");
    }
  };

  const getClientName = (booking: any) => {
    const client = booking.client ?? booking.clientProfile ?? booking.clientData ?? {};
    const getFirst = (str?: string) => (str ? str.split(" ")[0] : "");
    if (client.brideName && client.groomName) {
      return `${getFirst(client.brideName)} & ${getFirst(client.groomName)}`;
    }
    if (client.coupleName) {
      return client.coupleName
        .split("&")
        .map((n: string) => getFirst(n.trim()))
        .join(" & ");
    }
    if (client.name) return getFirst(client.name);
    if (client.email) return client.email;
    return "Client";
  };

  const getServiceName = (booking: any) => {
    const service = booking.service;
    if (!service) return "Service";
    if (typeof service === "string") return service;
    return service.name ?? service.title ?? "Service";
  };

  const getDateString = (booking: any) => {
    if (!booking.date) return "-";
    const d = new Date(booking.date);
    if (Number.isNaN(d.getTime())) return booking.date;
    return d.toLocaleDateString();
  };

  return (
    <section className="bg-white p-6 rounded-xl w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Bookings</h2>

      {loading ? (
        <p className="text-gray-500">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((b: any) => {
            const id = b._id ?? b.id ?? Math.random().toString();
            const status = b.status ?? "Pending";

            return (
              <li
                key={id}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <p className="font-medium text-gray-700">{getClientName(b)}</p>
                  <p className="text-sm text-gray-500">
                    {getServiceName(b)} • {getDateString(b)}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      status === "Pending"
                        ? "text-yellow-600"
                        : status === "Accepted"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {status}
                  </p>

                  {/* Accept/Decline Buttons */}
                  {status === "Pending" && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleBookingStatus(b._id, "Accepted")}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleBookingStatus(b._id, "Declined")}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
