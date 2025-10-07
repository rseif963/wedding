"use client";

export default function GuestList() {
  const guests = [
    { id: 1, name: "Kai cenat", status: "Confirmed" },
    { id: 2, name: "Ritah Otieno", status: "Pending" },
    { id: 3, name: "Sarah Juma", status: "Declined" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      <h2 className="text-lg font-bold mb-4">Guest List</h2>
      <ul className="space-y-3">
        {guests.map((g) => (
          <li key={g.id} className="flex justify-between">
            <span>{g.name}</span>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                g.status === "Confirmed"
                  ? "bg-green-100 text-green-600"
                  : g.status === "Pending"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {g.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
