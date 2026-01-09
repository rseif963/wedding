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
  UserPlus,
} from "lucide-react";

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
  const {
    clientProfile,
    addGuest,
    updateGuest,
    deleteGuest,
    fetchClientAll,
  } = useAppContext();

  const guests: Guest[] = Array.isArray(clientProfile?.guests)
    ? (clientProfile!.guests as Guest[])
    : [];

  const [filter, setFilter] = useState<FilterKey>("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const [newGuest, setNewGuest] = useState<Guest>({
    name: "",
    phone: "",
    email: "",
    rsvp: "pending",
  });


  const normalized = (r: RSVP) => (r ? r.toLowerCase() : "");

  const counts = useMemo(() => {
    const acc = { attending: 0, pending: 0, declined: 0 };
    guests.forEach((g) => {
      const r = normalized(g.rsvp);
      if (r === "attending") acc.attending++;
      else if (r === "pending") acc.pending++;
      else if (r === "declined") acc.declined++;
    });
    return acc;
  }, [guests]);

  const filteredGuests = useMemo(() => {
    let list = guests;
    if (filter !== "all") {
      list = guests.filter((g) => normalized(g.rsvp) === filter);
    }

    // Sort newest first
    return [...list].sort((a, b) => {
      const idA = String(a._id ?? a.id ?? "");
      const idB = String(b._id ?? b.id ?? "");
      return idB.localeCompare(idA); // newest on top
    });
  }, [guests, filter]);

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

  const safeUpdateGuest = async (guestId: string, update: Partial<Guest>) => {
    try {
      await (updateGuest as any)(guestId, update);
      await fetchClientAll();
    } catch (err) {
      console.error(err);
    }
  };

  const safeDeleteGuest = async (guestId: string, guestName: string) => {
    if (!confirm(`Delete guest ${guestName}?`)) return;
    try {
      await (deleteGuest as any)(guestId);
      await fetchClientAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!newGuest.name.trim()) return;

    if (editingGuest) {
      await safeUpdateGuest(
        String(editingGuest._id ?? editingGuest.id),
        newGuest
      );
    } else {
      await addGuest(newGuest);
      await fetchClientAll();
    }

    setShowModal(false);
    setEditingGuest(null);
    setNewGuest({ name: "", phone: "", email: "", rsvp: "pending" });
  };

  return (
    <div className="bg-gray-50 p-2 md:px-6 rounded-2xl h-[100vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold">Guest List</h2>
          <p className="text-sm text-gray-500">
            Manage your wedding guests and RSVPs
          </p>
        </div>

        <button
          onClick={() => {
            setEditingGuest(null);
            setNewGuest({ name: "", phone: "", email: "", rsvp: "pending" });
            setShowModal(true);
          }}
          className="
    flex items-center gap-2 mt-2
    bg-[#311970] text-white font-medium
    px-3 py-2 text-sm rounded-lg
    md:px-5 md:py-3 md:text-base md:rounded-xl
  "
        >
          <UserPlus size={16} className="md:hidden" />
          <UserPlus size={18} className="hidden md:block" />
          Add Guest
        </button>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-green-100 text-green-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{counts.attending}</div>
            <div className="text-sm text-gray-500">Attending</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{counts.pending}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gray-200 text-gray-600">
            <XCircle size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{counts.declined}</div>
            <div className="text-sm text-gray-500">Declined</div>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
        <div className="col-span-5">Guest Name</div>
        <div className="col-span-4">Contact</div>
        <div className="col-span-2">RSVP Status</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Guest List */}
      <ul className="space-y-3">
        {filteredGuests.map((g, i) => {
          const id = String(g._id ?? g.id ?? i);

          return (
            <li
              key={id}
              className="bg-white grid grid-cols-12 gap-3 p-4 rounded-xl items-center"
            >
              {/* Name */}
              <div className="col-span-12 md:col-span-5 flex flex-col justify-center">
                <p className="font-semibold">{g.name}</p>
                <div className="md:hidden text-sm text-gray-500 mt-1">
                  {g.email && <p>{g.email}</p>}
                  {g.phone && <p>{g.phone}</p>}
                </div>
              </div>

              {/* Contact */}
              <div className="hidden md:block col-span-4 text-sm text-gray-500">
                <p>{g.email || "—"}</p>
                <p>{g.phone || "—"}</p>
              </div>

              {/* Status – desktop only */}
              <div className="hidden md:flex col-span-2 order-1 md:order-none">
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
              </div>


              {/* Actions */}
              {/* Actions */}
              <div className="col-span-12 md:col-span-1 flex justify-end items-center gap-2 flex-wrap md:flex-nowrap">
                {/* Status – mobile on top, desktop unchanged */}
                <span
                  className={`md:hidden inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusStyle(
                    g.rsvp
                  )}`}
                >
                  {g.rsvp === "attending" && <CheckCircle size={14} />}
                  {g.rsvp === "pending" && <Clock size={14} />}
                  {g.rsvp === "declined" && <XCircle size={14} />}
                  {statusLabel(g.rsvp)}
                </span>

                <button
                  onClick={() => {
                    setEditingGuest(g);
                    setNewGuest(g);
                    setShowModal(true);
                  }}
                  className="text-sm font-medium text-[#311970]"
                >
                  Edit
                </button>

                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === id ? null : id)
                    }
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenu === id && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border rounded-xl shadow-lg z-10">
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

                      <button
                        onClick={async () => {
                          await safeDeleteGuest(id, g.name);
                          setOpenMenu(null);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-red-700 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">
              {editingGuest ? "Edit Guest" : "Add Guest"}
            </h3>

            <div className="space-y-3">
              <input
                placeholder="Guest name"
                value={newGuest.name}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, name: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
              />
              <input
                placeholder="Email"
                value={newGuest.email || ""}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, email: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
              />
              <input
                placeholder="Phone"
                value={newGuest.phone || ""}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, phone: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#311970] text-white rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
