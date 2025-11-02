"use client";

import Image from "next/image";
import Link from "next/link";

export default function PopularCities() {
  const cities = [
    {
      id: 1,
      name: "Nairobi, Kenya",
      county: "Nairobi",
      image: "/assets/nairobi.jpg",
    },
    {
      id: 2,
      name: "Mombasa, Kenya",
      county: "Mombasa",
      image: "/assets/mombasa.jpg",
    },
    {
      id: 3,
      name: "Kisumu, Kenya",
      county: "Kisumu",
      image: "/assets/kisumu.jpg",
    },
    {
      id: 4,
      name: "Nakuru, Kenya",
      county: "Nakuru",
      image: "/assets/nakuru.jpg",
    },
    {
      id: 4,
      name: "Eldoret, Kenya",
      county: "Eldoret",
      image: "/assets/eldoret.jpg",
    },
  ];

  return (
    <section className="py-6 bg-white">
      <div className="max-w-6xl mx-auto px-3">
        <h2 className="text-3xl font-bold text-center mb-3 text-gray-800">
          Popular Cities
        </h2>
        <h3 className="text-1xl font-bold text-center mb-6 text-gray-800">Explore Vendors in your city.</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {cities.map((city) => (
            <Link
              key={`${city.id}-${city.county}`}
              href={`/vendors?county=${encodeURIComponent(city.county)}`}
              className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition group"
            >
              <Image
                src={city.image}
                alt={city.name}
                width={400}
                height={300}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay text with background tint */}
              <div className="absolute inset-0 flex items-end justify-center">
                <div className="w-full text-center bg-[#311970]/50 py-3">
                  <h3 className="text-white text-lg font-semibold tracking-wide">
                    {city.name}
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
