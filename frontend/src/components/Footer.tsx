import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand + Contact */}
        <div>
          <h2 className="text-lg font-semibold text-white">Wedpine</h2>
          <p className="mt-2 text-sm">Your trusted directory for wedding vendors.</p>

          {/* Contact Us */}
          <div className="mt-4 text-sm">
            <h3 className="text-white font-medium mb-2">Contact Us</h3>
            <p>
              Email:{" "}
              <a href="mailto:info@wedpine.com" className="hover:text-[#311970]">
                info@wedpine.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a href="tel:‪+254704228615‬" className="hover:text-[#311970]">
                ‪+254 704 228 615‬
              </a>
            </p>
            <p>
              WhatsApp:{" "}
              <a
                href="https://wa.me/254704228615"
                target="_blank"
                rel="noreferrer"
                className="hover:text-green-500"
              >
                Chat with us
              </a>
            </p>
            <p>Address: Nairobi, Kenya</p>
          </div>

          {/* Social Media */}
          <div className="flex gap-4 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#311970]"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#311970]"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#311970]"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#311970]"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="https://wa.me/254704228615"
              target="_blank"
              rel="noreferrer"
              className="hover:text-green-500"
            >
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-medium mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/" className="hover:text-[#311970]">Home</a></li>
            <li><a href="/vendors" className="hover:text-[#311970]">Vendors</a></li>
            <li><a href="/blog" className="hover:text-[#311970]">Blog</a></li>
            <li><a href="/about" className="hover:text-[#311970]">About</a></li>
            <li><a href="/contact" className="hover:text-[#311970]">Contact</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-medium mb-2">Stay Updated</h3>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 bg-white py-2 w-full rounded-l-lg text-gray-800"
            />
            <button className="bg-[#311970] px-4 py-2 rounded-r-lg text-white hover:bg-[#261457]">
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Bottom line */}
      <div className="text-center text-gray-500 text-sm mt-8">
        © {new Date().getFullYear()} Wedpine. All rights reserved.
      </div>
    </footer>
  );
}
