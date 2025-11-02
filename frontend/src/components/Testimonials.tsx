"use client";
import Link from "next/link";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Margret & Brian",
      text: "Wedpine made planning our wedding so much easier! We found the perfect venue and photographer in no time.",
      rating: 5,
    },
    {
      id: 2,
      name: "Grace & Daniel",
      text: "The vendors we booked were amazing, and the whole process was stress-free. Highly recommended!",
      rating: 4,
    },
    {
      id: 3,
      name: "Mary & Jerry",
      text: "We discovered Bloom & Bliss Decor on this platform — they made our wedding beautiful beyond expectations.",
      rating: 5,
    },
  ];

  return (
    <section className="py-10 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-12">
          What Couples Say ❤
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#eee] p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <p className="text-gray-600 italic mb-4">“{t.text}”</p>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${i < t.rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                      }`}
                  />
                ))}
              </div>
              <h3 className="font-semibold text-gray-800">{t.name}</h3>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link
          href="/auth"
          className="relative z-10 inline-block bg-[#311970] text-white font-semibold px-5 py-2 rounded-lg border border-[#311970] hover:bg-white hover:text-[#311970] transition"
        >
          All Reviews
        </Link>
        </div>

      </div>
    </section>
  );
}