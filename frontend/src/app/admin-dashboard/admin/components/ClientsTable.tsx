// src/components/ClientsTable.tsx
"use client";

import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

function firstName(full?: string) {
  if (!full) return "";
  return String(full).trim().split(" ")[0] || "";
}

export default function ClientsTable() {
  const { clients = [], fetchClients } = useAppContext();

  useEffect(() => {
    // load clients once on mount
    // intentionally not including fetchClients in deps to avoid re-runs if function identity changes
    fetchClients().catch((err) => {
      // swallow - fetchClients already logs errors in context
      // but you can toast here if you want
      // toast.error("Failed to load clients");
      // eslint-disable-next-line no-console
      console.error("fetchClients error:", err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Clients</h3>
      </div>

      <div className="overflow-x-auto">
        {clients.length === 0 ? (
          <p className="text-gray-500">No clients found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Registered</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c: any) => {
                const brideFirst = firstName(c?.brideName);
                const groomFirst = firstName(c?.groomName);
                const displayName =
                  brideFirst && groomFirst
                    ? `${brideFirst} & ${groomFirst}`
                    : brideFirst || groomFirst || (c?.user?.email ? c.user.email.split("@")[0] : "Anonymous");

                const email = c?.user?.email ?? c?.email ?? "-";
                const created = c?.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-";

                return (
                  <tr key={c._id ?? c.id ?? Math.random()} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3">{displayName}</td>
                    <td className="py-3">{email}</td>
                    <td className="py-3">{created}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
