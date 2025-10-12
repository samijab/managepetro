import { useState } from "react";
import routeService from "../services/routeService";

/**
 * Custom hook for managing route calculation state
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
    isLoading: false,
    error: null,
  });

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
        routeSummary: result.routeSummary,
        weatherImpact: result.weatherImpact,
        trafficConditions: result.trafficConditions,
        fuelStations: result.fuelStations,
        recentDeliveries: result.recentDeliveries,
        availableTrucks: result.availableTrucks,
        aiAnalysis: result.aiAnalysis,
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
      isLoading: false,
      error: null,
    });
  };

  return {
    routeData,
    calculateRoute,
    clearRoute,
    isLoading: routeData.isLoading,
    error: routeData.error,
  };
}
