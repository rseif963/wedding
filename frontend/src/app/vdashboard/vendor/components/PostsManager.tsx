"use client";

import React, { useEffect, useState } from "react";
import { Upload, Trash2, Eye, GripVertical } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function PortfolioGallery() {
  const {
    posts: ctxPosts,
    createPost,
    updatePost,
    fetchVendorPosts,
    vendorProfile
  } = useAppContext();


  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const [postId, setPostId] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [priceFrom, setPriceFrom] = useState<string>("");
  const [editingPrice, setEditingPrice] = useState(false);

  const formatPrice = (value: string | number) => {
    const num = Number(value);
    if (Number.isNaN(num)) return "";
    return num.toLocaleString("en-US");
  };


  const getFullUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("https://ik.imagekit.io")) return path;
    if (path.startsWith("http")) return path;
    const base = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${cleanPath.replace(/\\/g, "/")}`;
  };

  useEffect(() => {
    if (!vendorProfile?._id) return;
    (async () => {
      await fetchVendorPosts();
    })();
  }, [vendorProfile]);

  useEffect(() => {
    if (!ctxPosts || ctxPosts.length === 0) return;

    const p = ctxPosts[0];
    setPostId(p._id);
    setGallery(p.galleryImages || []);
    setPriceFrom(p.priceFrom?.toString() ?? "");
  }, [ctxPosts]);


  // PREVIEW – not uploading yet
  // Store file previews before upload
  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    // Reset so selecting same file twice works
    e.target.value = "";

    // Add to preview list
    setPreviewFiles((prev) => [...prev, file]);
  };


  const ensurePostExists = async () => {
    if (postId) return postId;

    const form = new FormData();
    form.append("title", "Untitled Portfolio");
    form.append("description", "");
    form.append("priceFrom", "0");

    // first post creation
    const created = await createPost(form);

    if (!created) return null;

    setPostId(created._id);
    return created._id;
  };

  const handlePriceFromSave = async () => {
    if (!postId) return;

    const form = new FormData();
    form.append("priceFrom", priceFrom || "0");

    setLoading(true);
    try {
      await updatePost(postId, form);
      await fetchVendorPosts();
      setEditingPrice(false); // ✅ switch to display mode
    } finally {
      setLoading(false);
    }
  };




  const uploadPreviewFile = async (file: File) => {
    setUploadingFiles((prev) => [...prev, file]); // mark as uploading

    // 1️⃣ Ensure post exists before uploading images
    const id = await ensurePostExists();
    if (!id) {
      setUploadingFiles((prev) => prev.filter((f) => f !== file));
      return;
    }

    const form = new FormData();
    form.append("galleryImages", file);

    try {
      const updated = await updatePost(id, form);
      if (updated) await fetchVendorPosts();
    } finally {
      setPreviewFiles((prev) => prev.filter((f) => f !== file)); // remove preview
      setUploadingFiles((prev) => prev.filter((f) => f !== file)); // mark done
    }
  };



  // DELETE EXISTING IMAGE
  const deletePhoto = async (img: string) => {
    if (!postId) return;

    const updated = gallery.filter((x) => x !== img);
    setGallery(updated);

    const form = new FormData();
    form.append("removeGalleryImages", JSON.stringify([img]));

    setLoading(true);
    try {
      await updatePost(postId, form);
      await fetchVendorPosts();
    } finally {
      setLoading(false);
    }
  };

  const resolveImage = (img: string | File) => {
    if (img instanceof File) return URL.createObjectURL(img);
    return getFullUrl(img);
  };


  // REORDER
  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(gallery);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setGallery(items);

    const form = new FormData();
    form.append("galleryImages", JSON.stringify(items));

    setLoading(true);
    try {
      await updatePost(postId!, form);
      await fetchVendorPosts();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-white min-h-screen p-6">
      {/* Header */}
      <div className="text-start mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Gallery</h1>
        <p className="text-gray-500 mt-2">
          Showcase your best work by uploading high-quality images.
        </p>
      </div>

      {/* Price From */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Starting Price
        </label>

        {!editingPrice ? (
          <div className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-3">
            <span className="text-gray-900 font-medium">
              {priceFrom ? `KES ${formatPrice(priceFrom)}` : "Not set"}
            </span>

            <button
              onClick={() => setEditingPrice(true)}
              className="text-[#4b1bb4] font-medium hover:underline"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <input
              type="text"
              inputMode="numeric"
              value={formatPrice(priceFrom)}
              onChange={(e) =>
                setPriceFrom(e.target.value.replace(/,/g, ""))
              }
              placeholder="e.g. 50,000"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b1bb4]"
            />

            <button
              onClick={handlePriceFromSave}
              disabled={loading}
              className="bg-[#4b1bb4] text-white px-6 rounded-xl font-medium hover:bg-[#3a1591] transition"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>


      {/* Upload Area */}
      {/* Upload Area */}
      <div className="w-full max-w-4xl mx-auto border-2 border-dashed border-purple-300 rounded-xl p-4 text-center bg-purple-50 relative min-h-[200px]">
        {previewFiles.length > 0 ? (
          <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2 overflow-auto">
            {previewFiles.map((file, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden shadow-md bg-gray-200 flex flex-col"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-full object-cover"
                />

                {/* Upload button */}
                <button
                  onClick={() => uploadPreviewFile(file)}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#4b1bb4] text-white py-1 px-3 text-sm font-semibold rounded"
                  disabled={uploadingFiles.includes(file)}
                >
                  {uploadingFiles.includes(file) ? "Uploading..." : "Upload"}
                </button>

                {/* Remove button */}
                <button
                  onClick={() => setPreviewFiles(prev => prev.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          // Default upload UI
          <div className="flex flex-col items-center justify-center h-full">
            <Upload className="w-10 h-10 text-purple-500 mx-auto" />
            <p className="mt-4 text-purple-700 font-medium">
              Drag & drop or upload photos
            </p>
            <label className="inline-flex mt-4 items-center gap-2 bg-[#4b1bb4] text-white px-5 py-2.5 rounded-xl cursor-pointer hover:bg-[#3a1591] transition">
              <Upload className="w-4 h-4" />
              Upload Photos
              <input
                type="file"
                accept="image/*"
                onChange={handleSelectFile}
                className="hidden"
              />
            </label>
          </div>
        )}

        {loading && <p className="mt-4 text-purple-600">Saving...</p>}
      </div>


      {/* Gallery Grid */}
      <div className="w-full max-w-5xl mx-auto mt-10">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="gallery" direction="horizontal">
            {(provided) => (
              <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {/* Existing uploaded images */}
                {/* Existing uploaded images */}
                {gallery.map((img, index) => (
                  <Draggable key={img} draggableId={img} index={index}>
                    {(prov) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        className="relative group rounded-xl overflow-hidden shadow-md bg-gray-100"
                        onClick={(e) => {
                          // Only open modal if not clicking the drag handle
                          if (!(e.target as HTMLElement).closest("[data-drag-handle]")) {
                            setSelectedImage(img);
                          }
                        }}
                      >
                        <img
                          src={getFullUrl(img)}
                          className="w-full h-40 object-cover cursor-pointer"
                        />

                        {index === 0 && (
                          <span className="absolute top-2 left-2 bg-[#4b1bb4] text-white text-xs px-2 py-1 rounded-md">
                            Featured
                          </span>
                        )}

                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex justify-between items-start p-2">
                          <div
                            {...prov.dragHandleProps}
                            data-drag-handle
                            className="bg-white rounded-md p-1 shadow cursor-grab"
                          >
                            <GripVertical size={18} />
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedImage(img)}
                              className="bg-white rounded-md p-1 shadow"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => deletePhoto(img)}
                              className="bg-red-500 text-white rounded-md p-1 shadow"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                    )}
                  </Draggable>
                ))}

                {/* Preview tiles BEFORE upload */}
                {previewFiles.map((file, i) => (
                  <div
                    key={i}
                    className="relative rounded-xl overflow-hidden shadow-md bg-gray-200 flex flex-col"
                  >
                    <img
                      src={resolveImage(file)}
                      className="w-full h-40 object-cover opacity-90 cursor-pointer"
                      onClick={() => setSelectedImage(file)} // Open modal on click
                    />

                    <button
                      onClick={() => uploadPreviewFile(file)}
                      className="mt-auto bg-[#4b1bb4] text-white py-2 text-sm font-semibold"
                      disabled={uploadingFiles.includes(file)}
                    >
                      {uploadingFiles.includes(file) ? "Uploading..." : "Upload"}
                    </button>

                  </div>
                ))}

                {/* Add More Tile */}
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 transition">
                  <Upload className="text-gray-500" size={24} />
                  <span className="mt-2 text-sm text-gray-600">Add More</span>
                  <input type="file" accept="image/*" onChange={handleSelectFile} className="hidden" />
                </label>

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Portfolio Tips */}
      <div
        className="stat-card bg-accent/60 animate-fade-up shadow-sm p-4 rounded-2xl ml-4 mt-10"
        style={{ animationDelay: "300ms" }}
      >
        <h3 className="font-semibold text-foreground mb-3">💡 Portfolio Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground text-gray-500">
          <li>• Add at least 15-20 high-quality photos for best results</li>
          <li>• Include variety: portraits, ceremony, reception, details</li>
          <li>• Your first 3 photos are featured prominently on your profile</li>
          <li>• Update regularly with your latest and best work</li>
        </ul>
      </div>
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white text-3xl font-bold"
          >
            ✕
          </button>

          {/* Image */}
          <img
            src={resolveImage(selectedImage)}
            className="max-h-[90vh] max-w-[95vw] object-contain rounded-xl shadow-xl"
          />

          {/* Mobile delete button */}
          {typeof selectedImage === "string" && (
            <button
              onClick={() => {
                deletePhoto(selectedImage);
                setSelectedImage(null);
              }}
              className="absolute bottom-6 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg text-sm font-semibold md:hidden"
            >
              Delete Photo
            </button>
          )}
        </div>
      )}

    </section>
  );
}
