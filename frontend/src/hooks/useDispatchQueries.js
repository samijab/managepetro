/**
 * Dispatch-related React Query hooks
 * Provides hooks for dispatch optimization with caching and state management
 * @module hooks/useDispatchQueries
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  optimizeDispatch,
  optimizeDispatchWithTransform,
} from "../services/dispatch-api";
import { truckQueryKeys } from "./useTruckQueries";
import { stationQueryKeys } from "./useStationQueries";

/**
 * Hook for dispatch optimization mutation
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useOptimizeDispatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => optimizeDispatch(params),
    onSuccess: () => {
      // Invalidate and refetch relevant queries after successful dispatch
      queryClient.invalidateQueries({ queryKey: truckQueryKeys.trucks });
      queryClient.invalidateQueries({ queryKey: stationQueryKeys.stations });
    },
  });
}

/**
 * Hook for dispatch optimization with automatic transformation
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useOptimizeDispatchWithTransform() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dispatchData) => optimizeDispatchWithTransform(dispatchData),
    onSuccess: () => {
      // Invalidate and refetch relevant queries after successful dispatch
      queryClient.invalidateQueries({ queryKey: truckQueryKeys.trucks });
      queryClient.invalidateQueries({ queryKey: stationQueryKeys.stations });
    },
  });
}
