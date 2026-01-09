"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { CheckCircle, Clock, XCircle } from "lucide-react";

type RSVP = "attending" | "pending" | "declined" | "" | null | undefined;

export default function GuestListPreview() {
  const { clientProfile } = useAppContext();

  const guests = Array.isArray(clientProfile?.guests)
    ? (clientProfile.guests as any[])
    : [];

  const normalized = (r: RSVP) => (r ? r.toLowerCase() : "");

  const statusStyle = (rsvp: RSVP) => {
    const r = normalized(rsvp);
    return r === "attending"
      ? "bg-green-100 text-green-700"
      : r === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-gray-100 text-gray-500";
  };

  const statusLabel = (rsvp: RSVP) => {
    const r = normalized(rsvp);
    return r === "attending"
      ? "Attending"
      : r === "pending"
        ? "Pending"
        : "Declined";
  };

  // Take only 5 most recent guests
  const recentGuests = useMemo(() => {
    return [...guests]
      .sort((a, b) => {
        const idA = String(a._id ?? a.id ?? "");
        const idB = String(b._id ?? b.id ?? "");
        return idB.localeCompare(idA); // newest first
      })
      .slice(0, 5);
  }, [guests]);

  if (!recentGuests.length) return null;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <h3 className="font-semibold text-lg mb-4">Guest List</h3>
      <ul className="space-y-3">
        {recentGuests.map((g, i) => {
          const id = String(g._id ?? g.id ?? i);
          return (
            <li key={id} className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-medium">{g.name}</span>
                <span className="text-gray-500 text-sm">
                  {g.email || g.phone || "—"}
                </span>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusStyle(
                  g.rsvp
                )}`}
              >
                {g.rsvp === "attending" && <CheckCircle size={14} />}
                {g.rsvp === "pending" && <Clock size={14} />}
                {g.rsvp === "declined" && <XCircle size={14} />}
                {statusLabel(g.rsvp)}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 text-right">
        <Link
          href="/dashboard/client/guestlist"
          className="text-sm text-[#311970] font-medium hover:underline"
        >
          More &rarr;
        </Link>
      </div>
    </div>
  );
}
