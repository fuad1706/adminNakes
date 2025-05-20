import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";

import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";

// Protected route component with proper TypeScript typing
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in (e.g., from localStorage or a state management system)
    const checkAuth = () => {
      // Replace this with your actual authentication logic
      const token = localStorage.getItem("adminToken");
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    // Optional: Show loading indicator while checking auth status
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page and remember where they were trying to go
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return children;
};

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Protected routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default Router;
