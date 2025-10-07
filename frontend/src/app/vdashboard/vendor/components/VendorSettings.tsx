"use client";

export default function Earnings() {
  const earnings = [
    { id: 1, client: "Alice", amount: "Ksh 20,000", date: "2025-09-01" },
    { id: 2, client: "Michael", amount: "Ksh 15,000", date: "2025-09-03" },
  ];

  return (
    <section className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Earnings</h2>
      <ul className="space-y-3">
        {earnings.map((earn) => (
          <li key={earn.id} className="flex justify-between border-b pb-2">
            <span>{earn.client}</span>
            <span className="font-semibold">{earn.amount}</span>
            <span className="text-sm text-gray-500">{earn.date}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
