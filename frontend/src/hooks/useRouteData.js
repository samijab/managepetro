import { useState } from "react";
import routeService from "../services/routeService";

/**
 * Initial state for route data
 */
const INITIAL_ROUTE_STATE = {
  from: "",
  to: "",
  eta: null,
  instructions: [],
  isLoading: false,
  error: null,
};

/**
 * Custom hook for managing route calculation state
 */
export function useRouteData() {
  const [routeData, setRouteData] = useState(INITIAL_ROUTE_STATE);

  const calculateRoute = async (from, to, llmModel) => {
    setRouteData((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const result = await routeService.calculateRoute(from, to, llmModel);

      setRouteData({
        from,
        to,
        eta: result.eta,
        instructions: result.instructions,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setRouteData((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  };

  const clearRoute = () => {
    setRouteData(INITIAL_ROUTE_STATE);
  };

  return {
    routeData,
    calculateRoute,
    clearRoute,
    isLoading: routeData.isLoading,
    error: routeData.error,
  };
}
