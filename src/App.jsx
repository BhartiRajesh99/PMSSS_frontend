import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SAGRegister from "./pages/SAGRegister";
import FinanceRegister from "./pages/FinanceRegister";
import StudentRegister from "./pages/StudentRegister";
import SAGDashboard from "./pages/SAGDashboard";
import FinanceDashboard from "./pages/FinanceDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Layout from "./components/Layout";
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
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/sag" element={<SAGRegister />} />
        <Route path="/register/finance" element={<FinanceRegister />} />
        <Route path="/register/student" element={<StudentRegister />} />

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

        {/* Redirect root to login */}
        <Route path="/" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
