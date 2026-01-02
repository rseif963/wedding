"use client";
import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Briefcase, Home, Mail, Lock, Smartphone, Eye, EyeOff, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { data } from "framer-motion/client";



export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAppContext();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<"client" | "vendor">("client");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");

  // NEW: disables form while working (login/register + prefetch)
  const [submitting, setSubmitting] = useState(false);

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
  };


  useEffect(() => {
    const paramMode = searchParams.get("mode"); // "signup" or "login"
    const paramRole = searchParams.get("role"); // "vendor" or "client"

    if (paramMode === "signup" || paramMode === "login") {
      setMode(paramMode);
    }

    if (paramRole === "vendor" || paramRole === "client") {
      setRole(paramRole);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Special case for Admin login
    if (mode === "login" && email === "info@wedpine.com" && password === "Secret@2025") {
      localStorage.setItem("userRole", "admin");
      router.push("/admin-auth");
      return;
    }

    setSubmitting(true);

    try {
      if (mode === "login") {
        const ok = await login(email, password);
        if (ok) {
          // verify actual role via API (keeps existing behavior)
          let actualRole: "client" | "vendor" | null = null;

          try {
            await axios.get("/api/clients/me");
            actualRole = "client";
          } catch (err) { }

          if (!actualRole) {
            try {
              await axios.get("/api/vendors/me");
              actualRole = "vendor";
            } catch (err) { }
          }

          if (!actualRole) {
            toast.error("Could not verify account role. Please try again.");
            return;
          }

          if (actualRole !== role) {
            toast.error(`This account is registered as a ${actualRole}, not a ${role}.`);
            return;
          }

          localStorage.setItem("userRole", actualRole);
          router.push(actualRole === "client" ? "/dashboard/client" : "/vdashboard/vendor");
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
          if (role === "vendor") {
            router.push("/vdashboard/vendor"); // 🚀 redirect vendors immediately
          } else {
            router.push("/dashboard/client/onboarding");
          }
        }
      }
    } catch (err: any) {
      // keep behavior: show toast (AppContext already toasts, but keep guard)
      toast.error(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#311970] via-[#4527a0] to-[#6a1b9a]">
        <div className="absolute inset-0">
          <Image
            src="/assets/hero-wedding.jpg" // ← USE YOUR EXACT IMAGE PATH
            alt="Wedding background"
            fill
            priority
            className="object-cover"
          />

        </div>

        <div className="relative z-10 w-full overflow-hidden grid grid-cols-1 md:grid-cols-2">

          {/* Left Panel (hidden on mobile) */}
          <div
            className={`hidden md:flex flex-col items-start bg-black/10 text-white p-12
        ${mode === "login" ? "md:order-2" : "md:order-1"}
      `}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-4xl font-bold mb-3"
            >
              {mode === "login"
                ? "Welcome back"
                : "Welcome to Wedpine"}
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-lg opacity-90 mb-8 text-start"
            >
              {mode === "login"
                ? "We’re so happy to see you again. Let’s pick up where we left off."
                : "The ultimate platform to connect clients and vendors for the perfect wedding experience."}
            </motion.div>
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
          <div
            className={`p-6 sm:p-8 md:p-12 bg-white h-[100vh] overflow-y-auto
             ${mode === "login" ? "md:order-1" : "md:order-2"}
            `}

          >
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
                disabled={submitting}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition w-full sm:w-auto ${role === "client"
                  ? "bg-[#311970] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                <Heart size={18} /> Weds
              </button>
              <button
                onClick={() => setRole("vendor")}
                disabled={submitting}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition w-full sm:w-auto ${role === "vendor"
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
                ? `${role === "client" ? "Weds" : "Vendor"} Login`
                : `${role === "client" ? "Weds" : "Vendor"} Signup`}
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
                      type="number"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 xxx xxx xxx"
                      disabled={submitting}
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
                    disabled={submitting}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#311970]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={submitting}
                    className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#311970]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-[#311970] transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
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
                    disabled={submitting}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#311970]"
                  />
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="w-full bg-[#311970] text-white py-3 rounded-lg font-semibold shadow hover:bg-[#261457] transition disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span>
                      {mode === "login"
                        ? "Logging in..."
                        : "Creating account..."}
                    </span>
                  </>
                ) : (
                  <>{mode === "login" ? "Login" : "Create Account"}</>
                )}
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
                disabled={submitting}
                className="text-sm font-medium text-[#311970] hover:underline"
              >
                {mode === "login"
                  ? "New here? Sign up"
                  : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  );
}
