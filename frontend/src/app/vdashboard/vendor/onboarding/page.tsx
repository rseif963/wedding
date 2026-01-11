"use client";

import Image from "next/image";
import { Search, Calendar, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OnboardingPage() {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const played = localStorage.getItem("onboarding-welcome-animated");

    if (!played) {
      // First visit → animate
      setShouldAnimate(true);
      setTimeout(() => setVisible(true), 20);
      localStorage.setItem("onboarding-welcome-animated", "true");
    } else {
      // Already animated → show instantly
      setVisible(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 overflow-hidden">
      

      {/* Heading */}
      <h1
        className={`text-[56px] leading-[64px] font-semibold text-[#3B1D82] text-center transition-all duration-700 delay-100
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        Welcome to Wedpine
      </h1>

      {/* Subheading */}
      <p
        className={`mt-4 max-w-[620px] text-center text-[18px] leading-[28px] text-[#6B5FA7] transition-all duration-700 delay-200
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        Let&apos;s get your business ready to be discovered by couples planning
        their perfect day.
      </p>

      {/* Feature Cards */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {[
          {
            icon: <Search className="h-6 w-6 text-[#3B1D82]" />,
            title: "Get Discovered",
            text: "Couples actively searching will find your business",
          },
          {
            icon: <Calendar className="h-6 w-6 text-[#3B1D82]" />,
            title: "Receive Bookings",
            text: "Get direct booking requests from engaged couples",
          },
          {
            icon: <ShieldCheck className="h-6 w-6 text-[#3B1D82]" />,
            title: "Build Trust",
            text: "Earn a verified badge to stand out from the crowd",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl shadow-[0_12px_30px_rgba(59,29,130,0.08)] px-8 py-10 text-center transition-all duration-700
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: `${300 + i * 120}ms` }}
          >
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#F2EFFA]">
              {card.icon}
            </div>
            <h3 className="text-[20px] font-semibold text-[#3B1D82] mb-2">
              {card.title}
            </h3>
            <p className="text-[15px] leading-[24px] text-[#6B5FA7]">
              {card.text}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        className={`transition-all duration-700 delay-[750ms]
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <Link href="/vdashboard/vendor/onboarding/account-basics">
          <button className="mt-16 rounded-2xl bg-[#3B1D82] px-10 py-4 text-[16px] font-medium text-white shadow-[0_10px_25px_rgba(59,29,130,0.35)] hover:opacity-90 transition">
            Start Setup
          </button>
        </Link>
      </div>

      {/* Footer */}
      <p
        className={`mt-4 text-[14px] text-[#6B5FA7] transition-opacity duration-700 delay-[850ms]
        ${visible ? "opacity-100" : "opacity-0"}`}
      >
        Takes about 3–5 minutes
      </p>
    </div>
  );
}
