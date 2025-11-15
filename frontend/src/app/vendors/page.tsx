"use client";

import { Suspense } from "react";
import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import axios from "axios";


const VendorsPage = () => {
  const { posts, fetchPosts } = useAppContext();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [county, setCounty] = useState("All"); // ✅ new county filter
  const [sort, setSort] = useState("rating");
  const [liked, setLiked] = useState<string[]>([]);
  const [vendorReviewsMap, setVendorReviewsMap] = useState<Record<string, any[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 16;


  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const getFullUrl = (path?: string) => {
    if (!path) return "/assets/vendor-placeholder.jpg";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  useEffect(() => {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const county = params.get("county");
    if (category) setFilter(category);
    if (county) setCounty(county);
  }
}, []);


  // Fetch vendors
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch reviews for all vendors
  useEffect(() => {
    let mounted = true;
    const loadAllVendorReviews = async () => {
      if (!posts || posts.length === 0) return;

      const ids = Array.from(
        new Set(posts.map((p: any) => p.vendor?._id).filter(Boolean).map(String))
      );
      if (ids.length === 0) return;

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
        console.error("Failed to load vendor reviews for list:", err);
      }
    };
    loadAllVendorReviews();
    return () => {
      mounted = false;
    };
  }, [posts]);

  const toggleLike = (id: string) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ Filter + Sort (includes county filter)
  const filteredVendors = (posts || [])
    .filter((post) => {
      const matchesCategory =
        filter === "All" || post.vendor?.category === filter;
      const matchesCounty =
        county === "All" ||
        post.vendor?.location?.toLowerCase() === county.toLowerCase();
      const matchesSearch = post.vendor?.businessName
        ?.toLowerCase()
        .includes(search.toLowerCase());
      return matchesCategory && matchesCounty && matchesSearch;
    })
    .sort((a, b) => {
      if (sort === "rating") {
        const aReviews = vendorReviewsMap[a.vendor?._id || ""] || [];
        const bReviews = vendorReviewsMap[b.vendor?._id || ""] || [];

        const aRating =
          aReviews.length > 0
            ? aReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / aReviews.length
            : 0;
        const bRating =
          bReviews.length > 0
            ? bReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / bReviews.length
            : 0;

        return bRating - aRating;
      }

      if (sort === "price_low") return (a.priceFrom || 0) - (b.priceFrom || 0);
      if (sort === "price_high") return (b.priceFrom || 0) - (a.priceFrom || 0);
      return 0;
    });


  // ✅ Pagination
  const totalVendors = filteredVendors.length;
  const totalPages = Math.ceil(totalVendors / vendorsPerPage);
  const startIndex = (currentPage - 1) * vendorsPerPage;
  const currentVendors = filteredVendors.slice(
    startIndex,
    startIndex + vendorsPerPage
  );

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      <Navbar />
      {/* Header */}
      <section
        className="relative text-white py-10 md:py-22 text-center px-2 bg-blur bg-center"
        style={{
          backgroundImage: "url('/assets/vendor-header.jpg')",
        }}
      >
        {/* Overlay for color tint */}
        <div className="absolute inset-0 bg-[#311970]/50"></div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Vendor
          </h1>
          <p className="text-sm md:text-base max-w-2xl mx-auto">
            Browse trusted wedding vendors to make your big day unforgettable
          </p>
        </div>
      </section>



      {/* Filters */}
      <section className="max-w-6xl mx-auto px-3 py-4 w-full">
        <div className="bg-white shadow-lg rounded-lg p-4 mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center w-full">
            <input
              type="text"
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#311970]"
            />

            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full text-sm md:w-60 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#311970]"
              >
                <option value="All">All Categories</option>
                <option value="Photography">Photography</option>
                <option value="Catering">Catering</option>
                <option value="Venue">Venue</option>
                <option value="Decoration">Decoration</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Tailor">Tailor</option>
                <option value="Makeup & Beauty">Makeup & Beauty</option>
                <option value="Cars">Cars</option>
                <option value="Dresses">Dresses</option>
                <option value="Cake">Cake</option>
              </select>

              {/* ✅ New County Filter */}
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="w-full text-sm md:w-60 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#311970]"
              >
                <option value="All">All Counties</option>
                <option value="Nairobi">Nairobi</option>
                <option value="Mombasa">Mombasa</option>
                <option value="Kisumu">Kisumu</option>
                <option value="Nakuru">Nakuru</option>
                <option value="Eldoret">Eldoret</option>
                <option value="Kiambu">Kiambu</option>
                <option value="Machakos">Machakos</option>
                <option value="Meru">Meru</option>
                <option value="Nyeri">Nyeri</option>
                <option value="Thika">Thika</option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full text-sm md:w-60 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#311970]"
              >
                <option value="rating">Sort by Rating</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vendor Cards */}
        {currentVendors.length === 0 ? (
          <p className="text-center text-gray-600 mt-10">No vendors found.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentVendors.map((post) => {
              const v = post.vendor;
              const imageUrl = getFullUrl(post.mainPhoto);
              const vendorId = v?._id ? String(v._id) : "";
              const vendorReviews = vendorId
                ? vendorReviewsMap[vendorId] || []
                : [];
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
                  {v?.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-semibold rounded">
                      ⭐ Featured
                    </div>
                  )}

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

                  <Image
                    src={imageUrl}
                    alt={v?.businessName || "Vendor"}
                    width={400}
                    height={250}
                    className="w-full h-50 object-cover"
                  />

                  <div className="p-5">
                    <h2 className="text-xl font-bold text-[#311970] truncate">
                      {v?.businessName}
                    </h2>
                    <p className="text-gray-600">{v?.category}</p>
                    <p className="text-gray-500 text-sm">
                      {v?.location ? `${v.location}, Kenya` : "Kenya"}
                    </p>

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

        {/* ✅ Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 space-x-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${currentPage === page
                  ? "bg-[#311970] text-white border-[#311970]"
                  : "bg-white text-[#311970] border-gray-300 hover:bg-[#f5f3fa]"
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
    </Suspense>
    
  );
};

export default VendorsPage;
