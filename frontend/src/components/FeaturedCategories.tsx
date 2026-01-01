"use client";

import Link from "next/link";
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

const categories = [
  { name: "Photography", icon: Camera, link: "/vendors?category=Photography" },
  { name: "Venue", icon: Building2, link: "/vendors?category=Venue" },
  { name: "Decoration", icon: Flower2, link: "/vendors?category=Decoration" },
  { name: "Catering", icon: Utensils, link: "/vendors?category=Catering" },
  { name: "Makeup & Beauty", icon: Heart, link: "/vendors?category=Makeup & Beauty" },
  { name: "Dresses", icon: Shirt, link: "/vendors?category=Dresses" },
  { name: "Tailor", icon: Scissors, link: "/vendors?category=Tailor" },
  { name: "Cars", icon: Car, link: "/vendors?category=Cars" },
  { name: "Cake", icon: Cake, link: "/vendors?category=Cakes" },
  { name: "Music & Ent", icon: Music, link: "/vendors?category=Music & Entertainment" },
];

export default function CategoriesSection() {
  return (
    <section className="bg-white py-12">
      <div className="text-center mb-16">
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-2">
          Explore Categories
        </h2>
        <p className="text-muted-foreground text-md max-w-2xl px-2 mx-auto">
          Find the perfect match for every part of your wedding
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        {/* Horizontal scroll container */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={category.link}
                className="flex-shrink-0 w-[140px] sm:w-[140px]"
              >
                <div
                  className="group h-full rounded-2xl
               bg-gray-100 border border-gray-200
               shadow-sm hover:shadow-md
               transition-all duration-200
               flex flex-col items-center justify-center
               px-2 py-6 text-center"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <Icon
                    className="h-7 w-7 mb-3 text-purple-600 group-hover:text-purple-700 transition-colors"
                  />
                  <span className="text-sm font-medium text-gray-800 leading-tight">
                    {category.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
