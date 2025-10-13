/**
 * React Query hooks for API data fetching
 * Provides reusable hooks with automatic caching, refetching, and state management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../services/api";

/**
 * Query keys for cache management
 */
export const queryKeys = {
  stations: ["stations"],
  trucks: ["trucks"],
  trips: (options) => ["trips", options],
  station: (id) => ["stations", id],
  truck: (id) => ["trucks", id],
  trip: (id) => ["trips", id],
};

/**
 * Hook to fetch all stations
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export function useStations() {
  return useQuery({
    queryKey: queryKeys.stations,
    queryFn: Api.getStations,
  });
}

/**
 * Hook to fetch a single station by ID
 * @param {string} id - Station ID
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export function useStation(id) {
  return useQuery({
    queryKey: queryKeys.station(id),
    queryFn: () => Api.getStation(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch all trucks
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export function useTrucks() {
  return useQuery({
    queryKey: queryKeys.trucks,
    queryFn: Api.getTrucks,
  });
}

/**
 * Hook to fetch a single truck by ID
 * @param {string} id - Truck ID
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export function useTruck(id) {
  return useQuery({
    queryKey: queryKeys.truck(id),
    queryFn: () => Api.getTruck(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch trips with optional filters
 * @param {Object} options - Query options
 * @param {number} [options.limit] - Maximum number of trips to fetch
 * @param {boolean} [options.successfulOnly] - Filter for successful trips only
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export function useTrips(options = {}) {
  return useQuery({
    queryKey: queryKeys.trips(options),
    queryFn: () => Api.getTrips(options),
  });
}

/**
 * Hook to fetch a single trip by ID
 * @param {string} id - Trip ID
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export function useTrip(id) {
  return useQuery({
    queryKey: queryKeys.trip(id),
    queryFn: () => Api.getTrip(id),
    enabled: !!id,
  });
}

/**
 * Hook for dispatch optimization mutation
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useOptimizeDispatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => Api.post("/dispatch/optimize", params),
    onSuccess: () => {
      // Invalidate and refetch relevant queries after successful dispatch
      queryClient.invalidateQueries({ queryKey: queryKeys.trucks });
      queryClient.invalidateQueries({ queryKey: queryKeys.stations });
    },
  });
}

/**
 * Hook for route optimization with React Query
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useOptimizeRoute() {
  return useMutation({
    mutationFn: ({ from, to, llmModel, timeData = {} }) =>
      Api.post("/routes/optimize", {
        from_location: from,
        to_location: to,
        llm_model: llmModel,
        use_ai_optimization: true,
        departure_time: timeData.departureTime || null,
        arrival_time: timeData.arrivalTime || null,
        time_mode: timeData.timeMode || "departure",
        delivery_date: timeData.deliveryDate || null,
        vehicle_type: timeData.vehicleType || "fuel_delivery_truck",
        notes: timeData.notes || null,
      }),
  });
}
