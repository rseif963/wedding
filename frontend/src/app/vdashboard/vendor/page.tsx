"use client";

import VendorStatsCards from "./components/VendorStatsCards";
import ProfileManager from "./components/ProfileManager";
import PostsManager from "./components/PostsManager";
import Subscriptions from "./components/Subscriptions";


export default function DashboardPage() {
  return (
    <div className="bg-white">
      <VendorStatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 mt-1">
        <div className="lg:col-span-3 space-y-0">
          <div className="w-full">
            <ProfileManager />
            <Subscriptions />
          </div>
        </div>     
      </div>
    </div>
  );
}
