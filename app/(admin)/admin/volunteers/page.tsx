// app/(admin)/admin/volunteers/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, AlertCircle, X } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import Pagination from "@/components/pagination";

interface Volunteer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  programCenter: {
    id: number;
    name: string;
  } | null;
  createdAt: string;
}

interface ProgramCenter {
  id: number;
  name: string;
}

export default function VolunteersPage() {
  useAuth("admin");
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [centers, setCenters] = useState<ProgramCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const paginatedVolunteers = volunteers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(volunteers.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [volunteers.length]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    programCenterId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [volunteersRes, centersRes] = await Promise.all([
        axiosInstance.get("/users/volunteers"),
        axiosInstance.get("/program-centers"),
      ]);
      setVolunteers(volunteersRes.data);
      setCenters(centersRes.data);
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
      const submissionData = {
        ...formData,
        programCenterId: formData.programCenterId
          ? parseInt(formData.programCenterId)
          : null,
        phone: formData.phone.trim() || null,
      };

      if (modalMode === "create") {
        await axiosInstance.post("/users/volunteers", submissionData);
      } else {
        const { password, ...updateData } = submissionData;
        await axiosInstance.put(
          `/users/volunteers/${selectedVolunteer?.id}`,
          updateData
        );
      }
      await fetchData();
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save volunteer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this volunteer?")) return;

    try {
      await axiosInstance.delete(`/users/volunteers/${id}`);
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete volunteer");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      programCenterId: "",
    });
    setSelectedVolunteer(null);
    setError("");
  };

  const columns = [
    {
      key: "name",
      title: "Name",
      render: (volunteer: Volunteer) => (
        <div>
          <p className="font-medium text-primary-900">{volunteer.name}</p>
          <p className="text-sm text-secondary-500">{volunteer.email}</p>
        </div>
      ),
    },
    {
      key: "programCenter",
      title: "Program Center",
      render: (volunteer: Volunteer) => (
        <span
          className={`text-secondary-600 ${
            !volunteer.programCenter ? "italic" : ""
          }`}
        >
          {volunteer.programCenter?.name || "Not assigned"}
        </span>
      ),
    },
    {
      key: "phone",
      title: "Phone",
      render: (volunteer: Volunteer) => (
        <span
          className={`text-secondary-600 ${!volunteer.phone ? "italic" : ""}`}
        >
          {volunteer.phone || "N/A"}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Volunteers</h1>
          <p className="text-secondary-600">
            Manage volunteer accounts and assignments
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={fetchData} disabled={isLoading}>
            Refresh
          </Button>
          <Button
            onClick={() => {
              setModalMode("create");
              setIsModalOpen(true);
            }}
            className="
                flex
                items-center
                focus:ring-offset-2
                transition-all
                duration-200
                text-sm
              "
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Volunteer
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

      <div className="bg-white rounded-lg shadow-sm">
        <DataTable
          data={paginatedVolunteers}
          columns={columns}
          actions={(volunteer: Volunteer) => (
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setModalMode("edit");
                  setSelectedVolunteer(volunteer);
                  setFormData({
                    name: volunteer.name,
                    email: volunteer.email,
                    password: "",
                    phone: volunteer.phone || "",
                    programCenterId:
                      volunteer.programCenter?.id?.toString() || "",
                  });
                  setIsModalOpen(true);
                }}
                className="flex items-center px-3 py-2 border border-blue-200 rounded-md text-blue-600 hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDelete(volunteer.id)}
                className="flex items-center px-3 py-2 border border-red-200 rounded-md text-red-600 hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 text-sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        />
        {/* Add Pagination component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          totalItems={volunteers.length}
          showItemsPerPage={true}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={modalMode === "create" ? "Add Volunteer" : "Edit Volunteer"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          {modalMode === "create" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-700">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required={modalMode === "create"}
                minLength={6}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700">
              Program Center
            </label>
            <select
              value={formData.programCenterId}
              onChange={(e) =>
                setFormData({ ...formData, programCenterId: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Not assigned</option>
              {centers.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
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
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {modalMode === "create" ? "Creating..." : "Saving..."}
                </div>
              ) : modalMode === "create" ? (
                "Create Volunteer"
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
