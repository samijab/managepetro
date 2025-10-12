import Api from "./api";

/**
 * Service for route optimization operations
 */
class RouteService {
  /**
   * Generic error handler
   * @param {Error} error - The error to handle
   * @param {string} defaultMessage - Default error message
   * @returns {Error} Formatted error
   */
  handleError(error, defaultMessage) {
    console.error(defaultMessage, error);
    return new Error(error.message || defaultMessage);
  }

  /**
   * Transform API response to standardized format
   * @param {Object} apiData - Raw API response
   * @returns {Object} Standardized route data
   */
  transformApiResponse(apiData) {
    // Handle the nested route_summary structure from backend
    const routeSummary = apiData.route_summary || {};
    const directions = apiData.directions || [];
    const weatherImpact = apiData.weather_impact || {};
    const trafficConditions = apiData.traffic_conditions || {};
    const fuelStations = apiData.fuel_stations || [];
    const recentDeliveries = apiData.recent_deliveries || [];
    const availableTrucks = apiData.available_trucks || [];
    const aiAnalysis = apiData.ai_analysis || "";

    return {
      eta: {
        duration: routeSummary.estimated_duration || "N/A",
        distance: routeSummary.total_distance || "N/A",
      },
      instructions: directions.map((step, index) => ({
        id: step.step_id || step.step || index + 1,
        text: step.instruction || step.text || "Continue on route",
        distance: step.distance || "N/A",
        direction_type: step.direction_type || this.extractDirectionType(step.instruction || ""),
        compass_direction: step.compass_direction || step.bearing || null,
      })),
      routeSummary: {
        from: routeSummary.from || "N/A",
        to: routeSummary.to || "N/A",
        primaryRoute: routeSummary.primary_route || "N/A",
        routeType: routeSummary.route_type || "N/A",
        bestDepartureTime: routeSummary.best_departure_time || "N/A",
        weatherImpact: routeSummary.weather_impact || "N/A",
        fuelStops: routeSummary.fuel_stops || "N/A",
        estimatedFuelCost: routeSummary.estimated_fuel_cost || "N/A",
        optimizationFactors: routeSummary.optimization_factors || [],
      },
      weatherImpact: {
        fromLocation: weatherImpact.from_location || {},
        toLocation: weatherImpact.to_location || {},
        routeImpact: weatherImpact.route_impact || "N/A",
        drivingConditions: weatherImpact.driving_conditions || "N/A",
      },
      trafficConditions: trafficConditions,
      fuelStations: fuelStations,
      recentDeliveries: recentDeliveries,
      availableTrucks: availableTrucks,
      aiAnalysis: aiAnalysis,
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
    try {
      const response = await Api.post("/routes/optimize", {
        from_location: from,
        to_location: to,
        llm_model: llmModel,
        use_ai_optimization: true,
      });

      return this.transformApiResponse(response);
    } catch (error) {
      throw this.handleError(error, "Failed to calculate route. Please try again.");
    }
  }

  /**
   * Get available trucks for route assignment
   * @returns {Promise<Array>}
   */
  async getAvailableTrucks() {
    try {
      const response = await Api.getTrucks();
      return response.trucks || [];
    } catch (error) {
      throw this.handleError(error, "Failed to fetch available trucks");
    }
  }

  /**
   * Get stations requiring fuel delivery
   * @returns {Promise<Array>}
   */
  async getStationsNeedingFuel() {
    try {
      const response = await Api.getStations();
      return response.stations || [];
    } catch (error) {
      throw this.handleError(error, "Failed to fetch stations");
    }
  }
}

export default new RouteService();
