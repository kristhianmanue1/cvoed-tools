// ============================================
// CONFIG MODULE - Environment Variables
// ============================================

/**
 * Configuration object for CVOED-Tools
 * Provides environment-based configuration for development, test, and production
 */
const ENV = {
  // Application
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_NAME: process.env.APP_NAME || "CVOED-Tools",
  APP_VERSION: process.env.APP_VERSION || "2.0.0",
  API_URL: process.env.API_URL || "http://localhost:8000",

  // Features
  PIN_HASHING: process.env.FEATURE_PIN_HASHING === "true",
  WEB_WORKERS: process.env.FEATURE_WEB_WORKERS === "true",
  DARK_MODE: process.env.FEATURE_DARK_MODE === "true",
  DEBUG_MODE: process.env.FEATURE_DEBUG_MODE === "true",

  // Database
  DB_NAME: process.env.DB_NAME || "ECEDES_DB",
  DB_VERSION: parseInt(process.env.DB_VERSION, 10) || 1,
  DB_TIMEOUT: parseInt(process.env.DB_TIMEOUT, 10) || 5000,

  // Export
  EXPORT_MAX_ROWS: parseInt(process.env.EXPORT_MAX_ROWS, 10) || 10000,
  EXPORT_TIMEOUT: parseInt(process.env.EXPORT_TIMEOUT, 10) || 30000,

  // Session
  SESSION_TIMEOUT: parseInt(process.env.SESSION_TIMEOUT, 10) || 3600000,
  SESSION_WARNING: parseInt(process.env.SESSION_WARNING, 10) || 300000,

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  LOG_TO_CONSOLE: process.env.LOG_TO_CONSOLE === "true",

  // Testing
  TEST_TIMEOUT: parseInt(process.env.TEST_TIMEOUT, 10) || 5000,
  HEADLESS: process.env.HEADLESS === "true",

  // Build
  BUILD_MINIFY: process.env.BUILD_MINIFY === "true",
  BUILD_SOURCEMAPS: process.env.BUILD_SOURCEMAPS !== "false",

  // Helper methods
  isDevelopment() {
    return this.NODE_ENV === "development";
  },

  isProduction() {
    return this.NODE_ENV === "production";
  },

  isTest() {
    return this.NODE_ENV === "test";
  },

  get(key, defaultValue) {
    return this[key] !== undefined ? this[key] : defaultValue;
  },
};

// Freeze para evitar modificaciones
Object.freeze(ENV);

// Export for use in Node.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = ENV;
}
