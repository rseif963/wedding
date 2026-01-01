import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Paperclip,
  Send,
} from "lucide-react";

export default function VendorBookings() {
  const {
    bookings,
    fetchVendorBookings,
    respondBooking,
    replyToBooking,
  } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [view, setView] = useState<"list" | "details">("list");

  // 👇 Tracks which chats have been opened (READ)
  const [openedBookings, setOpenedBookings] = useState<Set<string>>(new Set());

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- FETCH + POLLING ---------------- */
  useEffect(() => {
    const loadBookings = async () => {
      try {
        await fetchVendorBookings();
      } catch {
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
    pollingRef.current = setInterval(loadBookings, 5000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchVendorBookings]);


  const selectedBooking = bookings.find(
    (b: any) => b._id === selectedBookingId
  );

  const booking = selectedBooking!;


  /* ---------------- HELPERS ---------------- */
  const getClientName = (booking: any) => {
    const client = booking.client ?? {};
    const getFirst = (str?: string) => (str ? str.split(" ")[0] : "");
    if (client.brideName && client.groomName)
      return `${getFirst(client.brideName)} & ${getFirst(
        client.groomName
      )}`;
    if (client.name) return getFirst(client.name);
    return "Client";
  };

  const getLatestMessage = (booking: any) => {
    const msgs = booking.messages || [];
    return msgs.length ? msgs[msgs.length - 1] : null;
  };

  // ✅ UNREAD = client messages AND booking not opened
  const getUnreadCount = (booking: any) => {
    if (openedBookings.has(booking._id)) return 0;

    return (booking.messages || []).filter(
      (m: any) => m.sender === "Client"
    ).length;
  };

  const sortedBookings = [...bookings].sort((a: any, b: any) => {
    const aUnread = getUnreadCount(a) > 0 ? 1 : 0;
    const bUnread = getUnreadCount(b) > 0 ? 1 : 0;

    // 1️⃣ Unread bookings first
    if (aUnread !== bUnread) {
      return bUnread - aUnread;
    }

    // 2️⃣ Then newest message
    const aTime = new Date(getLatestMessage(a)?.createdAt || 0).getTime();
    const bTime = new Date(getLatestMessage(b)?.createdAt || 0).getTime();

    return bTime - aTime;
  });


  const totalUnreadBookings = bookings.filter(
    (b: any) => getUnreadCount(b) > 0
  ).length;

  /* ---------------- ACTIONS ---------------- */
  const handleBookingStatus = async (
    bookingId: string,
    status: "Accepted" | "Declined"
  ) => {
    try {
      await respondBooking(bookingId, status);
      await fetchVendorBookings();
    } catch {
      toast.error("Failed to update booking");
    }
  };

  const handleReplySubmit = async () => {
    if (!replyMessage.trim() || !selectedBooking) return;

    const messages = selectedBooking?.messages ?? [];
    const clientMessages = messages.filter(
      (m: any) => m.sender === "Client"
    );

    if (!clientMessages.length) {
      toast.error("No client message to reply to");
      return;
    }

    const latestClientMessage =
      clientMessages[clientMessages.length - 1];

    try {
      if (!selectedBooking?._id) return;

      await replyToBooking(
        selectedBooking._id,
        latestClientMessage._id,
        replyMessage.trim()
      );

      setReplyMessage("");
      await fetchVendorBookings();
    } catch {
      toast.error("Failed to send reply");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <section className="bg-gray-200 w-full h-screen rounded-xl overflow-hidden">
      <div className="flex gap-4 h-full">
        {/* BOOKINGS LIST */}
        <aside
          className={`w-screen md:w-1/3 lg:w-1/4 xl:w-[320px] p-4 overflow-y-auto rounded-none md:rounded-2xl bg-white
            ${view === "details" ? "hidden md:block" : "block"}`}
        >
          <div className="flex items-center justify-between border-b mb-4 pb-2">
            <h2 className="font-semibold mb-3">Inquiries & Accepted Bookings</h2>

            {totalUnreadBookings > 0 && (
              <span className="text-sm font-medium text-[#311970]">
                {totalUnreadBookings} unread
              </span>
            )}
          </div>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-500">No bookings yet</p>
          ) : (
            <ul className="space-y-3">
              {sortedBookings.map((b: any) => {
                const latestMessage = getLatestMessage(b);
                const unreadCount = getUnreadCount(b);

                return (
                  <li
                    key={b._id}
                    onClick={() => {
                      setSelectedBookingId(b._id);
                      setOpenedBookings((prev) =>
                        new Set(prev).add(b._id)
                      );
                      setView("details");
                    }}
                    className={`cursor-pointer rounded-lg p-3 transition
                      ${selectedBookingId === b._id
                        ? "bg-[#f3f0ff] border-[#311970]"
                        : "hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-700">
                          {getClientName(b)}
                        </p>
                        <p className="text-xs text-gray-500 truncate md:truncate sm:truncate">
                          {latestMessage?.content ||
                            "No messages yet"}
                        </p>
                      </div>

                      {unreadCount > 0 && (
                        <span className="min-w-[22px] h-[22px] flex items-center justify-center rounded-full bg-[#311970] text-white text-xs">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        {/* DETAILS */}
        <main
          className={`flex-1 flex flex-col bg-white rounded-2xl
            ${view === "list" ? "hidden md:flex" : "flex"}`}
        >
          {!selectedBooking ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a booking to view details
            </div>
          ) : (
            <>
              {/* HEADER */}
              <div className="border-b p-4 flex items-center gap-3">
                <button
                  onClick={() => setView("list")}
                  className="md:hidden text-sm font-bold text-[#311970]"
                >
                  <ArrowLeft />
                </button>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {getClientName(selectedBooking)}
                  </h3>

                  {selectedBooking.status === "Accepted" ? (
                    <p className="text-sm text-green-600">Accepted</p>
                  ) : selectedBooking.status === "Pending" ? (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() =>
                          handleBookingStatus(
                            selectedBooking._id,
                            "Accepted"
                          )
                        }
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleBookingStatus(
                            selectedBooking._id,
                            "Declined"
                          )
                        }
                        className="px-3 py-1 bg-red-700 text-white text-xs rounded-2xl"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-red-600">Declined</p>
                  )}
                </div>
              </div>

              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3">
                {selectedBooking?.messages?.map((m: any) => {
                  const time = new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={m._id}
                      className={`max-w-[70%] p-3 rounded-lg text-sm relative
          ${m.sender === "Vendor"
                          ? "ml-auto bg-[#311970] text-white"
                          : "bg-gray-200"
                        }`}
                    >
                      <p className="pb-2">{m.content}</p>
                      <span className="absolute bottom-1 right-2 text-xs text-gray-400 pt-2">
                        {time}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* REPLY */}
              {/* INPUT */}
              {selectedBooking.status === "Accepted" && (
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
                  <Paperclip />
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1 resize-none border border-blue-600 rounded-lg p-2"
                    rows={2}
                    placeholder="Type a message"
                  />

                  <button
                    onClick={handleReplySubmit}
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
