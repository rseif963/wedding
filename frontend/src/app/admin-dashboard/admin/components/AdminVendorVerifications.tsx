// src/components/AdminVendorVerifications.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";

type Verification = {
    _id: string;
    verified: boolean;
    documentsUploaded: boolean;
    createdAt: string;
    vendor: {
        _id: string;
        businessName?: string;
        location?: string;
        description?: string;
    };
    nationalIdFront?: string;
    nationalIdBack?: string;
    businessCertificate?: string;
};

export default function AdminVendorVerifications() {
    const [verifications, setVerifications] = useState<Verification[]>([]);
    const [loading, setLoading] = useState(true);
    const [fullImage, setFullImage] = useState<string | null>(null);

    const [selected, setSelected] = useState<Verification | null>(null);

    const fetchVerifications = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/verification"); // admin only
            const data: Verification[] = res.data || [];
            // Sort latest first
            data.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setVerifications(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch verifications");
        } finally {
            setLoading(false);
        }
    };

    const approveVerification = async (id: string) => {
        try {
            await axios.put(`/api/verification/${id}/approve`);
            toast.success("Vendor verified successfully");
            fetchVerifications();
            setSelected(null);
        } catch (err) {
            console.error(err);
            toast.error("Failed to approve verification");
        }
    };

    const denyVerification = async (id: string) => {
        try {
            await axios.delete(`/api/verification/${id}`); // you may need a backend endpoint for deny
            toast.success("Vendor verification denied");
            fetchVerifications();
            setSelected(null);
        } catch (err) {
            console.error(err);
            toast.error("Failed to deny verification");
        }
    };

    useEffect(() => {
        fetchVerifications();
    }, []);

    return (
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                    Vendor Verifications
                </h2>
                <p className="text-sm text-gray-500">
                    Review vendor submitted documents and approve or deny verification
                </p>
            </div>

            <div className="overflow-x-auto">
                {loading ? (
                    <p className="text-gray-500">Loading verifications...</p>
                ) : verifications.length === 0 ? (
                    <p className="text-gray-500">No vendor verifications found.</p>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-500 border-b">
                            <tr>
                                <th className="py-4">Business Name</th>
                                <th className="py-4">Location</th>
                                <th className="py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {verifications.map((v) => (
                                <tr
                                    key={v._id}
                                    className="border-b last:border-0 hover:bg-gray-50"
                                >
                                    <td className="py-4 font-medium text-gray-900">
                                        {v.vendor?.businessName || "-"}
                                    </td>
                                    <td className="py-4 text-gray-600">
                                        {v.vendor?.location || "-"}
                                    </td>

                                    <td className="py-4 text-right">
                                        <button
                                            onClick={() => setSelected(v)}
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
            {selected && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
                        <h3 className="text-lg font-semibold mb-2">
                            {selected.vendor?.businessName || "-"}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            {selected.vendor?.location || "-"}
                        </p>
                        {selected.vendor?.description && (
                            <p className="text-gray-700 mb-4">{selected.vendor.description}</p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {selected.nationalIdFront && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">National ID Front</p>
                                    <img
                                        src={selected.nationalIdFront}
                                        alt="National ID Front"
                                        className="rounded-lg border w-full object-cover cursor-pointer"
                                        onClick={() => setFullImage(selected.nationalIdFront!)}
                                    />
                                </div>
                            )}
                            {selected.nationalIdBack && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">National ID Back</p>
                                    <img
                                        src={selected.nationalIdBack}
                                        alt="National ID Back"
                                        className="rounded-lg border w-full object-cover cursor-pointer"
                                        onClick={() => setFullImage(selected.nationalIdBack!)}
                                    />
                                </div>
                            )}
                            {selected.businessCertificate && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Business Certificate</p>
                                    <img
                                        src={selected.businessCertificate}
                                        alt="Business Certificate"
                                        className="rounded-lg border w-full object-cover cursor-pointer"
                                        onClick={() => setFullImage(selected.businessCertificate!)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => denyVerification(selected._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                            >
                                Reject Verification
                            </button>
                            <button
                                onClick={() => approveVerification(selected._id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                            >
                                Approve Verification
                            </button>
                            <button
                                onClick={() => setSelected(null)}
                                className="px-4 py-2 text-gray-500 rounded-lg text-sm hover:bg-gray-100"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {fullImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    onClick={() => setFullImage(null)}
                >
                    <img
                        src={fullImage}
                        alt="Full Image"
                        className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                    />
                </div>
            )}

        </section>
    );
}
