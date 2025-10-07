"use client";

export default function ActivityLog() {
  const items = [
    { id: 1, text: "New vendor signed up: Elegant Events Venue", time: "2h ago" },
    { id: 2, text: "Subscription purchased: Pro by Vendor #23", time: "1d ago" },
    { id: 3, text: "New blog posted: How to choose a venue", time: "3d ago" },
  ];

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3">Activity Log</h3>
      <ul className="space-y-3 text-sm text-gray-700">
        {items.map((it) => (
          <li key={it.id} className="flex justify-between">
            <span>{it.text}</span>
            <span className="text-xs text-gray-400">{it.time}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
