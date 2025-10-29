/**
 * Trips API service
 * Handles all trip-related API operations
 * @module services/trips-api
 */

import { httpClient } from "./http-client";

/**
 * @typedef {import('./types').Trip} Trip
 */

/**
 * Get trips with optional filters
 * @param {{ limit?: number, successfulOnly?: boolean }} [options]
 * @returns {Promise<{ trips: Trip[], count?: number, total_available?: number }>}
 */
export function getTrips({ limit = 50, successfulOnly = false } = {}) {
  return httpClient.get("/trips", { limit, successful_only: successfulOnly });
}

/**
 * Get a single trip by id
 * @param {string} id
 * @returns {Promise<{ trip: Trip }>}
 */
export function getTrip(id) {
  return httpClient.get(`/trips/${id}`);
}
