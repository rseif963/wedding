"use client";

import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import {
  Star,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";


function getReviewerName(review: any) {
  const client = review?.client ?? {};

  const getFirst = (str?: string) => (str ? str.split(" ")[0] : "");

  if (client.brideName && client.groomName) {
    return `${getFirst(client.brideName)} & ${getFirst(client.groomName)}`;
  }

  if (client.name) return getFirst(client.name);

  return "Anonymous";
}

export default function Reviews({ vendorId }: { vendorId?: string }) {
  const {
    reviews = [],
    fetchReviewsForVendor,
    vendorProfile,
    fetchVendorMe,
    replyToReview,
    clientProfile,
  } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [activeReply, setActiveReply] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});

  const resolvedVendorId = vendorId || vendorProfile?._id;

  function getInitials(review: any) {
    const client = review?.client ?? {};

    const firstInitial = (name?: string) =>
      name?.trim()?.charAt(0)?.toUpperCase() ?? "";

    if (client.brideName && client.groomName) {
      return (
        firstInitial(client.brideName) +
        firstInitial(client.groomName)
      );
    }

    if (client.name) {
      return firstInitial(client.name);
    }

    return "A"; // fallback
  }


  useEffect(() => {
    fetchVendorMe();
  }, []);

  useEffect(() => {
    if (!resolvedVendorId) return;
    const load = async () => {
      setLoading(true);
      await fetchReviewsForVendor(resolvedVendorId);
      setLoading(false);
    };
    load();
  }, [resolvedVendorId]);

  const submitReply = async (reviewId: string) => {
    const text = replyText[reviewId]?.trim();
    if (!text) return toast.error("Reply cannot be empty");

    setSubmitting((p) => ({ ...p, [reviewId]: true }));

    try {
      await replyToReview(reviewId, text);
      await fetchReviewsForVendor(resolvedVendorId!);
      setActiveReply(null);
      setReplyText((p) => ({ ...p, [reviewId]: "" }));
      toast.success("Reply posted");
    } finally {
      setSubmitting((p) => ({ ...p, [reviewId]: false }));
    }
  };

  // Rating distribution
  const total = reviews.length || 1;
  const avg =
    reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / total;

  const dist = [1, 2, 3, 4, 5].map(
    (n) => reviews.filter((r: any) => r.rating === n).length
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50">

      {/* HEADER SECTION */}
      <div className="mb-10">
        <h1
          className="font-serif font-bold"
          style={{ fontSize: "32px", color: "#1E1E1E" }}
        >
          Reviews & Ratings
        </h1>

        <p
          className="mt-1"
          style={{
            fontSize: "15px",
            color: "#6B7280",
          }}
        >
          See what couples are saying about your work
        </p>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">

        {/* AVG RATING CARD */}
        <div
          className="bg-white rounded-3xl shadow"
          style={{
            padding: "32px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
          }}
        >
          <div className="text-center">
            <div className="text-5xl font-bold">{avg.toFixed(1)}</div>

            <div className="flex justify-center mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6"
                  fill={i < avg ? "#FBBF24" : "#E5E7EB"}
                  stroke="none"
                />
              ))}
            </div>

            <p className="text-gray-500 text-sm mt-1">
              Based on {reviews.length} reviews
            </p>
          </div>
        </div>

        {/* RATING DISTRIBUTION */}
        <div
          className="bg-white rounded-3xl shadow"
          style={{
            padding: "32px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
          }}
        >
          <h3 className="font-semibold text-lg mb-4">Rating Distribution</h3>

          {[5, 4, 3, 2, 1].map((star) => {
            const count = dist[star - 1];
            const width = (count / total) * 100;

            return (
              <div key={star} className="flex items-center mb-3 gap-2">
                <div className="flex items-center gap-1 w-7">
                  <Star
                    className="w-4 h-4"
                    fill="#FBBF24"
                    stroke="none"
                  />
                  <span className="text-sm">{star}</span>
                </div>

                <div className="flex-1 h-2 bg-gray-200 rounded">
                  <div
                    className="h-full bg-yellow-400 rounded"
                    style={{ width: `${width}%` }}
                  />
                </div>

                <div className="w-6 text-right text-gray-600">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* REVIEWS */}
      <div className="space-y-8">

        {loading ? (
          <p className="text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((rev: any) => (
            <div
              key={rev._id}
              className="bg-white rounded-3xl shadow"
              style={{
                padding: "28px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              }}
            >
              {/* HEADER ROW */}
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#311970] flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-sm tracking-wide">
                      {getInitials(rev)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-[15px]">
                      {getReviewerName(rev)}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(rev.createdAt).toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill={i < rev.rating ? "#FBBF24" : "#E5E7EB"}
                      stroke="none"
                    />
                  ))}
                </div>
              </div>

              {/* TEXT */}
              <p className="mt-4 text-gray-700 text-[15px] leading-relaxed">
                {rev.text}
              </p>

              {/* VENDOR REPLY */}
              {rev.reply && (
                <div
                  className="mt-4 rounded-lg"
                  style={{
                    background: "#FFF4F6",
                    borderLeft: "4px solid #F9A8D4",
                    padding: "16px",
                  }}
                >
                  <p className="font-semibold text-[14px] mb-1">Your Reply</p>
                  <p className="text-[14px] text-gray-700">{rev.reply}</p>
                </div>
              )}

              {/* ACTIONS */}
              <div className="mt-4 flex items-center gap-6">
                {/*<button className="flex items-center gap-1 text-gray-500 text-sm">
                  <ThumbsUp className="w-4 h-4" />
                  Helpful ({rev.helpful || 0})
                </button>*/}
                
                {!rev.reply && vendorProfile?._id === rev.vendorId && (
                  <button
                    onClick={() => setActiveReply(rev._id)}
                    className="flex items-center gap-1 text-purple-600 text-sm font-medium hover:underline"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Reply
                  </button>
                )}
              </div>

              {/* REPLY INPUT */}
              {activeReply === rev._id && (
                <div className="mt-3 space-y-3">
                  <textarea
                    className="w-full border rounded-lg p-3 text-sm"
                    rows={3}
                    value={replyText[rev._id] || ""}
                    onChange={(e) =>
                      setReplyText((p) => ({
                        ...p,
                        [rev._id]: e.target.value,
                      }))
                    }
                    placeholder="Write a reply..."
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => submitReply(rev._id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700"
                    >
                      {submitting[rev._id] ? "Posting..." : "Post Reply"}
                    </button>

                    <button
                      onClick={() => setActiveReply(null)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
