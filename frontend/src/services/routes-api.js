/**
 * Routes API service
 * Handles all route-related API operations
 * @module services/routes-api
 */

import { DEFAULT_LLM_MODEL } from "../constants/config";
import { httpClient } from "./http-client";
import { transformRouteResponse } from "./transformers";

/**
 * @typedef {import('./types').RouteOptimizationResponse} RouteOptimizationResponse
 * @typedef {import('./types').TransformedRouteData} TransformedRouteData
 */

/**
 * Optimize route between two locations
 * @param {Object} params
 * @param {string} params.from_location - Starting location
 * @param {string} params.to_location - Destination location
 * @param {string} [params.llm_model] - Selected LLM model (defaults to DEFAULT_LLM_MODEL from config)
 * @param {boolean} [params.use_ai_optimization=true] - Whether to use AI optimization
 * @param {string} [params.departure_time] - Departure time
 * @param {string} [params.arrival_time] - Arrival time
 * @param {string} [params.time_mode="departure"] - Time mode
 * @param {string} [params.delivery_date] - Delivery date
 * @param {string} [params.vehicle_type="fuel_delivery_truck"] - Vehicle type
 * @param {string} [params.notes] - Additional notes
 * @returns {Promise<RouteOptimizationResponse>}
 */
export function optimizeRoute(params) {
  return httpClient.post("/routes/optimize", params);
}

/**
 * Calculate optimized route between two locations with transformation
 * This method handles both the API call and transformation
 * @param {string} from - Starting location
 * @param {string} to - Destination location
 * @param {string} [llmModel] - Selected LLM model (defaults to DEFAULT_LLM_MODEL from config)
 * @returns {Promise<TransformedRouteData>}
 */
export async function optimizeRouteWithTransform(
  from,
  to,
  llmModel = DEFAULT_LLM_MODEL
) {
  const response = await optimizeRoute({
    from_location: from,
    to_location: to,
    llm_model: llmModel,
    use_ai_optimization: true,
  });
  return transformRouteResponse(response);
}

/**
 * Optimize route using TomTom
 * @param {Object} routeData
 * @returns {Promise<any>}
 */
export function tomtom(routeData) {
  return httpClient.post("/routes/tomtom", routeData);
}

/**
 * Calculate reachable range
 * @param {Object} rangeData
 * @returns {Promise<any>}
 */
export function reachableRange(rangeData) {
  return httpClient.post("/routes/reachable-range", rangeData);
}
