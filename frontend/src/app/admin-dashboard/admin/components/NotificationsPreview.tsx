"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

type Notification = {
  id: string;
  type: "vendor" | "client";
  name: string;
  category?: string;
  createdAt: string;
};

interface NotificationsPreviewProps {
  moreLink?: string;
}

export default function NotificationsPreview({
  moreLink = "/admin-dashboard/admin/notifications",
}: NotificationsPreviewProps) {
  const { vendors = [], clients = [], fetchVendors, fetchClients, posts = [] } =
    useAppContext();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        await Promise.all([fetchVendors(), fetchClients()]);

        // Build vendor notifications
        const vendorNotifs: Notification[] = vendors.map((v: any) => ({
          id: v._id,
          type: "vendor",
          name: v.businessName || "Unnamed Vendor",
          category:
            posts.find((p: any) => p.vendor?._id === v._id)?.category || "General",
          createdAt: v.createdAt,
        }));

        // Build client notifications
        const clientNotifs: Notification[] = clients.map((c: any) => ({
          id: c._id,
          type: "client",
          name:
            c.brideName && c.groomName
              ? `${c.brideName} & ${c.groomName}`
              : c.user?.email?.split("@")[0] || "Anonymous",
          createdAt: c.createdAt,
        }));

        const all = [...vendorNotifs, ...clientNotifs];

        // Sort newest first
        all.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setNotifications(all);
      } catch (err) {
        console.error("Failed to load notifications:", err);
        setNotifications([]);
      }
    };

    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const latest = notifications.slice(0, 3);

  if (!latest || latest.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">No notifications yet.</div>
    );
  }

  return (
    <div className="space-y-3">
      {latest.map((notif) => (
        <div
          key={notif.id}
          className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
        >
          <div>
            <p className="text-sm text-gray-700">
              {notif.type === "vendor"
                ? `New vendor signed up: ${notif.name}${
                    notif.category ? ` (${notif.category})` : ""
                  }`
                : `New client signed up: ${notif.name}`}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(notif.createdAt).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      ))}

      {notifications.length > 3 && (
        <div className="text-center mt-2">
          <Link
            href={moreLink}
            className="text-[#311970] font-medium text-sm hover:underline"
          >
            More notifications
          </Link>
        </div>
      )}
    </div>
  );
}
