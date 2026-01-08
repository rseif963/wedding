import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { blogs } from "@/app/blog/data/blogs";

export default function Blog() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <section
        className="relative mt-17 overflow-hidden text-white py-28 text-center"
        style={{
          backgroundImage: "url('/assets/blog-header.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
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
              <Link
                href={`/blog/${post.slug}`}
                key={post.slug}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {/* Blog Image */}
                <div className="relative w-full h-56">
                  <Image
                    src={post.image || "/assets/default-blog.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-bold text-[#311970] mt-2 mb-3">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-[#311970] font-semibold hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
