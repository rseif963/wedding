"use client";
import Image from "next/image";
import Navbar from "../../components/Navbar"; 
import Footer from "../../components/Footer";   

export default function About() {
  const team = [
    {
      name: "Salim Seif",
      role: "CEO & Founder",
    },
    {
      name: "Rashid Seif",
      role: "CTO & Lead Developer",
    },
    {
      name: "Olivia Njeri",
      role: "Content Writter",
    },
    {
      name: "",
      role: "Vendor Relations Manager",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-[#311970] text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-sm p-2 max-w-2xl mx-auto">
          At Wedpine, we’re redefining the way couples connect with trusted
          wedding vendors. Our mission is to make planning your dream wedding
          seamless, joyful, and stress-free.
        </p>
      </section>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-[#311970] mb-6">Our Mission</h2>
        <p className="text-gray-700 max-w-3xl mx-auto">
          We believe every couple deserves the wedding of their dreams. That’s
          why we created Wedpine — to connect you with the best vendors, venues,
          and services that match your style, budget, and vision.
        </p>
      </section>

      {/* Team Section */}
      <section className="bg-white py-20 flex-grow">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#311970] mb-12">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {team.map((member, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-gray-100 shadow-md p-6 rounded-lg hover:shadow-lg transition"
              >
                
                <h3 className="text-xl font-semibold text-[#311970]">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#311970] text-white px-2 text-center py-16">
        <h2 className="text-3xl font-bold mb-4">Join us on our journey</h2>
        <p className="mb-6 text-sm">
          Whether you’re a couple planning your big day or a vendor looking to
          connect, Wedpine is here to make it happen.
        </p>
        <a
          href="/contact"
          className="bg-white text-[#311970] px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
        >
          Contact Us
        </a>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
