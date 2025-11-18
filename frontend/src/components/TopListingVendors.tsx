"use client";

import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

export default function TopListingVendors() {
  const { posts, fetchPosts } = useAppContext();
  const [liked, setLiked] = useState<string[]>([]);
  const [vendorReviewsMap, setVendorReviewsMap] = useState<Record<string, any[]>>({});

  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const getFullUrl = (path?: string) => {
    if (!path) return "/assets/vendor-placeholder.jpg";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch reviews for ALL vendors because top listing uses ratings
  useEffect(() => {
    let mounted = true;

    const loadReviews = async () => {
      if (!posts || posts.length === 0) return;

      const ids = Array.from(
        new Set(
          posts
            .map((p) => p.vendor?._id)
            .filter(Boolean)
            .map(String)
        )
      );

      if (ids.length === 0) return;

      try {
        const promises = ids.map((id) =>
          axios
            .get(`${API_URL}/api/reviews/vendor/${id}`)
            .then((res) => ({ id, data: Array.isArray(res.data) ? res.data : [] }))
            .catch(() => ({ id, data: [] }))
        );

        const results = await Promise.all(promises);
        if (!mounted) return;

        const map: Record<string, any[]> = {};
        results.forEach((r) => (map[r.id] = r.data));

        setVendorReviewsMap(map);
      } catch (err) {
        console.error("Failed to load vendor reviews:", err);
      }
    };

    loadReviews();
    return () => {
      mounted = false;
    };
  }, [posts]);

  const toggleLike = (id: string) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // LOGIC: Top Listings = 4.5+ stars OR 10+ reviews
  const calculatedVendors = (posts || []).map((post) => {
    const v = post.vendor;
    const vendorId = v?._id ? String(v._id) : "";

    const reviews = vendorId ? vendorReviewsMap[vendorId] || [] : [];
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        : 0;

    return {
      ...post,
      totalReviews: reviews.length,
      avgRating,
    };
  });

  const topListings = calculatedVendors
    .filter((v) => v.avgRating >= 4.5 || v.totalReviews >= 10)
    .sort((a, b) => b.avgRating - a.avgRating) // highest first
    .slice(0, 12);

  return (
    <section className="py-10 bg-white w-full">
      <div className="max-w-6xl mx-auto px-3">
        <h2 className="text-3xl font-bold text-center mb-10 text-[#311970]">
          Top Listing Vendors
        </h2>

        {topListings.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-600">
              No top listings yet.
            </h3>
            <p className="text-gray-500 mt-2">
              Check back soon — vendors are being updated.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topListings.map((post) => {
              const v = post.vendor;
              const imageUrl = getFullUrl(post.mainPhoto || v?.logo);

              return (
                <Link
                  key={post._id}
                  href={`/vendors/${post._id}`}
                  className="relative bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition block"
                >
                  {/* Like */}
                  <button
                    className="absolute top-3 right-3 z-30 bg-white/80 rounded-full p-1 hover:bg-red-100 transition"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleLike(post._id);
                    }}
                  >
                    <Heart
                      className={`w-5 h-5 transition ${
                        liked.includes(post._id)
                          ? "text-red-500 fill-red-500"
                          : "text-red-500"
                      }`}
                    />
                  </button>

                  {/* Image + Badge */}
                  <div className="relative h-48 w-full">

                    {/* 🔥 Top Listing Badge */}
                    <div className="absolute top-3 left-3 bg-purple-100 text-purple-800 px-2 py-1 text-xs font-semibold rounded z-20">
                      ⭐ Top Listing
                    </div>

                    {/* If they also have 5 stars */}
                    {post.avgRating >= 5 && (
                      <div className="absolute top-3 left-28 bg-green-100 text-green-800 px-2 py-1 text-xs font-semibold rounded z-20">
                        🔥 Top Rated
                      </div>
                    )}

                    <Image
                      src={imageUrl}
                      alt={v?.businessName || "Vendor"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h2 className="text-xl font-bold text-[#311970] truncate">
                      {v?.businessName}
                    </h2>
                    <p className="text-gray-600">{v?.category}</p>
                    <p className="text-gray-500 text-sm">
                      {v?.location ? `${v.location}, Kenya` : "Kenya"}
                    </p>

                    {/* Stars */}
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(post.avgRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {post.avgRating.toFixed(1)} ({post.totalReviews})
                      </span>
                    </div>

                    <p className="text-sm mt-2 text-gray-700">
                      Starting from{" "}
                      <span className="font-semibold">
                        Ksh {post.priceFrom?.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
