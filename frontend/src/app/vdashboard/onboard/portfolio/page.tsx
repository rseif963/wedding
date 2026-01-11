"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Lightbulb, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

export default function PortfolioPage() {
  const [progress, setProgress] = useState(40);

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [mainPhoto, setMainPhoto] = useState<File | null>(null);
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const [priceFrom, setPriceFrom] = useState("");

  const [uploading, setUploading] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);

  const router = useRouter();
  const { createPost, updatePost, fetchVendorPosts } = useAppContext();

  useEffect(() => {
    requestAnimationFrame(() => setProgress(62.5));
  }, []);

  const formatPrice = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const canContinue =
    !!profilePhoto &&
    !!mainPhoto &&
    portfolioFiles.length >= 4 &&
    !!priceFrom &&
    !uploading;

  /* ---------------- HANDLE POST ONCE ---------------- */
  const handleContinue = async () => {
    if (!canContinue) return;
    setUploading(true);

    try {
      // 1️⃣ Create post if it doesn't exist
      let id = postId;
      if (!id) {
        const fd = new FormData();
        fd.append("title", "Untitled Portfolio");
        fd.append("description", "");
        fd.append("priceFrom", priceFrom.replace(/,/g, "") || "0");
        const created = await createPost(fd);
        if (!created) throw new Error("Failed to create post");
        id = created._id;
        setPostId(id);
      }

      // 2️⃣ Upload Profile Photo
      if (profilePhoto) {
        const fd = new FormData();
        fd.append("profilePhoto", profilePhoto);
        await updatePost(id, fd);
      }

      // 3️⃣ Upload Main Photo
      if (mainPhoto) {
        const fd = new FormData();
        fd.append("mainPhoto", mainPhoto);
        await updatePost(id, fd);
      }

      // 4️⃣ Upload Portfolio / Gallery Photos
      for (const file of portfolioFiles) {
        const fd = new FormData();
        fd.append("galleryImages", file);
        await updatePost(id, fd);
      }

      // 5️⃣ Save priceFrom explicitly
      const fdPrice = new FormData();
      fdPrice.append("priceFrom", priceFrom.replace(/,/g, ""));
      await updatePost(id, fdPrice);

      // Refresh vendor posts
      await fetchVendorPosts();

      // Navigate to next step
      router.push("/vdashboard/onboard/about-brand");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="border-b border-[#EEEAF6]">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <Link
            href="/vdashboard/onboard/packages"
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
            <span className="text-[#6B5FA7]">Step 5 of 8</span>
            <span className="font-medium text-[#3B1D82]">62.5% complete</span>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-center text-[48px] font-semibold text-[#3B1D82]">
          Portfolio Upload
        </h1>

        <p className="mt-3 text-center text-[18px] text-[#6B5FA7]">
          Show couples your best work
        </p>

        <div className="mt-10 flex items-center gap-3 rounded-xl bg-[#F6F4FB] px-6 py-4 text-[15px] text-[#3B1D82]">
          <Lightbulb size={26} />
          <span>
            <strong>Pro tip:</strong> Vendors with photos get 3x more bookings.
          </span>
        </div>

        <div className="mt-10 space-y-8 rounded-2xl bg-white px-10 py-10 shadow-[0_20px_40px_rgba(59,29,130,0.08)]">
          {/* PRICE */}
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#3B1D82]">
              Starting price
            </label>
            <input
              value={`Ksh ${priceFrom}`}
              onChange={(e) =>
                setPriceFrom(formatPrice(e.target.value.replace("Ksh", "")))
              }
              placeholder="Ksh 0"
              className="w-full rounded-xl border border-[#E6E1F2] px-4 py-3 text-[15px]"
            />
          </div>

          <UploadBox
            label="Profile Photo *"
            file={profilePhoto}
            onChange={setProfilePhoto}
          />
          <UploadBox label="Main Photo *" file={mainPhoto} onChange={setMainPhoto} />
          <UploadMultipleBox
            label="Portfolio Photos (minimum 4) *"
            files={portfolioFiles}
            onChange={setPortfolioFiles}
          />
        </div>

        <div className="mt-14 flex justify-end">
          <button
            disabled={!canContinue}
            onClick={handleContinue}
            className={`rounded-2xl px-14 py-4 text-[16px] font-medium text-white
              shadow-[0_10px_25px_rgba(59,29,130,0.35)]
              transition
              ${
                canContinue
                  ? "bg-[#3B1D82] hover:opacity-90"
                  : "bg-[#B8AED8] cursor-not-allowed"
              }`}
          >
            {uploading ? "Saving..." : "Continue"}
          </button>
        </div>
      </main>
    </div>
  );
}

/* ---------- UPLOAD BOX ---------- */
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
    <div>
      <label className="mb-2 block text-[14px] font-medium text-[#3B1D82]">
        {label}
      </label>

      <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#E6E1F2] p-8 hover:bg-[#F6F4FB]">
        {file ? (
          <img
            src={URL.createObjectURL(file)}
            className="h-40 w-full rounded-lg object-cover"
          />
        ) : (
          <>
            <Upload size={28} className="text-[#6B5FA7]" />
            <span className="text-[14px] text-[#6B5FA7]">Click to upload</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
      </label>
    </div>
  );
}

/* ---------- MULTIPLE UPLOAD ---------- */
function UploadMultipleBox({
  label,
  files,
  onChange,
}: {
  label: string;
  files: File[];
  onChange: (files: File[]) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[14px] font-medium text-[#3B1D82]">
        {label}
      </label>

      <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#E6E1F2] p-8 hover:bg-[#F6F4FB]">
        <Upload size={28} className="text-[#6B5FA7]" />
        <span className="text-[14px] text-[#6B5FA7]">
          Click to upload photos
        </span>

        <input
          type="file"
          multiple
          accept="image/*,video/*"
          hidden
          onChange={(e) => {
            const newFiles = Array.from(e.target.files || []);
            onChange([...files, ...newFiles]);
          }}
        />
      </label>

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {files.map((file, i) => (
            <div key={i} className="h-24 overflow-hidden rounded-lg border">
              {file.type.startsWith("image") ? (
                <img
                  src={URL.createObjectURL(file)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  src={URL.createObjectURL(file)}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
