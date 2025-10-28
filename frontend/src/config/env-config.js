// Shared environment variable configuration
// This file defines all required environment variables for the application
// Used by both vite.config.js (build-time validation) and src/config/env.js (runtime access)

export const REQUIRED_ENV_VARS = [
  { name: "VITE_API_BASE_URL", example: "https://your-backend-url" },
  { name: "VITE_DEFAULT_LLM_MODEL", example: "gemini-2.5-flash" },
  // Add new required variables here:
  // { name: "VITE_NEW_VARIABLE", example: "default-value" },
];
