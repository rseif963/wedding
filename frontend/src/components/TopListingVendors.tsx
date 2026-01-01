"use client";

import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

export default function TopListingVendors() {
  const { posts, fetchPosts, countProfileView } = useAppContext();
  const [liked, setLiked] = useState<string[]>([]);
  const [vendorReviewsMap, setVendorReviewsMap] = useState<Record<string, any[]>>({});
  const router = useRouter();

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

  // Load reviews for all vendors
  useEffect(() => {
    let mounted = true;

    const loadReviews = async () => {
      if (!posts || posts.length === 0) return;

      const ids = Array.from(
        new Set(posts.map((p) => p.vendor?._id).filter(Boolean).map(String))
      );

      try {
        const results = await Promise.all(
          ids.map((id) =>
            axios
              .get(`${API_URL}/api/reviews/vendor/${id}`)
              .then((res) => ({ id, data: Array.isArray(res.data) ? res.data : [] }))
              .catch(() => ({ id, data: [] }))
          )
        );

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

  // ⭐ Top Listing Logic
  const calculatedPosts = (posts || []).map((post) => {
    const vendorId = post.vendor?._id ? String(post.vendor._id) : "";
    const reviews = vendorId ? vendorReviewsMap[vendorId] || [] : [];

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        : 0;

    return {
      ...post,
      avgRating,
      totalReviews: reviews.length,
    };
  });

  const topListings = calculatedPosts
    .filter((p) => p.avgRating >= 4.5 || p.totalReviews >= 10)
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 12);

  return (
    <section className="py-24 bg-gradient-to-b from-[#faf8ff] via-[#f5f3ff] to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Top Listing Vendors
          </h2>
          <p className="text-muted-foreground text-lg">
            Highly rated and trusted by couples
          </p>
        </div>

        {topListings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topListings.map((post) => {
              const v = post.vendor;
              const vendorId = v?._id ? String(v._id) : "";
              const imageUrl = getFullUrl(post.mainPhoto || v?.profilePhoto || v?.logo);

              const handlePostClick = (vendorId: string, postId: string) => async (e: React.MouseEvent) => {
                e.preventDefault(); // Prevent immediate navigation
                if (!vendorId) return;

                try {
                  // 1️⃣ Count the profile view
                  await axios.post("/api/analytics/profile-view", { vendorId });

                  // 2️⃣ Navigate after counting
                  router.push(`/vendors/${postId}`);
                } catch (err) {
                  console.error("Profile view tracking failed:", err);
                  router.push(`/vendors/${postId}`); // still navigate even if fails
                }
              };


              return (
                <a
                  key={post._id}
                  href={`/vendors/${post._id}`}
                  className="group block"
                  onClick={handlePostClick(vendorId, post._id)}
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

                      {/* Like Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleLike(post._id);
                        }}
                        className="absolute top-3 right-3 z-30 bg-white/80 backdrop-blur rounded-xl p-2 shadow-soft hover:shadow-card transition"
                      >
                        <Heart
                          className={`h-5 w-5 ${liked.includes(post._id)
                            ? "text-red-500 fill-red-500"
                            : "text-red-500"
                            }`}
                        />
                      </button>

                      {/* BADGES – SAME LAYOUT AS FEATURED */}
                      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                        <div className="bg-purple-100 text-purple-800 px-2 py-1 text-xs font-semibold rounded flex items-center gap-1">
                          ⭐ Top Listing
                        </div>

                        {post.avgRating >= 5 && (
                          <div className="bg-green-100 text-green-800 px-2 py-1 text-xs font-semibold rounded flex items-center gap-1">
                            🔥 Top Rated
                          </div>
                        )}
                      </div>

                    </div>

                    {/* CONTENT */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-[#311970] truncate mb-1 group-hover:text-primary transition-colors">
                        {v?.businessName}
                      </h3>

                      <p className="text-gray-600 text-sm">{v?.category}</p>
                      <p className="text-gray-500 text-sm mb-2">
                        {v?.location ? `${v.location}, Kenya` : "Kenya"}
                      </p>

                      {/* Ratings */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(post.avgRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                              }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          {post.avgRating > 0
                            ? `${post.avgRating.toFixed(1)} (${post.totalReviews})`
                            : "No reviews yet"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700">
                        Starting from{" "}
                        <span className="font-semibold">
                          Ksh {post.priceFrom?.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
