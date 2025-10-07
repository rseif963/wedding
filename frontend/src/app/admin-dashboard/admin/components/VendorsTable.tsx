"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MoreVertical } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

type Vendor = {
  _id: string;
  businessName?: string;
  category?: string;
  location?: string;
  phone?: string;
  status?: "active" | "pending" | "suspended";
  featured?: boolean;
  menuOpen?: boolean;
};

export default function VendorsTable() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  // Fetch all vendors
  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/vendors`);
      const vendorsWithState = (res.data || []).map((v: Vendor) => ({
        ...v,
        featured: !!v.featured,
        menuOpen: false,
      }));
      setVendors(vendorsWithState);
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
      toast.error("Failed to load vendors");
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle the three-dot menu for a vendor
  const toggleMenu = (id: string) => {
    setVendors((prev) =>
      prev.map((v) => ({
        ...v,
        menuOpen: v._id === id ? !v.menuOpen : false,
      }))
    );
  };

  // Toggle featured state for a vendor
  const toggleFeatured = async (id: string, current: boolean) => {
    setVendors((prev) =>
      prev.map((v) =>
        v._id === id ? { ...v, featured: !current, menuOpen: false } : v
      )
    );

    try {
      await axios.put(`${API_URL}/api/vendors/${id}/feature`, {
        featured: !current,
      });
      toast.success(!current ? "Vendor marked as featured" : "Vendor removed from featured");
    } catch (err) {
      console.error("Failed to toggle featured:", err);
      toast.error("Failed to update vendor");
      // Rollback
      setVendors((prev) =>
        prev.map((v) => (v._id === id ? { ...v, featured: current } : v))
      );
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin-dashboard/admin"
            className="flex items-center text-sm text-gray-600 hover:text-[#7c4dff]"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </Link>
          <h3 className="text-lg font-semibold">Vendors</h3>
        </div>

        <Link
          href="/admin-dashboard/admin/vendors"
          className="text-sm text-[#7c4dff] hover:underline"
        >
          View all
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-gray-500">Loading vendors...</p>
        ) : vendors.length === 0 ? (
          <p className="text-gray-500">No vendors found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2">Business Name</th>
                <th className="py-2">Category</th>
                <th className="py-2">Location</th>
                <th className="py-2">Phone</th>
                <th className="py-2">Status</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 flex items-center gap-2">
                    <span className="font-medium">{v.businessName || "—"}</span>
                    {v.featured && (
                      <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                        ⭐ Featured
                      </span>
                    )}
                  </td>
                  <td className="py-3">{v.category || "—"}</td>
                  <td className="py-3">{v.location || "—"}</td>
                  <td className="py-3">{v.phone || "N/A"}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        v.status === "active"
                          ? "bg-green-100 text-green-700"
                          : v.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {v.status || "N/A"}
                    </span>
                  </td>
                  <td className="py-3 text-right relative">
                    <button
                      onClick={() => toggleMenu(v._id)}
                      aria-haspopup="true"
                      aria-expanded={v.menuOpen}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {v.menuOpen && (
                      <div
                        className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        <div className="py-1">
                          <button
                            onClick={() => toggleFeatured(v._id, !!v.featured)}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            {v.featured ? "Remove from Featured" : "Mark as Featured"}
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
