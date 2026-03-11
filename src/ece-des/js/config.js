// ============================================
// CONFIG MODULE - Browser Environment
// ============================================

/**
 * Browser-based configuration for CVOED-Tools ECE-DES
 * Automatically detects environment based on hostname and URL parameters
 */
(function () {
  // Determinar ambiente actual
  const isDev =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.port === "8000";
  const isTest = window.location.search.includes("test=true");

  const CONFIG = {
    // Environment
    NODE_ENV: isTest ? "test" : isDev ? "development" : "production",

    // Application
    APP_NAME: "CVOED-Tools",
    APP_VERSION: "2.0.0",

    // Features
    DEBUG_MODE: isDev || isTest,
    PIN_HASHING: true,
    WEB_WORKERS: typeof Worker !== "undefined",
    DARK_MODE: false,

    // Database
    DB_NAME: isTest ? "ECEDES_TEST_DB" : "ECEDES_DB",
    DB_VERSION: 1,

    // Session
    SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hora
    SESSION_WARNING: 5 * 60 * 1000, // 5 min

    // Export
    EXPORT_MAX_ROWS: isDev ? 1000 : 50000,
    EXPORT_TIMEOUT: isDev ? 10000 : 60000,

    // Logging
    LOG_LEVEL: isDev ? "debug" : "warn",
    LOG_TO_CONSOLE: isDev,

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

    // Logging
    log(level, message, data) {
      const levels = ["debug", "info", "warn", "error"];
      const currentLevel = this.LOG_LEVEL;

      if (levels.indexOf(level) >= levels.indexOf(currentLevel)) {
        if (this.LOG_TO_CONSOLE) {
          const timestamp = new Date().toISOString();
          const prefix = `[${timestamp}] [${this.APP_NAME}] [${level.toUpperCase()}]`;
          const args = data !== undefined ? [prefix, message, data] : [prefix, message];
          console[level](...args);
        }
      }
    },

    debug(message, data) {
      this.log("debug", message, data);
    },

    info(message, data) {
      this.log("info", message, data);
    },

    warn(message, data) {
      this.log("warn", message, data);
    },

    error(message, data) {
      this.log("error", message, data);
    },
  };

  // Expose to global scope
  window.CONFIG = CONFIG;

  // Log initialization if in debug mode
  if (CONFIG.DEBUG_MODE && CONFIG.LOG_TO_CONSOLE) {
    CONFIG.info("CONFIG initialized", {
      NODE_ENV: CONFIG.NODE_ENV,
      DB_NAME: CONFIG.DB_NAME,
      DEBUG_MODE: CONFIG.DEBUG_MODE,
      LOG_LEVEL: CONFIG.LOG_LEVEL,
    });
  }
})();
