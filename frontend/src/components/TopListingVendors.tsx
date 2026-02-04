"use client";

import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BadgeCheck, Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";

export default function TopListingVendors() {
  const { posts, fetchPosts, fetchVendorVerification } = useAppContext();
  const [verifiedVendors, setVerifiedVendors] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const getFullUrl = (path?: string) => {
    if (!path) return "/assets/vendor-placeholder.jpg";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadVerifications = async () => {
      if (!posts || posts.length === 0) return;

      const vendorIds = Array.from(
        new Set(
          posts
            .map((p) => p.vendor?._id)
            .filter(Boolean)
            .map(String)
        )
      );

      const map: Record<string, boolean> = {};

      await Promise.all(
        vendorIds.map(async (id) => {
          try {
            const res = await fetchVendorVerification(id);
            if (!mounted) return;
            map[id] = !!res?.verified;
          } catch {
            map[id] = false;
          }
        })
      );

      if (mounted) setVerifiedVendors(map);
    };

    loadVerifications();

    return () => {
      mounted = false;
    };
  }, [posts, fetchVendorVerification]);

  // ✅ Only Top Listing posts
  const topListingPosts = (posts || [])
    .filter((post) => post.topListing)
    .slice(0, 12);

  // ✅ Click handler
  const handleVendorClick = (vendorId: string, postId: string) => async () => {
    if (!vendorId) return;

    try {
      await axios.post("/api/analytics/profile-view", { vendorId });
      router.push(`/vendors/${postId}`);
    } catch (err) {
      console.error("Profile view tracking failed:", err);
      router.push(`/vendors/${postId}`);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-[#faf8ff] via-[#f5f3ff] to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Top Listing Vendors
          </h1>
          <h2 className="text-muted-foreground text-lg">
            Handpicked professionals loved by couples
          </h2>
        </div>

        {/* Empty state */}
        {topListingPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topListingPosts.map((post) => {
              const v = post.vendor;
              const imageUrl = getFullUrl(post.mainPhoto || v?.profilePhoto || v?.logo);
              const vendorId = v?._id ? String(v._id) : "";

              return (
                <div
                  key={post._id}
                  className="group block cursor-pointer"
                  onClick={handleVendorClick(vendorId, post._id)}
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-elevated hover:shadow-card transition">
                    {/* IMAGE */}
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={imageUrl}
                        alt={v?.businessName || "Vendor"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Top Listing Badge */}
                      {post.topListing && (
                        <div className="absolute top-4 left-4 bg-[#311970] text-white px-2 py-1 text-xs font-semibold rounded-full z-20 flex items-center gap-1">
                          Top Listing
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-[#311970] truncate mb-1 group-hover:text-primary transition-colors">
                        {v?.businessName}
                      </h3>

                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-gray-600 text-sm">{v?.category}</p>
                        {vendorId && verifiedVendors[vendorId] && (
                          <Image
                            src="/assets/verify.png"
                            alt="Wedpine Logo"
                            width={16}
                            height={16}
                            className="object-contain"
                          />
                        )}
                      </div>

                      <p className="text-gray-500 text-sm mb-2">
                        {v?.location ? `${v.location}, Kenya` : "Kenya"}
                      </p>

                      <p className="text-sm text-gray-700">
                        Starting from{" "}
                        <span className="font-semibold">
                          Ksh {post.priceFrom?.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            href="/vendors"
            className="inline-block bg-[#311970] text-white px-8 py-3 rounded-lg shadow hover:bg-[#261457] transition"
          >
            Explore More Vendors
          </Link>
        </div>
      </div>
    </section>
  );
}
