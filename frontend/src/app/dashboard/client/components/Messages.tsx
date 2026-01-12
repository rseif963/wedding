"use client";

import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { ArrowLeft, Paperclip, Send } from "lucide-react";
import toast from "react-hot-toast";

/* ---------------- TYPES ---------------- */

type MessageSender = "Client" | "Vendor";

interface Message {
  _id: string;
  sender: MessageSender;
  content: string;
  createdAt: string;
}

interface Vendor {
  _id: string;
  businessName?: string;
  category?: string;
  profilePhoto?: string;
  logo?: string;
}

interface Booking {
  _id: string;
  vendor?: Vendor | string;
  status: "Accepted" | "Pending" | "Declined";
  messages?: Message[];
  mainPhoto?: string;
}

/* ---------------- HELPERS ---------------- */

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const getFullUrl = (path?: string) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
};

const getVendorInitials = (name?: string) => {
  if (!name) return "V";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

/* ---------------- COMPONENT ---------------- */

export default function Bookings() {
  const {
    bookings,
    fetchClientBookings,
    replyToBooking,
    clientProfile,
  } = useAppContext();

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [view, setView] = useState<"list" | "details">("list");
  const [openedBookings, setOpenedBookings] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [lastSeenMap, setLastSeenMap] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    return JSON.parse(localStorage.getItem("lastSeenClientBookings") || "{}");
  });


  useEffect(() => {
    localStorage.setItem(
      "lastSeenClientBookings",
      JSON.stringify(lastSeenMap)
    );
  }, [lastSeenMap]);


  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    fetchClientBookings();
  }, [fetchClientBookings]);

  useEffect(() => {
    document.body.style.overflow = selectedBookingId ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedBookingId]);

  /* ---------------- HELPERS ---------------- */

  const getVendor = (booking?: Booking): Vendor | null =>
    typeof booking?.vendor === "object" ? booking.vendor : null;

  const getLatestMessage = (booking: Booking): Message | null => {
    const msgs = booking.messages ?? [];
    return msgs.length ? msgs[msgs.length - 1] : null;
  };

  const getUnreadCount = (booking: any) => {
    const lastSeen = lastSeenMap[booking._id];
    const messages = booking.messages || [];

    return messages.filter(
      (m: any) =>
        m.sender === "Vendor" &&
        (!lastSeen || new Date(m.createdAt) > new Date(lastSeen))
    ).length;
  };

  // Calculate total unread messages across all bookings
  const totalUnreadBookings = bookings.filter(
    (b: any) => getUnreadCount(b) > 0
  ).length;



  const brideInitial =
    clientProfile?.brideName?.charAt(0).toUpperCase() ?? "";
  const groomInitial =
    clientProfile?.groomName?.charAt(0).toUpperCase() ?? "";
  const coupleInitials = `${brideInitial}${groomInitial}`;

  /* ---------------- SORT BOOKINGS ---------------- */

  const sortedBookings = [...bookings].sort((a: any, b: any) => {
    const aUnread = getUnreadCount(a) > 0 ? 1 : 0;
    const bUnread = getUnreadCount(b) > 0 ? 1 : 0;

    if (aUnread !== bUnread) return bUnread - aUnread;

    const aTime = new Date(getLatestMessage(a)?.createdAt || 0).getTime();
    const bTime = new Date(getLatestMessage(b)?.createdAt || 0).getTime();

    return bTime - aTime;
  });


  const selectedBooking = bookings.find(
    (b: any) => b._id === selectedBookingId
  ) as Booking | undefined;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedBooking?.messages]);

  /* ---------------- SEND MESSAGE ---------------- */

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedBooking) return;

    const vendorMessages =
      selectedBooking.messages?.filter((m) => m.sender === "Vendor") ?? [];

    if (!vendorMessages.length) {
      toast.error("No vendor message to reply to");
      return;
    }

    try {
      await replyToBooking(
        selectedBooking._id,
        vendorMessages[vendorMessages.length - 1]._id,
        message.trim()
      );

      setMessage("");
      fetchClientBookings();
      toast.success("Message sent");
    } catch {
      toast.error("Failed to send message");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <section className="bg-gray-200 w-full h-[80vh] md:h-[84vh] rounded-xl overflow-hidden">
      <div className="flex h-full gap-3">

        {/* LEFT */}
        <aside
          className={`w-screen md:w-1/3 lg:w-1/4 xl:w-[320px] p-4 overflow-y-auto rounded-2xl bg-white
          ${view === "details" ? "hidden md:block" : "block"}`}
        >
          <div className="flex justify-between border-b mb-4 pb-2">
            <h2 className="font-bold">Messages</h2>

            {totalUnreadBookings > 0 && (
              <span className="text-sm font-medium text-[#311970]">
                {totalUnreadBookings} unread
              </span>
            )}
          </div>


          <ul className="space-y-3">
            {sortedBookings.map((b: any) => {
              const vendor = getVendor(b);
              const latestMessage = getLatestMessage(b);
              const unreadCount = getUnreadCount(b);

              return (
                <li
                  key={b._id}
                  onClick={() => {
                    setSelectedBookingId(b._id);
                    const latestVendorMessage = (b.messages || [])
                      .filter((m: any) => m.sender === "Vendor")
                      .slice(-1)[0];

                    if (latestVendorMessage) {
                      setLastSeenMap((prev) => ({
                        ...prev,
                        [b._id]: latestVendorMessage.createdAt,
                      }));
                    }


                    setOpenedBookings((prev) => new Set(prev).add(b._id));
                    setView("details");
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition
                    ${selectedBookingId === b._id
                      ? "bg-[#f3f0ff]"
                      : "hover:bg-gray-50"
                    }`}
                >
                  <div className="flex w-full items-center gap-3">
                    {/* VENDOR AVATAR */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center shrink-0">
                      {(() => {
                        const image =
                          getFullUrl(
                            b.mainPhoto ||
                            vendor?.profilePhoto ||
                            vendor?.logo
                          );

                        return image ? (
                          <img
                            src={image}
                            alt={vendor?.businessName || "Vendor"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-gray-700">
                            {getVendorInitials(vendor?.businessName)}
                          </span>
                        );
                      })()}
                    </div>

                    {/* TEXT */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {vendor?.businessName ?? "Vendor"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {latestMessage?.content ?? "No messages yet"}
                      </p>
                    </div>

                    {unreadCount > 0 && (
                      <span className="w-6 h-6 rounded-full bg-[#311970] text-white text-xs flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>

                </li>
              );
            })}
          </ul>
        </aside>

        {/* RIGHT */}
        <main
          className={`flex-1 flex flex-col bg-white rounded-2xl
          ${view === "list" ? "hidden md:flex" : "flex"}`}
        >
          {!selectedBooking ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a booking
            </div>
          ) : (
            <>
              {/* HEADER */}
              <div className="border-b p-4 flex items-center gap-3">
                <button className="md:hidden" onClick={() => setView("list")}>
                  <ArrowLeft />
                </button>
                <div>
                  <h3 className="font-semibold">
                    {getVendor(selectedBooking)?.businessName ?? "Vendor"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {getVendor(selectedBooking)?.category ?? "Category"}
                  </p>
                </div>
              </div>

              {/* MESSAGES (FIXED) */}
              <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3">
                {selectedBooking.messages?.map((m) => {
                  const time = new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  const vendor = getVendor(selectedBooking);
                  const vendorImage = getFullUrl(
                    selectedBooking.mainPhoto ||
                    vendor?.profilePhoto ||
                    vendor?.logo
                  );

                  return (
                    <div
                      key={m._id}
                      className={`flex items-end gap-2 ${m.sender === "Client"
                        ? "justify-end"
                        : "justify-start"
                        }`}
                    >
                      {m.sender === "Vendor" && (
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center shrink-0">
                          {vendorImage ? (
                            <img
                              src={vendorImage}
                              alt="Vendor"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-semibold text-gray-700">
                              {getVendorInitials(vendor?.businessName)}
                            </span>
                          )}
                        </div>
                      )}

                      <div
                        className={`max-w-[70%] p-3 rounded-lg flex items-end justify-between gap-3
                         ${m.sender === "Client"
                            ? "bg-[#311970] text-white"
                            : "bg-gray-200"
                          }`}
                      >
                        <p className="flex-1">{m.content}</p>
                        <span className="text-xs opacity-60 whitespace-nowrap">
                          {time}
                        </span>
                      </div>

                      {m.sender === "Client" && (
                        <div className="w-8 h-8 rounded-full bg-[#311970] flex items-center justify-center shrink-0">
                          <span className="text-white text-xs font-semibold">
                            {coupleInitials}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Scroll target */}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT */}
              {selectedBooking.status === "Accepted" && (
                <div className="border-t border-gray-50 p-4 flex gap-3">
                  <Paperclip />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 resize-none border border-blue-600 rounded-lg p-2"
                    rows={2}
                    placeholder="Type a message"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-purple-600 text-white px-4 rounded-lg flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Send
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </section>
  );
}
