"use client";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  AlertCircle,
  CalendarDays,
  UserCheck,
  UserX,
  Clock,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
// Date utilities would be imported in a real app
const format = (date: Date, format: string) => date.toLocaleDateString();
const isToday = (date: Date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};
const isFuture = (date: Date) => date > new Date();
const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0);
import { AttendanceStatus, AttendanceRecord } from "@/types/attendance";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function VolunteerAttendancePage() {
  useAuth("volunteer");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get("/attendance/volunteer");
      setAttendance(data);
      setError("");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to load attendance records"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const markAttendance = async (status: AttendanceStatus) => {
    if (isFuture(selectedDate)) {
      setError("Cannot mark attendance for future dates");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await axiosInstance.post("/attendance/mark", {
        date: format(selectedDate, "yyyy-MM-dd"),
        status,
      });
      await fetchAttendance();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to mark attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAttendanceForDate = (date: Date) => {
    return attendance.find(
      (a) =>
        format(new Date(a.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  const getMonthlyStats = () => {
    const startDate = startOfMonth(selectedDate);
    const endDate = endOfMonth(selectedDate);
    const monthlyAttendance = attendance.filter((a) => {
      const date = new Date(a.date);
      return date >= startDate && date <= endDate;
    });

    const present = monthlyAttendance.filter(
      (a) => a.status === AttendanceStatus.PRESENT
    ).length;
    const absent = monthlyAttendance.filter(
      (a) => a.status === AttendanceStatus.ABSENT
    ).length;
    const total = monthlyAttendance.length;
    const attendanceRate = total > 0 ? (present / total) * 100 : 0;

    return {
      present,
      absent,
      total,
      attendanceRate,
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-secondary-600 animate-pulse">
            Loading attendance records...
          </p>
        </div>
      </div>
    );
  }

  const monthlyStats = getMonthlyStats();
  const existingAttendance = getAttendanceForDate(selectedDate);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl p-6 border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary-900">
              Attendance Tracker
            </h1>
            <p className="mt-1 text-secondary-600">
              Keep track of your daily attendance and view monthly statistics
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Present</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Absent</span>
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

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Calendar Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              markedDates={attendance.map((a) => new Date(a.date))}
            />
          </div>

          {/* Monthly Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-green-600">
                    {monthlyStats.present}
                  </p>
                  <p className="text-sm font-medium text-secondary-600">
                    Present Days
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-red-600">
                    {monthlyStats.absent}
                  </p>
                  <p className="text-sm font-medium text-secondary-600">
                    Absent Days
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <UserX className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-primary-600">
                    {monthlyStats.attendanceRate.toFixed(1)}%
                  </p>
                  <p className="text-sm font-medium text-secondary-600">
                    Attendance Rate
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Marking Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
            <div className="p-6 border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary-900">
                  Mark Attendance
                </h3>
                <span className="text-sm text-secondary-500">
                  {format(selectedDate, "MMMM d, yyyy")}
                </span>
              </div>
            </div>

            <div className="p-6">
              {isFuture(selectedDate) ? (
                <div className="bg-secondary-50 rounded-lg p-4 flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-secondary-400" />
                  <p className="text-sm text-secondary-600">
                    Cannot mark attendance for future dates
                  </p>
                </div>
              ) : existingAttendance ? (
                <div
                  className={cn(
                    "rounded-lg p-4 flex items-center space-x-3",
                    existingAttendance.status === AttendanceStatus.PRESENT
                      ? "bg-green-50"
                      : "bg-red-50"
                  )}
                >
                  {existingAttendance.status === AttendanceStatus.PRESENT ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      Marked as{" "}
                      <span
                        className={cn(
                          "capitalize",
                          existingAttendance.status === AttendanceStatus.PRESENT
                            ? "text-green-700"
                            : "text-red-700"
                        )}
                      >
                        {existingAttendance.status}
                      </span>
                    </p>
                    <p className="text-xs text-secondary-500">
                      {format(new Date(existingAttendance.date), "hh:mm a")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button
                    onClick={() => markAttendance(AttendanceStatus.PRESENT)}
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Marking Present...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Check className="w-4 h-4" />
                        <span>Mark as Present</span>
                      </div>
                    )}
                  </Button>

                  <Button
                    onClick={() => markAttendance(AttendanceStatus.ABSENT)}
                    disabled={isSubmitting}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Marking Absent...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <X className="w-4 h-4" />
                        <span>Mark as Absent</span>
                      </div>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Today's Quick Actions */}
          {isToday(selectedDate) && !existingAttendance && (
            <div className="bg-primary-50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-medium text-primary-900">
                    Mark Today's Attendance
                  </h4>
                  <p className="text-sm text-primary-600">
                    Don't forget to mark your attendance
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-primary-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
