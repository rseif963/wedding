"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import {
  MessageCircle,
  Camera,
  Building2,
  Flower2,
  Utensils,
  Heart,
  Shirt,
  Car,
  Cake,
  Scissors,
  Music,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  Photography: <Camera className="w-6 h-6 text-wedpine-purple" />,
  Venue: <Building2 className="w-6 h-6 text-wedpine-purple" />,
  Catering: <Utensils className="w-6 h-6 text-wedpine-purple" />,
  Entertainment: <Music className="w-6 h-6 text-wedpine-purple" />,
  Tailor: <Scissors className="w-6 h-6 text-wedpine-purple" />,
  Cake: <Cake className="w-6 h-6 text-wedpine-purple" />,
  Cars: <Car className="w-6 h-6 text-wedpine-purple" />,
  Dresses: <Shirt className="w-6 h-6 text-wedpine-purple" />,
  Makeup: <Heart className="w-6 h-6 text-wedpine-purple" />,
  Decoration: <Flower2 className="w-6 h-6 text-wedpine-purple" />,
};

export default function Bookings() {
  const {
    bookings,
    fetchClientBookings,
    getOrCreateConversation,
  } = useAppContext();

  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    fetchClientBookings();
  }, [fetchClientBookings]);

  const handleChat = (vendor: any, bookingId: string) => {
    if (!vendor?._id) return;

    // Pass bookingId as query parameter
    router.push(`/dashboard/client/messages?bookingId=${bookingId}`);
  };


  /* ---------------- SORT BOOKINGS (LATEST FIRST) ---------------- */

  const sortedBookings = useMemo(() => {
    return [...(bookings || [])].sort((a: any, b: any) => {
      const aLatest =
        a.messages?.[a.messages.length - 1]?.createdAt ||
        a.createdAt;

      const bLatest =
        b.messages?.[b.messages.length - 1]?.createdAt ||
        b.createdAt;

      return new Date(bLatest).getTime() - new Date(aLatest).getTime();
    });
  }, [bookings]);

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-white w-full h-full p-4 rounded-xl shadow-md space-y-6">
      <h2 className="font-display text-2xl font-semibold text-[#311970]">
        Recent Bookings
      </h2>

      {sortedBookings.length > 0 ? (
        <>
          <div className="space-y-3">
            {sortedBookings.slice(0, visibleCount).map((b: any) => {
              const vendor =
                typeof b.vendor === "object" ? b.vendor : null;

              const vendorName =
                vendor?.businessName || vendor?.email || "Unknown";

              const vendorCategory =
                vendor?.category || "Unknown";

              return (
                <div
                  key={b._id}
                  className="flex flex-col md:flex-row w-full items-center justify-between bg-[#f8f8fc] rounded-xl p-2 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-[#ebe9f7] flex items-center justify-center shrink-0">
                      {categoryIcons[vendorCategory] || (
                        <Flower2 className="w-6 h-6 text-wedpine-purple" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-medium text-[#311970] truncate">
                        {vendorName}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {vendorCategory}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${b.status === "Accepted"
                        ? "bg-green-100 text-green-600"
                        : b.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                        }`}
                    >
                      {b.status}
                    </span>

                    {b.status === "Accepted" && vendor && (
                      <button
                        onClick={() => handleChat(vendor, b._id)}
                        className="bg-[#ebe9f7] rounded-lg p-2 hover:bg-[#d4d1f4] transition"
                        title="Chat with vendor"
                      >
                        <MessageCircle className="w-5 h-5 text-[#2D157A]" />
                      </button>
                    )}

                  </div>
                </div>
              );
            })}
          </div>

          {sortedBookings.length > visibleCount && (
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
        <p className="text-center text-gray-500 py-6">
          No bookings yet
        </p>
      )}
    </div>
  );
}
