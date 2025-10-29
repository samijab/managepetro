/**
 * Trucks API service
 * Handles all truck-related API operations
 * @module services/trucks-api
 */

import { httpClient } from "./http-client";

/**
 * @typedef {import('./types').Truck} Truck
 */

/**
 * Get all trucks
 * @returns {Promise<{ trucks: Truck[], count?: number }>}
 */
export function getTrucks() {
  return httpClient.get("/trucks");
}

/**
 * Get a truck by id
 * @param {string} id
 * @returns {Promise<{ truck: Truck }>}
 */
export function getTruck(id) {
  return httpClient.get(`/trucks/${id}`);
}

/**
 * Create a truck
 * @param {Partial<Truck>} payload
 * @returns {Promise<{ truck: Truck } | Truck>}
 */
export function createTruck(payload) {
  return httpClient.post("/trucks", payload);
}
