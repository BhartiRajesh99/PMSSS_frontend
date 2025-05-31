import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import axios from "axios";
import { FaUpload, FaTrash, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  DocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import BackButton from "../components/BackButton";

const API_BASE_URL = "https://pmsss-backend.vercel.app/api"; // Add base URL

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState("fee_receipt");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setUploading(true);

      try {
        // Log file details for debugging
        console.log("Uploading file:", {
          name: file.name,
          type: file.type,
          size: file.size,
          documentType: selectedType,
        });

        const formData = new FormData();
        formData.append("document", file);
        formData.append("type", selectedType);

        // Log FormData contents
        for (let pair of formData.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }

        const response = await axios.post(
          `${API_BASE_URL}/documents/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Upload response:", response.data);

        if (response.data) {
          setDocuments((prevDocs) => [...prevDocs, response.data]);
          toast.success(
            `Document "${response.data.fileName}" uploaded successfully!`
          );
        }
      } catch (error) {
        console.error("Upload error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        toast.error(
          error.response?.data?.error ||
            error.message ||
            "Error uploading document"
        );
      } finally {
        setUploading(false);
      }
    },
    [selectedType]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: handleDrop,
    onDropRejected: (rejectedFiles) => {
      console.log("Rejected files:", rejectedFiles);
      const errors = rejectedFiles[0]?.errors || [];
      const errorMessage = errors.map((err) => err.message).join(", ");
      toast.error(
        errorMessage || "File rejected. Please check file type and size."
      );
    },
  });

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/student/documents`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Ensure response.data is an array
      const docs = Array.isArray(response.data.data) ? response.data.data : [];
      setDocuments(docs);

      const stats = {
        total: response?.data?.data.length,
        pending: response?.data?.data.filter((doc) => doc.status === "pending").length,
        verified: response?.data?.data.filter((doc) => doc.status === "verified")
          .length,
        rejected: response?.data?.data.filter((doc) => doc.status === "rejected")
          .length,
      };

      setStats(stats);

    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error(error.response?.data?.error || "Error fetching documents");
      setDocuments([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = useCallback(async (id) => {
    try {
      // Confirm deletion
      if (!window.confirm("Are you sure you want to delete this document?")) {
        return;
      }

      // Show loading state
      const docElement = document.querySelector(`[data-doc-id="${id}"]`);
      if (docElement) {
        docElement.classList.add("opacity-50");
      }

      const response = await axios.delete(`${API_BASE_URL}/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setDocuments((prevDocs) => prevDocs.filter((doc) => doc._id !== id));
        toast.success("Document deleted successfully");
      } else {
        throw new Error(response.data.message || "Failed to delete document");
      }
    } catch (error) {
      console.error("Delete error:", error);

      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        const message =
          error.response.data?.message || error.response.data?.error;

        switch (status) {
          case 401:
            toast.error("You are not authorized to delete this document");
            break;
          case 403:
            toast.error("You don't have permission to delete this document");
            break;
          case 404:
            toast.error("Document not found");
            break;
          case 500:
            toast.error("Server error while deleting document");
            break;
          default:
            toast.error(message || "Error deleting document");
        }
      } else if (error.request) {
        toast.error("No response from server. Please check your connection");
      } else {
        toast.error(error.message || "An unexpected error occurred");
      }
    } finally {
      // Remove loading state
      const docElement = document.querySelector(`[data-doc-id="${id}"]`);
      if (docElement) {
        docElement.classList.remove("opacity-50");
      }
    }
  }, []);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "verified":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  // Ensure documents is an array before rendering
  const documentsList = Array.isArray(documents) ? documents : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BackButton />
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with top padding to account for fixed header */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Student Dashboard
            </h1>
            <p className="text-gray-600 text-center">
              Manage your documents and track their status
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 bg-indigo-50 rounded-lg">
                    <DocumentCheckIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Documents
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {stats.total}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 bg-yellow-50 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {stats.pending}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 bg-green-50 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Verified
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {stats.verified}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 bg-red-50 rounded-lg">
                    <XCircleIcon className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Rejected
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {stats.rejected}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload Document
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              >
                <option value="fee_receipt">Fee Receipt</option>
                <option value="attendance_certificate">
                  Attendance Certificate
                </option>
                <option value="marksheet">Marksheet</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
                ${
                  isDragActive
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                }`}
            >
              <input {...getInputProps()} />
              <FaUpload className="mx-auto text-4xl text-gray-400 mb-4" />
              {uploading ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin text-indigo-600 mr-2" />
                  <span className="text-gray-600">Uploading...</span>
                </div>
              ) : isDragActive ? (
                <p className="text-indigo-600 font-medium">
                  Drop the file here...
                </p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2 text-center font-medium">
                    Drag and drop a file here, or click to select
                  </p>
                  <p className="text-sm text-center text-gray-500">
                    Supported formats: PNG, JPG, JPEG, PDF (max 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Documents
            </h2>
            {documentsList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No documents uploaded yet.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {documentsList.map((doc) => (
                  <div
                    key={doc._id}
                    data-doc-id={doc._id}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-900 capitalize">
                        {doc.type.replace("_", " ")}
                      </h3>
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                        title="Delete document"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{doc.fileName}</p>
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                          doc.status === "verified"
                            ? "bg-green-100 text-green-800"
                            : doc.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {doc.status}
                      </span>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-200"
                      >
                        View
                      </a>
                    </div>
                    {doc.remarks && (
                      <p className="text-sm text-gray-500 mt-3 border-t border-gray-100 pt-3">
                        {doc.remarks}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
