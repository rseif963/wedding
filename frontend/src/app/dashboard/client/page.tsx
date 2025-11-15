"use client";

import StatsCards from "./components/StatsCards";
import Bookings from "./components/Bookings";
import BudgetTracker from "./components/BudgetTracker";
import Messages from "./components/Messages";
import GuestList from "./components/GuestList";

export default function ClientDashboard() {
  return (
    <div className="flex min-h-screen bg-white">
   
      <div className="flex-1 flex flex-col">
    
        <main className="flex-1 overflow-y-auto">
          <StatsCards />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 mt-1">

            <div className="space-y-6 lg:col-span-2">
            </div>

            <div className="space-y-6 w-full">
              <div className="w-full">
                <GuestList />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
