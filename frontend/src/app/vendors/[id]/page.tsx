"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Breadcrumb from "../../../components/Breadcrumb";
import { Heart, Star } from "lucide-react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { useAppContext } from "@/context/AppContext";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Smile, RefreshCcw, User, SlidersHorizontal, DollarSign, Calendar } from "lucide-react";

type ReviewCategory = "quality" | "responsiveness" | "professionalism" | "flexibility" | "value";

type NewReview = {
  rating: number;
  text: string;
  quality: number;
  responsiveness: number;
  professionalism: number;
  flexibility: number;
  value: number;
};


{/*const [liked, setLiked] = useState<string[]>([]);
const toggleLike = (id: string) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }; */}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function getReviewerName(review: any) {
  const client = review?.client ?? {};

  const getFirst = (str?: string) => (str ? str.split(" ")[0] : "");

  if (client.brideName && client.groomName) {
    return `${getFirst(client.brideName)} & ${getFirst(client.groomName)}`;
  }

  if (client.name) return getFirst(client.name);

  return "Anonymous";
}


export default function VendorProfile() {
  const params = useParams();
  const id = params?.id as string;

  const {
    posts,
    fetchPosts,
    fetchPostById,
    createBooking,
    postReview,
    fetchReviewsForVendor,
    reviews,
  } = useAppContext();

  const [vendorPost, setVendorPost] = useState<any | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState<NewReview>({
    rating: 0,
    text: "",
    quality: 0,
    responsiveness: 0,
    professionalism: 0,
    flexibility: 0,
    value: 0,
  });



  const packages =
    Array.isArray(vendorPost?.vendor?.pricingPackages)
      ? vendorPost.vendor.pricingPackages.map((pkg: NonNullable<typeof vendorPost.vendor.pricingPackages>[number]) => ({
        name: pkg.name || "",
        price: `${pkg.currency || "Ksh"} ${pkg.price?.toLocaleString() || ""}`,
        features: pkg.features || [],
        popular: pkg.name?.toLowerCase().includes("premium") || false,
      }))
      : [];



  // Add at the top inside VendorProfile
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [bookingMessage, setBookingMessage] = useState(
    "We are currently planning our wedding and would like to learn more about your business. Could you send us some additional information? Thank you!"
  );
  const [bookingDate, setBookingDate] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupImageIndex, setPopupImageIndex] = useState(0);


  // New function to handle submission
  const handleRequestPricing = async () => {
    if (!vendor?._id) {
      toast.error("Vendor not found.");
      return;
    }
    if (!bookingDate || !bookingMessage.trim()) {
      toast.error("Please enter a message and booking date.");
      return;
    }

    const booking = await createBooking({
      vendorId: vendor._id,
      service: vendorPost?.title || "Service",
      date: bookingDate,
      message: bookingMessage,
    });

    if (booking) {
      toast.success("Booking request sent!");
      setShowBookingPopup(false);
      setBookingMessage("");
      setBookingDate("");
      window.location.href = "/dashboard/client/bookings";
    }
  };



  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  const getFullUrl = (path?: string) => {
    if (!path) return "/assets/vendor-placeholder.jpg";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  };

  useEffect(() => {
    if (!id) return;

    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const found = posts?.find((p: any) => p._id === id) || null;
        if (found) {
          if (!mounted) return;
          setVendorPost(found);
          if (fetchReviewsForVendor) {
            const vid = found.vendor?._id || "";
            if (vid) await fetchReviewsForVendor(vid);
          }
          setLoading(false);
          return;
        }

        if (fetchPostById) {
          const data = await fetchPostById(id);
          if (!mounted) return;
          setVendorPost(data);
          if (fetchReviewsForVendor && (data as any)?.vendor?._id) {
            await fetchReviewsForVendor((data as any).vendor._id);
          }
        } else if (fetchPosts) {
          await fetchPosts();
        }
      } catch (err) {
        console.error("Failed to load vendor post:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id, posts]);

  const vendor = vendorPost?.vendor || null;

  // Similar Vendors (same category, excluding current vendor)
  const similarVendors = (posts || [])
    .filter((p: any) => {
      return (
        p._id !== vendorPost?._id &&                      // not current vendor
        p.vendor?.category === vendor?.category          // same category
      );
    })
    .slice(0, 4); // show only 4


  const heroSrc =
    vendorPost?.mainPhoto ||      // main photo of the post
    vendor?.profilePhoto ||       // fallback to vendor profile photo
    vendorPost?.image ||
    vendor?.logo ||
    vendor?.banner ||
    vendor?.photo ||
    vendorPost?.mainPhotoUrl ||
    null;

  const galleryArray =
    vendorPost?.gallery ||
    vendorPost?.galleryImages ||
    vendor?.gallery ||
    vendor?.galleryImages ||
    vendorPost?.images ||
    [];

  const aboutText =
    vendor?.description ||
    (vendor as any)?.about ||
    vendorPost?.description ||
    vendorPost?.about ||
    vendor?.bio ||
    "";

  const phone = vendor?.phone || vendorPost?.phone;
  const email = vendor?.user?.email || vendor?.email || vendorPost?.email;
  const whatsapp = vendor?.whatsapp;

  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviews.length
      : 0;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vendor?._id) {
      toast.error("Vendor ID missing.");
      return;
    }

    // Compute overall rating as average of categories
    const overallRating = Math.round(
      (newReview.quality +
        newReview.responsiveness +
        newReview.professionalism +
        newReview.flexibility +
        newReview.value) /
      5
    );

    if (overallRating === 0 || !newReview.text.trim()) {
      toast.error("Please provide a rating and comment.");
      return;
    }

    const saved = await postReview({ vendorId: vendor._id, rating: overallRating, text: newReview.text, quality: newReview.quality || 0, responsiveness: newReview.responsiveness || 0, professionalism: newReview.professionalism || 0, flexibility: newReview.flexibility || 0, value: newReview.value || 0, });

    if (saved) {
      await fetchReviewsForVendor(vendor._id);
      setNewReview({
        rating: 0,
        text: "",
        quality: 0,
        responsiveness: 0,
        professionalism: 0,
        flexibility: 0,
        value: 0,
      });
      toast.success("Review submitted!");
    }
  };



  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="w-full overflow-hidden text-ellipsis">
          <Breadcrumb />
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 animate-pulse text-[#311970]">Loading vendor...</div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!vendor) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="w-full overflow-hidden text-ellipsis">
          <Breadcrumb />
        </div>
        <div className="flex-grow flex items-center justify-center">
          <h1 className="text-2xl font-bold text-red-500">Vendor Not Found</h1>
        </div>
        <Footer />
      </main>
    );
  }

  // Build images for react-image-gallery
  const images = [
    { original: getFullUrl(heroSrc || undefined), thumbnail: getFullUrl(heroSrc || undefined) },
    ...(galleryArray || []).map((img: string) => ({
      original: getFullUrl(img),
      thumbnail: getFullUrl(img),
    })),
  ];

  return (
    <main className="min-h-screen mt-16">
      <Navbar />
      <div className="w-full overflow-hidden text-ellipsis">
        <Breadcrumb />
      </div>
      <section className="z-10 w-full mx-auto px-1 md:px-3 flex-none lg:flex lg:px-4 rounded-2xl py-3 gap-8">
        <div className="w-full lg:max-w-6xl">

          {/* ================= LEFT ================= */}
          <div className="space-y- rounded-2xl">
            <div className="bg-white rounded-2xl">

              {/* TOP SECTION */}
              <div className="mb-4 px-2 flex justify-between items-center">
                <div >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 text-xs rounded-full bg-[#EEE9FF] text-[#311970] font-semibold">
                      {vendor.category}
                    </span>
                    <span className="text-sm text-gray-500">{vendor.location}</span>
                  </div>

                  <h1 className="text-1xl md:text-2xl font-bold text-[#311970]">
                    {vendor.businessName}
                  </h1>

                  <div className="flex items-center gap-2 mt-2">
                    <RatingStars rating={Math.round(averageRating)} />
                    <span className="text-sm text-gray-600">
                      {averageRating.toFixed(1)} ({reviews?.length} reviews)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Starting from</p>
                  <p className="text-sm font-bold text-[#311970]">
                    Ksh {vendorPost.priceFrom?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 mb-10">

                {/* MAIN IMAGE */}
                <div className="relative h-[300px] md:h-[380px] rounded-2xl overflow-hidden">
                  <Image
                    src={getFullUrl(heroSrc || vendor.profilePhoto)}
                    alt={vendor.businessName}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* RIGHT COLUMN (DESKTOP ONLY) */}
                <div className="hidden md:grid grid-rows-2 gap-4 h-[380px]">

                  {galleryArray?.[0] && (
                    <div
                      className="relative rounded-2xl overflow-hidden cursor-pointer h-[180px]"
                      onClick={() => {
                        setPopupImageIndex(0);
                        setIsPopupOpen(true);
                      }}
                    >
                      <img
                        src={getFullUrl(galleryArray[0])}
                        alt="Gallery 1"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {galleryArray?.[1] && (
                    <div
                      className="relative rounded-2xl overflow-hidden cursor-pointer h-[180px]"
                      onClick={() => {
                        setPopupImageIndex(1);
                        setIsPopupOpen(true);
                      }}
                    >
                      <img
                        src={getFullUrl(galleryArray[1])}
                        alt="Gallery 2"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                </div>

                {/* GALLERY BELOW (ALL SCREENS) */}
                <div className="md:col-span-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">

                  {galleryArray.slice(0, 6).map((img: string, index: number) => {
                    const showOverlay = index === 5 && galleryArray.length > 6;

                    return (
                      <div
                        key={index}
                        className="relative h-[90px] md:h-[120px] rounded-xl overflow-hidden cursor-pointer"
                        onClick={() => {
                          setPopupImageIndex(index);
                          setIsPopupOpen(true);
                        }}
                      >
                        <img
                          src={getFullUrl(img)}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {showOverlay && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-semibold">
                            +{galleryArray.length - 6}
                          </div>
                        )}
                      </div>
                    );
                  })}

                </div>
              </div>


              {/* DIVIDER */}
              <div className="border-t border-gray-100" />

              {/* ABOUT */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-[#311970] mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">
                  {vendor.description}
                </p>
              </div>
            </div>



            {/* PACKAGES & PRICING */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="text-2xl font-bold text-[#311970] mb-6">
                Packages & Pricing
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {packages.map(
                  (pkg: {
                    name: string;
                    price: string;
                    features: string[];
                    popular: boolean;
                  }) => (
                    <div
                      key={pkg.name}
                      className={`relative rounded-2xl border p-6 transition ${pkg.popular
                        ? "border-[#311970] ring-2 ring-[#311970]"
                        : "border-gray-200"
                        }`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#311970] text-white text-xs font-semibold px-4 py-1 rounded-full">
                          Most Popular
                        </span>
                      )}

                      <h3 className="text-xl font-semibold text-[#311970] mb-2">
                        {pkg.name}
                      </h3>

                      <p className="text-3xl font-bold text-[#311970] mb-4">
                        {pkg.price}
                      </p>

                      <ul className="space-y-2 mb-6">
                        {pkg.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <span className="text-[#311970] font-bold">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => {
                          setBookingMessage(`Hi there! I'm interested in your ${pkg.name} package and would love to get more details about what's included, pricing, and availability. Looking forward to your response!`);
                          setShowBookingPopup(true);
                        }}
                        className={`w-full py-2.5 rounded-xl font-semibold transition ${pkg.popular
                          ? "bg-[#311970] text-white hover:bg-[#261457]"
                          : "border border-gray-300 text-gray-800 hover:bg-gray-50"
                          }`}
                      >
                        Select Package
                      </button>

                    </div>
                  ))}
              </div>
            </div>

            {/* SERVICE CATEGORIES */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="text-2xl font-bold text-[#311970] mb-6">
                Services Offered
              </h2>

              {Array.isArray(vendorPost?.vendor?.serviceCategories) &&
                vendorPost.vendor.serviceCategories.length > 0 ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {vendorPost.vendor.serviceCategories.map((service: string) => (
                    <div
                      key={service}
                      className="flex items-center gap-3 p-4 rounded-xl border border-[#EEE9FF] bg-[#FAF8FF]"
                    >
                      <span className="text-[#311970] font-bold text-lg">✓</span>
                      <span className="text-gray-800 font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  This vendor has not listed their services yet.
                </p>
              )}
            </div>


            {/* SERVICE AREAS */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="text-2xl font-bold text-[#311970] mb-6">
                Service Areas
              </h2>

              {Array.isArray(vendorPost?.vendor?.serviceAreas) &&
                vendorPost.vendor.serviceAreas.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {vendorPost.vendor.serviceAreas.map((area: string) => (
                    <span
                      key={area}
                      className="px-4 py-2 rounded-full bg-[#EEE9FF] text-[#311970] text-sm font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  Service areas not specified by this vendor.
                </p>
              )}
            </div>



            {/* REVIEWS (UNCHANGED LOGIC, NEW LAYOUT) */}
            <section className="w-full mx-auto px-1 py-6">

              {/* Title */}
              <div className="flex ml-4 items-center gap-2 mb-3">
                <Star className="text-[#311970]" />
                <h2 className="text-2xl font-bold text-[#311970]">Reviews</h2>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-3">

                {/* TOP SUMMARY SECTION */}
                <div className="flex flex-col md:flex-row gap-10">

                  {/* Left: Overall Rating Box */}
                  <div className="w-full md:w-1/4 flex flex-col items-center justify-center bg-green-100 rounded-xl py-6">
                    <span className="text-4xl font-bold text-green-700">
                      {averageRating.toFixed(1)}
                    </span>
                    <p className="text-gray-700 mb-2">out of 5.0</p>
                    <RatingStars rating={Math.round(averageRating)} />
                  </div>

                  {/* Right: Category Ratings */}
                  <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 gap-6">

                    {[
                      { key: "quality", label: "Quality of Service", icon: <Smile className="w-5 h-5 text-[#311970]" /> },
                      { key: "responsiveness", label: "Responsiveness", icon: <RefreshCcw className="w-5 h-5 text-[#311970]" /> },
                      { key: "professionalism", label: "Professionalism", icon: <User className="w-5 h-5 text-[#311970]" /> },
                      { key: "flexibility", label: "Flexibility", icon: <SlidersHorizontal className="w-5 h-5 text-[#311970]" /> },
                      { key: "value", label: "Value for Money", icon: <DollarSign className="w-5 h-5 text-[#311970]" /> },
                    ].map((cat) => {
                      const catAvg =
                        reviews && reviews.length > 0
                          ? reviews.reduce((sum, r: any) => sum + (r[cat.key] ?? 0), 0) / reviews.length
                          : 0;

                      return (
                        <div key={cat.key}>
                          <p className="font-medium text-gray-700 flex items-center gap-2">
                            {cat.icon} {cat.label}
                          </p>
                          <div className="h-2 bg-gray-200 rounded mt-1">
                            <div
                              className="h-2 bg-[#311970] rounded"
                              style={{ width: `${(catAvg / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}

                  </div>
                </div>

                {/* Review Count */}
                <p className="mt-8 text-gray-700 font-medium">
                  {reviews?.length} Reviews for {vendor?.businessName}
                </p>

                {/* LIST OF REVIEWS */}
                <div className="mt-6 flex flex-col gap-6">
                  {(reviews || []).map((review: any, index: number) => (
                    <div
                      key={review._id || index}
                      className="border border-gray-200 rounded-lg p-2 shadow-sm bg-white"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">
                          {getReviewerName(review)}
                        </h3>
                        <RatingStars rating={Number(review.rating ?? 0)} />
                      </div>

                      <p className="text-gray-600 mb-3">{review.text}</p>

                      {(review.reply ?? (review as any).reply) && (
                        <div className="ml-4 mt-3 border-l-4 border-[#311970] pl-4 bg-gray-50 rounded">
                          <p className="text-sm text-gray-700">
                            <strong>Vendor Reply:</strong>{" "}
                            {review.reply ?? (review as any).reply}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* WRITE REVIEW FORM */}
                <form
                  onSubmit={handleReviewSubmit}
                  className="mt-10 border border-gray-200 rounded-lg p-2 shadow-md"
                >
                  <h3 className="text-2xl font-bold text-[#311970] mb-6 flex items-center gap-2">
                    <Star className="text-[#311970] w-6 h-6" />
                    Write a Review
                  </h3>

                  {/* FIVE RATING CATEGORIES */}
                  <div className="grid md:grid-cols-2 gap-8 mb-8">

                    {/* CATEGORY COMPONENT */}

                    {[
                      { label: "Quality of Service", icon: <Smile className="w-6 h-6 text-[#311970]" />, field: "quality" as ReviewCategory },
                      { label: "Responsiveness", icon: <RefreshCcw className="w-6 h-6 text-[#311970]" />, field: "responsiveness" as ReviewCategory },
                      { label: "Professionalism", icon: <User className="w-6 h-6 text-[#311970]" />, field: "professionalism" as ReviewCategory },
                      { label: "Flexibility", icon: <SlidersHorizontal className="w-6 h-6 text-[#311970]" />, field: "flexibility" as ReviewCategory },
                      { label: "Value for Money", icon: <DollarSign className="w-6 h-6 text-[#311970]" />, field: "value" as ReviewCategory }
                    ]
                      .map((item) => (
                        <div key={item.field}>
                          <p className="font-semibold text-gray-700 flex items-center gap-2 mb-1">
                            {item.icon} {item.label}
                          </p>

                          {/* STAR SELECTOR */}
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() =>
                                  setNewReview((prev: any) => ({ ...prev, [item.field]: star }))
                                }
                                className="text-2xl"
                              >
                                <span className={newReview[item.field] >= star ? "text-yellow-400" : "text-gray-300"}>
                                  ★
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                  </div>

                  {/* COMMENT FIELD */}
                  <textarea
                    placeholder="Your Comments"
                    className="w-full border rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-[#311970]"
                    rows={6}
                    value={newReview.text}
                    onChange={(e) =>
                      setNewReview((prev: any) => ({ ...prev, text: e.target.value }))
                    }
                  />

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className={`bg-[#311970] text-white px-8 py-3 rounded-lg shadow hover:bg-[#261457] transition font-semibold flex items-center justify-center gap-2 ${submittingReview ? "cursor-not-allowed opacity-70" : ""}`}
                  >
                    {submittingReview ? (
                      <span className="flex gap-1">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce animation-delay-150">.</span>
                        <span className="animate-bounce animation-delay-300">.</span>
                        Submitting
                      </span>
                    ) : (
                      "Submit Review"
                    )}
                  </button>


                </form>
              </div>
            </section>
            {/* --- YOUR EXISTING REVIEWS JSX CAN STAY HERE --- */}

          </div>
        </div>


        {/* ================= RIGHT ================= */}
        <div className="w-full md:w-[30%]">
          <aside className="sticky top-28 h-fit bg-white rounded-2xl p-6 shadow">
            <h3 className="text-xl font-bold text-[#311970] mb-4">Contact Vendor</h3>
            <button
              onClick={() => setShowBookingPopup(true)}
              className="w-full bg-[#311970] text-white py-3 rounded-xl font-semibold mb-4"
            >
              Send Message
            </button>
            {phone && (
              <button
                onClick={() => (window.location.href = `tel:${phone}`)}
                className="w-full border border-[#311970] text-[#311970] py-3 rounded-xl font-semibold hover:bg-gray-50 transition mb-4"
              >
                Call Now
              </button>
            )}
            {/*<button className="w-full border py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" /> Check Availability
          </button>*/}
            <p className="mt-6 text-sm text-gray-600">
              <strong>Response time:</strong><br />Usually within 24 hours
            </p>
          </aside>
        </div>

      </section>



      {/* Contact */}
      {/*  <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-[#311970] mb-4">Contact Information</h2>
        <ul className="space-y-2 text-gray-700">
          {phone && <li><strong>Phone:</strong> {phone}</li>}
          {email && <li><strong>Email:</strong> {email}</li>}
          {whatsapp && (
            <li>
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="text-green-600 font-semibold hover:underline"
              >
                WhatsApp Chat
              </a>
            </li>
          )}
        </ul>
      </section>  */}

      {/* Reviews */}
      {/* Reviews Section */}


      {/* ⭐ Similar Vendors Section */}
      {
        similarVendors.length > 0 && (
          <section className="w-full mx-auto px-2 py-10">
            <h2 className="text-2xl font-bold text-[#311970] mb-6">
              Similar Vendors
            </h2>

            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {similarVendors.map((post: any) => {
                const v = post.vendor;
                const image =
                  post.mainPhoto || v?.profilePhoto
                  v?.logo ||
                  v?.photo ||
                  "/assets/vendor-placeholder.jpg";

                return (
                  <a
                    key={post._id}
                    href={`/vendors/${post._id}`}
                    className="bg-white rounded-xl shadow hover:shadow-lg transition block overflow-hidden"
                  >
                    <img
                      src={image}
                      className="w-full h-48 object-cover"
                      alt={v?.businessName}
                    />

                    <div className="p-4">
                      <h3 className="font-bold text-lg text-[#311970] truncate">
                        {v?.businessName}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {v?.category}
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        {v?.location ? `${v.location}, Kenya` : "Kenya"}
                      </p>

                      <p className="mt-2 text-sm">
                        Starting from{" "}
                        <span className="font-semibold">
                          Ksh {post.priceFrom?.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )
      }

      {/* Booking Popup */}
      {
        showBookingPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-50 p-4">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
              {/* Close Button */}
              <button
                onClick={() => setShowBookingPopup(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
              >
                ×
              </button>

              <h2 className="text-2xl font-bold text-[#311970] mb-4">
                Request Pricing
              </h2>

              <label className="block mb-2 font-semibold text-gray-700">Booking Date</label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#311970]"
              />

              <label className="block mb-2 font-semibold text-gray-700">Message</label>
              <textarea
                value={bookingMessage}
                onChange={(e) => setBookingMessage(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#311970]"
                rows={4}
                placeholder="Enter your message..."
              />

              <button
                onClick={handleRequestPricing}
                className="w-full bg-[#311970] text-white py-2 rounded-lg shadow hover:bg-[#261457] transition font-semibold"
              >
                Send Request
              </button>
            </div>
          </div>
        )
      }

      {
        isPopupOpen && (
          <div
            className="fixed inset-0 bg-black/80 bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={() => setIsPopupOpen(false)}
          >
            <div
              className="relative max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()} // prevent popup close on image click
            >
              <img
                src={getFullUrl(galleryArray[popupImageIndex])}
                alt={`Popup image ${popupImageIndex + 1}`}
                className="rounded-3xl max-w-full max-h-[90vh] object-contain"
              />

              {/* Close Button */}
              <button
                onClick={() => setIsPopupOpen(false)}
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition"
                aria-label="Close popup"
              >
                ✕
              </button>

              {/* Prev Button */}
              <button
                onClick={() =>
                  setPopupImageIndex(
                    (popupImageIndex - 1 + galleryArray.length) % galleryArray.length
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-3xl bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition"
                aria-label="Previous Image"
              >
                ‹
              </button>

              {/* Next Button */}
              <button
                onClick={() =>
                  setPopupImageIndex((popupImageIndex + 1) % galleryArray.length)
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-3xl bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition"
                aria-label="Next Image"
              >
                ›
              </button>
            </div>
          </div>
        )
      }
      <Footer />
    </main >
  );
}
