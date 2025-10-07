"use client";

import { Search, Users, CalendarCheck, PartyPopper } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Find Vendors",
      description:
        "Browse through hundreds of trusted wedding vendors by category and location.",
      icon: <Search size={32} />,
    },
    {
      id: 2,
      title: "Compare & Shortlist",
      description:
        "Check ratings, reviews, and portfolios to choose the right vendor for your big day.",
      icon: <Users size={32} />,
    },
    {
      id: 3,
      title: "Book Easily",
      description:
        "Contact vendors directly and manage bookings seamlessly on our platform.",
      icon: <CalendarCheck size={32} />,
    },
    {
      id: 4,
      title: "Celebrate Stress-Free",
      description:
        "Enjoy your dream wedding while we help you handle the details.",
      icon: <PartyPopper size={32} />,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="text-[#311970] mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}