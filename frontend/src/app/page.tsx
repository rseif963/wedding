import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import FeaturedCategories from "../components/FeaturedCategories";
import FeaturedVendors from "../components/FeaturedVendors";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import VendorCTA from "@/components/VendorCTA";
import TipsIdeas from "@/components/TipsIdeas";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedCategories />
      <FeaturedVendors />
      <TipsIdeas />
      <HowItWorks />
      <VendorCTA />
      <Testimonials />
      <Footer />
    </main>
  );
}