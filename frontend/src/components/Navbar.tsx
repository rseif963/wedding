"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

interface LocalUser {
  email?: string;
  id?: string;
  role?: string;
  phone?: string;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, role, authLoading } = useAppContext();
  const pathname = usePathname();

  const [localUser, setLocalUser] = useState<LocalUser | null>(null);
  const [localRole, setLocalRole] = useState<string | null>(null);

  const effectiveRole = role || localRole || null;

  const profileLink =
    effectiveRole === "vendor"
      ? "/vdashboard/vendor"
      : effectiveRole === "client"
      ? "/dashboard/client"
      : "/profile";

  useEffect(() => {
    if (user) {
      setLocalUser(null);
      setLocalRole(null);
      return;
    }

    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) return;

    let mounted = true;

    const detect = async () => {
      try {
        const clientRes = await axios.get("/api/clients/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;
        setLocalUser({
          email: clientRes.data?.user?.email,
          id: clientRes.data?.user?._id,
          role: "client",
          phone: clientRes.data?.phone,
        });
        setLocalRole("client");
        return;
      } catch {}

      try {
        const vendorRes = await axios.get("/api/vendors/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;
        setLocalUser({
          email: vendorRes.data?.user?.email,
          id: vendorRes.data?.user?._id,
          role: "vendor",
          phone: vendorRes.data?.phone,
        });
        setLocalRole("vendor");
      } catch {}
    };

    detect();
    return () => {
      mounted = false;
    };
  }, [user, role]);

  const isLoggedIn = Boolean(user || localUser);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/logo.png"
            alt="Wedpine Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { name: "Home", href: "/" },
            { name: "Vendors", href: "/vendors" },
            { name: "Blog", href: "/blog" },
            { name: "About", href: "/about" },
            { name: "Contact", href: "/contact" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`relative text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "text-[#311970]"
                  : "text-gray-600 hover:text-[#311970]"
              }`}
            >
              {item.name}
              {pathname === item.href && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#311970] rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href={profileLink}
              className="bg-[#311970] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#26125a] transition"
            >
              Profile
            </Link>
          ) : (
            <Link
              href="/auth"
              className="bg-[#311970] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#26125a] transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t shadow-lg animate-fade-in">
          <div className="flex flex-col gap-4 px-6 py-6 text-sm">
            {[
              { name: "Home", href: "/" },
              { name: "Vendors", href: "/vendors" },
              { name: "Blog", href: "/blog" },
              { name: "About", href: "/about" },
              { name: "Contact", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`font-medium transition ${
                  pathname === item.href
                    ? "text-[#311970]"
                    : "text-gray-600 hover:text-[#311970]"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-4 border-t">
              {isLoggedIn ? (
                <Link
                  href={profileLink}
                  onClick={() => setMenuOpen(false)}
                  className="block text-center bg-[#311970] text-white py-2.5 rounded-lg font-semibold hover:bg-[#26125a] transition"
                >
                  Profile
                </Link>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center bg-[#311970] text-white py-2.5 rounded-lg font-semibold hover:bg-[#26125a] transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
