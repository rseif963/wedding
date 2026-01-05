"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[#311970] text-white py-20 mt-18 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-4"
        >
          Contact Us
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-sm max-w-2xl mx-auto px-4"
        >
          Have questions or need help? Our team is here to assist you.  
          Get in touch with us today.
        </motion.p>
      </section>

      {/* Contact Info + Form */}
      <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-12">

        {/* Contact Info */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-[#311970] mb-6">Get in Touch</h2>

          <ul className="space-y-6 text-gray-700">
            <li className="flex items-start gap-3">
              <MapPin className="text-[#311970]" size={20} />
              <span><strong>Address:</strong> Nairobi, Kenya</span>
            </li>

            <li className="flex items-start gap-3">
              <Phone className="text-[#311970]" size={20} />
              <span>
                <strong>Phone:</strong>{" "}
                <a href="tel:+254704228615" className="text-[#311970] hover:underline">
                  +254 704 228 615
                </a>
              </span>
            </li>

            <li className="flex items-start gap-3">
              <Mail className="text-[#311970]" size={20} />
              <span>
                <strong>Email:</strong>{" "}
                <a href="mailto:info@wedpine.com" className="text-[#311970] hover:underline">
                  info@wedpine.com
                </a>
              </span>
            </li>

            <li className="flex items-start gap-3">
              <MessageCircle className="text-[#311970]" size={20} />
              <span>
                <strong>WhatsApp:</strong>{" "}
                <a
                  href="https://wa.me/254704228615"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#311970] hover:underline"
                >
                  Chat with us
                </a>
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="flex-1 bg-white shadow-lg rounded-2xl p-8"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-[#311970] mb-6">Send us a Message</h2>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#311970] focus:outline-none"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#311970] focus:outline-none"
            />

            <input
              type="text"
              placeholder="Subject"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#311970] focus:outline-none"
            />

            <textarea
              placeholder="Your Message"
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#311970] focus:outline-none"
            ></textarea>

            <button
              type="submit"
              className="bg-[#311970] text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-[#261457] transition"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
