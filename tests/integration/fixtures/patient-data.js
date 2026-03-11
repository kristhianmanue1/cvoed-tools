/**
 * Fixtures para tests de integración
 * Proporciona datos de prueba realistas para los diferentes componentes del sistema
 */

export const patientFixtures = {
  rojo: {
    id_interno: "P-001",
    folio_local: "F-001",
    nombre: "Juan Pérez",
    nss: "12345678901",
    edad_estimada: 45,
    sexo: "M",
    pulsera_id: "BR-001",
    discapacidad: null,
    triage_inicial: "ROJO",
    triage_actual: "ROJO",
    area_actual: "UCI",
    estado: "ACTIVO",
    procedencia: "URGENCIAS",
    ts_ingreso: "2026-03-10T10:30:00.000Z",
    ts_ultima_mod: "2026-03-10T10:30:00.000Z",
    operador_registro: "DR. SMITH",
    telefono: "555-1234",
    contacto: "María Pérez - esposa",
    grupoEvach: 3,
    requiereEvacuacion: true,
    grupoEvacuacion: "A1",
    requiereUCI: true,
    presionArterial: "80/40",
    frecuenciaRespiratoria: 28,
    saturacionO2: 88,
    nivelConciencia: "respuesta_verbal",
    lesiones: ["torax_abierto", "hemorragia_activa"],
  },

  amarillo: {
    id_interno: "P-002",
    folio_local: "F-002",
    nombre: "María González",
    nss: "98765432109",
    edad_estimada: 32,
    sexo: "F",
    pulsera_id: "BR-002",
    discapacidad: null,
    triage_inicial: "AMARILLO",
    triage_actual: "AMARILLO",
    area_actual: "OBSERVACION",
    estado: "ACTIVO",
    procedencia: "TRIAGE",
    ts_ingreso: "2026-03-10T11:00:00.000Z",
    ts_ultima_mod: "2026-03-10T11:00:00.000Z",
    operador_registro: "DRA. LOPEZ",
    telefono: "555-5678",
    contacto: "Carlos González - esposo",
    grupoEvach: 2,
    requiereEvacuacion: false,
    grupoEvacuacion: null,
    requiereUCI: false,
    presionArterial: "100/70",
    frecuenciaRespiratoria: 22,
    saturacionO2: 94,
    nivelConciencia: "orientado",
    lesiones: ["fractura_extremidad"],
  },

  verde: {
    id_interno: "P-003",
    folio_local: "F-003",
    nombre: "Pedro López",
    nss: "45678912301",
    edad_estimada: 28,
    sexo: "M",
    pulsera_id: "BR-003",
    discapacidad: null,
    triage_inicial: "VERDE",
    triage_actual: "VERDE",
    area_actual: "OBSERVACION",
    estado: "ACTIVO",
    procedencia: "URGENCIAS",
    ts_ingreso: "2026-03-10T11:15:00.000Z",
    ts_ultima_mod: "2026-03-10T11:15:00.000Z",
    operador_registro: "DR. MARTINEZ",
    telefono: "555-9012",
    contacto: "Ana López - hermana",
    grupoEvach: 1,
    requiereEvacuacion: false,
    grupoEvacuacion: null,
    requiereUCI: false,
    presionArterial: "120/80",
    frecuenciaRespiratoria: 16,
    saturacionO2: 98,
    nivelConciencia: "orientado",
    lesiones: ["contusion_leve"],
  },

  negro: {
    id_interno: "P-004",
    folio_local: "F-004",
    nombre: "Carlos Ruiz",
    nss: "78912345601",
    edad_estimada: 67,
    sexo: "M",
    pulsera_id: "BR-004",
    discapacidad: null,
    triage_inicial: "NEGRO",
    triage_actual: "NEGRO",
    area_actual: "OBSERVACION",
    estado: "FALLECIDO",
    procedencia: "URGENCIAS",
    ts_ingreso: "2026-03-10T10:45:00.000Z",
    ts_ultima_mod: "2026-03-10T12:00:00.000Z",
    operador_registro: "DR. SMITH",
    grupoEvach: 5,
    requiereEvacuacion: false,
    causaMuerte: "trauma_severo",
  },

  conDiscapacidad: {
    id_interno: "P-005",
    folio_local: "F-005",
    nombre: "Ana Martínez",
    nss: "32165498701",
    edad_estimada: 55,
    sexo: "F",
    pulsera_id: "BR-005",
    discapacidad: "auditiva",
    triage_inicial: "AMARILLO",
    triage_actual: "AMARILLO",
    area_actual: "OBSERVACION",
    estado: "ACTIVO",
    procedencia: "URGENCIAS",
    ts_ingreso: "2026-03-10T11:30:00.000Z",
    ts_ultima_mod: "2026-03-10T11:30:00.000Z",
    operador_registro: "DRA. LOPEZ",
    telefono: "555-3456",
    contacto: "Jose Martínez - hijo",
    requiereComunicacionAlternativa: true,
    mascotaServicio: true,
    grupoEvach: 2,
  },

  pacienteQuirofano: {
    id_interno: "P-014",
    folio_local: "F-014",
    nombre: "Roberto Sánchez",
    nss: "65498732101",
    edad_estimada: 52,
    sexo: "M",
    pulsera_id: "BR-014",
    discapacidad: null,
    triage_inicial: "ROJO",
    triage_actual: "ROJO",
    area_actual: "QUIROFANO",
    estado: "ACTIVO",
    procedencia: "QUIROFANO",
    ts_ingreso: "2026-03-10T09:00:00.000Z",
    ts_ultima_mod: "2026-03-10T10:30:00.000Z",
    operador_registro: "DR. SMITH",
    enCirugia: true,
    minutoCirugia: 45,
    procedimiento: "torax_abierto",
    grupoEvach: null,
  },

  pacienteUCI: {
    id_interno: "P-001-UCI",
    folio_local: "F-UCI-001",
    nombre: "Luisa Ramírez",
    nss: "14725836901",
    edad_estimada: 58,
    sexo: "F",
    pulsera_id: "BR-UCI-001",
    discapacidad: null,
    triage_inicial: "ROJO",
    triage_actual: "ROJO",
    area_actual: "UCI",
    estado: "ACTIVO",
    procedencia: "UCI",
    ts_ingreso: "2026-03-10T08:00:00.000Z",
    ts_ultima_mod: "2026-03-10T11:00:00.000Z",
    operador_registro: "DR. GARCIA",
    ventilacionMecanica: true,
    vasopresores: "0.08",
    grupoEvach: 3,
  },

  pacientePediatrico: {
    id_interno: "P-PED-001",
    folio_local: "F-PED-001",
    nombre: "Mateo Herrera",
    nss: null,
    edad_estimada: 6,
    sexo: "M",
    pulsera_id: "BR-PED-001",
    discapacidad: null,
    triage_inicial: "AMARILLO",
    triage_actual: "AMARILLO",
    area_actual: "PEDIATRIA",
    estado: "ACTIVO",
    procedencia: "URGENCIAS",
    ts_ingreso: "2026-03-10T11:45:00.000Z",
    ts_ultima_mod: "2026-03-10T11:45:00.000Z",
    operador_registro: "DRA. LOPEZ",
    acompanante: "Madre",
    grupoEvach: 2,
    asma: "moderada",
    oxigenoSuplementario: true,
  },
};

export const hospitalStateFixture = {
  uci: { capacidad: 8, ocupadas: 5 },
  urgencias: { capacidad: 39, ocupadas: 25 },
  quirófano: { capacidad: 6, ocupadas: 4 },
  totalCamas: 220,
  pacientesActuales: 180,
  quirófanosEnUso: ["Quirófano 1"],
  pacientesEnQuirurgico: 1,
  danoEstructural: false,
  plantaEmergenciaActiva: true,
  ambulanciasDisponibles: 3,
  personalDisponible: {
    medicos: 12,
    enfermeras: 30,
    camilleros: 8,
  },
  protocolosActivos: [],
};

export const scenarioFixtures = {
  sismo: {
    id: "S1",
    nombre: "Sismo 7.4 · Evacuación Hospitalaria",
    victims: 4,
    structuralDamage: true,
    activeSurgeries: 1,
    affectedServices: ["UCI", "Urgencias"],
    duracion: 60,
    magnitud: 7.4,
    replicaEsperada: true,
    replicaMagnitud: 5.8,
    replicaTiempo: 20,
    decisiones: [
      { id: "dec-evac-activar", critico: true, descripcion: "Activar protocolo EVAC-H" },
      { id: "dec-no-mover-cx", critico: true, descripcion: "No mover paciente en quirófano" },
      { id: "dec-discap-evac", critico: false, descripcion: "Identificar discapacidades en evacuación" },
    ],
  },

  explosion: {
    id: "S2",
    nombre: "Explosión + Réplica · Día de Partido",
    victims: 60,
    burnPatients: 15,
    triageDistribution: { rojo: 20, amarillo: 25, verde: 15 },
    duracion: 90,
    distanciaExplosion: 500,
    qbrneActivo: false,
    danoUrgencias: true,
    decisiones: [
      { id: "dec-smv-s2", critico: true, descripcion: "Activar SMV-H Grado III" },
      { id: "dec-mando-unico", critico: true, descripcion: "Establecer SCI-H" },
      { id: "dec-qbrne-s2", critico: true, descripcion: "Evaluar activación QBRNE" },
      { id: "dec-vocero-s2", critico: true, descripcion: "Designar vocero único" },
    ],
  },

  estampida: {
    id: "S3",
    nombre: "Cuartos de Final · Copa Mundial FIFA 2026",
    victims: 120,
    triageDistribution: { rojo: 20, amarillo: 40, verde: 60 },
    requiresQBRNE: true,
    requiresSMV: true,
    duracion: 120,
    requiresSCIH: true,
    decisiones: [
      { id: "dec-triage", critico: true, descripcion: "Activar triage externo" },
      { id: "dec-smv", critico: true, descripcion: "Declarar SMV-H" },
      { id: "dec-grado", critico: true, descripcion: "Establecer Grado III" },
      { id: "dec-qbrne-correct", critico: true, descripcion: "No activar QBRNE sin confirmación" },
    ],
  },
};

export const operadorFixtures = {
  medico: {
    id: "OP-001",
    nombre: "Dr. Juan Smith",
    rol: "MEDICO",
    turno: "MATUTINO",
    pin_hash: "hash123",
    activo: 1,
  },
  enfermera: {
    id: "OP-002",
    nombre: "Enf. María López",
    rol: "ENFERMERA",
    turno: "MATUTINO",
    pin_hash: "hash456",
    activo: 1,
  },
  triage: {
    id: "OP-003",
    nombre: "Dr. Carlos Martínez",
    rol: "TRIAGE",
    turno: "VESPERTINO",
    pin_hash: "hash789",
    activo: 1,
  },
};

export const trazabilidadFixtures = {
  ingreso: {
    id_paciente: "P-001",
    ts_evento: "2026-03-10T10:30:00.000Z",
    tipo_evento: "INGRESO",
    descripcion: "Paciente registrado en sistema",
    valor_anterior: null,
    valor_nuevo: "ACTIVO",
    operador: "DR. SMITH",
    area: "URGENCIAS",
  },
  cambioTriage: {
    id_paciente: "P-001",
    ts_evento: "2026-03-10T11:00:00.000Z",
    tipo_evento: "CAMBIO_TRIAGE",
    descripcion: "Cambio de nivel de triage",
    valor_anterior: "ROJO",
    valor_nuevo: "AMARILLO",
    operador: "DR. SMITH",
    area: "URGENCIAS",
  },
  evacuacion: {
    id_paciente: "P-003",
    ts_evento: "2026-03-10T12:00:00.000Z",
    tipo_evento: "EVACUACION",
    descripcion: "Paciente evacuado a área segura",
    valor_anterior: "UCI",
    valor_nuevo: "EVACUADO",
    operador: "DRA. LOPEZ",
    area: "HOSPITALIZACION",
  },
};

export const auditoriaFixtures = {
  login: {
    ts: "2026-03-10T08:00:00.000Z",
    operador: "DR. SMITH",
    accion: "LOGIN",
    tabla_ref: "operadores",
    id_ref: "OP-001",
    detalle: "Inicio de sesión exitoso",
  },
  registro: {
    ts: "2026-03-10T10:30:00.000Z",
    operador: "DR. SMITH",
    accion: "CREAR",
    tabla_ref: "pacientes",
    id_ref: "P-001",
    detalle: "Registro de nuevo paciente",
  },
  exportacion: {
    ts: "2026-03-10T14:00:00.000Z",
    operador: "DRA. LOPEZ",
    accion: "EXPORTAR",
    tabla_ref: "pacientes",
    id_ref: null,
    detalle: "Exportación de datos a Excel",
  },
};

export const exportDataFixture = {
  pacientes: [patientFixtures.rojo, patientFixtures.amarillo, patientFixtures.verde],
  metricas: {
    total: 3,
    porTriage: {
      ROJO: 1,
      AMARILLO: 1,
      VERDE: 1,
      NEGRO: 0,
    },
    porArea: {
      UCI: 1,
      OBSERVACION: 2,
      URGENCIAS: 0,
    },
  },
  metadatos: {
    fechaExportacion: "2026-03-10T14:00:00.000Z",
    operador: "DRA. LOPEZ",
    hospital: "Hospital de Nunca Jamás",
    version: "2.0.0",
  },
};

// Helper para generar pacientes masivos
export function generateMassPatients(count, triageDistribution) {
  const patients = [];
  let triageCounts = { ROJO: 0, AMARILLO: 0, VERDE: 0, NEGRO: 0 };

  for (let i = 0; i < count; i++) {
    // Determinar triage según distribución
    let triage;
    const pct = i / count;
    if (pct < triageDistribution.rojo) {
      triage = "ROJO";
      triageCounts.ROJO++;
    } else if (pct < triageDistribution.rojo + triageDistribution.amarillo) {
      triage = "AMARILLO";
      triageCounts.AMARILLO++;
    } else if (
      pct <
      triageDistribution.rojo + triageDistribution.amarillo + triageDistribution.verde
    ) {
      triage = "VERDE";
      triageCounts.VERDE++;
    } else {
      triage = "NEGRO";
      triageCounts.NEGRO++;
    }

    patients.push({
      id_interno: `P-MASS-${(i + 1).toString().padStart(4, "0")}`,
      folio_local: `F-MASS-${(i + 1).toString().padStart(4, "0")}`,
      nombre: `Paciente ${i + 1}`,
      nss: null,
      edad_estimada: Math.floor(Math.random() * 70) + 18,
      sexo: ["M", "F", "I"][Math.floor(Math.random() * 3)], // Asegurar valor válido
      pulsera_id: `BR-MASS-${(i + 1).toString().padStart(4, "0")}`,
      discapacidad:
        Math.random() < 0.1
          ? ["motriz", "auditiva", "visual", "intelectual"][Math.floor(Math.random() * 4)]
          : null,
      triage_inicial: triage,
      triage_actual: triage,
      area_actual: triage === "ROJO" ? "UCI" : "OBSERVACION",
      estado: triage === "NEGRO" ? "FALLECIDO" : "ACTIVO",
      procedencia: "URGENCIAS",
      ts_ingreso: new Date(Date.now() + i * 60000).toISOString(),
      ts_ultima_mod: new Date(Date.now() + i * 60000).toISOString(),
      operador_registro: "DR. SMITH",
    });
  }

  return { patients, triageCounts };
}

// Helper para generar secuencia de eventos de simulador
export function generateSimulatorEvents(scenarioId, duration) {
  const events = [];
  const scenario = scenarioFixtures[scenarioId.toLowerCase()];

  if (!scenario) return events;

  // Eventos basados en el escenario
  if (scenarioId === "S1" || scenarioId === "sismo") {
    events.push(
      { t: 0, tipo: "critico", canal: "ALERTA SISMICA", texto: "Sismo magnitud 7.4 detectado" },
      {
        t: 7,
        tipo: "critico",
        canal: "QUIROFANO",
        texto: "Paciente en quirófano con tórax abierto",
      },
      {
        t: 12,
        tipo: "nuevo",
        canal: "PROTECCION CIVIL",
        texto: "Réplica estimada en 20-30 minutos",
      },
      { t: 30, tipo: "critico", canal: "MANTENIMIENTO", texto: "Falla en planta de emergencia" }
    );
  } else if (scenarioId === "S2" || scenarioId === "explosion") {
    events.push(
      { t: 0, tipo: "critico", canal: "CRUM", texto: "Reporte de explosión con múltiples víctimas" },
      {
        t: 5,
        tipo: "critico",
        canal: "ARRIBO FISICO",
        texto: "Primeros lesionados llegan por medios propios",
      },
      { t: 18, tipo: "critico", canal: "URGENCIAS", texto: "Posible contaminación química detectada" },
      { t: 35, tipo: "nuevo", canal: "MEDIOS", texto: "Medios de comunicación y familias solicitando información" },
      { t: 90, tipo: "nuevo", canal: "CRUM CIERRE", texto: "Fin de fase aguda" }
    );
  } else if (scenarioId === "S3" || scenarioId === "estampida") {
    events.push(
      { t: 0, tipo: "radio", canal: "LLAMADA ANONIMA", texto: "Rumores de explosión en estadio" },
      {
        t: 10,
        tipo: "critico",
        canal: "ARRIBO FISICO",
        texto: "10 lesionados llegan por medios propios",
      },
      { t: 12, tipo: "critico", canal: "CRUM OFICIAL", texto: "SMV confirmado: 120+ víctimas" },
      {
        t: 20,
        tipo: "critico",
        canal: "MEDICINA INTERNA",
        texto: "Paciente con quemaduras sin causa clara",
      },
      { t: 25, tipo: "nuevo", canal: "BOMBEROS", texto: "Confirmado: no hay explosivo, fue estampida" },
      { t: 60, tipo: "nuevo", canal: "CRUM CIERRE", texto: "Inicio de desescalamiento" }
    );
  }

  return events.filter(e => e.t <= duration);
}

export default {
  patientFixtures,
  hospitalStateFixture,
  scenarioFixtures,
  operadorFixtures,
  trazabilidadFixtures,
  auditoriaFixtures,
  exportDataFixture,
  generateMassPatients,
  generateSimulatorEvents,
};
