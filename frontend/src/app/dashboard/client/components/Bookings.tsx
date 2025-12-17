"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { MessageCircle, Eye, Camera, Flower2, Utensils, Music } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  Photography: <Camera className="w-6 h-6 text-wedpine-purple" />,
  Venue: <Flower2 className="w-6 h-6 text-wedpine-purple" />,
  Catering: <Utensils className="w-6 h-6 text-wedpine-purple" />,
  Entertainment: <Music className="w-6 h-6 text-wedpine-purple" />,
};


export default function Bookings() {
  const { bookings, fetchClientBookings } = useAppContext();
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    fetchClientBookings();
  }, [fetchClientBookings]);

  const handleChat = (phone: string) => {
    if (!phone) return;
    const cleanedPhone = phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanedPhone}`, "_blank");
  };

  return (
    <div className="bg-white w-full h-full p-6 rounded-xl shadow-md space-y-6">
      <h2 className="font-display text-2xl font-semibold text-[#311970]">Recent Bookings</h2>

      {bookings && bookings.length > 0 ? (
        <>
          <div className="space-y-3">
            {bookings.slice(0, visibleCount).map((b) => {
              const vendorName =
                typeof b.vendor === "object"
                  ? b.vendor.businessName || b.vendor.email || "Unknown"
                  : b.vendor || "Unknown";

              const vendorCategory =
                typeof b.vendor === "object"
                  ? b.vendor.category || "Unknown"
                  : "Unknown";

              const vendorPhone =
                typeof b.vendor === "object" && b.vendor.phone
                  ? b.vendor.phone
                  : null;

              const statusColors = {
                Accepted: "bg-green-100 text-green-600",
                Pending: "bg-yellow-100 text-yellow-600",
                Rejected: "bg-red-100 text-red-600",
              };

              return (
                <div
                  key={b._id}
                  className="flex items-center justify-between bg-[#f8f8fc] rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-[#ebe9f7] flex items-center justify-center shrink-0">
                      {categoryIcons[vendorCategory] || <Flower2 className="w-6 h-6 text-wedpine-purple" />}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-medium text-[#311970] truncate">{vendorName}</h3>
                      <p className="text-sm text-muted-foreground truncate">{vendorCategory}</p>

                    </div>
                  </div>

                  <div className="flex items-center gap-3">
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

                    {b.status === "Accepted" && vendorPhone && (
                      <button
                        onClick={() => handleChat(vendorPhone)}
                        className="bg-[#ebe9f7] rounded-lg p-2 hover:bg-[#d4d1f4] transition"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5 text-green-600" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {bookings.length > visibleCount && (
            <div className="text-center mt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-6 py-2 bg-[#311970] text-white rounded-lg hover:bg-[#4a22c6] transition"
              >
                Show More
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 py-6">No bookings yet</p>
      )}
    </div>
  );
}
