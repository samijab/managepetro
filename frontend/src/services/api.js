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
  timeout: 120000, // 120 seconds to handle long-running route optimization
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

/**
 * @typedef {Object} RouteOptimizationResponse
 * @property {Object} route_summary - Summary of the route
 * @property {Array} directions - Turn-by-turn directions
 * @property {Object} weather_impact - Weather impact on the route
 * @property {Object} traffic_conditions - Traffic conditions along the route
 * @property {Array} fuel_stations - Available fuel stations
 * @property {Array} recent_deliveries - Recent deliveries in the area
 * @property {Array} available_trucks - Available trucks for assignment
 * @property {Object} data_sources - Data source information
 * @property {string} ai_analysis - AI-generated analysis
 */

/**
 * @typedef {Object} TransformedRouteData
 * @property {Object} eta - ETA information
 * @property {Array} instructions - Transformed instructions
 * @property {Object} routeSummary - Route summary
 * @property {Object} weatherImpact - Weather impact
 * @property {Object} trafficConditions - Traffic conditions
 * @property {Array} fuelStations - Fuel stations
 * @property {Array} recentDeliveries - Recent deliveries
 * @property {Array} availableTrucks - Available trucks
 * @property {string} aiAnalysis - AI analysis
 * @property {Object} dataSources - Data sources
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

  /**
   * Extract direction type from instruction text (fallback for APIs that don't provide it)
   * @param {string} instruction - The instruction text
   * @returns {string} Direction type
   */
  extractDirectionType: (instruction) => {
    const text = instruction.toLowerCase();

    if (text.includes("destination") || text.includes("arrive"))
      return "destination";
    if (text.includes("turn right") || text.includes("right onto"))
      return "turn_right";
    if (text.includes("turn left") || text.includes("left onto"))
      return "turn_left";
    if (text.includes("u-turn"))
      return text.includes("left") ? "uturn_left" : "uturn_right";
    if (text.includes("exit") && text.includes("right")) return "exit_right";
    if (text.includes("exit") && text.includes("left")) return "exit_left";
    if (text.includes("merge"))
      return text.includes("left") ? "merge_left" : "merge_right";
    if (text.includes("roundabout")) return "roundabout";
    if (text.includes("continue") || text.includes("straight"))
      return "straight";
    if (text.includes("head")) return "straight";

    return "straight";
  },

  /**
   * Transform API response to standardized frontend format.
   * 
   * This is the single transformation layer between backend API and frontend.
   * If backend data structure changes, update this method accordingly.
   * 
   * @param {RouteOptimizationResponse} apiData - Raw API response
   * @returns {TransformedRouteData} Standardized route data for frontend
   */
  transformRouteResponse: (apiData) => {
    const routeSummary = apiData.route_summary || {};
    const directions = apiData.directions || [];
    const weatherImpact = apiData.weather_impact || {};
    const trafficConditions = apiData.traffic_conditions || {};
    const fuelStations = apiData.fuel_stations || [];
    const recentDeliveries = apiData.recent_deliveries || [];
    const availableTrucks = apiData.available_trucks || [];
    const aiAnalysis = apiData.ai_analysis || "";
    const dataSources = apiData.data_sources || {};

    return {
      eta: {
        duration: routeSummary.estimated_duration || "N/A",
        distance: routeSummary.total_distance || "N/A",
        recommendedArrival: routeSummary.recommended_arrival_time || null,
        recommendedDeparture: routeSummary.best_departure_time || null,
      },
      instructions: directions.map((step, index) => ({
        id: step.step_id || step.step || index + 1,
        text: step.instruction || step.text || "Continue on route",
        distance: step.distance || "N/A",
        direction_type: step.direction_type || Api.extractDirectionType(step.instruction || ""),
        compass_direction: step.compass_direction || step.bearing || null,
      })),
      routeSummary: {
        from: routeSummary.from || "N/A",
        to: routeSummary.to || "N/A",
        primaryRoute: routeSummary.primary_route || "N/A",
        routeType: routeSummary.route_type || "N/A",
        bestDepartureTime: routeSummary.best_departure_time || "N/A",
        recommendedArrivalTime: routeSummary.recommended_arrival_time || "N/A",
        weatherImpact: routeSummary.weather_impact || "N/A",
        fuelStops: routeSummary.fuel_stops || "N/A",
        estimatedFuelCost: routeSummary.estimated_fuel_cost || "N/A",
        optimizationFactors: routeSummary.optimization_factors || [],
      },
      weatherImpact: {
        fromLocation: weatherImpact.from_location || {},
        toLocation: weatherImpact.to_location || {},
        routeImpact: weatherImpact.route_impact || "N/A",
        drivingConditions: weatherImpact.driving_conditions || "N/A",
      },
      trafficConditions: trafficConditions,
      fuelStations: fuelStations,
      recentDeliveries: recentDeliveries,
      availableTrucks: availableTrucks,
      aiAnalysis: aiAnalysis,
      dataSources: dataSources,
    };
  },

  /**
   * Calculate optimized route between two locations.
   * This method handles both the API call and transformation.
   * 
   * @param {string} from - Starting location
   * @param {string} to - Destination location
   * @param {string} [llmModel="gemini-2.5-flash"] - Selected LLM model
   * @returns {Promise<TransformedRouteData>}
   */
  optimizeRoute: async (from, to, llmModel = "gemini-2.5-flash") => {
    const response = await Api.post("/routes/optimize", {
      from_location: from,
      to_location: to,
      llm_model: llmModel,
      use_ai_optimization: true,
    });
    return Api.transformRouteResponse(response);
  },

  /**
   * Transform dispatch optimization API response to standardized format.
   * Ensures all backend data is properly consumed by the frontend.
   * 
   * @param {Object} apiData - Raw dispatch API response
   * @returns {Object} Standardized dispatch data
   */
  transformDispatchResponse: (apiData) => {
    // Extract all fields from the API response
    const {
      truck,
      stations_to_visit = [],
      route_plan = {},
      optimization_summary = {},
      ai_analysis = "",
      data_sources = {},
      ...otherFields
    } = apiData;

    return {
      truck: truck || {},
      stationsToVisit: stations_to_visit,
      routePlan: {
        totalDistance: route_plan.total_distance || "N/A",
        totalDuration: route_plan.total_duration || "N/A",
        fuelToDeliver: route_plan.fuel_to_deliver || "N/A",
        departureTime: route_plan.departure_time || "N/A",
        returnTime: route_plan.return_to_depot || "N/A",
        ...route_plan,
      },
      optimizationSummary: {
        efficiencyScore: optimization_summary.efficiency_score || "N/A",
        stationsPerTrip: optimization_summary.stations_per_trip_ratio || "N/A",
        fuelConsumption: optimization_summary.estimated_truck_fuel_consumption || "N/A",
        ...optimization_summary,
      },
      aiAnalysis: ai_analysis,
      dataSources: data_sources,
      // Include any additional fields that might be added by backend
      ...otherFields,
    };
  },
};

export default Api;
