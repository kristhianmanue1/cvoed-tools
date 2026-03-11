/**
 * Core functionality for the Emergency Simulator
 * Hospital de Nunca Jamás - FIFA 2026
 * @module core/simulator-state
 */

/**
 * SimulatorState - Manages the global state of the emergency simulation
 */
export class SimulatorState {
  /**
   * Creates a new SimulatorState instance
   */
  constructor() {
    this.scenario = null;
    this.currentT = 0;
    this.paused = false;
    this.timerInterval = null;
    this.smvGrade = 0;
    this.smvActivatedAt = null;
    this.injectorsSeen = new Set();
    this.decisions = {};
    this.patientGroups = {};
    this.actionStates = {
      triageExterno: false,
      noria: false,
      electivos: false,
      expansion: false,
      vocero: false,
      qbrne: false,
      riss: false,
    };
    this.hospitalState = {
      uci: { capacity: 8, occupied: 7 },
      urgencias: { capacity: 39, occupied: 35 },
      rojosActivos: 0,
    };
    this.theme = "dark";
    this.voiceEnabled = true;
    this.simulationSpeed = 1.0;
  }

  /**
   * Sets the current scenario
   * @param {Object} scenario - The scenario object
   */
  setScenario(scenario) {
    this.scenario = scenario;
  }

  /**
   * Gets the current scenario
   * @returns {Object|null} The current scenario
   */
  getScenario() {
    return this.scenario;
  }

  /**
   * Resets the simulation state for a new run
   * @param {string} scenarioId - The scenario ID to initialize
   * @param {Object} scenarios - The scenarios object containing all scenario data
   */
  reset(scenarioId, scenarios) {
    this.scenario = scenarios[scenarioId];
    this.currentT = 0;
    this.paused = false;
    this.smvGrade = 0;
    this.smvActivatedAt = null;
    this.injectorsSeen = new Set();
    this.decisions = {};
    this.patientGroups = {};
    this.actionStates = {
      triageExterno: false,
      noria: false,
      electivos: false,
      expansion: false,
      vocero: false,
      qbrne: false,
      riss: false,
    };
  }

  /**
   * Marks a decision as completed
   * @param {string} decisionId - The ID of the decision to mark
   * @returns {Object} The decision object with timestamp
   */
  markDecision(decisionId) {
    if (!this.decisions[decisionId]) {
      this.decisions[decisionId] = {
        done: true,
        at: this.currentT,
      };
    }
    return this.decisions[decisionId];
  }

  /**
   * Checks if a decision has been made
   * @param {string} decisionId - The ID of the decision to check
   * @returns {boolean} True if the decision was made
   */
  hasDecision(decisionId) {
    return Boolean(this.decisions[decisionId]);
  }

  /**
   * Assigns an EVACH group to a patient
   * @param {string} patientId - The patient ID
   * @param {number} group - The EVACH group (1-5)
   */
  assignPatientGroup(patientId, group) {
    this.patientGroups[patientId] = group;
  }

  /**
   * Gets the assigned EVACH group for a patient
   * @param {string} patientId - The patient ID
   * @returns {number|undefined} The assigned group or undefined
   */
  getPatientGroup(patientId) {
    return this.patientGroups[patientId];
  }

  /**
   * Activates an action state
   * @param {string} action - The action name
   * @returns {boolean} True if the action was activated, false if already active
   */
  activateAction(action) {
    if (this.actionStates[action]) {
      return false;
    }
    this.actionStates[action] = true;
    return true;
  }

  /**
   * Checks if an action is active
   * @param {string} action - The action name
   * @returns {boolean} True if the action is active
   */
  isActionActive(action) {
    return Boolean(this.actionStates[action]);
  }

  /**
   * Sets the SMV (Saldo Masivo de Víctimas) grade
   * @param {number} grade - The SMV grade (1-3)
   */
  setSMVGrade(grade) {
    if (grade > this.smvGrade) {
      this.smvGrade = grade;
      if (!this.smvActivatedAt) {
        this.smvActivatedAt = this.currentT;
      }
    }
  }

  /**
   * Gets the SMV grade
   * @returns {number} The current SMV grade
   */
  getSMVGrade() {
    return this.smvGrade;
  }

  /**
   * Gets the SMV activation time
   * @returns {number|null} The time when SMV was activated
   */
  getSMVActivatedAt() {
    return this.smvActivatedAt;
  }

  /**
   * Updates the hospital capacity for an area
   * @param {string} area - The area name ('uci' or 'urgencias')
   * @param {number} occupied - The occupied count
   */
  updateHospitalCapacity(area, occupied) {
    if (this.hospitalState[area]) {
      this.hospitalState[area].occupied = occupied;
    }
  }

  /**
   * Sets the theme
   * @param {string} theme - The theme name ('dark' or 'light')
   */
  setTheme(theme) {
    this.theme = theme;
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }

  /**
   * Gets the current theme
   * @returns {string} The current theme
   */
  getTheme() {
    return this.theme;
  }

  /**
   * Toggles voice on/off
   * @returns {boolean} The new voice enabled state
   */
  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    return this.voiceEnabled;
  }

  /**
   * Sets the voice enabled state
   * @param {boolean} enabled - Whether voice should be enabled
   */
  setVoiceEnabled(enabled) {
    this.voiceEnabled = enabled;
  }

  /**
   * Checks if voice is enabled
   * @returns {boolean} True if voice is enabled
   */
  isVoiceEnabled() {
    return this.voiceEnabled;
  }

  /**
   * Sets the simulation speed
   * @param {number} speed - The simulation speed multiplier
   */
  setSimulationSpeed(speed) {
    this.simulationSpeed = speed;
  }

  /**
   * Gets the simulation speed
   * @returns {number} The current simulation speed
   */
  getSimulationSpeed() {
    return this.simulationSpeed;
  }

  /**
   * Advances the simulation timer
   */
  advanceTime() {
    this.currentT += 1;
  }

  /**
   * Gets the current simulation time
   * @returns {number} The current time in minutes
   */
  getCurrentTime() {
    return this.currentT;
  }

  /**
   * Pauses or resumes the simulation
   */
  togglePause() {
    this.paused = !this.paused;
  }

  /**
   * Checks if the simulation is paused
   * @returns {boolean} True if paused
   */
  isPaused() {
    return this.paused;
  }

  /**
   * Marks an injector as seen
   * @param {string} key - The unique key for the injector
   */
  markInjectorSeen(key) {
    this.injectorsSeen.add(key);
  }

  /**
   * Checks if an injector has been seen
   * @param {string} key - The unique key for the injector
   * @returns {boolean} True if the injector was seen
   */
  isInjectorSeen(key) {
    return this.injectorsSeen.has(key);
  }

  /**
   * Gets the count of completed decisions
   * @returns {number} The number of completed decisions
   */
  getCompletedDecisionCount() {
    if (!this.scenario || !this.scenario.decisiones) {
      return 0;
    }
    return Object.keys(this.decisions).filter(k => this.scenario.decisiones.find(d => d.id === k)).length;
  }

  /**
   * Gets the total number of decisions
   * @returns {number} The total number of decisions
   */
  getTotalDecisionCount() {
    if (!this.scenario || !this.scenario.decisiones) {
      return 0;
    }
    return this.scenario.decisiones.length;
  }

  /**
   * Gets missed critical decisions
   * @returns {Array} Array of missed critical decision objects
   */
  getMissedCriticalDecisions() {
    if (!this.scenario || !this.scenario.decisiones) {
      return [];
    }
    return this.scenario.decisiones.filter(d => !this.decisions[d.id] && d.critico);
  }

  /**
   * Resets all action button states
   */
  resetActionStates() {
    this.actionStates = {
      triageExterno: false,
      noria: false,
      electivos: false,
      expansion: false,
      vocero: false,
      qbrne: false,
      riss: false,
    };
  }

  /**
   * Clears the timer interval
   */
  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Sets the timer interval
   * @param {number} intervalId - The interval ID
   */
  setTimer(intervalId) {
    this.timerInterval = intervalId;
  }
}

/**
 * Creates a singleton instance of SimulatorState
 * @type {SimulatorState}
 */
export const state = new SimulatorState();

export default SimulatorState;
