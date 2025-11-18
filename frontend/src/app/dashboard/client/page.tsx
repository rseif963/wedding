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
              <div className="w-full">
                <GuestList />
              </div>      
        </main>
      </div>
    </div>
  );
}
