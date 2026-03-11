/**
 * Theme Manager - RAMS-IVE Clinical
 * Dual color system for hospital environments
 * Hospital de Nunca Jamás - FIFA 2026
 * @module ui/theme-manager
 */

/**
 * Local storage key for theme preference
 * @constant {string}
 */
const THEME_STORAGE_KEY = "cvoed-theme";

/**
 * Local storage key for voice preference
 * @constant {string}
 */
const VOICE_STORAGE_KEY = "cvoed-voice";

/**
 * Local storage key for simulation speed
 * @constant {string}
 */
const SPEED_STORAGE_KEY = "cvoed-speed";

/**
 * Supported themes
 * @constant {Array<string>}
 */
export const SUPPORTED_THEMES = ["dark", "light"];

/**
 * Simulation speed options (milliseconds per simulated minute)
 * @constant {Object}
 */
export const SPEED_OPTIONS = {
  slow: 8000,
  normal: 4000,
  fast: 2000,
};

/**
 * ThemeManager - Manages application theme and UI preferences
 */
export class ThemeManager {
  /**
   * Creates a new ThemeManager instance
   */
  constructor() {
    this.currentTheme = this.loadTheme();
    this.voiceEnabled = this.loadVoiceEnabled();
    this.simulationSpeed = this.loadSpeed();
    this.applyTheme(this.currentTheme);
  }

  /**
   * Loads theme from localStorage or returns default
   * @returns {string} The loaded theme
   */
  loadTheme() {
    if (typeof localStorage === "undefined") return "dark";
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && SUPPORTED_THEMES.includes(stored)) {
      return stored;
    }
    return "dark";
  }

  /**
   * Loads voice enabled state from localStorage
   * @returns {boolean} Whether voice is enabled
   */
  loadVoiceEnabled() {
    if (typeof localStorage === "undefined") return true;
    const stored = localStorage.getItem(VOICE_STORAGE_KEY);
    return stored !== "false";
  }

  /**
   * Loads simulation speed from localStorage
   * @returns {number} The simulation speed in milliseconds
   */
  loadSpeed() {
    if (typeof localStorage === "undefined") return SPEED_OPTIONS.normal;
    const stored = localStorage.getItem(SPEED_STORAGE_KEY);
    return parseInt(stored, 10) || SPEED_OPTIONS.normal;
  }

  /**
   * Sets the current theme
   * @param {string} theme - The theme to set ('dark' or 'light')
   * @returns {boolean} True if theme was set successfully
   */
  setTheme(theme) {
    if (!SUPPORTED_THEMES.includes(theme)) {
      console.warn(`[ThemeManager] Unsupported theme: ${theme}`);
      return false;
    }
    this.currentTheme = theme;
    this.applyTheme(theme);
    this.saveTheme(theme);
    this.updateThemeButtons();
    return true;
  }

  /**
   * Toggles between dark and light themes
   * @returns {string} The new theme
   */
  toggleTheme() {
    const newTheme = this.currentTheme === "dark" ? "light" : "dark";
    this.setTheme(newTheme);
    return newTheme;
  }

  /**
   * Gets the current theme
   * @returns {string} The current theme
   */
  getTheme() {
    return this.currentTheme;
  }

  /**
   * Checks if the current theme is dark
   * @returns {boolean} True if dark theme
   */
  isDark() {
    return this.currentTheme === "dark";
  }

  /**
   * Checks if the current theme is light
   * @returns {boolean} True if light theme
   */
  isLight() {
    return this.currentTheme === "light";
  }

  /**
   * Applies theme to document
   * @param {string} theme - The theme to apply
   */
  applyTheme(theme) {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }

  /**
   * Saves theme to localStorage
   * @param {string} theme - The theme to save
   */
  saveTheme(theme) {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }

  /**
   * Sets voice enabled state
   * @param {boolean} enabled - Whether voice should be enabled
   */
  setVoiceEnabled(enabled) {
    this.voiceEnabled = enabled;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(VOICE_STORAGE_KEY, String(enabled));
    }
  }

  /**
   * Toggles voice enabled state
   * @returns {boolean} The new voice enabled state
   */
  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(VOICE_STORAGE_KEY, String(this.voiceEnabled));
    }
    return this.voiceEnabled;
  }

  /**
   * Gets voice enabled state
   * @returns {boolean} Whether voice is enabled
   */
  isVoiceEnabled() {
    return this.voiceEnabled;
  }

  /**
   * Sets simulation speed
   * @param {number} speed - The speed in milliseconds
   */
  setSpeed(speed) {
    this.simulationSpeed = speed;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(SPEED_STORAGE_KEY, String(speed));
    }
  }

  /**
   * Gets simulation speed
   * @returns {number} The simulation speed in milliseconds
   */
  getSpeed() {
    return this.simulationSpeed;
  }

  /**
   * Updates theme button visual states
   */
  updateThemeButtons() {
    if (typeof document === "undefined") return;

    const dotDark = document.getElementById("dot-dark");
    const dotLight = document.getElementById("dot-light");

    if (dotDark && dotLight) {
      dotDark.classList.toggle("active", this.currentTheme === "dark");
      dotLight.classList.toggle("active", this.currentTheme === "light");
    }
  }

  /**
   * Updates voice button visual state
   */
  updateVoiceButton() {
    if (typeof document === "undefined") return;

    const btn = document.getElementById("toggle-voice");
    if (btn) {
      btn.textContent = this.voiceEnabled ? "🔊" : "🔇";
    }
  }

  /**
   * Resets all preferences to defaults
   */
  resetToDefaults() {
    this.setTheme("dark");
    this.setVoiceEnabled(true);
    this.setSpeed(SPEED_OPTIONS.normal);
  }
}

/**
 * Creates a singleton instance of ThemeManager
 * @type {ThemeManager}
 */
export const themeManager = new ThemeManager();

/**
 * Initializes theme manager on DOM ready
 */
function initThemeManager() {
  themeManager.updateThemeButtons();
  themeManager.updateVoiceButton();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThemeManager);
  } else {
    initThemeManager();
  }
}

export default ThemeManager;
