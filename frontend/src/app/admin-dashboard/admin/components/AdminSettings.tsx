"use client";

export default function AdminSettings() {
  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3">Settings</h3>
      <form className="space-y-4">
        <div>
          <label className="text-sm text-gray-600">Site Name</label>
          <input className="w-full border p-3 rounded mt-1" defaultValue="Wedpine" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Support Email</label>
          <input className="w-full border p-3 rounded mt-1" defaultValue="support@wedpine.com" />
        </div>
        <button className="bg-[#7c4dff] text-white px-4 py-2 rounded">Save</button>
      </form>
    </section>
  );
}
