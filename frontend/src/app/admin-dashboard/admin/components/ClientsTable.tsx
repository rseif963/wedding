// src/components/ClientsTable.tsx
"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Search } from "lucide-react";

function firstName(full?: string) {
  if (!full) return "";
  return String(full).trim().split(" ")[0] || "";
}

export default function ClientsTable() {
  const { clients = [], fetchClients } = useAppContext();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchClients().catch((err) => {
      console.error("fetchClients error:", err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter clients by name, email, or phone
  const filteredClients = clients.filter((c: any) => {
    const brideFirst = firstName(c?.brideName);
    const groomFirst = firstName(c?.groomName);
    const displayName =
      brideFirst && groomFirst
        ? `${brideFirst} & ${groomFirst}`
        : brideFirst || groomFirst || (c?.user?.email ? c.user.email.split("@")[0] : "");
    
    const email = c?.user?.email ?? c?.email ?? "";
    const phone = c?.phone ?? "";

    const term = search.toLowerCase();
    return (
      displayName.toLowerCase().includes(term) ||
      email.toLowerCase().includes(term) ||
      phone.toLowerCase().includes(term)
    );
  });

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Clients</h3>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-4 flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search clients by name, email, or phone..."
          className="w-full bg-transparent outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white">
        {filteredClients.length === 0 ? (
          <p className="text-gray-500">No clients found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Contact</th>
                <th className="py-2">Registered</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((c: any) => {
                const brideFirst = firstName(c?.brideName);
                const groomFirst = firstName(c?.groomName);
                const displayName =
                  brideFirst && groomFirst
                    ? `${brideFirst} & ${groomFirst}`
                    : brideFirst || groomFirst || (c?.user?.email ? c.user.email.split("@")[0] : "Anonymous");

                const email = c?.user?.email ?? c?.email ?? "-";
                const phone = c?.phone ?? "-";
                const created = c?.createdAt
                  ? new Date(c.createdAt).toLocaleDateString()
                  : "-";

                return (
                  <tr
                    key={c._id ?? c.id ?? Math.random()}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-3">{displayName}</td>
                    <td className="py-3 flex flex-col text-gray-700 text-sm">
                      <span>{phone}</span>
                      <span>{email}</span>
                    </td>
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
