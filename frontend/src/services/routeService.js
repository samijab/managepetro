import Api from "./api";
import { mockRouteData } from "../data/mockData";

const USE_MOCK_DATA =
  import.meta.env.VITE_USE_MOCK_DATA === "true" || import.meta.env.DEV;

/**
 * Service for route optimization operations
 */
class RouteService {
  /**
   * Transform API response to standardized format
   * @param {Object} apiData - Raw API response
   * @returns {Object} Standardized route data
   */
  transformApiResponse(apiData) {
    return {
      eta: {
        arrival: apiData.estimated_arrival || apiData.eta?.arrival,
        duration: apiData.travel_duration || apiData.eta?.duration,
        distance: apiData.total_distance || apiData.eta?.distance,
      },
      instructions: (apiData.steps || apiData.instructions || []).map(
        (step, index) => ({
          id: step.step_id || step.id || index + 1,
          text: step.instruction || step.text,
          distance: step.distance,
          direction_type:
            step.direction_type ||
            step.maneuver ||
            this.extractDirectionType(step.instruction),
          compass_direction: step.compass_direction || step.bearing,
        })
      ),
    };
  }

  /**
   * Extract direction type from instruction text (fallback for APIs that don't provide it)
   * @param {string} instruction - The instruction text
   * @returns {string} Direction type
   */
  extractDirectionType(instruction) {
    const text = instruction.toLowerCase();

    if (text.includes("destination") || text.includes("arrive"))
      return "destination";
    if (text.includes("turn right") || text.includes("right onto"))
      return "turn_right";
    if (text.includes("turn left") || text.includes("left onto"))
      return "turn_left";
    if (text.includes("u-turn"))
      return text.includes("left") ? "uturn_left" : "uturn_right";
    if (text.includes("exit") && text.includes("right")) return "exit_right";
    if (text.includes("exit") && text.includes("left")) return "exit_left";
    if (text.includes("merge"))
      return text.includes("left") ? "merge_left" : "merge_right";
    if (text.includes("roundabout")) return "roundabout";
    if (text.includes("continue") || text.includes("straight"))
      return "straight";
    if (text.includes("head")) return "straight";

    return "straight"; // Default fallback
  }

  /**
   * Calculate optimized route between two locations
   * @param {string} from - Starting location
   * @param {string} to - Destination location
   * @param {string} llmModel - Selected LLM model
   * @returns {Promise<{eta: Object, instructions: Array}>}
   */
  async calculateRoute(from, to, llmModel = "gemini-2.5-flash") {
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

    // Real API call using the Api service
    try {
      const response = await Api.optimizeRoute({
        from_location: from,
        to_location: to,
        llm_model: llmModel,
        use_ai_optimization: true,
      });

      return this.transformApiResponse(response);
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

    const response = await Api.getTrucks();
    return response.trucks || response;
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

    const response = await Api.getStations();
    return response.stations || response;
  }
}

export default new RouteService();
