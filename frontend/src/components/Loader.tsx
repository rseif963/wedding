"use client";

import React from "react";
import Image from "next/image";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999]">

      {/* Logo container with smooth floating + rotation */}
      <div className="relative w-34 h-34 animate-floating">
        <div className="absolute inset-0 animate-spin-slow">
          <div className="w-full h-full rounded-full border-[7px] border-[#31197030] border-t-[#311970]"></div>
        </div>

        {/* Smaller favicon inside the spinning circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 relative">
            <Image
              src="/favicon.ico"
              alt="Wedpine Favicon"
              fill
              className="object-contain animate-soft-bounce drop-shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Text */}
      <h2 className="mt-6 text-lg md:text-xl font-semibold text-gray-700 tracking-wide animate-pulse text-center px-4">
        Everything you need for your wedding day.
      </h2>

      {/* Custom animations */}
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
        .animate-floating {
          animation: floating 3s ease-in-out infinite;
        }
        .animate-soft-bounce {
          animation: softBounce 2.8s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes floating {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes softBounce {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.06);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
