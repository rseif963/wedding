"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { ArrowLeft, MapPin, X } from "lucide-react";

const COUNTIES = [
  "Nairobi","Mombasa","Kiambu","Nakuru","Machakos","Kajiado","Uasin Gishu",
  "Nyeri","Meru","Embu","Laikipia","Kisumu","Kericho","Bomet","Narok",
  "Murang'a","Kirinyaga","Nyandarua","Tharaka Nithi","Isiolo","Garissa",
  "Wajir","Mandera","Marsabit","Samburu","Turkana","West Pokot",
  "Trans Nzoia","Elgeyo Marakwet","Nandi","Bungoma","Busia","Kakamega",
  "Vihiga","Siaya","Homa Bay","Migori","Kisii","Nyamira","Taita Taveta",
  "Kwale","Kilifi","Lamu","Tana River",
];

export default function LocationPage() {
  const { updateVendorProfile } = useAppContext();
  const router = useRouter();

  const [progress, setProgress] = useState(20);
  const [animateIn, setAnimateIn] = useState(false);

  const [county, setCounty] = useState("");
  const [serviceAreaInput, setServiceAreaInput] = useState("");
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setProgress(37.5));

    const played = localStorage.getItem("onboarding-location-animated");
    if (!played) {
      setAnimateIn(true);
      localStorage.setItem("onboarding-location-animated", "true");
    }
  }, []);

  const addServiceArea = () => {
    const value = serviceAreaInput.trim();
    if (value && !serviceAreas.includes(value)) {
      setServiceAreas(prev => [...prev, value]);
      setServiceAreaInput("");
    }
  };

  const removeServiceArea = (area: string) => {
    setServiceAreas(prev => prev.filter(a => a !== area));
  };

  const canContinue = county && serviceAreas.length > 0;

  /** SAVE LOCATION + SERVICE AREAS */
  const handleContinue = async () => {
    if (!canContinue) return;

    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("location", county);
      fd.append("serviceAreas", JSON.stringify(serviceAreas));

      const updated = await updateVendorProfile(fd);

      if (updated) {
        router.push("/vdashboard/onboard/packages");
      }
    } catch (err) {
      console.error("Failed to save location", err);
      alert("Failed to save location. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="border-b border-[#EEEAF6]">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link
            href="/vdashboard/onboard/category"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEEAF6] text-[#3B1D82] hover:bg-[#F6F4FB]"
          >
            <ArrowLeft size={18} />
          </Link>
        </div>

        {/* PROGRESS */}
        <div className="mx-auto max-w-6xl px-6 pb-6">
          <div className="h-2 w-full rounded-full bg-[#EEEAF6] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#3B1D82] transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-3 flex justify-between text-[14px]">
            <span className="text-[#6B5FA7]">Step 3 of 8</span>
            <span className="font-medium text-[#3B1D82]">37.5% complete</span>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main
        className={`mx-auto max-w-3xl px-6 py-16 transition-all duration-700
        ${animateIn ? "opacity-100 translate-y-0" : ""}`}
      >
        <h1 className="text-center text-[48px] font-semibold text-[#3B1D82]">
          Where are you based?
        </h1>

        <p className="mt-3 text-center text-[18px] text-[#6B5FA7]">
          Help couples in your area find you
        </p>

        <div className="mt-10 rounded-xl bg-[#F6F4FB] px-6 py-4 text-center text-[15px] text-[#3B1D82]">
          💡 Being specific about your location improves your visibility
        </div>

        {/* FORM CARD */}
        <div className="mt-10 rounded-2xl bg-white px-10 py-10 shadow-[0_20px_40px_rgba(59,29,130,0.08)]">
          <div className="mb-8 flex items-center gap-3 rounded-xl bg-[#F6F4FB] px-4 py-3 text-[14px] text-[#3B1D82]">
            <MapPin size={18} />
            <span>Your location helps us show you to nearby couples</span>
          </div>

          {/* COUNTY */}
          <div className="mb-6">
            <label className="mb-2 block text-[14px] font-medium text-[#3B1D82]">
              County
            </label>
            <select
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="w-full rounded-xl border border-[#E6E1F2] px-4 py-3"
            >
              <option value="">Select county</option>
              {COUNTIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* SERVICE AREAS */}
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#3B1D82]">
              Service areas
            </label>

            <div className="relative">
              <input
                value={serviceAreaInput}
                onChange={(e) => setServiceAreaInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addServiceArea();
                  }
                }}
                placeholder="Type an area and press Enter"
                className="w-full rounded-xl border border-[#E6E1F2] px-4 py-3 pr-12"
              />
              <button
                onClick={addServiceArea}
                disabled={!serviceAreaInput.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#3B1D82] text-white disabled:opacity-40"
              >
                +
              </button>
            </div>

            {serviceAreas.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {serviceAreas.map(area => (
                  <div
                    key={area}
                    className="flex items-center gap-2 rounded-full bg-[#F6F4FB] px-4 py-2 text-[14px]"
                  >
                    {area}
                    <button onClick={() => removeServiceArea(area)}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CONTINUE */}
          <div className="mt-10 flex justify-end">
            <button
              onClick={handleContinue}
              disabled={!canContinue || saving}
              className={`rounded-2xl px-12 py-4 text-white font-medium
              ${saving ? "bg-[#B8AED8]" : "bg-[#3B1D82] hover:opacity-90"}`}
            >
              {saving ? "Saving..." : "Continue"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
