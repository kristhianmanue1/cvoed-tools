/**
 * Unit Tests for Scenarios
 * Hospital de Nunca Jamás - FIFA 2026
 */

import {
  SCENARIOS,
  getScenario,
  getAllScenarios,
  getScenarioIds,
  getDefaultScenarioId,
} from "@/src/simulador/js/scenarios/scenarios.js";

describe("Scenarios", () => {
  describe("SCENARIOS constant", () => {
    test("should have S3 scenario (Cuartos de Final)", () => {
      expect(SCENARIOS.S3).toBeDefined();
      expect(SCENARIOS.S3.id).toBe("S3");
      expect(SCENARIOS.S3.nombre).toContain("Cuartos de Final");
      expect(SCENARIOS.S3.duracion).toBe(120);
    });

    test("should have S1 scenario (Sismo)", () => {
      expect(SCENARIOS.S1).toBeDefined();
      expect(SCENARIOS.S1.id).toBe("S1");
      expect(SCENARIOS.S1.nombre).toContain("Sismo");
      expect(SCENARIOS.S1.duracion).toBe(60);
    });

    test("should have S2 scenario (Explosión)", () => {
      expect(SCENARIOS.S2).toBeDefined();
      expect(SCENARIOS.S2.id).toBe("S2");
      expect(SCENARIOS.S2.nombre).toContain("Explosión");
      expect(SCENARIOS.S2.duracion).toBe(90);
    });
  });

  describe("S3 scenario details", () => {
    test("should have injectors", () => {
      expect(SCENARIOS.S3.inyectores).toBeDefined();
      expect(Array.isArray(SCENARIOS.S3.inyectores)).toBe(true);
      expect(SCENARIOS.S3.inyectores.length).toBeGreaterThan(0);
    });

    test("should have decisions", () => {
      expect(SCENARIOS.S3.decisiones).toBeDefined();
      expect(Array.isArray(SCENARIOS.S3.decisiones)).toBe(true);
      expect(SCENARIOS.S3.decisiones.length).toBeGreaterThan(0);
    });

    test("should have patients", () => {
      expect(SCENARIOS.S3.pacientes).toBeDefined();
      expect(Array.isArray(SCENARIOS.S3.pacientes)).toBe(true);
      expect(SCENARIOS.S3.pacientes.length).toBeGreaterThan(0);
    });

    test("first injector should be at T+0", () => {
      const firstInjector = SCENARIOS.S3.inyectores[0];
      expect(firstInjector.t).toBe(0);
      expect(firstInjector.tipo).toBe("radio");
    });

    test("should have critical decisions marked", () => {
      const criticalDecisions = SCENARIOS.S3.decisiones.filter(d => d.critico);
      expect(criticalDecisions.length).toBeGreaterThan(0);
    });

    test("patients should have required properties", () => {
      const patient = SCENARIOS.S3.pacientes[0];
      expect(patient).toHaveProperty("id");
      expect(patient).toHaveProperty("ubicacion");
      expect(patient).toHaveProperty("desc");
      expect(patient).toHaveProperty("triage");
    });

    test("should have patients with disabilities", () => {
      const disabledPatients = SCENARIOS.S3.pacientes.filter(p => p.discapacidad);
      expect(disabledPatients.length).toBeGreaterThan(0);
    });

    test("should have unregistered patients", () => {
      const unregisteredPatients = SCENARIOS.S3.pacientes.filter(p => !p.registrado);
      expect(unregisteredPatients.length).toBeGreaterThan(0);
    });
  });

  describe("S1 scenario details", () => {
    test("should have surgery in progress patient", () => {
      const surgeryPatient = SCENARIOS.S1.pacientes.find(p => p.ubicacion === "Quirófano 1");
      expect(surgeryPatient).toBeDefined();
      expect(surgeryPatient.desc).toContain("CIRUGÍA");
    });

    test("should have EVAC-H specific decisions", () => {
      const evacDecisions = SCENARIOS.S1.decisiones.filter(d => d.guia.includes("EVAC-H"));
      expect(evacDecisions.length).toBeGreaterThan(0);
    });
  });

  describe("S2 scenario details", () => {
    test("should start with CRUM call", () => {
      const firstInjector = SCENARIOS.S2.inyectores[0];
      expect(firstInjector.canal).toContain("CRUM");
      expect(firstInjector.tipo).toBe("critico");
    });

    test("should have QBRNE-related decisions", () => {
      const qbrneDecisions =
        SCENARIOS.S2.decisionses?.filter(d => d.guia?.includes("QBRNE")) ||
        SCENARIOS.S2.inyectores.filter(i => i.texto.includes("QBRNE"));
      expect(qbrneDecisions.length).toBeGreaterThan(0);
    });
  });

  describe("injector structure", () => {
    test("injector should have all required properties", () => {
      const injector = SCENARIOS.S3.inyectores[0];
      expect(injector).toHaveProperty("t");
      expect(injector).toHaveProperty("tipo");
      expect(injector).toHaveProperty("canal");
      expect(injector).toHaveProperty("emisor");
      expect(injector).toHaveProperty("texto");
      expect(injector).toHaveProperty("acciones");
    });

    test("injector actions should have structure", () => {
      const injector = SCENARIOS.S3.inyectores[0];
      const action = injector.acciones[0];
      expect(action).toHaveProperty("label");
      expect(action).toHaveProperty("id");
      expect(action).toHaveProperty("tipo");
    });

    test("should have different injector types", () => {
      const types = new Set(SCENARIOS.S3.inyectores.map(i => i.tipo));
      expect(types.has("critico")).toBe(true);
      expect(types.has("radio")).toBe(true);
    });
  });

  describe("decision structure", () => {
    test("decision should have all required properties", () => {
      const decision = SCENARIOS.S3.decisiones[0];
      expect(decision).toHaveProperty("id");
      expect(decision).toHaveProperty("label");
      expect(decision).toHaveProperty("guia");
      expect(decision).toHaveProperty("critico");
    });

    test("decision guide should reference protocols", () => {
      const guides = SCENARIOS.S3.decisiones.map(d => d.guia);
      expect(guides.some(g => g.includes("SMV-H"))).toBe(true);
      expect(guides.some(g => g.includes("SCI-H"))).toBe(true);
    });
  });

  describe("patient triage distribution", () => {
    test("S3 should have red triage patients", () => {
      const redPatients = SCENARIOS.S3.pacientes.filter(p => p.triage === "rojo");
      expect(redPatients.length).toBeGreaterThan(0);
    });

    test("S3 should have yellow triage patients", () => {
      const yellowPatients = SCENARIOS.S3.pacientes.filter(p => p.triage === "amarillo");
      expect(yellowPatients.length).toBeGreaterThan(0);
    });

    test("S3 should have black triage patients", () => {
      const blackPatients = SCENARIOS.S3.pacientes.filter(p => p.triage === "negro");
      expect(blackPatients.length).toBeGreaterThan(0);
    });
  });

  describe("getScenario", () => {
    test("should return scenario by ID", () => {
      const scenario = getScenario("S3");
      expect(scenario).toEqual(SCENARIOS.S3);
    });

    test("should return null for non-existent scenario", () => {
      const scenario = getScenario("S99");
      expect(scenario).toBeNull();
    });
  });

  describe("getAllScenarios", () => {
    test("should return array of all scenarios", () => {
      const all = getAllScenarios();
      expect(Array.isArray(all)).toBe(true);
      expect(all.length).toBe(3);
    });

    test("should include all scenario IDs", () => {
      const all = getAllScenarios();
      const ids = all.map(s => s.id);
      expect(ids).toContain("S1");
      expect(ids).toContain("S2");
      expect(ids).toContain("S3");
    });
  });

  describe("getScenarioIds", () => {
    test("should return array of scenario IDs", () => {
      const ids = getScenarioIds();
      expect(Array.isArray(ids)).toBe(true);
      expect(ids).toContain("S1");
      expect(ids).toContain("S2");
      expect(ids).toContain("S3");
    });
  });

  describe("getDefaultScenarioId", () => {
    test("should return S3 as default", () => {
      expect(getDefaultScenarioId()).toBe("S3");
    });
  });

  describe("injector timing", () => {
    test("S3 injectors should be sorted by time", () => {
      const times = SCENARIOS.S3.inyectores.map(i => i.t);
      const sortedTimes = [...times].sort((a, b) => a - b);
      expect(times).toEqual(sortedTimes);
    });

    test("S3 should have injector at T+60", () => {
      const injectorAt60 = SCENARIOS.S3.inyectores.find(i => i.t === 60);
      expect(injectorAt60).toBeDefined();
      expect(injectorAt60.canal).toContain("CIERRE");
    });
  });

  describe("action types", () => {
    test("should have primary actions", () => {
      const allActions = SCENARIOS.S3.inyectores.flatMap(i => i.acciones);
      const primaryActions = allActions.filter(a => a.tipo === "primary");
      expect(primaryActions.length).toBeGreaterThan(0);
    });

    test("should have secondary actions", () => {
      const allActions = SCENARIOS.S3.inyectores.flatMap(i => i.acciones);
      const secondaryActions = allActions.filter(a => a.tipo === "secondary");
      expect(secondaryActions.length).toBeGreaterThan(0);
    });

    test("should have danger actions", () => {
      const allActions = SCENARIOS.S3.inyectores.flatMap(i => i.acciones);
      const dangerActions = allActions.filter(a => a.tipo === "danger");
      expect(dangerActions.length).toBeGreaterThan(0);
    });
  });
});
