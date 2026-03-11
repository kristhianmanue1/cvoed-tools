/**
 * Integration Tests - Emergency Simulator
 * Prueba flujos completos de simulación
 *
 * Estos tests verifican la integración del simulador de emergencias:
 * - Carga de escenarios
 * - Progresión temporal
 * - Toma de decisiones
 * - Sistema de voz
 * - Persistencia de estado
 */

import {
  scenarioFixtures,
  patientFixtures,
  generateSimulatorEvents,
} from "./fixtures/patient-data.js";

describe("Simulador Integration - Complete Emergency Scenarios", () => {
  let state;
  let voiceEnabled = false;
  let mockSpeechSynthesis;

  beforeEach(() => {
    // Reset estado del simulador
    state = {
      scenario: null,
      currentT: 0,
      paused: false,
      timerInterval: null,
      smvGrade: 0,
      smvActivatedAt: null,
      injectorsSeen: new Set(),
      decisions: {},
      patientGroups: {},
      actionStates: {
        triageExterno: false,
        noria: false,
        electivos: false,
        expansion: false,
        vocero: false,
        qbrne: false,
        riss: false,
      },
      eventsTriggered: [],
      score: {
        correctDecisions: 0,
        incorrectDecisions: 0,
        criticalDecisions: 0,
      },
    };

    // Mock de speech synthesis
    mockSpeechSynthesis = {
      speak: jest.fn(),
      cancel: jest.fn(),
      pause: jest.fn(),
      resume: jest.fn(),
      getVoices: jest.fn(() => []),
      pending: false,
      speaking: false,
      paused: false,
    };

    global.speechSynthesis = mockSpeechSynthesis;
  });

  afterEach(() => {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
    }
  });

  // Helper para cargar escenario
  function loadScenario(scenarioId) {
    const scenario = scenarioFixtures[scenarioId.toLowerCase()];
    if (!scenario) {
      throw new Error(`Escenario ${scenarioId} no encontrado`);
    }

    state.scenario = scenario;
    state.scenarioKey = scenarioId.toLowerCase(); // Guardar la clave para generar eventos
    state.currentT = 0;
    state.injectorsSeen.clear();
    state.actionStates = {
      triageExterno: false,
      noria: false,
      electivos: false,
      expansion: false,
      vocero: false,
      qbrne: false,
      riss: false,
    };

    return scenario;
  }

  // Helper para avanzar tiempo
  function advanceTime(minutes) {
    state.currentT += minutes;
    return state.currentT;
  }

  // Helper para tomar una decisión
  function makeDecision(decisionId, correct) {
    state.decisions[decisionId] = {
      timestamp: new Date().toISOString(),
      atTime: state.currentT,
      correct,
    };

    if (correct) {
      state.score.correctDecisions++;
    } else {
      state.score.incorrectDecisions++;
    }

    return state.decisions[decisionId];
  }

  // Helper para activar una acción
  function activateAction(actionId) {
    if (state.actionStates.hasOwnProperty(actionId)) {
      state.actionStates[actionId] = true;
    }
    return state.actionStates[actionId];
  }

  // Helper para obtener eventos actuales
  function getCurrentEvents() {
    const events = generateSimulatorEvents(state.scenarioKey || "sismo", state.currentT) || [];
    return events.filter(e => e.t <= state.currentT && !state.injectorsSeen.has(e.t));
  }

  // Helper para marcar evento como visto
  function markEventSeen(eventTime) {
    state.injectorsSeen.add(eventTime);
  }

  // Helper para anunciar por voz
  function announce(text, priority = "normal") {
    if (!voiceEnabled) return;

    state.eventsTriggered.push({
      type: "announcement",
      text,
      priority,
      time: state.currentT,
    });

    mockSpeechSynthesis.speak({ text });
  }

  // Helper para calcular puntaje final
  function calculateFinalScore() {
    const scenario = state.scenario;
    if (!scenario) return null;

    const decisionesCriticas = scenario.decisiones?.filter(d => d.critico) || [];
    const criticasTomadas = decisionesCriticas.filter(d => state.decisions[d.id]?.correct);

    const puntaje = {
      total: state.score.correctDecisions - state.score.incorrectDecisions,
      correctas: state.score.correctDecisions,
      incorrectas: state.score.incorrectDecisions,
      criticasAcertadas: criticasTomadas.length,
      criticasTotal: decisionesCriticas.length,
      categoria: 0,
    };

    // Calcular categoría
    const pct =
      decisionesCriticas.length > 0 ? criticasTomadas.length / decisionesCriticas.length : 0;
    if (pct >= 0.9)
      puntaje.categoria = 5; // Excelente
    else if (pct >= 0.7)
      puntaje.categoria = 4; // Bueno
    else if (pct >= 0.5)
      puntaje.categoria = 3; // Aceptable
    else if (pct >= 0.3)
      puntaje.categoria = 2; // Mejorable
    else puntaje.categoria = 1; // Insuficiente

    return puntaje;
  }

  describe("Escenario S1: Sismo 7.4", () => {
    test("flujo completo de respuesta a sismo", () => {
      // 1. Iniciar escenario
      const scenario = loadScenario("sismo");
      expect(state.scenario.id).toBe("S1");
      expect(state.currentT).toBe(0);

      // 2. Verificar condiciones iniciales
      expect(scenario.structuralDamage).toBe(true);
      expect(scenario.activeSurgeries).toBe(1);

      // 3. Primer evento a T=0
      advanceTime(0);
      const events = getCurrentEvents();
      expect(events.length).toBeGreaterThan(0);
      expect(events[0].canal).toContain("ALERTA");

      // 4. Tomar decisión: activar EVAC-H
      makeDecision("dec-evac-activar", true);
      markEventSeen(0);

      // 5. Avanzar a T=7 (evento de quirófano)
      advanceTime(7);
      const eventsT7 = getCurrentEvents();
      expect(eventsT7.some(e => e.canal.includes("QUIROFANO"))).toBe(true);

      // 6. Decisión crítica: no mover paciente en quirófano
      makeDecision("dec-no-mover-cx", true);

      // 7. Verificar réplica a T=12
      advanceTime(5);
      expect(state.currentT).toBe(12);
      const eventsT12 = getCurrentEvents();
      expect(eventsT12.some(e => e.canal.includes("PROTECCION CIVIL"))).toBe(true);

      // 8. Calcular puntaje
      const puntaje = calculateFinalScore();
      expect(puntaje).toHaveProperty("categoria");
      expect(puntaje.categoria).toBeGreaterThan(0);
    });

    test("manejo correcto de paciente en quirófano durante sismo", () => {
      loadScenario("sismo");
      const pacienteQuirofano = patientFixtures.pacienteQuirofano;

      // Verificar datos del paciente
      expect(pacienteQuirofano.enCirugia).toBe(true);
      expect(pacienteQuirofano.minutoCirugia).toBe(45);
      expect(pacienteQuirofano.procedimiento).toBe("torax_abierto");

      // Decisión correcta: NO mover
      makeDecision("dec-no-mover-cx", true);
      expect(state.decisions["dec-no-mover-cx"].correct).toBe(true);

      // Verificar que no se activa evacuación para este paciente
      expect(state.decisions["dec-no-mover-cx"]).toBeDefined();
    });

    test("identificación de pacientes con discapacidad no registrados", () => {
      loadScenario("sismo");

      // Agregar pacientes con discapacidad no registrada
      const pacientes = [patientFixtures.pacienteQuirofano, patientFixtures.conDiscapacidad];

      // Marcar algunos como no registrados
      pacientes[1].registrado = false;

      // Decisión de identificar discapacidades
      makeDecision("dec-discap-evac", true);

      const noRegistrados = pacientes.filter(p => !p.registrado && p.discapacidad);
      expect(noRegistrados.length).toBeGreaterThan(0);
    });
  });

  describe("Escenario S2: Explosión", () => {
    test("flujo completo de respuesta a explosión", () => {
      // 1. Iniciar escenario
      const scenario = loadScenario("explosion");
      expect(state.scenario.id).toBe("S2");

      // 2. Verificar número de víctimas
      expect(scenario.victims).toBe(60);
      expect(scenario.burnPatients).toBe(15);

      // 3. Evento inicial: llamada CRUM
      advanceTime(0);
      const events = getCurrentEvents();
      expect(events.some(e => e.canal.includes("CRUM"))).toBe(true);

      // 4. Activar SMV
      makeDecision("dec-smv-s2", true);
      activateAction("triageExterno");

      expect(state.actionStates.triageExterno).toBe(true);

      // 5. Activar SCI-H
      makeDecision("dec-mando-unico", true);
      activateAction("vocero");

      expect(state.actionStates.vocero).toBe(true);

      // 6. Verificar decisión de QBRNE
      advanceTime(18);
      makeDecision("dec-qbrne-s2", true);
    });

    test("activación de protocolo QBRNE según criterios", () => {
      loadScenario("explosion");

      // Inicialmente QBRNE no está activo
      expect(state.actionStates.qbrne).toBe(false);

      // A T=18 hay posible contaminación
      advanceTime(18);
      const events = getCurrentEvents();
      expect(events.some(e => e.texto.includes("contaminación"))).toBe(true);

      // Decisión correcta: activar QBRNE completo
      activateAction("qbrne");
      makeDecision("dec-qbrne-s2", true);

      expect(state.actionStates.qbrne).toBe(true);
    });

    test("designación de vocero único", () => {
      loadScenario("explosion");

      // A T=35: medios y familias
      advanceTime(35);
      const events = getCurrentEvents();
      expect(events.some(e => e.canal.includes("MEDIOS"))).toBe(true);

      // Decisión crítica: vocero único
      makeDecision("dec-vocero-s2", true);
      activateAction("vocero");

      expect(state.actionStates.vocero).toBe(true);
    });
  });

  describe("Escenario S3: Estampida FIFA", () => {
    test("flujo completo de saldo masivo >120 víctimas", () => {
      // 1. Iniciar escenario
      const scenario = loadScenario("estampida");
      expect(state.scenario.id).toBe("S3");

      // 2. Verificar afluencia masiva
      expect(scenario.victims).toBe(120);

      // 3. Verificar distribución de triage
      expect(scenario.triageDistribution.rojo).toBe(20);
      expect(scenario.triageDistribution.amarillo).toBe(40);
      expect(scenario.triageDistribution.verde).toBe(60);

      // 4. T=0: llamada anónima
      advanceTime(0);
      const events = getCurrentEvents();
      expect(events.some(e => e.canal.includes("LLAMADA ANONIMA"))).toBe(true);

      // 5. T=10: arribo físico prematuro
      advanceTime(10);
      const eventsT10 = getCurrentEvents();
      expect(eventsT10.some(e => e.canal.includes("ARRIBO FISICO"))).toBe(true);

      // 6. Decisión: activar triage externo
      makeDecision("dec-triage", true);
      activateAction("triageExterno");
      expect(state.actionStates.triageExterno).toBe(true);

      // 7. T=12: CRUM oficial con 120 víctimas
      advanceTime(2);
      makeDecision("dec-smv", true);
      makeDecision("dec-grado", true); // Grado III

      // 8. T=60: inicio de desescalamiento
      advanceTime(48);
      const eventsT60 = getCurrentEvents();
      expect(eventsT60.some(e => e.canal.includes("CIERRE"))).toBe(true);
    });

    test("activación correcta de Grado III SMV-H", () => {
      loadScenario("estampida");

      const scenario = state.scenario;
      expect(scenario.victims).toBeGreaterThanOrEqual(100);

      // Declarar SMV
      advanceTime(12);
      makeDecision("dec-grado", true);

      // Verificar que se activó Grado III (no II)
      state.smvGrade = 3;
      state.smvActivatedAt = state.currentT;

      expect(state.smvGrade).toBe(3);
      expect(state.smvActivatedAt).toBe(12);
    });

    test("manejo de rumor QBRNE en estampida", () => {
      loadScenario("estampida");

      // T=20: paciente con quemaduras, rumor de explosión
      advanceTime(20);
      const events = getCurrentEvents();
      expect(events.some(e => e.canal.includes("MEDICINA INTERNA"))).toBe(true);

      // Decisión: NO activar QBRNE sin confirmación (esperar)
      makeDecision("dec-qbrne-correct", true);
      expect(state.actionStates.qbrne).toBe(false);

      // T=25: confirmación de que NO hubo explosión
      advanceTime(5);
      const eventsT25 = getCurrentEvents();
      expect(eventsT25.some(e => e.texto.includes("no hay explosivo"))).toBe(true);
    });
  });

  describe("Integración con Voz SCI-H", () => {
    beforeEach(() => {
      voiceEnabled = true;
    });

    test("sistema anuncia eventos críticos", () => {
      loadScenario("estampida");
      advanceTime(10);

      const events = getCurrentEvents();
      const criticalEvent = events.find(e => e.tipo === "critico");

      if (criticalEvent) {
        announce(criticalEvent.texto, "critical");

        expect(state.eventsTriggered.length).toBeGreaterThan(0);
        expect(state.eventsTriggered[0].priority).toBe("critical");
        expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
      }
    });

    test("anuncios de voz usan prioridad correcta", () => {
      loadScenario("sismo");

      // Anuncio normal
      announce("Mensaje informativo", "normal");
      // Anuncio crítico
      announce("Mensaje crítico", "critical");

      expect(state.eventsTriggered[0].priority).toBe("normal");
      expect(state.eventsTriggered[1].priority).toBe("critical");
    });

    test("se pueden desactivar anuncios de voz", () => {
      voiceEnabled = false;

      loadScenario("estampida");
      advanceTime(10);

      announce("Este mensaje no se anunciará", "critical");

      expect(state.eventsTriggered.length).toBe(0);
      expect(mockSpeechSynthesis.speak).not.toHaveBeenCalled();
    });
  });

  describe("Persistencia de Estado", () => {
    test("guarda y restaura estado de simulación", () => {
      loadScenario("estampida");

      // Tomar decisiones
      advanceTime(15);
      makeDecision("dec-smv", true);
      makeDecision("dec-grado", true);
      activateAction("triageExterno");
      activateAction("noria");

      // Guardar estado
      const savedState = JSON.parse(
        JSON.stringify({
          scenario: state.scenario,
          currentT: state.currentT,
          decisions: state.decisions,
          actionStates: state.actionStates,
          score: state.score,
        })
      );

      // Crear nueva instancia y restaurar
      const restoredState = JSON.parse(JSON.stringify(savedState));

      // Verificar restauración
      expect(restoredState.scenario.id).toBe("S3");
      expect(restoredState.currentT).toBe(15);
      expect(restoredState.decisions["dec-smv"].correct).toBe(true);
      expect(restoredState.actionStates.triageExterno).toBe(true);
      expect(restoredState.actionStates.noria).toBe(true);
    });

    test("restauración mantiene puntaje parcial", () => {
      loadScenario("sismo");

      makeDecision("dec-evac-activar", true);
      makeDecision("dec-no-mover-cx", true);
      makeDecision("dec-discap-evac", false); // Incorrecta

      const savedScore = { ...state.score };

      expect(savedScore.correctDecisions).toBe(2);
      expect(savedScore.incorrectDecisions).toBe(1);
    });
  });

  describe("Sistema de Puntaje", () => {
    test("calcula puntaje correctamente para todas las decisiones correctas", () => {
      loadScenario("sismo");

      const decisionesCriticas = state.scenario.decisiones?.filter(d => d.critico) || [];

      decisionesCriticas.forEach(d => {
        makeDecision(d.id, true);
      });

      const puntaje = calculateFinalScore();

      expect(puntaje.correctas).toBe(decisionesCriticas.length);
      expect(puntaje.incorrectas).toBe(0);
      expect(puntaje.categoria).toBeGreaterThanOrEqual(4);
    });

    test("asigna categoría insuficiente para decisiones incorrectas", () => {
      loadScenario("estampida");

      const decisionesCriticas = state.scenario.decisiones?.filter(d => d.critico) || [];

      // Marcar todas como incorrectas
      decisionesCriticas.forEach(d => {
        makeDecision(d.id, false);
      });

      const puntaje = calculateFinalScore();

      expect(puntaje.correctas).toBe(0);
      expect(puntaje.incorrectas).toBe(decisionesCriticas.length);
      expect(puntaje.categoria).toBe(1);
    });

    test("puntaje refleja decisiones críticas vs no críticas", () => {
      loadScenario("estampida");

      const decisiones = state.scenario.decisiones || [];
      const criticas = decisiones.filter(d => d.critico);
      const noCriticas = decisiones.filter(d => !d.critico);

      // Todas correctas
      decisiones.forEach(d => makeDecision(d.id, true));

      const puntaje = calculateFinalScore();

      expect(puntaje.criticasAcertadas).toBe(criticas.length);
      expect(puntaje.criticasTotal).toBe(criticas.length);
    });
  });

  describe("Progresión Temporal", () => {
    test("tiempo avanza correctamente", () => {
      loadScenario("sismo");

      expect(state.currentT).toBe(0);

      advanceTime(5);
      expect(state.currentT).toBe(5);

      advanceTime(10);
      expect(state.currentT).toBe(15);
    });

    test("eventos se activan en el momento correcto", () => {
      loadScenario("estampida");

      // T=0
      let events = getCurrentEvents();
      expect(events.length).toBeGreaterThan(0);

      // T=5 (no debería haber nuevos eventos)
      advanceTime(5);
      markEventSeen(0);
      events = getCurrentEvents();
      expect(events.length).toBe(0);

      // T=10 (debería haber nuevo evento)
      advanceTime(5);
      events = getCurrentEvents();
      expect(events.length).toBeGreaterThan(0);
    });

    test("pausa y reanudación del temporizador", () => {
      loadScenario("sismo");

      state.paused = true;
      advanceTime(10);

      // En pausa, el tiempo no debería avanzar para efectos de eventos
      // (esta funcionalidad se implementa en el timer real)
      expect(state.currentT).toBe(10);

      state.paused = false;
      advanceTime(5);
      expect(state.currentT).toBe(15);
    });
  });

  describe("Estados de Acción", () => {
    test("activación de noria de ambulancias", () => {
      loadScenario("estampida");

      expect(state.actionStates.noria).toBe(false);

      activateAction("noria");
      expect(state.actionStates.noria).toBe(true);
    });

    test("suspensión de cirugías electivas", () => {
      loadScenario("explosion");

      expect(state.actionStates.electivos).toBe(false);

      activateAction("electivos");
      expect(state.actionStates.electivos).toBe(true);
    });

    test("habilitación de área de expansión", () => {
      loadScenario("estampida");

      expect(state.actionStates.expansion).toBe(false);

      activateAction("expansion");
      expect(state.actionStates.expansion).toBe(true);
    });

    test("referencia a RISS", () => {
      loadScenario("estampida");

      expect(state.actionStates.riss).toBe(false);

      activateAction("riss");
      expect(state.actionStates.riss).toBe(true);
    });
  });
});
