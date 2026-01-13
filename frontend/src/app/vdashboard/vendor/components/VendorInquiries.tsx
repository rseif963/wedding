import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  ArrowLeft,
  Paperclip,
  Send,
} from "lucide-react";
import { div } from "framer-motion/client";

export default function VendorBookings() {
  const {
    bookings,
    fetchVendorBookings,
    respondBooking,
    replyToBooking,
    vendorProfile,
    fetchVendorMe
  } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [view, setView] = useState<"list" | "details">("list");

  //  Tracks which chats have been opened (READ)
  const [openedBookings, setOpenedBookings] = useState<Set<string>>(new Set());

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [autoScroll, setAutoScroll] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);




  const [lastSeenMap, setLastSeenMap] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    return JSON.parse(localStorage.getItem("lastSeenBookings") || "{}");
  });

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 100;

    setAutoScroll(isNearBottom);
  };

  const getClientInitials = (name?: string) => {
    if (!name) return "?";

    const cleaned = name
      .replace("&", "")
      .split(" ")
      .filter(Boolean);

    if (cleaned.length === 1) {
      return cleaned[0][0].toUpperCase();
    }

    const first = cleaned[0][0];
    const last = cleaned[cleaned.length - 1][0];

    return `${first}${last}`.toUpperCase();
  };

  useEffect(() => {
    fetchVendorMe();
  }, []);


  useEffect(() => {
    localStorage.setItem("lastSeenBookings", JSON.stringify(lastSeenMap));
  }, [lastSeenMap]);

  const selectedBooking = bookings.find(
    (b: any) => b._id === selectedBookingId
  );


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

  const clientName = selectedBooking
    ? getClientName(selectedBooking)
    : "";



  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedBooking?.messages, autoScroll]);




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


  const booking = selectedBooking!;


  /* ---------------- HELPERS ---------------- */


  const getLatestMessage = (booking: any) => {
    const msgs = booking.messages || [];
    return msgs.length ? msgs[msgs.length - 1] : null;
  };

  //  UNREAD = client messages AND booking not opened
  const getUnreadCount = (booking: any) => {
    const lastSeen = lastSeenMap[booking._id];
    const messages = booking.messages || [];

    return messages.filter(
      (m: any) =>
        m.sender === "Client" &&
        (!lastSeen || new Date(m.createdAt) > new Date(lastSeen))
    ).length;
  };


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


  const vendorProfilePhoto =
    vendorProfile?.profilePhoto || "/assets/avatar.png";

  /* ---------------- UI ---------------- */
  return (
    <section className="bg-gray-200 w-full  lg:h-[84vh] rounded-xl overflow-hidden">
      <div className="flex gap-4 h-full">
        {/* BOOKINGS LIST */}
        {/* BOOKINGS LIST */}
        <aside
          className={`w-screen md:w-1/3 lg:w-1/4 xl:w-[320px] p-4 overflow-y-auto rounded-none md:rounded-2xl bg-white
           ${view === "details" ? "hidden md:block" : "block"}`}
        >
          <div className="flex items-center justify-between border-b mb-4 pb-2">
            <h2 className="font-semibold">Inquiries & Accepted Bookings</h2>

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
                const clientName = getClientName(b);

                return (
                  <li
                    key={b._id}
                    onClick={() => {
                      setSelectedBookingId(b._id);

                      if (latestMessage) {
                        setLastSeenMap((prev) => ({
                          ...prev,
                          [b._id]: latestMessage.createdAt,
                        }));
                      }

                      setView("details");
                    }}
                    className={`p-3 rounded-lg cursor-pointer transition
                    ${selectedBookingId === b._id
                        ? "bg-[#f3f0ff]"
                        : "hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex w-full items-center gap-3">
                      {/* CLIENT AVATAR (INITIALS) */}
                      {/* CLIENT AVATAR (INITIALS) */}
                      <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold text-purple-900">
                          {getClientInitials(clientName)}
                        </span>
                      </div>


                      {/* TEXT */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-700 truncate">
                          {clientName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {latestMessage?.content || "No messages yet"}
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
          )}
        </aside>

        {/* DETAILS */}
        <main
          className={`flex-1 flex flex-col h-[90vh] md:h-full overflow-hidden bg-white 
           ${view === "list" ? "hidden md:flex" : "flex"}`}
        >


          {!selectedBooking ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a booking to view details
            </div>
          ) : (
            <>
              {/* HEADER */}
              <div className="border-b sticky p-4 flex items-center gap-3">
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
              <div
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3"
              >
                {selectedBooking?.messages?.map((m: any) => {
                  const time = new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={m._id}
                      className={`flex items-end gap-2 ${m.sender === "Vendor" ? "justify-end" : "justify-start"
                        }`}
                    >
                      {/* CLIENT INITIALS (RECEIVED MESSAGE) */}
                      {m.sender !== "Vendor" && (
                        <div className="w-8 h-8 rounded-full bg-[#ede9fe] flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-[#311970]">
                            {getClientInitials(clientName)}
                          </span>
                        </div>
                      )}

                      {/* MESSAGE BUBBLE */}
                      <div
                        className={`max-w-[70%] p-3 rounded-lg text-sm flex items-end gap-2
                           ${m.sender === "Vendor"
                            ? "bg-[#311970] text-white"
                            : "bg-gray-200"
                          }`}
                      >
                        <p className="flex-1 whitespace-pre-wrap break-words">
                          {m.content}
                        </p>

                        <span className="text-xs opacity-60 whitespace-nowrap">
                          {time}
                        </span>
                      </div>



                      {/* VENDOR PROFILE PIC (SENT MESSAGE) */}
                      {m.sender === "Vendor" && (
                        <div className="w-8 h-8 rounded-full overflow-hidden relative shrink-0">
                          <Image
                            src={vendorProfilePhoto}
                            alt="Vendor profile"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Scroll target */}
                <div ref={messagesEndRef} />
              </div>


              {/* REPLY */}
              {/* INPUT */}
              {selectedBooking.status === "Accepted" && (
                <div className="bottom-0 sticky bottom-0 bg-white border-t border-gray-200 px-4 py-2 flex gap-3">
                  <Paperclip />
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1 resize-none border border-blue-600 rounded-lg p-2"
                    rows={1}
                    placeholder="Type a message"
                  />

                  <button
                    onClick={handleReplySubmit}
                    className="bg-[#311970] text-white px-4 rounded-lg flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Send
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </section >
  );
}
