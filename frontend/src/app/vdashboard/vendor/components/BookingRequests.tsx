"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

type Props = {
  preview?: boolean;
};

export default function BookingRequests({ preview = false }: Props) {
  const {
    bookings = [],
    fetchClientBookings,
    fetchVendorBookings,
    respondBooking,
    role,
  } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false); // ✅ track first successful fetch
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      if (role === "vendor" && typeof fetchVendorBookings === "function") {
        await fetchVendorBookings();
      } else if (role === "client" && typeof fetchClientBookings === "function") {
        await fetchClientBookings();
      } else if (typeof fetchClientBookings === "function") {
        await fetchClientBookings();
      }
      setHasFetched(true); // ✅ mark that at least one fetch finished
    } catch (err) {
      console.error("Failed to load bookings:", err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [role, fetchClientBookings, fetchVendorBookings]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const safeId = (req: any) => req?._id ?? req?.id ?? "";

  const getClientName = (req: any) => {
    const client = req?.client;
    if (!client) return "Unknown Client";
    if (typeof client === "string") return client;
    return (
      client.name ??
      client.fullName ??
      client.clientName ??
      (client.user && (client.user.name || client.user.email)) ??
      client.email ??
      "Client"
    );
  };

  const getServiceName = (req: any) => {
    const s = req?.service;
    if (!s) return "Service";
    if (typeof s === "string") return s;
    return s.name ?? s.title ?? "Service";
  };

  const getDateString = (req: any) => {
    if (!req?.date) return "-";
    const d = new Date(req.date);
    if (Number.isNaN(d.getTime())) return req.date;
    return d.toLocaleDateString();
  };

  const onRespond = async (bookingId: string, status: "Accepted" | "Declined") => {
    if (!bookingId) {
      toast.error("Invalid booking id");
      return;
    }
    setActionLoading((s) => ({ ...s, [bookingId]: true }));
    try {
      await respondBooking(bookingId, status);
      await loadBookings();
      toast.success(`Booking ${status.toLowerCase()}`);
    } catch (err) {
      console.error("Failed to respond to booking:", err);
      toast.error("Could not update booking");
    } finally {
      setActionLoading((s) => ({ ...s, [bookingId]: false }));
    }
  };

  const visibleRequests = preview ? bookings.slice(0, 1) : bookings;

  return (
    <section className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Requests</h2>

      {loading && !hasFetched ? ( // ✅ only show loading before first fetch
        <p className="text-gray-500">Loading bookings...</p>
      ) : !loading && hasFetched && visibleRequests.length === 0 ? ( // ✅ only show "no bookings" after fetch
        <p className="text-gray-500">No booking requests yet.</p>
      ) : (
        <ul className="space-y-4">
          {visibleRequests.map((req: any) => {
            const id = safeId(req);
            const status = req?.status ?? "Pending";

            return (
              <li
                key={id || Math.random()}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <p className="font-medium text-gray-700">{getClientName(req)}</p>
                  <p className="text-sm text-gray-500">
                    {getServiceName(req)} • {getDateString(req)}
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
                </div>

                {!preview && role === "vendor" && status === "Pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onRespond(id, "Accepted")}
                      disabled={!id || !!actionLoading[id]}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                    >
                      {actionLoading[id] ? "..." : "Accept"}
                    </button>

                    <button
                      onClick={() => onRespond(id, "Declined")}
                      disabled={!id || !!actionLoading[id]}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                    >
                      {actionLoading[id] ? "..." : "Decline"}
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
