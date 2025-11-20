// src/components/Reviews.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

type Props = {
  preview?: boolean;
  vendorId?: string;
};

export default function Reviews({ preview = false, vendorId }: Props) {
  const {
    reviews = [],
    fetchReviewsForVendor,
    postReview,
    vendorProfile,
    fetchVendorMe,
    replyToReview,
  } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [submittingReply, setSubmittingReply] = useState<{ [key: string]: boolean }>({});
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [textInput, setTextInput] = useState<string>("");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [activeReply, setActiveReply] = useState<string | null>(null);

  // Resolve vendorId: either from props or vendorProfile
  const resolveVendorId = () => vendorId || vendorProfile?._id;

  // ✅ Fetch vendor profile on mount so replies work
  useEffect(() => {
    fetchVendorMe();
  }, []);

  // Load reviews whenever vendorId or vendorProfile changes
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

  // Post a new review (client side)
  const submitReview = async () => {
    const vid = resolveVendorId();
    if (!vid) return toast.error("No vendor specified");
    if (!ratingInput || ratingInput < 1 || ratingInput > 5)
      return toast.error("Rating must be between 1 and 5");

    try {
      await postReview({ vendorId: vid, rating: ratingInput, text: textInput.trim() });
      setTextInput("");
      setRatingInput(5);
      toast.success("Review posted");
      await fetchReviewsForVendor(vid); // Refresh reviews immediately
    } catch {
      toast.error("Failed to post review");
    }
  };


  // Post a reply (only vendor can reply)
  const submitReply = async (reviewId: string) => {
    const reply = replyText[reviewId]?.trim();
    if (!reply) return toast.error("Reply cannot be empty");

    setSubmittingReply((prev) => ({ ...prev, [reviewId]: true }));
    try {
      await replyToReview(reviewId, reply);

      setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
      setActiveReply(null);

      const vid = resolveVendorId();
      if (vid) await fetchReviewsForVendor(vid); // Refresh reviews after reply

      toast.success("Reply posted");
    } catch {
      toast.error("Failed to post reply");
    } finally {
      setSubmittingReply((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  if (preview) {
    return (
      <section>
        <h2 className="text-lg font-bold mb-2">All Reviews</h2>
        <p className="text-gray-600 text-sm">
          You have {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Reviews</h2>

      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((rev: any) => (
            <li key={rev._id} className="border-b pb-2">
              <p className="font-medium text-gray-700">
                {rev.client?.name ?? rev.clientName ?? "Client"}
              </p>
              <p className="text-sm text-gray-600">⭐ {rev.rating}/5</p>
              <p className="text-sm text-gray-500">{rev.text}</p>

              {rev.reply && (
                <div className="mt-2 bg-gray-50 rounded p-2">
                  <p className="text-sm text-gray-700">
                    <strong>Vendor Reply:</strong> {rev.reply}
                  </p>
                </div>
              )}

              {/* Vendor reply section: only for logged-in vendor */}
              {vendorProfile && vendorProfile._id === rev.vendorId && (
                <div className="mt-2 ml-2">
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
                          disabled={submittingReply[rev._id]}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:opacity-50"
                        >
                          {submittingReply[rev._id] ? "Posting..." : "Submit Reply"}
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
    </section>
  );
}
