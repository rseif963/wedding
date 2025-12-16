"use client";

import Link from "next/link";
import Image from "next/image";
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
  {
    name: "Photography",
    icon: Camera,
    image: "/assets/category-photography.jpg",
    link: "/vendors?category=Photography",
  },
  {
    name: "Venue",
    icon: Building2,
    image: "/assets/category-venues.jpg",
    link: "/vendors?category=Venue",
  },
  {
    name: "Decoration",
    icon: Flower2,
    image: "/assets/category-decor.jpg",
    link: "/vendors?category=Decoration",
  },
  {
    name: "Catering",
    icon: Utensils,
    image: "/assets/category-catering.jpg",
    link: "/vendors?category=Catering",
  },
  {
    name: "Makeup & Beauty",
    icon: Heart,
    image: "/assets/category-makeup.jpg",
    link: "/vendors?category=Makeup & Beauty",
  },
  {
    name: "Dresses",
    icon: Shirt,
    image: "/assets/category-dresses.jpg", // placeholder
    link: "/vendors?category=Dresses",
  },
  {
    name: "Tailor",
    icon: Scissors,
    image: "/assets/category-tailor.jpg", // placeholder
    link: "/vendors?category=Tailor",
  },
  {
    name: "Cars",
    icon: Car,
    image: "/assets/category-cars.jpg", // placeholder
    link: "/vendors?category=Cars",
  },
  {
    name: "Cake",
    icon: Cake,
    image: "/assets/category-cakes.jpg", // placeholder
    link: "/vendors?category=Cakes",
  },
  {
    name: "Music & Ent",
    icon: Music,
    image: "/assets/category-music.jpg", // placeholder
    link: "/vendors?category=Music & Entertainment",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Explore Categories
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find the perfect match for every part of your wedding
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={category.link}
              className="group animate-fade-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-elevated">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <category.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-white leading-tight">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
