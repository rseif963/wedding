"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function AdminAuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "login") {
        const res = await axios.post("/api/admin/login", { email, password });
        localStorage.setItem("token", res.data.token);
        toast.success("Welcome Admin!");
        router.push("/admin-dashboard/admin");
      } else {
        await axios.post("/api/admin/register", { email, password });
        toast.success("Admin registered successfully, please login.");
        setMode("login");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#311970] to-[#6a1b9a] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {mode === "login" ? "Admin Login" : "Admin Register"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#311970] focus:outline-none"
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
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#311970] focus:outline-none"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-[#311970] text-white py-3 rounded-lg font-semibold shadow hover:bg-[#261457] transition"
          >
            {mode === "login" ? "Login" : "Register"}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
        </div>
      </div>
    </main>
  );
}
