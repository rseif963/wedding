"use client";

import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Bookings() {
  const { bookings, fetchClientBookings } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    fetchClientBookings();
  }, [fetchClientBookings]);

  const handleChat = (vendorId: string) => {
    // Navigate to messages page with vendorId
    router.push(`/dashboard/client/messages?vendorId=${vendorId}`);
  };

  return (
    <div className="bg-white w-screen p-6 rounded-xl shadow mt-6">
      <h2 className="text-lg font-bold mb-4">Recent Bookings</h2>

      <table className="w-full min-w-full text-left text-sm">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="pb-2">Vendor</th>
            <th className="pb-2">Date</th>
            <th className="pb-2">Status</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <tr key={b._id} className="border-b last:border-0">
                <td className="py-2">
                  {typeof b.vendor === "object"
                    ? b.vendor.businessName || b.vendor.email
                    : b.vendor}
                </td>
                <td className="py-2">{b.date}</td>
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
                  {b.vendor?._id && (
                    <button
                      onClick={() => handleChat(b.vendor._id)}
                      className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs"
                    >
                      <MessageCircle size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-4 text-center text-gray-500 text-sm">
                No bookings yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
