"use client";

import Link from "next/link";

export default function VendorCTA() {
  return (
    <section className="bg-[#311970] text-white py-20">
      <div className="max-w-6xl mx-auto px-2 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Are You a Wedding Vendor?
        </h2>
        <p className="text-sm mb-8 text-gray-200">
          List your business on <span className="font-semibold">Wedpine</span> and connect with thousands of couples planning their big day.
        </p>
        <Link
          href="/auth"
          className="bg-white text-[#311970] font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          List Your Business
        </Link>
      </div>
    </section>
  );
}