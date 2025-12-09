"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AppReviewsPage = () => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState("");
  const [review, setReview] = useState("");

  const [reviews, setReviews] = useState<
    { name: string; rating: number; review: string; date: string }[]
  >([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || !review) return;

    const newReview = {
      name: name || "Anonymous",
      rating,
      review,
      date: new Date().toLocaleDateString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    setName("");
    setReview("");
    setRating(0);
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[#311970] text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-3">Website Reviews</h1>
        <p className="text-lg opacity-90">
          Tell us what you think about our platform
        </p>
      </section>

      {/* Review Form */}
      <section className="max-w-3xl mx-auto w-full px-6 py-12">
        <div className="bg-white shadow-md rounded-lg p-6 mb-10">
          <h2 className="text-2xl font-bold text-[#311970] mb-4">
            Leave a Review
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star Rating */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-7 h-7 cursor-pointer transition ${
                      (hoverRating || rating) >= star
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Your Name (optional)
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#311970]"
              />
            </div>

            {/* Review */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                placeholder="Write your feedback..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border rounded-lg resize-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#311970]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#311970] text-white py-3 rounded-lg font-semibold hover:bg-[#261457] transition"
            >
              Submit Review
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500">
              No reviews yet. Be the first to review!
            </p>
          ) : (
            reviews.map((r, index) => (
              <div
                key={index}
                className="bg-white shadow rounded-lg p-5 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-[#311970]">
                    {r.name}
                  </h3>
                  <span className="text-xs text-gray-400">{r.date}</span>
                </div>

                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < r.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 text-sm">{r.review}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AppReviewsPage;
