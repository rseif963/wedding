// src/components/ProfileManager.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

interface Props {
  preview?: boolean;
}

export default function ProfileManager({ preview = false }: Props) {
  const { vendorProfile, updateVendorProfile, fetchVendorMe } = useAppContext();

  const [formData, setFormData] = useState({
    businessName: "",
    category: "",
    location: "",
    website: "",
    description: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const categories = [
    "Photography",
    "Venue",
    "Decoration",
    "Catering",
    "Makeup & Beauty",
    "Dresses",
    "Tailor",
    "Cars",
    "Cake",
    "Music & Entertainment",
  ];

  const counties = [
    "Baringo","Bomet","Bungoma","Busia","Elgeyo-Marakwet","Embu","Garissa",
    "Homa Bay","Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi",
    "Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos",
    "Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a",
    "Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri",
    "Samburu","Siaya","Taita-Taveta","Tana River","Tharaka-Nithi","Trans Nzoia",
    "Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot"
  ];

  // Load vendor profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        await fetchVendorMe();
      } finally {
        setInitializing(false);
      }
    };
    loadProfile();
  }, [fetchVendorMe]);

  // Sync formData only when profile first loads OR when not editing
  useEffect(() => {
    if (vendorProfile && !isEditing) {
      setFormData({
        businessName: vendorProfile.businessName || "",
        category: vendorProfile.category || "",
        location: vendorProfile.location || "",
        website: vendorProfile.website || "",
        description: vendorProfile.description || "",
      });
    } else if (!vendorProfile) {
      setIsEditing(true); // if no profile, show setup form
    }
  }, [vendorProfile, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updated = await updateVendorProfile(formData);
    if (updated) {
      await fetchVendorMe();
      setIsEditing(false);
    }

    setLoading(false);
  };

  // Initial loading indicator
  if (initializing) {
    return (
      <section className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">Loading profile...</p>
      </section>
    );
  }

  // PREVIEW mode: compact card
  if (preview) {
    return (
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Profile</h2>
        <div>
          <p className="text-gray-700 font-medium">
            {vendorProfile?.businessName || "Business Name"}
          </p>
          <p className="text-sm text-gray-500">
            {vendorProfile?.category || "Category"} • {vendorProfile?.location || "Location"}
          </p>
        </div>
      </section>
    );
  }

  // Details view
  if (!isEditing && vendorProfile) {
    return (
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Profile</h2>
        <div>
          <p className="text-gray-700 font-medium">
            {vendorProfile.businessName}
          </p>
          <p className="text-sm text-gray-500">
            {vendorProfile.category} • {vendorProfile.location}
          </p>
          {vendorProfile.website && (
            <a
              href={vendorProfile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600"
            >
              {vendorProfile.website}
            </a>
          )}
          {vendorProfile.description && (
            <p className="mt-2 text-gray-600">{vendorProfile.description}</p>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Edit Profile
          </button>
        </div>
      </section>
    );
  }

  // Form view
  return (
    <section className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">My Profile</h2>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="businessName"
          placeholder="Business Name"
          value={formData.businessName}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        {/* Category Dropdown */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Location Dropdown */}
        <select
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        >
          <option value="">Select County</option>
          {counties.map((county) => (
            <option key={county} value={county}>{county}</option>
          ))}
        </select>

        <input
          type="url"
          name="website"
          placeholder="Website"
          value={formData.website}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <textarea
          name="description"
          placeholder="Business Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-3 rounded-lg md:col-span-2"
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#311970] text-white py-3 rounded-lg hover:bg-[#261457] md:col-span-2 disabled:opacity-70"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </section>
  );
}
