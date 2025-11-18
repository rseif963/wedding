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
  budget?: Budget;
  phone?: string;
  [k: string]: any;
}

interface BudgetItem {
  _id: string;
  title: string;
  category?: string;
  cost: number;
  paid?: boolean;
  notes?: string;
}

interface Budget {
  plannedAmount: number;
  actualSpent: number;
  items: BudgetItem[];
  showBudget?: boolean;
}

interface TaskItem {
  _id?: string;
  title: string;
  description?: string;
  dueDate?: string | Date;
  completed?: boolean;
  category?: string;
  createdAt?: string | Date;
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
  rating?: number; // overall rating
  text?: string;
  quality?: number;
  responsiveness?: number;
  professionalism?: number;
  flexibility?: number;
  value?: number;
  reply?: string; // vendor reply
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
  updatePlannedBudget: (amount: number) => Promise<Budget | null>;
  addBudgetItem: (item: {
    title: string;
    category?: string;
    cost: number;
    paid?: boolean;
    notes?: string;
  }) => Promise<Budget | null>;
  updateBudgetItem: (itemId: string, update: any) => Promise<Budget | null>;
  deleteBudgetItem: (itemId: string) => Promise<Budget | null>;
  // Guests
  addGuest: (
    guest: { name?: string; phone?: string; email?: string }
  ) => Promise<any>;
  updateGuest: (
    guestId: string,
    update: { name?: string; phone?: string; email?: string }
  ) => Promise<any>;
  deleteGuest: (guestId: string) => Promise<any>;
  toggleGuestVisibility: () => Promise<boolean | null>;
  updateExpectedGuestCount: (count: number) => Promise<number | null>;
  // ...existing props
  tasks: TaskItem[];
  showChecklist: boolean;

  // TASK FUNCTIONS
  fetchTasks: () => Promise<void>;
  addTask: (task: {
    title: string;
    description?: string;
    dueDate?: string | Date;
    category?: string;
  }) => Promise<TaskItem[] | null>;
  updateTask: (taskId: string, update: Partial<TaskItem>) => Promise<TaskItem[] | null>;
  deleteTask: (taskId: string) => Promise<TaskItem[] | null>;
  toggleChecklist: (show: boolean) => Promise<boolean>;


  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  fetchClientProfile: () => Promise<void>;
  fetchClientAll: () => Promise<void>;
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
  postReview: (payload: {
    vendorId: string;
    rating: number;
    text?: string;
    quality?: number;
    responsiveness?: number;
    professionalism?: number;
    flexibility?: number;
    value?: number;
  }) => Promise<ReviewItem | null>;
  replyToReview: (reviewId: string, text: string) => Promise<ReviewItem | null>;


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
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [showChecklist, setShowChecklist] = useState(true);


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
          fetchClientAll(),
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

  // NEW: fetch full client payload (profile + guests + budget + tasks)
  const fetchClientAll = async () => {
    try {
      const { data } = await axios.get("/api/clients/me/all");
      // The endpoint returns: { profile, guests, budget, tasks }
      if (!data) return;

      // Merge server response into clientProfile state consistently
      // keep existing fields (like user/_id) and override with returned values
      setClientProfile((prev) => ({
        ...(prev || {}),
        // top-level small profile fields come from data.profile
        ...(data.profile || {}),
        guests: data.guests ?? (prev?.guests ?? []),
        budget: data.budget ?? (prev?.budget ?? { plannedAmount: 0, items: [] }),
        tasks: data.tasks ?? (prev?.tasks ?? []),
      }));
    } catch (err) {
      console.error("fetchClientAll error:", err);
    }
  };


  // -------------------- GUEST FUNCTIONS --------------------

  // Add a new guest
  const addGuest = async (guest: { name?: string; phone?: string; email?: string }) => {
    try {
      const { data } = await axios.post("/api/clients/guests", guest);

      setClientProfile((prev) => ({
        ...prev,
        guests: data.guests,
      }));

      toast.success("Guest added");
      return data.guests;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add guest");
      return null;
    }
  };

  // Update a guest by ID
  const updateGuest = async (
    guestId: string,
    update: { name?: string; phone?: string; email?: string }
  ) => {
    try {
      const { data } = await axios.put(`/api/clients/guests/${guestId}`, update);

      setClientProfile((prev) => ({
        ...prev,
        guests: data.guests,
      }));

      toast.success("Guest updated");
      return data.guests;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update guest");
      return null;
    }
  };

  // Delete a guest by ID
  const deleteGuest = async (guestId: string) => {
    try {
      const { data } = await axios.delete(`/api/clients/guests/${guestId}`);

      setClientProfile((prev) => ({
        ...prev,
        guests: data.guests,
      }));

      toast.success("Guest removed");
      return data.guests;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete guest");
      return null;
    }
  };

  // Toggle Show/Hide full guest list
  const toggleGuestVisibility = async () => {
    try {
      const { data } = await axios.put("/api/clients/guests/toggle-visibility");

      setClientProfile((prev) => ({
        ...prev,
        showGuests: data.showGuests,
      }));

      toast.success(
        data.showGuests ? "Guest list visible" : "Guest list hidden"
      );

      return data.showGuests;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to toggle guest list");
      return null;
    }
  };

  // Update total expected guest count
  const updateExpectedGuestCount = async (count: number) => {
    try {
      const { data } = await axios.put("/api/clients/expected-guests", {
        expectedGuestsCount: count,
      });

      setClientProfile((prev) => ({
        ...prev,
        expectedGuestsCount: data.expectedGuestsCount,
      }));

      toast.success("Expected guests updated");
      return data.expectedGuestsCount;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update expected guests");
      return null;
    }
  };

  // FETCH ALL TASKS
  const fetchTasks = async () => {
    try {
      const { data } = await axios.get("/api/clients/me/all");
      setTasks(data.tasks || []);
      setShowChecklist(data.profile?.showChecklist ?? true);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setTasks([]);
    }
  };

  // ADD TASK
  const addTask = async (task: {
    title: string;
    description?: string;
    dueDate?: string | Date;
    category?: string;
  }) => {
    try {
      const { data } = await axios.post("/api/clients/tasks", task);
      setTasks(data);
      toast.success("Task added");
      return data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add task");
      return null;
    }
  };

  // UPDATE TASK
  const updateTask = async (taskId: string, update: Partial<TaskItem>) => {
    try {
      const { data } = await axios.put(`/api/clients/tasks/${taskId}`, update);
      setTasks(data);
      toast.success("Task updated");
      return data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update task");
      return null;
    }
  };

  // DELETE TASK
  const deleteTask = async (taskId: string) => {
    try {
      const { data } = await axios.delete(`/api/clients/tasks/${taskId}`);
      setTasks(data);
      toast.success("Task deleted");
      return data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete task");
      return null;
    }
  };

  // TOGGLE CHECKLIST
  const toggleChecklist = async (show: boolean) => {
    try {
      const { data } = await axios.put("/api/clients/tasks/toggle", { showChecklist: show });
      setShowChecklist(data.showChecklist);
      return data.showChecklist;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to toggle checklist");
      return false;
    }
  };



  // -------------------- BUDGET FUNCTIONS --------------------
  // -------------------- BUDGET FUNCTIONS (FIXED) --------------------

  const updatePlannedBudget = async (amount: number) => {
    try {
      const { data } = await axios.put("/api/clients/budget/planned", {
        plannedAmount: amount,
      });

      // ❗ data = budget object, NOT { budget: ... }
      setClientProfile((prev: any) => ({
        ...prev,
        budget: data,
      }));

      toast.success("Planned budget updated");
      return data;
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to update planned budget"
      );
      return null;
    }
  };

  const addBudgetItem = async (item: {
    title: string;
    category?: string;
    cost: number;
    paid?: boolean;
    notes?: string;
  }) => {
    try {
      const { data } = await axios.post("/api/clients/budget/item", item);

      // ❗ data = budget object
      setClientProfile((prev: any) => ({
        ...prev,
        budget: data,
      }));

      toast.success("Budget item added");
      return data;
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to add budget item"
      );
      return null;
    }
  };

  const updateBudgetItem = async (itemId: string, update: any) => {
    try {
      const { data } = await axios.put(
        `/api/clients/budget/item/${itemId}`,
        update
      );

      // ❗ data = budget object
      setClientProfile((prev: any) => ({
        ...prev,
        budget: data,
      }));

      toast.success("Budget item updated");
      return data;
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to update budget item"
      );
      return null;
    }
  };

  // ------------------------------
  // UPDATE ACTUAL SPENT + MARK PAID
  // ------------------------------
  const updateBudgetTotals = async (actualSpent: number, itemId: string, paid: false) => {
    try {
      const res = await axios.put("/api/clients/me/budget/updateTotals", {
        actualSpent,
        itemId,
        paid,
      });

      const data = res.data;

      setClientProfile((prev) => ({
        ...(prev || {}),
        budget: {
          plannedAmount: Number(data.budget?.plannedAmount ?? 0),
          actualSpent: Number(data.budget?.actualSpent ?? 0),
          items: data.budget?.items ?? [],
          showBudget: prev?.budget?.showBudget ?? true,
        },
      }));

      return true;
    } catch (error) {
      console.error("Error updating totals:", error);
      return false;
    }
  };


  const deleteBudgetItem = async (itemId: string) => {
    try {
      const { data } = await axios.delete(`/api/clients/budget/item/${itemId}`);

      setClientProfile((prev) => ({
        ...prev,
        budget: data.budget,
      }));

      toast.success("Budget item deleted");
      return data.budget;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete budget item");
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
  }, []);


  const respondBooking = async (bookingId: string, status: "Accepted" | "Declined" | "Pending") => {
    try {
      await axios.put(`/api/bookingRequests/${bookingId}/status`, { status });
      toast.success("Booking updated");
      await fetchVendorBookings();
    } catch { }
  };

  const sendMessage = async (recipientUserId: string, text: string, file?: File | null) => {
    try {
      if (!recipientUserId) {
        toast.error("Recipient ID is required");
        return null;
      }

      if (!token || !role) {
        toast.error("You are not logged in");
        return null;
      }

      // Prepare form
      const formData = new FormData();
      formData.append("toId", recipientUserId); // 🔥 REAL USER ID
      formData.append("toRole", role === "client" ? "vendor" : "client");
      if (text) formData.append("text", text);
      if (file) formData.append("file", file);

      const { data } = await axios.post("/api/messages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // emit via socket
      socket?.emit("sendMessage", { ...data });

      // live local update
      setMessages((prev) => [...prev, data]);

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

      const { data } = await axios.get("/api/messages/my-chats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Transform backend messages --> chat list with partner info
      const mappedChats = (data || []).map((msg: any) => {
        const isSender = msg.sender.id === user?.id;

        const partner = isSender ? msg.receiver : msg.sender;

        return {
          chatId: msg.conversationId,
          lastMessage: msg,
          partnerUserId: partner.id,       // 🔥 required for opening conversation
          partnerRole: partner.role,
          partnerName: partner.name || "",
          partnerAvatar: partner.avatar || null,
        };
      });

      setMessages(mappedChats);

      if (user?.id) {
        localStorage.setItem(
          `messages_${user.id}`,
          JSON.stringify(mappedChats)
        );
      }

      console.log("✅ Chats fetched:", mappedChats.length);
    } catch (err: any) {
      console.error(
        "Failed to fetch messages:",
        err.response?.data || err.message
      );
      setMessages([]);
    }
  };


  const fetchConversation = async (otherUserId: string) => {
    try {
      const { data } = await axios.get(
        `/api/messages/conversation/${otherUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages(data || []);

      if (user?.id) {
        localStorage.setItem(
          `conversation_${user.id}_${otherUserId}`,
          JSON.stringify(data)
        );
      }

      return data;
    } catch (err: any) {
      console.error("Failed to fetch conversation:", err.message);
      setMessages([]);
      return [];
    }
  };




  const postReview = async (payload: {
    vendorId: string;
    rating: number;
    text?: string;
    quality?: number;
    responsiveness?: number;
    professionalism?: number;
    flexibility?: number;
    value?: number;
  }) => {
    try {
      const { data } = await axios.post("/api/reviews", payload);
      setReviews((p) => [data, ...p]);
      toast.success("Review added");
      return data as ReviewItem;
    } catch {
      toast.error("Failed to post review, Please log in As Client");
      return null;
    }
  };

  // Reply to a review
  const replyToReview = async (reviewId: string, text: string) => {
    const vendorToken = localStorage.getItem("token"); // get vendor auth token

    if (!vendorToken) {
      toast.error("Not authorized to reply");
      return null;
    }

    if (!text || !text.trim()) {
      toast.error("Reply cannot be empty");
      return null;
    }

    try {
      // Post reply to backend
      const { data } = await axios.post(
        `/api/reviews/${reviewId}/reply`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
        }
      );

      // `data` contains the updated review (including single 'reply' string)
      // Update local reviews state with new reply string
      const updatedReviews = reviews.map((review) =>
        review._id === reviewId ? { ...review, reply: data.reply } : review
      );

      setReviews(updatedReviews);
      localStorage.setItem("all_reviews", JSON.stringify(updatedReviews));

      toast.success("Reply posted");

      return data; // return updated review
    } catch (err: any) {
      console.error("replyToReview error:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Failed to reply to review");
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

  // Fetch reviews for a vendor
  const fetchReviewsForVendor = async (vendorId: string) => {
    try {
      const { data } = await axios.get(`/api/reviews/vendor/${vendorId}`);
      // Add vendorId if missing and persist
      const mapped = data.map((r: any) => ({ ...r, vendorId }));
      setReviews(mapped);
      localStorage.setItem("all_reviews", JSON.stringify(mapped));
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setReviews([]);
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
        tasks,
        showChecklist,



        updatePlannedBudget,
        addBudgetItem,
        updateBudgetItem,
        deleteBudgetItem,


        // guest functions
        addGuest,
        updateGuest,
        deleteGuest,
        toggleGuestVisibility,
        updateExpectedGuestCount,



        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleChecklist,




        // auth & profile
        login,
        register,
        logout,
        fetchUser,
        fetchClientProfile,
        fetchClientAll,
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
        replyToReview,

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
