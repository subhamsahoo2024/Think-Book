import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import authApi from "../lib/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (email, password, name) => {
    try {
      const response = await authApi.post("/auth/register", {
        email,
        password,
        name,
      });
      const { user, token: newToken } = response.data;
      setCurrentUser(user);
      setToken(newToken);
      localStorage.setItem("authToken", newToken);
      localStorage.setItem("authUser", JSON.stringify(user));
      toast.success(`welcome ${name}`);
      return user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.error("Registration error:", error);
      throw error.response?.data?.message || "Registration failed";
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authApi.post("/auth/login", {
        email,
        password,
      });
      const { user, token: newToken } = response.data;
      setCurrentUser(user);
      setToken(newToken);
      localStorage.setItem("authToken", newToken);
      localStorage.setItem("authUser", JSON.stringify(user));
      return user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.error("Login error:", error);
      throw error.response?.data?.message || "Login failed";
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  const value = {
    currentUser,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
