"use client";

export default function BudgetTracker() {
  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      <h2 className="text-lg font-bold mb-4">Budget Tracker</h2>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Venue</span>
            <span>Ksh5,000 / Ksh6,000</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full w-[80%]"></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Photography</span>
            <span>Ksh2,500 / Ksh3,000</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full w-[83%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
