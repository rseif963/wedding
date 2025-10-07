"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

export default function ClientOnboardingPage() {
  const router = useRouter();
  const { updateClientProfile } = useAppContext();

  const [formData, setFormData] = useState({
    brideName: "",
    groomName: "",
    weddingDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔹 Save formData to backend using AppContext
    const updated = await updateClientProfile(formData);

    if (updated) {
      // 🔹 Redirect to client dashboard
      router.push("/dashboard/client");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-[#311970] mb-6 text-center">
          Welcome! 🎉
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Tell us about your wedding to personalize your dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Bride's Name</label>
            <input
              type="text"
              name="brideName"
              value={formData.brideName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#311970]"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Groom's Name</label>
            <input
              type="text"
              name="groomName"
              value={formData.groomName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#311970]"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Wedding Date</label>
            <input
              type="date"
              name="weddingDate"
              value={formData.weddingDate}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#311970]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#311970] text-white py-3 rounded-lg hover:bg-[#261457] transition"
          >
            Save & Continue →
          </button>
        </form>
      </div>
    </main>
  );
}
