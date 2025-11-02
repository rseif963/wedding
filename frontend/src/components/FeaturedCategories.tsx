"use client";

import {
  Camera,
  Building2,
  Flower2,
  Utensils,
  Heart,
  Shirt,
  Car,
  Cake,
  Scissors,
  Music,
} from "lucide-react";

export default function FeaturedCategories() {
  const categories = [
    { id: 1, name: "Photography", icon: <Camera size={22} />, link: "/vendors?category=Photography" },
    { id: 2, name: "Venue", icon: <Building2 size={22} />, link: "/vendors?category=Venue" },
    { id: 3, name: "Decoration", icon: <Flower2 size={22} />, link: "/vendors?category=Decoration" },
    { id: 4, name: "Catering", icon: <Utensils size={22} />, link: "/vendors?category=Catering" },
    { id: 5, name: "Makeup & Beauty", icon: <Heart size={22} />, link: "/vendors?category=Makeup & Beauty" },
    { id: 6, name: "Dresses", icon: <Shirt size={22} />, link: "/vendors?category=Dresses" },
    { id: 7, name: "Tailor", icon: <Scissors size={22} />, link: "/vendors?category=Tailor" },
    { id: 8, name: "Cars", icon: <Car size={22} />, link: "/vendors?category=Cars" },
    { id: 9, name: "Cake", icon: <Cake size={22} />, link: "/vendors?category=Cakes" },
    { id: 10, name: "Music & Ent", icon: <Music size={22} />, link: "/vendors?category=Music & Entertainment" },
  ];

  return (
    <section className="py-10 bg-white">
      <div className="max-w-6xl mx-auto px-3">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Explore Categories
        </h2>

        {/* ✅ Horizontal scroll & equal box sizing */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={cat.link}
              className="flex flex-col items-center justify-center min-w-[110px] h-[110px] bg-gray-100 rounded-lg shadow hover:shadow-lg hover:bg-gray-200 transition flex-shrink-0"
            >
              <div className="text-[#311970] mb-2">{cat.icon}</div>
              <h3 className="font-medium text-gray-700 text-center text-sm leading-tight">
                {cat.name}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
