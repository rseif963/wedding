// src/components/Reviews.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

type Props = { preview?: boolean; vendorId?: string };

export default function Reviews({ preview = false, vendorId }: Props) {
  const {
    reviews = [],
    fetchReviewsForVendor,
    postReview,
    vendorProfile,
    role,
  } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [textInput, setTextInput] = useState<string>("");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [activeReply, setActiveReply] = useState<string | null>(null);
  


  // ✅ Resolve vendor id properly
  const resolveVendorId = () => {
    if (vendorId) return vendorId;
    if (vendorProfile?._id) return vendorProfile._id; // main vendor id
    return undefined;
  };

  useEffect(() => {
    const loadReviews = async () => {
      const vid = resolveVendorId();
      if (!vid) return;

      setLoading(true);
      try {
        await fetchReviewsForVendor(vid);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [vendorId, vendorProfile?._id]);


  const submitReview = async () => {
    const vid = resolveVendorId();
    if (!vid) {
      toast.error("No vendor specified");
      return;
    }
    if (!ratingInput || ratingInput < 1 || ratingInput > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }
    setSubmitting(true);
    try {
      await postReview({ vendorId: vid, rating: ratingInput, text: textInput.trim() });
      setTextInput("");
      setRatingInput(5);
      toast.success("Review posted");
      // reload reviews

    } catch (err) {
      console.error("Failed to post review:", err);
      toast.error("Could not post review");
    } finally {
      setSubmitting(false);
    }
  };

  const submitReply = async (reviewId: string) => {
    if (!replyText[reviewId] || !replyText[reviewId].trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      // 🔹 You'll need a context function like postReply(reviewId, replyText)
      // or call your API directly here
      // Example:
      // await postReply({ reviewId, reply: replyText[reviewId] });

      toast.success("Reply posted");
      setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
      await fetchReviewsForVendor(resolveVendorId()!); // reload
    } catch (err) {
      console.error("Failed to post reply:", err);
      toast.error("Could not post reply");
    }
  };


  // Preview: show just a small summary
  if (preview) {
    return (
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-2">All Reviews</h2>
        <p className="text-gray-600 text-sm">
          You have {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white p-2 rounded-xl shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Reviews</h2>

      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((rev: any) => (
            <li key={rev._id ?? Math.random()} className="border-b pb-2">
              <p className="font-medium text-gray-700">
                {rev.client?.name ?? rev.clientName ?? "Client"}
              </p>
              <p className="text-sm text-gray-600">⭐ {rev.rating ?? "N/A"}/5</p>
              <p className="text-sm text-gray-500">{rev.text}</p>
              {rev.reply && (
                <div className="mt-3 bg-gray-50 rounded p-2 flex justify-end">
                  <p className="text-sm text-gray-700 text-right max-w-[70%]">
                    <strong>Vendor Reply:</strong> {rev.reply}
                  </p>
                </div>
              )}
              {role === "vendor" && !rev.reply && (
                <div className="mt-2 ml-4">
                  {activeReply === rev._id ? (
                    <>
                      <textarea
                        placeholder="Write a reply..."
                        value={replyText[rev._id] || ""}
                        onChange={(e) =>
                          setReplyText((prev) => ({ ...prev, [rev._id]: e.target.value }))
                        }
                        className="w-full border rounded p-2 text-sm mb-2"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => submitReply(rev._id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          Submit Reply
                        </button>
                        <button
                          onClick={() => setActiveReply(null)}
                          className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => setActiveReply(rev._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Reply
                    </button>
                  )}
                </div>
              )}
            </li>

          ))}
        </ul>
      )}

      {/* Optional: allow clients to add a review */}
      {role === "client" && resolveVendorId() && (
        <div className="mt-4 border-t pt-4">
          <h3 className="font-medium text-gray-800 mb-2">Leave a review</h3>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm text-gray-600">Rating:</label>
            <select
              value={ratingInput}
              onChange={(e) => setRatingInput(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value={5}>5</option>
              <option value={4}>4</option>
              <option value={3}>3</option>
              <option value={2}>2</option>
              <option value={1}>1</option>
            </select>
          </div>

          <textarea
            placeholder="Write your review..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="w-full border rounded p-2 text-sm mb-2"
            rows={3}
          />

          <div className="flex justify-end">
            <button
              onClick={submitReview}
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post review"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
