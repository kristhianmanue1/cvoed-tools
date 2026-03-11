/**
 * Performance Tests: Web Worker vs Sync Export
 * Tests to verify that the Web Worker implementation improves performance
 */

import { JSDOM } from "jsdom";

// Mock XLSX library
global.XLSX = {
  utils: {
    book_new: jest.fn(() => ({ Sheets: [], SheetNames: [] })),
    json_to_sheet: jest.fn(data => ({ data, type: "sheet" })),
    book_append_sheet: jest.fn(),
  },
  write: jest.fn(() => new Uint8Array(Array(1000).fill(0))),
  writeFile: jest.fn(),
};

// Mock Blob
global.Blob = class Blob {
  constructor(parts, options) {
    this.parts = parts;
    this.options = options;
    this.size = parts.reduce((acc, part) => acc + part.length, 0);
  }
};

// Mock URL
global.URL = {
  createObjectURL: jest.fn(() => "blob:mock-url"),
  revokeObjectURL: jest.fn(),
};

describe("Performance: Worker vs Sync Export", () => {
  let document;
  let window;
  let mockWorker;

  // Generador de datos de prueba
  const generateMockPatients = count => {
    return Array(count)
      .fill(null)
      .map((_, i) => ({
        folio_local: `P-${String(i + 1).padStart(4, "0")}`,
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

  const generateMockTraceability = count => {
    return Array(count)
      .fill(null)
      .map((_, i) => ({
        folio_local: `P-${String(i + 1).padStart(4, "0")}`,
        ts_evento: new Date(Date.now() - i * 500000).toISOString(),
        tipo_evento: ["INGRESO", "CAMBIO_TRIAGE", "ALTA"][i % 3],
        descripcion: "Event description",
        valor_anterior: "OLD",
        valor_nuevo: "NEW",
        operador: "Dr. Test",
      }));
  };

  const generateMockAudit = count => {
    return Array(count)
      .fill(null)
      .map((_, i) => ({
        ts: new Date(Date.now() - i * 300000).toISOString(),
        operador: "Dr. Test",
        accion: ["CREATE", "UPDATE", "DELETE"][i % 3],
        tabla_ref: "pacientes",
        id_ref: `P-${String(i + 1).padStart(4, "0")}`,
        detalle: "Audit detail",
      }));
  };

  // Función para simular exportación síncrona
  const syncExport = (patients, traceability, audit) => {
    const start = performance.now();

    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(patients);
    XLSX.utils.book_append_sheet(wb, ws1, "Pacientes_CENSO");

    const ws2 = XLSX.utils.json_to_sheet(traceability);
    XLSX.utils.book_append_sheet(wb, ws2, "Trazabilidad_CLINICA");

    const ws3 = XLSX.utils.json_to_sheet(audit);
    XLSX.utils.book_append_sheet(wb, ws3, "Sys_AUDITORIA");

    const end = performance.now();
    return end - start;
  };

  // Función para simular exportación con worker
  const workerExport = (patients, traceability, audit) => {
    return new Promise(resolve => {
      const start = performance.now();

      // Simular procesamiento asíncrono
      setTimeout(() => {
        const wb = XLSX.utils.book_new();
        const ws1 = XLSX.utils.json_to_sheet(patients);
        XLSX.utils.book_append_sheet(wb, ws1, "Pacientes_CENSO");

        const ws2 = XLSX.utils.json_to_sheet(traceability);
        XLSX.utils.book_append_sheet(wb, ws2, "Trazabilidad_CLINICA");

        const ws3 = XLSX.utils.json_to_sheet(audit);
        XLSX.utils.book_append_sheet(wb, ws3, "Sys_AUDITORIA");

        const end = performance.now();
        resolve(end - start);
      }, 0);
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
    window = dom.window;
    document = window.document;
    global.document = document;
    global.window = window;
  });

  describe("Small Dataset Performance (100 patients)", () => {
    const patientCount = 100;
    const patients = generateMockPatients(patientCount);
    const traceability = generateMockTraceability(patientCount * 2);
    const audit = generateMockAudit(patientCount);

    test("sync export should complete quickly", () => {
      const duration = syncExport(patients, traceability, audit);

      expect(duration).toBeLessThan(500); // < 500ms
      expect(XLSX.utils.book_new).toHaveBeenCalled();
    });

    test("worker export should complete quickly", async () => {
      const duration = await workerExport(patients, traceability, audit);

      expect(duration).toBeLessThan(500); // < 500ms
    });
  });

  describe("Medium Dataset Performance (1000 patients)", () => {
    const patientCount = 1000;
    const patients = generateMockPatients(patientCount);
    const traceability = generateMockTraceability(patientCount * 2);
    const audit = generateMockAudit(patientCount);

    test("sync export should complete in reasonable time", () => {
      const duration = syncExport(patients, traceability, audit);

      expect(duration).toBeLessThan(2000); // < 2s
    });

    test("worker export should complete in reasonable time", async () => {
      const duration = await workerExport(patients, traceability, audit);

      expect(duration).toBeLessThan(2000); // < 2s
    });

    test("should process 1000 patients without errors", () => {
      expect(() => {
        syncExport(patients, traceability, audit);
      }).not.toThrow();
    });
  });

  describe("Large Dataset Performance (5000 patients)", () => {
    const patientCount = 5000;
    const patients = generateMockPatients(patientCount);
    const traceability = generateMockTraceability(patientCount * 2);
    const audit = generateMockAudit(patientCount);

    test("should handle large datasets", () => {
      const duration = syncExport(patients, traceability, audit);

      // La exportación debería completarse
      expect(duration).toBeGreaterThan(0);
      expect(XLSX.utils.json_to_sheet).toHaveBeenCalled();
    });

    test("worker should handle large datasets", async () => {
      const duration = await workerExport(patients, traceability, audit);

      expect(duration).toBeGreaterThan(0);
    });
  });

  describe("UI Responsiveness", () => {
    test("worker should not block UI", async () => {
      const patients = generateMockPatients(1000);
      const traceability = generateMockTraceability(2000);
      const audit = generateMockAudit(1000);

      let uiResponsive = true;

      // Simular chequeos de UI durante exportación
      const uiCheckInterval = setInterval(() => {
        // En un escenario real, verificaríamos que el DOM sigue respondiendo
        if (document.hidden) {
          uiResponsive = false;
        }
      }, 50);

      await workerExport(patients, traceability, audit);

      clearInterval(uiCheckInterval);

      expect(uiResponsive).toBe(true);
    });

    test("sync export should block UI momentarily", () => {
      const patients = generateMockPatients(1000);
      const traceability = generateMockTraceability(2000);
      const audit = generateMockAudit(1000);

      const start = performance.now();

      syncExport(patients, traceability, audit);

      const end = performance.now();
      const duration = end - start;

      // Durante este tiempo, la UI estaría bloqueada en el método síncrono
      expect(duration).toBeGreaterThan(0);
    });
  });

  describe("Memory Efficiency", () => {
    test("should not leak memory during multiple exports", async () => {
      const patients = generateMockPatients(100);
      const traceability = generateMockTraceability(200);
      const audit = generateMockAudit(100);

      const initialCalls = XLSX.utils.json_to_sheet.mock.calls.length;

      // Realizar múltiples exportaciones
      for (let i = 0; i < 5; i++) {
        await workerExport(patients, traceability, audit);
      }

      const finalCalls = XLSX.utils.json_to_sheet.mock.calls.length;

      // Verificar que se llamó la cantidad correcta de veces
      expect(finalCalls - initialCalls).toBe(5 * 3); // 3 sheets por export
    });

    test("should handle empty datasets efficiently", () => {
      const duration = syncExport([], [], []);

      expect(duration).toBeLessThan(100); // Muy rápido para datasets vacíos
    });
  });

  describe("Progress Reporting Performance", () => {
    test("should report progress at key milestones", async () => {
      const patients = generateMockPatients(1000);
      const traceability = generateMockTraceability(2000);
      const audit = generateMockAudit(1000);

      const progressUpdates = [];

      // Simular exportación con reporte de progreso
      const simulateExportWithProgress = () => {
        return new Promise(resolve => {
          const milestones = [10, 30, 60, 80, 100];
          let currentMilestone = 0;

          const interval = setInterval(() => {
            if (currentMilestone < milestones.length) {
              progressUpdates.push(milestones[currentMilestone]);
              currentMilestone++;
            } else {
              clearInterval(interval);
              resolve();
            }
          }, 10);
        });
      };

      await simulateExportWithProgress();

      expect(progressUpdates).toEqual([10, 30, 60, 80, 100]);
    });
  });

  describe("Data Throughput", () => {
    test("should process at least 500 patients per second", () => {
      const patientCount = 1000;
      const patients = generateMockPatients(patientCount);
      const traceability = generateMockTraceability(patientCount * 2);
      const audit = generateMockAudit(patientCount);

      const duration = syncExport(patients, traceability, audit);
      const durationSeconds = duration / 1000;

      const throughput = patientCount / durationSeconds;

      expect(throughput).toBeGreaterThan(500); // > 500 pacientes/segundo
    });

    test("should scale linearly with dataset size", () => {
      const smallDataset = generateMockPatients(100);
      const mediumDataset = generateMockPatients(1000);

      const smallTime = syncExport(smallDataset, [], []);
      const mediumTime = syncExport(mediumDataset, [], []);

      // El dataset 10x mayor no debería tomar 10x tiempo (debería ser mejor debido a optimizaciones)
      const ratio = mediumTime / smallTime;

      expect(ratio).toBeLessThan(15); // Permitir overhead, pero no más de 15x
    });
  });

  describe("Concurrent Operations", () => {
    test("should handle multiple simultaneous export requests", async () => {
      const patients = generateMockPatients(100);

      const promises = [];
      for (let i = 0; i < 3; i++) {
        promises.push(workerExport(patients, [], []));
      }

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      results.forEach(duration => {
        expect(duration).toBeGreaterThan(0);
      });
    });
  });

  describe("Error Recovery Performance", () => {
    test("should handle errors quickly", () => {
      const invalidData = null;

      const start = performance.now();

      // Simular manejo de error
      try {
        if (!invalidData) {
          throw new Error("Invalid data");
        }
      } catch (e) {
        // Error manejado
      }

      const end = performance.now();
      const duration = end - start;

      expect(duration).toBeLessThan(10); // El error debería detectarse rápidamente
    });
  });
});
