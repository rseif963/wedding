"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    // Navigate to /vendors with search and location as query params
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (location.trim()) params.set("location", location.trim());

    router.push(`/vendors?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/hero-wedding.jpg"
          alt="Wedding background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      <div className="container relative z-10 mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto mt-18">
          <h1 className="font-display text-4xl md:text-7xl font-bold text-foreground mb-6 animate-fade-up">
            Everything You Need To Plan Your
            <span className="text-gradient text-purple-900 block mt-2">Wedding Day.</span>
          </h1>

          <p className="text-md md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-up delay-100">
            Connect with verified wedding professionals. From photographers to venues,
            discover trusted vendors who will make your special day unforgettable.
          </p>

          {/* Search Bar */}
          <div className="bg-background/80 backdrop-blur-sm rounded-2xl shadow-elevated p-3 max-w-2xl mx-auto animate-fade-up delay-200">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 py-3 border-0 bg-muted/50 rounded-xl focus:outline-none"
                />
              </div>

              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 py-3 border-0 bg-muted/50 rounded-xl focus:outline-none"
                />
              </div>

              <button
                onClick={handleSearch}
                className="bg-[#311970] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#26125a] transition md:w-auto"
              >
                Search
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 animate-fade-up delay-300">
            <Link
              href="/vendors"
              className="inline-flex items-center bg-white justify-center border border-border px-6 py-3 rounded-xl font-semibold hover:bg-muted transition"
            >
              Browse All Vendors
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            <Link
              href="/auth?mode=signup&role=vendor"
              className="text-md font-bold text-muted-foreground hover:text-foreground transition"
            >
              List Your Business
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
