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
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem("token");
            setToken(null);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
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

      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { access_token } = data;

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
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.detail || "Login failed" };
      }
    } catch {
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
