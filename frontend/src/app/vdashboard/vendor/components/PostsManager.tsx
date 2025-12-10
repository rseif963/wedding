"use client";

import React, { useEffect, useState } from "react";
import { Upload, Trash2, Eye, GripVertical } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function PortfolioGallery() {
  const { posts: ctxPosts, updatePost, fetchVendorPosts, vendorProfile } =
    useAppContext();

  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const [postId, setPostId] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Build same helper from your code
  const getFullUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("https://ik.imagekit.io")) return path;
    if (path.startsWith("http")) return path;
    const base = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${cleanPath.replace(/\\/g, "/")}`;
  };

  // Load vendor posts → extract first post's gallery
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
  }, [ctxPosts]);

  // Upload + auto-save
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!postId) return;
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    const form = new FormData();
    form.append("galleryImages", file);

    setLoading(true);
    try {
      await updatePost(postId, form);
      await fetchVendorPosts();
    } finally {
      setLoading(false);
    }
  };

  // Delete photo
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

  // Reorder
  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(gallery);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setGallery(items);

    // Auto-save reorder
    const form = new FormData();
    form.append("galleryImages", JSON.stringify(items)); // backend must handle ordering

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

      {/* Upload Area */}
      <div className="w-full max-w-4xl mx-auto border-2 border-dashed border-purple-300 rounded-xl p-10 text-center bg-purple-50">
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
            onChange={handleUpload}
            className="hidden"
          />
        </label>

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
                {gallery.map((img, index) => (
                  <Draggable key={img} draggableId={img} index={index}>
                    {(prov) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        className="relative group rounded-xl overflow-hidden shadow-md bg-gray-100"
                      >
                        {/* Image */}
                        <img
                          src={getFullUrl(img)}
                          className="w-full h-40 object-cover"
                        />

                        {/* Top-left Featured Tag (just visual for now) */}
                        {index === 0 && (
                          <span className="absolute top-2 left-2 bg-[#4b1bb4] text-white text-xs px-2 py-1 rounded-md">
                            Featured
                          </span>
                        )}

                        {/* Hover Controls */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex justify-between items-start p-2">
                          {/* Reorder */}
                          <div
                            {...prov.dragHandleProps}
                            className="bg-white rounded-md p-1 shadow cursor-grab"
                          >
                            <GripVertical size={18} />
                          </div>

                          {/* View + Delete */}
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                window.open(getFullUrl(img), "_blank")
                              }
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

                {/* Add More Tile */}
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 transition">
                  <Upload className="text-gray-500" size={24} />
                  <span className="mt-2 text-sm text-gray-600">Add More</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      {/* Portfolio Tips Card */}
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

    </section>
  );
}
