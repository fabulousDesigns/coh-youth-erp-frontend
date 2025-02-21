"use client";
import { useState, useEffect } from "react";
import {
  Download,
  FileText,
  X,
  Search,
  Filter,
  BookOpen,
  FileBox,
  Clock,
  ChevronDown,
} from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Pagination from "@/components/pagination";

interface LibraryMaterial {
  id: number;
  name: string;
  type: string;
  uploadedBy: {
    name: string;
  };
  uploadDate: string;
  fileSize: number;
  originalName: string;
}

export default function VolunteerLibraryPage() {
  useAuth("volunteer");
  const [materials, setMaterials] = useState<LibraryMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data } = await axiosInstance.get("/library");
      setMaterials(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to load library materials"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (id: number, filename: string) => {
    try {
      setDownloadingId(id);
      const response = await axiosInstance.get(`/library/${id}/download`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to download file");
    } finally {
      setDownloadingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getTypeColor = (type: string) => {
    const colors = {
      pdf: "bg-red-100 text-red-700",
      doc: "bg-blue-100 text-blue-700",
      image: "bg-green-100 text-green-700",
      video: "bg-purple-100 text-purple-700",
      default: "bg-secondary-100 text-secondary-700",
    };
    return colors[type.toLowerCase() as keyof typeof colors] || colors.default;
  };

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.uploadedBy.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || material.type.toLowerCase() === selectedType;
    return matchesSearch && matchesType;
  });

  const paginatedMaterials = filteredMaterials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType]);

  const columns = [
    {
      key: "name",
      title: "Name",
      render: (item: LibraryMaterial) => (
        <div className="flex items-center">
          <div className="w-10 h-10 flex-shrink-0 bg-primary-50 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-600" />
          </div>
          <div className="ml-4">
            <div className="font-medium text-secondary-900">
              {item.originalName || item.name}
            </div>
            <div className="text-sm text-secondary-500">
              {item.type.toUpperCase()}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      title: "Type",
      render: (item: LibraryMaterial) => (
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            getTypeColor(item.type)
          )}
        >
          {item.type.toUpperCase()}
        </span>
      ),
    },
    {
      key: "uploadedBy",
      title: "Uploaded By",
      render: (item: LibraryMaterial) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-700">
              {item.uploadedBy?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="ml-3 font-medium text-secondary-900">
            {item.uploadedBy?.name || "System"}
          </span>
        </div>
      ),
    },
    {
      key: "uploadDate",
      title: "Upload Date",
      render: (item: LibraryMaterial) => (
        <div className="flex items-center text-secondary-500">
          <Clock className="w-4 h-4 mr-2" />
          <span>
            {new Date(item.uploadDate).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      ),
    },
    {
      key: "fileSize",
      title: "Size",
      render: (item: LibraryMaterial) => (
        <span className="text-secondary-500 font-mono">
          {formatFileSize(item.fileSize)}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-secondary-600 animate-pulse">
            Loading library materials...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl p-6 border border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary-900">
              Resource Library
            </h1>
            <p className="mt-1 text-secondary-600">
              Access and download educational materials
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-secondary-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none block w-40 pl-3 pr-10 py-2 border border-secondary-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         bg-white"
              >
                <option value="all">All Types</option>
                <option value="pdf">PDF</option>
                <option value="doc">DOC</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-secondary-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError("")}
              className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
        {materials.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-16 w-16 text-secondary-400" />
            <h3 className="mt-4 text-lg font-medium text-secondary-900">
              No materials available
            </h3>
            <p className="mt-2 text-secondary-500">
              Check back later for new resources.
            </p>
          </div>
        ) : (
          <div>
            <DataTable
              data={paginatedMaterials}
              columns={columns}
              actions={(item: LibraryMaterial) => (
                <Button
                  variant="outline"
                  onClick={() =>
                    handleDownload(item.id, item.originalName || item.name)
                  }
                  disabled={downloadingId === item.id}
                  className="text-primary-600 hover:text-primary-700 border-primary-200 hover:border-primary-300 hover:bg-primary-50"
                >
                  {downloadingId === item.id ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                      <span>Downloading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </div>
                  )}
                </Button>
              )}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              totalItems={filteredMaterials.length}
              showItemsPerPage={true}
              className="border-t border-secondary-200"
            />
          </div>
        )}
      </div>
    </div>
  );
}
