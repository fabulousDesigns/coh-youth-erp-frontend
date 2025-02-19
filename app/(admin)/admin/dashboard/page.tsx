"use client";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import {
  Building2,
  Users,
  Library,
  Clock,
  AlertCircle,
  X,
  ArrowRight,
  Building,
  GraduationCap,
  BookOpen,
  BarChart,
  Calendar,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface DashboardStats {
  totalCenters: number;
  totalVolunteers: number;
  totalMaterials: number;
  recentActivities: {
    action: string;
    timestamp: string;
    type: string;
  }[];
}

export default function AdminDashboard() {
  useAuth("admin");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get("/dashboard/admin/stats");
      setStats(data);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-sm text-secondary-600 animate-pulse">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
        <div className="px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary-900">
                Welcome back, {auth.getUser()?.name || "Admin"}
              </h1>
              <p className="mt-1 text-secondary-600">
                Here's what's happening today.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 rounded-lg border border-red-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError("")}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Program Centers"
          value={stats?.totalCenters || 0}
          description="Active locations"
          icon={Building}
          trend="+2 this month"
          trendType="positive"
          className="bg-gradient-to-br from-blue-50 to-white"
        />
        <StatCard
          title="Total Volunteers"
          value={stats?.totalVolunteers || 0}
          description="Registered volunteers"
          icon={GraduationCap}
          trend="+5 this week"
          trendType="positive"
          className="bg-gradient-to-br from-green-50 to-white"
        />
        <StatCard
          title="Library Materials"
          value={stats?.totalMaterials || 0}
          description="Available resources"
          icon={BookOpen}
          trend="+3 new uploads"
          trendType="positive"
          className="bg-gradient-to-br from-purple-50 to-white"
        />
      </div>

      {/* Activity and Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-secondary-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-primary-900">
                Recent Activities
              </h2>
              <Button variant="outline" size="default" onClick={fetchStats}>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="divide-y divide-secondary-100">
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="px-6 py-4 transition-colors hover:bg-secondary-50"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-lg bg-primary-50">
                      {activity.type === "library" && (
                        <BookOpen className="w-5 h-5 text-primary-600" />
                      )}
                      {activity.type === "attendance" && (
                        <Calendar className="w-5 h-5 text-primary-600" />
                      )}
                      {activity.type === "program" && (
                        <Building className="w-5 h-5 text-primary-600" />
                      )}
                      {!["library", "attendance", "program"].includes(
                        activity.type
                      ) && <FileText className="w-5 h-5 text-primary-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary-900">
                        {activity.action}
                      </p>
                      <p className="mt-1 text-xs text-secondary-500">
                        {new Date(activity.timestamp).toLocaleString(
                          undefined,
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }
                        )}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        activity.type === "library" &&
                          "bg-blue-50 text-blue-700",
                        activity.type === "attendance" &&
                          "bg-green-50 text-green-700",
                        activity.type === "program" &&
                          "bg-purple-50 text-purple-700",
                        !["library", "attendance", "program"].includes(
                          activity.type
                        ) && "bg-secondary-100 text-secondary-700"
                      )}
                    >
                      {activity.type}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <Clock className="mx-auto h-12 w-12 text-secondary-400" />
                <h3 className="mt-2 text-sm font-medium text-secondary-900">
                  No recent activities
                </h3>
                <p className="mt-1 text-sm text-secondary-500">
                  New activities will appear here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-secondary-200">
            <h2 className="font-semibold text-primary-900">Quick Stats</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {/* Volunteer Engagement */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-secondary-700">
                    Volunteer Engagement
                  </span>
                  <span className="text-sm font-semibold text-primary-600">
                    75%
                  </span>
                </div>
                <div className="h-2 bg-secondary-100 rounded-full">
                  <div
                    className="h-2 bg-primary-500 rounded-full"
                    style={{ width: "75%" }}
                  />
                </div>
              </div>

              {/* Resource Utilization */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-secondary-700">
                    Resource Utilization
                  </span>
                  <span className="text-sm font-semibold text-primary-600">
                    60%
                  </span>
                </div>
                <div className="h-2 bg-secondary-100 rounded-full">
                  <div
                    className="h-2 bg-primary-500 rounded-full"
                    style={{ width: "60%" }}
                  />
                </div>
              </div>

              {/* Center Activity */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-secondary-700">
                    Center Activity
                  </span>
                  <span className="text-sm font-semibold text-primary-600">
                    85%
                  </span>
                </div>
                <div className="h-2 bg-secondary-100 rounded-full">
                  <div
                    className="h-2 bg-primary-500 rounded-full"
                    style={{ width: "85%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
