"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";

const images = ["/assets/hero.jpg", "/assets/hero2.jpg", "/assets/hero3.jpg"];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/vendors?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/vendors");
    }
  };

  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full  overflow-hidden">
      {/* Background Images */}
      {images.map((img, index) => (
        <Image
          key={index}
          src={img}
          alt={`Hero ${index + 1}`}
          fill
          priority={index === 0}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 leading-snug">
          Plan Your Dream Wedding
        </h1>
        <p className="text-sm sm:text-base md:text-lg max-w-xl mb-6">
          Discover the best venues, photographers, caterers, and more — all in one place.
        </p>

        {/* 🔍 Search Box */}
        <div className="w-full max-w-lg mb-6">
          {/* Mobile: input with icon inside */}
          <div className="relative sm:hidden">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search vendors, venues, or services..."
              className="w-full bg-[#eee] px-4 py-3 pr-10 text-gray-900 rounded-lg focus:outline-none text-sm"
            />
            <Search
              size={20}
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#311970]  cursor-pointer"
            />
          </div>

          {/* Desktop: input + button side by side */}
          <div className="hidden sm:flex bg-white rounded-lg overflow-hidden shadow-lg">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search vendors, venues, or services..."
              className="w-full px-4 py-3 text-gray-900 focus:outline-none text-base"
            />
            <button
              onClick={handleSearch}
              className="bg-[#311970] px-6 py-3 text-white font-semibold hover:bg-[#26125a] transition flex items-center justify-center"
            >
              Search
            </button>
          </div>
        </div>

        {/* Action Buttons - hidden on small screens */}
        <div className="hidden sm:flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
          <a
            href="/vendors"
            className="bg-[#311970] px-6 py-3 rounded-lg font-semibold shadow hover:bg-[#26125a] transition text-center"
          >
            Explore Vendors
          </a>
          <a
            href="/auth"
            className="bg-white text-[#311970] px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition text-center"
          >
            Sign Up
          </a>
        </div>
      </div>
    </section>
  );
}
