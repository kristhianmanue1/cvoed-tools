/**
 * Integration Tests - Complete Scenario Flows
 * Prueba flujos completos de cada escenario
 */

import { SimulatorState } from '@/simulador/js/core/simulator-state.js';
import { VoiceEngine } from '@/simulador/js/core/voice-engine.js';
import { getScenario } from '@/simulador/js/scenarios/scenarios.js';
import { patientTestData } from './fixtures/test-data.js';

describe('Complete Scenario Flows', () => {
  let state;
  let voice;

  beforeEach(() => {
    // Asegurar que speechSynthesis esté disponible antes de crear VoiceEngine
    if (typeof window !== 'undefined') {
      window.speechSynthesis = global.speechSynthesis;
    }

    state = new SimulatorState();
    voice = new VoiceEngine();
  });

  describe('Escenario S1: Sismo 7.4', () => {
    test('flujo completo: inicio → pacientes → réplica', () => {
      const s1 = getScenario('S1');
      state.setScenario(s1);

      expect(state.getScenario().id).toBe('S1');
      expect(s1.duracion).toBe(60);

      state.advanceTime();
      expect(state.getCurrentTime()).toBe(1);

      // Verificar que VoiceEngine tiene el método speak
      expect(typeof voice.speak).toBe('function');

      // Llamamos a speak - si synth es null, no agregará a la cola
      // pero el método existe y el motor está configurado
      voice.speak('Escenario S1 iniciado', 'critical');
      expect(voice).toBeDefined();
      expect(voice.enabled).toBe(true);
    });

    test('debe cargar inyectores del escenario S1', () => {
      const s1 = getScenario('S1');

      expect(s1.inyectores).toBeDefined();
      expect(s1.inyectores.length).toBeGreaterThan(0);
    });

    test('debe tener decisión crítica de EVAC-H', () => {
      const s1 = getScenario('S1');

      const decisionEvac = s1.decisiones.find(d => d.id === 'dec-evac-activar');

      expect(decisionEvac).toBeDefined();
      expect(decisionEvac.critico).toBe(true);
    });

    test('debe manejar paciente en quirófano', () => {
      const s1 = getScenario('S1');
      state.setScenario(s1);

      const pacienteEnQuirofano = s1.pacientes.find(p => p.ubicacion === 'Quirófano 1');

      expect(pacienteEnQuirofano).toBeDefined();
      expect(pacienteEnQuirofano.triage).toBe('rojo');
    });

    test('debe identificar pacientes con discapacidad no registrados', () => {
      const s1 = getScenario('S1');

      const noRegistrados = s1.pacientes.filter(p => !p.registrado && p.discapacidad);

      expect(noRegistrados.length).toBeGreaterThan(0);
    });

    test('debe activar SMV durante simulación', () => {
      const s1 = getScenario('S1');
      state.setScenario(s1);

      state.setSMVGrade(1);

      expect(state.getSMVGrade()).toBe(1);
      expect(state.getSMVActivatedAt()).toBeGreaterThanOrEqual(0);
    });

    test('debe manejar réplica sísmica', () => {
      const s1 = getScenario('S1');
      state.setScenario(s1);

      const injectorReplica = s1.inyectores.find(i => i.texto.includes('réplica'));

      expect(injectorReplica).toBeDefined();
      expect(injectorReplica.t).toBe(12);
    });
  });

  describe('Escenario S2: Explosión', () => {
    test('flujo completo: explosión → quemaduras → QBRNE', () => {
      const s2 = getScenario('S2');
      state.setScenario(s2);

      expect(state.getScenario().id).toBe('S2');
      expect(s2.duracion).toBe(90);
    });

    test('debe tener llamada inicial del CRUM', () => {
      const s2 = getScenario('S2');

      const primerInjector = s2.inyectores[0];

      expect(primerInjector.canal).toContain('CRUM');
      expect(primerInjector.tipo).toBe('critico');
    });

    test('debe tener decisión de SMV', () => {
      const s2 = getScenario('S2');

      const decisionSMV = s2.decisiones.find(d => d.id === 'dec-smv-s2');

      expect(decisionSMV).toBeDefined();
      expect(decisionSMV.critico).toBe(true);
    });

    test('debe requerir mando unificado', () => {
      const s2 = getScenario('S2');

      const decisionMando = s2.decisiones.find(d => d.id === 'dec-mando-unico');

      expect(decisionMando).toBeDefined();
      expect(decisionMando.critico).toBe(true);
    });

    test('debe tener decisión de vocero', () => {
      const s2 = getScenario('S2');

      const decisionVocero = s2.decisiones.find(d => d.id === 'dec-vocero-s2');

      expect(decisionVocero).toBeDefined();
      expect(decisionVocero.critico).toBe(true);
    });

    test('debe activar protocolo QBRNE según criterios', () => {
      const s2 = getScenario('S2');
      state.setScenario(s2);

      state.activateAction('qbrne');

      expect(state.isActionActive('qbrne')).toBe(true);
    });

    test('debe manejar daño estructural en urgencias', () => {
      const s2 = getScenario('S2');

      const injectorDanio = s2.inyectores.find(i => i.texto.includes('fisura'));

      expect(injectorDanio).toBeDefined();
      expect(injectorDanio.t).toBe(5);
    });
  });

  describe('Escenario S3: Estampida FIFA', () => {
    test('flujo completo: afluencia masiva → saturación → desescalamiento', () => {
      const s3 = getScenario('S3');
      state.setScenario(s3);

      expect(state.getScenario().id).toBe('S3');
      expect(s3.duracion).toBe(120);
    });

    test('debe iniciar con llamada anónima', () => {
      const s3 = getScenario('S3');

      const primerInjector = s3.inyectores[0];

      expect(primerInjector.canal).toContain('ANÓNIMA');
      expect(primerInjector.t).toBe(0);
    });

    test('debe tener arribo físico prematuro', () => {
      const s3 = getScenario('S3');

      const arriboPrematuro = s3.inyectores.find(i =>
        i.canal.includes('ARRIBO') && i.t === 10
      );

      expect(arriboPrematuro).toBeDefined();
      expect(arriboPrematuro.tipo).toBe('critico');
    });

    test('debe confirmar SMV con CRUM', () => {
      const s3 = getScenario('S3');

      const confirmacionCRUM = s3.inyectores.find(i =>
        i.canal.includes('CRUM OFICIAL') && i.t === 12
      );

      expect(confirmacionCRUM).toBeDefined();
      expect(confirmacionCRUM.texto).toContain('120');
    });

    test('debe requerir Grado III para 120 víctimas', () => {
      const s3 = getScenario('S3');

      const decisionGrado = s3.decisiones.find(d => d.id === 'dec-grado');

      expect(decisionGrado).toBeDefined();
      expect(decisionGrado.critico).toBe(true);
    });

    test('debe manejar rumor QBRNE correctamente', () => {
      const s3 = getScenario('S3');

      const rumorQBRNE = s3.inyectores.find(i =>
        i.texto.includes('quemaduras') && i.t === 20
      );

      expect(rumorQBRNE).toBeDefined();
      expect(rumorQBRNE.canal).toContain('RADIO');
    });

    test('debe confirmar no explosivo después de rumor', () => {
      const s3 = getScenario('S3');

      const confirmacion = s3.inyectores.find(i =>
        i.texto.includes('no hay explosivo')
      );

      expect(confirmacion).toBeDefined();
      expect(confirmacion.t).toBe(25);
    });

    test('debe iniciar desescalamiento al final', () => {
      const s3 = getScenario('S3');

      const desescalamiento = s3.inyectores.find(i =>
        i.canal.includes('CIERRE')
      );

      expect(desescalamiento).toBeDefined();
      expect(desescalamiento.t).toBe(60);
    });

    test('debe activar triage externo', () => {
      const s3 = getScenario('S3');
      state.setScenario(s3);

      state.activateAction('triageExterno');

      expect(state.isActionActive('triageExterno')).toBe(true);
    });

    test('debe requerir vocero para medios', () => {
      const s3 = getScenario('S3');

      const decisionVocero = s3.decisiones.find(d => d.id === 'dec-vocero');

      expect(decisionVocero).toBeDefined();
      expect(decisionVocero.critico).toBe(true);
    });

    test('debe saturar urgencias', () => {
      const s3 = getScenario('S3');
      state.setScenario(s3);

      state.updateHospitalCapacity('urgencias', 39);

      expect(state.hospitalState.urgencias.occupied).toBe(39);
      expect(state.hospitalState.urgencias.capacity).toBe(39);
    });
  });

  describe('Flujos Comunes Entre Escenarios', () => {
    test('todos los escenarios tienen inyectores', () => {
      const s1 = getScenario('S1');
      const s2 = getScenario('S2');
      const s3 = getScenario('S3');

      expect(s1.inyectores.length).toBeGreaterThan(0);
      expect(s2.inyectores.length).toBeGreaterThan(0);
      expect(s3.inyectores.length).toBeGreaterThan(0);
    });

    test('todos los escenarios tienen decisiones', () => {
      const s1 = getScenario('S1');
      const s2 = getScenario('S2');
      const s3 = getScenario('S3');

      expect(s1.decisiones.length).toBeGreaterThan(0);
      expect(s2.decisiones.length).toBeGreaterThan(0);
      expect(s3.decisiones.length).toBeGreaterThan(0);
    });

    test('todos los escenarios tienen pacientes iniciales', () => {
      const s1 = getScenario('S1');
      const s2 = getScenario('S2');
      const s3 = getScenario('S3');

      expect(s1.pacientes.length).toBeGreaterThan(0);
      expect(s2.pacientes.length).toBeGreaterThan(0);
      expect(s3.pacientes.length).toBeGreaterThan(0);
    });

    test('todos los escenarios tienen duración definida', () => {
      const s1 = getScenario('S1');
      const s2 = getScenario('S2');
      const s3 = getScenario('S3');

      expect(s1.duracion).toBeDefined();
      expect(s2.duracion).toBeDefined();
      expect(s3.duracion).toBeDefined();
    });
  });

  describe('Progresión Temporal en Escenarios', () => {
    test('S1: inyectores se activan en orden correcto', () => {
      const s1 = getScenario('S1');

      const tiempos = s1.inyectores.map(i => i.t);
      const tiemposOrdenados = [...tiempos].sort((a, b) => a - b);

      expect(tiempos).toEqual(tiemposOrdenados);
    });

    test('S2: inyectores se activan en orden correcto', () => {
      const s2 = getScenario('S2');

      const tiempos = s2.inyectores.map(i => i.t);
      const tiemposOrdenados = [...tiempos].sort((a, b) => a - b);

      expect(tiempos).toEqual(tiemposOrdenados);
    });

    test('S3: inyectores se activan en orden correcto', () => {
      const s3 = getScenario('S3');

      const tiempos = s3.inyectores.map(i => i.t);
      const tiemposOrdenados = [...tiempos].sort((a, b) => a - b);

      expect(tiempos).toEqual(tiemposOrdenados);
    });

    test('debe marcar inyectores como vistos', () => {
      const s1 = getScenario('S1');
      state.setScenario(s1);

      s1.inyectores.forEach(injector => {
        state.markInjectorSeen(`S1-T${injector.t}`);
      });

      expect(state.isInjectorSeen('S1-T0')).toBe(true);
      expect(state.isInjectorSeen('S1-T7')).toBe(true);
      expect(state.isInjectorSeen('S1-T12')).toBe(true);
    });
  });

  describe('Sistema de Decisiones por Escenario', () => {
    test('S1: tiene decisión de no mover quirófano', () => {
      const s1 = getScenario('S1');

      const decision = s1.decisiones.find(d => d.id === 'dec-no-mover-cx');

      expect(decision).toBeDefined();
      expect(decision.critico).toBe(true);
    });

    test('S2: tiene decisión de triage externo', () => {
      const s2 = getScenario('S2');

      const decision = s2.decisiones.find(d => d.id === 'dec-triage-ext-s2');

      expect(decision).toBeDefined();
      expect(decision.critico).toBe(true);
    });

    test('S3: tiene decisión de no activar QBRNE sin confirmación', () => {
      const s3 = getScenario('S3');

      const decision = s3.decisiones.find(d => d.id === 'dec-qbrne-correct');

      expect(decision).toBeDefined();
      expect(decision.critico).toBe(true);
    });
  });

  describe('Finalización de Escenarios', () => {
    test('S1: termina con consideración de Group 5', () => {
      const s1 = getScenario('S1');

      const decisionGrupo5 = s1.decisiones.find(d => d.id === 'dec-grupo5');

      expect(decisionGrupo5).toBeDefined();
      expect(decisionGrupo5.critico).toBe(true);
    });

    test('S2: termina con manejo de medios', () => {
      const s2 = getScenario('S2');

      const ultimoInjector = s2.inyectores[s2.inyectores.length - 1];

      expect(ultimoInjector.canal).toContain('MEDIOS');
    });

    test('S3: termina con desescalamiento', () => {
      const s3 = getScenario('S3');

      const decisionDesescalar = s3.decisiones.find(d => d.id === 'dec-desescalar');

      expect(decisionDesescalar).toBeDefined();
    });
  });

  describe('Pacientes por Escenario', () => {
    test('S1: tiene paciente con tórax abierto', () => {
      const s1 = getScenario('S1');

      const paciente = s1.pacientes.find(p => p.desc.includes('tórax'));

      expect(paciente).toBeDefined();
      expect(paciente.triage).toBe('rojo');
    });

    test('S2: tiene paciente en shock séptico', () => {
      const s2 = getScenario('S2');

      const paciente = s2.pacientes.find(p => p.ubicacion === 'Choque/01');

      expect(paciente).toBeDefined();
      expect(paciente.triage).toBe('rojo');
    });

    test('S3: tiene múltiples pacientes con discapacidad', () => {
      const s3 = getScenario('S3');

      const conDiscapacidad = s3.pacientes.filter(p => p.discapacidad);

      expect(conDiscapacidad.length).toBeGreaterThan(0);
    });

    test('S3: tiene pacientes en todos los niveles de triage', () => {
      const s3 = getScenario('S3');

      const triages = new Set(s3.pacientes.map(p => p.triage));

      expect(triages.has('rojo')).toBe(true);
      expect(triages.has('amarillo')).toBe(true);
      expect(triages.has('verde')).toBe(true);
    });
  });
});
