"use client";
import { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "../../context/AppContext";

export default function Blog() {
  const { blogs, fetchBlogs } = useAppContext();

  useEffect(() => {
    fetchBlogs(); // Fetch blogs from backend via AppContext
  }, []);

  const getImageUrl = (img?: string) => {
    if (!img) return "/assets/default-blog.jpg"; // fallback
    if (img.startsWith("http")) return img;
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative overflow-hidden text-white py-28 text-center"
        style={{
          backgroundImage: "url('/assets/blog-header.jpg')", // your image
          backgroundSize: "cover",       // ensures full coverage
          backgroundPosition: "center",  // centers the image
          backgroundRepeat: "no-repeat", // prevents tiling
        }}
      >
        <div className="absolute inset-0 bg-[#311970]/50"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-sm p-2 max-w-2xl mx-auto">
            Tips, inspiration, and ideas to help you plan the perfect wedding.
          </p>
        </div>
      </section>


      {/* Blog Grid */}
      <section className="max-w-6xl mx-auto px-3 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {blogs.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">
              No blog posts available.
            </p>
          ) : (
            blogs.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {/* Blog Image */}
                <div className="relative w-full h-56">
                  <Image
                    src={getImageUrl(post.mainPhoto)}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-bold text-[#311970] mt-2 mb-3">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {post.description?.slice(0, 120)}...
                  </p>
                  <Link
                    href={`/blog/${post._id}`}
                    className="text-[#311970] font-semibold hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-[#311970] text-white px-6 py-3 rounded-lg shadow hover:bg-[#261457] transition">
            Load More
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
