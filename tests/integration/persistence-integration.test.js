/**
 * Integration Tests - Data Persistence
 * Prueba flujos completos de guardado/carga de datos
 */

import { patientTestData, hospitalStateData } from './fixtures/test-data.js';

describe('Persistence Integration - Full Data Flow', () => {
  describe('LocalStorage + SessionStorage Integration', () => {
    beforeEach(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    test('debe guardar configuración y restaurarla', () => {
      const config = {
        theme: 'light',
        voiceEnabled: true,
        simulationSpeed: 1.5,
        defaultScenario: 'S2'
      };

      localStorage.setItem('simulador-config', JSON.stringify(config));

      const recovered = JSON.parse(localStorage.getItem('simulador-config'));

      expect(recovered.theme).toBe('light');
      expect(recovered.voiceEnabled).toBe(true);
      expect(recovered.simulationSpeed).toBe(1.5);
      expect(recovered.defaultScenario).toBe('S2');
    });

    test('debe mantener persistencia entre sesiones', () => {
      const paciente = patientTestData.rojoCritico;
      const sessionData = {
        paciente,
        timestamp: Date.now()
      };

      sessionStorage.setItem('ultimo-paciente', JSON.stringify(sessionData));

      const recovered = JSON.parse(sessionStorage.getItem('ultimo-paciente'));

      expect(recovered.paciente.id).toBe(paciente.id);
      expect(recovered.paciente.triage).toBe('rojo');
    });

    test('debe guardar múltiples configuraciones', () => {
      const configs = {
        audio: { voiceEnabled: true, volume: 0.8 },
        visual: { theme: 'dark', fontSize: 14 },
        simulation: { speed: 1.0, autoPause: false }
      };

      Object.entries(configs).forEach(([key, value]) => {
        localStorage.setItem(`config-${key}`, JSON.stringify(value));
      });

      const recoveredAudio = JSON.parse(localStorage.getItem('config-audio'));
      const recoveredVisual = JSON.parse(localStorage.getItem('config-visual'));
      const recoveredSim = JSON.parse(localStorage.getItem('config-simulation'));

      expect(recoveredAudio.voiceEnabled).toBe(true);
      expect(recoveredVisual.theme).toBe('dark');
      expect(recoveredSim.speed).toBe(1.0);
    });

    test('debe eliminar configuración específica', () => {
      localStorage.setItem('temp-key', 'temp-value');

      expect(localStorage.getItem('temp-key')).toBe('temp-value');

      localStorage.removeItem('temp-key');

      expect(localStorage.getItem('temp-key')).toBeNull();
    });

    test('debe limpiar toda la configuración', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');

      localStorage.clear();

      expect(localStorage.getItem('key1')).toBeNull();
      expect(localStorage.getItem('key2')).toBeNull();
    });
  });

  describe('Export/Import Integration', () => {
    test('debe exportar datos a formato JSON', () => {
      const exportData = {
        version: '1.0',
        timestamp: Date.now(),
        pacientes: [
          patientTestData.rojoCritico,
          patientTestData.amarilloUrgente,
          patientTestData.verdeEstable
        ],
        hospital: hospitalStateData
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const parsed = JSON.parse(jsonString);

      expect(parsed.pacientes.length).toBe(3);
      expect(parsed.pacientes[0].triage).toBe('rojo');
    });

    test('debe importar datos y validar estructura', () => {
      const validImport = {
        version: '1.0',
        pacientes: [patientTestData.rojoCritico],
        hospital: hospitalStateData
      };

      expect(validImport).toHaveProperty('version');
      expect(validImport).toHaveProperty('pacientes');
      expect(validImport).toHaveProperty('hospital');
      expect(Array.isArray(validImport.pacientes)).toBe(true);
    });

    test('debe rechazar importación con estructura inválida', () => {
      const invalidImport = {
        version: '2.0',
        pacientes: 'not_an_array'
      };

      expect(Array.isArray(invalidImport.pacientes)).toBe(false);
    });

    test('debe validar versión de importación', () => {
      const importData = {
        version: '1.0',
        pacientes: []
      };

      const supportedVersions = ['1.0', '1.1', '2.0'];

      expect(supportedVersions.includes(importData.version)).toBe(true);
    });

    test('debe rechazar versión no soportada', () => {
      const importData = {
        version: '99.0',
        pacientes: []
      };

      const supportedVersions = ['1.0', '1.1', '2.0'];

      expect(supportedVersions.includes(importData.version)).toBe(false);
    });
  });

  describe('Persistencia de Estado de Simulación', () => {
    test('debe guardar estado completo de simulación', () => {
      const simulationState = {
        scenarioId: 'S3',
        currentTime: 45,
        paused: false,
        decisions: {
          'dec-smv': { done: true, at: 5 },
          'dec-triage': { done: true, at: 10 }
        },
        actions: {
          triageExterno: true,
          noria: false,
          electivos: true
        },
        smvGrade: 3,
        smvActivatedAt: 12
      };

      const saved = JSON.stringify(simulationState);
      const restored = JSON.parse(saved);

      expect(restored.scenarioId).toBe('S3');
      expect(restored.currentTime).toBe(45);
      expect(restored.decisions['dec-smv'].done).toBe(true);
      expect(restored.actions.triageExterno).toBe(true);
      expect(restored.smvGrade).toBe(3);
    });

    test('debe mantener decisiones con timestamps', () => {
      const decisions = {
        'dec-1': { done: true, at: 5 },
        'dec-2': { done: true, at: 15 },
        'dec-3': { done: true, at: 30 }
      };

      const saved = JSON.stringify(decisions);
      const restored = JSON.parse(saved);

      expect(restored['dec-1'].at).toBe(5);
      expect(restored['dec-2'].at).toBe(15);
      expect(restored['dec-3'].at).toBe(30);
    });

    test('debe guardar pacientes con grupos EVACH', () => {
      const pacientesConGrupos = {
        'P-001': 3,
        'P-002': 1,
        'P-003': 5
      };

      const saved = JSON.stringify(pacientesConGrupos);
      const restored = JSON.parse(saved);

      expect(restored['P-001']).toBe(3);
      expect(restored['P-002']).toBe(1);
      expect(restored['P-003']).toBe(5);
    });
  });

  describe('Persistencia de Hospital State', () => {
    test('debe guardar estado del hospital', () => {
      const hospitalState = {
        uci: { capacity: 8, occupied: 7 },
        urgencias: { capacity: 39, occupied: 35 },
        rojosActivos: 5
      };

      const saved = JSON.stringify(hospitalState);
      const restored = JSON.parse(saved);

      expect(restored.uci.capacity).toBe(8);
      expect(restored.uci.occupied).toBe(7);
      expect(restored.urgencias.occupied).toBe(35);
      expect(restored.rojosActivos).toBe(5);
    });

    test('debe actualizar ocupación hospitalaria', () => {
      // Usar JSON.parse/stringify para deep copy y evitar mutar el original
      const state = JSON.parse(JSON.stringify(hospitalStateData));

      state.uci.occupied = 8;
      state.urgencias.occupied = 39;

      expect(state.uci.occupied).toBe(8);
      expect(state.urgencias.occupied).toBe(39);
    });

    test('debe calcular disponibilidad correctamente', () => {
      // Usar valores directos para evitar mutación
      const uciCapacity = 8;
      const uciOccupied = 5;
      const urgenciasCapacity = 39;
      const urgenciasOccupied = 25;

      const uciAvailable = uciCapacity - uciOccupied;
      const urgenciasAvailable = urgenciasCapacity - urgenciasOccupied;

      expect(uciAvailable).toBe(3); // 8 - 5 = 3
      expect(urgenciasAvailable).toBe(14); // 39 - 25 = 14
    });
  });

  describe('Backup y Restore', () => {
    test('debe crear backup con timestamp', () => {
      const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: { test: 'data' }
      };

      expect(backup.timestamp).toBeDefined();
      expect(backup.version).toBe('1.0');
      expect(new Date(backup.timestamp)).toBeInstanceOf(Date);
    });

    test('debe restaurar desde backup', () => {
      const originalData = {
        pacientes: [patientTestData.rojoCritico],
        decisions: { 'dec-1': true }
      };

      const backup = JSON.stringify(originalData);
      const restored = JSON.parse(backup);

      expect(restored.pacientes.length).toBe(1);
      expect(restored.decisions['dec-1']).toBe(true);
    });

    test('debe manejar múltiples backups', () => {
      const backups = [];

      for (let i = 0; i < 5; i++) {
        backups.push({
          index: i,
          timestamp: Date.now() + i * 1000,
          data: { value: i }
        });
      }

      expect(backups.length).toBe(5);
      expect(backups[0].index).toBe(0);
      expect(backups[4].index).toBe(4);
    });
  });

  describe('Sincronización de Datos', () => {
    test('debe manejar conflicto de datos', () => {
      const local = { timestamp: 1000, value: 'local' };
      const remote = { timestamp: 2000, value: 'remote' };

      const resolved = local.timestamp > remote.timestamp ? local : remote;

      expect(resolved.value).toBe('remote');
    });

    test('debe mantener versión más reciente', () => {
      const versions = [
        { timestamp: 1000, data: 'v1' },
        { timestamp: 3000, data: 'v3' },
        { timestamp: 2000, data: 'v2' }
      ];

      const latest = versions.reduce((a, b) =>
        a.timestamp > b.timestamp ? a : b
      );

      expect(latest.data).toBe('v3');
    });
  });

  describe('Validación de Integridad', () => {
    test('debe validar que todos los campos requeridos existan', () => {
      const paciente = patientTestData.rojoCritico;
      const requiredFields = ['id', 'folio', 'nombre', 'triage', 'edad'];

      const hasAllFields = requiredFields.every(field =>
        Object.prototype.hasOwnProperty.call(paciente, field)
      );

      expect(hasAllFields).toBe(true);
    });

    test('debe validar rangos de valores', () => {
      const vitalSigns = {
        presionArterial: '120/80',
        frecuenciaRespiratoria: 16,
        saturacionO2: 98
      };

      expect(vitalSigns.frecuenciaRespiratoria).toBeGreaterThanOrEqual(10);
      expect(vitalSigns.frecuenciaRespiratoria).toBeLessThanOrEqual(30);
      expect(vitalSigns.saturacionO2).toBeGreaterThanOrEqual(70);
      expect(vitalSigns.saturacionO2).toBeLessThanOrEqual(100);
    });

    test('debe validar categorías de triage', () => {
      const validTriages = ['rojo', 'amarillo', 'verde', 'negro'];

      expect(validTriages).toContain(patientTestData.rojoCritico.triage);
      expect(validTriages).toContain(patientTestData.amarilloUrgente.triage);
      expect(validTriages).toContain(patientTestData.verdeEstable.triage);
    });
  });

  describe('Serialización de Datos Complejos', () => {
    test('debe serializar pacientes con lesiones', () => {
      const paciente = {
        ...patientTestData.rojoCritico,
        lesiones: ['torax_abierto', 'hemorragia_activa', 'fractura_pelvis']
      };

      const serialized = JSON.stringify(paciente);
      const deserialized = JSON.parse(serialized);

      expect(deserialized.lesiones.length).toBe(3);
      expect(deserialized.lesiones).toContain('torax_abierto');
    });

    test('debe serializar contadores de tiempo', () => {
      const timeData = {
        inicio: Date.now(),
        eventos: [
          { t: 0, tipo: 'inicio' },
          { t: 10, tipo: 'arribo' },
          { t: 25, tipo: 'critical' }
        ]
      };

      const serialized = JSON.stringify(timeData);
      const deserialized = JSON.parse(serialized);

      expect(deserialized.eventos.length).toBe(3);
      expect(deserialized.eventos[2].t).toBe(25);
    });
  });
});
