"use client";
import axios from 'axios';
import { useState } from "react";
import Link from "next/link";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Eye, EyeOff } from "lucide-react";


export default function ForgotPasswordPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const { forgotPassword, verifyResetCode, resetPassword, } = useAppContext();
    const [step, setStep] = useState(1);
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);



    const handleSendCode = async () => {
        if (!email) return;

        const ok = await forgotPassword(email);
        if (ok) {
            setStep(2);
        }
    };

    const handleVerifyCode = async () => {
        if (!code) return;

        const ok = await verifyResetCode(email, code);
        if (ok) {
            setStep(3);
        }
    };

    const handleResetPassword = async () => {
        if (!password) return;

        const ok = await resetPassword(email, code, password);
        if (ok) {
            setEmail("");
            setCode("");
            setPassword("");
            router.push("/auth?mode=login");
        }
    };


    return (
        <div className="min-h-screen bg-[#FBFAFF] flex items-center justify-center px-6">
            <div className="w-full max-w-md">

                {/* CARD */}
                <div className="rounded-3xl bg-white p-10 shadow-[0_20px_60px_rgba(59,29,130,0.08)] transition-all">

                    {/* TITLE */}
                    <h1 className="text-3xl font-semibold text-[#3B1D82] text-center">
                        Forgot Password
                    </h1>

                    <p className="mt-2 text-center text-[#6B5FA7]">
                        {step === 1 && "Enter your email to receive a reset code"}
                        {step === 2 && "Check your email and enter the verification code"}
                        {step === 3 && "Create a new secure password"}
                    </p>

                    {/* ================= STEP 1 ================= */}
                    {step === 1 && (
                        <div className="mt-8 space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#3B1D82]">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-xl border border-[#E6E1F2] px-4 py-3 outline-none focus:border-[#3B1D82]"
                                />
                            </div>

                            <button
                                disabled={!email}
                                onClick={handleSendCode}
                                className={`w-full rounded-full py-3 font-medium text-white transition
                  ${email
                                        ? "bg-[#3B1D82] hover:opacity-90"
                                        : "bg-[#CFC7EA] cursor-not-allowed"
                                    }`}
                            >
                                Send Code
                            </button>
                        </div>
                    )}

                    {/* ================= STEP 2 ================= */}
                    {step === 2 && (
                        <div className="mt-8 space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#3B1D82]">
                                    Verification Code
                                </label>

                                <input
                                    placeholder="Enter code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full rounded-xl border border-[#E6E1F2] px-4 py-3 outline-none focus:border-[#3B1D82]"
                                />
                            </div>

                            <button
                                disabled={!code}
                                onClick={handleVerifyCode}
                                className={`w-full rounded-full py-3 font-medium text-white transition
                                  ${code
                                        ? "bg-[#3B1D82] hover:opacity-90"
                                        : "bg-[#CFC7EA] cursor-not-allowed"
                                    }`}
                            >
                                Verify Code
                            </button>

                            <button
                                onClick={() => setStep(1)}
                                className="w-full text-sm text-[#6B5FA7] hover:text-[#3B1D82]"
                            >
                                ← Change email
                            </button>
                        </div>
                    )}

                    {/* ================= STEP 3 ================= */}
                    {step === 3 && (
                        <div className="mt-8 space-y-6">

                            {/* NEW PASSWORD */}
                            <div className="relative">
                                <label className="mb-2 block text-sm font-medium text-[#3B1D82]">
                                    New Password
                                </label>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl border border-[#E6E1F2] px-4 py-3 pr-10 outline-none focus:border-[#3B1D82]"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-10 text-gray-400 hover:text-[#3B1D82]"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div className="relative">
                                <label className="mb-2 block text-sm font-medium text-[#3B1D82]">
                                    Confirm Password
                                </label>

                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-xl border border-[#E6E1F2] px-4 py-3 pr-10 outline-none focus:border-[#3B1D82]"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-10 text-gray-400 hover:text-[#3B1D82]"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* ERROR MESSAGE */}
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-sm text-red-500">
                                    Passwords do not match
                                </p>
                            )}

                            <button
                                disabled={!password || password !== confirmPassword}
                                onClick={handleResetPassword}
                                className={`w-full rounded-full py-3 font-medium text-white transition
                                   ${password && password === confirmPassword
                                        ? "bg-[#3B1D82] hover:opacity-90"
                                        : "bg-[#CFC7EA] cursor-not-allowed"
                                    }`}
                            >
                                Reset Password
                            </button>
                        </div>
                    )}

                    {/* BACK TO LOGIN */}
                    <Link href="/login">
                        <p className="mt-3 text-center text-sm text-[#6B5FA7] hover:text-[#3B1D82]">
                            ← Back to login
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
}