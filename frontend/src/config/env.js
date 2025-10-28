// Centralized frontend environment config for Vite
// Throws a clear error if any required env variable is missing

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

export const API_BASE_URL = requireEnv(
  "VITE_API_BASE_URL",
  "https://your-backend-url"
);
export const DEFAULT_LLM_MODEL = requireEnv(
  "VITE_DEFAULT_LLM_MODEL",
  "gemini-2.5-flash"
);

// Always append /api to the base URL, regardless of what it is
export function getApiBaseUrl() {
  return API_BASE_URL.endsWith("/api") ? API_BASE_URL : `${API_BASE_URL}/api`;
}
