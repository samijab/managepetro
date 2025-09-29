import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
});

// Optional auth header from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Optional error normalization
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const message =
      err.response?.data?.detail ||
      err.response?.data?.error ||
      err.message ||
      "Request failed";
    const wrapped = new Error(message);
    wrapped.status = status;
    wrapped.data = err.response?.data;
    return Promise.reject(wrapped);
  }
);

// Minimal helpers + domain methods (all in one file)
const Api = {
  // generic helpers
  get: (url, params, config) =>
    api.get(url, { params, ...config }).then((r) => r.data),
  post: (url, data, config) => api.post(url, data, config).then((r) => r.data),
  put: (url, data, config) => api.put(url, data, config).then((r) => r.data),
  patch: (url, data, config) =>
    api.patch(url, data, config).then((r) => r.data),
  delete: (url, config) => api.delete(url, config).then((r) => r.data),

  // domain-specific
  health: () => Api.get("/health"),
  getTrucks: () => Api.get("/trucks"),
  getTruck: (id) => Api.get(`/trucks/${id}`),
  createTruck: (payload) => Api.post("/trucks", payload),

  getStations: () => Api.get("/stations"),
  getStation: (id) => Api.get(`/stations/${id}`),

  getTrips: ({ limit = 50, successfulOnly = false } = {}) =>
    Api.get("/trips", { limit, successful_only: successfulOnly }),
  getTrip: (id) => Api.get(`/trips/${id}`),
};

export default Api;
