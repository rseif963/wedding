"use client";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Breadcrumb from "../../../components/Breadcrumb";
import Image from "next/image";
import { useAppContext } from "../../../context/AppContext";

type BlogProps = {
  params: { slug: string };
};

export default function BlogPost({ params }: BlogProps) {
  const { blogs, fetchBlogs } = useAppContext();
  const [post, setPost] = useState<any>(null);

  // Fetch blogs if not already loaded
  useEffect(() => {
    if (blogs.length === 0) {
      fetchBlogs();
    }
  }, []);

  // Find the matching blog once blogs are available
  useEffect(() => {
    const foundPost = blogs.find((b) => b._id === params.slug);
    setPost(foundPost || null);
  }, [blogs, params.slug]);

  const getImageUrl = (img?: string) => {
    if (!img) return "/assets/default-blog.jpg"; // fallback
    if (img.startsWith("http")) return img;
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
  };

 
  if (!post) {
    return (
      <main className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto w-full px-3 mt-6 overflow-x-auto scrollbar-hide">
          <Breadcrumb />
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#311970] mb-4">
              Post Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The blog post you’re looking for doesn’t exist or has been removed.
            </p>
            <a
              href="/blog"
              className="bg-[#311970] text-white px-6 py-3 rounded-lg shadow hover:bg-[#261457] transition"
            >
              Back to Blog
            </a>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // Post found
  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div
        className="max-w-6xl mx-auto w-full px-6 mt-6 truncate text-ellipsis overflow-hidden"
      >
        <Breadcrumb />
      </div>


      <article className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-[#311970] mb-6 break-words">
          {post.title}
        </h1>

        <Image
          src={getImageUrl(post.mainPhoto)}
          alt={post.title}
          width={800}
          height={400}
          className="w-full h-80 object-cover rounded-lg mb-8"
        />

        <div
          className="text-gray-700 leading-relaxed prose max-w-none break-words"
          dangerouslySetInnerHTML={{
            __html: post.content || post.description || "",
          }}
        />
      </article>

      <Footer />
    </main>
  );
}
