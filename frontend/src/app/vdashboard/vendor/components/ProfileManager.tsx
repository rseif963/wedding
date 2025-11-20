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
    phone: "",
    email: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Photography","Venue","Decoration","Catering","Makeup & Beauty",
    "Dresses","Tailor","Cars","Cake","Music & Entertainment",
  ];

  const counties = [
    "Baringo","Bomet","Bungoma","Busia","Elgeyo-Marakwet","Embu","Garissa",
    "Homa Bay","Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi",
    "Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos",
    "Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a",
    "Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri",
    "Samburu","Siaya","Taita-Taveta","Tana River","Tharaka-Nithi",
    "Trans Nzoia","Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot",
  ];

  // ✔️ Fetch *only once* when the component mounts
  useEffect(() => {
    fetchVendorMe();
  }, []); // <-- EMPTY ARRAY (IMPORTANT FIX)

  // ✔️ Update form only when NOT editing
  useEffect(() => {
    if (vendorProfile && !isEditing) {
      setFormData({
        businessName: vendorProfile.businessName || "",
        category: vendorProfile.category || "",
        location: vendorProfile.location || "",
        website: vendorProfile.website || "",
        description: vendorProfile.description || "",
        phone: vendorProfile.phone || "",
        email: vendorProfile.email || "",
      });
    }
  }, [vendorProfile, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updated = await updateVendorProfile(formData);
    if (updated) {
      setIsEditing(false);
    }

    setLoading(false);
  };

  // Preview mode
  if (preview) {
    return (
      <section className="bg-white backdrop-blur-sm p-2 rounded-2xl border border-gray-100 transition hover:shadow-md">
        <h2 className="text-2xl text-center font-semibold text-[#311970] mb-4">My Profile</h2>
        <div>
          <p className="text-gray-800 font-medium text-lg">
            {vendorProfile?.businessName || "Business Name"}
          </p>
          <p className="text-sm text-gray-500">
            {vendorProfile?.category || "Category"} • {vendorProfile?.location || "Location"}
          </p>
        </div>
      </section>
    );
  }

  // Display profile
  if (!isEditing && vendorProfile) {
    return (
      <section className="bg-gradient-to-br w-full max-w-full overflow-hidden from-white to-gray-50 p-2 sm:p-4 rounded-2xl shadow-md border border-gray-100 transition hover:shadow-lg">
        <h5 className="text-2xl text-center font-bold text-purple-700 mb-5">My Profile</h5>

        <div className="space-y-2 w-full break-words">
          <h3 className="text-lg font-semibold text-gray-800">{vendorProfile.businessName}</h3>
          <p className="text-sm text-gray-500">
            {vendorProfile.category} • {vendorProfile.location}
          </p>

          {vendorProfile.email && (
            <p className="text-sm text-gray-600"><strong>Email:</strong> {vendorProfile.email}</p>
          )}

          {vendorProfile.phone && (
            <p className="text-sm text-gray-600"><strong>Phone:</strong> {vendorProfile.phone}</p>
          )}

          {vendorProfile.website && (
            <a href={vendorProfile.website} target="_blank" rel="noopener noreferrer"
               className="inline-block mt-2 text-sm font-medium text-[#311970] hover:underline break-all">
              {vendorProfile.website}
            </a>
          )}

          {vendorProfile.description && (
            <p className="mt-3 text-gray-700 leading-relaxed break-words">
              {vendorProfile.description}
            </p>
          )}

          <button
            onClick={() => setIsEditing(true)}
            className="mt-5 inline-block bg-[#311970] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#261457] transition-all shadow-sm"
          >
            Edit Profile
          </button>
        </div>
      </section>
    );
  }

  // Editing Form
  return (
    <section className="bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-2xl shadow-md border border-gray-100 transition hover:shadow-lg">
      <h5 className="text-2xl text-center font-bold text-[#311970] mb-6">My Profile</h5>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-2">Business Name</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#311970] w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#311970] w-full"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-2">Location</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#311970] w-full"
          >
            <option value="">Select County</option>
            {counties.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-2">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#311970] w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#311970] w-full"
          />
        </div>

      {/*  <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#311970] w-full"
          />
        </div> */}

        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-semibold text-gray-700 mb-2">Business Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl px-4 py-3 min-h-[120px] focus:ring-2 focus:ring-[#311970] w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 mt-4 bg-[#311970] text-white py-3 rounded-xl font-semibold shadow-md hover:bg-[#261457] transition disabled:opacity-70"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </section>
  );
}
