"use client";

import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountBasicsPage() {
  const { vendorProfile, updateVendorProfile } = useAppContext();
  const router = useRouter();

  const [progress, setProgress] = useState(0);
  const [animateIn, setAnimateIn] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    phone: "",
    website: "",
  });

  useEffect(() => {
    requestAnimationFrame(() => setProgress(12.5));

    const played = localStorage.getItem("onboarding-account-basics-animated");
    if (!played) {
      setAnimateIn(true);
      localStorage.setItem("onboarding-account-basics-animated", "true");
    }
  }, []);

  /** PREFILL IF DATA EXISTS */
  useEffect(() => {
    if (vendorProfile) {
      setFormData({
        businessName: vendorProfile.businessName || "",
        phone: vendorProfile.phone || "",
        website: vendorProfile.website || "",
      });
    }
  }, [vendorProfile]);

  /** HANDLE INPUT CHANGE */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /** SAVE TO MONGODB */
  const handleContinue = async () => {
    setSaving(true);

    const updated = await updateVendorProfile({
      businessName: formData.businessName,
      phone: formData.phone,
      website: formData.website,
    });

    if (updated) {
      router.push("/vdashboard/vendor/onboarding/category");
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="border-b border-[#EEEAF6]">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between" />

        {/* PROGRESS */}
        <div className="mx-auto max-w-6xl px-6 pb-6">
          <div className="h-2 w-full rounded-full bg-[#EEEAF6] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#3B1D82] transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-3 flex justify-between text-[14px]">
            <span className="text-[#6B5FA7]">Step 1 of 8</span>
            <span className="font-medium text-[#3B1D82]">12.5% complete</span>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main
        className={`mx-auto max-w-3xl px-6 py-16 transition-all duration-700 ease-out
        ${animateIn ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}
      >
        <h1 className="text-center text-[48px] font-semibold text-[#3B1D82]">
          Account Basics
        </h1>

        <p className="mt-3 text-center text-[18px] text-[#6B5FA7]">
          Tell us about you and your business
        </p>

        <div className="mt-10 rounded-xl bg-[#F6F4FB] px-6 py-4 text-center text-[15px] text-[#3B1D82]">
          💡 This information helps couples find and contact you
        </div>

        {/* FORM */}
        <div className="mt-10 rounded-2xl bg-white px-10 py-10 shadow-[0_20px_40px_rgba(59,29,130,0.08)]">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#3B1D82]">
                Business Name
              </label>
              <input
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Your Wedding Studio"
                className="w-full rounded-xl border border-[#E6E1F2] px-4 py-3 text-[15px] outline-none focus:border-[#3B1D82]"
              />
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#3B1D82]">
                Phone Number
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+254 712 345 678"
                className="w-full rounded-xl border border-[#E6E1F2] px-4 py-3 text-[15px] outline-none focus:border-[#3B1D82]"
              />
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#3B1D82]">
                Website
              </label>
              <input
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourbusiness.com"
                className="w-full rounded-xl border border-[#E6E1F2] px-4 py-3 text-[15px] outline-none focus:border-[#3B1D82]"
              />
            </div>
          </div>

          {/* CONTINUE */}
          <div className="mt-10 flex justify-end">
            <button
              onClick={handleContinue}
              disabled={saving}
              className={`rounded-2xl px-10 py-4 text-[16px] font-medium text-white shadow-[0_10px_25px_rgba(59,29,130,0.35)] transition
              ${
                saving
                  ? "bg-[#B8AED8] cursor-not-allowed"
                  : "bg-[#3B1D82] hover:opacity-90"
              }`}
            >
              {saving ? "Saving..." : "Continue"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
