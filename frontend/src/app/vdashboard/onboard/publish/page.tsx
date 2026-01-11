"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FinalStepPage() {
    const [progress, setProgress] = useState(87.5);
    const [animate, setAnimate] = useState(false);

    const router = useRouter();

    // Trigger celebratory animation
    useEffect(() => {
        requestAnimationFrame(() => setAnimate(true));
    }, []);

    useEffect(() => {
        requestAnimationFrame(() => setProgress(100));
    }, []);

    const handleRedirect = () => {
        router.push("/vdashboard/vendor");
    };

    return (
        <div className="min-h-screen bg-white">
            <header className="border-b border-[#EEEAF6]">
                <div className="mx-auto max-w-6xl px-6 py-5">
                    <Link
                        href="/vdashboard/vendor/onboarding/packages"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEEAF6] text-[#3B1D82] hover:bg-[#F6F4FB]"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                </div>

                <div className="mx-auto max-w-6xl px-6 pb-6">
                    <div className="h-2 w-full rounded-full bg-[#EEEAF6] overflow-hidden">
                        <div
                            className="h-full rounded-full bg-[#3B1D82] transition-all duration-700"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="mt-3 flex justify-between text-[14px]">
                        <span className="text-[#6B5FA7]">Step 8 of 8</span>
                        <span className="font-medium text-[#3B1D82]">100% complete</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="mx-auto max-w-3xl px-6 py-16">


                {/* Title */}
                <h1 className="text-[48px] font-semibold text-[#3B1D82]">
                    You're All Set!
                </h1>

                {/* Subtitle */}
                <p className="text-[18px] text-[#6B5FA7]">
                    Your portfolio and profile are ready for couples to discover. We’re excited for you to start receiving bookings!
                </p>

                {/* Optional Tip Box */}
                <div className="mt-6 flex items-center justify-center gap-3 rounded-xl bg-[#F6F4FB] px-6 py-4 text-[15px] text-[#3B1D82]">
                    <span role="img" aria-label="sparkles">
                        <Sparkles />
                    </span>
                    <span>
                        Remember, you can always update your portfolio anytime from your dashboard.
                    </span>
                </div>

                {/* Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={handleRedirect}
                        className="rounded-2xl px-10 py-4 text-[16px] font-medium text-white bg-[#3B1D82] shadow-[0_10px_25px_rgba(59,29,130,0.35)] transition hover:opacity-90"
                    >
                        Save & Publish
                    </button>
                </div>
            </div>
        </div>
    );
}
