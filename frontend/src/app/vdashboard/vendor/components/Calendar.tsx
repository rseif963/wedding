"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
  const { bookings } = useAppContext();

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);

  const date = new Date(currentYear, currentMonth, 1);
  const firstDayIndex = date.getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = date.toLocaleString("default", { month: "long" });

  const handlePrev = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((y) => y - 1);
  };

  const handleNext = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((y) => y + 1);
  };

  /* ---------------- REAL BOOKINGS ---------------- */

  const bookingsForMonth = useMemo(() => {
    return bookings.filter((b: any) => {
      if (!b.date) return false;
      const d = new Date(b.date);
      return (
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });
  }, [bookings, currentMonth, currentYear]);

  const bookedDates = bookingsForMonth
    .filter((b: any) => b.status === "Accepted")
    .map((b: any) => new Date(b.date).getDate());

  const pendingDates = bookingsForMonth
    .filter((b: any) => b.status === "Pending")
    .map((b: any) => new Date(b.date).getDate());

  const getStatus = (day: number) => {
    const fullDate = new Date(currentYear, currentMonth, day).toDateString();
    if (bookedDates.includes(day)) return "booked";
    if (pendingDates.includes(day)) return "pending";
    if (unavailableDates.includes(fullDate)) return "unavailable";
    return null;
  };

  const selectedDateLabel =
    selectedDate &&
    new Date(currentYear, currentMonth, selectedDate).toLocaleDateString(
      "en-US",
      { weekday: "long", month: "long", day: "numeric" }
    );

  /* ---------------- UPCOMING BOOKINGS ---------------- */

  const upcomingBookings = bookings
    .filter((b: any) => b.date)
    .sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    .slice(0, 5)
    .map((b: any) => {
      const d = new Date(b.date);
      return {
        name:
          b.client?.brideName && b.client?.groomName
            ? `${b.client.brideName.split(" ")[0]} & ${b.client.groomName.split(" ")[0]}`
            : b.client?.name ?? "Client",
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        status: b.status,
      };
    });

  return (
    <div className="grid p-3 md:p-8 bg-gray-50">
      {/* HEADER SECTION */}
      <div className="mb-10">
        <h1 className="font-serif font-bold" style={{ fontSize: "32px", color: "#1E1E1E" }}>
          Availability Calendar
        </h1>
        <p className="mt-1" style={{ fontSize: "15px", color: "#6B7280" }}>
          Manage your bookings and availability
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Calendar */}
        <div className="stat-card bg-background rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {monthName} {currentYear}
            </h2>
            <div className="flex gap-2">
              <button onClick={handlePrev} className="p-2 rounded-lg hover:bg-secondary/40">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={handleNext} className="p-2 rounded-lg hover:bg-secondary/40">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-muted-foreground text-sm mb-4">
            {daysOfWeek.map((d) => (
              <div key={d} className="text-center">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-4">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const status = getStatus(day);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`relative flex items-center justify-center h-14 w-14 rounded-xl text-sm font-medium
                    ${selectedDate === day ? "border-2 border-[#3D1A85]" : "hover:bg-secondary/40"}
                    ${status ? "bg-secondary/40" : ""}
                  `}
                >
                  {day}
                  {status === "booked" && <span className="absolute bottom-2 h-1.5 w-8 rounded-full bg-green-500" />}
                  {status === "pending" && <span className="absolute bottom-2 h-1.5 w-8 rounded-full bg-orange-500" />}
                  {status === "unavailable" && <span className="absolute bottom-2 h-1.5 w-8 rounded-full bg-red-400" />}
                </button>
              );
            })}
          </div>

          <div className="flex gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-green-500" />Booked</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-orange-500" />Pending</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-400" />Unavailable</div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {!selectedDate ? (
            <div className="stat-card rounded-2xl p-6 bg-background shadow-sm">
              <h3 className="font-semibold text-foreground mb-2">Select a Date</h3>
            </div>
          ) : (
            <div className="stat-card mt-4 mr-6 rounded-2xl p-6 bg-background shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">{selectedDateLabel}</h3>
              <button
                onClick={() => {
                  const fullDate = new Date(currentYear, currentMonth, selectedDate).toDateString();
                  setUnavailableDates((prev) =>
                    prev.includes(fullDate)
                      ? prev.filter((d) => d !== fullDate)
                      : [...prev, fullDate]
                  );
                }}
                className="btn-secondary p-4 bg-gray-200 rounded-2xl text-sm w-full flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Mark Unavailable
              </button>
            </div>
          )}

          {/* Upcoming Bookings */}
          <div className="stat-card rounded-2xl p-6 bg-background shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Upcoming Bookings</h3>
            <div className="space-y-3">
              {upcomingBookings.map((b, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
                  <div>
                    <p className="text-sm font-medium text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.date}</p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium
                      ${b.status === "Accepted"
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-100 text-orange-600"}
                    `}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
