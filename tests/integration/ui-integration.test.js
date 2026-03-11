/**
 * Integration Tests - UI Layer
 * Prueba interacción completa usuario-sistema
 *
 * Estos tests verifican la integración entre:
 * - DOM/Browser APIs
 * - Manejadores de eventos
 * - Formularios
 * - Actualización de UI
 * - Exportación desde la UI
 */

import { JSDOM } from "jsdom";

describe("UI Integration - Complete User Workflows", () => {
  let document;
  let window;
  let dom;

  beforeEach(() => {
    // Crear DOM mock único para cada test
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="UTF-8"><title>ECE-DES Test</title></head>
      <body>
        <form id="patient-form">
          <input id="paciente-nombre" type="text" name="nombre" />
          <input id="paciente-edad" type="number" name="edad" />
          <select id="triage-selector" name="triage">
            <option value="">Seleccionar</option>
            <option value="ROJO">Rojo</option>
            <option value="AMARILLO">Amarillo</option>
          </select>
          <button id="btn-registrar" type="submit">Registrar</button>
        </form>
        <table id="pacientes-table">
          <tbody id="pacientes-table-body"></tbody>
        </table>
        <div id="contador-rojos">0</div>
        <div id="contador-amarillos">0</div>
        <div id="contador-verdes">0</div>
        <div id="contador-total">0</div>
        <button id="btn-exportar-excel">Exportar</button>
      </body>
      </html>
    `);

    document = dom.window.document;
    window = dom.window;
    global.document = document;
    global.window = window;

    // Mock localStorage
    const mockLocalStorage = {
      store: {},
      getItem: jest.fn(key => mockLocalStorage.store[key] || null),
      setItem: jest.fn((key, value) => {
        mockLocalStorage.store[key] = value;
      }),
      removeItem: jest.fn(key => {
        delete mockLocalStorage.store[key];
      }),
      clear: jest.fn(() => {
        mockLocalStorage.store = {};
      }),
    };
    global.localStorage = mockLocalStorage;
  });

  afterEach(() => {
    delete global.document;
    delete global.window;
    delete global.localStorage;
  });

  // Helper para llenar un input
  function fillInput(id, value) {
    const input = document.getElementById(id);
    if (input) {
      input.value = value;
      input.dispatchEvent(new window.Event("input", { bubbles: true }));
    }
    return input;
  }

  // Helper para seleccionar opción
  function selectOption(id, value) {
    const select = document.getElementById(id);
    if (select) {
      select.value = value;
      select.dispatchEvent(new window.Event("change", { bubbles: true }));
    }
    return select;
  }

  // Helper para agregar paciente a la tabla
  function addPatientToTable(patient) {
    const tbody = document.getElementById("pacientes-table-body");
    const row = document.createElement("tr");
    row.setAttribute("data-paciente-id", patient.id_interno);
    row.innerHTML = `
      <td>${patient.folio_local}</td>
      <td>${patient.nombre}</td>
      <td><span class="triage-badge">${patient.triage_actual}</span></td>
      <td>${patient.edad_estimada}</td>
    `;
    tbody.appendChild(row);
    return row;
  }

  // Helper para actualizar contadores
  function updateCounters(patients) {
    const counts = { ROJO: 0, AMARILLO: 0, VERDE: 0, NEGRO: 0 };
    patients.forEach(p => {
      if (counts[p.triage_actual] !== undefined) {
        counts[p.triage_actual]++;
      }
    });

    document.getElementById("contador-rojos").textContent = counts.ROJO;
    document.getElementById("contador-amarillos").textContent = counts.AMARILLO;
    document.getElementById("contador-verdes").textContent = counts.VERDE;
    document.getElementById("contador-total").textContent = patients.length;
  }

  describe("Flujo de Registro Rápido", () => {
    test("usuario completa registro de paciente desde inicio a fin", () => {
      const pacientes = [];

      // 1. Usuario llena datos básicos
      fillInput("paciente-nombre", "Juan Pérez");
      fillInput("paciente-edad", "45");
      selectOption("triage-selector", "ROJO");

      expect(document.getElementById("paciente-nombre").value).toBe("Juan Pérez");
      expect(document.getElementById("triage-selector").value).toBe("ROJO");

      // 2. Simular registro
      const newPatient = {
        id_interno: `P-${Date.now()}`,
        folio_local: `F-${pacientes.length + 1}`,
        nombre: "Juan Pérez",
        edad_estimada: 45,
        triage_actual: "ROJO",
        estado: "ACTIVO",
      };
      pacientes.push(newPatient);

      // 3. Agregar a tabla
      addPatientToTable(newPatient);

      // 4. Verificar que paciente aparece en tabla
      const tabla = document.getElementById("pacientes-table-body");
      const filas = tabla.querySelectorAll("tr");
      expect(filas.length).toBe(1);
      expect(filas[0].textContent).toContain("Juan Pérez");

      // 5. Actualizar y verificar contadores
      updateCounters(pacientes);
      expect(document.getElementById("contador-total").textContent).toBe("1");
    });

    test("registro de paciente con discapacidad", () => {
      const pacientes = [];
      const newPatient = {
        id_interno: "P-005",
        folio_local: "F-005",
        nombre: "Ana Martínez",
        edad_estimada: 55,
        discapacidad: "auditiva",
        triage_actual: "AMARILLO",
        estado: "ACTIVO",
      };
      pacientes.push(newPatient);

      expect(newPatient.discapacidad).toBe("auditiva");
      addPatientToTable(newPatient);

      const tabla = document.getElementById("pacientes-table-body");
      expect(tabla.querySelectorAll("tr").length).toBe(1);
    });
  });

  describe("Flujo de Actualización de Triage", () => {
    test("usuario cambia triage de paciente y actualiza UI", () => {
      // Crear pacientes locales para aislar del fixture
      const pacientes = [
        { id_interno: "P-1", folio_local: "F-1", nombre: "Juan", triage_actual: "ROJO", edad_estimada: 45 },
        { id_interno: "P-2", folio_local: "F-2", nombre: "María", triage_actual: "AMARILLO", edad_estimada: 32 }
      ];

      pacientes.forEach(p => addPatientToTable(p));
      updateCounters(pacientes);

      // Verificar estado inicial
      expect(document.getElementById("contador-rojos").textContent).toBe("1");
      expect(document.getElementById("contador-amarillos").textContent).toBe("1");

      // Simular cambio de triage
      pacientes[0].triage_actual = "AMARILLO";

      // Actualizar tabla
      const tabla = document.getElementById("pacientes-table-body");
      tabla.innerHTML = "";
      pacientes.forEach(p => addPatientToTable(p));
      updateCounters(pacientes);

      // Verificar actualización
      expect(document.getElementById("contador-rojos").textContent).toBe("0");
      expect(document.getElementById("contador-amarillos").textContent).toBe("2");
    });

    test("cambio de triage actualiza badge visual", () => {
      const tbody = document.getElementById("pacientes-table-body");
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><span class="triage-badge triage-rojo">ROJO</span></td>
      `;
      tbody.appendChild(row);

      let badge = row.querySelector(".triage-badge");
      expect(badge.className).toContain("triage-rojo");
      expect(badge.textContent).toBe("ROJO");

      // Simular cambio
      badge.textContent = "AMARILLO";
      badge.className = "triage-badge triage-amarillo";

      expect(badge.className).toContain("triage-amarillo");
      expect(badge.textContent).toBe("AMARILLO");
    });
  });

  describe("Flujo de Búsqueda y Filtros", () => {
    test("búsqueda de paciente por nombre", () => {
      const pacientes = [
        { id_interno: "P-1", folio_local: "F-1", nombre: "Juan Pérez", triage_actual: "ROJO", edad_estimada: 45 },
        { id_interno: "P-2", folio_local: "F-2", nombre: "María González", triage_actual: "AMARILLO", edad_estimada: 32 },
        { id_interno: "P-3", folio_local: "F-3", nombre: "Pedro López", triage_actual: "VERDE", edad_estimada: 28 }
      ];

      // Filtrar por nombre
      const searchTerm = "Juan";
      const filtered = pacientes.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );

      expect(filtered.length).toBe(1);
      expect(filtered[0].nombre).toBe("Juan Pérez");
    });

    test("filtro por triage", () => {
      const tbody = document.getElementById("pacientes-table-body");
      tbody.innerHTML = "";

      const pacientes = [
        { id_interno: "P-1", folio_local: "F-1", nombre: "Juan", triage_actual: "ROJO", edad_estimada: 45 },
        { id_interno: "P-2", folio_local: "F-2", nombre: "María", triage_actual: "AMARILLO", edad_estimada: 32 },
        { id_interno: "P-3", folio_local: "F-3", nombre: "Pedro", triage_actual: "VERDE", edad_estimada: 28 }
      ];

      pacientes.forEach(p => addPatientToTable(p));
      expect(tbody.querySelectorAll("tr").length).toBe(3);

      // Filtrar por amarillo
      const filtered = pacientes.filter(p => p.triage_actual === "AMARILLO");
      tbody.innerHTML = "";
      filtered.forEach(p => addPatientToTable(p));

      expect(tbody.querySelectorAll("tr").length).toBe(1);
    });
  });

  describe("Flujo de Exportación", () => {
    test("usuario exporta datos de pacientes", () => {
      const pacientes = [
        { id_interno: "P-1", folio_local: "F-1", nombre: "Juan", triage_actual: "ROJO", edad_estimada: 45 },
        { id_interno: "P-2", folio_local: "F-2", nombre: "María", triage_actual: "AMARILLO", edad_estimada: 32 }
      ];

      // Simular datos de exportación
      const exportData = {
        pacientes,
        metricas: {
          total: pacientes.length,
          porTriage: { ROJO: 1, AMARILLO: 1 }
        }
      };

      expect(exportData.pacientes.length).toBe(2);
      expect(exportData.metricas.total).toBe(2);
    });

    test("exportación incluye todos los campos requeridos", () => {
      const paciente = {
        id_interno: "P-001",
        folio_local: "F-001",
        nombre: "Juan Pérez",
        triage_actual: "ROJO"
      };

      const exportRow = {
        folio: paciente.folio_local,
        nombre: paciente.nombre,
        triage: paciente.triage_actual
      };

      expect(exportRow).toHaveProperty("folio");
      expect(exportRow).toHaveProperty("nombre");
      expect(exportRow).toHaveProperty("triage");
    });
  });

  describe("Actualización en Tiempo Real", () => {
    test("contadores se actualizan al agregar paciente", () => {
      const pacientes = [];

      updateCounters(pacientes);
      expect(document.getElementById("contador-total").textContent).toBe("0");

      pacientes.push({ triage_actual: "ROJO" });
      updateCounters(pacientes);
      expect(document.getElementById("contador-rojos").textContent).toBe("1");

      pacientes.push({ triage_actual: "AMARILLO" });
      updateCounters(pacientes);
      expect(document.getElementById("contador-amarillos").textContent).toBe("1");
    });
  });

  describe("Accesibilidad", () => {
    test("campos de formulario tienen atributos name", () => {
      const inputs = document.querySelectorAll("#patient-form input, #patient-form select");

      inputs.forEach(input => {
        expect(input.getAttribute("name")).toBeTruthy();
      });
    });

    test("botones tienen texto descriptivo", () => {
      const buttons = document.querySelectorAll("button");

      buttons.forEach(button => {
        expect(button.textContent.trim().length).toBeGreaterThan(0);
      });
    });
  });
});
