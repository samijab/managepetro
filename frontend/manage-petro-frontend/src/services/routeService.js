import Api from "./api";
import { mockRouteData } from "../data/mockData";

const USE_MOCK_DATA =
  import.meta.env.VITE_USE_MOCK_DATA === "true" || import.meta.env.DEV;

/**
 * Service for route optimization operations
 */
class RouteService {
  /**
   * Calculate optimized route between two locations
   * @param {string} from - Starting location
   * @param {string} to - Destination location
   * @param {string} llmModel - Selected LLM model
   * @returns {Promise<{eta: Object, instructions: Array}>}
   */
  async calculateRoute(from, to, llmModel = "gpt-4") {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        ...mockRouteData,
        from,
        to,
        llmModel,
        calculatedAt: new Date().toISOString(),
      };
    }

    // Real API call
    try {
      const response = await Api.post("/routes/optimize", {
        from,
        to,
        llm_model: llmModel,
        optimization_type: "fuel_efficient",
      });

      return response;
    } catch (error) {
      console.error("Route calculation failed:", error);
      throw new Error("Failed to calculate route. Please try again.");
    }
  }

  /**
   * Get available trucks for route assignment
   * @returns {Promise<Array>}
   */
  async getAvailableTrucks() {
    if (USE_MOCK_DATA) {
      const { mockTrucks } = await import("../data/mockData");
      return mockTrucks;
    }

    return Api.getTrucks();
  }

  /**
   * Get stations requiring fuel delivery
   * @returns {Promise<Array>}
   */
  async getStationsNeedingFuel() {
    if (USE_MOCK_DATA) {
      const { mockStations } = await import("../data/mockData");
      return mockStations;
    }

    return Api.getStations();
  }
}

export default new RouteService();
