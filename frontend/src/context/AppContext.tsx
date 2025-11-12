// src/context/AppContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type Role = "client" | "vendor" | "admin" | string;

interface UserPayload {
  id?: string;
  _id?: string;
  email?: string;
  role?: Role;
  phone?: string;
}

interface ClientProfile {
  user?: { _id?: string; email?: string } | string;
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
  guests?: Array<{ name?: string; phone?: string; email?: string }>;
  phone?: string;
  [k: string]: any;
}

interface VendorProfile {
  user?: { _id?: string; email?: string } | string;
  businessName?: string;
  category?: string;
  location?: string;
  description?: string;
  logo?: string;
  phone?: string;
  [k: string]: any;
}

interface VendorPost {
  _id: string;
  vendor?: any;
  title?: string;
  description?: string;
  priceFrom?: number;
  mainPhoto?: string;
  galleryImages?: string[];
  galleryVideos?: string[];
  featured?: boolean;
  [k: string]: any;
}

interface BookingRequest {
  _id?: string;
  client?: any;
  vendor?: any;
  service?: string;
  date?: string;
  status?: string;
}

interface MessageItem {
  _id?: string;
  fromUser?: any;
  toVendor?: any;
  text?: string;
  read?: boolean;
  createdAt?: string;
}

interface ReviewItem {
  _id?: string;
  client?: any;
  vendor?: any;
  rating?: number;
  text?: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  role?: Role;
  phone?: string;
  businessName?: string;
}

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  mainPhoto?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AppContextType {
  token: string | null;
  user: UserPayload | null;
  role: Role | null;
  clientProfile: ClientProfile | null;
  vendorProfile: VendorProfile | null;
  posts: VendorPost[];
  vendors: VendorProfile[];
  clients: ClientProfile[];
  bookings: BookingRequest[];
  messages: MessageItem[];
  reviews: ReviewItem[];
  blogs: BlogPost[];
  socket: any;
  authLoading: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  fetchClientProfile: () => Promise<void>;
  updateClientProfile: (payload: Partial<ClientProfile>) => Promise<ClientProfile | null>;
  updateVendorProfile: (payload: Partial<VendorProfile>) => Promise<VendorProfile | null>;
  fetchVendorProfile: (vendorId: string) => Promise<VendorProfile | null>;
  fetchVendorMe: () => Promise<void>;
  createPost: (form: FormData) => Promise<VendorPost | null>;
  updatePost: (id: string, form: FormData) => Promise<VendorPost | null>;
  fetchPosts: (vendorId?: string) => Promise<void>;
  fetchVendorPosts: () => Promise<void>;
  fetchPostById: (id: string) => Promise<VendorPost | null>;
  createBooking: (payload: { vendorId: string; service: string; date: string; message?: string }) => Promise<BookingRequest | null>;
  fetchClientBookings: () => Promise<void>;
  fetchVendorBookings: () => Promise<void>;
  respondBooking: (bookingId: string, status: "Accepted" | "Declined" | "Pending") => Promise<void>;
  sendMessage: (recipientId: string, text: string, file?: File | null) => Promise<MessageItem | null>;
  fetchMessages: () => Promise<void>;
  fetchConversation: (otherUserId: string) => Promise<any>;
  postReview: (payload: { vendorId: string; rating: number; text?: string }) => Promise<ReviewItem | null>;
  fetchReviewsForVendor: (vendorId: string) => Promise<void>;
  // NEW: fetch all reviews at once
  fetchAllReviews: () => Promise<void>;
  createBlog: (form: FormData) => Promise<BlogPost | null>;
  updateBlog: (id: string, form: FormData) => Promise<BlogPost | null>;
  deleteBlog: (id: string) => Promise<void>;
  fetchBlogs: () => Promise<void>;
  fetchBlogById: (id: string) => Promise<BlogPost | null>;

  // <-- ADDED: expose vendor/client list fetch functions in the context type
  fetchVendors: () => Promise<void>;
  fetchClients: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserPayload | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [posts, setPosts] = useState<VendorPost[]>([]);
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [authLoading, setAuthLoading] = useState(true);

  // --- SOCKET.IO SETUP ---
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    if (!user?.id) return;

    // connect socket
    const newSocket = io(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000", {
      transports: ["websocket"],
    });

    newSocket.emit("register", user.id); // register current user
    setSocket(newSocket);

    // listen for incoming messages
    newSocket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      try {
        if (user?.id) {
          localStorage.setItem(`messages_${user.id}`, JSON.stringify([...messages, msg]));
        }
      } catch { }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user?.id]);


  const applyToken = (t: string | null) => {
    if (t) {
      localStorage.setItem("token", t);
      axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
      setToken(t);
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setToken(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const { token: newToken, user: returnedUser } = res.data || {};
      if (!newToken) throw new Error("No token returned");

      applyToken(newToken);
      setUser(returnedUser || null);
      setRole(returnedUser?.role || null);

      // Fetch everything immediately after login
      await fetchAllDataAfterLogin(returnedUser?.role);

      toast.success("Logged in");
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Login failed");
      return false;
    }
  };

  const fetchAllDataAfterLogin = async (userRole?: Role) => {
    try {
      if (!userRole) return;

      // Always load common global data first
      await Promise.allSettled([
        fetchVendors(),
        fetchClients(),
        fetchAllReviews(),
        fetchBlogs(),
      ]);

      // Then role-specific data
      if (userRole === "vendor") {
        await Promise.allSettled([
          fetchVendorMe(),
          fetchVendorBookings(),
          fetchMessages(),
          fetchVendorPosts(),
        ]);
      }

      if (userRole === "client") {
        await Promise.allSettled([
          fetchClientProfile(),
          fetchClientBookings(),
          fetchMessages(),
        ]);
      }

      console.log("✅ All data pre-fetched after login");
    } catch (err) {
      console.error("Error prefetching after login:", err);
    }
  };


  const register = async (payload: RegisterPayload) => {
    try {
      const res = await axios.post("/api/auth/register", payload);

      // ✅ Accept both 200 and 201 as success
      if (res.status === 200 || res.status === 201) {
        const { token: newToken, user: returnedUser } = res.data || {};

        // Some APIs only return the user, not a token — handle that gracefully
        if (newToken) {
          applyToken(newToken);
        }

        setUser(returnedUser || null);
        setRole(returnedUser?.role || null);
        await fetchUser();

        if (returnedUser?.role === "vendor") {
          await fetchVendorMe();
        } else if (returnedUser?.role === "client") {
          await fetchClientProfile();
        }

        toast.success("Account created");
        return true;
      }

      toast.error("Registration failed");
      return false;
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong during registration";
      toast.error(msg);
      return false;
    }
  };


  const logout = () => {
    applyToken(null);
    setUser(null);
    setRole(null);
    setClientProfile(null);
    setVendorProfile(null);
    setPosts([]);
    setVendors([]);
    setBookings([]);
    setMessages([]);
    setReviews([]);
    toast.success("Logged out");
    router.push("/");
  };

  const fetchUser = async () => {
    if (!token || !role) return;
    try {
      if (role === "client") {
        const clientRes = await axios.get("/api/clients/me");
        setClientProfile(clientRes.data);
        if (clientRes.data?.user?.email) {
          setUser({
            email: clientRes.data.user.email,
            id: clientRes.data.user._id,
            role: "client",
            phone: clientRes.data.phone,
          });
        }
      }

      if (role === "vendor") {
        const vendorRes = await axios.get("/api/vendors/me");
        setVendorProfile(vendorRes.data);
        if (vendorRes.data?.user?.email) {
          setUser({
            email: vendorRes.data.user.email,
            id: vendorRes.data.user._id,
            role: "vendor",
            phone: vendorRes.data.phone,
          });
        }
      }
    } catch (err) {
      console.warn("fetchUser error:", err);
    }
  };

  // fetch all vendors (exposed)
  const fetchVendors = async () => {
    try {
      const { data } = await axios.get("/api/vendors");
      setVendors(data || []);
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
      setVendors([]);
    }
  };

  // fetch all clients (exposed)
  const fetchClients = async () => {
    try {
      const { data } = await axios.get("/api/clients");
      setClients(data || []);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
      setClients([]);
    }
  };

  const fetchClientProfile = async () => {
    try {
      const { data } = await axios.get("/api/clients/me");
      setClientProfile(data);
    } catch { }
  };

  const updateClientProfile = async (payload: Partial<ClientProfile>) => {
    try {
      const { data } = await axios.put("/api/clients/me", payload);
      setClientProfile(data);
      toast.success("Profile updated");
      return data as ClientProfile;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
      return null;
    }
  };

  const updateVendorProfile = async (payload: Partial<VendorProfile>) => {
    try {
      const { data } = await axios.put("/api/vendors/me", payload);
      setVendorProfile(data);
      toast.success("Profile updated");
      return data as VendorProfile;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update vendor profile");
      return null;
    }
  };

  const fetchVendorProfile = async (vendorId: string) => {
    try {
      const { data } = await axios.get(`/api/vendors/${vendorId}`);
      return data as VendorProfile;
    } catch {
      toast.error("Could not load vendor");
      return null;
    }
  };

  const fetchVendorMe = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/vendors/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendorProfile(data);
    } catch (err) {
      console.error("fetchVendorMe error:", err);
    }
  };

  const createPost = async (form: FormData) => {
    try {
      const { data } = await axios.post("/api/posts", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPosts((p) => [data, ...p]);
      toast.success("Post created");
      return data as VendorPost;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create post");
      return null;
    }
  };

  const updatePost = async (id: string, form: FormData) => {
    try {
      const { data } = await axios.put(`/api/posts/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPosts((p) => p.map((post) => (post._id === id ? data : post)));
      toast.success("Post updated");
      return data as VendorPost;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update post");
      return null;
    }
  };

  const fetchPosts = async (vendorId?: string) => {
    try {
      const url = vendorId ? `/api/posts?vendor=${vendorId}` : "/api/posts";
      const { data } = await axios.get(url);
      setPosts(data || []);
    } catch { }
  };

  const fetchVendorPosts = async () => {
    if (!vendorProfile?._id) return;
    try {
      const { data } = await axios.get(`/api/posts?vendor=${vendorProfile._id}`);
      setPosts(data || []);
    } catch (err) {
      console.error("Failed to fetch vendor posts:", err);
      setPosts([]);
    }
  };

  const fetchPostById = async (id: string) => {
    try {
      const { data } = await axios.get(`/api/posts/${id}`);
      return data as VendorPost;
    } catch {
      toast.error("Could not load post");
      return null;
    }
  };

  const createBooking = async (payload: {
    vendorId: string;
    service: string;
    date: string;
    message?: string;
  }) => {
    try {
      const { data } = await axios.post("/api/bookingRequests", payload);
      toast.success("Request sent");
      return data as BookingRequest;
    } catch (err: any) {
      toast.error("Please Signup/login As Client");
      return null;
    }
  };

  const fetchClientBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookingRequests/client/me");
      setBookings(data || []);
    } catch { }
  };

  const fetchVendorBookings = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/bookingRequests/vendor/me");
      setBookings(data || []);
    } catch (err) {
      console.error("Failed to fetch vendor bookings:", err);
      setBookings([]);
    }
  }, []); // 👈 empty deps = stable reference


  const respondBooking = async (bookingId: string, status: "Accepted" | "Declined" | "Pending") => {
    try {
      await axios.put(`/api/bookingRequests/${bookingId}/status`, { status });
      toast.success("Booking updated");
      await fetchVendorBookings();
    } catch { }
  };

  const sendMessage = async (recipientId: string, text: string, file?: File | null) => {
    try {
      if (!recipientId) {
        toast.error("Recipient ID is required");
        return null;
      }

      if (!token || !role) {
        toast.error("You are not logged in");
        return null;
      }

      const formData = new FormData();
      formData.append("toId", recipientId);

      // Correct recipient role: if current user is client, recipient is vendor
      formData.append("toRole", role === "client" ? "vendor" : "client");
      if (text) formData.append("text", text);
      if (file) formData.append("file", file);

      const { data } = await axios.post("/api/messages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // emit live socket event
      if (socket) {
        socket.emit("sendMessage", {
          ...data,
          receiverId: recipientId,
        });
      }

      // update local state safely
      setMessages((prev) => {
        const updated = [...prev, data];
        const currentId = clientProfile?._id || vendorProfile?._id;
        if (currentId) {
          localStorage.setItem(`messages_${currentId}`, JSON.stringify(updated));
        }
        return updated;
      });

      return data;
    } catch (err: any) {
      console.error("sendMessage error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to send message");
      return null;
    }
  };





  const fetchMessages = async () => {
    try {
      if (!token) throw new Error("No auth token found");

      // Get all chats involving current user with auth header
      const { data } = await axios.get("/api/messages/my-chats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Save to state
      setMessages(data || []);

      // Save to localStorage for offline/cache
      if (user?.id) {
        localStorage.setItem(`messages_${user.id}`, JSON.stringify(data || []));
      }

      console.log("✅ Messages fetched", data.length);
    } catch (err: any) {
      console.error("Failed to fetch messages:", err.response?.data || err.message);
      setMessages([]);
    }
  };

  const fetchConversation = async (otherUserId: string) => {
    try {
      if (!token) throw new Error("No auth token found");

      const { data } = await axios.get(`/api/messages/conversation/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages(data || []);
      if (user?.id) {
        localStorage.setItem(`conversation_${user.id}_${otherUserId}`, JSON.stringify(data || []));
      }

      return data;
    } catch (err: any) {
      console.error("Failed to fetch conversation:", err.response?.data || err.message);
      setMessages([]);
      return [];
    }
  };



  const postReview = async (payload: { vendorId: string; rating: number; text?: string }) => {
    try {
      const { data } = await axios.post("/api/reviews", payload);
      // When a new review is posted we push it to reviews state
      setReviews((p) => [data, ...p]);
      toast.success("Review added");
      return data as ReviewItem;
    } catch {
      toast.error("Failed to post review, Please log in");
      return null;
    }
  };

  // NEW: fetch all reviews at once (useful for listings)
  const fetchAllReviews = async () => {
    try {
      const { data } = await axios.get("/api/reviews");
      setReviews(data || []);
      try {
        localStorage.setItem("all_reviews", JSON.stringify(data || []));
      } catch { }
    } catch (err) {
      console.error("Failed to fetch all reviews:", err);
      setReviews([]);
    }
  };

  const fetchReviewsForVendor = async (vendorId: string) => {
    try {
      // Load cached reviews immediately (per vendor)
      const cached = localStorage.getItem(`reviews_${vendorId}`);
      if (cached) {
        setReviews(JSON.parse(cached));
      }

      // Then fetch fresh reviews
      const { data } = await axios.get(`/api/reviews/vendor/${vendorId}`);
      setReviews(data || []);
      try {
        localStorage.setItem(`reviews_${vendorId}`, JSON.stringify(data || []));
      } catch { }
    } catch {
      console.error("Failed to fetch reviews");
    }
  };

  // BLOG START
  const createBlog = async (form: FormData) => {
    try {
      const { data } = await axios.post("/api/blogs", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBlogs((prev) => [data, ...prev]);
      toast.success("Blog post created");
      return data as BlogPost;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create blog post");
      return null;
    }
  };

  const updateBlog = async (id: string, form: FormData) => {
    try {
      const { data } = await axios.put(`/api/blogs/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBlogs((prev) => prev.map((b) => (b._id === id ? data : b)));
      toast.success("Blog post updated");
      return data as BlogPost;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update blog post");
      return null;
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      await axios.delete(`/api/blogs/${id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      toast.success("Blog post deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete blog post");
    }
  };

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blogs");
      setBlogs(data || []);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
      setBlogs([]);
    }
  };

  const fetchBlogById = async (id: string) => {
    try {
      const { data } = await axios.get(`/api/blogs/${id}`);
      return data as BlogPost;
    } catch {
      toast.error("Failed to load blog post");
      return null;
    }
  };
  // BLOG END

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      applyToken(t);
      fetchUser().finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }

    // Load cached messages if available
    const storedUserId = localStorage.getItem("lastUserId");
    if (storedUserId) {
      const cached = localStorage.getItem(`messages_${storedUserId}`);
      if (cached) {
        setMessages(JSON.parse(cached));
      }
    }

    // Optionally load cached all reviews into memory quickly (if present)
    try {
      const cachedAll = localStorage.getItem("all_reviews");
      if (cachedAll) {
        setReviews(JSON.parse(cachedAll));
      }
    } catch { }
  }, [user?.id]);

  // Store last logged-in user ID
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem("lastUserId", user.id);
    }
  }, [user?.id]);

  return (
    <AppContext.Provider
      value={{
        token,
        user,
        role,
        clientProfile,
        vendorProfile,
        posts,
        vendors,
        clients,
        bookings,
        messages,
        reviews,
        authLoading,
        blogs,
        socket,

        // auth & profile
        login,
        register,
        logout,
        fetchUser,
        fetchClientProfile,
        updateClientProfile,
        updateVendorProfile,
        fetchVendorProfile,
        fetchVendorMe,

        // posts
        createPost,
        updatePost,
        fetchPosts,
        fetchVendorPosts,
        fetchPostById,

        // bookings
        createBooking,
        fetchClientBookings,
        fetchVendorBookings,
        respondBooking,

        // messaging
        sendMessage,
        fetchMessages,
        fetchConversation,


        // reviews
        postReview,
        fetchReviewsForVendor,
        fetchAllReviews, // <-- new export

        // vendor/client lists
        fetchVendors,
        fetchClients,

        // blogs
        createBlog,
        updateBlog,
        deleteBlog,
        fetchBlogs,
        fetchBlogById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};
