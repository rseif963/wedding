"use client";

import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

export default function FeaturedVendors() {
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

  // ✅ Fetch reviews for featured vendors only
  useEffect(() => {
    let mounted = true;

    const loadVendorReviews = async () => {
      if (!posts || posts.length === 0) return;

      const featuredIds = Array.from(
        new Set(
          posts
            .filter((p) => p.vendor?.featured)
            .map((p) => p.vendor?._id)
            .filter(Boolean)
            .map(String)
        )
      );

      if (featuredIds.length === 0) return;

      try {
        const promises = featuredIds.map((id) =>
          axios
            .get(`${API_URL}/api/reviews/vendor/${id}`)
            .then((res) => ({ id, data: Array.isArray(res.data) ? res.data : [] }))
            .catch(() => ({ id, data: [] }))
        );

        const results = await Promise.all(promises);
        if (!mounted) return;

        const map: Record<string, any[]> = {};
        results.forEach((r) => {
          map[r.id] = r.data;
        });
        setVendorReviewsMap(map);
      } catch (err) {
        console.error("Failed to load featured vendor reviews:", err);
      }
    };

    loadVendorReviews();
    return () => {
      mounted = false;
    };
  }, [posts]);

  const toggleLike = (id: string) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ Only featured vendors, limit 12
  const featuredPosts = (posts || [])
    .filter((post) => post.vendor?.featured === true)
    .slice(0, 12);

  return (
    <section className="py-10 bg-gray-50 w-full">
      <div className="max-w-6xl mx-auto px-3">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Featured Vendors
        </h2>

        {featuredPosts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-600">
              No featured vendors available yet.
            </h3>
            <p className="text-gray-500 mt-2">
              Please check back soon — new vendors are added frequently.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredPosts.map((post) => {
              const v = post.vendor;
              const imageUrl = getFullUrl(post.mainPhoto || v?.logo);

              const vendorId = v?._id ? String(v._id) : "";
              const vendorReviews = vendorId ? vendorReviewsMap[vendorId] || [] : [];

              const avgRating =
                vendorReviews.length > 0
                  ? vendorReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                  vendorReviews.length
                  : 0;

              return (
                <Link
                  key={post._id}
                  href={`/vendors/${post._id}`}
                  className="relative bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition block"
                >
                  {/* ✅ Featured Badge */}
                  {v?.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-semibold rounded">
                      ⭐ Featured
                    </div>
                  )}

                  {/* Like Button */}
                  <button
                    className="absolute top-3 right-3 z-10 bg-white/80 rounded-full p-1 hover:bg-red-100 transition"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleLike(post._id);
                    }}
                  >
                    <Heart
                      className={`w-5 h-5 transition ${liked.includes(post._id)
                          ? "text-red-500 fill-red-500"
                          : "text-red-500"
                        }`}
                    />
                  </button>

                  {/* Image */}
                  <div className="relative h-48 w-full">
                    <Image
                      src={imageUrl}
                      alt={v?.businessName || "Vendor"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Vendor Info */}
                  <div className="p-5">
                    <h2 className="text-xl font-bold text-[#311970] truncate">
                      {v?.businessName}
                    </h2>
                    <p className="text-gray-600">{v?.category}</p>
                    <p className="text-gray-500 text-sm">
                      {v?.location ? `${v.location}, Kenya` : "Kenya"}
                    </p>

                    {/* ✅ Dynamic Stars */}
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.round(avgRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                            }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        {avgRating > 0
                          ? `${avgRating.toFixed(1)} (${vendorReviews.length})`
                          : "No reviews yet"}
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

        <div className="text-center mt-12">
          <Link
            href="/vendors"
            className="inline-block bg-[#311970] text-white px-6 py-3 rounded-lg shadow hover:bg-[#261457] transition"
          >
            Explore More Vendors
          </Link>
        </div>
      </div>
    </section>
  );
}
