/**
 * DOM Utilities
 * Hospital de Nunca Jamás - FIFA 2026
 * @module utils/dom-utils
 */

/**
 * Shows a toast notification
 * @param {string} message - The message to display
 * @param {number} duration - Duration in milliseconds (default: 6000)
 */
export function showToast(message, duration = 6000) {
  if (typeof document === "undefined") return;

  const toast = document.getElementById("consequence-toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("visible");

  // Clear existing timeout
  if (toast._timeout) {
    clearTimeout(toast._timeout);
  }

  // Set new timeout
  toast._timeout = setTimeout(() => {
    toast.classList.remove("visible");
  }, duration);
}

/**
 * Gets an element by ID with error handling
 * @param {string} id - The element ID
 * @returns {HTMLElement|null} The element or null if not found
 */
export function getElement(id) {
  if (typeof document === "undefined") return null;
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`[DOM] Element not found: ${id}`);
  }
  return element;
}

/**
 * Sets the text content of an element by ID
 * @param {string} id - The element ID
 * @param {string} text - The text content
 * @returns {boolean} True if successful
 */
export function setText(id, text) {
  const element = getElement(id);
  if (element) {
    element.textContent = text;
    return true;
  }
  return false;
}

/**
 * Toggles a CSS class on an element
 * @param {string} id - The element ID
 * @param {string} className - The class name
 * @param {boolean} force - Optional force state
 * @returns {boolean} True if successful
 */
export function toggleClass(id, className, force) {
  const element = getElement(id);
  if (element) {
    element.classList.toggle(className, force);
    return true;
  }
  return false;
}

/**
 * Adds a CSS class to an element
 * @param {string} id - The element ID
 * @param {string} className - The class name
 * @returns {boolean} True if successful
 */
export function addClass(id, className) {
  const element = getElement(id);
  if (element) {
    element.classList.add(className);
    return true;
  }
  return false;
}

/**
 * Removes a CSS class from an element
 * @param {string} id - The element ID
 * @param {string} className - The class name
 * @returns {boolean} True if successful
 */
export function removeClass(id, className) {
  const element = getElement(id);
  if (element) {
    element.classList.remove(className);
    return true;
  }
  return false;
}

/**
 * Sets an attribute on an element
 * @param {string} id - The element ID
 * @param {string} attr - The attribute name
 * @param {string} value - The attribute value
 * @returns {boolean} True if successful
 */
export function setAttribute(id, attr, value) {
  const element = getElement(id);
  if (element) {
    element.setAttribute(attr, value);
    return true;
  }
  return false;
}

/**
 * Hides an element
 * @param {string} id - The element ID
 * @returns {boolean} True if successful
 */
export function hide(id) {
  return addClass(id, "hidden");
}

/**
 * Shows an element by removing 'hidden' class
 * @param {string} id - The element ID
 * @returns {boolean} True if successful
 */
export function show(id) {
  return removeClass(id, "hidden");
}

/**
 * Queries for elements by selector
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (default: document)
 * @returns {NodeList} The matched elements
 */
export function queryAll(selector, parent) {
  if (typeof document === "undefined") return [];
  const root = parent || document;
  return root.querySelectorAll(selector);
}

/**
 * Queries for a single element by selector
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (default: document)
 * @returns {Element|null} The matched element or null
 */
export function query(selector, parent) {
  if (typeof document === "undefined") return null;
  const root = parent || document;
  return root.querySelector(selector);
}

/**
 * Formats a time value as T+MM
 * @param {number} minutes - Time in minutes
 * @returns {string} Formatted time string
 */
export function formatTime(minutes) {
  return `T+${String(minutes).padStart(2, "0")}`;
}

/**
 * Formats a percentage
 * @param {number} value - The value
 * @param {number} total - The total
 * @returns {number} The percentage
 */
export function calculatePercentage(value, total) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Updates the main clock display
 * @param {number} currentTime - Current simulation time
 */
export function updateClock(currentTime) {
  const el = getElement("main-clock");
  if (el) {
    el.textContent = formatTime(currentTime);
    el.classList.toggle("urgent", currentTime > 30);
  }
}

/**
 * Updates a header stat display
 * @param {string} elementId - The element ID
 * @param {string|number} value - The value to display
 */
export function updateHeaderStat(elementId, value) {
  const el = getElement(elementId);
  if (el) {
    el.textContent = value;
  }
}

/**
 * Updates the SMV banner display
 * @param {number} grade - SMV grade (1-3)
 * @param {number} activatedAt - Time when SMV was activated
 */
export function updateSMVBanner(grade, activatedAt) {
  const banner = getElement("smv-banner");
  const label = getElement("smv-label");

  if (banner && label) {
    const gradeNames = ["", "I", "II", "III"];
    banner.className = `grado${grade}`;
    label.textContent = `CÓDIGO SMV ACTIVADO · GRADO ${gradeNames[grade]} · T+${String(activatedAt).padStart(2, "0")}`;
  }
}

/**
 * Resets all action buttons to default state
 * @param {Object} buttons - Object mapping button IDs to default labels
 */
export function resetActionButtons(buttons) {
  for (const [id, label] of Object.entries(buttons)) {
    const btn = getElement(id);
    if (btn) {
      btn.classList.remove("active");
      btn.textContent = label;
    }
  }
}

/**
 * Updates an SVG element's text content
 * @param {string} elementId - The element ID
 * @param {string} text - The text content
 * @param {string} fill - Optional fill color
 */
export function updateSVGText(elementId, text, fill) {
  const element = getElement(elementId);
  if (element) {
    element.textContent = text;
    if (fill) {
      element.setAttribute("fill", fill);
    }
  }
}

/**
 * Switches a tab panel
 * @param {string} tabName - The name of the tab to switch to
 */
export function switchTab(tabName) {
  // Remove active from all tabs
  queryAll(".sidebar-tab").forEach(t => t.classList.remove("active"));
  queryAll(".sidebar-panel").forEach(p => p.classList.remove("active"));

  // Determine tab index
  const tabIndex =
    {
      inyectores: 1,
      decisiones: 2,
      pacientes: 3,
    }[tabName] || 1;

  // Activate selected tab
  const tab = query(`.sidebar-tab:nth-child(${tabIndex})`);
  const panel = getElement(`panel-${tabName}`);

  if (tab) tab.classList.add("active");
  if (panel) panel.classList.add("active");
}

/**
 * Closes all modals
 */
export function closeAllModals() {
  queryAll(".modal").forEach(modal => {
    modal.classList.remove("open");
  });
}

/**
 * Adds keyboard event listener for closing modals
 * @param {Function} callback - Function to call on Escape key
 */
export function setupKeyboardListener(callback) {
  if (typeof document === "undefined") return;

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      callback();
    }
  });
}

export default {
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
};
