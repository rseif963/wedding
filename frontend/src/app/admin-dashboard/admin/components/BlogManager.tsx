"use client";

import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

interface BlogPost {
  _id?: string;
  title?: string;
  description?: string;
  mainPhoto?: string;
  createdAt?: string;
}

export default function BlogManager() {
  const { blogs, fetchBlogs, createBlog, updateBlog, deleteBlog } = useAppContext();

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const objectUrlRef = useRef<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const getFullUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  };

  // Load posts on mount
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current && objectUrlRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage(null);
    if (objectUrlRef.current && objectUrlRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setImagePreview(null);
    setEditingPost(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (objectUrlRef.current && objectUrlRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleOpenNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (p: BlogPost) => {
    setEditingPost(p);
    setTitle(p.title ?? "");
    setDescription(p.description ?? "");
    setImage(null);
    setImagePreview(p.mainPhoto ? getFullUrl(p.mainPhoto) : null);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and content are required");
      return;
    }

    const form = new FormData();
    form.append("title", title.trim());
    form.append("description", description.trim());
    if (image) form.append("mainPhoto", image);

    try {
      if (editingPost && editingPost._id) {
        await updateBlog(editingPost._id, form);
        toast.success("Post updated");
      } else {
        await createBlog(form);
        toast.success("Post created");
      }

      resetForm();
      setShowForm(false);
      await fetchBlogs();
    } catch (err) {
      console.error("Failed to save post:", err);
      toast.error("Failed to save post");
    }
  };

  const handleDelete = async (postId?: string) => {
    if (!postId) return;
    if (!confirm("Delete this post? This action cannot be undone.")) return;

    try {
      await deleteBlog(postId);
      toast.success("Post deleted");
      await fetchBlogs();
      if (selectedPost?._id === postId) setSelectedPost(null);
    } catch (err) {
      console.error("Failed to delete post:", err);
      toast.error("Failed to delete post");
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        
        <h3 className="text-lg font-semibold">Blog Manager</h3>
        <button onClick={handleOpenNew} className="bg-[#7c4dff] text-white px-4 py-2 rounded">
          New Post
        </button>
      </div>

      {/* New/Edit Post Form */}
      {showForm && (
        <div className="border p-4 rounded mb-6">
          <h4 className="font-medium mb-2">{editingPost ? "Edit Post" : "New Post"}</h4>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded p-2 mb-3"
          />

          <textarea
            placeholder="Write your post..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2 mb-3"
            rows={6}
          />

          <label className="block mb-2 text-sm text-gray-600">Main image (optional)</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-3 w-48 h-32 object-cover rounded border"
            />
          )}

          <div className="flex gap-2 mt-4">
            <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
              {editingPost ? "Update" : "Post"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Post List */}
      <ul className="space-y-3">
        {blogs.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          blogs.map((p) => (
            <li
              key={p._id}
              className="flex justify-between items-center border-b py-3 cursor-pointer"
              onClick={() => setSelectedPost(p)}
            >
              <div>
                <div className="font-medium">{p.title ?? "Untitled"}</div>
                <div className="text-xs text-gray-500">
                  {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}
                </div>
              </div>

              <div
                className="flex gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <button onClick={() => handleEdit(p)} className="text-sm text-[#7c4dff]">
                  Edit
                </button>
                <button onClick={() => handleDelete(p._id)} className="text-sm text-red-500">
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Post Details */}
      {selectedPost && (
        <div className="mt-6 border-t pt-4">
          <h4 className="text-lg font-semibold mb-2">{selectedPost.title ?? "Untitled"}</h4>

          {selectedPost.mainPhoto && (
            <img
              src={getFullUrl(selectedPost.mainPhoto)}
              alt={selectedPost.title ?? ""}
              className="w-full max-h-64 object-cover rounded mb-4"
            />
          )}

          <p className="text-gray-700 whitespace-pre-line">
            {selectedPost.description ?? ""}
          </p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setSelectedPost(null);
              }}
              className="bg-gray-300 text-gray-800 px-3 py-1 rounded"
            >
              Close
            </button>

            <button
              onClick={() => {
                if (selectedPost) handleEdit(selectedPost);
              }}
              className="bg-[#7c4dff] text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(selectedPost._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
