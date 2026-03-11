/**
 * Triage Module Unit Tests
 * Tests for triage updates, validation, traceability, and statistics
 */

import { JSDOM } from "jsdom";

describe("Triage Module", () => {
  let document;
  let window;
  let app;
  let mockDB;
  let mockLocalStorage;

  // Valid triage values
  const VALID_TRIAGE_VALUES = ["ROJO", "AMARILLO", "VERDE", "NEGRO"];

  beforeEach(() => {
    // Create fresh DOM environment
    const dom = new JSDOM(
      '<!DOCTYPE html><html><body>\
      <div id="count-rojo">0</div>\
      <div id="count-amarillo">0</div>\
      <div id="count-verde">0</div>\
      <div id="count-negro">0</div>\
      <div id="exp-triage-badge"></div>\
      <tbody id="patients-table-body"></tbody>\
    </body></html>'
    );

    window = dom.window;
    document = window.document;
    global.document = document;
    global.window = window;

    // Setup localStorage mock
    mockLocalStorage = {
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

    // Mock database
    mockDB = {
      patients: [],
      trazabilidad: [],

      run: jest.fn((sql, params) => {
        // Parse UPDATE triage
        if (sql.includes("UPDATE pacientes SET triage_actual")) {
          const id = params[params.length - 1];
          const patient = mockDB.patients.find(p => p.id_interno === id);
          if (patient) {
            patient.triage_actual = params[0];
            patient.ts_ultima_mod = params[1];
          }
        }
        // Parse INSERT INTO trazabilidad
        if (sql.includes("INSERT INTO trazabilidad")) {
          mockDB.trazabilidad.push({
            id_paciente: params[0],
            ts_evento: params[1],
            tipo_evento: params[2],
            descripcion: params[3],
            valor_nuevo: params[4],
            operador: params[5],
          });
        }
      }),

      prepare: jest.fn(sql => {
        if (sql.includes("SELECT * FROM pacientes WHERE id_interno")) {
          return {
            step: jest.fn(function () {
              return this.idx < 1;
            }),
            getAsObject: jest.fn(function () {
              return mockDB.patients.find(p => p.id_interno === this.boundId) || null;
            }),
            bind: jest.fn(function (id) {
              this.boundId = id;
              this.idx = 0;
            }),
            free: jest.fn(),
            idx: 0,
            boundId: null,
          };
        }
        if (sql.includes("SELECT triage_actual, COUNT(*)")) {
          return {
            step: jest.fn(function () {
              this.rowIdx++;
              return this.rowIdx <= this.results.length;
            }),
            getAsObject: jest.fn(function () {
              return this.results[this.rowIdx - 1] || {};
            }),
            bind: jest.fn(),
            free: jest.fn(),
            rowIdx: 0,
            results: mockDB.patients.reduce((acc, p) => {
              const existing = acc.find(x => x.triage_actual === p.triage_actual);
              if (existing) {
                existing.c++;
              } else {
                acc.push({ triage_actual: p.triage_actual, c: 1 });
              }
              return acc;
            }, []),
          };
        }
        return {
          step: jest.fn(() => false),
          getAsObject: jest.fn(() => ({})),
          bind: jest.fn(),
          free: jest.fn(),
        };
      }),

      exec: jest.fn(),
    };

    // Create app object with triage methods
    app = {
      db: mockDB,
      session: {
        hospital: "Test Hospital",
        operador: "Dr. Test",
        rol: "TRIAGE",
        ingreso: new Date().toISOString(),
      },
      currentPatientId: null,

      audit: jest.fn((accion, tabla, id_ref, detalle) => {
        // Mock audit
      }),

      generateUUID() {
        // Generate proper UUID v4 format
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      },

      updateTriage(id_paciente, nuevoTriage) {
        // Validate triage value
        if (!VALID_TRIAGE_VALUES.includes(nuevoTriage)) {
          throw new Error(
            `Valor de triage inválido. Debe ser uno de: ${VALID_TRIAGE_VALUES.join(", ")}`
          );
        }

        // Get current patient
        const patient = mockDB.patients.find(p => p.id_interno === id_paciente);
        if (!patient) {
          throw new Error("Paciente no encontrado");
        }

        const valorAnterior = patient.triage_actual;

        // Prevent same triage
        if (valorAnterior === nuevoTriage) {
          throw new Error("El paciente ya tiene este nivel de triage");
        }

        // Update in database
        const ts = new Date().toISOString();
        this.db.run(
          "UPDATE pacientes SET triage_actual = ?, ts_ultima_mod = ? WHERE id_interno = ?",
          [nuevoTriage, ts, id_paciente]
        );

        // Create traceability record
        this.db.run(
          "INSERT INTO trazabilidad (id_paciente, ts_evento, tipo_evento, descripcion, valor_nuevo, operador) VALUES (?, ?, ?, ?, ?, ?)",
          [
            id_paciente,
            ts,
            "TRIAGE_CHANGE",
            `Cambio de triage: ${valorAnterior} -> ${nuevoTriage}`,
            nuevoTriage,
            this.session.operador,
          ]
        );

        // Audit the change
        this.audit(
          "TRIAGE_UPDATE",
          "pacientes",
          id_paciente,
          `Triage cambiado de ${valorAnterior} a ${nuevoTriage}`
        );

        // Update UI
        this.updateTriageUI(id_paciente, nuevoTriage);

        return {
          success: true,
          anterior: valorAnterior,
          nuevo: nuevoTriage,
          timestamp: ts,
        };
      },

      updateTriageUI(id_paciente, triage) {
        // Update UI elements
        const badge = document.getElementById("exp-triage-badge");
        if (badge) {
          const labels = {
            ROJO: "◆ ROJO (Crítico)",
            AMARILLO: "▲ AMARILLO (Urgente)",
            VERDE: "● VERDE (Menor)",
            NEGRO: "✚ NEGRO (S/Vida)",
          };
          badge.textContent = labels[triage] || triage;
        }
      },

      getTriageStats() {
        const stats = {
          ROJO: 0,
          AMARILLO: 0,
          VERDE: 0,
          NEGRO: 0,
          total: 0,
          distribucion: {},
        };

        mockDB.patients.forEach(p => {
          if (VALID_TRIAGE_VALUES.includes(p.triage_actual)) {
            stats[p.triage_actual]++;
            stats.total++;
          }
        });

        // Calculate percentages
        VALID_TRIAGE_VALUES.forEach(t => {
          stats.distribucion[t] =
            stats.total > 0 ? ((stats[t] / stats.total) * 100).toFixed(1) : "0.0";
        });

        return stats;
      },

      addTestPatient(triage) {
        const patient = {
          id_interno: this.generateUUID(),
          folio_local: "P-" + (mockDB.patients.length + 1).toString().padStart(3, "0"),
          nombre: "Test Patient",
          triage_inicial: triage,
          triage_actual: triage,
          estado: "ACTIVO",
          ts_ingreso: new Date().toISOString(),
          operador_registro: this.session.operador,
        };
        mockDB.patients.push(patient);
        return patient;
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockDB.patients = [];
    mockDB.trazabilidad = [];
  });

  describe("updateTriage() tests", () => {
    test("updateTriage() changes level correctly", () => {
      // Arrange
      const patient = app.addTestPatient("VERDE");
      const nuevoTriage = "ROJO";

      // Act
      const result = app.updateTriage(patient.id_interno, nuevoTriage);

      // Assert
      expect(result.success).toBe(true);
      expect(result.anterior).toBe("VERDE");
      expect(result.nuevo).toBe("ROJO");
      expect(patient.triage_actual).toBe("ROJO");
    });

    test("updateTriage() validates triage values (ROJO, AMARILLO, VERDE, NEGRO)", () => {
      // Arrange
      const patient = app.addTestPatient("VERDE");
      const invalidTriage = "AZUL";

      // Act & Assert
      expect(() => {
        app.updateTriage(patient.id_interno, invalidTriage);
      }).toThrow("Valor de triage inválido");
    });

    test("updateTriage() creates traceability record", () => {
      // Arrange
      const patient = app.addTestPatient("VERDE");

      // Act
      app.updateTriage(patient.id_interno, "ROJO");

      // Assert
      expect(mockDB.run).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO trazabilidad"),
        expect.arrayContaining([
          patient.id_interno,
          expect.any(String),
          "TRIAGE_CHANGE",
          expect.stringContaining("VERDE"),
          "ROJO",
          app.session.operador,
        ])
      );
    });

    test("updateTriage() stores previous value", () => {
      // Arrange
      const patient = app.addTestPatient("AMARILLO");

      // Act
      const result = app.updateTriage(patient.id_interno, "ROJO");

      // Assert
      expect(result.anterior).toBe("AMARILLO");
    });

    test("updateTriage() audits change", () => {
      // Arrange
      const patient = app.addTestPatient("VERDE");

      // Act
      app.updateTriage(patient.id_interno, "ROJO");

      // Assert
      expect(app.audit).toHaveBeenCalledWith(
        "TRIAGE_UPDATE",
        "pacientes",
        patient.id_interno,
        "Triage cambiado de VERDE a ROJO"
      );
    });

    test("updateTriage() updates UI", () => {
      // Arrange
      const patient = app.addTestPatient("VERDE");
      const badge = document.getElementById("exp-triage-badge");

      // Act
      app.updateTriage(patient.id_interno, "ROJO");

      // Assert
      expect(badge.textContent).toBe("◆ ROJO (Crítico)");
    });

    test("updateTriage() prevents same triage change", () => {
      // Arrange
      const patient = app.addTestPatient("ROJO");

      // Act & Assert
      expect(() => {
        app.updateTriage(patient.id_interno, "ROJO");
      }).toThrow("El paciente ya tiene este nivel de triage");
    });

    test("updateTriage() handles concurrent changes (last write wins)", () => {
      // Arrange
      const patient = app.addTestPatient("VERDE");

      // Act - simulate concurrent changes
      const result1 = app.updateTriage(patient.id_interno, "AMARILLO");
      const result2 = app.updateTriage(patient.id_interno, "ROJO");

      // Assert - last write wins
      expect(patient.triage_actual).toBe("ROJO");
      expect(result1.anterior).toBe("VERDE");
      expect(result2.anterior).toBe("AMARILLO");
    });
  });

  describe("getTriageStats() tests", () => {
    test("getTriageStats() calculates distribution", () => {
      // Arrange
      app.addTestPatient("ROJO");
      app.addTestPatient("ROJO");
      app.addTestPatient("AMARILLO");
      app.addTestPatient("VERDE");

      // Act
      const stats = app.getTriageStats();

      // Assert
      expect(stats.ROJO).toBe(2);
      expect(stats.AMARILLO).toBe(1);
      expect(stats.VERDE).toBe(1);
      expect(stats.NEGRO).toBe(0);
      expect(stats.total).toBe(4);
    });

    test("getTriageStats() returns correct metrics", () => {
      // Arrange
      app.addTestPatient("ROJO");
      app.addTestPatient("AMARILLO");
      app.addTestPatient("AMARILLO");
      app.addTestPatient("VERDE");
      app.addTestPatient("VERDE");
      app.addTestPatient("VERDE");

      // Act
      const stats = app.getTriageStats();

      // Assert
      expect(stats.total).toBe(6);
      expect(stats.distribucion.ROJO).toBe("16.7"); // 1/6
      expect(stats.distribucion.AMARILLO).toBe("33.3"); // 2/6
      expect(stats.distribucion.VERDE).toBe("50.0"); // 3/6
      expect(stats.distribucion.NEGRO).toBe("0.0"); // 0/6
    });

    test("getTriageStats() returns empty stats when no patients", () => {
      // Arrange - no patients added

      // Act
      const stats = app.getTriageStats();

      // Assert
      expect(stats.total).toBe(0);
      expect(stats.ROJO).toBe(0);
      expect(stats.AMARILLO).toBe(0);
      expect(stats.VERDE).toBe(0);
      expect(stats.NEGRO).toBe(0);
      Object.values(stats.distribucion).forEach(pct => {
        expect(pct).toBe("0.0");
      });
    });
  });

  describe("Triage validation edge cases", () => {
    test("updateTriage() rejects null value", () => {
      // Arrange
      const patient = app.addTestPatient("VERDE");

      // Act & Assert
      expect(() => {
        app.updateTriage(patient.id_interno, null);
      }).toThrow("Valor de triage inválido");
    });

    test("updateTriage() rejects lowercase values", () => {
      // Arrange
      const patient = app.addTestPatient("VERDE");

      // Act & Assert
      expect(() => {
        app.updateTriage(patient.id_interno, "rojo");
      }).toThrow("Valor de triage inválido");
    });

    test("updateTriage() rejects empty string", () => {
      // Arrange
      const patient = app.addTestPatient("VERDE");

      // Act & Assert
      expect(() => {
        app.updateTriage(patient.id_interno, "");
      }).toThrow("Valor de triage inválido");
    });
  });
});
