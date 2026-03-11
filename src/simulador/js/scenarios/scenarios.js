/**
 * Scenario Definitions
 * Hospital de Nunca Jamás
 * @module scenarios/scenarios
 */

/**
 * All available emergency scenarios
 * @constant {Object}
 */
export const SCENARIOS = {
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
          { label: "Esperar confirmación", id: "esperar-confirmacion", tipo: "secondary" },
        ],
      },
      {
        t: 10,
        tipo: "critico",
        canal: "🚑 ARRIBO FÍSICO",
        emisor: "Acceso vehicular",
        texto:
          "Llegan 10 lesionados por sus propios medios. Sin notificación previa. Sin triage. Urgencias está recibiendo pacientes sin clasificar.",
        acciones: [
          { label: "Activar Triage Externo", id: "activar-triage", tipo: "primary" },
          { label: "Declarar Código SMV", id: "declarar-smv", tipo: "primary" },
          { label: "Contener en acceso", id: "contener-acceso", tipo: "secondary" },
        ],
      },
      {
        t: 12,
        tipo: "critico",
        canal: "📻 CRUM OFICIAL",
        emisor: "Centro Regulador de Urgencias Médicas",
        texto:
          '"Confirmamos SMV en estadio. Estimado: 120+ víctimas. Primeros 30 llegarán en 8 minutos. Clasificación preliminar: 20 rojos, 40 amarillos, 60 verdes."',
        acciones: [
          { label: "Grado III (máximo)", id: "smv-grado3", tipo: "primary" },
          { label: "Grado II (moderado)", id: "smv-grado2", tipo: "secondary" },
          { label: "Solicitar más información", id: "pedir-mas-info", tipo: "secondary" },
        ],
      },
      {
        t: 18,
        tipo: "radio",
        canal: "📻 RADIO INTERNO",
        emisor: "Jefe de Turno · Urgencias",
        texto: '"Urgencias al 100%. Tenemos 5 pacientes esperando camilla en el acceso. ¿Abrimos área de expansión?"',
        acciones: [
          { label: "Abrir Área de Expansión", id: "abrir-expansion", tipo: "primary" },
          { label: "Referir amarillos a RISS", id: "referir-riss", tipo: "secondary" },
          { label: "Mantener urgencias", id: "mantener-urg", tipo: "secondary" },
        ],
      },
      {
        t: 20,
        tipo: "nuevo",
        canal: "📺 MEDIOS DE COMUNICACIÓN",
        emisor: "Canal de televisión en puerta",
        texto:
          "Cadena nacional solicita declaración oficial. Hay confusión pública sobre qué ocurrió. Familias de heridos también buscan información en el exterior.",
        acciones: [
          { label: "Designar Vocero Oficial", id: "designar-vocero", tipo: "primary" },
          { label: "Ignorar por ahora", id: "ignorar-medios", tipo: "secondary" },
        ],
      },
      {
        t: 20,
        tipo: "critico",
        canal: "📻 RADIO INTERNO",
        emisor: "Medicina Interna",
        texto:
          'Un paciente llegó a urgencias con quemaduras en manos y mareo severo. Dice "no sé qué me pasó". El rumor de explosivo en el estadio persiste sin confirmación.',
        acciones: [
          { label: "Activar Protocolo QBRNE", id: "activar-qbrne", tipo: "danger" },
          { label: "Aislar y observar primero", id: "aislar-paciente", tipo: "primary" },
          { label: "Esperar confirmación CNSNS", id: "esperar-cnsns", tipo: "secondary" },
        ],
      },
      {
        t: 25,
        tipo: "radio",
        canal: "📻 CRUM · ACTUALIZACIÓN",
        emisor: "Centro Regulador de Urgencias Médicas",
        texto:
          '"Confirmado: no hay explosivo. Fue pánico masivo. Sin contaminación QBRNE. Estampida confirmada en escaleras puerta norte. Activen SMV según protocolos."',
        acciones: [
          { label: "Desactivar QBRNE", id: "desactivar-qbrne", tipo: "primary" },
          { label: "Mantener QBRNE activo", id: "mantener-qbrne", tipo: "secondary" },
        ],
      },
      {
        t: 30,
        tipo: "critico",
        canal: "📻 RADIO INTERNO",
        emisor: "UCI · Jefe de servicio",
        texto: '"UCI llena. Tenemos 3 paros recuperados que necesitan cama UCI ahora. No hay lugar. ¿Qué hacemos?"',
        acciones: [
          { label: "Abrir UCI contingencia", id: "uci-contingencia", tipo: "primary" },
          { label: "Referir a hospital RISS", id: "referir-uci-riss", tipo: "primary" },
          { label: "Clasificar como Grupo 5", id: "clasificar-grupo5", tipo: "secondary" },
        ],
      },
      {
        t: 45,
        tipo: "radio",
        canal: "📞 LLAMADA · RISS",
        emisor: "Hospital Regional Norte",
        texto:
          '"Podemos recibir 8 pacientes amarillos estables. Ambulancias disponibles en 15 minutos. ¿Confirmamos transferencia?"',
        acciones: [
          { label: "Confirmar transferencia", id: "confirmar-riss", tipo: "primary" },
          { label: "Esperar 15 minutos más", id: "esperar-riss", tipo: "secondary" },
        ],
      },
      {
        t: 60,
        tipo: "nuevo",
        canal: "📻 CRUM · CIERRE",
        emisor: "Centro Regulador de Urgencias Médicas",
        texto:
          '"Arribo disminuye considerablemente. Estimamos 10-15 heridos adicionales en 30 minutos. Posterior a eso: cese de arribo. Pueden iniciar desescalamiento."',
        acciones: [
          { label: "Iniciar desescalamiento", id: "desescalar", tipo: "primary" },
          { label: "Mantener Grado III 30 min más", id: "mantener-grado3", tipo: "secondary" },
        ],
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
        label: "Activar Grado III (no II) para 120+ víctimas",
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
        id: "dec-noria",
        label: "Noria de ambulancias activa",
        guia: "SMV-H · Paso 5",
        critico: false,
      },
      {
        id: "dec-electivos",
        label: "Cirugías electivas suspendidas",
        guia: "SMV-H · Paso 4",
        critico: false,
      },
      {
        id: "dec-expansion",
        label: "Área de expansión habilitada",
        guia: "SMV-H · Paso 4",
        critico: false,
      },
      {
        id: "dec-vocero",
        label: "Vocero oficial designado antes de T+25",
        guia: "SCI-H · Información Pública",
        critico: true,
      },
      {
        id: "dec-cvoed",
        label: "CVOED notificado (55 5262 5368)",
        guia: "PH-RED · Enlace",
        critico: false,
      },
      {
        id: "dec-qbrne-correct",
        label: "Decisión QBRNE basada en evidencia (no activar sin criterio)",
        guia: "QBRNE · Umbral activación",
        critico: true,
      },
      {
        id: "dec-riss",
        label: "Referencia oportuna a RISS para amarillos",
        guia: "SMV-H · Paso 6",
        critico: false,
      },
      {
        id: "dec-discap",
        label: "Pacientes con discapacidad no registrados identificados",
        guia: "INGRID-H",
        critico: true,
      },
      {
        id: "dec-desescalar",
        label: "Desescalamiento ordenado e iniciado",
        guia: "SMV-H · Recuperación",
        critico: false,
      },
    ],
    pacientes: [
      {
        id: "P001",
        ubicacion: "UCI-1",
        desc: "VM parámetros bajos · Vasopresores 0.08 μg/kg/min",
        grupoEvach: 3,
        discapacidad: null,
        registrado: true,
        triage: "rojo",
      },
      {
        id: "P002",
        ubicacion: "UCI-2",
        desc: "VM parámetros altos · Vasopresores >0.6 μg/kg/min",
        grupoEvach: 5,
        discapacidad: null,
        registrado: true,
        triage: "negro",
      },
      {
        id: "P003",
        ubicacion: "UCI-3",
        desc: "VM parámetros bajos · Sin vasopresores · Silla de ruedas",
        grupoEvach: null,
        discapacidad: "motriz",
        registrado: false,
        triage: "rojo",
      },
      {
        id: "P005",
        ubicacion: "UCI-5",
        desc: "Paro recuperado · Inestable · ECMO activo",
        grupoEvach: 5,
        discapacidad: null,
        registrado: true,
        triage: "negro",
      },
      {
        id: "P009",
        ubicacion: "Med-Int A/12",
        desc: "Cardiopatía crónica · Prealta · Discapacidad auditiva",
        grupoEvach: null,
        discapacidad: "auditiva",
        registrado: false,
        triage: "verde",
      },
      {
        id: "P014",
        ubicacion: "Quirófano 1",
        desc: "EN CIRUGÍA: Tórax abierto en curso · Protocolo especial",
        grupoEvach: null,
        discapacidad: null,
        registrado: true,
        triage: "rojo",
      },
      {
        id: "P020",
        ubicacion: "Obs A/07",
        desc: "Adulto mayor · Demencia · No autónomo · Discapacidad intelectual",
        grupoEvach: null,
        discapacidad: "intelectual",
        registrado: false,
        triage: "amarillo",
      },
      {
        id: "P021",
        ubicacion: "Obs A/14",
        desc: "Crisis hipertensiva estabilizada · Discapacidad visual",
        grupoEvach: null,
        discapacidad: "visual",
        registrado: false,
        triage: "amarillo",
      },
      {
        id: "P022",
        ubicacion: "Choque/01",
        desc: "Shock séptico · VM · Vasopresores altos",
        grupoEvach: 4,
        discapacidad: null,
        registrado: true,
        triage: "rojo",
      },
      {
        id: "P010",
        ubicacion: "Med-Int B/23",
        desc: "DM2 descompensada · Obeso · No autónomo · Silla de ruedas",
        grupoEvach: 2,
        discapacidad: "motriz",
        registrado: true,
        triage: "amarillo",
      },
      {
        id: "P017",
        ubicacion: "Ped-1/04",
        desc: "Niño 6 años · Asma moderada · O2 suplementario",
        grupoEvach: 2,
        discapacidad: null,
        registrado: true,
        triage: "amarillo",
      },
      {
        id: "P018",
        ubicacion: "Ped-1/09",
        desc: "Neonato en incubadora · Sin soporte ventilatorio",
        grupoEvach: null,
        discapacidad: null,
        registrado: true,
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
        texto:
          '"ALERTA SÍSMICA — Movimiento de intensidad moderada-alta detectado. Sismo preliminar magnitud 7.4. Epicentro regional."',
        acciones: [
          { label: "Activar Protocolo EVAC-H", id: "activar-evac", tipo: "primary" },
          { label: "Esperar evaluación estructural", id: "esperar-estruc", tipo: "secondary" },
        ],
      },
      {
        t: 3,
        tipo: "radio",
        canal: "📻 RADIO INTERNO",
        emisor: "Jefe de Piso · Torre Hospitalización",
        texto:
          '"Torre de hospitalización: grieta visible en columna A-4 en piso 2. Hay escombros menores. Personal solicita instrucciones inmediatas."',
        acciones: [
          { label: "Iniciar triage de evacuación", id: "iniciar-triage-evac", tipo: "primary" },
          { label: "Esperar valoración Protección Civil", id: "esperar-pc", tipo: "secondary" },
        ],
      },
      {
        t: 7,
        tipo: "critico",
        canal: "📞 LLAMADA DIRECTA",
        emisor: "Quirófano 1",
        texto:
          '"Tenemos un paciente con tórax abierto en quirófano. Cirugía en minuto 45 de procedimiento. ¿Evacuamos o continuamos? La sala está estable estructuralmente."',
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
        texto:
          '"Estimamos réplica de magnitud 5.8 en los próximos 20-30 minutos. Recomendamos completar evacuación antes de que llegue la réplica."',
        acciones: [
          { label: "Escalar a evacuación TOTAL", id: "evac-total", tipo: "primary" },
          { label: "Mantener evacuación PARCIAL", id: "evac-parcial", tipo: "secondary" },
        ],
      },
      {
        t: 20,
        tipo: "radio",
        canal: "📻 RADIO EXTERNO",
        emisor: "CVOED",
        texto:
          '"Hospital de Nunca Jamás: necesitamos reporte de situación en 5 minutos para coordinar apoyo de la RISS. ¿Cuántos pacientes requieren traslado?"',
        acciones: [
          { label: "Función Enlace reporta al CVOED", id: "reportar-cvoed", tipo: "primary" },
          { label: "Pedir extensión de tiempo", id: "pedir-extension", tipo: "secondary" },
        ],
      },
      {
        t: 30,
        tipo: "critico",
        canal: "📻 RADIO INTERNO",
        emisor: "Mantenimiento",
        texto:
          '"Falla en planta de emergencia. Estimamos 20 minutos de autonomía de baterías para ventiladores en UCI. Después, falla total."',
        acciones: [
          { label: "Priorizar traslado Grupo 4 y 5 AHORA", id: "priorizar-grupos45", tipo: "primary" },
          { label: "Buscar generador alternativo", id: "buscar-generador", tipo: "secondary" },
        ],
      },
    ],
    decisiones: [
      {
        id: "dec-evac-activar",
        label: "Activar EVAC-H al confirmar daño estructural",
        guia: "EVAC-H · Paso 1",
        critico: true,
      },
      {
        id: "dec-triage-grupos",
        label: "Clasificar pacientes en 5 grupos EVAC-H",
        guia: "EVAC-H · p.12-14",
        critico: true,
      },
      {
        id: "dec-no-mover-cx",
        label: "NO evacuar paciente con tórax abierto (control daños)",
        guia: "EVAC-H · Grupo especial",
        critico: true,
      },
      {
        id: "dec-noria-evac",
        label: "Noria de ambulancias activa para traslados",
        guia: "EVAC-H + SMV-H",
        critico: false,
      },
      {
        id: "dec-discap-evac",
        label: "Identificar y evacuar pacientes con discapacidad no registrados",
        guia: "INGRID-H + EVAC-H",
        critico: true,
      },
      {
        id: "dec-cvoed-evac",
        label: "Reporte a CVOED antes de T+25",
        guia: "PH-RED · Enlace",
        critico: false,
      },
      {
        id: "dec-horizontalvertical",
        label: "Evacuación horizontal antes que vertical",
        guia: "EVAC-H · Procedimiento",
        critico: false,
      },
      {
        id: "dec-grupo5",
        label: "Decisión documentada sobre Grupo 5 (diferir evacuación)",
        guia: "EVAC-H · Grupo 5",
        critico: true,
      },
    ],
    pacientes: [
      {
        id: "P001",
        ubicacion: "UCI-1",
        desc: "VM parámetros bajos · Vasopresores 0.08 μg/kg/min",
        grupoEvach: null,
        discapacidad: null,
        registrado: true,
        triage: "rojo",
      },
      {
        id: "P002",
        ubicacion: "UCI-2",
        desc: "VM parámetros altos · Vasopresores >0.6+",
        grupoEvach: null,
        discapacidad: null,
        registrado: true,
        triage: "negro",
      },
      {
        id: "P003",
        ubicacion: "UCI-3",
        desc: "VM bajos · Sin vasopresores · Silla de ruedas · NO REGISTRADO",
        grupoEvach: null,
        discapacidad: "motriz",
        registrado: false,
        triage: "rojo",
      },
      {
        id: "P005",
        ubicacion: "UCI-5",
        desc: "Paro recuperado · ECMO · No transportable",
        grupoEvach: null,
        discapacidad: null,
        registrado: true,
        triage: "negro",
      },
      {
        id: "P014",
        ubicacion: "Quirófano 1",
        desc: "CIRUGÍA EN CURSO: tórax abierto · min 45",
        grupoEvach: null,
        discapacidad: null,
        registrado: true,
        triage: "rojo",
      },
      {
        id: "P009",
        ubicacion: "Med-Int A/12",
        desc: "Cardiopatía crónica · Discapacidad auditiva · NO REGISTRADO",
        grupoEvach: null,
        discapacidad: "auditiva",
        registrado: false,
        triage: "verde",
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
        emisor: "Centro Regulador de Urgencias Médicas",
        texto:
          '"Explosión en Mercado Central a 500 metros del hospital. 60 víctimas estimadas, 20 críticos confirmados. Primeros heridos llegarán en 15 minutos."',
        acciones: [
          { label: "Declarar Código SMV", id: "smv-s2", tipo: "primary" },
          { label: "Activar SCI-H", id: "sci-s2", tipo: "primary" },
          { label: "Esperar evaluación", id: "esperar-s2", tipo: "secondary" },
        ],
      },
      {
        t: 5,
        tipo: "critico",
        canal: "📻 RADIO INTERNO",
        emisor: "Seguridad · Urgencias",
        texto:
          '"Urgencias reporta fisura en muro sur tras la explosión. Protección Civil está en camino pero pide cierre temporal del área por riesgo estructural."',
        acciones: [
          { label: "Cerrar urgencias y redirigir flujo", id: "cerrar-urg", tipo: "primary" },
          { label: "Mantener urgencias abierta", id: "mantener-urg-s2", tipo: "secondary" },
        ],
      },
      {
        t: 8,
        tipo: "nuevo",
        canal: "🚑 ARRIBO ESPONTÁNEO",
        emisor: "Acceso vehicular",
        texto:
          "Llegan 5 pacientes por sus propios medios. Ninguno descontaminado. Sin triage previo. Algunos tienen quemaduras por la explosión.",
        acciones: [
          { label: "Activar triage externo inmediato", id: "triage-s2", tipo: "primary" },
          { label: "Activar protocolo QBRNE parcial", id: "qbrne-s2", tipo: "secondary" },
        ],
      },
      {
        t: 18,
        tipo: "radio",
        canal: "📻 CRUM · ALERTA",
        emisor: "Centro Regulador de Urgencias Médicas",
        texto:
          '"Posible contaminación por materiales de limpieza (solventes, cloro). No definido. Hay un área afectada cerca del origen de la explosión."',
        acciones: [
          { label: "Activar protocolo QBRNE completo", id: "qbrne-completo-s2", tipo: "danger" },
          { label: "Activar protocolo parcial (zona tibia)", id: "qbrne-parcial-s2", tipo: "primary" },
          { label: "Esperar confirmación antes de activar", id: "esperar-qbrne-s2", tipo: "secondary" },
        ],
      },
      {
        t: 35,
        tipo: "nuevo",
        canal: "📺 MEDIOS + FAMILIAS",
        emisor: "Puerta principal",
        texto:
          "Medios de comunicación y familias de heridos se concentran en la puerta principal. No hay vocero designado aún.",
        acciones: [
          { label: "Designar vocero oficial SCI-H", id: "vocero-s2", tipo: "primary" },
          { label: "Cerrar acceso y no hacer declaraciones", id: "cerrar-acceso-s2", tipo: "secondary" },
        ],
      },
    ],
    decisiones: [
      {
        id: "dec-smv-s2",
        label: "Código SMV declarado al recibir alerta CRUM",
        guia: "SMV-H · Paso 1",
        critico: true,
      },
      {
        id: "dec-mando-unico",
        label: "Mando unificado EVAC+SMV (no dos comandos separados)",
        guia: "SCI-H · Mando único",
        critico: true,
      },
      {
        id: "dec-electivos-s2",
        label: "Cirugías electivas suspendidas",
        guia: "SMV-H · Paso 4",
        critico: false,
      },
      {
        id: "dec-triage-ext-s2",
        label: "Triage externo activado si urgencias cerrada",
        guia: "SMV-H · Paso 5",
        critico: true,
      },
      {
        id: "dec-vocero-s2",
        label: "Vocero único designado para medios y familias",
        guia: "SCI-H · Info Pública",
        critico: true,
      },
      {
        id: "dec-riss-s2",
        label: "Referencia oportuna de amarillos a RISS",
        guia: "SMV-H · Paso 6",
        critico: false,
      },
    ],
    pacientes: [
      {
        id: "P001",
        ubicacion: "UCI-1",
        desc: "VM parámetros bajos · Vasopresores leves",
        grupoEvach: 3,
        discapacidad: null,
        registrado: true,
        triage: "rojo",
      },
      {
        id: "P014",
        ubicacion: "Quirófano 1",
        desc: "CIRUGÍA ELECTIVA · Programada · Evaluar suspensión",
        grupoEvach: null,
        discapacidad: null,
        registrado: true,
        triage: "amarillo",
      },
      {
        id: "P022",
        ubicacion: "Choque/01",
        desc: "Shock séptico · VM · Vasopresores altos",
        grupoEvach: 4,
        discapacidad: null,
        registrado: true,
        triage: "rojo",
      },
    ],
  },
};

/**
 * Gets a scenario by ID
 * @param {string} scenarioId - The scenario ID (e.g., 'S1', 'S2', 'S3')
 * @returns {Object|null} The scenario object or null if not found
 */
export function getScenario(scenarioId) {
  return SCENARIOS[scenarioId] || null;
}

/**
 * Gets all available scenarios
 * @returns {Array<Object>} Array of all scenario objects
 */
export function getAllScenarios() {
  return Object.values(SCENARIOS);
}

/**
 * Gets scenario IDs
 * @returns {Array<string>} Array of scenario IDs
 */
export function getScenarioIds() {
  return Object.keys(SCENARIOS);
}

/**
 * Gets the default scenario ID
 * @returns {string} The default scenario ID
 */
export function getDefaultScenarioId() {
  return "S3";
}

export default SCENARIOS;
