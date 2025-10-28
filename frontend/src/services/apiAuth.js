// Enhanced API utility with authentication support

import { getApiBaseUrl, API_BASE_URL } from "../config/env";
import axios from "axios";

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
  try {
    const response = await axios({
      url,
      method: options.method || "GET",
      data: options.body ? JSON.parse(options.body) : undefined,
      headers: {
        ...createHeaders(options.includeAuth !== false),
        ...options.headers,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.reload();
      throw new Error("Authentication required");
    }
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

      return axios.post(`${API_BASE_URL}/auth/token`, formData);
    },

    register: (userData) =>
      axios.post(`${API_BASE_URL}/auth/register`, userData),

    me: () => axios.get(`${API_BASE_URL}/auth/me`),

    logout: () => axios.post(`${API_BASE_URL}/auth/logout`),
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
