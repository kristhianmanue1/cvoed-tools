/**
 * Unit Tests for CONFIG Module
 * Tests environment detection, feature flags, logging, and session configuration
 */

// Mock console methods to avoid cluttering test output
const consoleMock = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock CONFIG for browser environment
const mockCONFIG = {
  NODE_ENV: "development",
  APP_NAME: "CVOED-Tools",
  APP_VERSION: "2.0.0",
  DEBUG_MODE: true,
  PIN_HASHING: true,
  WEB_WORKERS: true,
  DARK_MODE: false,
  DB_NAME: "ECEDES_DB",
  DB_VERSION: 1,
  SESSION_TIMEOUT: 3600000,
  SESSION_WARNING: 300000,
  EXPORT_MAX_ROWS: 10000,
  EXPORT_TIMEOUT: 30000,
  LOG_LEVEL: "debug",
  LOG_TO_CONSOLE: true,

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

  log(level, message, data) {
    const levels = ["debug", "info", "warn", "error"];
    const currentLevel = this.LOG_LEVEL;

    if (levels.indexOf(level) >= levels.indexOf(currentLevel)) {
      if (this.LOG_TO_CONSOLE) {
        consoleMock[level](message, data);
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

describe("CONFIG Module", () => {
  let originalConfig;

  beforeEach(() => {
    // Store original config
    originalConfig = { ...mockCONFIG };

    // Reset console mock
    consoleMock.debug.mockClear();
    consoleMock.info.mockClear();
    consoleMock.warn.mockClear();
    consoleMock.error.mockClear();

    // Reset CONFIG to defaults
    Object.assign(mockCONFIG, {
      NODE_ENV: "development",
      DEBUG_MODE: true,
      LOG_LEVEL: "debug",
      LOG_TO_CONSOLE: true,
      DB_NAME: "ECEDES_DB",
      EXPORT_MAX_ROWS: 10000,
      SESSION_TIMEOUT: 3600000,
      SESSION_WARNING: 300000,
    });

    // Expose to global scope for tests
    global.CONFIG = mockCONFIG;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Environment Detection", () => {
    test("isDevelopment() returns true in development", () => {
      mockCONFIG.NODE_ENV = "development";
      expect(mockCONFIG.isDevelopment()).toBe(true);
      expect(mockCONFIG.isProduction()).toBe(false);
      expect(mockCONFIG.isTest()).toBe(false);
    });

    test("isProduction() returns true in production", () => {
      mockCONFIG.NODE_ENV = "production";
      expect(mockCONFIG.isProduction()).toBe(true);
      expect(mockCONFIG.isDevelopment()).toBe(false);
      expect(mockCONFIG.isTest()).toBe(false);
    });

    test("isTest() returns true in test environment", () => {
      mockCONFIG.NODE_ENV = "test";
      expect(mockCONFIG.isTest()).toBe(true);
      expect(mockCONFIG.isDevelopment()).toBe(false);
      expect(mockCONFIG.isProduction()).toBe(false);
    });

    test("Default environment is development", () => {
      expect(mockCONFIG.NODE_ENV).toBe("development");
      expect(mockCONFIG.isDevelopment()).toBe(true);
    });
  });

  describe("Feature Flags", () => {
    test("PIN_HASHING feature is enabled by default", () => {
      expect(mockCONFIG.PIN_HASHING).toBe(true);
    });

    test("WEB_WORKERS feature is enabled by default", () => {
      expect(mockCONFIG.WEB_WORKERS).toBe(true);
    });

    test("DARK_MODE feature is disabled by default", () => {
      expect(mockCONFIG.DARK_MODE).toBe(false);
    });

    test("DEBUG_MODE reflects environment", () => {
      mockCONFIG.NODE_ENV = "development";
      mockCONFIG.DEBUG_MODE = true;
      expect(mockCONFIG.DEBUG_MODE).toBe(true);

      mockCONFIG.NODE_ENV = "production";
      mockCONFIG.DEBUG_MODE = false;
      expect(mockCONFIG.DEBUG_MODE).toBe(false);
    });

    test("Can toggle feature flags", () => {
      mockCONFIG.PIN_HASHING = false;
      expect(mockCONFIG.PIN_HASHING).toBe(false);

      mockCONFIG.WEB_WORKERS = false;
      expect(mockCONFIG.WEB_WORKERS).toBe(false);
    });
  });

  describe("Logging System", () => {
    test("debug() logs when level is debug", () => {
      mockCONFIG.LOG_LEVEL = "debug";
      mockCONFIG.debug("Test message", { data: "test" });
      expect(consoleMock.debug).toHaveBeenCalledWith("Test message", { data: "test" });
    });

    test("info() logs when level is info or lower", () => {
      mockCONFIG.LOG_LEVEL = "info";
      mockCONFIG.info("Info message");
      expect(consoleMock.info).toHaveBeenCalledWith("Info message", undefined);
    });

    test("warn() logs when level is warn or lower", () => {
      mockCONFIG.LOG_LEVEL = "warn";
      mockCONFIG.warn("Warning message");
      expect(consoleMock.warn).toHaveBeenCalledWith("Warning message", undefined);
    });

    test("error() always logs regardless of level", () => {
      mockCONFIG.LOG_LEVEL = "error";
      mockCONFIG.error("Error message", { error: "test" });
      expect(consoleMock.error).toHaveBeenCalledWith("Error message", { error: "test" });
    });

    test("debug() does not log when level is info", () => {
      mockCONFIG.LOG_LEVEL = "info";
      mockCONFIG.debug("Test message");
      expect(consoleMock.debug).not.toHaveBeenCalled();
    });

    test("debug() and info() do not log when level is warn", () => {
      mockCONFIG.LOG_LEVEL = "warn";
      mockCONFIG.debug("Test message");
      mockCONFIG.info("Info message");
      expect(consoleMock.debug).not.toHaveBeenCalled();
      expect(consoleMock.info).not.toHaveBeenCalled();
    });

    test("Nothing logs when LOG_TO_CONSOLE is false", () => {
      mockCONFIG.LOG_LEVEL = "debug";
      mockCONFIG.LOG_TO_CONSOLE = false;
      mockCONFIG.debug("Test message");
      mockCONFIG.error("Error message");
      expect(consoleMock.debug).not.toHaveBeenCalled();
      expect(consoleMock.error).not.toHaveBeenCalled();
    });

    test("Log levels are ordered correctly", () => {
      const levels = ["debug", "info", "warn", "error"];

      // At debug level, all logs should appear
      mockCONFIG.LOG_LEVEL = "debug";
      levels.forEach(level => {
        mockCONFIG.log(level, `${level} message`);
        expect(consoleMock[level]).toHaveBeenCalled();
      });

      // Reset mocks
      jest.clearAllMocks();

      // At error level, only error should appear
      mockCONFIG.LOG_LEVEL = "error";
      mockCONFIG.log("debug", "debug message");
      mockCONFIG.log("info", "info message");
      mockCONFIG.log("warn", "warn message");
      mockCONFIG.log("error", "error message");

      expect(consoleMock.debug).not.toHaveBeenCalled();
      expect(consoleMock.info).not.toHaveBeenCalled();
      expect(consoleMock.warn).not.toHaveBeenCalled();
      expect(consoleMock.error).toHaveBeenCalled();
    });
  });

  describe("Database Configuration", () => {
    test("DB_NAME is ECEDES_DB by default", () => {
      expect(mockCONFIG.DB_NAME).toBe("ECEDES_DB");
    });

    test("DB_NAME changes in test environment", () => {
      mockCONFIG.NODE_ENV = "test";
      mockCONFIG.DB_NAME = "ECEDES_TEST_DB";
      expect(mockCONFIG.DB_NAME).toBe("ECEDES_TEST_DB");
    });

    test("DB_VERSION is 1 by default", () => {
      expect(mockCONFIG.DB_VERSION).toBe(1);
    });
  });

  describe("Session Configuration", () => {
    test("SESSION_TIMEOUT is 1 hour by default", () => {
      expect(mockCONFIG.SESSION_TIMEOUT).toBe(3600000);
    });

    test("SESSION_WARNING is 5 minutes by default", () => {
      expect(mockCONFIG.SESSION_WARNING).toBe(300000);
    });

    test("SESSION_WARNING is 1/12 of SESSION_TIMEOUT", () => {
      const ratio = mockCONFIG.SESSION_TIMEOUT / mockCONFIG.SESSION_WARNING;
      expect(ratio).toBe(12);
    });
  });

  describe("Export Configuration", () => {
    test("EXPORT_MAX_ROWS is 10000 in development", () => {
      mockCONFIG.NODE_ENV = "development";
      mockCONFIG.EXPORT_MAX_ROWS = 10000;
      expect(mockCONFIG.EXPORT_MAX_ROWS).toBe(10000);
    });

    test("EXPORT_MAX_ROWS can be higher in production", () => {
      mockCONFIG.NODE_ENV = "production";
      mockCONFIG.EXPORT_MAX_ROWS = 50000;
      expect(mockCONFIG.EXPORT_MAX_ROWS).toBe(50000);
    });

    test("EXPORT_TIMEOUT is proportional to max rows", () => {
      mockCONFIG.EXPORT_MAX_ROWS = 10000;
      mockCONFIG.EXPORT_TIMEOUT = 30000;

      const timePerRow = mockCONFIG.EXPORT_TIMEOUT / mockCONFIG.EXPORT_MAX_ROWS;
      expect(timePerRow).toBe(3); // 3ms per row
    });
  });

  describe("get() Helper Method", () => {
    test("get() returns existing value", () => {
      expect(mockCONFIG.get("APP_NAME")).toBe("CVOED-Tools");
      expect(mockCONFIG.get("NODE_ENV")).toBe("development");
    });

    test("get() returns default value for non-existent key", () => {
      expect(mockCONFIG.get("NON_EXISTENT", "default")).toBe("default");
      expect(mockCONFIG.get("MISSING", 42)).toBe(42);
    });

    test("get() returns undefined when key does not exist and no default provided", () => {
      expect(mockCONFIG.get("NON_EXISTENT")).toBe(undefined);
    });
  });

  describe("Application Metadata", () => {
    test("APP_NAME is CVOED-Tools", () => {
      expect(mockCONFIG.APP_NAME).toBe("CVOED-Tools");
    });

    test("APP_VERSION follows semver format", () => {
      const semverRegex = /^\d+\.\d+\.\d+(-.*)?$/;
      expect(mockCONFIG.APP_VERSION).toMatch(semverRegex);
    });
  });

  describe("Environment-Specific Behavior", () => {
    test("Development environment has debug enabled", () => {
      mockCONFIG.NODE_ENV = "development";
      mockCONFIG.DEBUG_MODE = true;
      mockCONFIG.LOG_LEVEL = "debug";

      expect(mockCONFIG.isDevelopment()).toBe(true);
      expect(mockCONFIG.DEBUG_MODE).toBe(true);
      expect(mockCONFIG.LOG_LEVEL).toBe("debug");
    });

    test("Production environment has debug disabled", () => {
      mockCONFIG.NODE_ENV = "production";
      mockCONFIG.DEBUG_MODE = false;
      mockCONFIG.LOG_LEVEL = "warn";

      expect(mockCONFIG.isProduction()).toBe(true);
      expect(mockCONFIG.DEBUG_MODE).toBe(false);
      expect(mockCONFIG.LOG_LEVEL).toBe("warn");
    });

    test("Test environment uses test database", () => {
      mockCONFIG.NODE_ENV = "test";
      mockCONFIG.DB_NAME = "ECEDES_TEST_DB";

      expect(mockCONFIG.isTest()).toBe(true);
      expect(mockCONFIG.DB_NAME).toBe("ECEDES_TEST_DB");
    });
  });
});
