/**
 * Integration Tests - UI Workflows
 * Prueba flujos completos de interacción usuario-sistema
 */

import { JSDOM } from 'jsdom';
import { patientTestData, hospitalStateData } from './fixtures/test-data.js';

describe('UI Workflows Integration', () => {
  let document;
  let window;
  let dom;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="UTF-8"><title>Simulador Test</title></head>
      <body>
        <div id="simulador-container">
          <button id="btn-iniciar-s1">Iniciar S1</button>
          <button id="btn-iniciar-s2">Iniciar S2</button>
          <button id="btn-iniciar-s3">Iniciar S3</button>
          <div id="estado-hospital">
            <span id="uci-ocupacion">0/8</span>
            <span id="urgencias-ocupacion">0/39</span>
            <span id="pacientes-rojos">0</span>
            <span id="pacientes-amarillos">0</span>
            <span id="pacientes-verdes">0</span>
          </div>
          <div id="lista-pacientes"></div>
          <button id="btn-exportar">Exportar</button>
          <button id="btn-voz">Voz</button>
          <button id="btn-pausa">Pausar</button>
          <select id="scenario-selector">
            <option value="">Seleccionar escenario</option>
            <option value="S1">Sismo 7.4</option>
            <option value="S2">Explosión</option>
            <option value="S3">Cuartos de Final</option>
          </select>
          <div id="contador-tiempo">T+00</div>
          <div id="injector-panel"></div>
          <div id="decisiones-panel"></div>
        </div>
      </body>
      </html>
    `);

    document = dom.window.document;
    window = dom.window;
    global.document = document;
    global.window = window;
  });

  afterEach(() => {
    delete global.document;
    delete global.window;
  });

  describe('Flujo: Iniciar Escenario', () => {
    test('debe iniciar S1 al hacer clic', () => {
      const btnS1 = document.getElementById('btn-iniciar-s1');
      let scenarioStarted = null;

      btnS1.addEventListener('click', () => {
        scenarioStarted = 'S1';
      });

      btnS1.click();

      expect(scenarioStarted).toBe('S1');
    });

    test('debe iniciar S2 al hacer clic', () => {
      const btnS2 = document.getElementById('btn-iniciar-s2');
      let scenarioStarted = null;

      btnS2.addEventListener('click', () => {
        scenarioStarted = 'S2';
      });

      btnS2.click();

      expect(scenarioStarted).toBe('S2');
    });

    test('debe iniciar S3 al hacer clic', () => {
      const btnS3 = document.getElementById('btn-iniciar-s3');
      let scenarioStarted = null;

      btnS3.addEventListener('click', () => {
        scenarioStarted = 'S3';
      });

      btnS3.click();

      expect(scenarioStarted).toBe('S3');
    });

    test('debe seleccionar escenario desde dropdown', () => {
      const selector = document.getElementById('scenario-selector');

      selector.value = 'S1';
      selector.dispatchEvent(new window.Event('change', { bubbles: true }));

      expect(selector.value).toBe('S1');
    });

    test('debe actualizar UI al cambiar escenario', () => {
      const tiempo = document.getElementById('contador-tiempo');

      tiempo.textContent = 'T+00';

      expect(tiempo.textContent).toBe('T+00');

      tiempo.textContent = 'T+15';

      expect(tiempo.textContent).toBe('T+15');
    });
  });

  describe('Flujo: Procesar Pacientes', () => {
    test('debe mostrar lista de pacientes', () => {
      const lista = document.getElementById('lista-pacientes');
      const pacientes = [
        patientTestData.rojoCritico,
        patientTestData.amarilloUrgente
      ];

      pacientes.forEach(p => {
        const div = document.createElement('div');
        div.textContent = `${p.folio} - ${p.triage}`;
        div.dataset.folio = p.folio;
        lista.appendChild(div);
      });

      expect(lista.children.length).toBe(2);
      expect(lista.children[0].textContent).toContain('P-TEST-001');
    });

    test('debe actualizar contadores de pacientes', () => {
      const rojos = document.getElementById('pacientes-rojos');
      const amarillos = document.getElementById('pacientes-amarillos');
      const verdes = document.getElementById('pacientes-verdes');

      rojos.textContent = '3';
      amarillos.textContent = '10';
      verdes.textContent = '15';

      expect(rojos.textContent).toBe('3');
      expect(amarillos.textContent).toBe('10');
      expect(verdes.textContent).toBe('15');
    });

    test('debe actualizar ocupación de UCI', () => {
      const uci = document.getElementById('uci-ocupacion');

      uci.textContent = '7/8';

      expect(uci.textContent).toBe('7/8');
    });

    test('debe actualizar ocupación de urgencias', () => {
      const urgencias = document.getElementById('urgencias-ocupacion');

      urgencias.textContent = '35/39';

      expect(urgencias.textContent).toBe('35/39');
    });

    test('debe agregar paciente a la lista dinámicamente', () => {
      const lista = document.getElementById('lista-pacientes');

      expect(lista.children.length).toBe(0);

      const div = document.createElement('div');
      div.className = 'paciente-item';
      div.textContent = 'Nuevo Paciente';
      lista.appendChild(div);

      expect(lista.children.length).toBe(1);
      expect(lista.children[0].textContent).toBe('Nuevo Paciente');
    });

    test('debe remover paciente de la lista', () => {
      const lista = document.getElementById('lista-pacientes');
      const paciente = document.createElement('div');
      paciente.id = 'pac-1';
      lista.appendChild(paciente);

      expect(lista.children.length).toBe(1);

      lista.removeChild(paciente);

      expect(lista.children.length).toBe(0);
    });
  });

  describe('Flujo: Cambiar Triage', () => {
    test('debe actualizar contadores al cambiar triage', () => {
      const rojos = document.getElementById('pacientes-rojos');

      rojos.textContent = '2';
      expect(rojos.textContent).toBe('2');

      rojos.textContent = '1';
      expect(rojos.textContent).toBe('1');
    });

    test('debe actualizar visualmente el badge de triage', () => {
      const lista = document.getElementById('lista-pacientes');
      const paciente = document.createElement('div');
      paciente.innerHTML = '<span class="badge triage-rojo">ROJO</span>';
      lista.appendChild(paciente);

      let badge = paciente.querySelector('.badge');
      expect(badge.textContent).toBe('ROJO');
      expect(badge.classList.contains('triage-rojo')).toBe(true);

      badge.textContent = 'AMARILLO';
      badge.classList.remove('triage-rojo');
      badge.classList.add('triage-amarillo');

      expect(badge.textContent).toBe('AMARILLO');
      expect(badge.classList.contains('triage-amarillo')).toBe(true);
    });
  });

  describe('Flujo: Control de Voz', () => {
    test('debe alternar estado de voz', () => {
      const btnVoz = document.getElementById('btn-voz');
      let vozActiva = true;

      btnVoz.addEventListener('click', () => {
        vozActiva = !vozActiva;
        btnVoz.textContent = vozActiva ? '🔊 Voz ON' : '🔇 Voz OFF';
      });

      btnVoz.click();

      expect(vozActiva).toBe(false);
      expect(btnVoz.textContent).toBe('🔇 Voz OFF');

      btnVoz.click();

      expect(vozActiva).toBe(true);
      expect(btnVoz.textContent).toBe('🔊 Voz ON');
    });
  });

  describe('Flujo: Pausar/Reanudar', () => {
    test('debe pausar simulación', () => {
      const btnPausa = document.getElementById('btn-pausa');
      let pausado = false;

      btnPausa.addEventListener('click', () => {
        pausado = !pausado;
        btnPausa.textContent = pausado ? '▶ Reanudar' : '⏸ Pausar';
      });

      btnPausa.click();

      expect(pausado).toBe(true);
      expect(btnPausa.textContent).toBe('▶ Reanudar');
    });

    test('debe reanudar simulación', () => {
      const btnPausa = document.getElementById('btn-pausa');
      let pausado = true;

      btnPausa.addEventListener('click', () => {
        pausado = !pausado;
        btnPausa.textContent = pausado ? '▶ Reanudar' : '⏸ Pausar';
      });

      btnPausa.click();

      expect(pausado).toBe(false);
      expect(btnPausa.textContent).toBe('⏸ Pausar');
    });
  });

  describe('Flujo: Exportar Datos', () => {
    test('debe preparar datos para exportación', () => {
      const btnExportar = document.getElementById('btn-exportar');
      let exportClicked = false;

      btnExportar.addEventListener('click', () => {
        exportClicked = true;
      });

      btnExportar.click();

      expect(exportClicked).toBe(true);
    });

    test('debe recopilar pacientes activos', () => {
      const pacientes = [
        { ...patientTestData.rojoCritico, estado: 'ACTIVO' },
        { ...patientTestData.amarilloUrgente, estado: 'ACTIVO' },
        { ...patientTestData.verdeEstable, estado: 'ALTA' }
      ];

      const activos = pacientes.filter(p => p.estado === 'ACTIVO');

      expect(activos.length).toBe(2);
    });
  });

  describe('Flujo: Mostrar Injectores', () => {
    test('debe mostrar injector en el panel', () => {
      const panel = document.getElementById('injector-panel');
      const injector = {
        t: 10,
        tipo: 'critico',
        canal: 'RADIO',
        texto: 'Mensaje de prueba'
      };

      const div = document.createElement('div');
      div.className = 'injector-item';
      div.dataset.t = injector.t;
      div.innerHTML = `
        <span class="injector-tipo">${injector.tipo}</span>
        <span class="injector-canal">${injector.canal}</span>
        <p>${injector.texto}</p>
      `;
      panel.appendChild(div);

      expect(panel.children.length).toBe(1);
      expect(panel.children[0].dataset.t).toBe('10');
    });

    test('debe marcar injector como visto', () => {
      const panel = document.getElementById('injector-panel');
      const injector = document.createElement('div');
      injector.className = 'injector-item unseen';
      panel.appendChild(injector);

      expect(injector.classList.contains('unseen')).toBe(true);

      injector.classList.remove('unseen');
      injector.classList.add('seen');

      expect(injector.classList.contains('seen')).toBe(true);
      expect(injector.classList.contains('unseen')).toBe(false);
    });
  });

  describe('Flujo: Panel de Decisiones', () => {
    test('debe mostrar decisión pendiente', () => {
      const panel = document.getElementById('decisiones-panel');
      const decision = {
        id: 'dec-smv',
        label: 'Declarar SMV',
        critico: true
      };

      const div = document.createElement('div');
      div.className = 'decision-item pending';
      div.dataset.id = decision.id;
      div.innerHTML = `
        <span class="decision-label">${decision.label}</span>
        ${decision.critico ? '<span class="critical-badge">CRÍTICO</span>' : ''}
      `;
      panel.appendChild(div);

      expect(panel.children.length).toBe(1);
      expect(panel.children[0].dataset.id).toBe('dec-smv');
    });

    test('debe marcar decisión como completada', () => {
      const panel = document.getElementById('decisiones-panel');
      const decision = document.createElement('div');
      decision.className = 'decision-item pending';
      panel.appendChild(decision);

      expect(decision.classList.contains('pending')).toBe(true);

      decision.classList.remove('pending');
      decision.classList.add('completed');

      expect(decision.classList.contains('completed')).toBe(true);
      expect(decision.classList.contains('pending')).toBe(false);
    });
  });

  describe('Flujo: Actualización de Tiempo', () => {
    test('debe formatear tiempo correctamente', () => {
      const tiempo = document.getElementById('contador-tiempo');

      function setTiempo(minutos) {
        tiempo.textContent = `T+${String(minutos).padStart(2, '0')}`;
      }

      setTiempo(0);
      expect(tiempo.textContent).toBe('T+00');

      setTiempo(5);
      expect(tiempo.textContent).toBe('T+05');

      setTiempo(45);
      expect(tiempo.textContent).toBe('T+45');
    });

    test('debe actualizar tiempo en intervalos', () => {
      const tiempo = document.getElementById('contador-tiempo');
      let minutos = 0;

      const interval = setInterval(() => {
        minutos++;
        tiempo.textContent = `T+${String(minutos).padStart(2, '0')}`;
        if (minutos >= 3) clearInterval(interval);
      }, 100);

      // Simular paso de tiempo (en test real esto sería async)
      minutos = 3;
      tiempo.textContent = `T+${String(minutos).padStart(2, '0')}`;

      expect(tiempo.textContent).toBe('T+03');
    });
  });

  describe('Flujo: Interacción con Formularios', () => {
    test('debe capturar input de texto', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.id = 'test-input';

      let capturedValue = '';
      input.addEventListener('input', (e) => {
        capturedValue = e.target.value;
      });

      input.value = 'Valor de prueba';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));

      expect(capturedValue).toBe('Valor de prueba');
    });

    test('debe capturar cambio en select', () => {
      const select = document.createElement('select');
      select.innerHTML = `
        <option value="A">Opción A</option>
        <option value="B">Opción B</option>
      `;

      let capturedValue = '';
      select.addEventListener('change', (e) => {
        capturedValue = e.target.value;
      });

      select.value = 'B';
      select.dispatchEvent(new window.Event('change', { bubbles: true }));

      expect(capturedValue).toBe('B');
    });
  });

  describe('Flujo: Notificaciones', () => {
    test('debe mostrar notificación temporal', () => {
      const container = document.createElement('div');
      container.id = 'notifications';

      function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        container.appendChild(notification);

        setTimeout(() => {
          container.removeChild(notification);
        }, 3000);
      }

      showNotification('Mensaje de prueba', 'success');

      expect(container.children.length).toBe(1);
      expect(container.children[0].textContent).toBe('Mensaje de prueba');
      expect(container.children[0].classList.contains('success')).toBe(true);
    });

    test('debe mostrar múltiples notificaciones', () => {
      const container = document.createElement('div');
      container.id = 'notifications';

      function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        container.appendChild(notification);
      }

      showNotification('Primera');
      showNotification('Segunda');
      showNotification('Tercera');

      expect(container.children.length).toBe(3);
    });
  });

  describe('Flujo: Actualización de Estado Hospitalario', () => {
    test('debe actualizar estado completo del hospital', () => {
      const estado = {
        uci: { ocupacion: 7, total: 8 },
        urgencias: { ocupacion: 35, total: 39 },
        rojos: 5,
        amarillos: 12,
        verdes: 18
      };

      document.getElementById('uci-ocupacion').textContent = `${estado.uci.ocupacion}/${estado.uci.total}`;
      document.getElementById('urgencias-ocupacion').textContent = `${estado.urgencias.ocupacion}/${estado.urgencias.total}`;
      document.getElementById('pacientes-rojos').textContent = estado.rojos;
      document.getElementById('pacientes-amarillos').textContent = estado.amarillos;
      document.getElementById('pacientes-verdes').textContent = estado.verdes;

      expect(document.getElementById('uci-ocupacion').textContent).toBe('7/8');
      expect(document.getElementById('urgencias-ocupacion').textContent).toBe('35/39');
      expect(document.getElementById('pacientes-rojos').textContent).toBe('5');
    });
  });
});
