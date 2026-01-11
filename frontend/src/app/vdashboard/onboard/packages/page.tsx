"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import { ArrowLeft, Plus, X, Check } from "lucide-react";

type PackageItem = {
  name: string;
  price: number;
  currency: "Ksh";
  features: string[];
};

export default function PackagesPage() {
  const { updateVendorProfile } = useAppContext();
  const router = useRouter();

  const [progress, setProgress] = useState(30);
  const [animateIn, setAnimateIn] = useState(false);

  const [tier, setTier] = useState("");
  const [price, setPrice] = useState("");

  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState<string[]>([]);

  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setProgress(50));
    const played = localStorage.getItem("onboarding-packages-animated");
    if (!played) {
      setAnimateIn(true);
      localStorage.setItem("onboarding-packages-animated", "true");
    }
  }, []);

  const formatPrice = (value: string) =>
    value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const savePackage = () => {
    if (!tier || !price || features.length === 0) return;

    const payload: PackageItem = {
      name: tier,
      price: Number(price.replace(/,/g, "")),
      currency: "Ksh",
      features,
    };

    if (editingIndex !== null) {
      const updated = [...packages];
      updated[editingIndex] = payload;
      setPackages(updated);
      setEditingIndex(null);
    } else {
      setPackages(prev => [...prev, payload]);
    }

    setTier("");
    setPrice("");
    setFeatures([]);
    setFeatureInput("");
  };

  const editPackage = (pkg: PackageItem, index: number) => {
    setTier(pkg.name);
    setPrice(pkg.price.toString());
    setFeatures(pkg.features);
    setEditingIndex(index);
  };

  /** 🔥 SAVE TO MONGODB */
  const handleContinue = async () => {
    if (packages.length === 0) return;

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("pricingPackages", JSON.stringify(packages));

      const updated = await updateVendorProfile(fd);

      if (updated) {
        router.push("/vdashboard/onboard/portfolio");
      }
    } catch (err) {
      console.error("Failed to save packages", err);
      alert("Failed to save packages. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="border-b border-[#EEEAF6]">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <Link
            href="/vdashboard/onboard/location"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEEAF6]"
          >
            <ArrowLeft size={18} />
          </Link>
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-6">
          <div className="h-2 w-full rounded-full bg-[#EEEAF6] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#3B1D82] transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex justify-between text-[14px]">
            <span className="text-[#6B5FA7]">Step 4 of 8</span>
            <span className="font-medium text-[#3B1D82]">50% complete</span>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-center text-[48px] font-semibold text-[#3B1D82]">
          Services & Packages
        </h1>

        <p className="mt-3 text-center text-[18px] text-[#6B5FA7]">
          Showcase what you offer to couples
        </p>

        <div className="mt-10 rounded-2xl bg-white px-10 py-10 shadow space-y-6">
          <div>
            <label className="block text-sm font-medium">Package type</label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="">Select package</option>
              <option>Essential</option>
              <option>Premium</option>
              <option>Luxury</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              value={`Ksh ${price}`}
              onChange={(e) =>
                setPrice(formatPrice(e.target.value.replace("Ksh", "")))
              }
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <ChipInput
            label="Features / Offerings"
            placeholder="Add a feature"
            value={featureInput}
            setValue={setFeatureInput}
            list={features}
            setList={setFeatures}
          />

          <div className="flex justify-end">
            <button
              onClick={savePackage}
              className="rounded-xl bg-[#3B1D82] px-10 py-3 text-white"
            >
              Save package
            </button>
          </div>

          {/* SAVED PACKAGES INSIDE FORM */}
          {packages.length > 0 && (
            <div className="pt-8 space-y-4">
              {packages.map((pkg, index) => (
                <div
                  key={index}
                  onClick={() => editPackage(pkg, index)}
                  className="cursor-pointer rounded-xl border border-[#EEEAF6] bg-white px-6 py-4 hover:bg-[#F6F4FB]"
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-[#3B1D82]">
                      {pkg.name}
                    </div>
                    <div className="font-semibold text-[#3B1D82]">
                      Ksh {pkg.price}
                    </div>
                  </div>

                  <ul className="mt-3 space-y-2 text-[14px] text-[#6B5FA7]">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check size={16} className="text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CONTINUE */}
        <div className="mt-14 flex justify-end">
          <button
            onClick={handleContinue}
            className="rounded-2xl bg-[#3B1D82] px-14 py-4 text-white disabled:opacity-40"
          >
            {saving ? "Saving..." : "Continue"}
          </button>
        </div>
      </main>
    </div>
  );
}

/* CHIP INPUT */
function ChipInput({ label, placeholder, value, setValue, list, setList }: any) {
 return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <div className="relative">
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (value.trim()) {
                setList([...list, value.trim()]);
                setValue("");
              }
            }
          }}
          className="w-full rounded-xl border px-4 py-3 pr-12"
        />
        <button
          onClick={() => {
            if (value.trim()) {
              setList([...list, value.trim()]);
              setValue("");
            }
          }}
          className="absolute right-6 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#3B1D82] text-white flex items-center justify-center"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {list.map((item: string) => (
          <div key={item} className="flex items-center gap-2 rounded-full bg-[#F6F4FB] px-4 py-2">
            {item}
            <button onClick={() => setList(list.filter((i: string) => i !== item))}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
