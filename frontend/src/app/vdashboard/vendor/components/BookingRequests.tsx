import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

export default function VendorBookings() {
  const { bookings, fetchVendorBookings, respondBooking, replyToBooking } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [activeReplyBooking, setActiveReplyBooking] = useState<string | null>(null);

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
      await respondBooking(bookingId, status);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update booking");
    }
  };

  const handleReplySubmit = async (bookingId: string) => {
    if (!replyMessage.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      const booking = bookings.find((b: any) => b._id === bookingId);
      if (!booking) {
        toast.error("Booking not found");
        return;
      }

      // Safe extraction
      const messages = Array.isArray((booking as any)?.messages)
        ? (booking as any).messages
        : [];


      const clientMessages = messages.filter(
        (m: any) => m?.sender === "Client"
      );


      if (clientMessages.length === 0) {
        toast.error("No client message to reply to");
        return;
      }

      const latestClientMessage = clientMessages[clientMessages.length - 1];
      const messageId = latestClientMessage._id;

      await replyToBooking(bookingId, messageId, replyMessage.trim());

      setReplyMessage("");
      setActiveReplyBooking(null);

      toast.success("Reply sent");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reply");
    }
  };



  const getClientName = (booking: any) => {
    const client = booking.client ?? {};
    const getFirst = (str?: string) => (str ? str.split(" ")[0] : "");
    if (client.brideName && client.groomName) return `${getFirst(client.brideName)} & ${getFirst(client.groomName)}`;
    if (client.name) return getFirst(client.name);
    return "Client";
  };

  const getServiceName = (booking: any) => booking.service ?? "Service";
  const getDateString = (booking: any) => {
    if (!booking.date) return "-";
    const d = new Date(booking.date);
    return Number.isNaN(d.getTime()) ? booking.date : d.toLocaleDateString();
  };

  const getLatestMessage = (booking: any) => {
    if (!booking.messages || booking.messages.length === 0) return "-";
    const clientMessages = booking.messages.filter((m: any) => m.sender === "Client");
    if (clientMessages.length === 0) return "-";
    return clientMessages[clientMessages.length - 1].content;
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
            const latestMessage = getLatestMessage(b);

            return (
              <li key={id} className="flex flex-col border-b pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-700">{getClientName(b)}</p>
                    <p className="text-sm text-gray-500">
                      {getServiceName(b)} • Booked for {getDateString(b)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Message:</strong> {latestMessage}
                    </p>
                    <p
                      className={`text-xs mt-1 ${status === "Pending"
                        ? "text-yellow-600"
                        : status === "Accepted"
                          ? "text-green-600"
                          : "text-red-600"
                        }`}
                    >
                      {status}
                    </p>
                  </div>

                  {/* Accept/Decline Buttons */}
                  {status === "Pending" && (
                    <div className="flex gap-2">
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

                {/* Reply Section */}
                {status === "Accepted" && (
                  <div className="mt-2 flex flex-col gap-2">
                    {activeReplyBooking === id ? (
                      <>
                        <textarea
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#311970]"
                          rows={2}
                          placeholder="Type your reply..."
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReplySubmit(id)}
                            className="px-3 py-1 bg-[#311970] text-white text-xs rounded hover:bg-[#261457]"
                          >
                            Send
                          </button>
                          <button
                            onClick={() => { setActiveReplyBooking(null); setReplyMessage(""); }}
                            className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => setActiveReplyBooking(id)}
                        className="mt-1 px-3 py-1 bg-[#311970] text-white text-xs rounded hover:bg-[#261457]"
                      >
                        Reply
                      </button>
                    )}
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
