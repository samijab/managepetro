/**
 * Dispatch API service
 * Handles all dispatch-related API operations
 * @module services/dispatch-api
 */

import { httpClient } from "./http-client";
import { transformDispatchResponse } from "./transformers";

/**
 * @typedef {import('./types').DispatchOptimizationResponse} DispatchOptimizationResponse
 */

/**
 * Optimize dispatch
 * @param {Object} dispatchData
 * @returns {Promise<DispatchOptimizationResponse>}
 */
export function optimizeDispatch(dispatchData) {
  return httpClient.post("/dispatch/optimize", dispatchData);
}

/**
 * Optimize dispatch with transformation
 * @param {Object} dispatchData
 * @returns {Promise<Object>} Standardized dispatch data
 */
export async function optimizeDispatchWithTransform(dispatchData) {
  const response = await optimizeDispatch(dispatchData);
  return transformDispatchResponse(response);
}
