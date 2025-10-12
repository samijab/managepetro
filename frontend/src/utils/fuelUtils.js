/**
 * Utility functions and constants for fuel-related calculations
 */

// Fuel level thresholds
export const FUEL_THRESHOLDS = {
  WELL_STOCKED: 70,
  LOW_FUEL: 30,
};

/**
 * Get color class based on fuel level
 * @param {number} fuelLevel - Fuel level percentage (0-100)
 * @returns {string} Tailwind color class
 */
export function getFuelLevelColor(fuelLevel) {
  if (fuelLevel >= FUEL_THRESHOLDS.WELL_STOCKED) {
    return "bg-green-500";
  }
  if (fuelLevel >= FUEL_THRESHOLDS.LOW_FUEL) {
    return "bg-yellow-500";
  }
  return "bg-red-500";
}

/**
 * Get priority badge color classes
 * @param {string} priority - Priority level (High, Medium, Low)
 * @returns {string} Tailwind color classes
 */
export function getPriorityColor(priority) {
  const priorityColors = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800",
  };
  return priorityColors[priority] || "bg-gray-100 text-gray-800";
}

/**
 * Filter stations by fuel level
 * @param {Array} stations - Array of station objects
 * @param {number} threshold - Fuel level threshold
 * @param {string} operator - Comparison operator ('>=', '<')
 * @returns {Array} Filtered stations
 */
export function filterStationsByFuelLevel(stations, threshold, operator = ">=") {
  return stations.filter((station) => {
    if (operator === ">=") {
      return station.fuel_level >= threshold;
    }
    if (operator === "<") {
      return station.fuel_level < threshold;
    }
    return false;
  });
}

/**
 * Filter stations by priority
 * @param {Array} stations - Array of station objects
 * @param {string} priority - Priority level to filter by
 * @returns {Array} Filtered stations
 */
export function filterStationsByPriority(stations, priority) {
  return stations.filter((station) => station.priority === priority);
}
