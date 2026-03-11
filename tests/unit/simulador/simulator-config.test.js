/**
 * Unit Tests for Simulator Configuration
 * Hospital de Nunca Jamás - FIFA 2026
 */

import {
  SIMULATOR_CONFIG,
  UserPreferences,
  userPreferences,
} from "@/src/simulador/js/config/simulator-config.js";

describe("SIMULATOR_CONFIG", () => {
  describe("timer settings", () => {
    test("should have TIMER_INTERVAL defined", () => {
      expect(SIMULATOR_CONFIG.TIMER_INTERVAL).toBe(4000);
    });

    test("should have SPEED_OPTIONS with all speeds", () => {
      expect(SIMULATOR_CONFIG.SPEED_OPTIONS).toEqual({
        slow: 8000,
        normal: 4000,
        fast: 2000,
      });
    });
  });

  describe("scenario settings", () => {
    test("should have DEFAULT_SCENARIO", () => {
      expect(SIMULATOR_CONFIG.DEFAULT_SCENARIO).toBeDefined();
      expect(typeof SIMULATOR_CONFIG.DEFAULT_SCENARIO).toBe("string");
    });

    test("should have DEFAULT_THEME as dark", () => {
      expect(SIMULATOR_CONFIG.DEFAULT_THEME).toBe("dark");
    });

    test("should have DEFAULT_VOICE_ENABLED as true", () => {
      expect(SIMULATOR_CONFIG.DEFAULT_VOICE_ENABLED).toBe(true);
    });
  });

  describe("hospital capacity", () => {
    test("should have HOSPITAL_CAPACITY with correct structure", () => {
      const { HOSPITAL_CAPACITY } = SIMULATOR_CONFIG;

      expect(HOSPITAL_CAPACITY).toBeDefined();
      expect(HOSPITAL_CAPACITY.uci).toBeDefined();
      expect(HOSPITAL_CAPACITY.urgencias).toBeDefined();
      expect(HOSPITAL_CAPACITY.expansion).toBeDefined();
    });

    test("should have UCI capacity and occupied", () => {
      const { uci } = SIMULATOR_CONFIG.HOSPITAL_CAPACITY;

      expect(uci.capacity).toBe(8);
      expect(uci.occupied).toBe(7);
    });

    test("should have urgencias capacity and occupied", () => {
      const { urgencias } = SIMULATOR_CONFIG.HOSPITAL_CAPACITY;

      expect(urgencias.capacity).toBe(39);
      expect(urgencias.occupied).toBe(35);
    });

    test("should have expansion capacity", () => {
      expect(SIMULATOR_CONFIG.HOSPITAL_CAPACITY.expansion).toBe(80);
    });
  });

  describe("SMV thresholds", () => {
    test("should have SMV_THRESHOLDS defined", () => {
      const { SMV_THRESHOLDS } = SIMULATOR_CONFIG;

      expect(SMV_THRESHOLDS.GRADE_I).toBe(5);
      expect(SMV_THRESHOLDS.GRADE_II).toBe(20);
      expect(SMV_THRESHOLDS.GRADE_III).toBe(50);
    });
  });

  describe("time thresholds", () => {
    test("should have TIME_THRESHOLDS for optimal decisions", () => {
      const { TIME_THRESHOLDS } = SIMULATOR_CONFIG;

      expect(TIME_THRESHOLDS.SMV_ACTIVATION).toBe(15);
      expect(TIME_THRESHOLDS.TRIAGE_EXTERNAL).toBe(10);
      expect(TIME_THRESHOLDS.VOCERO_DESIGNATION).toBe(25);
    });
  });

  describe("EVACH groups", () => {
    test("should have 5 EVACH groups", () => {
      const { EVACH_GROUPS } = SIMULATOR_CONFIG;

      expect(Object.keys(EVACH_GROUPS).length).toBe(5);
    });

    test("should have Group 1 - ambulatorios", () => {
      const group = SIMULATOR_CONFIG.EVACH_GROUPS.GROUP_1;

      expect(group.name).toBe("Grupo 1");
      expect(group.priority).toBe(4);
      expect(group.color).toBe("#16A34A");
      expect(group.description).toContain("Ambulatorios");
    });

    test("should have Group 3 - inestables", () => {
      const group = SIMULATOR_CONFIG.EVACH_GROUPS.GROUP_3;

      expect(group.name).toBe("Grupo 3");
      expect(group.priority).toBe(1);
      expect(group.color).toBe("#DC2626");
      expect(group.description).toContain("Inestables");
    });

    test("should have Group 5 - expectantes", () => {
      const group = SIMULATOR_CONFIG.EVACH_GROUPS.GROUP_5;

      expect(group.name).toBe("Grupo 5");
      expect(group.priority).toBe(5);
      expect(group.color).toBe("#374151");
      expect(group.description).toContain("Expectantes");
    });
  });

  describe("triage colors", () => {
    test("should have TRIAGE_COLORS defined", () => {
      const { TRIAGE_COLORS } = SIMULATOR_CONFIG;

      expect(TRIAGE_COLORS.red).toBe("#DC2626");
      expect(TRIAGE_COLORS.yellow).toBe("#F59E0B");
      expect(TRIAGE_COLORS.green).toBe("#16A34A");
      expect(TRIAGE_COLORS.black).toBe("#374151");
    });
  });

  describe("feedback messages", () => {
    test("should have FEEDBACK_MESSAGES defined", () => {
      const { FEEDBACK_MESSAGES } = SIMULATOR_CONFIG;

      expect(Object.keys(FEEDBACK_MESSAGES).length).toBeGreaterThan(0);
    });

    test("should have SMV_LATE message with placeholders", () => {
      const msg = SIMULATOR_CONFIG.FEEDBACK_MESSAGES.SMV_LATE;

      expect(msg).toContain("{time}");
      expect(msg).toContain("{delay}");
    });

    test("should have SMV_CORRECT message with placeholders", () => {
      const msg = SIMULATOR_CONFIG.FEEDBACK_MESSAGES.SMV_CORRECT;

      expect(msg).toContain("{grade}");
      expect(msg).toContain("{time}");
      expect(msg).toContain("{comment}");
    });
  });
});

describe("UserPreferences", () => {
  let userPrefs;

  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
          store[key] = value.toString();
        },
        clear: () => {
          store = {};
        },
        removeItem: (key) => {
          delete store[key];
        },
      };
    })();

    Object.defineProperty(global, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    userPrefs = new UserPreferences();
  });

  afterEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  describe("initialization", () => {
    test("should initialize with defaults", () => {
      const defaults = userPrefs.getDefaults();

      expect(defaults.scenarioId).toBeDefined();
      expect(defaults.theme).toBe("dark");
      expect(defaults.voiceEnabled).toBe(true);
      expect(defaults.speed).toBe(4000);
      expect(defaults.recentScenarios).toEqual([]);
    });
  });

  describe("load", () => {
    test("should load defaults when localStorage is empty", () => {
      userPrefs.preferences = userPrefs.load();

      expect(userPrefs.preferences).toEqual(userPrefs.getDefaults());
    });

    test("should load and merge with stored preferences", () => {
      localStorage.setItem(userPrefs.storageKey, JSON.stringify({ theme: "light" }));

      userPrefs.preferences = userPrefs.load();

      expect(userPrefs.preferences.theme).toBe("light");
      expect(userPrefs.preferences.scenarioId).toBeDefined(); // Merged from defaults
    });

    test("should handle JSON parse errors gracefully", () => {
      localStorage.setItem(userPrefs.storageKey, "invalid json");

      const prefs = userPrefs.load();

      expect(prefs).toEqual(userPrefs.getDefaults());
    });
  });

  describe("save", () => {
    test("should save preferences to localStorage", () => {
      userPrefs.preferences = { theme: "light", voiceEnabled: false };
      userPrefs.save();

      const stored = localStorage.getItem(userPrefs.storageKey);
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored);
      expect(parsed.theme).toBe("light");
      expect(parsed.voiceEnabled).toBe(false);
    });

    test("should handle save errors gracefully", () => {
      // Mock localStorage to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error("Storage full");
      });

      expect(() => userPrefs.save()).not.toThrow();

      localStorage.setItem = originalSetItem;
    });
  });

  describe("get", () => {
    test("should return preference value", () => {
      userPrefs.preferences = { theme: "dark" };

      expect(userPrefs.get("theme")).toBe("dark");
    });

    test("should return undefined for non-existent key", () => {
      expect(userPrefs.get("nonexistent")).toBeUndefined();
    });
  });

  describe("set", () => {
    test("should set preference value and save", () => {
      userPrefs.set("theme", "light");

      expect(userPrefs.preferences.theme).toBe("light");

      const stored = localStorage.getItem(userPrefs.storageKey);
      expect(JSON.parse(stored).theme).toBe("light");
    });
  });

  describe("reset", () => {
    test("should reset to defaults and save", () => {
      userPrefs.preferences = { theme: "light", custom: true };
      userPrefs.reset();

      expect(userPrefs.preferences).toEqual(userPrefs.getDefaults());

      const stored = localStorage.getItem(userPrefs.storageKey);
      const parsed = JSON.parse(stored);
      expect(parsed.theme).toBe("dark");
      expect(parsed.custom).toBeUndefined();
    });
  });

  describe("addRecentScenario", () => {
    test("should add scenario to recent scenarios", () => {
      userPrefs.preferences.recentScenarios = [];

      userPrefs.addRecentScenario("S3");

      expect(userPrefs.preferences.recentScenarios).toEqual(["S3"]);
    });

    test("should move scenario to front if already exists", () => {
      userPrefs.preferences.recentScenarios = ["S1", "S2", "S3"];

      userPrefs.addRecentScenario("S2");

      expect(userPrefs.preferences.recentScenarios).toEqual(["S2", "S1", "S3"]);
    });

    test("should limit recent scenarios to 5", () => {
      userPrefs.preferences.recentScenarios = ["S1", "S2", "S3", "S4", "S5"];

      userPrefs.addRecentScenario("S6");

      expect(userPrefs.preferences.recentScenarios).toEqual(["S6", "S1", "S2", "S3", "S4"]);
      expect(userPrefs.preferences.recentScenarios.length).toBe(5);
    });
  });
});

describe("userPreferences singleton", () => {
  test("should export singleton instance", () => {
    expect(userPreferences).toBeInstanceOf(UserPreferences);
  });

  test("should have same instance across imports", () => {
    const pref1 = userPreferences;
    const pref2 = userPreferences;

    expect(pref1).toBe(pref2);
  });
});
