"use client";

import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { ArrowLeft, BadgeCheck, Upload } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function VerificationPage() {
  const router = useRouter();
  const {
    uploadNationalID,
    uploadBusinessCertificate,
  } = useAppContext();

  const [progress, setProgress] = useState(75);

  // National ID front/back
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);

  // Business Registration
  const [businessCert, setBusinessCert] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setProgress(87.5));
  }, []);

  const renderPreview = (file: File | null) => {
    if (!file) return null;
    if (file.type.startsWith("image")) {
      return <img src={URL.createObjectURL(file)} className="h-48 w-full rounded-lg object-cover" />;
    }
    return <span className="text-[15px] font-medium text-[#3B1D82]">{file.name}</span>;
  };

  const canContinue = (idFront && idBack) || businessCert;

  // ✅ Handle continue click
  const handleContinue = async () => {
    if (!canContinue) return;

    setLoading(true);

    try {
      // Upload National ID if both files are provided
      if (idFront && idBack) {
        await uploadNationalID(idFront, idBack);
      }

      // Upload business certificate if provided
      if (businessCert) {
        await uploadBusinessCertificate(businessCert);
      }

      toast.success("Files uploaded successfully!");
      router.push("/vdashboard/onboard/publish"); // navigate after successful upload
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="border-b border-[#EEEAF6]">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link
            href="/vdashboard/vendor/onboarding/account-basics"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEEAF6] text-[#3B1D82] hover:bg-[#F6F4FB] transition"
          >
            <ArrowLeft size={18} />
          </Link>
        </div>

        {/* STEPS / PROGRESS */}
        <div className="mx-auto max-w-6xl px-6 pb-6">
          <div className="h-2 w-full rounded-full bg-[#EEEAF6] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#3B1D82] transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-3 flex justify-between text-[14px]">
            <span className="text-[#6B5FA7]">Step 7 of 8</span>
            <span className="font-medium text-[#3B1D82]">87.5% complete</span>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-center text-[48px] font-semibold text-[#3B1D82]">
          Verification
        </h1>

        <p className="mt-3 text-center text-[18px] text-[#6B5FA7]">
          Build trust with a verified badge
        </p>

        {/* TIP */}
        <div className="mt-10 rounded-xl bg-[#F6F4FB] px-6 py-4 text-center text-[15px] text-[#3B1D82]">
          💡 Verified vendors get 50% more inquiries
        </div>

        {/* VERIFIED BADGE */}
        <div className="mt-12 flex items-center gap-3 rounded-xl border border-[#EEEAF6] bg-white px-6 py-5">
          <BadgeCheck className="text-[#3B1D82]" size={28} />
          <div>
            <div className="font-medium text-[#3B1D82]">Verified on Wedpine</div>
            <div className="text-[14px] text-[#6B5FA7]">This badge will appear on your profile</div>
          </div>
        </div>

        {/* NATIONAL ID FORM */}
        <div className="mt-10 rounded-2xl bg-white px-10 py-10 shadow-[0_20px_40px_rgba(59,29,130,0.08)] space-y-6">
          <div className="text-[16px] font-medium text-[#3B1D82]">National ID</div>
          <p className="text-[15px] text-[#6B5FA7]">Upload front and back of your ID</p>

          <UploadBox label="ID Front" file={idFront} onChange={setIdFront} />
          <UploadBox label="ID Back" file={idBack} onChange={setIdBack} />
        </div>

        {/* BUSINESS CERTIFICATE FORM */}
        <div className="mt-10 rounded-2xl bg-white px-10 py-10 shadow-[0_20px_40px_rgba(59,29,130,0.08)] space-y-6">
          <div className="text-[16px] font-medium text-[#3B1D82]">Business Registration</div>
          <p className="text-[15px] text-[#6B5FA7]">Upload your business certificate</p>

          <UploadBox label="Business Certificate" file={businessCert} onChange={setBusinessCert} />
        </div>

        {/* ACTIONS */}
        <div className="mt-14 flex justify-between items-center">
          {/* SKIP */}
          <Link href="/vdashboard/vendor/onboarding/review-profile">
            <button className="text-[16px] font-medium text-[#6B5FA7] hover:text-[#3B1D82] transition">
              Skip for now
            </button>
          </Link>

          {/* CONTINUE */}
          <button
            onClick={handleContinue}
            disabled={!canContinue || loading}
            className={`rounded-2xl px-14 py-4 text-[16px] font-medium text-white
                shadow-[0_10px_25px_rgba(59,29,130,0.35)]
                transition
                ${canContinue && !loading ? "bg-[#3B1D82] hover:opacity-90" : "bg-[#B8AED8] cursor-not-allowed"}`}
          >
            {loading ? "Uploading..." : "Continue"}
          </button>
        </div>
      </main>
    </div>
  );
}

/* ---------- UPLOAD BOX COMPONENT ---------- */
function UploadBox({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <div className="mt-4">
      <label className="mb-2 block text-[14px] font-medium text-[#3B1D82]">{label}</label>

      <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#E6E1F2] p-10 hover:bg-[#F6F4FB]">
        {file ? (
          <img
            src={URL.createObjectURL(file)}
            className="h-48 w-full rounded-lg object-cover"
            alt={label}
          />
        ) : (
          <>
            <Upload size={28} className="text-[#6B5FA7]" />
            <span className="text-[14px] text-[#6B5FA7]">Click to upload</span>
          </>
        )}
        <input
          type="file"
          accept="image/*,.pdf"
          hidden
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
      </label>
    </div>
  );
}
