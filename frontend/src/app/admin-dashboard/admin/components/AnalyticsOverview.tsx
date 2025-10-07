"use client";

/**
 * Simple sparkline / mini charts using inline SVG.
 * Replace with real chart library (recharts/apexcharts) when hooking real data.
 */
export default function AnalyticsOverview() {
  // sample monthly revenue data
  const data = [40000, 60000, 80000, 70000, 90000, 120000, 150000, 130000, 140000, 160000, 170000, 190000];

  const max = Math.max(...data);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 100}`).join(" ");

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Revenue (last 12 months)</h3>
        <div className="text-sm text-gray-500">Ksh</div>
      </div>

      <div className="w-full h-36">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <polyline fill="none" stroke="#7c4dff" strokeWidth="1.5" points={points} strokeLinecap="round" strokeLinejoin="round" />
          {/* bars */}
          {data.map((v, i) => {
            const x = (i / data.length) * 100;
            const h = (v / max) * 80;
            return <rect key={i} x={`${x + 1}%`} y={`${100 - h}%`} width="4%" height={`${h}%`} fill="#e9d8ff" />;
          })}
        </svg>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Tip: connect this to your backend for real-time revenue and conversion analytics.
      </div>
    </section>
  );
}
