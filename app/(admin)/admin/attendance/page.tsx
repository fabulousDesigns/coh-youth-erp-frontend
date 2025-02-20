// app/(admin)/admin/attendance/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { AlertCircle, X, UserCheck, UserX } from "lucide-react";
import { format } from "date-fns";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { startOfMonth, endOfMonth } from 'date-fns';
import { Download } from 'lucide-react';

interface AttendanceRecord {
  id: number;
  volunteer: {
    id: number;
    name: string;
  };
  programCenter: {
    id: number;
    name: string;
  };
  date: string;
  status: "present" | "absent";
}

interface ProgramCenter {
  id: number;
  name: string;
  location: string;
}

export default function AdminAttendancePage() {
  useAuth("admin");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [centers, setCenters] = useState<ProgramCenter[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(true);

  useEffect(() => {
    fetchCenters();
  }, []);

  useEffect(() => {
    if (selectedCenter) {
      fetchAttendance();
    }
  }, [selectedDate, selectedCenter]);

  const fetchCenters = async () => {
    try {
      const { data } = await axiosInstance.get("/program-centers");
      setCenters(data);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load centers");
    }
  };

  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get("/attendance/report", {
        params: {
          date: format(selectedDate, "yyyy-MM-dd"),
          programCenterId: selectedCenter,
        },
      });
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

  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true);
      const startDate = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(selectedDate), 'yyyy-MM-dd');

      const response = await axiosInstance.get('/attendance/report/download', {
        params: {
          startDate,
          endDate,
          programCenterId: selectedCenter,
        },
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance-report-${format(selectedDate, 'MMMM-yyyy')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError('Failed to download report');
    } finally {
      setIsDownloading(false);
    }
  };

  const columns = [
    {
      key: "volunteer",
      title: "Volunteer",
      render: (record: AttendanceRecord) => (
        <div className="font-medium text-secondary-900">
          {record.volunteer.name}
        </div>
      ),
    },
    {
      key: "programCenter",
      title: "Program Center",
      render: (record: AttendanceRecord) => (
        <div className="text-secondary-600">{record.programCenter.name}</div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (record: AttendanceRecord) => (
        <div className="flex items-center">
          {record.status === "present" ? (
            <div className="flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700">
              <UserCheck className="w-4 h-4 mr-1" />
              Present
            </div>
          ) : (
            <div className="flex items-center px-2 py-1 rounded-full bg-red-50 text-red-700">
              <UserX className="w-4 h-4 mr-1" />
              Absent
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">
            Attendance Records
          </h1>
          <p className="text-secondary-600">
            View and manage attendance records
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
              variant="outline"
              onClick={fetchAttendance}
              disabled={!selectedCenter || isLoading}
          >
            Refresh
          </Button>
          <Button
              onClick={handleDownloadReport}
              disabled={!selectedCenter || isDownloading}
              className="bg-primary-600 hover:bg-primary-700"
          >
            {isDownloading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Downloading...
                </div>
            ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="ml-2 text-red-600">{error}</p>
          <Button
            onClick={() => setError("")}
            className="ml-auto text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Select Program Center
            </label>
            <select
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
              className="w-full px-3 py-2 border rounded-md border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a center</option>
              {centers.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name} - {center.location}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>
        </div>

        <div className="space-y-4">
          {!selectedCenter ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <UserCheck className="mx-auto h-12 w-12 text-secondary-400" />
              <h3 className="mt-2 text-sm font-semibold text-secondary-900">
                Select a Program Center
              </h3>
              <p className="mt-1 text-sm text-secondary-500">
                Choose a program center to view attendance records
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-primary-900 mb-4">
                  Attendance Summary for {format(selectedDate, "MMMM d, yyyy")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-md">
                    <div className="flex items-center">
                      <UserCheck className="w-5 h-5 text-green-700 mr-2" />
                      <p className="text-sm font-medium text-green-800">
                        Present
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      {attendance.filter((r) => r.status === "present").length}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-md">
                    <div className="flex items-center">
                      <UserX className="w-5 h-5 text-red-700 mr-2" />
                      <p className="text-sm font-medium text-red-800">Absent</p>
                    </div>
                    <p className="text-2xl font-bold text-red-900 mt-1">
                      {attendance.filter((r) => r.status === "absent").length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <DataTable data={attendance} columns={columns} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
