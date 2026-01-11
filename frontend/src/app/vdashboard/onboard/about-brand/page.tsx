"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function AboutBrandPage() {
    const { updateVendorProfile } = useAppContext();
    const router = useRouter();

    const [progress, setProgress] = useState(50);
    const [story, setStory] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setProgress(75));
    }, []);

    const handleContinue = async () => {
        if (!story.trim()) return;

        setSaving(true);
        try {
            const fd = new FormData();
            fd.append("description", story.trim());

            const updated = await updateVendorProfile(fd);

            if (updated) {
                router.push("/vdashboard/onboard/verification");
            }
        } catch (error) {
            console.error("Failed to save description", error);
            alert("Failed to save description. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* HEADER */}
            <header className="border-b border-[#EEEAF6]">
                <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
                    <div className="flex flex-col items-start gap-4">
                        <Link
                            href="/vdashboard/onboard/portfolio"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEEAF6] text-[#3B1D82] hover:bg-[#F6F4FB] transition"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                    </div>
                </div>

                <div className="mx-auto max-w-6xl px-6 pb-6">
                    <div className="h-2 w-full rounded-full bg-[#EEEAF6] overflow-hidden">
                        <div
                            className="h-full rounded-full bg-[#3B1D82] transition-all duration-700"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="mt-3 flex justify-between text-[14px]">
                        <span className="text-[#6B5FA7]">Step 6 of 8</span>
                        <span className="font-medium text-[#3B1D82]">75% complete</span>
                    </div>
                </div>
            </header>

            {/* CONTENT */}
            <main className="mx-auto max-w-3xl px-6 py-16">
                <h1 className="text-center text-[48px] font-semibold text-[#3B1D82]">
                    About Your Brand
                </h1>

                <p className="mt-3 text-center text-[18px] text-[#6B5FA7]">
                    Tell couples your story
                </p>

                <div className="mt-10 rounded-xl bg-[#F6F4FB] px-6 py-4 text-center text-[15px] text-[#3B1D82]">
                    💡 A compelling story helps couples connect with you
                </div>

                <div className="mt-10 rounded-2xl bg-white px-10 py-10 shadow-[0_20px_40px_rgba(59,29,130,0.08)]">
                    <div className="mb-4 flex items-center gap-2 text-[16px] font-medium text-[#3B1D82]">
                        <Sparkles size={18} />
                        Tell couples about you
                    </div>

                    <textarea
                        value={story}
                        maxLength={500}
                        onChange={(e) => setStory(e.target.value)}
                        placeholder="Share your passion for weddings, your unique approach, what makes you special... "
                        className="h-40 w-full resize-none rounded-xl border border-[#E6E1F2] px-4 py-3 text-[15px] focus:outline-none"
                    />

                    <div className="mt-2 text-right text-[14px] text-[#6B5FA7]">
                        {story.length}/500 characters
                    </div>
                </div>

                {/* CONTINUE */}
                <div className="mt-14 flex justify-end">
                    <button
                        onClick={handleContinue}
                        disabled={!story.trim() || saving}
                        className={`rounded-2xl px-14 py-4 text-[16px] font-medium text-white
              shadow-[0_10px_25px_rgba(59,29,130,0.35)]
              transition
              ${story.trim()
                                ? "bg-[#3B1D82] hover:opacity-90"
                                : "bg-[#B8AED8] cursor-not-allowed"
                            }`}
                    >
                        {saving ? "Saving..." : "Continue"}
                    </button>
                </div>
            </main>
        </div>
    );
}
