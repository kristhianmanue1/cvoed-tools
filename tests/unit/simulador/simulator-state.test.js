/**
 * Unit Tests for SimulatorState
 * Hospital de Nunca Jamás - FIFA 2026
 */

import { SimulatorState, state } from "@/src/simulador/js/core/simulator-state.js";

describe("SimulatorState", () => {
  let simulatorState;

  beforeEach(() => {
    simulatorState = new SimulatorState();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    test("should initialize with default values", () => {
      expect(simulatorState.scenario).toBeNull();
      expect(simulatorState.currentT).toBe(0);
      expect(simulatorState.paused).toBe(false);
      expect(simulatorState.smvGrade).toBe(0);
      expect(simulatorState.smvActivatedAt).toBeNull();
      expect(simulatorState.theme).toBe("dark");
      expect(simulatorState.voiceEnabled).toBe(true);
      expect(simulatorState.simulationSpeed).toBe(1.0);
    });

    test("should initialize action states with all false", () => {
      expect(simulatorState.actionStates.triageExterno).toBe(false);
      expect(simulatorState.actionStates.noria).toBe(false);
      expect(simulatorState.actionStates.electivos).toBe(false);
      expect(simulatorState.actionStates.expansion).toBe(false);
      expect(simulatorState.actionStates.vocero).toBe(false);
      expect(simulatorState.actionStates.qbrne).toBe(false);
      expect(simulatorState.actionStates.riss).toBe(false);
    });

    test("should initialize hospital state with capacity values", () => {
      expect(simulatorState.hospitalState.uci.capacity).toBe(8);
      expect(simulatorState.hospitalState.uci.occupied).toBe(7);
      expect(simulatorState.hospitalState.urgencias.capacity).toBe(39);
      expect(simulatorState.hospitalState.urgencias.occupied).toBe(35);
      expect(simulatorState.hospitalState.rojosActivos).toBe(0);
    });
  });

  describe("scenario management", () => {
    test("should set scenario", () => {
      const mockScenario = { id: "S3", nombre: "Test Scenario" };
      simulatorState.setScenario(mockScenario);
      expect(simulatorState.scenario).toEqual(mockScenario);
    });

    test("should get scenario", () => {
      const mockScenario = { id: "S3", nombre: "Test Scenario" };
      simulatorState.setScenario(mockScenario);
      expect(simulatorState.getScenario()).toEqual(mockScenario);
    });
  });

  describe("time management", () => {
    test("should advance time", () => {
      simulatorState.advanceTime();
      expect(simulatorState.currentT).toBe(1);
      simulatorState.advanceTime();
      expect(simulatorState.currentT).toBe(2);
    });

    test("should get current time", () => {
      simulatorState.currentT = 15;
      expect(simulatorState.getCurrentTime()).toBe(15);
    });

    test("should toggle pause", () => {
      simulatorState.togglePause();
      expect(simulatorState.isPaused()).toBe(true);
      simulatorState.togglePause();
      expect(simulatorState.isPaused()).toBe(false);
    });
  });

  describe("decision tracking", () => {
    test("should mark decision as completed", () => {
      const result = simulatorState.markDecision("dec-smv");
      expect(result).toEqual({ done: true, at: 0 });
      expect(simulatorState.hasDecision("dec-smv")).toBe(true);
    });

    test("should not duplicate decision marks", () => {
      simulatorState.currentT = 5;
      simulatorState.markDecision("dec-smv");
      simulatorState.currentT = 10;
      const result = simulatorState.markDecision("dec-smv");
      expect(result.at).toBe(5); // Should keep original time
    });

    test("should check if decision exists", () => {
      expect(simulatorState.hasDecision("dec-smv")).toBe(false);
      simulatorState.markDecision("dec-smv");
      expect(simulatorState.hasDecision("dec-smv")).toBe(true);
    });
  });

  describe("patient group management", () => {
    test("should assign patient group", () => {
      simulatorState.assignPatientGroup("P001", 3);
      expect(simulatorState.getPatientGroup("P001")).toBe(3);
    });

    test("should update patient group", () => {
      simulatorState.assignPatientGroup("P001", 3);
      simulatorState.assignPatientGroup("P001", 4);
      expect(simulatorState.getPatientGroup("P001")).toBe(4);
    });

    test("should return undefined for non-existent patient", () => {
      expect(simulatorState.getPatientGroup("P999")).toBeUndefined();
    });
  });

  describe("action state management", () => {
    test("should activate action", () => {
      expect(simulatorState.activateAction("triageExterno")).toBe(true);
      expect(simulatorState.isActionActive("triageExterno")).toBe(true);
    });

    test("should not activate action twice", () => {
      simulatorState.activateAction("triageExterno");
      expect(simulatorState.activateAction("triageExterno")).toBe(false);
    });

    test("should check if action is active", () => {
      expect(simulatorState.isActionActive("triageExterno")).toBe(false);
      simulatorState.activateAction("triageExterno");
      expect(simulatorState.isActionActive("triageExterno")).toBe(true);
    });
  });

  describe("SMV management", () => {
    test("should set SMV grade", () => {
      simulatorState.setSMVGrade(2);
      expect(simulatorState.getSMVGrade()).toBe(2);
      expect(simulatorState.getSMVActivatedAt()).toBe(0);
    });

    test("should only increase SMV grade", () => {
      simulatorState.setSMVGrade(3);
      simulatorState.setSMVGrade(1);
      expect(simulatorState.getSMVGrade()).toBe(3);
    });

    test("should track SMV activation time", () => {
      simulatorState.currentT = 12;
      simulatorState.setSMVGrade(2);
      expect(simulatorState.getSMVActivatedAt()).toBe(12);
    });

    test("should only set activation time once", () => {
      simulatorState.currentT = 10;
      simulatorState.setSMVGrade(1);
      simulatorState.currentT = 15;
      simulatorState.setSMVGrade(3);
      expect(simulatorState.getSMVActivatedAt()).toBe(10);
    });
  });

  describe("theme management", () => {
    test("should set theme", () => {
      simulatorState.setTheme("light");
      expect(simulatorState.getTheme()).toBe("light");
    });

    test("should get current theme", () => {
      expect(simulatorState.getTheme()).toBe("dark");
    });

    test("should check if dark theme", () => {
      simulatorState.setTheme("dark");
      expect(simulatorState.getTheme()).toBe("dark");
      expect(simulatorState.getTheme()).not.toBe("light");
    });

    test("should check if light theme", () => {
      simulatorState.setTheme("light");
      expect(simulatorState.getTheme()).toBe("light");
      expect(simulatorState.getTheme()).not.toBe("dark");
    });
  });

  describe("voice management", () => {
    test("should toggle voice", () => {
      expect(simulatorState.toggleVoice()).toBe(false);
      expect(simulatorState.toggleVoice()).toBe(true);
    });

    test("should set voice enabled", () => {
      simulatorState.setVoiceEnabled(false);
      expect(simulatorState.isVoiceEnabled()).toBe(false);
      simulatorState.setVoiceEnabled(true);
      expect(simulatorState.isVoiceEnabled()).toBe(true);
    });
  });

  describe("simulation speed", () => {
    test("should set simulation speed", () => {
      simulatorState.setSimulationSpeed(2.5);
      expect(simulatorState.getSimulationSpeed()).toBe(2.5);
    });

    test("should get simulation speed", () => {
      expect(simulatorState.getSimulationSpeed()).toBe(1.0);
    });
  });

  describe("injector tracking", () => {
    test("should mark injector as seen", () => {
      simulatorState.markInjectorSeen("10_📻 CRUM OFICIAL");
      expect(simulatorState.isInjectorSeen("10_📻 CRUM OFICIAL")).toBe(true);
    });

    test("should check if injector was seen", () => {
      expect(simulatorState.isInjectorSeen("10_📻 CRUM OFICIAL")).toBe(false);
      simulatorState.markInjectorSeen("10_📻 CRUM OFICIAL");
      expect(simulatorState.isInjectorSeen("10_📻 CRUM OFICIAL")).toBe(true);
    });
  });

  describe("hospital capacity", () => {
    test("should update hospital capacity", () => {
      simulatorState.updateHospitalCapacity("uci", 8);
      expect(simulatorState.hospitalState.uci.occupied).toBe(8);
    });

    test("should handle non-existent area", () => {
      simulatorState.updateHospitalCapacity("nonexistent", 5);
      // Should not throw, just ignore
      expect(simulatorState.hospitalState.nonexistent).toBeUndefined();
    });
  });

  describe("decision statistics", () => {
    beforeEach(() => {
      simulatorState.scenario = {
        decisiones: [
          { id: "dec-1", critico: true },
          { id: "dec-2", critico: false },
          { id: "dec-3", critico: true },
        ],
      };
    });

    test("should count completed decisions", () => {
      simulatorState.markDecision("dec-1");
      simulatorState.markDecision("dec-3");
      expect(simulatorState.getCompletedDecisionCount()).toBe(2);
    });

    test("should count total decisions", () => {
      expect(simulatorState.getTotalDecisionCount()).toBe(3);
    });

    test("should get missed critical decisions", () => {
      simulatorState.markDecision("dec-2");
      const missed = simulatorState.getMissedCriticalDecisions();
      expect(missed).toHaveLength(2);
      expect(missed[0].id).toBe("dec-1");
      expect(missed[1].id).toBe("dec-3");
    });
  });

  describe("reset functionality", () => {
    test("should reset action states", () => {
      simulatorState.activateAction("triageExterno");
      simulatorState.resetActionStates();
      expect(simulatorState.isActionActive("triageExterno")).toBe(false);
    });
  });

  describe("singleton instance", () => {
    test("should export a singleton state instance", () => {
      expect(state).toBeInstanceOf(SimulatorState);
    });

    test("singleton should persist across imports", () => {
      const { state: state1 } = require("@/src/simulador/js/core/simulator-state.js");
      state1.setTheme("light");
      expect(state.getTheme()).toBe("light");
    });
  });
});
