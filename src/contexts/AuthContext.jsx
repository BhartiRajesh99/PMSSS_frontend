import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get("/api/auth/me");
      setUser(response.data);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password, role) => {
    try {
      // Validate input
      if (!email || !password) {
        toast.error("Please provide both email and password");
        throw new Error("Email and password are required");
      }

      // Make login request based on role
      const response = await axios.post(`/api/auth/login/${role}`, {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      toast.success("Login successful");
      return user;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post("/api/auth/register", userData);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      toast.success("Registration successful");
      return user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
