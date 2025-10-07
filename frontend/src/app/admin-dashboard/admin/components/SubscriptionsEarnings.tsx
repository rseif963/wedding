"use client";

export default function SubscriptionsEarnings() {
  const packages = [
    { id: 1, name: "Basic", revenue: 25000, subscribers: 120 },
    { id: 2, name: "Pro", revenue: 120000, subscribers: 40 },
    { id: 3, name: "Enterprise", revenue: 300000, subscribers: 6 },
  ];

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Subscriptions & Earnings</h3>
        <div className="text-sm text-gray-500">Monthly</div>
      </div>

      <ul className="space-y-3">
        {packages.map((p) => (
          <li key={p.id} className="flex justify-between items-center border-b py-3">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-gray-500">{p.subscribers} subscribers</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">Ksh {p.revenue.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Revenue</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
