/**
 * Application-wide configuration constants
 * Centralizes magic strings and configuration values - DRY principle
 */

/**
 * Default LLM model for route optimization
 */
import { DEFAULT_LLM_MODEL } from "../config/env";
export { DEFAULT_LLM_MODEL };

/**
 * Available LLM models for selection
 */
export const LLM_MODELS = [
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash (Fast)" },
  { value: "gemini-2.0-flash-exp", label: "Gemini 2.0 Flash Exp" },
  { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro (Advanced)" },
];

/**
 * Default depot location
 */
export const DEFAULT_DEPOT_LOCATION = "Toronto";

/**
 * Vehicle types available for route optimization
 */
export const VEHICLE_TYPES = [
  { value: "fuel_delivery_truck", label: "Fuel Delivery Truck" },
  { value: "tanker_truck", label: "Tanker Truck" },
  { value: "cargo_truck", label: "Cargo Truck" },
];

/**
 * Time mode options for route optimization
 */
export const TIME_MODES = {
  DEPARTURE: "departure",
  ARRIVAL: "arrival",
};

/**
 * Fuel level thresholds for station priority
 */
export const FUEL_THRESHOLDS = {
  CRITICAL: 10,
  HIGH: 30,
  MEDIUM: 50,
};

/**
 * Truck status values
 */
export const TRUCK_STATUS = {
  ACTIVE: "active",
  MAINTENANCE: "maintenance",
  OFFLINE: "offline",
};

/**
 * Request methods for station fuel requests
 */
export const REQUEST_METHODS = {
  IOT: "IoT",
  MANUAL: "Manual",
};
