// app/(admin)/admin/library/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Download, Trash2, AlertCircle, X, FileText } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

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

export default function AdminLibraryPage() {
  useAuth("admin");
  const [materials, setMaterials] = useState<LibraryMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get("/library");
      setMaterials(data);
      setError("");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to load library materials"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsUploading(true);
      setError("");
      await axiosInstance.post("/library/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchMaterials();
      setIsModalOpen(false);
      setSelectedFile(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    try {
      await axiosInstance.delete(`/library/${id}`);
      await fetchMaterials();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete material");
    }
  };

  const handleDownload = async (id: number, filename: string) => {
    try {
      setDownloadingId(id);
      const response = await axiosInstance.get(`/library/${id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to download file");
    } finally {
      setDownloadingId(null);
    }
  };

  const getFileTypeIcon = (type: string) => {
    const iconClass = "w-6 h-6";
    switch (type.toLowerCase()) {
      case "document":
        return <FileText className={`${iconClass} text-blue-500`} />;
      case "spreadsheet":
        return <FileText className={`${iconClass} text-green-500`} />;
      case "presentation":
        return <FileText className={`${iconClass} text-orange-500`} />;
      case "image":
        return <FileText className={`${iconClass} text-purple-500`} />;
      default:
        return <FileText className={`${iconClass} text-gray-500`} />;
    }
  };

  const columns = [
    {
      key: "name",
      title: "Name",
      render: (item: LibraryMaterial) => (
        <div className="flex items-center space-x-3">
          {getFileTypeIcon(item.type)}
          <div>
            <p className="font-medium text-primary-900">
              {item.originalName || item.name}
            </p>
            <p className="text-sm text-secondary-500 capitalize">{item.type}</p>
          </div>
        </div>
      ),
    },
    {
      key: "uploadedBy",
      title: "Uploaded By",
      render: (item: LibraryMaterial) => (
        <span className="font-medium text-secondary-900">
          {item.uploadedBy.name}
        </span>
      ),
    },
    {
      key: "uploadDate",
      title: "Upload Date",
      render: (item: LibraryMaterial) => (
        <span className="text-secondary-600">
          {new Date(item.uploadDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "fileSize",
      title: "Size",
      render: (item: LibraryMaterial) => (
        <span className="text-secondary-600">
          {formatFileSize(item.fileSize)}
        </span>
      ),
    },
  ];

  // ... continuing app/(admin)/admin/library/page.tsx

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
          <h1 className="text-2xl font-bold text-primary-900">Library</h1>
          <p className="text-secondary-600">
            Manage educational materials and resources
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={fetchMaterials}
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
            Refresh
          </Button>
          <Button
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
            Upload Material
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
        {materials.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-secondary-400" />
            <h3 className="mt-2 text-sm font-semibold text-secondary-900">
              No materials
            </h3>
            <p className="mt-1 text-sm text-secondary-500">
              Upload some materials to get started
            </p>
            <div className="mt-6">
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Upload Material
              </Button>
            </div>
          </div>
        ) : (
          <DataTable
            data={materials}
            columns={columns}
            actions={(item: LibraryMaterial) => (
              <div className="flex items-center justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    handleDownload(item.id, item.originalName || item.name)
                  }
                  disabled={downloadingId === item.id}
                >
                  {downloadingId === item.id ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 px-3 py-2 border-primary-600 border-t-transparent rounded-full animate-spin mr-2" />
                      Downloading...
                    </div>
                  ) : (
                    <div
                      className="
                    flex 
                    items-center 
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
                    rounded-full
                  "
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </div>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex 
                items-center 
                px-3 
                py-2 
                border 
                border-red-200 
                rounded-full
                text-red-600 
                hover:border-red-300 
                hover:bg-red-50 
                focus:outline-none 
                focus:ring-2 
                focus:ring-red-500 
                focus:ring-offset-2
                transition-all 
                duration-200
                text-sm"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFile(null);
          setError("");
        }}
        title="Upload Material"
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          <FileUpload
            onFileSelect={setSelectedFile}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
            maxSize={5}
          />

          <div className="flex justify-end roundend-full space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedFile(null);
                setError("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading...
                </div>
              ) : (
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
                  Upload
                </div>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
