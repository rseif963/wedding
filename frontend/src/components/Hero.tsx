"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; // ✅ Added this import
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
    <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden ">
      {/* Background Images */}
      {images.map((img, index) => (
        <Image
          key={index}
          src={img}
          alt={`Hero ${index + 1}`}
          fill
          priority={index === 0}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100" : "opacity-0"
            }`}
        />
      ))}

      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-2">
        <h1 className="text-4xl sm:text-4xl md:text-6xl font-bold mb-3 leading-snug">
          Plan Your Dream Wedding
        </h1>
        <p className="text-sm sm:text-base md:text-lg max-w-xl mb-6">
          Discover the best venues, photographers, caterers, and more — all in one place.
        </p>

        <div>
          <Link
            href="/auth"
            className="inline-block bg-white text-[#311970] font-semibold px-5 py-2 rounded-lg border border-[#311970] hover:bg-[#311970] hover:text-white transition"
          >
            Get started
          </Link>

        </div>

        {/* Action Buttons - hidden on small screens */}
        <div className="hidden sm:flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
          {/* ✅ Use Next.js <Link /> for internal navigation */}
          <Link
            href="/vendors"
            className="bg-[#311970] px-6 py-3 mt-4 rounded-lg font-semibold shadow hover:bg-[#26125a] transition text-center"
          >
            Explore Vendors
          </Link>
        </div>
      </div>
    </section>
  );
}
