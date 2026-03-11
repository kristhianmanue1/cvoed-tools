/**
 * Unit Tests for ThemeManager
 * Hospital de Nunca Jamás - FIFA 2026
 */

import {
  ThemeManager,
  themeManager,
  SUPPORTED_THEMES,
  SPEED_OPTIONS,
} from "@/src/simulador/js/ui/theme-manager.js";

// Mock localStorage
const mockLocalStorage = {
  storage: {},
  getItem: jest.fn(key => mockLocalStorage.storage[key] || null),
  setItem: jest.fn((key, value) => {
    mockLocalStorage.storage[key] = String(value);
  }),
  clear: jest.fn(() => {
    mockLocalStorage.storage = {};
  }),
};

global.localStorage = mockLocalStorage;

// Mock document
const mockDocument = {
  documentElement: {
    setAttribute: jest.fn(),
    getAttribute: jest.fn(() => "dark"),
  },
  readyState: "complete",
  getElementById: jest.fn(id => {
    if (id === "dot-dark") {
      return { classList: { toggle: jest.fn() } };
    }
    if (id === "dot-light") {
      return { classList: { toggle: jest.fn() } };
    }
    if (id === "toggle-voice") {
      return { textContent: "" };
    }
    return null;
  }),
  addEventListener: jest.fn(),
  querySelectorAll: jest.fn(() => []),
};

global.document = mockDocument;

describe("ThemeManager", () => {
  let themeManagerInstance;

  beforeEach(() => {
    // Reset localStorage before each test
    mockLocalStorage.storage = {};
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();

    // Reset document mocks
    mockDocument.documentElement.setAttribute.mockClear();
    mockDocument.getElementById.mockClear();

    themeManagerInstance = new ThemeManager();
  });

  describe("constructor", () => {
    test("should initialize with default theme", () => {
      expect(themeManagerInstance.getTheme()).toBe("dark");
    });

    test("should initialize with voice enabled", () => {
      expect(themeManagerInstance.isVoiceEnabled()).toBe(true);
    });

    test("should initialize with default speed", () => {
      expect(themeManagerInstance.getSpeed()).toBe(4000);
    });
  });

  describe("theme management", () => {
    test("should set valid theme", () => {
      expect(themeManagerInstance.setTheme("light")).toBe(true);
      expect(themeManagerInstance.getTheme()).toBe("light");
    });

    test("should reject invalid theme", () => {
      expect(themeManagerInstance.setTheme("blue")).toBe(false);
      expect(themeManagerInstance.getTheme()).toBe("dark");
    });

    test("should toggle theme", () => {
      expect(themeManagerInstance.getTheme()).toBe("dark");
      const newTheme = themeManagerInstance.toggleTheme();
      expect(newTheme).toBe("light");
      expect(themeManagerInstance.getTheme()).toBe("light");
    });

    test("should check if dark theme", () => {
      themeManagerInstance.setTheme("dark");
      expect(themeManagerInstance.isDark()).toBe(true);
      expect(themeManagerInstance.isLight()).toBe(false);
    });

    test("should check if light theme", () => {
      themeManagerInstance.setTheme("light");
      expect(themeManagerInstance.isLight()).toBe(true);
      expect(themeManagerInstance.isDark()).toBe(false);
    });

    test("should apply theme to document", () => {
      themeManagerInstance.setTheme("light");
      expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith("data-theme", "light");
    });
  });

  describe("voice management", () => {
    test("should set voice enabled state", () => {
      themeManagerInstance.setVoiceEnabled(false);
      expect(themeManagerInstance.isVoiceEnabled()).toBe(false);
      themeManagerInstance.setVoiceEnabled(true);
      expect(themeManagerInstance.isVoiceEnabled()).toBe(true);
    });

    test("should toggle voice", () => {
      expect(themeManagerInstance.toggleVoice()).toBe(false);
      expect(themeManagerInstance.toggleVoice()).toBe(true);
    });
  });

  describe("speed management", () => {
    test("should set speed", () => {
      themeManagerInstance.setSpeed(2000);
      expect(themeManagerInstance.getSpeed()).toBe(2000);
    });
  });

  describe("localStorage persistence", () => {
    test("should save theme to localStorage", () => {
      themeManagerInstance.setTheme("light");
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("cvoed-theme", "light");
    });

    test("should save voice state to localStorage", () => {
      themeManagerInstance.setVoiceEnabled(false);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("cvoed-voice", "false");
    });

    test("should save speed to localStorage", () => {
      themeManagerInstance.setSpeed(2000);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("cvoed-speed", "2000");
    });

    test("should load theme from localStorage if exists", () => {
      mockLocalStorage.storage["cvoed-theme"] = "light";
      const tm = new ThemeManager();
      expect(tm.getTheme()).toBe("light");
    });

    test("should load voice state from localStorage if disabled", () => {
      mockLocalStorage.storage["cvoed-voice"] = "false";
      const tm = new ThemeManager();
      expect(tm.isVoiceEnabled()).toBe(false);
    });

    test("should load speed from localStorage if exists", () => {
      mockLocalStorage.storage["cvoed-speed"] = "2000";
      const tm = new ThemeManager();
      expect(tm.getSpeed()).toBe(2000);
    });
  });

  describe("reset to defaults", () => {
    test("should reset all preferences", () => {
      themeManagerInstance.setTheme("light");
      themeManagerInstance.setVoiceEnabled(false);
      themeManagerInstance.setSpeed(2000);

      themeManagerInstance.resetToDefaults();

      expect(themeManagerInstance.getTheme()).toBe("dark");
      expect(themeManagerInstance.isVoiceEnabled()).toBe(true);
      expect(themeManagerInstance.getSpeed()).toBe(4000);
    });
  });

  describe("SUPPORTED_THEMES constant", () => {
    test("should have dark and light themes", () => {
      expect(SUPPORTED_THEMES).toContain("dark");
      expect(SUPPORTED_THEMES).toContain("light");
    });
  });

  describe("SPEED_OPTIONS constant", () => {
    test("should have slow, normal, and fast options", () => {
      expect(SPEED_OPTIONS.slow).toBeDefined();
      expect(SPEED_OPTIONS.normal).toBeDefined();
      expect(SPEED_OPTIONS.fast).toBeDefined();
    });

    test("slow should be greater than normal", () => {
      expect(SPEED_OPTIONS.slow).toBeGreaterThan(SPEED_OPTIONS.normal);
    });

    test("normal should be greater than fast", () => {
      expect(SPEED_OPTIONS.normal).toBeGreaterThan(SPEED_OPTIONS.fast);
    });
  });

  describe("singleton instance", () => {
    test("should export a singleton themeManager instance", () => {
      expect(themeManager).toBeInstanceOf(ThemeManager);
    });
  });
});
