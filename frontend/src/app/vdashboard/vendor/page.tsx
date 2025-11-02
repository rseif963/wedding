"use client";

import VendorStatsCards from "./components/VendorStatsCards";
import ProfileManager from "./components/ProfileManager";
import PostsManager from "./components/PostsManager";


export default function DashboardPage() {
  return (
    <div className="bg-white">
      <VendorStatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-1">
        <div className="lg:col-span-3 space-y-0">
          <div className="w-full">
            <ProfileManager />
          </div> 
        </div>     
      </div>
    </div>
  );
}
