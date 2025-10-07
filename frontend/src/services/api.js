/**
 * Axios API client for the FastAPI backend.
 * - Uses Vite proxy in dev (`/api`) unless VITE_API_BASE_URL is set.
 * - Normalizes errors and exposes domain-specific helpers.
 * @module services/api
 */

import axios from "axios";

/**
 * Axios instance configured for the FastAPI backend.
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
});

/**
 * Custom API error with optional HTTP status and response data.
 * @typedef {Error & { status?: number, data?: any }} ApiError
 */

/**
 * @typedef {Object} Truck
 * @property {string} truck_id
 * @property {string} [plate_number]
 * @property {number} [capacity_liters]
 */

/**
 * @typedef {Object} Station
 * @property {string} station_id
 * @property {string} [name]
 * @property {string} [city]
 */

/**
 * @typedef {Object} Trip
 * @property {string} trip_id
 * @property {boolean} [delivery_successful]
 */

// Optional auth header from localStorage
/**
 * Request interceptor to attach Authorization header when token exists.
 * Reads token from localStorage key "authToken".
 * @param {import('axios').InternalAxiosRequestConfig} config
 * @returns {import('axios').InternalAxiosRequestConfig}
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Optional error normalization
/**
 * Response interceptor to normalize errors to a standard Error object.
 * @returns {Promise<import('axios').AxiosResponse>}
 * @throws {ApiError}
 */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const message =
      err.response?.data?.detail ||
      err.response?.data?.error ||
      err.message ||
      "Request failed";
    /** @type {ApiError} */
    const wrapped = new Error(message);
    wrapped.status = status;
    wrapped.data = err.response?.data;
    return Promise.reject(wrapped);
  }
);

// Minimal helpers + domain methods (all in one file)
const Api = {
  /**
   * Perform a GET request.
   * @template T
   * @param {string} url
   * @param {Record<string, any>} [params]
   * @param {import('axios').AxiosRequestConfig} [config]
   * @returns {Promise<T>}
   */
  get: (url, params, config) =>
    api.get(url, { params, ...config }).then((r) => r.data),

  /**
   * Perform a POST request.
   * @template T
   * @param {string} url
   * @param {any} [data]
   * @param {import('axios').AxiosRequestConfig} [config]
   * @returns {Promise<T>}
   */
  post: (url, data, config) => api.post(url, data, config).then((r) => r.data),

  /**
   * Perform a PUT request.
   * @template T
   * @param {string} url
   * @param {any} [data]
   * @param {import('axios').AxiosRequestConfig} [config]
   * @returns {Promise<T>}
   */
  put: (url, data, config) => api.put(url, data, config).then((r) => r.data),

  /**
   * Perform a PATCH request.
   * @template T
   * @param {string} url
   * @param {any} [data]
   * @param {import('axios').AxiosRequestConfig} [config]
   * @returns {Promise<T>}
   */
  patch: (url, data, config) =>
    api.patch(url, data, config).then((r) => r.data),

  /**
   * Perform a DELETE request.
   * @template T
   * @param {string} url
   * @param {import('axios').AxiosRequestConfig} [config]
   * @returns {Promise<T>}
   */
  delete: (url, config) => api.delete(url, config).then((r) => r.data),

  /**
   * Health check.
   * @returns {Promise<{status?: string, message?: string}>}
   */
  health: () => Api.get("/health"),

  /**
   * Get all trucks.
   * @returns {Promise<{ trucks: Truck[], count?: number }>}
   */
  getTrucks: () => Api.get("/trucks"),

  /**
   * Get a truck by id.
   * @param {string} id
   * @returns {Promise<{ truck: Truck }>}
   */
  getTruck: (id) => Api.get(`/trucks/${id}`),

  /**
   * Create a truck.
   * @param {Partial<Truck>} payload
   * @returns {Promise<{ truck: Truck } | Truck>}
   */
  createTruck: (payload) => Api.post("/trucks", payload),

  /**
   * Get all stations.
   * @returns {Promise<{ stations: Station[], count?: number }>}
   */
  getStations: () => Api.get("/stations"),

  /**
   * Get a station by id.
   * @param {string} id
   * @returns {Promise<{ station: Station }>}
   */
  getStation: (id) => Api.get(`/stations/${id}`),

  /**
   * Get trips with optional filters.
   * @param {{ limit?: number, successfulOnly?: boolean }} [options]
   * @returns {Promise<{ trips: Trip[], count?: number, total_available?: number }>}
   */
  getTrips: ({ limit = 50, successfulOnly = false } = {}) =>
    Api.get("/trips", { limit, successful_only: successfulOnly }),

  /**
   * Get a single trip by id.
   * @param {string} id
   * @returns {Promise<{ trip: Trip }>}
   */
  getTrip: (id) => Api.get(`/trips/${id}`),
};

export default Api;
