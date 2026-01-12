"use client";
import { Suspense } from "react";
import Fuse from "fuse.js";
import { useSearchParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Heart, Star, Search, MapPin, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import axios from "axios";



type MobileFiltersProps = {
  filter: string;
  setFilter: (value: string) => void;
  selectedPrice: string;
  setSelectedPrice: (value: string) => void;
  selectedRating: string;
  setSelectedRating: (value: string) => void;
  county: string;
  setCounty: (value: string) => void;
  setCurrentPage: (page: number) => void;
};

const MobileFilters: React.FC<MobileFiltersProps> = ({
  filter,
  setFilter,
  selectedPrice,
  setSelectedPrice,
  selectedRating,
  setSelectedRating,
  county,
  setCounty,
  setCurrentPage,
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Category");
  const containerRef = useRef<HTMLDivElement>(null);

  const categories = [
    "All",
    "Photography",
    "Catering",
    "Venue",
    "Decoration",
    "Entertainment",
    "Tailor",
    "Makeup & Beauty",
    "Cars",
    "Dresses",
    "Cake",
  ];

  const prices = [
    "Any",
    "Below Ksh 20,000",
    "Ksh 20,000 – 50,000",
    "Ksh 50,000 – 100,000",
    "Above Ksh 100,000",
  ];

  const ratings = ["Any", "5 Stars", "4+ Stars", "3+ Stars"];

  const locations = [
    "All",
    "Nairobi",
    "Mombasa",
    "Kisumu",
    "Nakuru",
    "Eldoret",
    "Kiambu",
    "Machakos",
    "Meru",
    "Nyeri",
    "Thika",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSelect = (setter: (val: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
    setOpen(false);
  };

  return (
    <div className="block lg:hidden relative mb-6" ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 rounded-lg px-4 text-xs border border-input bg-background shadow-soft hover:bg-accent hover:text-accent-foreground hover:border-primary/30"
        aria-expanded={open}
        aria-controls="mobile-filter-dropdown"
      >
        <SlidersHorizontal className="w-4 h-4 mr-2 shrink-0" />
        Filters
      </button>

      {open && (
        <div
          id="mobile-filter-dropdown"
          className="absolute z-40 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200"
        >
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {["Category", "Price", "Rating", "Location"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 font-semibold border-b-2 transition ${activeTab === tab
                  ? "border-[#311970] text-[#311970]"
                  : "border-transparent text-gray-600"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 max-h-64 overflow-auto">
            {activeTab === "Category" && (
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleSelect(setFilter, cat)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition ${filter === cat
                      ? "bg-[#311970] text-white"
                      : "hover:bg-gray-100"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {activeTab === "Price" && (
              <div className="flex flex-col gap-2">
                {prices.map((price) => (
                  <button
                    key={price}
                    onClick={() => handleSelect(setSelectedPrice, price)}
                    className={`px-3 py-2 rounded-lg text-sm border hover:border-[#311970] hover:bg-[#f5f3fa] transition ${selectedPrice === price
                      ? "bg-[#311970] text-white border-[#311970]"
                      : ""
                      }`}
                  >
                    {price}
                  </button>
                ))}
              </div>
            )}

            {activeTab === "Rating" && (
              <div className="flex flex-col gap-2">
                {ratings.map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleSelect(setSelectedRating, rating)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${selectedRating === rating
                      ? "bg-[#311970] text-white"
                      : "hover:bg-gray-100"
                      }`}
                  >
                    {rating !== "Any" && (
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    )}
                    {rating}
                  </button>
                ))}
              </div>
            )}

            {activeTab === "Location" && (
              <select
                value={county}
                onChange={(e) => {
                  setCounty(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-[#311970]"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const VendorsPage = () => {
  const { posts, fetchPosts } = useAppContext();
  const [searchInput, setSearchInput] = useState(""); // typing
  const [searchQuery, setSearchQuery] = useState(""); // committed
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [county, setCounty] = useState("All"); // ✅ new county filter
  const [sort, setSort] = useState("rating");
  const router = useRouter();
  const [liked, setLiked] = useState<string[]>([]);
  const [vendorReviewsMap, setVendorReviewsMap] = useState<Record<string, any[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 16;
  const [selectedPrice, setSelectedPrice] = useState("Any");
  const [selectedRating, setSelectedRating] = useState("Any");


  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const getFullUrl = (path?: string) => {
    if (!path) return "/assets/vendor-placeholder.jpg";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  // On mount, read query params from URL
  useEffect(() => {
    const qSearch = searchParams.get("search") || "";
    const qLocation = searchParams.get("location") || "";

    if (qSearch) {
      setSearchInput(qSearch);
      setSearchQuery(qSearch);
    }
    if (qLocation) setCounty(qLocation);
  }, [searchParams]);

  const fuse = new Fuse(posts, {
    keys: ["vendor.businessName", "vendor.description", "vendor.category"],
    threshold: 0.4, // lower = stricter match, higher = more fuzzy
  });


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

  const fuseResults: any[] =
    searchQuery !== ""
      ? fuse.search(searchQuery).map((r) => r.item)
      : posts || [];



  // ✅ Filter + Sort (includes county filter)
  const filteredVendors = fuseResults
    .filter((post: any) => {
      const matchesCategory =
        filter === "All" || post.vendor?.category === filter;

      const matchesCounty =
        county === "All" ||
        post.vendor?.location?.toLowerCase() === county.toLowerCase();

      // price filter (unchanged)
      const price = post.priceFrom || 0;
      let matchesPrice = true;
      switch (selectedPrice) {
        case "Below Ksh 20,000":
          matchesPrice = price < 20000;
          break;
        case "Ksh 20,000 – 50,000":
          matchesPrice = price >= 20000 && price <= 50000;
          break;
        case "Ksh 50,000 – 100,000":
          matchesPrice = price > 50000 && price <= 100000;
          break;
        case "Above Ksh 100,000":
          matchesPrice = price > 100000;
          break;
        default:
          matchesPrice = true;
      }

      // rating filter (unchanged)
      const vendorId = post.vendor?._id ? String(post.vendor._id) : "";
      const vendorReviews = vendorReviewsMap[vendorId] || [];
      const avgRating =
        vendorReviews.length > 0
          ? vendorReviews.reduce((s, r) => s + (r.rating || 0), 0) /
          vendorReviews.length
          : 0;

      let matchesRating = true;
      switch (selectedRating) {
        case "5 Stars":
          matchesRating = avgRating === 5;
          break;
        case "4+ Stars":
          matchesRating = avgRating >= 4;
          break;
        case "3+ Stars":
          matchesRating = avgRating >= 3;
          break;
        default:
          matchesRating = true;
      }

      return (
        matchesCategory &&
        matchesCounty &&
        matchesPrice &&
        matchesRating
      );
    })
    .sort((a: any, b: any) => {
      if (sort === "price_low") return (a.priceFrom || 0) - (b.priceFrom || 0);
      if (sort === "price_high") return (b.priceFrom || 0) - (a.priceFrom || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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

  const handleVendorClick = (vendorId: string, postId: string) => async () => {
    if (!vendorId) return;

    try {
      // Count profile view
      await axios.post("/api/analytics/profile-view", { vendorId });
      // Navigate after counting
      router.push(`/vendors/${postId}`);
    } catch (err) {
      console.error("Profile view tracking failed:", err);
      router.push(`/vendors/${postId}`); // navigate anyway
    }
  };



  return (
    <Suspense fallback={<div></div>}>
      <main className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
        <Navbar />
        {/* Header */}
        <section className="py-16 mt-10 bg-gray-100/60">
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-center mb-4">
              Explore Wedding Vendors
            </h1>

            <p className="text-gray-500 text-lg text-center max-w-2xl mx-auto mb-10">
              Discover verified professionals to bring your dream wedding to life
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-3 max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Vendor Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#311970]"
                  />
                </div>

                {/* Location Search */}
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Location (e.g. Nairobi)"
                    value={county === "All" ? "" : county}
                    onChange={(e) =>
                      setCounty(e.target.value.trim() === "" ? "All" : e.target.value)
                    }
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#311970]"
                  />
                </div>

                {/* Search Button */}
                <button
                  onClick={() => {
                    setSearchQuery(searchInput);
                    setCurrentPage(1);
                  }}
                  className="bg-[#311970] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#261457] transition"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>


        <section className="w-full mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* FILTERS SIDEBAR */}
            {/* MOBILE FILTERS BUTTON + DROPDOWN */}
            <MobileFilters
              filter={filter}
              setFilter={setFilter}
              selectedPrice={selectedPrice}
              setSelectedPrice={setSelectedPrice}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              county={county}
              setCounty={setCounty}
              setCurrentPage={setCurrentPage}
            />
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Filters</h3>

                {/* CATEGORY */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">Category</h4>
                  <div className="space-y-2">
                    {[
                      "All",
                      "Photography",
                      "Catering",
                      "Venue",
                      "Decoration",
                      "Entertainment",
                      "Tailor",
                      "Makeup & Beauty",
                      "Cars",
                      "Dresses",
                      "Cake",
                    ].map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setFilter(category);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${filter === category
                          ? "bg-[#311970] text-white"
                          : "hover:bg-gray-100"
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PRICE RANGE (MOCKED) */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">Price Range</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Any",
                      "Below Ksh 20,000",
                      "Ksh 20,000 – 50,000",
                      "Ksh 50,000 – 100,000",
                      "Above Ksh 100,000",
                    ].map((price) => (
                      <button
                        key={price}
                        onClick={() => {
                          setSelectedPrice(price); // track selected price
                          if (price === "Any") {
                            setSort("rating"); // brings all posts back
                          } else {
                            setSort("price_low"); // or implement actual price sorting logic
                          }
                          setCurrentPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm border hover:border-[#311970] hover:bg-[#f5f3fa] transition ${selectedPrice === price ? "bg-[#311970] text-white border-[#311970]" : ""
                          }`}
                      >
                        {price}
                      </button>
                    ))}

                  </div>
                </div>

                {/* RATING */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">Rating</h4>
                  <div className="space-y-2">
                    {["Any", "5 Stars", "4+ Stars", "3+ Stars"].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => {
                          setSelectedRating(rating);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${selectedRating === rating ? "bg-[#311970] text-white" : "hover:bg-gray-100"
                          }`}
                      >
                        {rating !== "Any" && (
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        )}
                        {rating}
                      </button>
                    ))}

                  </div>
                </div>

                {/* LOCATION */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Location</h4>
                  <select
                    value={county}
                    onChange={(e) => {
                      setCounty(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-[#311970]"
                  >
                    {[
                      "All",
                      "Nairobi",
                      "Mombasa",
                      "Kisumu",
                      "Nakuru",
                      "Eldoret",
                      "Kiambu",
                      "Machakos",
                      "Meru",
                      "Nyeri",
                      "Thika",
                    ].map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex-1">

              {/* RESULTS HEADER */}
              <div className="flex items-center md:text-1xl lg:text-1xl text-sm justify-between mb-6">
                <p className="text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {totalVendors}
                  </span>{" "}
                  vendors
                </p>

                {/*<select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#311970]"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>*/}
              </div>

              {/* VENDOR GRID */}
              {currentVendors.length === 0 ? (
                <p className="text-center text-muted-foreground py-20">
                  Loading vendors...
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {currentVendors.map((post) => {
                    const v = post.vendor;
                    const imageUrl = getFullUrl(post.mainPhoto || v?.profilePhoto || v?.logo);


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

                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleLike(post._id);
                              }}
                              className="absolute top-4 right-4 z-30 bg-white/80 backdrop-blur rounded-xl p-2 shadow-soft hover:shadow-card transition"
                            >
                              <Heart
                                className={`h-5 w-5 ${liked.includes(post._id)
                                  ? "text-red-500 fill-red-500"
                                  : "text-red-500"
                                  }`}
                              />
                            </button>
                            <div className="absolute top-4 left-4 flex gap-2 z-20">
                              {v?.featured && (
                                <span className="bg-[#311970] text-white px-3 py-1 text-xs font-semibold rounded-full">
                                  Featured
                                </span>
                              )}

                              {avgRating >= 5 && (
                                <span className="bg-green-100 text-green-800 px-3 py-1 text-xs font-semibold rounded-full">
                                  Top Rated
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-5">
                            <h3 className="text-xl font-bold text-[#311970] truncate mb-1">
                              {v?.businessName}
                            </h3>

                            <p className="text-gray-600 text-sm">{v?.category}</p>
                            <p className="text-gray-500 text-sm mb-2">
                              {v?.location ? `${v.location}, Kenya` : "Kenya"}
                            </p>

                            <div className="flex items-center gap-1 mb-2">
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

              {/* PAGINATION */}
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
            </div>

          </div>
        </section>


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


        <Footer />
      </main>
    </Suspense >

  );
};

export default VendorsPage;