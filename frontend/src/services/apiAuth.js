// Enhanced API utility with authentication support

import { getApiBaseUrl, API_BASE_URL } from "../config/env";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// Create headers with authentication
const createHeaders = (includeAuth = true) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Enhanced fetch with automatic authentication
const apiRequest = async (endpoint, options = {}) => {
  const url = `${getApiBaseUrl()}${
    endpoint.startsWith("/") ? endpoint : "/" + endpoint
  }`;
  const config = {
    ...options,
    headers: {
      ...createHeaders(options.includeAuth !== false),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Handle authentication errors
    if (response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("token");
      window.location.reload(); // Force re-authentication
      throw new Error("Authentication required");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// API methods
export const api = {
  // Authentication endpoints (no auth required)
  auth: {
    login: (username, password) => {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      return fetch(`${API_BASE_URL}/auth/token`, {
        method: "POST",
        body: formData,
      });
    },

    register: (userData) =>
      fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }),

    me: () => fetch(`${API_BASE_URL}/auth/me`),

    logout: () => fetch(`${API_BASE_URL}/auth/logout`, { method: "POST" }),
  },

  // Route optimization (protected)
  routes: {
    optimize: (routeData) =>
      apiRequest("/api/routes/optimize", {
        method: "POST",
        body: JSON.stringify(routeData),
      }),

    tomtom: (routeData) =>
      apiRequest("/api/routes/tomtom", {
        method: "POST",
        body: JSON.stringify(routeData),
      }),

    reachableRange: (rangeData) =>
      apiRequest("/api/routes/reachable-range", {
        method: "POST",
        body: JSON.stringify(rangeData),
      }),
  },

  // Dispatch optimization (protected)
  dispatch: {
    optimize: (dispatchData) =>
      apiRequest("/api/dispatch/optimize", {
        method: "POST",
        body: JSON.stringify(dispatchData),
      }),
  },

  // Data endpoints (these could be protected or public based on your needs)
  data: {
    stations: () => apiRequest("/api/stations"),
    trucks: () => apiRequest("/api/trucks"),
    weather: (weatherData) =>
      apiRequest("/api/weather", {
        method: "POST",
        body: JSON.stringify(weatherData),
      }),
  },

  // Health check (public)
  health: () => apiRequest("/api/health", { includeAuth: false }),
};

export default api;
