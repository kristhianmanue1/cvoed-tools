/**
 * Simulator Configuration
 * Hospital de Nunca Jamás - FIFA 2026
 * @module config/simulator-config
 */

import { getDefaultScenarioId } from "../scenarios/scenarios.js";
import { themeManager } from "../ui/theme-manager.js";

/**
 * Simulator configuration object
 * @constant {Object}
 */
export const SIMULATOR_CONFIG = {
  // Timer settings
  TIMER_INTERVAL: 4000, // Milliseconds per simulated minute

  // Speed options
  SPEED_OPTIONS: {
    slow: 8000,
    normal: 4000,
    fast: 2000,
  },

  // Scenario settings
  DEFAULT_SCENARIO: getDefaultScenarioId(),

  // UI settings
  DEFAULT_THEME: "dark",
  DEFAULT_VOICE_ENABLED: true,
  DEFAULT_SPEED: 4000,

  // Hospital capacity
  HOSPITAL_CAPACITY: {
    uci: { capacity: 8, occupied: 7 },
    urgencias: { capacity: 39, occupied: 35 },
    expansion: 80,
  },

  // SMV grade thresholds
  SMV_THRESHOLDS: {
    GRADE_I: 5, // 5-20 victims
    GRADE_II: 20, // 21-50 victims
    GRADE_III: 50, // 51+ victims
  },

  // Time thresholds for optimal decision making
  TIME_THRESHOLDS: {
    SMV_ACTIVATION: 15, // SMV should be activated within 15 minutes
    TRIAGE_EXTERNAL: 10, // Triage external within 10 minutes
    VOCERO_DESIGNATION: 25, // Vocero within 25 minutes
  },

  // EVACH groups for evacuation
  EVACH_GROUPS: {
    GROUP_1: {
      name: "Grupo 1",
      description: "Ambulatorios, pueden caminar sin ayuda",
      priority: 4,
      color: "#16A34A",
    },
    GROUP_2: {
      name: "Grupo 2",
      description: "Requieren ayuda para caminar, estables",
      priority: 3,
      color: "#F59E0B",
    },
    GROUP_3: {
      name: "Grupo 3",
      description: "Inestables pero pueden ser transportados",
      priority: 1,
      color: "#DC2626",
    },
    GROUP_4: {
      name: "Grupo 4",
      description: "Críticos, requieren VM o vasopresores",
      priority: 2,
      color: "#DC2626",
    },
    GROUP_5: {
      name: "Grupo 5",
      description: "Expectantes, fallecidos o no transportables",
      priority: 5,
      color: "#374151",
    },
  },

  // Triage colors
  TRIAGE_COLORS: {
    red: "#DC2626",
    yellow: "#F59E0B",
    green: "#16A34A",
    black: "#374151",
  },

  // Feedback messages
  FEEDBACK_MESSAGES: {
    SMV_LATE: "⚠ Código SMV declarado en T+{time}. Retraso de {delay} minutos sobre el criterio óptimo.",
    SMV_CORRECT: "✓ Código SMV Grado {grade} declarado en T+{time}. {comment}",
    TRIAGE_LATE: "⚠ Sin triage externo, pacientes ingresaron sin clasificar. Urgencias saturada.",
    VOCERO_LATE: "⚠ CONSECUENCIA: Cadena de televisión entrevistó a personal de pasillo. Información contradictoria.",
    QBRNE_WITHOUT_CRITERIA: "⚠ QBRNE activado sin criterio confirmado. 40% personal en EPP. UCI sin cobertura 12 min.",
    DISCAP_NOT_IDENTIFIED: "⚠ Pacientes con discapacidad no fueron identificados en plan de evacuación.",
    MOVE_SURGERY: "⚠ Paciente con tórax abierto evacuado — alto riesgo de exanguinación en traslado.",
    GRADE_II_INSUFFICIENT: "⚠ Grado II insuficiente para 120 víctimas. Recursos subestimados.",
    CVOED_NOT_NOTIFIED: "⚠ CVOED no notificado. Coordinación RISS retrasada 20 minutos.",
  },
};

/**
 * User preferences stored in localStorage
 */
export class UserPreferences {
  constructor() {
    this.storageKey = "cvoed-sim-prefs";
    this.preferences = this.load();
  }

  load() {
    if (typeof localStorage === "undefined") {
      return this.getDefaults();
    }
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? { ...this.getDefaults(), ...JSON.parse(stored) } : this.getDefaults();
    } catch (e) {
      console.error("[UserPreferences] Error loading preferences:", e);
      return this.getDefaults();
    }
  }

  getDefaults() {
    return {
      scenarioId: SIMULATOR_CONFIG.DEFAULT_SCENARIO,
      theme: SIMULATOR_CONFIG.DEFAULT_THEME,
      voiceEnabled: SIMULATOR_CONFIG.DEFAULT_VOICE_ENABLED,
      speed: SIMULATOR_CONFIG.DEFAULT_SPEED,
      recentScenarios: [],
    };
  }

  save() {
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
      } catch (e) {
        console.error("[UserPreferences] Error saving preferences:", e);
      }
    }
  }

  get(key) {
    return this.preferences[key];
  }

  set(key, value) {
    this.preferences[key] = value;
    this.save();
  }

  reset() {
    this.preferences = this.getDefaults();
    this.save();
  }

  addRecentScenario(scenarioId) {
    const { recentScenarios } = this.preferences;
    const updated = [scenarioId, ...recentScenarios.filter(id => id !== scenarioId)].slice(0, 5);
    this.preferences.recentScenarios = updated;
    this.save();
  }
}

/**
 * Creates a singleton instance of UserPreferences
 * @type {UserPreferences}
 */
export const userPreferences = new UserPreferences();

export default SIMULATOR_CONFIG;
