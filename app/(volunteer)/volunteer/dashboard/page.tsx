"use client"
import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import {
  Building2,
  Library,
  CalendarCheck,
  Clock,
  ArrowUp,
  BookOpen,
  Users,
  Calendar,
  BarChart,
  Loader2,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { auth } from "@/lib/auth";

interface VolunteerDashboardStats {
  assignedCenter: string;
  totalAttendance: number;
  libraryAccess: number;
  recentActivities: {
    action: string;
    timestamp: string;
    type?: string;
  }[];
}

export default function VolunteerDashboard() {
  const [stats, setStats] = useState<VolunteerDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get("/dashboard/volunteer/stats");
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
          <p className="text-secondary-600 text-sm">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-xl border border-red-100">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <ArrowUp className="w-6 h-6 text-red-600 transform rotate-45" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-red-800">
              Error Loading Dashboard
            </h2>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const getActivityIcon = (type: string = "default") => {
    const icons = {
      library: <BookOpen className="h-5 w-5 text-blue-500" />,
      attendance: <Users className="h-5 w-5 text-green-500" />,
      schedule: <Calendar className="h-5 w-5 text-purple-500" />,
      default: <Clock className="h-5 w-5 text-primary-500" />,
    };
    return icons[type as keyof typeof icons] || icons.default;
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl p-8 border border-secondary-200">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-primary-900 sm:text-4xl">
            Welcome Back,{" "}
            <span className="text-primary-600">
              {auth.getUser()?.name || "Volunteer"}
            </span>
          </h1>
          <p className="mt-4 text-lg text-secondary-600">
            Track your volunteer activities and contributions to the community
          </p>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Assigned Center"
          value={stats?.assignedCenter || "N/A"}
          icon={Building2}
          description="Your current assignment"
          trend="+2 months"
          className="bg-gradient-to-br from-blue-50 to-white"
        />
        <StatCard
          title="Days Present"
          value={stats?.totalAttendance || 0}
          icon={CalendarCheck}
          description="Total attendance days"
          trend="+5 this month"
          className="bg-gradient-to-br from-green-50 to-white"
        />
        <StatCard
          title="Library Materials"
          value={stats?.libraryAccess || 0}
          icon={Library}
          description="Resources accessed"
          trend="+12 new items"
          className="bg-gradient-to-br from-purple-50 to-white"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
          <div className="p-6 border-b border-secondary-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary-900">
                Recent Activities
              </h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700">
                Last 7 days
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {stats?.recentActivities.map((activity, index) => (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index !== stats.recentActivities.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-secondary-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-white flex items-center justify-center ring-8 ring-white border border-secondary-200">
                            {getActivityIcon(activity.type)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-secondary-900 font-medium">
                            {activity.action}
                          </div>
                          <div className="mt-1 text-sm text-secondary-500">
                            <time dateTime={activity.timestamp}>
                              {new Date(activity.timestamp).toLocaleString()}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
          <div className="p-6 border-b border-secondary-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary-900">
                Performance Metrics
              </h2>
              <button className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors">
                <BarChart className="w-4 h-4 mr-1" />
                View Details
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* Attendance Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-secondary-700">
                    Attendance Rate
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

              {/* Resource Utilization */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-secondary-700">
                    Resource Utilization
                  </span>
                  <span className="text-sm font-semibold text-primary-600">
                    72%
                  </span>
                </div>
                <div className="h-2 bg-secondary-100 rounded-full">
                  <div
                    className="h-2 bg-primary-500 rounded-full"
                    style={{ width: "72%" }}
                  />
                </div>
              </div>

              {/* Engagement Score */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-secondary-700">
                    Engagement Score
                  </span>
                  <span className="text-sm font-semibold text-primary-600">
                    90%
                  </span>
                </div>
                <div className="h-2 bg-secondary-100 rounded-full">
                  <div
                    className="h-2 bg-primary-500 rounded-full"
                    style={{ width: "90%" }}
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
