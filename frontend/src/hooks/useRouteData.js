import { useState } from "react";
import { useOptimizeRoute } from "./useApiQueries";
import Api from "../services/api";

/**
 * Custom hook for managing route calculation state using React Query
 */
export function useRouteData() {
  const [routeData, setRouteData] = useState({
    from: "",
    to: "",
    eta: null,
    instructions: [],
    routeSummary: null,
    weatherImpact: null,
    trafficConditions: null,
    fuelStations: [],
    recentDeliveries: [],
    availableTrucks: [],
    aiAnalysis: "",
    dataSources: null,
  });

  const optimizeRouteMutation = useOptimizeRoute();

  const calculateRoute = async (from, to, llmModel) => {
    optimizeRouteMutation.mutate(
      { from, to, llmModel },
      {
        onSuccess: (result) => {
          const transformedData = Api.transformRouteResponse(result);
          setRouteData({
            from,
            to,
            ...transformedData,
          });
        },
      }
    );
  };

  const clearRoute = () => {
    setRouteData({
      from: "",
      to: "",
      eta: null,
      instructions: [],
      routeSummary: null,
      weatherImpact: null,
      trafficConditions: null,
      fuelStations: [],
      recentDeliveries: [],
      availableTrucks: [],
      aiAnalysis: "",
      dataSources: null,
    });
    optimizeRouteMutation.reset();
  };

  return {
    routeData,
    calculateRoute,
    clearRoute,
    isLoading: optimizeRouteMutation.isPending,
    error: optimizeRouteMutation.error?.message,
  };
}
