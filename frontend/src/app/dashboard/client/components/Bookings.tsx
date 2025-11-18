"use client";

import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { MessageCircle } from "lucide-react";

export default function Bookings() {
  const { bookings, fetchClientBookings } = useAppContext();

  useEffect(() => {
    fetchClientBookings();
  }, [fetchClientBookings]);

  const handleChat = (phone: string) => {
    if (!phone) return;
    // Remove any spaces, +, or special chars
    const cleanedPhone = phone.replace(/[^0-9]/g, "");
    const whatsappUrl = `https://wa.me/${cleanedPhone}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="bg-white w-full h-screen p-4 rounded-xl">
      <h2 className="text-lg font-bold mb-4">Recent Bookings</h2>

      <table className="w-full min-w-full text-left text-sm">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="pb-2">Vendor</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Chat</th>
          </tr>
        </thead>
        <tbody>
          {bookings && bookings.length > 0 ? (
            bookings.map((b) => {
              // Get vendor name
              const vendorName =
                typeof b.vendor === "object"
                  ? b.vendor.businessName || b.vendor.email || "Unknown"
                  : b.vendor || "Unknown";

              // Get vendor phone safely
              const vendorPhone =
                typeof b.vendor === "object" && b.vendor.phone
                  ? b.vendor.phone
                  : null;

              return (
                <tr key={b._id} className="border-b last:border-0">
                  <td className="py-2">{vendorName}</td>
                  <td className="py-2">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        b.status === "Accepted"
                          ? "bg-green-100 text-green-600"
                          : b.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-2">
                    {b.status === "Accepted" && vendorPhone && (
                      <button
                        onClick={() => handleChat(vendorPhone)}
                        className="flex ml-1 items-center gap-1 text-green-600 hover:text-green-800 text-xs"
                      >
                        <MessageCircle size={14} /> Chat
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={3}
                className="py-4 text-center text-gray-500 text-sm"
              >
                No bookings yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
