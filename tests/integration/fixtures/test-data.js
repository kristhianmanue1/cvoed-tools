/**
 * Test Data Fixtures for Integration Tests
 * Datos adicionales complementarios a patient-data.js
 */

export const patientTestData = {
  rojoCritico: {
    id: 'TEST-001',
    folio: 'P-TEST-001',
    nombre: 'Paciente Prueba Rojo',
    triage: 'rojo',
    edad: 45,
    presionArterial: '80/40',
    frecuenciaRespiratoria: 28,
    saturacionO2: 88,
    nivelConciencia: 'respuesta_verbal',
    lesiones: ['torax_abierto'],
    requiereUCI: true,
    timestamp: Date.now()
  },

  amarilloUrgente: {
    id: 'TEST-002',
    folio: 'P-TEST-002',
    nombre: 'Paciente Prueba Amarillo',
    triage: 'amarillo',
    edad: 32,
    presionArterial: '100/70',
    frecuenciaRespiratoria: 22,
    saturacionO2: 94,
    nivelConciencia: 'orientado',
    lesiones: ['fractura_extremidad'],
    requiereUCI: false
  },

  verdeEstable: {
    id: 'TEST-003',
    folio: 'P-TEST-003',
    nombre: 'Paciente Prueba Verde',
    triage: 'verde',
    edad: 25,
    presionArterial: '120/80',
    frecuenciaRespiratoria: 16,
    saturacionO2: 98,
    nivelConciencia: 'orientado',
    lesiones: ['contusion'],
    requiereUCI: false
  }
};

export const hospitalStateData = {
  uci: { capacity: 8, occupied: 5 },
  urgencias: { capacity: 39, occupied: 25 },
  quirofano: { capacity: 6, occupied: 3 },
  totalCamas: 220
};

export const scenarioData = {
  S1: { id: 'S1', name: 'Sismo 7.4', victims: 4 },
  S2: { id: 'S2', name: 'Explosión', victims: 60 },
  S3: { id: 'S3', name: 'Cuartos de Final', victims: 120 }
};

export default { patientTestData, hospitalStateData, scenarioData };
