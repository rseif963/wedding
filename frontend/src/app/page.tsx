"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import FeaturedCategories from "../components/FeaturedCategories";
import FeaturedVendors from "../components/FeaturedVendors";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import VendorCTA from "@/components/VendorCTA";
import TipsIdeas from "@/components/TipsIdeas";
import PopularCities from "@/components/PopularCities";
import Loader from "../components/Loader";
import { useState, useEffect } from "react";
import TopListingVendors from "@/components/TopListingVendors";

export default function Home() {
  

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <Hero />    
      <FeaturedCategories />
      <TopListingVendors />
      <FeaturedVendors />
      <TipsIdeas />
      <PopularCities />
      <HowItWorks />
      <VendorCTA />
      <Testimonials />
      <Footer />
    </main>
  );
}


