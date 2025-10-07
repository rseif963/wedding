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

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      

      <div className="flex-1 flex flex-col">
       

        <main className="p-1 flex-1 overflow-y-auto">
          {/* Top stats */}
          <AdminStats />

          {/* mid grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              <AnalyticsOverview />
              <VendorsTable />
              <SubscriptionsEarnings />
            </div>

            <aside className="space-y-6">
              <BlogManager />
              <ClientsTable />
              <ActivityLog />
            </aside>
          </div>

          {/* bottom */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div>
              <AdminSettings />
            </div>
            <div>
              {/* space for future widgets like payouts, taxes, detailed exports */}
              <section className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3">Exports & Reports</h3>
                <p className="text-sm text-gray-600 mb-4">Export vendors, clients, payments, and activity logs (CSV / XLSX / PDF).</p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-[#7c4dff] text-white rounded">Export CSV</button>
                  <button className="px-4 py-2 border rounded">Generate Report</button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
