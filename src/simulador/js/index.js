/**
 * Simulador Emergency Simulator
 * Hospital de Nunca Jamás - FIFA 2026
 * Main entry point for ES6 modules
 * @module simulador
 */

// Core modules
export { SimulatorState, state } from "./core/simulator-state.js";
export {
  VoiceEngine,
  voiceEngine,
  IMSS_NOMENCLATURE,
  SCIH_PRIORITY_PREFIX,
  CHANNEL_NAMES,
  expandIMSSAbbreviations,
  cleanVoiceText,
  buildSCIHMessage,
} from "./core/voice-engine.js";

// UI modules
export { ThemeManager, themeManager, SUPPORTED_THEMES, SPEED_OPTIONS } from "./ui/theme-manager.js";

// Scenarios
export {
  SCENARIOS,
  getScenario,
  getAllScenarios,
  getScenarioIds,
  getDefaultScenarioId,
} from "./scenarios/scenarios.js";

// Config
export { SIMULATOR_CONFIG, UserPreferences, userPreferences } from "./config/simulator-config.js";

// Utils
export {
  showToast,
  getElement,
  setText,
  toggleClass,
  addClass,
  removeClass,
  setAttribute,
  hide,
  show,
  queryAll,
  query,
  formatTime,
  calculatePercentage,
  updateClock,
  updateHeaderStat,
  updateSMVBanner,
  resetActionButtons,
  updateSVGText,
  switchTab,
  closeAllModals,
  setupKeyboardListener,
} from "./utils/dom-utils.js";

// Default exports
export { default as SimulatorState } from "./core/simulator-state.js";
export { default as VoiceEngine } from "./core/voice-engine.js";
export { default as ThemeManager } from "./ui/theme-manager.js";
export { default as SCENARIOS } from "./scenarios/scenarios.js";
export { default as SIMULATOR_CONFIG } from "./config/simulator-config.js";
export { default as DOMUtils } from "./utils/dom-utils.js";
