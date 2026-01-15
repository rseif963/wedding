"use client";

import React, { useEffect, useState } from "react";
import { Eye, Star, Search } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

type Vendor = {
  _id: string;
  businessName?: string;
  category?: string;
  location?: string;
  phone?: string;
  email?: string;
  rating?: number;
  reviewsCount?: number;
  featured?: boolean;
};

export default function VendorsTable() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorRatings, setVendorRatings] = useState<
    Record<string, { avg: number; count: number }>
  >({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const fetchVendors = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/vendors`);
      setVendors(res.data || []);
      const ratingMap: Record<string, { avg: number; count: number }> = {};

      await Promise.all(
        res.data.map(async (vendor: Vendor) => {
          try {
            const r = await axios.get(
              `${API_URL}/api/reviews/vendor/${vendor._id}`
            );

            const reviews = Array.isArray(r.data) ? r.data : [];
            const total = reviews.reduce(
              (sum: number, rev: any) => sum + (rev.rating || 0),
              0
            );

            ratingMap[vendor._id] = {
              avg: reviews.length ? total / reviews.length : 0,
              count: reviews.length,
            };
          } catch {
            ratingMap[vendor._id] = { avg: 0, count: 0 };
          }
        })
      );

      setVendorRatings(ratingMap);

    } catch {
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };


  const toggleFeatured = async (vendor: Vendor) => {
    try {
      await axios.put(`${API_URL}/api/vendors/${vendor._id}/feature`, {
        featured: !vendor.featured,
      });
      toast.success(
        vendor.featured
          ? "Removed from featured"
          : "Marked as featured"
      );
      fetchVendors();
      setSelectedVendor(null);
    } catch {
      toast.error("Failed to update vendor");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter((v) =>
    v.businessName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Vendor Management
        </h2>
        <p className="text-sm text-gray-500">
          Manage and review vendor applications
        </p>
      </div>

      {/* SEARCH */}
      <div className="mb-6 flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
        <Search size={18} className="text-gray-400" />
        <input
          placeholder="Search vendors..."
          className="w-full bg-transparent outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-gray-500">Loading vendors...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-4 text-left">Vendor</th>
                <th className="py-4 text-left">Category</th>
                <th className="py-4 text-left">Location</th>
                <th className="py-4 text-left">Rating</th>
                <th className="py-4 text-left">Contact</th>
                <th className="py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredVendors.map((v) => (
                <tr
                  key={v._id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="py-4 font-medium text-gray-900">
                    {v.businessName}
                    {v.featured && (
                      <span className="ml-2 text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                        Featured
                      </span>
                    )}
                  </td>

                  <td className="py-4">
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                      {v.category || "—"}
                    </span>
                  </td>

                  <td className="py-4 text-gray-600">
                    {v.location || "—"}
                  </td>

                  <td className="py-4">
                    <div className="flex items-center gap-1">
                      <Star
                        size={16}
                        className="text-orange-400 fill-orange-400"
                      />
                      <span className="font-medium">
                        {vendorRatings[v._id]?.avg
                          ? vendorRatings[v._id].avg.toFixed(1)
                          : "0.0"}
                      </span>
                      <span className="text-gray-400">
                        ({vendorRatings[v._id]?.count || 0})
                      </span>
                    </div>
                  </td>

                  <td className="py-4 text-gray-600">
                    <div className="flex flex-col">
                      <span>{v.phone || "—"}</span>
                      <span className="text-xs text-gray-400">
                        {v.email || ""}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 text-right">
                    <button
                      onClick={() => setSelectedVendor(v)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">
              {selectedVendor.businessName}
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              {selectedVendor.category} • {selectedVendor.location}
            </p>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Phone:</strong> {selectedVendor.phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedVendor.email}
              </p>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => toggleFeatured(selectedVendor)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm"
              >
                {selectedVendor.featured
                  ? "Remove Featured"
                  : "Mark as Featured"}
              </button>

              <button
                onClick={() => setSelectedVendor(null)}
                className="text-sm text-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
