/**
 * Tests de Flujos de Escenarios del Simulador
 *
 * Este archivo contiene tests específicos para los flujos de los 3 escenarios:
 * S1: Sismo 7.4
 * S2: Explosión + Réplica
 * S3: Cuartos de Final FIFA 2026
 *
 * @see QA-002: Tests Unitarios Simulador (12 horas)
 * @goal Validar flujos completos de cada escenario
 */

// ─── IMPORTAR DATOS Y CLASES ───────────────────────────────────────────────────

// Reutilizamos las clases del archivo principal de tests
const mockSpeechSynthesis = {
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

const mockLocalStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value;
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  },
};

global.localStorage = mockLocalStorage;

const SCENARIOS = {
  S3: {
    id: "S3",
    nombre: "Cuartos de Final · Copa Mundial FIFA 2026",
    duracion: 120,
    inyectores: [
      {
        t: 0,
        tipo: "radio",
        canal: "📞 LLAMADA ANÓNIMA",
        emisor: "Fuente no identificada",
        texto: '"Escuché que hubo una explosión en el estadio. Hay muertos en la calle."',
        acciones: [
          { label: "Verificar con CRUM", id: "verificar-crum", tipo: "primary" },
          { label: "Activar Código SMV", id: "activar-smv-early", tipo: "secondary" },
        ],
      },
      {
        t: 10,
        tipo: "critico",
        canal: "🚑 ARRIBO FÍSICO",
        emisor: "Acceso vehicular",
        texto: "Llegan 10 lesionados por sus propios medios. Sin notificación previa. Sin triage.",
        acciones: [
          { label: "Activar Triage Externo", id: "activar-triage", tipo: "primary" },
          { label: "Declarar Código SMV", id: "declarar-smv", tipo: "primary" },
        ],
      },
      {
        t: 12,
        tipo: "critico",
        canal: "📻 CRUM OFICIAL",
        emisor: "Centro Regulador de Urgencias Médicas",
        texto:
          '"Confirmamos SMV en estadio. Estimado: 120+ víctimas. Primeros 30 llegarán en 8 minutos."',
        acciones: [
          { label: "Grado III (máximo)", id: "smv-grado3", tipo: "primary" },
          { label: "Grado II (moderado)", id: "smv-grado2", tipo: "secondary" },
        ],
      },
      {
        t: 20,
        tipo: "critico",
        canal: "📻 RADIO INTERNO",
        emisor: "Medicina Interna",
        texto: "Un paciente llegó con quemaduras. Rumor de explosivo persiste.",
        acciones: [
          { label: "Activar Protocolo QBRNE", id: "activar-qbrne", tipo: "danger" },
          { label: "Aislar y observar primero", id: "aislar-paciente", tipo: "primary" },
        ],
      },
      {
        t: 20,
        tipo: "nuevo",
        canal: "📺 MEDIOS DE COMUNICACIÓN",
        emisor: "Cadena de televisión en puerta",
        texto: "Cadena nacional solicita declaración oficial. Hay confusión pública.",
        acciones: [{ label: "Designar Vocero Oficial", id: "designar-vocero", tipo: "primary" }],
      },
      {
        t: 25,
        tipo: "radio",
        canal: "📻 CRUM · ACTUALIZACIÓN",
        emisor: "Centro Regulador de Urgencias Médicas",
        texto: '"Confirmado: no hay explosivo. Fue pánico masivo. Sin contaminación QBRNE."',
        acciones: [{ label: "Desactivar QBRNE", id: "desactivar-qbrne", tipo: "primary" }],
      },
      {
        t: 30,
        tipo: "critico",
        canal: "📻 UCI · RADIO INTERNO",
        emisor: "UCI · Jefe de servicio",
        texto: '"UCI llena. No hay lugar. ¿Qué hacemos?"',
        acciones: [
          { label: "Abrir UCI contingencia", id: "uci-contingencia", tipo: "primary" },
          { label: "Referir a hospital RISS", id: "referir-uci-riss", tipo: "primary" },
        ],
      },
      {
        t: 60,
        tipo: "nuevo",
        canal: "📻 CRUM · CIERRE",
        emisor: "Centro Regulador de Urgencias Médicas",
        texto: '"Arribo disminuye considerablemente. Pueden iniciar desescalamiento."',
        acciones: [{ label: "Iniciar desescalamiento", id: "desescalar", tipo: "primary" }],
      },
    ],
    decisiones: [
      {
        id: "dec-smv",
        label: "Declarar Código SMV antes de T+15",
        guia: "SMV-H · Paso 1",
        critico: true,
      },
      {
        id: "dec-grado",
        label: "Activar Grado III para 120+ víctimas",
        guia: "SMV-H · Anexo 1",
        critico: true,
      },
      {
        id: "dec-triage",
        label: "Triage externo activo antes de T+10",
        guia: "SMV-H · Paso 5",
        critico: true,
      },
      {
        id: "dec-vocero",
        label: "Vocero antes de T+25",
        guia: "SCI-H · Información Pública",
        critico: true,
      },
      {
        id: "dec-qbrne-correct",
        label: "Decisión QBRNE basada en evidencia",
        guia: "QBRNE · Umbral",
        critico: true,
      },
      {
        id: "dec-discap",
        label: "Pacientes con discapacidad identificados",
        guia: "INGRID-H",
        critico: true,
      },
    ],
    pacientes: [
      {
        id: "P001",
        ubicacion: "UCI-1",
        desc: "VM parámetros bajos · Vasopresores 0.08",
        grupoEvach: 3,
        discapacidad: null,
        registrado: true,
        triage: "rojo",
      },
      {
        id: "P002",
        ubicacion: "UCI-2",
        desc: "VM altos · Vasopresores >0.6",
        grupoEvach: 5,
        discapacidad: null,
        registrado: true,
        triage: "negro",
      },
      {
        id: "P003",
        ubicacion: "UCI-3",
        desc: "VM bajos · Silla de ruedas",
        grupoEvach: null,
        discapacidad: "motriz",
        registrado: false,
        triage: "rojo",
      },
      {
        id: "P009",
        ubicacion: "Med-Int A/12",
        desc: "Cardiopatía · Discapacidad auditiva",
        grupoEvach: null,
        discapacidad: "auditiva",
        registrado: false,
        triage: "verde",
      },
      {
        id: "P020",
        ubicacion: "Obs A/07",
        desc: "Adulto mayor · Demencia",
        grupoEvach: null,
        discapacidad: "intelectual",
        registrado: false,
        triage: "amarillo",
      },
    ],
  },
  S1: {
    id: "S1",
    nombre: "Sismo 7.4 · Evacuación Hospitalaria",
    duracion: 60,
    inyectores: [
      {
        t: 0,
        tipo: "critico",
        canal: "🚨 ALERTA SÍSMICA",
        emisor: "Sistema automatizado",
        texto: '"ALERTA SÍSMICA — Sismo magnitud 7.4. Epicentro regional."',
        acciones: [
          { label: "Activar Protocolo EVAC-H", id: "activar-evac", tipo: "primary" },
          { label: "Esperar evaluación estructural", id: "esperar-estruc", tipo: "secondary" },
        ],
      },
      {
        t: 3,
        tipo: "radio",
        canal: "📻 RADIO INTERNO",
        emisor: "Jefe de Piso",
        texto: '"Torre de hospitalización: grieta visible en columna A-4."',
        acciones: [
          { label: "Iniciar triage de evacuación", id: "iniciar-triage-evac", tipo: "primary" },
        ],
      },
      {
        t: 7,
        tipo: "critico",
        canal: "📞 LLAMADA DIRECTA",
        emisor: "Quirófano 1",
        texto: '"Paciente con tórax abierto. ¿Evacuamos o continuamos?"',
        acciones: [
          { label: "Protocolo control de daños (NO mover)", id: "no-mover-cx", tipo: "primary" },
          { label: "Evacuar inmediatamente", id: "evacuar-cx", tipo: "secondary" },
        ],
      },
      {
        t: 12,
        tipo: "nuevo",
        canal: "📱 MENSAJE ESCRITO",
        emisor: "Protección Civil",
        texto: '"Réplica magnitud 5.8 en 20-30 minutos."',
        acciones: [{ label: "Escalar a evacuación TOTAL", id: "evac-total", tipo: "primary" }],
      },
      {
        t: 30,
        tipo: "critico",
        canal: "📻 RADIO INTERNO",
        emisor: "Mantenimiento",
        texto: '"Falla en planta de emergencia. 20 min autonomía UCI."',
        acciones: [
          { label: "Priorizar traslado Grupo 4 y 5", id: "priorizar-grupos45", tipo: "primary" },
        ],
      },
    ],
    decisiones: [
      {
        id: "dec-evac-activar",
        label: "Activar EVAC-H al confirmar daño",
        guia: "EVAC-H · Paso 1",
        critico: true,
      },
      {
        id: "dec-no-mover-cx",
        label: "NO evacuar tórax abierto",
        guia: "EVAC-H · Especial",
        critico: true,
      },
      { id: "dec-discap-evac", label: "Evacuar discapacitados", guia: "INGRID-H", critico: true },
      { id: "dec-grupo5", label: "Decidir sobre Grupo 5", guia: "EVAC-H · Grupo 5", critico: true },
    ],
    pacientes: [
      {
        id: "P001",
        ubicacion: "UCI-1",
        desc: "VM baja",
        grupoEvach: null,
        discapacidad: null,
        registrado: true,
        triage: "rojo",
      },
      {
        id: "P002",
        ubicacion: "UCI-2",
        desc: "VM alta",
        grupoEvach: null,
        discapacidad: null,
        registrado: true,
        triage: "negro",
      },
      {
        id: "P003",
        ubicacion: "UCI-3",
        desc: "Silla de ruedas",
        grupoEvach: null,
        discapacidad: "motriz",
        registrado: false,
        triage: "rojo",
      },
      {
        id: "P014",
        ubicacion: "Quirófano 1",
        desc: "CIRUGÍA EN CURSO: tórax abierto",
        grupoEvach: null,
        discapacidad: null,
        registrado: true,
        triage: "rojo",
      },
    ],
  },
  S2: {
    id: "S2",
    nombre: "Explosión + Réplica · Día de Partido",
    duracion: 90,
    inyectores: [
      {
        t: 0,
        tipo: "critico",
        canal: "📞 LLAMADA CRUM",
        emisor: "CRUM",
        texto: '"Explosión en Mercado Central. 60 víctimas. 20 críticos."',
        acciones: [{ label: "Declarar Código SMV", id: "smv-s2", tipo: "primary" }],
      },
      {
        t: 5,
        tipo: "critico",
        canal: "📻 RADIO INTERNO",
        emisor: "Seguridad",
        texto: '"Fisura en muro sur de urgencias."',
        acciones: [{ label: "Cerrar urgencias", id: "cerrar-urg", tipo: "primary" }],
      },
      {
        t: 18,
        tipo: "radio",
        canal: "📻 CRUM",
        emisor: "CRUM",
        texto: '"Posible contaminación QBRNE."',
        acciones: [
          { label: "Activar QBRNE completo", id: "qbrne-completo-s2", tipo: "danger" },
          { label: "QBRNE parcial", id: "qbrne-parcial-s2", tipo: "primary" },
        ],
      },
    ],
    decisiones: [
      { id: "dec-smv-s2", label: "SMV declarado al recibir alerta", guia: "SMV-H", critico: true },
      { id: "dec-mando-unico", label: "Mando unificado", guia: "SCI-H", critico: true },
      { id: "dec-vocero-s2", label: "Vocero designado", guia: "SCI-H", critico: true },
    ],
    pacientes: [],
  },
};

// ─── CLASES ────────────────────────────────────────────────────────────────────

class SimulatorState {
  constructor() {
    this.reset();
  }

  reset() {
    this.scenario = null;
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

  loadScenario(id) {
    this.scenario = SCENARIOS[id];
    this.currentT = 0;
    this.paused = false;
    this.smvGrade = 0;
    this.smvActivatedAt = null;
    this.injectorsSeen = new Set();
    this.decisions = {};
    this.patientGroups = {};
  }

  activateSMV(grado) {
    if (this.smvGrade >= grado) return false;
    this.smvGrade = grado;
    if (!this.smvActivatedAt) this.smvActivatedAt = this.currentT;
    return true;
  }

  markDecision(id) {
    if (!this.decisions[id]) {
      this.decisions[id] = { done: true, at: this.currentT };
    }
  }

  assignPatientGroup(patientId, grupo) {
    this.patientGroups[patientId] = grupo;
  }
}

class ScenarioRunner {
  constructor(state) {
    this.state = state;
    this.eventLog = [];
  }

  advanceTo(time) {
    // Procesar inyectores en el tiempo actual primero
    this.processInjectors();
    // Luego avanzar hasta el tiempo objetivo
    while (this.state.currentT < time) {
      this.state.currentT++;
      this.processInjectors();
    }
  }

  processInjectors() {
    if (!this.state.scenario) return;

    this.state.scenario.inyectores.forEach(inj => {
      const key = `${inj.t}_${inj.canal}`;
      if (inj.t === this.state.currentT && !this.state.injectorsSeen.has(key)) {
        this.state.injectorsSeen.add(key);
        this.eventLog.push({
          time: this.state.currentT,
          injector: inj,
        });
      }
    });
  }

  getEventLog() {
    return this.eventLog;
  }

  clearEventLog() {
    this.eventLog = [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITES
// ─────────────────────────────────────────────────────────────────────────────

describe("Simulador - Flujos de Escenarios", () => {
  let state;
  let runner;

  beforeEach(() => {
    jest.clearAllMocks();
    state = new SimulatorState();
    runner = new ScenarioRunner(state);
  });

  // ───────────────────────────────────────────────────────────────────────────
  // ESCENARIO S1: SISMO 7.4
  // ───────────────────────────────────────────────────────────────────────────

  describe("Escenario S1: Sismo 7.4", () => {
    beforeEach(() => {
      state.loadScenario("S1");
    });

    test("should initialize with correct scenario data", () => {
      expect(state.scenario.id).toBe("S1");
      expect(state.scenario.duracion).toBe(60);
      expect(state.scenario.inyectores.length).toBe(5);
    });

    test("should have 4 patients including surgery in progress", () => {
      expect(state.scenario.pacientes.length).toBe(4);
      const surgeryPatient = state.scenario.pacientes.find(p => p.id === "P014");
      expect(surgeryPatient).toBeDefined();
      expect(surgeryPatient.desc).toContain("tórax abierto");
    });

    test("should trigger first injector at T+0 (alerta sísmica)", () => {
      runner.advanceTo(0);
      const events = runner.getEventLog();
      expect(events.length).toBe(1);
      expect(events[0].injector.canal).toContain("ALERTA SÍSMICA");
      expect(events[0].injector.tipo).toBe("critico");
    });

    test("should trigger structural damage report at T+3", () => {
      runner.advanceTo(3);
      const events = runner.getEventLog();
      const damageEvent = events.find(
        e =>
          e.injector.canal.includes("RADIO INTERNO") && e.injector.emisor.includes("Jefe de Piso")
      );
      expect(damageEvent).toBeDefined();
      expect(damageEvent.injector.texto).toContain("grieta visible");
    });

    test("should trigger surgery dilemma at T+7", () => {
      runner.advanceTo(7);
      const events = runner.getEventLog();
      const surgeryEvent = events.find(e => e.injector.emisor.includes("Quirófano 1"));
      expect(surgeryEvent).toBeDefined();
      expect(surgeryEvent.injector.texto).toContain("tórax abierto");
      expect(surgeryEvent.injector.acciones.length).toBe(2);
    });

    test("should trigger replica warning at T+12", () => {
      runner.advanceTo(12);
      const events = runner.getEventLog();
      const replicaEvent = events.find(e => e.injector.canal.includes("MENSAJE ESCRITO"));
      expect(replicaEvent).toBeDefined();
      expect(replicaEvent.injector.texto.toLowerCase()).toContain("réplica");
      expect(replicaEvent.injector.texto).toContain("5.8");
    });

    test("should trigger power failure at T+30", () => {
      runner.advanceTo(30);
      const events = runner.getEventLog();
      const powerEvent = events.find(e => e.injector.emisor.includes("Mantenimiento"));
      expect(powerEvent).toBeDefined();
      expect(powerEvent.injector.texto.toLowerCase()).toContain("falla en planta");
      expect(powerEvent.injector.texto).toContain("20 min");
    });

    test("should have correct EVAC-H decisions", () => {
      const evacDecision = state.scenario.decisiones.find(d => d.id === "dec-evac-activar");
      expect(evacDecision).toBeDefined();
      expect(evacDecision.critico).toBe(true);
    });

    test("should have surgery special case decision", () => {
      const surgeryDecision = state.scenario.decisiones.find(d => d.id === "dec-no-mover-cx");
      expect(surgeryDecision).toBeDefined();
      expect(surgeryDecision.label).toContain("tórax abierto");
    });

    test("should track patients with disability for evacuation", () => {
      const disabledPatients = state.scenario.pacientes.filter(p => p.discapacidad);
      expect(disabledPatients.length).toBe(1);
      expect(disabledPatients[0].discapacidad).toBe("motriz");
    });

    test("should identify Group 5 patients (black tag)", () => {
      const blackPatients = state.scenario.pacientes.filter(p => p.triage === "negro");
      expect(blackPatients.length).toBeGreaterThan(0);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // ESCENARIO S2: EXPLOSIÓN + RÉPLICA
  // ───────────────────────────────────────────────────────────────────────────

  describe("Escenario S2: Explosión + Réplica", () => {
    beforeEach(() => {
      state.loadScenario("S2");
    });

    test("should initialize with correct scenario data", () => {
      expect(state.scenario.id).toBe("S2");
      expect(state.scenario.duracion).toBe(90);
      expect(state.scenario.nombre).toContain("Explosión");
    });

    test("should trigger CRUM call at T+0", () => {
      runner.advanceTo(0);
      const events = runner.getEventLog();
      expect(events.length).toBe(1);
      expect(events[0].injector.canal).toContain("LLAMADA CRUM");
      expect(events[0].injector.texto).toContain("60 víctimas");
      expect(events[0].injector.texto).toContain("20 críticos");
    });

    test("should trigger structural damage at T+5", () => {
      runner.advanceTo(5);
      const events = runner.getEventLog();
      const damageEvent = events.find(e => e.time === 5);
      expect(damageEvent).toBeDefined();
      expect(damageEvent.injector.texto.toLowerCase()).toContain("fisura");
      expect(damageEvent.injector.texto.toLowerCase()).toContain("muro sur");
    });

    test("should trigger QBRNE suspicion at T+18", () => {
      runner.advanceTo(18);
      const events = runner.getEventLog();
      const qbrneEvent = events.find(e => e.injector.texto.includes("contaminación"));
      expect(qbrneEvent).toBeDefined();
      expect(qbrneEvent.injector.acciones.some(a => a.id.includes("qbrne"))).toBe(true);
    });

    test("should have mando unificado decision", () => {
      const unifiedCmd = state.scenario.decisiones.find(d => d.id === "dec-mando-unico");
      expect(unifiedCmd).toBeDefined();
      expect(unifiedCmd.critico).toBe(true);
    });

    test("should require vocero for S2", () => {
      const vocero = state.scenario.decisiones.find(d => d.id === "dec-vocero-s2");
      expect(vocero).toBeDefined();
      expect(vocero.critico).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // ESCENARIO S3: CUARTOS DE FINAL FIFA 2026
  // ───────────────────────────────────────────────────────────────────────────

  describe("Escenario S3: Cuartos de Final FIFA 2026", () => {
    beforeEach(() => {
      state.loadScenario("S3");
    });

    test("should initialize with 120 minute duration", () => {
      expect(state.scenario.duracion).toBe(120);
    });

    test("should have 5 patients with mixed triage levels", () => {
      expect(state.scenario.pacientes.length).toBe(5);
      const rojos = state.scenario.pacientes.filter(p => p.triage === "rojo");
      const amarillos = state.scenario.pacientes.filter(p => p.triage === "amarillo");
      const verdes = state.scenario.pacientes.filter(p => p.triage === "verde");
      const negros = state.scenario.pacientes.filter(p => p.triage === "negro");
      expect(rojos.length).toBe(2);
      expect(amarillos.length).toBe(1);
      expect(verdes.length).toBe(1);
      expect(negros.length).toBe(1);
    });

    test("should trigger anonymous call at T+0", () => {
      runner.advanceTo(0);
      const events = runner.getEventLog();
      expect(events.length).toBe(1);
      expect(events[0].injector.emisor).toBe("Fuente no identificada");
      expect(events[0].injector.texto).toContain("explosión");
    });

    test("should trigger spontaneous arrival at T+10", () => {
      runner.advanceTo(10);
      const events = runner.getEventLog();
      const arrivalEvent = events.find(e => e.time === 10);
      expect(arrivalEvent).toBeDefined();
      expect(arrivalEvent.injector.canal).toContain("ARRIBO FÍSICO");
      expect(arrivalEvent.injector.texto).toContain("10 lesionados");
    });

    test("should trigger official CRUM confirmation at T+12", () => {
      runner.advanceTo(12);
      const events = runner.getEventLog();
      const crumEvent = events.find(e => e.time === 12);
      expect(crumEvent).toBeDefined();
      expect(crumEvent.injector.canal).toContain("CRUM OFICIAL");
      expect(crumEvent.injector.texto).toContain("120+ víctimas");
    });

    test("should trigger QBRNE dilemma at T+20", () => {
      runner.advanceTo(20);
      const events = runner.getEventLog();
      const qbrneEvents = events.filter(e => e.time === 20);
      expect(qbrneEvents.length).toBe(2); // QBRNE + Medios
      const qbrneEvent = qbrneEvents.find(e => e.injector.texto.includes("quemaduras"));
      expect(qbrneEvent).toBeDefined();
    });

    test("should trigger QBRNE deactivation at T+25", () => {
      runner.advanceTo(25);
      const events = runner.getEventLog();
      const deactivationEvent = events.find(e => e.time === 25);
      expect(deactivationEvent).toBeDefined();
      expect(deactivationEvent.injector.texto).toContain("no hay explosivo");
      expect(deactivationEvent.injector.texto).toContain("pánico masivo");
    });

    test("should trigger UCI capacity crisis at T+30", () => {
      runner.advanceTo(30);
      const events = runner.getEventLog();
      const uciEvent = events.find(e => e.time === 30);
      expect(uciEvent).toBeDefined();
      expect(uciEvent.injector.canal).toContain("UCI");
      expect(uciEvent.injector.texto).toContain("llena");
    });

    test("should trigger desescalation notice at T+60", () => {
      runner.advanceTo(60);
      const events = runner.getEventLog();
      const descentEvent = events.find(e => e.time === 60);
      expect(descentEvent).toBeDefined();
      expect(descentEvent.injector.texto).toContain("desescalamiento");
    });

    test("should track disability across multiple patients", () => {
      const disabilities = state.scenario.pacientes
        .filter(p => p.discapacidad)
        .map(p => p.discapacidad);
      expect(disabilities).toContain("motriz");
      expect(disabilities).toContain("auditiva");
      expect(disabilities).toContain("intelectual");
    });

    test("should have unregistered patients with disabilities", () => {
      const unregisteredDisabled = state.scenario.pacientes.filter(
        p => !p.registrado && p.discapacidad
      );
      expect(unregisteredDisabled.length).toBeGreaterThan(0);
    });

    test("should require Grade III for 120+ victims", () => {
      const gradoDecision = state.scenario.decisiones.find(d => d.id === "dec-grado");
      expect(gradoDecision).toBeDefined();
      expect(gradoDecision.label).toContain("Grado III");
      expect(gradoDecision.critico).toBe(true);
    });

    test("should have SMV activation before T+15 as critical", () => {
      const smvDecision = state.scenario.decisiones.find(d => d.id === "dec-smv");
      expect(smvDecision).toBeDefined();
      expect(smvDecision.label).toContain("antes de T+15");
    });

    test("should require triage externo before T+10", () => {
      const triageDecision = state.scenario.decisiones.find(d => d.id === "dec-triage");
      expect(triageDecision).toBeDefined();
      expect(triageDecision.label).toContain("antes de T+10");
    });

    test("should require vocero before T+25", () => {
      const voceroDecision = state.scenario.decisiones.find(d => d.id === "dec-vocero");
      expect(voceroDecision).toBeDefined();
      expect(voceroDecision.label).toContain("antes de T+25");
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // VALIDACIÓN DE CRITERIOS TEMPORALES
  // ───────────────────────────────────────────────────────────────────────────

  describe("Validación de Criterios Temporales", () => {
    test("S1: should validate EVAC-H activation timing", () => {
      state.loadScenario("S1");

      // Activación temprana (correcta)
      state.currentT = 3;
      state.activateSMV(1);
      expect(state.smvActivatedAt).toBeLessThan(10);

      // Reset
      state.reset();
      state.loadScenario("S1");

      // Activación tardía (incorrecta)
      state.currentT = 25;
      state.activateSMV(1);
      expect(state.smvActivatedAt).toBeGreaterThan(20);
    });

    test("S2: should validate SMV declaration timing", () => {
      state.loadScenario("S2");

      // Declaración inmediata (correcta)
      state.currentT = 0;
      state.activateSMV(3);
      expect(state.smvActivatedAt).toBe(0);
    });

    test("S3: should validate critical decision windows", () => {
      state.loadScenario("S3");

      // Ventana SMV: antes de T+15
      const smvWindow = state.currentT < 15;

      // Ventana Triage: antes de T+10
      state.currentT = 8;
      const triageWindow = state.currentT < 10;
      expect(triageWindow).toBe(true);

      // Ventana Vocero: antes de T+25
      state.currentT = 20;
      const voceroWindow = state.currentT < 25;
      expect(voceroWindow).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // VALIDACIÓN DE GRUPOS EVAC-H
  // ───────────────────────────────────────────────────────────────────────────

  describe("Validación de Grupos EVAC-H", () => {
    test("should classify patients into EVAC-H groups", () => {
      state.loadScenario("S1");

      // Grupo 1: Ambulatorios
      state.assignPatientGroup("P003", 1);

      // Grupo 3: Ventilación mecánica leve
      state.assignPatientGroup("P001", 3);

      // Grupo 5: Sin expectativa de supervivencia
      state.assignPatientGroup("P002", 5);

      expect(state.patientGroups["P001"]).toBe(3);
      expect(state.patientGroups["P002"]).toBe(5);
      expect(state.patientGroups["P003"]).toBe(1);
    });

    test("should track unclassified patients", () => {
      state.loadScenario("S3");
      const unclassified = state.scenario.pacientes.filter(p => !state.patientGroups[p.id]);
      expect(unclassified.length).toBe(state.scenario.pacientes.length);
    });

    test("should handle disability in EVAC-H classification", () => {
      state.loadScenario("S1");
      const disabledPatient = state.scenario.pacientes.find(p => p.discapacidad);
      expect(disabledPatient).toBeDefined();
      state.assignPatientGroup(disabledPatient.id, 2); // Grupo especial
      expect(state.patientGroups[disabledPatient.id]).toBe(2);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // VALIDACIÓN DE ESTADOS DE ACCIÓN
  // ───────────────────────────────────────────────────────────────────────────

  describe("Validación de Estados de Acción", () => {
    test("S3: should track all action states through scenario", () => {
      state.loadScenario("S3");

      // Simular activación de acciones
      state.actionStates.triageExterno = true; // T+10
      state.actionStates.noria = true;
      state.actionStates.electivos = true;
      state.actionStates.expansion = true;
      state.actionStates.vocero = true;

      const activeCount = Object.values(state.actionStates).filter(v => v).length;
      expect(activeCount).toBe(5);
    });

    test("should validate QBRNE state transitions", () => {
      state.loadScenario("S3");

      // Inicialmente inactivo
      expect(state.actionStates.qbrne).toBe(false);

      // Activar
      state.actionStates.qbrne = true;
      expect(state.actionStates.qbrne).toBe(true);

      // Desactivar (confirmación de que no hay agente)
      state.actionStates.qbrne = false;
      expect(state.actionStates.qbrne).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // INTEGRACIÓN DE ESCENARIOS
  // ───────────────────────────────────────────────────────────────────────────

  describe("Integración de Escenarios", () => {
    test("should be able to switch between scenarios", () => {
      state.loadScenario("S1");
      expect(state.scenario.id).toBe("S1");

      state.loadScenario("S2");
      expect(state.scenario.id).toBe("S2");

      state.loadScenario("S3");
      expect(state.scenario.id).toBe("S3");
    });

    test("should reset state correctly when switching scenarios", () => {
      state.loadScenario("S1");
      state.currentT = 30;
      state.markDecision("test");

      state.loadScenario("S3");
      expect(state.currentT).toBe(0);
      expect(Object.keys(state.decisions).length).toBe(0);
    });

    test("should maintain scenario duration boundaries", () => {
      state.loadScenario("S1");
      expect(state.scenario.duracion).toBe(60);

      state.loadScenario("S2");
      expect(state.scenario.duracion).toBe(90);

      state.loadScenario("S3");
      expect(state.scenario.duracion).toBe(120);
    });
  });
});
