import {
    FiEye,
    FiMessageSquare,
    FiTrendingUp,
    FiCalendar,
} from "react-icons/fi";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";

// -----------------------
// CHART DATA
// -----------------------

const profileViewsData = [
    { name: "Jan", views: 400 },
    { name: "Feb", views: 650 },
    { name: "Mar", views: 700 },
    { name: "Apr", views: 850 },
    { name: "May", views: 1100 },
    { name: "Jun", views: 900 },
];

const inquiriesData = [
    { name: "Jan", value: 4 },
    { name: "Feb", value: 6 },
    { name: "Mar", value: 5 },
    { name: "Apr", value: 10 },
    { name: "May", value: 12 },
    { name: "Jun", value: 8 },
];

const trafficData = [
    { name: "Search", value: 45 },
    { name: "Direct", value: 25 },
    { name: "Social", value: 20 },
    { name: "Referral", value: 10 },
];

const TRAFFIC_COLORS = ["#3b2e86", "#dd5a6f", "#62b48a", "#e6b85c"];

export default function VendorAnalytics() {
    return (
        <div className="w-full px-6 py-8 bg-gray-50 font-inter">
            {/* HEADER SECTION */}
            <div className="mb-10">
                <h1
                    className="font-serif font-bold"
                    style={{ fontSize: "32px", color: "#1E1E1E" }}
                >
                    Analytics & Insights
                </h1>

                <p
                    className="mt-1"
                    style={{
                        fontSize: "15px",
                        color: "#6B7280",
                    }}
                >
                    Track your performance and growth
                </p>
            </div>

            {/* TOP METRIC CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <MetricCard
                    icon={<FiEye size={22} />}
                    label="Profile Views"
                    value="1,248"
                    change="+12%"
                    changeColor="text-green-600"
                />

                <MetricCard
                    icon={<FiMessageSquare size={22} />}
                    label="Inquiries"
                    value="24"
                    change="+8%"
                    changeColor="text-green-600"
                />

                <MetricCard
                    icon={<FiTrendingUp size={22} />}
                    label="Conversion Rate"
                    value="18.5%"
                    change="+3.2%"
                    changeColor="text-green-600"
                />

                <MetricCard
                    icon={<FiCalendar size={22} />}
                    label="Bookings"
                    value="5"
                    change="-2"
                    changeColor="text-red-500"
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
                            <BarChart data={inquiriesData}>
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
