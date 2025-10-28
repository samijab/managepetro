import { createContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/env";
import axios from "axios";

// Create the context with proper default value
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Use centralized environment config for API base URL

  // Check if user is authenticated when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          setUser(response.data);
        } catch {
          // Token is invalid or request failed
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (username, password) => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post(`${API_BASE_URL}/auth/token`, formData);
      const { access_token } = response.data;

      localStorage.setItem("token", access_token);
      setToken(access_token);

      // Fetch user info
      const userResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });
      setUser(userResponse.data);

      return { success: true };
    } catch (error) {
      if (error.response && error.response.data) {
        return {
          success: false,
          error: error.response.data.detail || "Login failed",
        };
      }
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const register = async (username, email, password) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        username,
        email,
        password,
      });
      // Auto-login after successful registration
      const loginResult = await login(username, password);
      return loginResult;
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the context for use in hooks
export { AuthContext };
