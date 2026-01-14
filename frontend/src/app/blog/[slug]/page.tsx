import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Breadcrumb from "../../../components/Breadcrumb";
import Image from "next/image";
import { Metadata } from "next";
import { blogs } from "@/app/blog/data/blogs";

type BlogProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: BlogProps): Promise<Metadata> {
  const post = blogs.find((b) => b.slug === params.slug);

  if (!post) {
    return {
      title: "Blog Post Not Found | Wedpine",
      description: "The blog post you are looking for does not exist.",
    };
  }

  return {
    title: `${post.title} | Wedpine Blog`,
    description: post.excerpt || post.title,
    alternates: {
      canonical: `https://wedpine.com/blog/${params.slug}`,
    },
  };
}

export default function BlogPost({ params }: BlogProps) {
  const post = blogs.find((b) => b.slug === params.slug);

  if (!post) {
    return (
      <main className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <div className="max-w-6xl mx-auto w-full px-1 mt-3">
          <Breadcrumb />
        </div>

        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#311970] mb-4">
              Post Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The blog post you’re looking for doesn’t exist.
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

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto w-full px-1 mt-3">
        <Breadcrumb />
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#311970] mb-6">
          {post.title}
        </h1>

        <Image
          src={post.image || "/assets/default-blog.jpg"}
          alt={post.title}
          width={900}
          height={450}
          className="w-full h-80 object-cover rounded-xl mb-8"
          priority
        />

        {/* FULL BLOG CONTENT */}
        <div className="prose prose-lg max-w-none text-gray-700">
          {post.content}
        </div>
      </article>

      <Footer />
    </main>
  );
}
