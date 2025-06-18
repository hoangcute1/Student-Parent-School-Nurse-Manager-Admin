/**
 * Centralized environment variables management
 * Import this file instead of using process.env directly
 */

// API URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
export const AUTH_SECRET = process.env.AUTH_SECRET || "";
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";
export const LOCAL_STORAGE_TOKEN_KEY =
  process.env.LOCAL_STORAGE_TOKEN_KEY || "";

// Application environment
export const NODE_ENV = process.env.NODE_ENV || "development";
export const IS_PRODUCTION = NODE_ENV === "production";
export const IS_DEVELOPMENT = NODE_ENV === "development";
export const IS_TEST = NODE_ENV === "test";

// Other application settings
export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || "School Health Management System";
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";

// Debug mode
export const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === "true";

// Export all environment variables as an object for convenience
const env = {
  API_URL,
  AUTH_SECRET,
  JWT_EXPIRATION,
  NODE_ENV,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  IS_TEST,
  APP_NAME,
  APP_VERSION,
  DEBUG_MODE,
};

export default env;
