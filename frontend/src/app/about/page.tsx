"use client";

import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function About() {
  const team = [
    { name: "Salim Seif", role: "CEO & Founder" },
    { name: "Rashid Seif", role: "CTO & Lead Developer" },
    { name: "Farhiya Mohamed", role: "Content Writer" },
    { name: "Rashid Seif", role: "Vendor Relations Manager" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* ================= HERO ================= */}
      <section
        className="relative overflow-hidden mt-16 text-white py-28 text-center"
        style={{
          backgroundImage: "url('/assets/about-header.jpg')", // <-- your image
          backgroundSize: "cover",        // makes it fill width & height
          backgroundPosition: "center",   // centers the image
          backgroundRepeat: "no-repeat",  // prevents repeat
        }}
      >
        <div className="absolute inset-0 bg-[#311970]/50"></div>
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <h1 className="text-5xl text-wite font-extrabold mb-4 tracking-tight">
              Redefining Wedding Planning
            </h1>
            <p className="max-w-2xl px-2 mx-auto text-base opacity-90">
              Wedpine is more than a platform — it's a movement. A next-generation
              digital space built to help couples plan with confidence, connect
              with trusted vendors, and bring their vision to life effortlessly.
            </p>
          </motion.div>
        </div>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1e0d4d] opacity-30 pointer-events-none" />
      </section>


      {/* ================= ABOUT SECTION ================= */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-[#311970] mb-10"
        >
          Who We Are
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-gray-700 text-center max-w-3xl mx-auto text-lg leading-relaxed"
        >
          Founded with passion in East Africa, Wedpine is built for the modern
          couple, intuitive, elegant, and deeply human. We combine smart
          technology with genuine storytelling to connect couples with verified
          wedding vendors, ensuring transparency, trust, and unmatched
          convenience. Our mission is simple: make wedding planning feel magical
          again.
        </motion.p>
      </section>

      {/* ================= MISSION / VISION ================= */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition"
          >
            <h3 className="text-2xl font-bold text-[#311970] mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to build Africa’s most trusted wedding ecosystem, 
              empowering couples with clarity, empowering vendors with growth,
              and bringing beauty, culture, and celebration into one seamless
              digital experience. We believe in weddings that reflect who you
              are, not who tradition forces you to be.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition"
          >
            <h3 className="text-2xl font-bold text-[#311970] mb-4">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              To become the global standard for modern wedding planning,
              personal, intuitive, and culturally inclusive. Our vision for 2026
              and beyond is to lead innovation through smart automation, vendor
              verification, personalized planning dashboards, and rich couple
              storytelling experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      {/*<section className="max-w-6xl mx-auto px-6 py-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center text-[#311970] mb-12"
        >
          What We Stand For
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Trust First",
              text: "Every vendor is verified. Every review is real. Every couple is protected.",
            },
            {
              title: "Human-Centered Design",
              text: "We design for joy, clarity, and simplicity — not overwhelm.",
            },
            {
              title: "Innovation with Purpose",
              text: "We build tools that solve real planning challenges, not gimmicks.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-md border hover:shadow-xl transition"
            >
              <h4 className="text-xl font-semibold text-[#311970] mb-3">
                {item.title}
              </h4>
              <p className="text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>*/}

      {/* ================= TEAM SECTION ================= */}
      {/*<section className="bg-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#311970] mb-10">Our Team</h2>
          <p className="text-gray-600 mb-12 text-sm">
            A small dream-driven team building the future of wedding planning.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-[#311970]">
                  {member.name}
                </h3>
                <p className="text-xs text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* CTA */}
      <section className="bg-[#311970] text-white text-center py-20 px-4">
        <h2 className="text-4xl font-bold">Let’s build your perfect day</h2>
        <p className="max-w-xl mx-auto mt-4 text-sm opacity-90">
          Whether you're planning your wedding or offering services, Wedpine is
          your partner in the journey.
        </p>

        <a
          href="/contact"
          className="inline-block mt-6 bg-white text-[#311970] font-semibold py-3 px-8 rounded-xl shadow hover:bg-gray-200 transition"
        >
          Contact Us
        </a>
      </section>

      <Footer />
    </main>
  );
}
