import {
    FiEye, FiMessageSquare, FiTrendingUp, FiCalendar,
} from "react-icons/fi";
import React from "react";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";


type AnalyticsRow = {
    day: string;        // YYYY-MM-DD
    profileViews: number;
};



import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

// -----------------------
// CHART DATA
// -----------------------



const TRAFFIC_COLORS = ["#3b2e86", "#dd5a6f", "#62b48a", "#e6b85c"];

export default function VendorAnalytics() {

    const { bookings, vendorProfile, fetchVendorAnalytics, fetchVendorBookings, fetchVendorMe } = useAppContext();
    const [analytics, setAnalytics] = useState<AnalyticsRow[]>([]);

    const totalBookings = bookings?.length || 0;
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const vendorId = vendorProfile?._id || null;
    const [formData, setFormData] = useState({
        businessName: "",
        category: "",
        location: "",
        website: "",
        description: "",
        phone: "",
        email: "",
        profilePhoto: null as File | string | null,
        coverPhoto: null as File | string | null,
    });

    useEffect(() => {
        if (!vendorId) return;

        const fetchAnalytics = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/api/analytics/vendor/${vendorId}`,
                    { cache: "no-store" }
                );
                const data = await res.json();
                setAnalytics(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch vendor analytics:", err);
            }
        };

        fetchAnalytics();
    }, [fetchVendorAnalytics]);

    useEffect(() => {
        fetchVendorMe();
    }, []);

    useEffect(() => {
        if (vendorProfile && !isEditing) {
            setFormData(prev => ({
                ...prev,
                businessName: vendorProfile.businessName || "",
                category: vendorProfile.category || "",
                location: vendorProfile.location || "",
                website: vendorProfile.website || "",
                description: vendorProfile.description || "",
                phone: vendorProfile.phone || "",
                email: vendorProfile.email || "",
            }));
        }
    }, [vendorProfile, isEditing]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const loadBookings = async () => {
            try {
                setLoading(true);
                await fetchVendorBookings();
            } catch (err) {
                console.error("Failed to fetch bookings:", err);
                toast.error("Failed to load bookings");
            } finally {
                setLoading(false);
            }
        };

        timeout = setTimeout(() => {
            loadBookings();
        }, 300);

        return () => clearTimeout(timeout);
    }, [fetchVendorBookings]);


    const profileViewsData = analytics.map((a) => {
        const date = new Date(a.day + "-01");
        if (isNaN(date.getTime())) {
            return { name: a.day, views: a.profileViews || 0 }; // fallback to raw string
        }
        return {
            name: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            views: a.profileViews || 0,
        };
    });


    // Optionally add a “latest month” bar for live bookings
    const latestMonth = new Date().toLocaleString("default", { month: "short" });
    const bookingsThisMonth = bookings?.filter((b: any) => {
        const d = new Date(b.date);
        return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
    }).length || 0;


    const monthlyBookingsData = React.useMemo(() => {
        const map: Record<string, number> = {};

        bookings?.forEach((b: any) => {
            if (!b.date) return;

            const d = new Date(b.date);
            if (isNaN(d.getTime())) return;

            const month = d.toLocaleString("en-US", { month: "short" });

            map[month] = (map[month] || 0) + 1;
        });

        return Object.entries(map).map(([name, value]) => ({
            name,
            value,
        }));
    }, [bookings]);


    const totalViews = analytics.reduce((s, a) => s + a.profileViews, 0) || 1;

    const trafficData = [
        { name: "Search", value: Math.round((totalViews * 0.45) / totalViews * 100) },
        { name: "Direct", value: Math.round((totalViews * 0.25) / totalViews * 100) },
        { name: "Social", value: Math.round((totalViews * 0.20) / totalViews * 100) },
        { name: "Referral", value: Math.round((totalViews * 0.10) / totalViews * 100) },
    ];

    // Sum analytics profileViews + total bookings
    const totalProfileViews =
        analytics?.reduce((sum, a) => sum + (a.profileViews || 0), 0) || 0;




    const conversionRate =
        totalProfileViews > 0
            ? ((totalBookings / totalProfileViews) * 100).toFixed(1)
            : "0.0";



    return (
        <div className="w-full px-2 md:px-4 lg:px-6 py-6 bg-gray-50 font-inter">
            {/* HEADER SECTION */}
            <div className="mb-4 mr-3">
                <h1
                    className="font-serif font-bold"
                    style={{ fontSize: "28px", color: "#1E1E1E" }}
                >
                    Analytics & Insights
                </h1>

                <p
                    className=""
                    style={{
                        fontSize: "15px",
                        color: "#6B7280",
                    }}
                >
                    Track your performance and growth
                </p>
            </div>

            {/* TOP METRIC CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                <MetricCard
                    icon={<FiEye size={22} />}
                    label="Profile Views"
                    value={totalProfileViews.toLocaleString()}
                    change="+"
                    changeColor="text-green-600"
                />

                <MetricCard
                    icon={<FiCalendar size={22} />}
                    label="Bookings"
                    value={String(totalBookings)}
                    change=""
                    changeColor="text-gray-500"
                />


                <MetricCard
                    icon={<FiTrendingUp size={22} />}
                    label="Conversion Rate"
                    value={`${conversionRate}%`}
                    change="+"
                    changeColor="text-green-600"
                />


            </div>

            {/* CHARTS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

                {/* Profile Views Line Chart */}
                <div className="bg-white shadow-md rounded-xl p-6">
                    <div className="font-semibold mb-4">Profile Views</div>

                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={profileViewsData}>
                                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                                <XAxis dataKey="name" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#6b46c1"
                                    strokeWidth={3}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Monthly Inquiries Bar Chart */}
                <div className="bg-white shadow-md rounded-xl p-6">
                    <div className="font-semibold mb-4">Monthly Inquiries</div>

                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyBookingsData}>
                                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                                <XAxis dataKey="name" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip />
                                <Bar
                                    dataKey="value"
                                    fill="#6b46c1"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* TRAFFIC + INSIGHTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

                {/* Traffic Sources Donut Chart */}
                <div className="bg-white shadow-md rounded-xl p-6">
                    <div className="font-semibold mb-4">Traffic Sources</div>

                    <div className="w-full h-64">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={trafficData}
                                    dataKey="value"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={1}
                                >
                                    {trafficData.map((_, i) => (
                                        <Cell key={i} fill={TRAFFIC_COLORS[i]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-6 text-sm text-gray-700 space-y-2">
                        {trafficData.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: TRAFFIC_COLORS[i] }}
                                ></span>
                                {item.name} — {item.value}%
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance Insights */}
                <div className="bg-white shadow-md rounded-xl p-6 space-y-5">

                    <InsightCard
                        title="Strong Month!"
                        color="bg-green-100 text-green-700"
                        text="Your profile views increased by 47% compared to last month. The new portfolio photos seem to be attracting more attention!"
                    />

                    <InsightCard
                        title="Inquiry Tip"
                        color="bg-blue-100 text-blue-700"
                        text="Vendors who respond within 2 hours have a 40% higher booking rate. Your average response time is 3 hours."
                    />

                    <InsightCard
                        title="Peak Activity"
                        color="bg-rose-100 text-rose-700"
                        text="Most couples view your profile on weekends between 8–10 PM. Consider scheduling your profile updates during these times."
                    />

                </div>

            </div>
        </div>
    );
}

// -----------------------
// REUSABLE COMPONENTS
// -----------------------
// -----------------------
// REUSABLE COMPONENTS — FIXED WITH TYPES
// -----------------------

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    change: string;
    changeColor: string;
}

function MetricCard({ icon, label, value, change, changeColor }: MetricCardProps) {
    return (
        <div className="bg-white shadow-md rounded-xl p-5">
            <div className="text-purple-700">{icon}</div>
            <div className="text-3xl font-semibold mt-3">{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
            <div className={`font-semibold text-sm mt-3 ${changeColor}`}>
                {change}
            </div>
        </div>
    );
}

interface InsightCardProps {
    title: string;
    text: string;
    color: string; // tailwind classes
}

function InsightCard({ title, text, color }: InsightCardProps) {
    return (
        <div className={`${color} p-4 rounded-xl shadow-sm`}>
            <div className="font-semibold mb-1">{title}</div>
            <p className="text-sm leading-relaxed">{text}</p>
        </div>
    );
}
