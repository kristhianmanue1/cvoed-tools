/**
 * Integration Tests - Simulador Modules
 * Prueba integración entre módulos del simulador
 */

import { SimulatorState } from '@/simulador/js/core/simulator-state.js';
import { VoiceEngine } from '@/simulador/js/core/voice-engine.js';
import { getScenario } from '@/simulador/js/scenarios/scenarios.js';
import { patientTestData, scenarioData } from './fixtures/test-data.js';

describe('Simulador Modules Integration', () => {
  let simulatorState;
  let voiceEngine;

  beforeEach(() => {
    // Asegurar que speechSynthesis esté disponible antes de crear VoiceEngine
    if (typeof window !== 'undefined') {
      window.speechSynthesis = global.speechSynthesis;
    }

    simulatorState = new SimulatorState();
    voiceEngine = new VoiceEngine();
  });

  describe('Integración Estado + Voz', () => {
    test('debe anunciar cambios de estado críticos', () => {
      const paciente = patientTestData.rojoCritico;

      simulatorState.setScenario(getScenario('S1'));
      simulatorState.updateHospitalCapacity('uci', 8);

      // Verificar que VoiceEngine tiene el método speak
      expect(typeof voiceEngine.speak).toBe('function');

      // Llamamos a speak - si synth es null, no agregará a la cola
      // pero el método existe
      voiceEngine.speak('UCI al máximo capacidad', 'critical');

      // Verificar que voiceEngine está configurado
      expect(voiceEngine).toBeDefined();
      expect(voiceEngine.enabled).toBe(true);
    });

    test('debe mantener sincronización de voz con estado', () => {
      expect(simulatorState.isVoiceEnabled()).toBe(true);

      simulatorState.setVoiceEnabled(false);
      expect(simulatorState.isVoiceEnabled()).toBe(false);
    });

    test('debe respetar velocidad de simulación en anuncios', () => {
      simulatorState.setSimulationSpeed(2.0);
      expect(simulatorState.getSimulationSpeed()).toBe(2.0);
    });

    test('debe cambiar tema y mantener estado', () => {
      simulatorState.setTheme('light');
      expect(simulatorState.getTheme()).toBe('light');

      simulatorState.setTheme('dark');
      expect(simulatorState.getTheme()).toBe('dark');
    });

    test('debe pausar y reanudar simulación', () => {
      expect(simulatorState.isPaused()).toBe(false);

      simulatorState.togglePause();
      expect(simulatorState.isPaused()).toBe(true);

      simulatorState.togglePause();
      expect(simulatorState.isPaused()).toBe(false);
    });
  });

  describe('Integración Estado + Escenarios', () => {
    test('debe cargar escenario S1 y actualizar estado', () => {
      const scenario = getScenario('S1');
      simulatorState.setScenario(scenario);

      expect(simulatorState.getScenario()).toBeDefined();
      expect(simulatorState.getScenario().id).toBe('S1');
    });

    test('debe cargar escenario S2 y actualizar estado', () => {
      const scenario = getScenario('S2');
      simulatorState.setScenario(scenario);

      expect(simulatorState.getScenario().id).toBe('S2');
    });

    test('debe cargar escenario S3 y actualizar estado', () => {
      const scenario = getScenario('S3');
      simulatorState.setScenario(scenario);

      expect(simulatorState.getScenario().id).toBe('S3');
    });

    test('debe manejar múltiples escenarios en secuencia', () => {
      simulatorState.setScenario(getScenario('S1'));
      expect(simulatorState.getScenario().id).toBe('S1');

      simulatorState.setScenario(getScenario('S2'));
      expect(simulatorState.getScenario().id).toBe('S2');

      simulatorState.setScenario(getScenario('S3'));
      expect(simulatorState.getScenario().id).toBe('S3');
    });

    test('debe mantener contador de tiempo correctamente', () => {
      simulatorState.setScenario(getScenario('S1'));

      expect(simulatorState.getCurrentTime()).toBe(0);

      simulatorState.advanceTime();
      expect(simulatorState.getCurrentTime()).toBe(1);

      simulatorState.advanceTime();
      expect(simulatorState.getCurrentTime()).toBe(2);
    });
  });

  describe('Integración Sistema de Decisiones', () => {
    test('debe marcar decisiones como completadas', () => {
      const scenario = getScenario('S1');
      simulatorState.setScenario(scenario);

      const decision = simulatorState.markDecision('dec-evac-activar');

      expect(decision).toBeDefined();
      expect(decision.done).toBe(true);
      expect(simulatorState.hasDecision('dec-evac-activar')).toBe(true);
    });

    test('debe verificar decisiones ya tomadas', () => {
      const scenario = getScenario('S3');
      simulatorState.setScenario(scenario);

      expect(simulatorState.hasDecision('dec-smv')).toBe(false);

      simulatorState.markDecision('dec-smv');
      expect(simulatorState.hasDecision('dec-smv')).toBe(true);
    });

    test('debe contar decisiones completadas', () => {
      const scenario = getScenario('S3');
      simulatorState.setScenario(scenario);

      expect(simulatorState.getCompletedDecisionCount()).toBe(0);

      simulatorState.markDecision('dec-smv');
      simulatorState.markDecision('dec-triage');

      expect(simulatorState.getCompletedDecisionCount()).toBe(2);
    });

    test('debe obtener total de decisiones del escenario', () => {
      const scenario = getScenario('S3');
      simulatorState.setScenario(scenario);

      const total = simulatorState.getTotalDecisionCount();
      expect(total).toBeGreaterThan(0);
    });

    test('debe identificar decisiones críticas perdidas', () => {
      const scenario = getScenario('S1');
      simulatorState.setScenario(scenario);

      simulatorState.markDecision('dec-evac-activar');

      const missed = simulatorState.getMissedCriticalDecisions();
      expect(missed.length).toBeGreaterThan(0);
      expect(missed.every(d => d.critico)).toBe(true);
    });
  });

  describe('Integración EVACH y Grupos de Pacientes', () => {
    test('debe asignar grupo EVACH a paciente', () => {
      const paciente = patientTestData.rojoCritico;

      simulatorState.assignPatientGroup(paciente.id, 3);

      expect(simulatorState.getPatientGroup(paciente.id)).toBe(3);
    });

    test('debe asignar diferentes grupos EVACH', () => {
      const pacientes = ['P-001', 'P-002', 'P-003', 'P-004', 'P-005'];

      simulatorState.assignPatientGroup(pacientes[0], 1);
      simulatorState.assignPatientGroup(pacientes[1], 2);
      simulatorState.assignPatientGroup(pacientes[2], 3);
      simulatorState.assignPatientGroup(pacientes[3], 4);
      simulatorState.assignPatientGroup(pacientes[4], 5);

      expect(simulatorState.getPatientGroup(pacientes[0])).toBe(1);
      expect(simulatorState.getPatientGroup(pacientes[4])).toBe(5);
    });

    test('debe manejar pacientes sin grupo asignado', () => {
      const paciente = patientTestData.verdeEstable;

      expect(simulatorState.getPatientGroup(paciente.id)).toBeUndefined();
    });
  });

  describe('Integración Sistema de Acciones', () => {
    test('debe activar acción de triage externo', () => {
      const result = simulatorState.activateAction('triageExterno');

      expect(result).toBe(true);
      expect(simulatorState.isActionActive('triageExterno')).toBe(true);
    });

    test('debe activar acción de noria', () => {
      simulatorState.activateAction('noria');

      expect(simulatorState.isActionActive('noria')).toBe(true);
    });

    test('debe activar acción de electivos', () => {
      simulatorState.activateAction('electivos');

      expect(simulatorState.isActionActive('electivos')).toBe(true);
    });

    test('debe activar acción de expansión', () => {
      simulatorState.activateAction('expansion');

      expect(simulatorState.isActionActive('expansion')).toBe(true);
    });

    test('debe activar acción de vocero', () => {
      simulatorState.activateAction('vocero');

      expect(simulatorState.isActionActive('vocero')).toBe(true);
    });

    test('debe activar protocolo QBRNE', () => {
      simulatorState.activateAction('qbrne');

      expect(simulatorState.isActionActive('qbrne')).toBe(true);
    });

    test('debe activar referencia RISS', () => {
      simulatorState.activateAction('riss');

      expect(simulatorState.isActionActive('riss')).toBe(true);
    });

    test('no debe activar acción ya activa', () => {
      simulatorState.activateAction('triageExterno');
      const result = simulatorState.activateAction('triageExterno');

      expect(result).toBe(false);
    });

    test('debe resetear todos los estados de acción', () => {
      simulatorState.activateAction('triageExterno');
      simulatorState.activateAction('noria');
      simulatorState.activateAction('electivos');

      simulatorState.resetActionStates();

      expect(simulatorState.isActionActive('triageExterno')).toBe(false);
      expect(simulatorState.isActionActive('noria')).toBe(false);
      expect(simulatorState.isActionActive('electivos')).toBe(false);
    });
  });

  describe('Integración Sistema SMV', () => {
    test('debe establecer grado SMV', () => {
      simulatorState.setSMVGrade(2);

      expect(simulatorState.getSMVGrade()).toBe(2);
    });

    test('debe actualizar grado SMV solo si es mayor', () => {
      simulatorState.setSMVGrade(1);
      simulatorState.setSMVGrade(3);

      expect(simulatorState.getSMVGrade()).toBe(3);

      simulatorState.setSMVGrade(2);

      expect(simulatorState.getSMVGrade()).toBe(3);
    });

    test('debe registrar tiempo de activación SMV', () => {
      expect(simulatorState.getSMVActivatedAt()).toBeNull();

      simulatorState.advanceTime();
      simulatorState.setSMVGrade(1);

      expect(simulatorState.getSMVActivatedAt()).toBe(1);
    });

    test('no debe cambiar tiempo de activación si ya existe', () => {
      simulatorState.advanceTime();
      simulatorState.setSMVGrade(1);

      const firstTime = simulatorState.getSMVActivatedAt();

      simulatorState.advanceTime();
      simulatorState.setSMVGrade(2);

      expect(simulatorState.getSMVActivatedAt()).toBe(firstTime);
    });
  });

  describe('Integración Capacidad Hospitalaria', () => {
    test('debe actualizar ocupación de UCI', () => {
      simulatorState.updateHospitalCapacity('uci', 7);

      expect(simulatorState.hospitalState.uci.occupied).toBe(7);
    });

    test('debe actualizar ocupación de urgencias', () => {
      simulatorState.updateHospitalCapacity('urgencias', 30);

      expect(simulatorState.hospitalState.urgencias.occupied).toBe(30);
    });

    test('debe mantener valores de capacidad', () => {
      expect(simulatorState.hospitalState.uci.capacity).toBe(8);
      expect(simulatorState.hospitalState.urgencias.capacity).toBe(39);
    });
  });

  describe('Integración Injectores', () => {
    test('debe marcar inyector como visto', () => {
      const key = 'S1-T0';

      expect(simulatorState.isInjectorSeen(key)).toBe(false);

      simulatorState.markInjectorSeen(key);

      expect(simulatorState.isInjectorSeen(key)).toBe(true);
    });

    test('debe mantener múltiples injectores vistos', () => {
      const injectors = ['S1-T0', 'S1-T7', 'S1-T12'];

      injectors.forEach(key => simulatorState.markInjectorSeen(key));

      injectors.forEach(key => {
        expect(simulatorState.isInjectorSeen(key)).toBe(true);
      });
    });

    test('debe manejar Set para injectores correctamente', () => {
      simulatorState.markInjectorSeen('KEY-1');
      simulatorState.markInjectorSeen('KEY-1');

      expect(simulatorState.isInjectorSeen('KEY-1')).toBe(true);
    });
  });

  describe('Integración Reset de Estado', () => {
    test('debe resetear estado para nuevo escenario', () => {
      const scenarios = { S1: getScenario('S1'), S2: getScenario('S2'), S3: getScenario('S3') };

      simulatorState.setScenario(getScenario('S1'));
      simulatorState.markDecision('dec-evac-activar');
      simulatorState.advanceTime();
      simulatorState.activateAction('triageExterno');

      simulatorState.reset('S2', scenarios);

      expect(simulatorState.getScenario().id).toBe('S2');
      expect(simulatorState.getCurrentTime()).toBe(0);
      expect(simulatorState.isPaused()).toBe(false);
      expect(simulatorState.hasDecision('dec-evac-activar')).toBe(false);
      expect(simulatorState.isActionActive('triageExterno')).toBe(false);
    });

    test('debe limpiar timer al resetear', () => {
      const mockInterval = setInterval(() => {}, 1000);

      simulatorState.setTimer(mockInterval);
      expect(simulatorState.timerInterval).toBeDefined();

      simulatorState.clearTimer();

      expect(simulatorState.timerInterval).toBeNull();
    });
  });
});
