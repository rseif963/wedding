"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Breadcrumb from "../../../components/Breadcrumb";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { toast } from "react-hot-toast";

type Review = {
  _id?: string;
  client?: any;
  vendor?: any;
  rating: number;
  text: string;
  reply?: string;
};

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
  if (!review) return "Anonymous";
  const client = review.client;

  if (client?.brideName || client?.groomName) {
    const brideFirst = client?.brideName ? client.brideName.trim().split(" ")[0] : "";
    const groomFirst = client?.groomName ? client.groomName.trim().split(" ")[0] : "";
    if (brideFirst && groomFirst) return `${brideFirst} & ${groomFirst}`;
    if (brideFirst) return brideFirst;
    if (groomFirst) return groomFirst;
  }

  if (client?.firstName) return client.firstName.trim().split(" ")[0];
  if (client?.user?.firstName) return client.user.firstName.trim().split(" ")[0];
  if (client?.name) return String(client.name).split(" ")[0];
  if (review.clientName) return String(review.clientName).split(" ")[0];

  const email = client?.email || client?.user?.email || review.clientEmail || review.email;
  if (email) return String(email).split("@")[0];

  return "Anonymous";
}

export default function VendorProfile() {
  const params = useParams();
  const id = params?.id as string; // ✅ safely get the vendor ID

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
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 0, text: "" });
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

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

  const heroSrc =
    vendorPost?.mainPhoto ||
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

  let videoUrl =
    vendorPost?.video ||
    vendorPost?.videoUrl ||
    (vendorPost?.galleryVideos && vendorPost.galleryVideos[0]) ||
    vendor?.video ||
    vendor?.videoUrl ||
    null;

  if (videoUrl && videoUrl.includes("watch?v=")) {
    videoUrl = videoUrl.replace("watch?v=", "embed/");
  }

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
    if (!newReview.rating || !newReview.text) return;

    if (!vendor?._id) {
      toast.error("Vendor ID missing.");
      return;
    }

    const saved = await postReview({
      vendorId: vendor._id,
      rating: newReview.rating,
      text: newReview.text,
    });

    if (saved) {
      await fetchReviewsForVendor(vendor._id);
      setNewReview({ rating: 0, text: "" });
    }
  };

  const handleRequestPricing = async () => {
    if (!vendor?._id) {
      toast.error("Vendor not found.");
      return;
    }
    const booking = await createBooking({
      vendorId: vendor._id,
      service: vendorPost?.title || "Service",
      date: new Date().toISOString(),
      message: "Requesting pricing information.",
    });
    if (booking) {
      toast.success("Pricing request sent!");
      window.location.href = "/dashboard/client/messages";
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

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full overflow-hidden text-ellipsis">
        <Breadcrumb />
      </div>

      {/* Hero */}
      <section className="relative h-[50vh] w-full">
        <Image
          src={getFullUrl(heroSrc || undefined)}
          alt={vendor.businessName || vendor.name || "Vendor"}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl font-bold">{vendor.businessName || vendor.name}</h1>
          <p className="mt-2 text-lg">
            {vendor.category || vendorPost?.category} · {vendor.location || "Kenya"}
          </p>
          <button
            onClick={handleRequestPricing}
            className="mt-4 bg-[#311970] px-6 py-3 rounded-lg shadow hover:bg-[#261457] transition"
          >
            Request Pricing
          </button>
        </div>
      </section>

      {/* About */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-[#311970] mb-4">About</h2>
        <p className="text-gray-700 leading-relaxed">
          {aboutText || "No description available."}
        </p>
      </section>

      {/* Gallery */}
      {galleryArray && galleryArray.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-[#311970] mb-6">Gallery</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {galleryArray.map((img: string, index: number) => (
              <Image
                key={index}
                src={getFullUrl(img)}
                alt={`${vendor.businessName || vendor.name} gallery ${index + 1}`}
                width={400}
                height={300}
                className="w-full h-64 object-cover rounded-lg shadow"
                unoptimized
              />
            ))}
          </div>
        </section>
      )}

      {/* Videos */}
      {(vendorPost?.videos?.length > 0 ||
        vendor?.videos?.length > 0 ||
        videoUrl) && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-[#311970] mb-6">Videos</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {(vendorPost?.videos || vendor?.videos || [videoUrl]).map(
              (vid: string, index: number) => {
                const embedUrl = vid.includes("watch?v=")
                  ? vid.replace("watch?v=", "embed/")
                  : vid;
                const isYouTube =
                  embedUrl.includes("youtube.com") || embedUrl.includes("youtu.be");

                return (
                  <div
                    key={index}
                    className="aspect-video w-full rounded-lg overflow-hidden shadow"
                  >
                    {isYouTube ? (
                      <iframe
                        src={`${embedUrl}?autoplay=1&mute=1&loop=1&playlist=${embedUrl
                          .split("/")
                          .pop()}`}
                        title={`Vendor video ${index + 1}`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={getFullUrl(embedUrl)}
                        autoPlay
                        muted
                        loop
                        controls
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                );
              }
            )}
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-[#311970] mb-4">Contact Information</h2>
        <ul className="space-y-2 text-gray-700">
          {phone && (
            <li>
              <strong>Phone:</strong> {phone}
            </li>
          )}
          {email && (
            <li>
              <strong>Email:</strong> {email}
            </li>
          )}
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
      </section>

      {/* Reviews */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-[#311970] mb-6">Reviews</h2>

        <div className="flex items-center gap-3 mb-8">
          <RatingStars rating={Math.round(averageRating)} />
          <span className="text-gray-700 font-medium">
            {averageRating.toFixed(1)} / 5 ({reviews?.length ?? 0} reviews)
          </span>
        </div>

        <div className="space-y-6 mb-10">
          {(reviews || []).map((review: any, index: number) => (
            <div key={review._id || index} className="border border-gray-200 rounded-lg p-6 shadow-sm">
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
                    <strong>Vendor Reply:</strong> {review.reply ?? (review as any).reply}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleReviewSubmit}
          className="border border-gray-200 rounded-lg p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold text-[#311970] mb-4">Write a Review</h3>

          <textarea
            placeholder="Your Review"
            value={newReview.text}
            onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
            className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#311970]"
          />

          <div className="flex items-center gap-2 mb-4">
            <span className="text-gray-700">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNewReview({ ...newReview, rating: star })}
                className={`text-2xl ${star <= newReview.rating ? "text-yellow-400" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="bg-[#311970] text-white px-6 py-2 rounded-lg shadow hover:bg-[#261457] transition"
          >
            Submit Review
          </button>
        </form>
      </section>

      <Footer />
    </main>
  );
}
