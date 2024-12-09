import { useState, useEffect } from "react";
import axios from "axios";
const VITE_API_URL = import.meta.env.VITE_API_URL;

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
    Users,
    UserCheck,
    Shield,
    Activity,
    Heart,
    Printer,
    Image,
} from "lucide-react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement
);

// Chart.js default styles for dark theme
ChartJS.defaults.color = "#e5e7eb";
ChartJS.defaults.borderColor = "#374151";

export default function DashboardAnalytics() {
    const insta_admin = localStorage.getItem("insta_admin");

    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${VITE_API_URL}/admin/users/dashboard-analytics`,
                    { headers: { insta_admin } }
                );
                setAnalyticsData(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </div>
        );
    if (!analyticsData)
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
                <Shield className="w-12 h-12 text-yellow-500" />
                <p className="text-2xl font-bold">Error loading data</p>
            </div>
        );

    const roleData = {
        labels: [
            `User ${analyticsData.distributions.roles[0].count}`,
            `Admin ${analyticsData.distributions.roles[1].count}`,
        ],
        datasets: [
            {
                data: analyticsData.distributions.roles.map((role) => role.count),
                backgroundColor: ["#9ae6b4", "#3182ce"],
            },
        ],
    };

    const privacyData = {
        labels: [
            `Public Profiles ${analyticsData.distributions.profilePrivacy.find((p) => p.public)
                ?.count || 0
            }`,
            `Private Profiles ${analyticsData.distributions.profilePrivacy.find((p) => !p.public)
                ?.count || 0
            }`,
        ],
        datasets: [
            {
                data: [
                    analyticsData.distributions.profilePrivacy.find((p) => p.public)
                        ?.count || 0,
                    analyticsData.distributions.profilePrivacy.find((p) => !p.public)
                        ?.count || 0,
                ],
                backgroundColor: ["#22c55e", "#ef4444"],
            },
        ],
    };

    const statusData = {
        labels: analyticsData.distributions.status.map(
            (status) => `${status.status} (${status.count})`
        ),
        datasets: [
            {
                label: "Users by Status",
                data: analyticsData.distributions.status.map((status) => status.count),
                backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
            },
        ],
    };

    const loginActivityData = {
        labels: analyticsData.topUsers.byLoginActivity.map(
            (user) => `${user.name} (${user.login_count})`
        ),
        datasets: [
            {
                label: "Login Count",
                data: analyticsData.topUsers.byLoginActivity.map(
                    (user) => user.login_count
                ),
                backgroundColor: "#3b82f6",
            },
        ],
    };

    const postsData = {
        labels: analyticsData.topUsers.byPosts.map((user) => `${user.username} (${user.post_count})`),
        datasets: [
            {
                label: "Posts Count",
                data: analyticsData.topUsers.byPosts.map((user) => user.post_count),
                backgroundColor: "#8b5cf6",
            },
        ],
    };

    // const followersData = {
    //     labels: analyticsData?.topUsers?.byFollowers.map((user) => `${user.username} (${user.followers_count})`),
    //     datasets: [
    //         {
    //             label: "Followers Count",
    //             data: analyticsData?.topUsers?.byFollowers.map(
    //                 (user) => user.followers_count
    //             ),
    //             backgroundColor: "#ec4899", 
    //         },
    //     ],
    // };


    console.table(analyticsData.topUsers.byfollowers);

    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-900 min-h-screen text-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Activity className="w-8 h-8 text-blue-500" />
                    <span className="bg-gradient-to-r from-red-500 to-purple-600 text-transparent bg-clip-text">
                        User Analytics Dashboard
                    </span>
                </h1>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 print:hidden"
                >
                    <Printer className="w-5 h-5" />
                    Print  </button>
            </div>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:bg-gray-700 transition-colors duration-300 flex">
                    <div className="flex-grow">
                        <h2 className="text-xl mb-2">Total Users</h2>
                        <p className="text-4xl font-bold">{analyticsData.overview.totalUsers}</p>
                    </div>
                    <Users className="w-16 h-16 text-blue-500 ml-4" />
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:bg-gray-700 transition-colors duration-300 flex">
                    <div className="flex-grow">
                        <h2 className="text-xl mb-2">Active Users</h2>
                        <p className="text-4xl font-bold">{analyticsData.overview.activeUsers}</p>
                    </div>
                    <UserCheck className="w-16 h-16 text-green-500 ml-4" />
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:bg-gray-700 transition-colors duration-300 flex">
                    <div className="flex-grow">
                        <h2 className="text-xl mb-2">2FA Enabled</h2>
                        <p className="text-4xl font-bold">{analyticsData.overview.twoFactorEnabledUsers}</p>
                    </div>
                    <Shield className="w-16 h-16 text-purple-500 ml-4" />
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:bg-gray-700 transition-colors duration-300 flex">
                    <div className="flex-grow">
                        <h2 className="text-xl mb-2">Total Posts</h2>
                        <p className="text-4xl font-bold">{analyticsData.overview.totalPosts}</p>
                    </div>
                    <Image className="w-16 h-16 text-red-500 ml-4" />
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">Role Distribution</h2>
                    <div className="h-[300px]">
                        <Pie
                            data={roleData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: "top",
                                        labels: { color: "#e5e7eb" },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">Profile Privacy</h2>
                    <div className="h-[300px]">
                        <Pie
                            data={privacyData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: "top",
                                        labels: { color: "#e5e7eb" },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">
                        User Status Distribution
                    </h2>
                    <div className="h-[300px]">
                        <Bar
                            data={statusData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                },
                                scales: {
                                    y: { grid: { color: "#374151" } },
                                    x: { grid: { color: "#374151" } },
                                },
                            }}
                        />
                    </div>
                </div>
{/* 
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">Top Users by Followers</h2>
                    <div className="h-[300px]">
                        <Bar
                            data={followersData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                },
                                scales: {
                                    y: {
                                        grid: { color: "#374151" },
                                        beginAtZero: true,
                                    },
                                    x: {
                                        grid: { color: "#374151" },
                                        ticks: { maxRotation: 45, minRotation: 45 },
                                    },
                                },
                            }}
                        />
                    </div>
                </div> */}

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">Top Users by Posts</h2>
                    <div className="h-[300px]">
                        <Bar
                            data={postsData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                },
                                scales: {
                                    y: {
                                        grid: { color: "#374151" },
                                        beginAtZero: true,
                                    },
                                    x: {
                                        grid: { color: "#374151" },
                                        ticks: { maxRotation: 45, minRotation: 45 },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">
                        Top Users by Login Activity
                    </h2>
                    <div className="h-[300px]">
                        <Bar
                            data={loginActivityData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                },
                                scales: {
                                    y: {
                                        grid: { color: "#374151" },
                                        beginAtZero: true,
                                    },
                                    x: {
                                        grid: { color: "#374151" },
                                        ticks: { maxRotation: 45, minRotation: 45 },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
