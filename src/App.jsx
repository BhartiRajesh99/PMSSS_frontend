import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import SAGRegister from "./pages/SAGRegister";
import FinanceRegister from "./pages/FinanceRegister";
import StudentRegister from "./pages/StudentRegister";
import SAGDashboard from "./pages/SAGDashboard";
import FinanceDashboard from "./pages/FinanceDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Landing from "./pages/Landing";
import EligibilityChecker from "./pages/EligibilityChecker";
import ApplicationTracking from "./pages/ApplicationTracking";
import Chatbot from "./pages/Chatbot";
import ScholarshipCalculator from "./pages/ScholarshipCalculator";
import CollegeExplorer from "./pages/CollegeExplorer";
import DocumentUpload from "./pages/DocumentUpload";
import "./App.css";

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If role is not allowed, redirect to home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and role is allowed, render children
  return children;
};

// Public Route component (for login/register)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, render children
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Landing />} />
        <Route path="/register/sag" element={<SAGRegister />} />
        <Route path="/register/finance" element={<FinanceRegister />} />
        <Route path="/register/student" element={<StudentRegister />} />

        {/* Feature Pages */}
        <Route path="/eligibility-checker" element={<EligibilityChecker />} />
        <Route path="/application-tracking" element={<ApplicationTracking />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route
          path="/scholarship-calculator"
          element={<ScholarshipCalculator />}
        />
        <Route path="/college-explorer" element={<CollegeExplorer />} />
        <Route path="/document-upload" element={<DocumentUpload />} />

        {/* Protected Routes */}
        <Route
          path="/sag-dashboard"
          element={
            <ProtectedRoute allowedRoles={["sag_bureau"]}>
              <SAGDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance-dashboard"
          element={
            <ProtectedRoute allowedRoles={["finance_bureau"]}>
              <FinanceDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
