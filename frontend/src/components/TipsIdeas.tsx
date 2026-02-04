"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { blogs } from "@/app/blog/data/blogs";

export default function TipsIdeas() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth - 100;

      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // ✅ Take only first 6 blogs (same logic as before)
  const latestBlogs = blogs.slice(0, 6);

  return (
    <section className="py-8 bg-white relative">
      <div className="max-w-6xl mx-auto px-3">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Tips & Ideas 
        </h2>

        {/* Scroll buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={24} />
        </button>

        {/* Horizontal Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
        >
          {latestBlogs.length === 0 ? (
            <p className="text-gray-500 text-center w-full">
              No posts available.
            </p>
          ) : (
            latestBlogs.map((post) => (
              <div
                key={post.slug}
                className="min-w-[240px] max-w-[240px] bg-gray-50 rounded-lg shadow hover:shadow-md transition overflow-hidden flex-shrink-0"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="block w-full h-full"
                >
                  <div className="relative h-40 w-full">
                    <Image
                      src={post.image || "/assets/default-blog.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-md font-semibold text-gray-800 mt-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </div>
            ))
          )}

          {/* View All Button */}
          <div className="flex items-center justify-center min-w-[200px]">
            <Link
              href="/blog"
              className="inline-block bg-[#311970] text-white px-6 py-3 rounded-lg shadow hover:bg-[#261457] transition"
            >
              View All
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
