"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Upload, Pencil, X, Trash2 } from "lucide-react";
import Cropper from "react-easy-crop";
import { useAppContext } from "@/context/AppContext";

type Post = {
  _id: string;
  title?: string;
  description?: string;
  priceFrom?: number;
  mainPhoto?: string;
  galleryImages?: string[];
  galleryVideos?: string[];
  featured?: boolean;
  createdAt?: string;
};

export default function PostsManager({ preview = false }: { preview?: boolean }) {
  const { posts: ctxPosts, createPost, updatePost, fetchVendorPosts, } = useAppContext();

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  // --- State ---
  const [price, setPrice] = useState("");
  const [mainPhotoFile, setMainPhotoFile] = useState<File | null>(null);
  const [mainPhotoPreview, setMainPhotoPreview] = useState<string | null>(null);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryFilePreviews, setGalleryFilePreviews] = useState<string[]>([]);
  const [galleryVideoFiles, setGalleryVideoFiles] = useState<File[]>([]);
  const [galleryVideoPreviews, setGalleryVideoPreviews] = useState<string[]>([]);

  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);
  const [existingGalleryVideos, setExistingGalleryVideos] = useState<string[]>([]);
  const [existingMainPhotoUrl, setExistingMainPhotoUrl] = useState<string | null>(null);

  const [removedExistingGalleryImages, setRemovedExistingGalleryImages] = useState<string[]>([]);
  const [removedExistingGalleryVideos, setRemovedExistingGalleryVideos] = useState<string[]>([]);
  const [removeExistingMainPhoto, setRemoveExistingMainPhoto] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [saveTarget, setSaveTarget] = useState<"main" | "photo" | null>(null);

  // croppingSrc holds the object URL used by the Cropper UI and is revoked automatically
  const [croppingSrc, setCroppingSrc] = useState<string | null>(null);

  const MAX_PHOTOS = 6;
  const MAX_VIDEOS = 6;

  // --- Sync posts ---
  useEffect(() => {
    setPosts(ctxPosts || []);
  }, [ctxPosts]);

  // --- Fetch posts on mount ---
  useEffect(() => {
    (async () => {
      try {
        await fetchVendorPosts();
      } catch {
        /* ignore */
      }
    })();
  }, [fetchVendorPosts]);

  // --- manage croppingSrc object URL lifecycle ---
  useEffect(() => {
    if (!croppingFile) {
      setCroppingSrc(null);
      return;
    }
    const url = URL.createObjectURL(croppingFile);
    setCroppingSrc(url);
    return () => {
      URL.revokeObjectURL(url);
      setCroppingSrc(null);
    };
  }, [croppingFile]);

  // --- Cropper helpers ---
  const onCropComplete = useCallback((_: any, croppedArea: any) => {
    setCroppedAreaPixels(croppedArea);
  }, []);

  /**
   * Fixed getCroppedImage:
   * - Uses the file's object URL to create an HTMLImageElement
   * - Uses devicePixelRatio for crisp output
   * - Scales and crops using croppedAreaPixels (assumed to be pixel values from react-easy-crop)
   * - Returns a File built from the resulting Blob so it can be uploaded directly
   */
  async function getCroppedImage(file: File, croppedAreaPixels: any) {
    // create temporary object URL and load the image
    const objectUrl = URL.createObjectURL(file);
    const image = await createImage(objectUrl);
    // revoke URL quickly to avoid leaks
    URL.revokeObjectURL(objectUrl);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Use integer values
    const cropX = Math.round(croppedAreaPixels.x);
    const cropY = Math.round(croppedAreaPixels.y);
    const cropWidth = Math.round(croppedAreaPixels.width);
    const cropHeight = Math.round(croppedAreaPixels.height);

    // device pixel ratio to improve sharpness on high-DPI screens
    const dpr = window.devicePixelRatio || 1;

    canvas.width = cropWidth * dpr;
    canvas.height = cropHeight * dpr;
    // set CSS size (not strictly necessary, but keeps canvas consistent)
    canvas.style.width = `${cropWidth}px`;
    canvas.style.height = `${cropHeight}px`;

    // scale context so drawn image maps to CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingQuality = "high";

    // draw the cropped area from the source image onto the canvas
    // Note: croppedAreaPixels returned by react-easy-crop are relative to the image's natural size,
    // so drawing directly using those coordinates is correct.
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    // convert to blob & file
    return new Promise<File | null>((resolve) => {
      // Use file.type if available, otherwise default to jpeg
      const outType = file.type || "image/jpeg";
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // preserve original filename
            const newFile = new File([blob], file.name, { type: outType });
            resolve(newFile);
          } else {
            resolve(null);
          }
        },
        outType,
        0.95
      );
    });
  }

  // --- Handle File Input ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "main" | "photo" | "video") => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (type === "video") {
      if (galleryVideoFiles.length >= MAX_VIDEOS) return alert(`Maximum ${MAX_VIDEOS} videos allowed`);
      setGalleryVideoFiles((p) => [...p, file]);
      setGalleryVideoPreviews((p) => [...p, URL.createObjectURL(file)]);
      return;
    }

    setCroppingFile(file);
    setSaveTarget(type);
  };

  const confirmCrop = async () => {
    if (!croppingFile || !croppedAreaPixels) return;
    const croppedFile = await getCroppedImage(croppingFile, croppedAreaPixels);
    if (!croppedFile) return;

    const url = URL.createObjectURL(croppedFile);

    if (saveTarget === "main") {
      setMainPhotoFile(croppedFile);
      setMainPhotoPreview(url);
      if (existingMainPhotoUrl) {
        setRemoveExistingMainPhoto(true);
        setExistingMainPhotoUrl(null);
      }
    } else {
      if (galleryFiles.length >= MAX_PHOTOS) alert(`Maximum ${MAX_PHOTOS} photos allowed`);
      else {
        setGalleryFiles((p) => [...p, croppedFile]);
        setGalleryFilePreviews((p) => [...p, url]);
      }
    }

    setCroppingFile(null);
    setSaveTarget(null);
  };

  const cancelCrop = () => {
    setCroppingFile(null);
    setSaveTarget(null);
  };

  // --- Helpers to remove files ---
  const removeNewGalleryFile = (i: number) => {
    setGalleryFiles((p) => p.filter((_, x) => x !== i));
    setGalleryFilePreviews((p) => p.filter((_, x) => x !== i));
  };

  const removeNewVideoFile = (i: number) => {
    setGalleryVideoFiles((p) => p.filter((_, x) => x !== i));
    setGalleryVideoPreviews((p) => p.filter((_, x) => x !== i));
  };

  const removeExistingGalleryImage = (url: string) => {
    setExistingGalleryImages((p) => p.filter((u) => u !== url));
    setRemovedExistingGalleryImages((p) => [...p, url]);
  };

  const removeExistingGalleryVideo = (url: string) => {
    setExistingGalleryVideos((p) => p.filter((u) => u !== url));
    setRemovedExistingGalleryVideos((p) => [...p, url]);
  };

  const removeExistingMain = () => {
    if (existingMainPhotoUrl) {
      setExistingMainPhotoUrl(null);
      setRemoveExistingMainPhoto(true);
    }
    if (mainPhotoPreview) URL.revokeObjectURL(mainPhotoPreview);
    setMainPhotoFile(null);
    setMainPhotoPreview(null);
  };

  // --- Edit / Cancel ---
  const beginEdit = (post: Post) => {
    setEditingPostId(post._id);
    setPrice((post.priceFrom || 0).toLocaleString()); // format price with commas
    setMainPhotoFile(null);
    setMainPhotoPreview(null);
    setGalleryFiles([]);
    setGalleryFilePreviews([]);
    setGalleryVideoFiles([]);
    setGalleryVideoPreviews([]);
    setRemovedExistingGalleryImages([]);
    setRemovedExistingGalleryVideos([]);
    setRemoveExistingMainPhoto(false);
    setExistingGalleryImages(post.galleryImages || []);
    setExistingGalleryVideos(post.galleryVideos || []);
    setExistingMainPhotoUrl(post.mainPhoto || null);
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setPrice("");
    setMainPhotoFile(null);
    setMainPhotoPreview(null);
    setGalleryFiles([]);
    setGalleryFilePreviews([]);
    setGalleryVideoFiles([]);
    setGalleryVideoPreviews([]);
    setExistingGalleryImages([]);
    setExistingGalleryVideos([]);
    setExistingMainPhotoUrl(null);
    setRemovedExistingGalleryImages([]);
    setRemovedExistingGalleryVideos([]);
    setRemoveExistingMainPhoto(false);
  };

  // --- Handle Price Input with commas ---
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(raw)) return;
    const formatted = Number(raw).toLocaleString();
    setPrice(formatted === "0" ? "" : formatted);
  };

  // --- Submit form (create or update) ---
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    const form = new FormData();
    if (price) form.append("priceFrom", price.replace(/,/g, ""));

    if (mainPhotoFile) form.append("mainPhoto", mainPhotoFile);
    else if (editingPostId && removeExistingMainPhoto) form.append("removeMainPhoto", "true");

    galleryFiles.forEach((f) => form.append("galleryImages", f));
    galleryVideoFiles.forEach((f) => form.append("galleryVideos", f));

    if (editingPostId) {
      if (removedExistingGalleryImages.length)
        form.append("removeGalleryImages", JSON.stringify(removedExistingGalleryImages));
      if (removedExistingGalleryVideos.length)
        form.append("removeGalleryVideos", JSON.stringify(removedExistingGalleryVideos));
    }

    try {
      let result = null;
      if (editingPostId) result = await updatePost(editingPostId, form);
      else result = await createPost(form);

      if (result) {
        await fetchVendorPosts();
        cancelEdit();
        alert(editingPostId ? "Post updated successfully!" : "Post created successfully!");
      } else alert("Failed to save post");
    } catch (err) {
      console.error(err);
      alert("Error saving post");
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Post ---
 

  // --- Utility ---
  const getFullUrl = (path?: string) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API_URL}${path}`;
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow relative">
      {/* === CROPPER MODAL (ADDED) === */}
      {croppingFile && croppingSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg w-[92%] max-w-2xl h-[80vh] p-4 flex flex-col">
            <div className="relative flex-1 bg-gray-800">
              <Cropper
                image={croppingSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="mt-4 flex items-center gap-3 justify-end">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 mr-2">Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
              </div>

              <button
                type="button"
                onClick={cancelCrop}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmCrop}
                className="px-4 py-2 bg-[#311970] text-white rounded-md hover:bg-[#241255]"
              >
                Crop & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === FORM === */}
      {(posts.length === 0 || editingPostId) && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 pb-20 border-b border-gray-200"
        >
          {/* Price */}
          <div>
            <label className="block font-medium mb-1">Price From</label>
            <input
              type="text"
              value={price}
              onChange={handlePriceChange}
              className="w-full border rounded-lg p-2"
              placeholder="e.g. 20,000"
            />
          </div>

          {/* Main Photo */}
          <div>
            <h4 className="font-semibold mb-2">Main Photo</h4>
            {mainPhotoPreview || existingMainPhotoUrl ? (
              <div className="relative inline-block">
                <img
                  src={mainPhotoPreview || getFullUrl(existingMainPhotoUrl!)}
                  alt="main"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeExistingMain}
                  className="absolute top-1 right-1 bg-white rounded-full shadow p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              renderUploadBox(handleFileChange, "main")
            )}
          </div>

          {/* Gallery Photos */}
          <div>
            <h4 className="font-semibold mb-2">Gallery Photos</h4>
            <div className="flex gap-3 flex-wrap">
              {existingGalleryImages.map((u, i) => (
                <div key={i} className="relative">
                  <img src={getFullUrl(u)} className="w-32 h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeExistingGalleryImage(u)}
                    className="absolute top-1 right-1 bg-white rounded-full shadow p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {galleryFilePreviews.map((u, i) => (
                <div key={i} className="relative">
                  <img src={u} className="w-32 h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeNewGalleryFile(i)}
                    className="absolute top-1 right-1 bg-white rounded-full shadow p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {renderUploadBox(handleFileChange, "photo")}
            </div>
          </div>

          {/* Gallery Videos */}
          <div>
            <h4 className="font-semibold mb-2">Gallery Videos</h4>
            <div className="flex gap-3 flex-wrap">
              {existingGalleryVideos.map((u, i) => (
                <div key={i} className="relative">
                  <video src={getFullUrl(u)} controls className="w-32 h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeExistingGalleryVideo(u)}
                    className="absolute top-1 right-1 bg-white rounded-full shadow p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {galleryVideoPreviews.map((u, i) => (
                <div key={i} className="relative">
                  <video src={u} controls className="w-32 h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeNewVideoFile(i)}
                    className="absolute top-1 right-1 bg-white rounded-full shadow p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {renderUploadBox(handleFileChange, "video")}
            </div>
          </div>

          {/* Save / Cancel */}
          <div className="sticky bottom-0 bg-white py-4 border-t flex justify-start gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#311970] text-white px-6 py-2 rounded-lg shadow hover:bg-[#241255] disabled:opacity-50"
            >
              {loading ? "Saving..." : editingPostId ? "Update Post" : "Create Post"}
            </button>
            {editingPostId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2 border rounded-lg shadow"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* === POSTS LIST === */}
      <div className="mt-10">
        <h3 className="text-lg font-bold mb-4">My Posts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.length === 0 && <p className="text-gray-500">No posts yet.</p>}
          {posts.map((post) => (
            <div key={post._id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
              {post.mainPhoto && (
                <img
                  src={getFullUrl(post.mainPhoto)}
                  className="w-full h-40 object-cover rounded-md"
                />
              )}
              <p className="font-semibold mt-2">
                Starting from Ksh {Number(post.priceFrom || 0).toLocaleString()}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {(post.galleryImages || []).map((img, i) => (
                  <img key={i} src={getFullUrl(img)} className="w-20 h-20 object-cover rounded-md" />
                ))}
                {(post.galleryVideos || []).map((v, i) => (
                  <video key={i} src={getFullUrl(v)} controls className="w-20 h-20 object-cover rounded-md" />
                ))}
              </div>

              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={() => beginEdit(post)}
                  className="flex items-center gap-2 text-[#311970] font-medium hover:underline"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  className="flex items-center gap-2 text-red-600 font-medium hover:underline"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Upload UI helper ---
function renderUploadBox(
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, t: "main" | "photo" | "video") => void,
  type: "main" | "photo" | "video"
) {
  return (
    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-[#311970] transition">
      <div className="flex flex-col items-center text-gray-500">
        <Upload size={24} />
        <span className="text-sm mt-1">Upload</span>
      </div>
      <input
        type="file"
        accept={type === "video" ? "video/*" : "image/*"}
        onChange={(e) => handleFileChange(e, type)}
        className="hidden"
      />
    </label>
  );
}

// --- Utility to create image for cropper ---
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}
