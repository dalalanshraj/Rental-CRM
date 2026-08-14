import { useEffect, useState } from "react";
import api from "../../api/axios";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import {
  Users,
  Building2,
  Handshake,
  CalendarCheck,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";

export default function Dashboard() {
  // =========================================
  // STATE
  // =========================================

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // FETCH DASHBOARD
  // =========================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/dashboard");

      console.log("Dashboard API =>", res.data);

      setDashboard(res.data);
    } catch (err) {
      console.error("Dashboard error =>", err);

      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 w-40 bg-gray-200 rounded-lg mb-3" />

          <div className="h-4 w-72 bg-gray-200 rounded-lg mb-8" />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-2xl p-5 h-36">
                <div className="h-10 w-10 bg-gray-200 rounded-xl mb-5" />

                <div className="h-3 w-24 bg-gray-200 rounded mb-2" />

                <div className="h-7 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-2xl border border-red-100 p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Unable to load dashboard
          </h2>

          <p className="text-sm text-red-500 mb-5">{error}</p>

          <button
            onClick={fetchDashboard}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================================
  // SAFETY
  // =========================================

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] p-8">
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-gray-500">No dashboard data available.</p>
        </div>
      </div>
    );
  }

  // =========================================
  // BACKEND DATA
  // =========================================

  const statsData = dashboard.stats || {};

  const monthlyData = dashboard.monthlyData || [];

  const leadStatusData = dashboard.leadStatusData || [];

  const dealData = dashboard.dealPipeline || [];

  const activities = dashboard.recentActivities || [];

  // =========================================
  // STAT CARDS
  // =========================================

  const stats = [
    {
      title: "Total Leads",
      value: statsData.totalLeads ?? 0,
      change: statsData.leadsChange || "",
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },

    // {
    //   title: "Active Deals",
    //   value: statsData.activeDeals ?? 0,
    //   change: statsData.dealsChange || "",
    //   icon: Handshake,
    //   iconBg: "bg-purple-100",
    //   iconColor: "text-purple-600",
    // },

    {
      title: "Organizations",
      value: statsData.totalOrganizations ?? 0,
      change: statsData.organizationsChange || "",
      icon: Building2,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },

    {
      title: "Activities",
      value: statsData.totalActivities ?? 0,
      change: statsData.activitiesChange || "",
      icon: CalendarCheck,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  // =========================================
  // PIE COLORS
  // =========================================

  const pieColors = [
    "#3b82f6",
    "#8b5cf6",
    "#f59e0b",
    "#22c55e",
    "#ef4444",
    "#06b6d4",
  ];

  // =========================================
  // TOTAL LEADS FOR CENTER
  // =========================================

  const totalLeadStatus = leadStatusData.reduce(
    (total, item) => total + Number(item.value || 0),
    0,
  );

  // =========================================
  // RETURN
  // =========================================

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-4 sm:p-6 lg:p-8">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's what's happening with your CRM.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboard}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 shadow-sm hover:border-blue-400 hover:text-blue-600 transition"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* =========================================
          STAT CARDS
      ========================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.iconBg}`}
                >
                  <Icon size={22} className={stat.iconColor} />
                </div>

                {stat.change && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                    <ArrowUpRight size={14} />

                    {stat.change}
                  </div>
                )}
              </div>

              <div className="mt-5">
                <p className="text-sm text-gray-500">{stat.title}</p>

                <h2 className="text-3xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </h2>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================
          MAIN GRAPH + PIE
      ========================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* =====================================
            LEADS & DEALS GRAPH
        ===================================== */}

        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Leads & Deals
              </h2>

              <p className="text-sm text-gray-500 mt-1">Growth overview</p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Leads
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                Deals
              </div>
            </div>
          </div>

          <div className="w-full h-[320px]">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient
                      id="leadGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#3b82f6"
                        stopOpacity={0.25}
                      />

                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>

                    <linearGradient
                      id="dealGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />

                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eef0f4"
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "#9ca3af",
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "#9ca3af",
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #eee",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="leads"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#leadGradient)"
                  />

                  <Area
                    type="monotone"
                    dataKey="deals"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fill="url(#dealGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    No monthly data available
                  </p>

                  <p className="text-xs text-gray-300 mt-1">
                    Dashboard graph will appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =====================================
            LEAD STATUS CIRCLE
        ===================================== */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Lead Status
              </h2>

              <p className="text-sm text-gray-500 mt-1">Current pipeline</p>
            </div>

            <button className="p-2 rounded-lg hover:bg-gray-100">
              <MoreHorizontal size={19} className="text-gray-500" />
            </button>
          </div>

          <div className="h-[250px] relative">
            {leadStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={72}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {leadStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-400">No lead status data</p>
              </div>
            )}

            {/* CENTER */}

            {leadStatusData.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-gray-800">
                  {totalLeadStatus}
                </span>

                <span className="text-xs text-gray-500">Total Leads</span>
              </div>
            )}
          </div>

          {/* LEGEND */}

          <div className="grid grid-cols-2 gap-3 mt-2">
            {leadStatusData.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: pieColors[index % pieColors.length],
                    }}
                  />

                  <span className="text-gray-600">{item.name}</span>
                </div>

                <span className="font-semibold text-gray-800">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================
          SECOND ROW
      ========================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* =====================================
            DEAL PIPELINE
        ===================================== */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-800">
              Deal Pipeline
            </h2>

            <p className="text-sm text-gray-500 mt-1">Deals by stage</p>
          </div>

          <div className="h-[300px]">
            {dealData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dealData} barSize={32}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eef0f4"
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "#6b7280",
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "#9ca3af",
                    }}
                  />

                  <Tooltip
                    cursor={{
                      fill: "#f8fafc",
                    }}
                  />

                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-400">No deal pipeline data</p>
              </div>
            )}
          </div>
        </div>

        {/* =====================================
            RECENT ACTIVITIES
        ===================================== */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Activities
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your upcoming activities
              </p>
            </div>

            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
              View all
            </button>
          </div>

          <div className="space-y-3">
            {activities.length > 0 ? (
              activities.map((activity, index) => {
                const isCompleted = activity.status === "completed";

                return (
                  <div
                    key={activity._id || index}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
                  >
                    {/* ICON */}

                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isCompleted ? "bg-green-100" : "bg-blue-100"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={19} className="text-green-600" />
                      ) : (
                        <Clock size={19} className="text-blue-600" />
                      )}
                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {activity.title}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {activity.type}
                        </span>

                        <span className="text-gray-300">•</span>

                        <span className="text-xs text-gray-500">
                          {activity.startTime || activity.dueDate || "No time"}
                        </span>
                      </div>
                    </div>

                    {/* STATUS */}

                    <span
                      className={`hidden sm:inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium ${
                        isCompleted
                          ? "bg-green-50 text-green-600"
                          : "bg-orange-50 text-orange-600"
                      }`}
                    >
                      {activity.status || "pending"}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="py-10 text-center">
                <CalendarCheck
                  size={30}
                  className="mx-auto text-gray-300 mb-3"
                />

                <p className="text-sm text-gray-400">No recent activities</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
