"use client";

import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import AdminStats from "./components/AdminStats";
import VendorsTable from "./components/VendorsTable";
import ClientsTable from "./components/ClientsTable";
import AnalyticsOverview from "./components/AnalyticsOverview";
import SubscriptionsEarnings from "./components/SubscriptionsEarnings";
import BlogManager from "./components/BlogManager";
import ActivityLog from "./components/ActivityLog";
import AdminSettings from "./components/AdminSettings";
import NotificationsPreview from "./components/NotificationsPreview";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      

      <div className="flex-1 flex flex-col">
       

        <main className="p-1 flex-1 overflow-y-auto">
          {/* Top stats */}
          <AdminStats />

          {/* mid grid */}
          <div className="grid grid-cols-1 gap-6 mt-6">

            <aside className="">
              
              <NotificationsPreview />
            </aside>
          </div>

        </main>
      </div>
    </div>
  );
}
