"use client";

import { useEffect, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { Bell, Store, Users } from "lucide-react";

type NotificationItem = {
  id: string;
  type: "vendor" | "client";
  message: string;
  createdAt: Date;
};

export default function AdminNotifications() {
  const {
    vendors = [],
    clients = [],
    fetchVendors,
    fetchClients,
  } = useAppContext();

  useEffect(() => {
    fetchVendors();
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notifications: NotificationItem[] = useMemo(() => {
    const vendorNotifications = vendors.map((v: any) => ({
      id: `vendor-${v._id}`,
      type: "vendor" as const,
      message: `New vendor signed up: ${v.businessName || "Unnamed Vendor"}${
        v.category ? ` (${v.category})` : ""
      }`,
      createdAt: new Date(v.createdAt),
    }));

    const clientNotifications = clients.map((c: any) => {
      const name =
        c?.brideName || c?.groomName || c?.user?.email || "New client";

      return {
        id: `client-${c._id}`,
        type: "client" as const,
        message: `New client signed up: ${name}`,
        createdAt: new Date(c.createdAt),
      };
    });

    return [...vendorNotifications, ...clientNotifications].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }, [vendors, clients]);

  return (
    <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <Bell className="text-[#311970]" size={20} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Notifications
          </h2>
          <p className="text-sm text-gray-500">
            Recent platform activity
          </p>
        </div>
      </div>

      {/* LIST */}
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  n.type === "vendor"
                    ? "bg-purple-100 text-[#311970]"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {n.type === "vendor" ? (
                  <Store size={18} />
                ) : (
                  <Users size={18} />
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {n.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {n.createdAt.toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
