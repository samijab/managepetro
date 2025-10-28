// Centralized frontend environment config for Vite
// Throws a clear error if any required env variable is missing

import { REQUIRED_ENV_VARS } from "./env-config.js";

export function requireEnv(varName, example = "") {
  const value = import.meta.env[varName];
  if (!value || value === "") {
    throw new Error(
      `Missing required environment variable: ${varName}\n` +
        (example ? `Example: ${varName}=${example}\n` : "") +
        `Add this to your .env file in the frontend folder.`
    );
  }
  return value;
}

// Create exports for all required environment variables
export const API_BASE_URL = requireEnv(
  "VITE_API_BASE_URL",
  REQUIRED_ENV_VARS.find((v) => v.name === "VITE_API_BASE_URL")?.example
);
export const DEFAULT_LLM_MODEL = requireEnv(
  "VITE_DEFAULT_LLM_MODEL",
  REQUIRED_ENV_VARS.find((v) => v.name === "VITE_DEFAULT_LLM_MODEL")?.example
);

// Fail fast on all required envs (call this in main.jsx)
export function checkRequiredEnvs() {
  REQUIRED_ENV_VARS.forEach(({ name, example }) => {
    requireEnv(name, example);
  });
}

// Always append /api to the base URL, regardless of what it is
export function getApiBaseUrl() {
  return API_BASE_URL.endsWith("/api") ? API_BASE_URL : `${API_BASE_URL}/api`;
}
