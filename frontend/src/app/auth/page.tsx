"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Briefcase, Home, Mail, Lock, Smartphone } from "lucide-react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { data } from "framer-motion/client";

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAppContext();

  const [role, setRole] = useState<"client" | "vendor">("client");
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Special case for Admin login
    if (mode === "login" && email === "info@wedpine.com" && password === "Secret@2025") {
      localStorage.setItem("userRole", "admin");
      router.push("/admin-auth");
      return;
    }

    if (mode === "login") {
      const ok = await login(email, password);
      if (ok) {
        let actualRole: "client" | "vendor" | null = null;

        try {
          await axios.get("/api/clients/me");
          actualRole = "client";
        } catch (err) {}

        if (!actualRole) {
          try {
            await axios.get("/api/vendors/me");
            actualRole = "vendor";
          } catch (err) {}
        }

        if (!actualRole) {
          toast.error("Could not verify account role. Please try again.");
          return;
        }

        if (actualRole !== role) {
          toast.error(
            `This account is registered as a ${actualRole}, not a ${role}.`
          );
          return;
        }

        localStorage.setItem("userRole", actualRole);
        router.push(
          actualRole === "client" ? "/dashboard/client" : "/vdashboard/vendor"
        );
      }
    } else {
      // ✅ Always send role when signing up
      const payload: any = {
        email,
        password,
        role,
        phone,
      };

      if (role === "vendor") {
        payload.businessName = businessName;
      }

      const ok = await register(payload);
      if (ok) {
        localStorage.setItem("userRole", role);
        router.push(
          role === "client"
            ? "/dashboard/client/onboarding"
            : "/vdashboard/vendor"
        );
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#311970] via-[#4527a0] to-[#6a1b9a] px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Panel (hidden on mobile) */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-[#311970] to-[#6a1b9a] text-white p-12">
          <h2 className="text-4xl font-bold mb-6">Welcome to Wedpine</h2>
          <p className="text-lg opacity-90 mb-8 text-center">
            The ultimate platform to connect clients and vendors for the perfect
            wedding experience.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white text-[#311970] font-semibold px-6 py-3 rounded-xl shadow cursor-pointer"
            onClick={toggleMode}
          >
            {mode === "login"
              ? "New here? Sign Up"
              : "Already have an account? Login"}
          </motion.div>
        </div>

        {/* Right Panel */}
        <div className="p-6 sm:p-8 md:p-12">
          {/* Back to Home */}
          <div className="flex justify-end mb-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-[#311970] hover:underline"
            >
              <Home size={16} /> Back to Home
            </Link>
          </div>

          {/* Role Tabs */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
            <button
              onClick={() => setRole("client")}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition w-full sm:w-auto ${
                role === "client"
                  ? "bg-[#311970] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <User size={18} /> Client
            </button>
            <button
              onClick={() => setRole("vendor")}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition w-full sm:w-auto ${
                role === "vendor"
                  ? "bg-[#311970] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Briefcase size={18} /> Vendor
            </button>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {mode === "login"
              ? `${role === "client" ? "Client" : "Vendor"} Login`
              : `${role === "client" ? "Client" : "Vendor"} Signup`}
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Smartphone
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 xxx xxx xxx"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#311970]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#311970]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#311970]"
                />
              </div>
            </div>

            {mode === "signup" && role === "vendor" && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your Wedding Business"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#311970]"
                />
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-[#311970] text-white py-3 rounded-lg font-semibold shadow hover:bg-[#261457] transition"
            >
              {mode === "login" ? "Login" : "Create Account"}
            </motion.button>
          </form>

          {/* Extra Links */}
          {mode === "login" && (
            <div className="flex flex-col sm:flex-row justify-between mt-4 text-sm text-gray-500 gap-2">
              <Link href="#" className="hover:text-[#311970]">
                Forgot Password?
              </Link>
              <Link href="#" className="hover:text-[#311970]">
                Need help?
              </Link>
            </div>
          )}

          {/* Mobile Toggle (hidden on md+) */}
          <div className="mt-6 text-center md:hidden">
            <button
              onClick={toggleMode}
              className="text-sm font-medium text-[#311970] hover:underline"
            >
              {mode === "login"
                ? "New here? Sign up"
                : "Already have an account? Login"}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-300" />
            <span className="mx-3 text-sm text-gray-400">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => toast.error("Google login not implemented yet")}
              className="w-full py-2 border rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Google
            </button>
            <button
              type="button"
              onClick={() => toast.error("Facebook login not implemented yet")}
              className="w-full py-2 border rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                alt="Facebook"
                className="w-5 h-5"
              />
              Facebook
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
