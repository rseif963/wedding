"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { Menu, X } from "lucide-react";
import { useAppContext } from "@/context/AppContext"; // 👈 import context

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, role, authLoading } = useAppContext(); // 👈 get user + role + loading

  // local fallback state (used only if context user/role are not available)
  const [localUser, setLocalUser] = useState<any | null>(null);
  const [localRole, setLocalRole] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  // Decide profile link based on effective role (context first, then local detection)
  const effectiveRole = role || localRole || null;

  const profileLink =
    effectiveRole === "vendor"
      ? "/vdashboard/vendor"
      : effectiveRole === "client"
      ? "/dashboard/client"
      : "/profile"; // fallback

  // If context has user already, we don't need to detect. Otherwise try to detect from token.
  useEffect(() => {
    if (user) {
      // clear any local detection if context provides the user
      setLocalUser(null);
      setLocalRole(null);
      setChecking(false);
      return;
    }

    // run detection only on client and if token exists
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) return;

    let mounted = true;
    setChecking(true);

    const detect = async () => {
      try {
        // try client profile first
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
      } catch (err) {
        // not a client or failed; try vendor
      }

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
        return;
      } catch (err) {
        // no user detected
      } finally {
        if (mounted) setChecking(false);
      }
    };

    detect();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, role]);

  // While checking token, avoid flicker (preserve your original loading behavior)
  if (authLoading) {
    return (
      <nav className="sticky top-0 z-50 w-full bg-white shadow-md px-6 md:px-10 py-4 flex items-center">
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/logo.png"
              alt="Wedpine Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </Link>
        </div>
      </nav>
    );
  }

  // decide final "isLoggedIn" using context first, then local detection
  const isLoggedIn = Boolean(user || localUser);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md px-6 md:px-10 py-4 flex items-center">
      {/* Left: Logo */}
      <div className="flex-shrink-0">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/logo.png"
            alt="Wedpine Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </Link>
      </div>

      {/* Center: Links (desktop only) */}
      <div className="flex-grow hidden md:flex justify-center">
        <ul className="flex gap-8 text-gray-700 font-medium text-sm">
          <li>
            <Link href="/" className="hover:text-[#311970] transition">
              Home
            </Link>
          </li>
          <li>
            <Link href="/vendors" className="hover:text-[#311970] transition">
              Vendors
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:text-[#311970] transition">
              Blog
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-[#311970] transition">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-[#311970] transition">
              Contact
            </Link>
          </li>
        </ul>
      </div>

      {/* Right: Login/Profile (desktop only) + Hamburger (mobile only) */}
      <div className="ml-auto flex items-center">
        {/* Desktop Button */}
        {isLoggedIn ? (
          <Link
            href={profileLink}
            className="hidden md:inline-block bg-[#311970] text-white px-5 py-2.5 rounded-lg shadow hover:bg-[#26125a] transition font-semibold"
          >
            Profile
          </Link>
        ) : (
          <Link
            href="/auth"
            className="hidden md:inline-block bg-[#311970] text-white px-5 py-2.5 rounded-lg shadow hover:bg-[#26125a] transition font-semibold"
          >
            Login
          </Link>
        )}

        {/* Hamburger (mobile only) */}
        <button
          className="ml-4 md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute text-sm top-full left-0 w-full bg-white shadow-md flex flex-col items-center py-6 gap-3 md:hidden">
          <Link
            href="/"
            className="hover:text-[#311970]"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/vendors"
            className="hover:text-[#311970]"
            onClick={() => setMenuOpen(false)}
          >
            Vendors
          </Link>
          <Link
            href="/blog"
            className="hover:text-[#311970]"
            onClick={() => setMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="hover:text-[#311970]"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="hover:text-[#311970]"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>

          {/* Mobile Login/Profile */}
          {isLoggedIn ? (
            <Link
              href={profileLink}
              className="bg-[#311970] text-white px-5 py-2.5 rounded-lg shadow hover:bg-[#26125a] transition font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
          ) : (
            <Link
              href="/auth"
              className="bg-[#311970] text-white px-5 py-2.5 rounded-lg shadow hover:bg-[#26125a] transition font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
