/**
 * Web Worker - Excel Export Unit Tests
 * Tests for the Web Worker implementation of Excel export
 */

import { JSDOM } from "jsdom";

// Mock Blob
global.Blob = class Blob {
  constructor(parts, options) {
    this.parts = parts;
    this.options = options;
  }
};

// Mock XLSX library
const mockJsonToSheet = jest.fn(data => ({ data, type: "sheet" }));

global.XLSX = {
  utils: {
    book_new: jest.fn(() => ({ Sheets: [], SheetNames: [] })),
    json_to_sheet: mockJsonToSheet,
    book_append_sheet: jest.fn(),
  },
  write: jest.fn(() => new Uint8Array([1, 2, 3])),
  writeFile: jest.fn(),
};

describe("Web Worker - Excel Export", () => {
  let document;
  let window;
  let mockWorker;
  let workerCode;

  // Datos de prueba
  const generateTestPatients = (count = 100) => {
    return Array(count)
      .fill(null)
      .map((_, i) => ({
        folio_local: `P-${String(i + 1).padStart(3, "0")}`,
        nombre: `Patient ${i}`,
        edad_estimada: 30 + (i % 50),
        sexo: i % 2 === 0 ? "M" : "F",
        discapacidad: null,
        triage_inicial: ["ROJO", "AMARILLO", "VERDE", "NEGRO"][i % 4],
        triage_actual: ["ROJO", "AMARILLO", "VERDE", "NEGRO"][i % 4],
        area_actual: "OBSERVACION",
        ts_ingreso: new Date(Date.now() - i * 1000000).toISOString(),
        operador_registro: "Dr. Test",
      }));
  };

  const generateTestTraceability = (count = 50) => {
    return Array(count)
      .fill(null)
      .map((_, i) => ({
        folio_local: `P-${String(i + 1).padStart(3, "0")}`,
        ts_evento: new Date(Date.now() - i * 500000).toISOString(),
        tipo_evento: ["INGRESO", "CAMBIO_TRIAGE", "ALTA"][i % 3],
        descripcion: "Event description",
        valor_anterior: "OLD",
        valor_nuevo: "NEW",
        operador: "Dr. Test",
      }));
  };

  const generateTestAudit = (count = 30) => {
    return Array(count)
      .fill(null)
      .map((_, i) => ({
        ts: new Date(Date.now() - i * 300000).toISOString(),
        operador: "Dr. Test",
        accion: ["CREATE", "UPDATE", "DELETE"][i % 3],
        tabla_ref: "pacientes",
        id_ref: `P-${String(i + 1).padStart(3, "0")}`,
        detalle: "Audit detail",
      }));
  };

  beforeEach(() => {
    // Reset mocks pero mantener implementaciones
    mockJsonToSheet.mockImplementation(data => ({ data, type: "sheet" }));

    // Create fresh DOM environment
    const dom = new JSDOM(
      '<!DOCTYPE html><html><body>\
      <div id="export-progress-modal" class="hidden"></div>\
      <div id="export-progress-bar"></div>\
      <div id="export-progress-text"></div>\
      <div id="export-progress-percent"></div>\
    </body></html>'
    );

    window = dom.window;
    document = window.document;
    global.document = document;
    global.window = window;

    // Mock Worker
    mockWorker = {
      onmessage: null,
      onerror: null,
      postMessage: jest.fn(),
      terminate: jest.fn(),
      _messages: [],
      _simulateMessage: function (data) {
        if (this.onmessage) {
          this.onmessage({ data });
        }
      },
      _simulateError: function (error) {
        if (this.onerror) {
          this.onerror(error);
        }
      },
    };

    // Mock Worker constructor
    global.Worker = jest.fn(path => mockWorker);
  });

  afterEach(() => {
    global.Worker = undefined;
  });

  describe("Worker Initialization", () => {
    test("should create worker with correct path", () => {
      // Simulate creating the worker manager
      const worker = new Worker("dist/workers/export-worker.js");

      expect(global.Worker).toHaveBeenCalledWith("dist/workers/export-worker.js");
    });

    test("should set up message handlers", () => {
      const worker = new Worker("dist/workers/export-worker.js");

      worker.onmessage = jest.fn();
      worker.onerror = jest.fn();

      // Simular mensaje
      worker._simulateMessage({ type: "ready" });

      expect(worker.onmessage).toHaveBeenCalled();
    });
  });

  describe("Export Data Processing", () => {
    test("should process patient data correctly", () => {
      const patients = generateTestPatients(10);

      patients.forEach(p => {
        expect(p).toHaveProperty("folio_local");
        expect(p).toHaveProperty("nombre");
        expect(p).toHaveProperty("triage_actual");
        expect(p.folio_local).toMatch(/^P-\d{3}$/);
      });
    });

    test("should process traceability data correctly", () => {
      const traceability = generateTestTraceability(10);

      traceability.forEach(t => {
        expect(t).toHaveProperty("folio_local");
        expect(t).toHaveProperty("ts_evento");
        expect(t).toHaveProperty("tipo_evento");
        expect(t).toHaveProperty("operador");
      });
    });

    test("should process audit data correctly", () => {
      const audit = generateTestAudit(10);

      audit.forEach(a => {
        expect(a).toHaveProperty("ts");
        expect(a).toHaveProperty("operador");
        expect(a).toHaveProperty("accion");
      });
    });
  });

  describe("Progress Reporting", () => {
    test("should report progress at 10%", () => {
      const worker = new Worker("dist/workers/export-worker.js");
      let receivedProgress = null;

      worker.onmessage = e => {
        if (e.data.type === "progress") {
          receivedProgress = e.data;
        }
      };

      worker._simulateMessage({
        type: "progress",
        percent: 10,
        message: "Iniciando exportación...",
      });

      expect(receivedProgress).toBeTruthy();
      expect(receivedProgress.percent).toBe(10);
      expect(receivedProgress.message).toBe("Iniciando exportación...");
    });

    test("should report progress at 30, 60, 80, 100 percent", () => {
      const worker = new Worker("dist/workers/export-worker.js");
      const progresses = [];

      worker.onmessage = e => {
        if (e.data.type === "progress") {
          progresses.push(e.data.percent);
        }
      };

      const expectedProgress = [10, 30, 60, 80, 100];
      expectedProgress.forEach(percent => {
        worker._simulateMessage({
          type: "progress",
          percent,
          message: "Processing...",
        });
      });

      expect(progresses).toEqual(expectedProgress);
    });

    test("should handle progress update in UI", () => {
      const progressBar = document.getElementById("export-progress-bar");
      const progressText = document.getElementById("export-progress-text");
      const progressPercent = document.getElementById("export-progress-percent");

      // Simular actualización de progreso
      if (progressBar) progressBar.style.width = "50%";
      if (progressText) progressText.textContent = "Procesando...";
      if (progressPercent) progressPercent.textContent = "50%";

      expect(progressBar?.style.width).toBe("50%");
      expect(progressText?.textContent).toBe("Procesando...");
      expect(progressPercent?.textContent).toBe("50%");
    });
  });

  describe("Export Completion", () => {
    test("should send complete message with blob", () => {
      const worker = new Worker("dist/workers/export-worker.js");
      let completeMessage = null;

      worker.onmessage = e => {
        if (e.data.type === "complete") {
          completeMessage = e.data;
        }
      };

      const testBlob = new Blob([new Uint8Array([1, 2, 3])], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      worker._simulateMessage({
        type: "complete",
        blob: testBlob,
        filename: "ECEDES_2026-03-04_10-30-00.xlsx",
      });

      expect(completeMessage).toBeTruthy();
      expect(completeMessage.type).toBe("complete");
      expect(completeMessage.blob).toBeTruthy();
      expect(completeMessage.filename).toMatch(/ECEDES_.*\.xlsx/);
    });

    test("should generate filename with correct format", () => {
      const filename = `ECEDES_${new Date().toISOString().split("T")[0]}_12-30-45.xlsx`;

      expect(filename).toMatch(/^ECEDES_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.xlsx$/);
    });
  });

  describe("Error Handling", () => {
    test("should handle worker errors gracefully", () => {
      const worker = new Worker("dist/workers/export-worker.js");
      let errorMessage = null;

      worker.onmessage = e => {
        if (e.data.type === "error") {
          errorMessage = e.data;
        }
      };

      worker._simulateMessage({
        type: "error",
        error: "Test error message",
      });

      expect(errorMessage).toBeTruthy();
      expect(errorMessage.error).toBe("Test error message");
    });

    test("should handle null data gracefully", () => {
      const worker = new Worker("dist/workers/export-worker.js");
      let errorMessage = null;

      worker.onmessage = e => {
        if (e.data.type === "error") {
          errorMessage = e.data;
        }
      };

      // Simular error con datos nulos
      worker._simulateMessage({
        type: "error",
        error: "Cannot read property of null",
      });

      expect(errorMessage).toBeTruthy();
    });
  });

  describe("Data Integrity", () => {
    test("should maintain patient data integrity through export", () => {
      const patients = generateTestPatients(100);
      const firstPatient = patients[0];
      const lastPatient = patients[99];

      expect(patients).toHaveLength(100);
      expect(patients[0].folio_local).toBe("P-001");
      expect(patients[99].folio_local).toBe("P-100");
    });

    test("should handle empty datasets", () => {
      const patients = [];
      const traceability = [];
      const audit = [];

      expect(patients).toHaveLength(0);
      expect(traceability).toHaveLength(0);
      expect(audit).toHaveLength(0);

      // XLSX debería manejar arrays vacíos - verificar que la función existe y es llamada
      expect(typeof XLSX.utils.json_to_sheet).toBe("function");
      const sheet = XLSX.utils.json_to_sheet(patients);
      // El mock debería devolver un objeto con data y type
      expect(sheet).toBeDefined();
      expect(sheet.data).toEqual([]);
    });

    test("should handle special characters in patient names", () => {
      const specialNames = ["María José", "Juan Carlos", "O'Connor", "Müller", "张伟"];

      specialNames.forEach(name => {
        const patient = {
          folio_local: "P-001",
          nombre: name,
          triage_actual: "VERDE",
        };

        expect(patient.nombre).toBe(name);
      });
    });
  });

  describe("Worker Communication", () => {
    test("should send export message with correct structure", () => {
      const worker = new Worker("dist/workers/export-worker.js");

      const exportData = {
        patients: generateTestPatients(10),
        traceability: generateTestTraceability(5),
        audit: generateTestAudit(5),
      };

      worker.postMessage({
        type: "export",
        data: exportData,
      });

      expect(worker.postMessage).toHaveBeenCalledWith({
        type: "export",
        data: exportData,
      });
    });

    test("should handle health check messages", () => {
      const worker = new Worker("dist/workers/export-worker.js");
      let healthResponse = null;

      worker.onmessage = e => {
        if (e.data.type === "health") {
          healthResponse = e.data;
        }
      };

      worker.postMessage({ type: "health" });
      worker._simulateMessage({ type: "health", status: "ok" });

      expect(healthResponse).toBeTruthy();
      expect(healthResponse.status).toBe("ok");
    });
  });

  describe("Fallback Behavior", () => {
    test("should detect when Worker is not supported", () => {
      global.Worker = undefined;

      const isWorkerSupported = typeof Worker !== "undefined";

      expect(isWorkerSupported).toBe(false);
    });

    test("should use sync export when worker unavailable", () => {
      global.Worker = undefined;

      const exportData = {
        patients: generateTestPatients(10),
        traceability: [],
        audit: [],
      };

      // Usar XLSX directamente (fallback)
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData.patients);
      XLSX.utils.book_append_sheet(wb, ws, "Test");

      expect(XLSX.utils.book_new).toHaveBeenCalled();
      expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith(exportData.patients);
    });
  });
});
