import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import {
  DocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import BackButton from "../components/BackButton";

export default function SAGDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [processingAction, setProcessingAction] = useState(null);
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

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        "https://pmsss-backend.vercel.app/api/verify/pending"
      );
      if (response.data && Array.isArray(response.data)) {
        setDocuments(response.data);
        // Calculate stats

        const stats = {
          total: response.data.length,
          pending: response.data.filter((doc) => doc.status === "pending")
            .length,
          verified: response.data.filter((doc) => doc.status === "verified")
            .length,
          rejected: response.data.filter((doc) => doc.status === "rejected")
            .length,
        };
        setStats(stats);
      } else {
        setDocuments([]);
        toast.error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error(error.response?.data?.message || "Failed to fetch documents");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleVerify = async (status) => {
    if (!selectedDoc) {
      toast.error("Please select a document to verify");
      return;
    }

    setProcessingAction(status);
    try {
      console.log("Verifying document:", {
        documentId: selectedDoc._id,
        status: status === "verify" ? "verified" : "rejected",
        remarks,
      });

      const response = await axios.post(
        `https://pmsss-backend.vercel.app/api/verify/${selectedDoc._id}`,
        {
          status: status === "verify" ? "verified" : "rejected",
          remarks: remarks || "No remarks provided",
          verificationDetails: {
            verifiedBy: user._id,
            verifiedAt: new Date().toISOString(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Verification response:", response.data);
      toast.success(
        `Document ${status === "verify" ? "verified" : "rejected"} successfully`
      );
      setSelectedDoc(null);
      setRemarks("");
      setProcessingAction(null);
      await fetchDocuments();
    } catch (error) {
      console.error("Error verifying document:", {
        error: error.response?.data,
        status: error.response?.status,
        message: error.message,
      });
      toast.error(
        error.response?.data?.message || `Failed to ${status} document`
      );
      setProcessingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

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
            <h1 className="text-3xl text-center font-bold text-gray-900 mb-2">
              SAG Dashboard
            </h1>
            <p className="text-gray-600 text-center">Verify and manage student documents</p>
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

          {/* Documents Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg text-center font-semibold text-gray-900">
                Pending Documents for Verification
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider"
                    >
                      Student
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider"
                    >
                      Document Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider"
                    >
                      Uploaded
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-bold text-gray-800 uppercase tracking-wider"
                    >
                      View Document
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-bold text-gray-800 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents && documents.length > 0 ? (
                    documents
                      .filter((doc) => doc.status === "pending")
                      .map((doc) => (
                        <tr
                          key={doc._id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {doc.student?.name || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doc.type
                              ? doc.type
                                  .split("_")
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1)
                                  )
                                  .join(" ")
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doc.createdAt
                              ? new Date(doc.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            <button
                              onClick={() => window.open(doc.fileUrl, "_blank")}
                              className="text-indigo-600 hover:text-indigo-900 font-medium transition-colors duration-200"
                            >
                              View
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            <button
                              onClick={() => setSelectedDoc(doc)}
                              className="text-indigo-600 hover:text-indigo-900 font-medium transition-colors duration-200"
                            >
                              Verify
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-sm text-gray-500 text-center"
                      >
                        No pending documents found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verification Modal */}
          {selectedDoc && (
            <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-lg w-full p-6 relative shadow-xl">
                <button
                  onClick={() => {
                    setSelectedDoc(null);
                    setRemarks("");
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Verify Document
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedDoc.student?.name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document Type
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedDoc.type
                        ? selectedDoc.type
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document Preview
                    </label>
                    <div className="mt-2">
                      {selectedDoc.documentUrl && (
                        <div className="border border-gray-200 rounded-lg p-2">
                          {selectedDoc.documentUrl.match(
                            /\.(jpg|jpeg|png|gif)$/i
                          ) ? (
                            <img
                              src={selectedDoc.documentUrl}
                              alt="Document preview"
                              className="max-w-full h-auto rounded"
                            />
                          ) : (
                            <div className="flex items-center justify-center p-4">
                              <a
                                href={selectedDoc.documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-900 flex items-center font-medium transition-colors duration-200"
                              >
                                <DocumentCheckIcon className="h-5 w-5 mr-2" />
                                View Document
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remarks
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="Add any remarks about the verification..."
                    />
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="button"
                      disabled={processingAction !== null}
                      onClick={() => handleVerify("verify")}
                      className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm disabled:opacity-50 transition-all duration-200"
                    >
                      {processingAction === "verify"
                        ? "Verifying..."
                        : "Verify"}
                    </button>
                    <button
                      type="button"
                      disabled={processingAction !== null}
                      onClick={() => handleVerify("reject")}
                      className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm disabled:opacity-50 transition-all duration-200"
                    >
                      {processingAction === "reject"
                        ? "Rejecting..."
                        : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
