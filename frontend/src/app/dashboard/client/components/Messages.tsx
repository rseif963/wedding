"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import {
  ArrowLeft,
  Paperclip,
  Send,
} from "lucide-react";
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
}

interface Booking {
  _id: string;
  vendor?: Vendor | string;
  status: "Accepted" | "Pending" | "Declined";
  messages?: Message[];
}

/* ---------------- ICONS ---------------- */


export default function Bookings() {
  const { bookings, fetchClientBookings, replyToBooking } = useAppContext();

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [activeReplyBooking, setActiveReplyBooking] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "details">("list");
  const [openedBookings, setOpenedBookings] = useState<Set<string>>(new Set());


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

  const getUnreadCount = (booking: Booking): number => {
    if (openedBookings.has(booking._id)) return 0;
    return (booking.messages ?? []).filter(
      (m) => m.sender === "Vendor"
    ).length;
  };

  /* ---------------- SORT BOOKINGS ---------------- */

  const sortedBookings = [...bookings].sort((a: any, b: any) => {
    const aUnread = getUnreadCount(a) > 0 ? 1 : 0;
    const bUnread = getUnreadCount(b) > 0 ? 1 : 0;

    // Unread bookings first
    if (aUnread !== bUnread) {
      return bUnread - aUnread;
    }

    // Then newest message
    const aTime = new Date(getLatestMessage(a)?.createdAt || 0).getTime();
    const bTime = new Date(getLatestMessage(b)?.createdAt || 0).getTime();

    return bTime - aTime;
  });


  const totalUnreadBookings = bookings.filter(
    (b: any) => getUnreadCount(b) > 0
  ).length;

  const selectedBooking = bookings.find(
    (b: any) => b._id === selectedBookingId
  );

  const booking = selectedBooking!;

  const bookingExists = selectedBooking as Booking | undefined;



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
              <span className="text-sm text-[#311970]">
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
                    setOpenedBookings((prev) => {
                      const next = new Set(prev);
                      next.add(b._id);
                      return next;
                    });
                    setView("details");
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition
                    ${selectedBookingId === b._id
                      ? "bg-[#f3f0ff]"
                      : "hover:bg-gray-50"
                    }`}
                >
                  <div className="flex w-[100%] text-ellipsis items-center gap-3">
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
                <button
                  className="md:hidden"
                  onClick={() => setView("list")}
                >
                  <ArrowLeft />
                </button>
                {bookingExists && (
                  <div>
                    <h3 className="font-semibold">{getVendor(bookingExists)?.businessName ?? "Vendor"}</h3>
                    <p className="text-sm text-gray-500">{getVendor(bookingExists)?.category ?? "Category"}</p>
                  </div>
                )}

              </div>

              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3">
                {selectedBooking.messages?.map((m: any) => {
                  const time = new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={m._id}
                      className={`max-w-[70%] p-3 rounded-lg relative
                        ${m.sender === "Client"
                          ? "ml-auto bg-[#311970] text-white"
                          : "bg-gray-200"
                        }`}
                    >
                      <p className="pb-2">{m.content}</p>
                      <span className="absolute bottom-1 right-2 text-xs text-gray-400">
                        {time}
                      </span>
                    </div>
                  );
                })}
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
