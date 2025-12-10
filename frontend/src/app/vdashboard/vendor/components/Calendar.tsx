"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const bookedDates = [15];
const pendingDates = [22];

const upcomingBookings = [
  { name: "Sarah & James", date: "Mar 15", status: "Booked" },
  { name: "Emily & Michael", date: "Mar 22", status: "Pending" },
  { name: "Jessica & Ryan", date: "Apr 12", status: "Booked" },
];

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(2); // March
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const date = new Date(currentYear, currentMonth, 1);
  const firstDayIndex = date.getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = date.toLocaleString("default", { month: "long" });

  const handlePrev = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNext = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
  };

  const getStatus = (day: number) => {
    if (bookedDates.includes(day)) return "booked";
    if (pendingDates.includes(day)) return "pending";
    return null;
  };

  const selectedDateLabel =
    selectedDate &&
    new Date(
      currentYear,
      currentMonth,
      selectedDate
    ).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="grid p-3 md:p-8 bg-gray-50">
      {/* HEADER SECTION */}
      <div className="mb-10">
        <h1
          className="font-serif font-bold"
          style={{ fontSize: "32px", color: "#1E1E1E" }}
        >
          Availability Calendar
        </h1>

        <p
          className="mt-1"
          style={{
            fontSize: "15px",
            color: "#6B7280",
          }}
        >
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
              <button
                onClick={handlePrev}
                className="p-2 rounded-lg hover:bg-secondary/40"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                className="p-2 rounded-lg hover:bg-secondary/40"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-muted-foreground text-sm mb-4">
            {daysOfWeek.map((d) => (
              <div key={d} className="text-center">
                {d}
              </div>
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
                  ${selectedDate === day
                      ? "border-2 border-[#3D1A85]"
                      : "hover:bg-secondary/40"
                    }
                  ${status ? "bg-secondary/40" : ""}
                `}
                >
                  {day}

                  {status === "booked" && (
                    <span className="absolute bottom-2 h-1.5 w-8 rounded-full bg-green-500" />
                  )}
                  {status === "pending" && (
                    <span className="absolute bottom-2 h-1.5 w-8 rounded-full bg-orange-500" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500" />
              Booked
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-orange-500" />
              Pending
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              Unavailable
            </div>
          </div>
        </div>

        {/* Right Side Panel */}
        <div className="space-y-6">
          {/* Select a Date / Date Details */}
          {!selectedDate ? (
            <div className="stat-card rounded-2xl p-6 bg-background shadow-sm">
              <h3 className="font-semibold text-foreground mb-2">
                Select a Date
              </h3>
            </div>
          ) : (
            <div
              className="stat-card animate-fade-up mt-4 mr-6 rounded-2xl p-6 bg-background shadow-sm"
              style={{ animationDelay: "200ms" }}
            >
              <h3 className="font-semibold text-foreground mb-4">
                {selectedDateLabel}
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-gray-50 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    This date is available
                  </p>

                  <button className="btn-secondary p-4 bg-gray-200 rounded-2xl text-sm w-full flex items-center justify-center gap-2">
                    <X className="w-4 h-4" />
                    Mark Unavailable
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="stat-card rounded-2xl p-6 mr-6 bg-background shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">
              Quick Actions
            </h3>

            <button className="w-full btn-primary bg-[#3D1A85] text-white p-2 rounded-2xl flex items-center justify-center gap-2 mb-3">
              <Plus className="w-4 h-4" />
              Block Multiple Dates
            </button>

            <button className="w-full btn-secondary">
              Sync with Google Calendar
            </button>
          </div>

          {/* Upcoming Bookings */}
          <div className="stat-card rounded-2xl p-6 bg-background shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">
              Upcoming Bookings
            </h3>

            <div className="space-y-3">
              {upcomingBookings.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/40"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {b.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {b.date}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium
                    ${b.status === "Booked"
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-100 text-orange-600"
                      }
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
