"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import {
  Camera,
  Utensils,
  Building2,
  Music,
  Sparkles,
  Shirt,
  Heart,
  Flower2,
  Car,
  Cake,
  Scissors,
  Palette,
  Mic,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react";

const VENDOR_CATEGORIES = [
  { label: "Photography", icon: Camera },
  { label: "Catering", icon: Utensils },
  { label: "Venue", icon: Building2 },
  { label: "Entertainment", icon: Music },
  { label: "Decoration", icon: Sparkles },
  { label: "Makeup Artist", icon: Palette },
  { label: "Dresses", icon: Shirt },
  { label: "Groom Wear", icon: Heart },
  { label: "Wedding Planner", icon: Heart },
  { label: "Florist", icon: Flower2 },
  { label: "Cars", icon: Car },
  { label: "Cake", icon: Cake },
  { label: "Tailor", icon: Scissors },
  { label: "Makeup & Beauty", icon: Sparkles },
  { label: "MC / Host", icon: Mic },
  { label: "Other", icon: MoreHorizontal },
];

export default function CategoryPage() {
  const { updateVendorProfile } = useAppContext();
  const router = useRouter();

  const [progress, setProgress] = useState(10);
  const [animateIn, setAnimateIn] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [otherValue, setOtherValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setProgress(25));

    const played = localStorage.getItem("onboarding-category-animated");
    if (!played) {
      setAnimateIn(true);
      localStorage.setItem("onboarding-category-animated", "true");
    }
  }, []);

  /** SAVE CATEGORY TO MONGODB */
  const handleContinue = async () => {
    if (!selected) return;

    setSaving(true);

    const category =
      selected === "Other" ? otherValue.trim() : selected;

    const updated = await updateVendorProfile({
      category,
    });

    if (updated) {
      router.push("/vdashboard/vendor/onboarding/location");
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="border-b border-[#EEEAF6]">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <div className="flex flex-col items-start gap-4">
            <Link
              href="/vdashboard/vendor/onboarding/account-basics"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEEAF6] text-[#3B1D82] hover:bg-[#F6F4FB] transition"
            >
              <ArrowLeft size={18} />
            </Link>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mx-auto max-w-6xl px-6 pb-6">
          <div className="h-2 w-full rounded-full bg-[#EEEAF6] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#3B1D82] transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-3 flex justify-between text-[14px]">
            <span className="text-[#6B5FA7]">Step 2 of 8</span>
            <span className="font-medium text-[#3B1D82]">25% complete</span>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main
        className={`mx-auto max-w-4xl px-6 py-16 transition-all duration-700 ease-out
        ${animateIn ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}
      >
        <h1 className="text-center text-[48px] font-semibold text-[#3B1D82]">
          What do you offer?
        </h1>

        <p className="mt-3 text-center text-[18px] text-[#6B5FA7]">
          Select the category that best describes your business
        </p>

        <div className="mt-10 rounded-xl bg-[#F6F4FB] px-6 py-4 text-center text-[15px] text-[#3B1D82]">
          💡 You can only choose one category
        </div>

        {/* CATEGORY GRID */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {VENDOR_CATEGORIES.map(({ label, icon: Icon }) => {
            const isSelected = selected === label;

            return (
              <button
                key={label}
                onClick={() => setSelected(label)}
                className={`relative rounded-2xl px-6 py-10 text-center transition-all
                ${
                  isSelected
                    ? "border-2 border-[#3B1D82] bg-[#F6F4FB]"
                    : "border border-[#EEEAF6] hover:border-[#3B1D82]/40"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-[#3B1D82] flex items-center justify-center">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B1D82] text-white">
                  <Icon size={26} />
                </div>

                <div className="mt-5 text-[16px] font-medium text-[#3B1D82]">
                  {label}
                </div>
              </button>
            );
          })}
        </div>

        {/* OTHER INPUT */}
        {selected === "Other" && (
          <div className="mt-8">
            <input
              placeholder="Please specify your category"
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
              className="w-full rounded-xl border border-[#E6E1F2] px-4 py-4 text-[15px] outline-none focus:border-[#3B1D82]"
            />
          </div>
        )}

        {/* CONTINUE */}
        <div className="mt-14 flex justify-end">
          <button
            onClick={handleContinue}
            disabled={
              saving || !selected || (selected === "Other" && !otherValue)
            }
            className={`rounded-2xl px-12 py-4 text-[16px] font-medium text-white
            shadow-[0_10px_25px_rgba(59,29,130,0.35)]
            transition
            ${
              saving
                ? "bg-[#B8AED8] cursor-not-allowed"
                : "bg-[#3B1D82] hover:opacity-90"
            }`}
          >
            {saving ? "Saving..." : "Continue"}
          </button>
        </div>
      </main>
    </div>
  );
}
