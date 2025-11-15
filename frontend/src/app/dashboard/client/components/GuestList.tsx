"use client";

import { useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  MoreVertical,
} from "lucide-react";

// RSVP types your DB uses
type RSVP = "attending" | "pending" | "declined" | "" | null | undefined;

interface Guest {
  _id?: string;
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  rsvp?: RSVP;
}

type FilterKey = "all" | "attending" | "pending" | "declined";

export default function GuestList() {
  const { clientProfile, addGuest, updateGuest, fetchClientAll } =
    useAppContext();

  const guests: Guest[] = Array.isArray(clientProfile?.guests)
    ? (clientProfile!.guests as Guest[])
    : [];

  const [filter, setFilter] = useState<FilterKey>("all");

  const [newGuest, setNewGuest] = useState<Guest>({
    name: "",
    phone: "",
    email: "",
    rsvp: "pending",
  });


  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const normalized = (r: RSVP) => (r ? r.toLowerCase() : "");

  const counts = useMemo(() => {
    const acc = { all: guests.length, attending: 0, pending: 0, declined: 0 };
    guests.forEach((g) => {
      const r = normalized(g.rsvp);
      if (r === "attending") acc.attending++;
      else if (r === "pending") acc.pending++;
      else if (r === "declined") acc.declined++;
    });
    return acc;
  }, [guests]);

  const filteredGuests = useMemo(() => {
    if (filter === "all") return guests;
    return guests.filter((g) => normalized(g.rsvp) === filter);
  }, [guests, filter]);

  const statusStyle = (rsvp: RSVP) => {
    const r = normalized(rsvp);
    return r === "attending"
      ? "bg-green-100 text-green-700"
      : r === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : r === "declined"
          ? "bg-red-100 text-red-700"
          : "bg-gray-100 text-gray-600";
  };

  const statusLabel = (rsvp: RSVP) => {
    const r = normalized(rsvp);
    return r === "attending"
      ? "Confirmed"
      : r === "pending"
        ? "Pending"
        : r === "declined"
          ? "Declined"
          : "Unknown";
  };

  const handleAdd = async () => {
    if (!newGuest.name.trim()) return;

    await addGuest({
      name: newGuest.name,
      phone: newGuest.phone,
      email: newGuest.email,
      // ✅ TS knows this exists
    });


    setNewGuest({ name: "", phone: "", email: "", rsvp: "pending" });

    try {
      await fetchClientAll();
    } catch { }
  };

  const TabButton = ({
    label,
    Icon,
    value,
    count,
  }: {
    label: string;
    Icon: any;
    value: FilterKey;
    count: number;
  }) => {
    const active = filter === value;
    return (
      <button
        onClick={() => setFilter(value)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition
        ${active
            ? "bg-black text-white border-black shadow"
            : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
      >
        <Icon size={16} />
        {label} ({count})
      </button>
    );
  };

  const safeUpdateGuest = async (guestId: string, update: Partial<Guest>) => {
    try {
      await (
        updateGuest as unknown as (id: string, u: any) => Promise<any>
      )(guestId, update);

      if (fetchClientAll) await fetchClientAll();
    } catch (err) {
      console.error("safeUpdateGuest error:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Guest List</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <TabButton label="All" Icon={Users} value="all" count={counts.all} />
        <TabButton
          label="Confirmed"
          Icon={CheckCircle}
          value="attending"
          count={counts.attending}
        />
        <TabButton label="Pending" Icon={Clock} value="pending" count={counts.pending} />
        <TabButton
          label="Declined"
          Icon={XCircle}
          value="declined"
          count={counts.declined}
        />
      </div>

      {/* Add guest */}
      <div className="mb-6 p-4 border rounded-xl bg-gray-50">
        <h3 className="font-semibold text-gray-800 mb-3">Add New Guest</h3>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            type="text"
            placeholder="Guest name"
            value={newGuest.name}
            onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
            className="p-2 border rounded-lg"
          />

          <input
            type="text"
            placeholder="Phone (optional)"
            value={newGuest.phone}
            onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
            className="p-2 border rounded-lg"
          />

          <input
            type="email"
            placeholder="Email (optional)"
            value={newGuest.email}
            onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
            className="p-2 border rounded-lg"
          />

          <select
            value={newGuest.rsvp || "pending"}
            onChange={(e) =>
              setNewGuest({ ...newGuest, rsvp: e.target.value as RSVP })
            }
            className="p-2 border rounded-lg"
          >
            <option value="pending">Pending</option>
            <option value="attending">Confirmed</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        <button
          onClick={handleAdd}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          <Plus size={16} /> Add Guest
        </button>
      </div>

      {/* Guest list */}
      <ul className="space-y-3">
        {filteredGuests.length ? (
          filteredGuests.map((g, i) => {
            const id = String(g._id ?? g.id ?? `guest-${i}`);

            return (
              <li
                key={id}
                className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition"
              >
                <div>
                  <div className="font-semibold">{g.name}</div>
                  {g.phone && (
                    <div className="text-xs text-gray-500">{g.phone}</div>
                  )}
                  {g.email && (
                    <div className="text-xs text-gray-500">{g.email}</div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${statusStyle(
                      g.rsvp
                    )}`}
                  >
                    {statusLabel(g.rsvp)}
                  </span>

                  <div className="relative">
                    <button
                      className="p-2 hover:bg-gray-100 rounded-full"
                      onClick={() =>
                        setOpenMenu(openMenu === id ? null : id)
                      }
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openMenu === id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
                        <button
                          onClick={async () => {
                            await safeUpdateGuest(id, { rsvp: "attending" });
                            setOpenMenu(null);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          Confirmed
                        </button>

                        <button
                          onClick={async () => {
                            await safeUpdateGuest(id, { rsvp: "pending" });
                            setOpenMenu(null);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          Pending
                        </button>

                        <button
                          onClick={async () => {
                            await safeUpdateGuest(id, { rsvp: "declined" });
                            setOpenMenu(null);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-red-600"
                        >
                          Declined
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <p className="text-center text-sm text-gray-500 py-4">
            No guests found for this filter.
          </p>
        )}
      </ul>
    </div>
  );
}
