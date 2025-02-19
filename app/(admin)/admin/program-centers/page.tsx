"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  X,
  Building2,
  MapPin,
  Mail,
  Search,
  RefreshCw,
  User,
  ChevronDown,
} from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface ProgramCenter {
  id: number;
  name: string;
  location: string;
  coordinator: {
    id: number;
    name: string;
    email: string;
  };
}

interface Volunteer {
  id: number;
  name: string;
  email: string;
}

export default function ProgramCentersPage() {
  useAuth("admin");
  const [centers, setCenters] = useState<ProgramCenter[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedCenter, setSelectedCenter] = useState<ProgramCenter | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    coordinatorId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [centersRes, volunteersRes] = await Promise.all([
        axiosInstance.get("/program-centers"),
        axiosInstance.get("/users/volunteers"),
      ]);
      setCenters(centersRes.data);
      setVolunteers(volunteersRes.data);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalMode === "add") {
        await axiosInstance.post("/program-centers", formData);
      } else {
        await axiosInstance.patch(
          `/program-centers/${selectedCenter?.id}`,
          formData
        );
      }
      await fetchData();
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save program center");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this program center?"))
      return;

    try {
      await axiosInstance.delete(`/program-centers/${id}`);
      await fetchData();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to delete program center"
      );
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      coordinatorId: "",
    });
    setSelectedCenter(null);
    setError("");
  };

  const filteredCenters = centers.filter(
    (center) =>
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.coordinator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      title: "Center Name",
      render: (item: ProgramCenter) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary-50">
            <Building2 className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-secondary-900">{item.name}</p>
            <div className="flex items-center mt-1 text-sm text-secondary-500">
              <MapPin className="h-3 w-3 mr-1" />
              {item.location}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "coordinator",
      title: "Coordinator",
      render: (item: ProgramCenter) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-secondary-100">
            <span className="text-sm font-medium text-secondary-600">
              {item.coordinator.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-secondary-900">
              {item.coordinator.name}
            </p>
            <div className="flex items-center mt-1 text-sm text-secondary-500">
              <Mail className="h-3 w-3 mr-1" />
              {item.coordinator.email}
            </div>
          </div>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-sm text-secondary-600 animate-pulse">
            Loading program centers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
        <div className="px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary-900">
                Program Centers
              </h1>
              <p className="mt-1 text-secondary-600">
                Manage your program centers and coordinators
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchData}
                disabled={isLoading}
                className="
          flex 
          items-center 
          px-3 
          py-2 
          border 
          border-gray-300 
          rounded-full 
          text-blue-600 
          hover:bg-gray-50 
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500 
          focus:ring-offset-2
          disabled:opacity-50 
          disabled:cursor-not-allowed
          transition-all 
          duration-200
          text-sm
        "
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="
          flex 
          items-center 
          px-3 
          py-2 
          bg-blue-600 
          text-white 
          rounded-full 
          hover:bg-blue-700 
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500 
          focus:ring-offset-2
          transition-all 
          duration-200
          text-sm
        "
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Center
              </button>
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

      {/* Search and Table Section */}
      <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
        <div className="border-b border-secondary-200 px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
            <input
              type="text"
              placeholder="Search centers, locations, or coordinators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-secondary-200 pl-9 pr-4 py-2 text-sm
                       focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        <DataTable
          data={filteredCenters}
          columns={columns}
          actions={(item: ProgramCenter) => (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setModalMode("edit");
                  setSelectedCenter(item);
                  setFormData({
                    name: item.name,
                    location: item.location,
                    coordinatorId: item.coordinator.id.toString(),
                  });
                  setIsModalOpen(true);
                }}
                className="
                flex 
                items-center 
                px-3 
                py-2 
                border 
                border-blue-200 
                rounded-md 
                text-blue-600 
                hover:border-blue-300 
                hover:bg-blue-50 
                focus:outline-none 
                focus:ring-2 
                focus:ring-blue-500 
                focus:ring-offset-2
                transition-all 
                duration-200
                text-sm
              "
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDelete(item.id)}
                className="
                flex 
                items-center 
                px-3 
                py-2 
                border 
                border-red-200 
                rounded-md 
                text-red-600 
                hover:border-red-300 
                hover:bg-red-50 
                focus:outline-none 
                focus:ring-2 
                focus:ring-red-500 
                focus:ring-offset-2
                transition-all 
                duration-200
                text-sm
              "
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={
          modalMode === "add" ? "Add Program Center" : "Edit Program Center"
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-700">
                Center Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-secondary-200 pl-9 pr-4 py-2
                           focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter center name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-700">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full rounded-lg border border-secondary-200 pl-9 pr-4 py-2
                           focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter location"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-700">
                Coordinator
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                <select
                  value={formData.coordinatorId}
                  onChange={(e) =>
                    setFormData({ ...formData, coordinatorId: e.target.value })
                  }
                  className="w-full rounded-lg border border-secondary-200 pl-9 pr-4 py-2 appearance-none
                           focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  required
                >
                  <option value="">Select a coordinator</option>
                  {volunteers.map((volunteer) => (
                    <option key={volunteer.id} value={volunteer.id}>
                      {volunteer.name} ({volunteer.email})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-secondary-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {modalMode === "add" ? "Adding..." : "Saving..."}
                </div>
              ) : modalMode === "add" ? (
                <div
                  className="
                flex
                items-center 
                rounded-full 
                text-white-600 
                focus:outline-none 
                focus:ring-2 
                focus:ring-blue-500 
                focus:ring-offset-2
                transition-all 
                duration-200
                text-sm
              "
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Center
                </div>
              ) : (
                <>
                  <Pencil className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
