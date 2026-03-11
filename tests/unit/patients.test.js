/**
 * Patient Registration Module Unit Tests
 * Tests for patient registration, validation, updates, and search functionality
 */

import { JSDOM } from "jsdom";

describe("Patient Registration Module", () => {
  let document;
  let window;
  let app;
  let mockDB;
  let mockLocalStorage;

  // Mock patient data generator
  const generateMockPatient = (overrides = {}) => ({
    nombre: "Juan Pérez",
    nss: "12345678901",
    edad_estimada: 45,
    sexo: "M",
    discapacidad: null,
    triage_inicial: "VERDE",
    triage_actual: "VERDE",
    estado: "ACTIVO",
    procedencia: "URGENCIAS",
    area_actual: "OBSERVACION",
    telefono: "555-1234",
    contacto: "María Pérez - esposa",
    ...overrides,
  });

  beforeEach(() => {
    // Create fresh DOM environment
    const dom = new JSDOM(
      '<!DOCTYPE html><html><body>\
      <input id="perfil-nombre" />\
      <input id="perfil-nss" />\
      <input id="perfil-edad" />\
      <input id="perfil-sexo" />\
      <input id="perfil-discapacidad" />\
      <input id="search-input" />\
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
      auditoria: [],

      run: jest.fn((sql, params) => {
        // Parse INSERT INTO pacientes
        if (sql.includes("INSERT INTO pacientes")) {
          const patient = {
            id_interno: params[0],
            folio_local: params[1],
            nombre: params[2],
            triage_inicial: params[3],
            triage_actual: params[4],
            estado: params[5],
            ts_ingreso: params[6],
            operador_registro: params[7],
          };
          mockDB.patients.push(patient);
        }
        // Parse UPDATE pacientes
        if (sql.includes("UPDATE pacientes")) {
          const id = params[params.length - 1];
          const patient = mockDB.patients.find(p => p.id_interno === id);
          if (patient) {
            if (sql.includes("edad_estimada")) patient.edad_estimada = params[0];
            if (sql.includes("sexo")) patient.sexo = params[1];
            if (sql.includes("nss")) patient.nss = params[2];
            if (sql.includes("discapacidad")) patient.discapacidad = params[3];
            if (sql.includes("ts_ultima_mod")) patient.ts_ultima_mod = params[4];
            if (sql.includes("triage_actual")) patient.triage_actual = params[0];
          }
        }
      }),

      prepare: jest.fn(sql => {
        const statements = {
          "SELECT count(*) as total FROM pacientes": {
            step: () => {
              statements.count = 1;
              return true;
            },
            getAsObject: () => ({ total: mockDB.patients.length }),
            bind: jest.fn(),
            free: jest.fn(),
            count: 0,
          },
          "SELECT * FROM pacientes WHERE folio_local = ?": {
            step: jest.fn(function () {
              return this.idx < mockDB.patients.length;
            }),
            getAsObject: jest.fn(function () {
              const folio = this.boundFolio;
              return mockDB.patients.find(p => p.folio_local === folio) || null;
            }),
            bind: jest.fn(function (folio) {
              this.boundFolio = folio;
            }),
            free: jest.fn(),
            idx: 0,
            boundFolio: null,
          },
          "SELECT * FROM pacientes WHERE id_interno = ?": {
            step: jest.fn(function () {
              return this.idx < 1;
            }),
            getAsObject: jest.fn(function () {
              return mockDB.patients.find(p => p.id_interno === this.boundId) || null;
            }),
            bind: jest.fn(function (id) {
              this.boundId = id;
            }),
            free: jest.fn(),
            idx: 0,
            boundId: null,
          },
          "SELECT * FROM pacientes WHERE nombre LIKE ?": {
            step: jest.fn(function () {
              return this.idx < mockDB.patients.length;
            }),
            getAsObject: jest.fn(function () {
              const term = this.boundTerm?.replace(/%/g, "").toLowerCase() || "";
              return (
                mockDB.patients.find(p => p.nombre && p.nombre.toLowerCase().includes(term)) || null
              );
            }),
            bind: jest.fn(function (term) {
              this.boundTerm = term;
            }),
            free: jest.fn(),
            idx: 0,
            boundTerm: null,
          },
        };

        // Return default statement for unknown queries
        return (
          statements[sql] || {
            step: jest.fn(() => false),
            getAsObject: jest.fn(() => ({})),
            bind: jest.fn(),
            free: jest.fn(),
          }
        );
      }),

      exec: jest.fn(),
    };

    // Create app object with patient methods
    app = {
      db: mockDB,
      session: {
        hospital: "Test Hospital",
        operador: "Dr. Test",
        rol: "MEDICO",
        ingreso: new Date().toISOString(),
      },
      saveTimeout: null,
      saveThrottleMs: 2000,

      audit: jest.fn((accion, tabla, id_ref, detalle) => {
        mockDB.auditoria.push({
          ts: new Date().toISOString(),
          operador: app.session.operador,
          accion,
          tabla_ref: tabla,
          id_ref,
          detalle,
        });
      }),

      generateUUID() {
        // Generate proper UUID v4 format
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      },

      generateFolio(count) {
        return "P-" + (count + 1).toString().padStart(3, "0");
      },

      saveToIndexedDB: jest.fn(() => {
        if (app.saveTimeout) clearTimeout(app.saveTimeout);
        app.saveTimeout = setTimeout(() => {
          // Mock save
        }, app.saveThrottleMs);
      }),

      registerPatient(patientData) {
        // Validate required fields
        if (!patientData || typeof patientData !== "object") {
          throw new Error("Datos del paciente son requeridos");
        }

        // Generate folio
        const count = mockDB.patients.length;
        const folio = this.generateFolio(count);

        // Generate UUID
        const id_interno = this.generateUUID();

        // Validate age range (0-150)
        const edad = patientData.edad_estimada;
        if (edad !== null && edad !== undefined && edad !== "") {
          if (edad < 0 || edad > 150) {
            throw new Error("Edad debe estar entre 0 y 150 años");
          }
        }

        // Validate sex enum
        const sexo = patientData.sexo;
        if (sexo && sexo !== "" && !["M", "F", "I"].includes(sexo)) {
          throw new Error("Sexo debe ser M, F o I");
        }

        // Set default triage if not provided
        const triage = patientData.triage_inicial || "VERDE";

        // Create patient record
        const newPatient = {
          id_interno,
          folio_local: folio,
          nombre: patientData.nombre || "NN",
          nss: patientData.nss || null,
          edad_estimada: edad || null,
          sexo: sexo || null,
          discapacidad: patientData.discapacidad || null,
          triage_inicial: triage,
          triage_actual: triage,
          estado: "ACTIVO",
          procedencia: patientData.procedencia || null,
          area_actual: patientData.area_actual || null,
          telefono: patientData.telefono || null,
          contacto: patientData.contacto || null,
          ts_ingreso: new Date().toISOString(),
          ts_ultima_mod: null,
          operador_registro: this.session.operador,
        };

        // Insert into DB
        this.db.run(
          "INSERT INTO pacientes (id_interno, folio_local, nombre, triage_inicial, triage_actual, estado, ts_ingreso, operador_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            newPatient.id_interno,
            newPatient.folio_local,
            newPatient.nombre,
            newPatient.triage_inicial,
            newPatient.triage_actual,
            newPatient.estado,
            newPatient.ts_ingreso,
            newPatient.operador_registro,
          ]
        );

        // Audit the registration
        this.audit("CREATE", "pacientes", folio, `Ingreso nuevo paciente triage ${triage}`);

        // Trigger save with throttling
        this.saveToIndexedDB();

        return newPatient;
      },

      updatePatient(id_interno, updates) {
        const patient = mockDB.patients.find(p => p.id_interno === id_interno);
        if (!patient) {
          throw new Error("Paciente no encontrado");
        }

        // Validate updates
        if (updates.edad_estimada !== undefined) {
          if (updates.edad_estimada < 0 || updates.edad_estimada > 150) {
            throw new Error("Edad debe estar entre 0 y 150 años");
          }
        }

        if (updates.sexo !== undefined && updates.sexo !== null && updates.sexo !== "") {
          if (!["M", "F", "I"].includes(updates.sexo)) {
            throw new Error("Sexo debe ser M, F o I");
          }
        }

        // Apply updates
        Object.keys(updates).forEach(key => {
          if (updates[key] !== undefined && patient.hasOwnProperty(key)) {
            patient[key] = updates[key];
          }
        });

        patient.ts_ultima_mod = new Date().toISOString();

        // Update in DB
        this.db.run(
          "UPDATE pacientes SET edad_estimada=?, sexo=?, nss=?, discapacidad=?, ts_ultima_mod=? WHERE id_interno=?",
          [
            updates.edad_estimada,
            updates.sexo,
            updates.nss,
            updates.discapacidad,
            patient.ts_ultima_mod,
            id_interno,
          ]
        );

        this.audit("UPDATE", "pacientes", patient.folio_local, "Perfil demográfico actualizado");

        return patient;
      },

      deletePatient(id_interno) {
        const patient = mockDB.patients.find(p => p.id_interno === id_interno);
        if (!patient) {
          throw new Error("Paciente no encontrado");
        }

        // Soft delete - mark as deleted
        patient.estado = "ELIMINADO";
        patient.ts_ultima_mod = new Date().toISOString();

        this.audit("DELETE", "pacientes", patient.folio_local, "Paciente marcado como eliminado");

        return true;
      },

      searchPatient(term) {
        if (!term || term.trim() === "") {
          throw new Error("Término de búsqueda requerido");
        }

        // Search by folio (exact match)
        const byFolio = mockDB.patients.find(
          p => p.folio_local && p.folio_local.toLowerCase() === term.toLowerCase()
        );

        if (byFolio) return byFolio;

        // Search by nombre (partial match)
        const byNombre = mockDB.patients.find(
          p => p.nombre && p.nombre.toLowerCase().includes(term.toLowerCase())
        );

        return byNombre || null;
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockDB.patients = [];
    mockDB.auditoria = [];
  });

  describe("registerPatient() tests", () => {
    test("registerPatient() generates unique folio", () => {
      // Arrange
      const patientData = generateMockPatient();

      // Act
      const patient1 = app.registerPatient(patientData);
      const patient2 = app.registerPatient({ ...patientData, nombre: "Another Patient" });

      // Assert
      expect(patient1.folio_local).toBe("P-001");
      expect(patient2.folio_local).toBe("P-002");
      expect(patient1.folio_local).not.toBe(patient2.folio_local);
    });

    test("registerPatient() inserts into database", () => {
      // Arrange
      const patientData = generateMockPatient();

      // Act
      const patient = app.registerPatient(patientData);

      // Assert
      expect(mockDB.run).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO pacientes"),
        expect.any(Array)
      );
      expect(mockDB.patients).toContainEqual(
        expect.objectContaining({ id_interno: patient.id_interno })
      );
    });

    test("registerPatient() audits registration", () => {
      // Arrange
      const patientData = generateMockPatient({ triage_inicial: "ROJO" });

      // Act
      app.registerPatient(patientData);

      // Assert
      expect(app.audit).toHaveBeenCalledWith(
        "CREATE",
        "pacientes",
        expect.stringContaining("P-"),
        expect.stringContaining("Ingreso nuevo paciente triage ROJO")
      );
    });

    test("registerPatient() validates required fields", () => {
      // Arrange
      const invalidData = null;

      // Act & Assert
      expect(() => {
        app.registerPatient(invalidData);
      }).toThrow("Datos del paciente son requeridos");
    });

    test("registerPatient() sets default triage when not provided", () => {
      // Arrange
      const patientData = generateMockPatient({ triage_inicial: undefined });

      // Act
      const patient = app.registerPatient(patientData);

      // Assert
      expect(patient.triage_inicial).toBe("VERDE");
      expect(patient.triage_actual).toBe("VERDE");
    });

    test("registerPatient() generates valid UUID", () => {
      // Arrange
      const patientData = generateMockPatient();

      // Act
      const patient = app.registerPatient(patientData);

      // Assert
      // UUID v4 pattern: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(patient.id_interno).toMatch(uuidPattern);
    });

    test("registerPatient() validates age range (0-150)", () => {
      // Arrange
      const patientData = generateMockPatient({ edad_estimada: 200 });

      // Act & Assert
      expect(() => {
        app.registerPatient(patientData);
      }).toThrow("Edad debe estar entre 0 y 150 años");
    });

    test("registerPatient() rejects negative age", () => {
      // Arrange
      const patientData = generateMockPatient({ edad_estimada: -5 });

      // Act & Assert
      expect(() => {
        app.registerPatient(patientData);
      }).toThrow("Edad debe estar entre 0 y 150 años");
    });

    test("registerPatient() validates sex enum (M, F, I)", () => {
      // Arrange
      const patientData = generateMockPatient({ sexo: "X" });

      // Act & Assert
      expect(() => {
        app.registerPatient(patientData);
      }).toThrow("Sexo debe ser M, F o I");
    });

    test("registerPatient() stores operator from session", () => {
      // Arrange
      app.session.operador = "Dr. House";
      const patientData = generateMockPatient();

      // Act
      const patient = app.registerPatient(patientData);

      // Assert
      expect(patient.operador_registro).toBe("Dr. House");
    });

    test("registerPatient() triggers save with throttling", () => {
      // Arrange
      const patientData = generateMockPatient();

      // Act
      app.registerPatient(patientData);

      // Assert
      expect(app.saveToIndexedDB).toHaveBeenCalled();
    });
  });

  describe("updatePatient() tests", () => {
    test("updatePatient() modifies existing patient record", () => {
      // Arrange
      const patientData = generateMockPatient();
      const patient = app.registerPatient(patientData);
      const updates = { edad_estimada: 50, sexo: "F" };

      // Act
      const updated = app.updatePatient(patient.id_interno, updates);

      // Assert
      expect(updated.edad_estimada).toBe(50);
      expect(updated.sexo).toBe("F");
    });

    test("updatePatient() validates age changes", () => {
      // Arrange
      const patientData = generateMockPatient();
      const patient = app.registerPatient(patientData);
      const invalidUpdates = { edad_estimada: 200 };

      // Act & Assert
      expect(() => {
        app.updatePatient(patient.id_interno, invalidUpdates);
      }).toThrow("Edad debe estar entre 0 y 150 años");
    });
  });

  describe("deletePatient() tests", () => {
    test("deletePatient() marks patient as deleted", () => {
      // Arrange
      const patientData = generateMockPatient();
      const patient = app.registerPatient(patientData);

      // Act
      app.deletePatient(patient.id_interno);

      // Assert - check the patient in the database
      const deletedPatient = mockDB.patients.find(p => p.id_interno === patient.id_interno);
      expect(deletedPatient.estado).toBe("ELIMINADO");
    });

    test("deletePatient() audits deletion", () => {
      // Arrange
      const patientData = generateMockPatient();
      const patient = app.registerPatient(patientData);

      // Act
      app.deletePatient(patient.id_interno);

      // Assert
      expect(app.audit).toHaveBeenCalledWith(
        "DELETE",
        "pacientes",
        patient.folio_local,
        "Paciente marcado como eliminado"
      );
    });
  });

  describe("searchPatient() tests", () => {
    test("searchPatient() finds by folio", () => {
      // Arrange
      const patientData = generateMockPatient();
      const patient = app.registerPatient(patientData);

      // Act
      const found = app.searchPatient(patient.folio_local);

      // Assert
      expect(found).toBeTruthy();
      expect(found.folio_local).toBe(patient.folio_local);
    });

    test("searchPatient() finds by name", () => {
      // Arrange
      const patientData = generateMockPatient({ nombre: "María González" });
      const patient = app.registerPatient(patientData);

      // Act
      const found = app.searchPatient("María");

      // Assert
      expect(found).toBeTruthy();
      expect(found.nombre).toContain("María");
    });

    test("searchPatient() returns null for non-existent patient", () => {
      // Arrange
      const patientData = generateMockPatient();
      app.registerPatient(patientData);

      // Act
      const found = app.searchPatient("NonExistent");

      // Assert
      expect(found).toBeNull();
    });
  });
});
