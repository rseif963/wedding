"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Contact() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[#311970] text-white py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-sm max-w-1xl p-2 mx-auto">
          Have questions or need help? Our team is here to assist you.
          Get in touch with us today.
        </p>
      </section>

      {/* Contact Info + Form */}
      <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-12">
        {/* Contact Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#311970] mb-6">Get in Touch</h2>
          <ul className="space-y-4 text-gray-700">
            <li>
              <strong>Address:</strong> Nairobi, Kenya
            </li>
            <li>
              <strong>Phone:</strong>{" "}
              <a href="tel:‪+254704228615‬" className="text-[#311970] hover:underline">
                ‪+254 704 228 615‬
              </a>
            </li>
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:info@wedpine.com" className="text-[#311970] hover:underline">
                info@wedpine.com
              </a>
            </li>
            <li>
              <strong>WhatsApp:</strong>{" "}
              <a
                href="https://wa.me/254704228615"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#311970] hover:underline"
              >
                Chat with us
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-[#311970] mb-6">Send us a Message</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#311970]"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#311970]"
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#311970]"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#311970]"
            ></textarea>
            <button
              type="submit"
              className="bg-[#311970] text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-[#261457] transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
