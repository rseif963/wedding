import React from "react";
import Link from "next/link";

export default function Subscriptions() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-2xl text-center bg-white/90 backdrop-blur rounded-3xl p-10 shadow-xl">
        {/* Head */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
          You’re early, and that matters.
        </h1>

        {/* Body */}
        <p className="text-gray-600 text-base leading-relaxed mb-5">
          Wedpine is currently welcoming a limited number of vendors as we build a
          trusted wedding marketplace. Subscription billing will be introduced
          shortly.
        </p>

        <p className="text-gray-600 text-base leading-relaxed mb-8">
          Once billing is live, you’ll be notified in advance, with special
          early-access benefits for our first vendors.
        </p>

        {/* Button */}
        <Link href="/vdashboard/vendor">
          <button className="w-full bg-[#311970] text-white py-2 rounded-lg text-sm font-medium">
            Go to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
