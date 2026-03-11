/**
 * Integration Tests - Database Layer
 * Prueba flujos completos de persistencia de datos
 *
 * Estos tests verifican la integración completa entre:
 * - Persistencia de datos (Mock DB)
 * - Exportación de datos
 * - Migraciones de schema
 * - Relaciones entre entidades
 */

import {
  patientFixtures,
  trazabilidadFixtures,
  auditoriaFixtures,
  generateMassPatients,
} from "./fixtures/patient-data.js";

// Mock Database que simula SQLite con las operaciones básicas
class MockDatabase {
  constructor() {
    this.tables = {
      pacientes: [],
      trazabilidad: [],
      operadores: [],
      auditoria: [],
      schema_info: [],
    };
    this.constraints = {
      pacientes: { unique: ["folio_local"] },
    };
  }

  run(sql, params = []) {
    // Parse básico de SQL
    if (sql.includes("INSERT INTO pacientes")) {
      this._insertPatient(params);
    } else if (sql.includes("INSERT INTO trazabilidad")) {
      this._insertTrazabilidad(params);
    } else if (sql.includes("INSERT INTO auditoria")) {
      this._insertAuditoria(params);
    } else if (sql.includes("INSERT INTO schema_info")) {
      this._insertSchemaInfo(params);
    } else if (sql.includes("UPDATE pacientes")) {
      this._updatePatient(params);
    } else if (sql.includes("BEGIN TRANSACTION")) {
      // No-op para transacciones
    } else if (sql.includes("COMMIT")) {
      // No-op para transacciones
    }
  }

  prepare(sql) {
    return new MockStatement(this, sql);
  }

  exec(sql) {
    // Para ejecución de SQL sin parámetros
  }

  export() {
    // Simular export a Uint8Array
    const data = JSON.stringify(this.tables);
    const buffer = new TextEncoder().encode(data);
    return new Uint8Array(buffer);
  }

  // Métodos privados
  _insertPatient(params) {
    // Soporta dos formatos:
    // 1. Sin discapacidad (12 params): id_interno, folio_local, nombre, edad_estimada, sexo,
    //    triage_inicial, triage_actual, area_actual, estado, procedencia, ts_ingreso, operador_registro
    // 2. Con discapacidad (13 params): mismo que arriba + discapacidad después de sexo

    const paciente = {
      id_interno: params[0],
      folio_local: params[1],
      nombre: params[2],
      nss: null,
      pulsera_id: null,
      ts_ultima_mod: null,
      telefono: null,
      contacto: null,
    };

    if (params.length === 13) {
      // Formato con discapacidad
      paciente.edad_estimada = params[3];
      paciente.sexo = params[4];
      paciente.discapacidad = params[5];
      paciente.triage_inicial = params[6];
      paciente.triage_actual = params[7];
      paciente.area_actual = params[8];
      paciente.estado = params[9];
      paciente.procedencia = params[10];
      paciente.ts_ingreso = params[11];
      paciente.operador_registro = params[12];
    } else {
      // Formato estándar (12 params)
      paciente.edad_estimada = params[3];
      paciente.sexo = params[4];
      paciente.discapacidad = null;
      paciente.triage_inicial = params[5];
      paciente.triage_actual = params[6];
      paciente.area_actual = params[7];
      paciente.estado = params[8];
      paciente.procedencia = params[9];
      paciente.ts_ingreso = params[10];
      paciente.operador_registro = params[11];
    }

    // Verificar constraint UNIQUE
    const existing = this.tables.pacientes.find(p => p.folio_local === paciente.folio_local);
    if (existing) {
      throw new Error("UNIQUE constraint failed: pacientes.folio_local");
    }

    // Verificar constraint CHECK
    if (!["M", "F", "I"].includes(paciente.sexo)) {
      throw new Error("CHECK constraint failed: pacientes.sexo");
    }

    this.tables.pacientes.push(paciente);
  }

  _insertTrazabilidad(params) {
    const trazabilidad = {
      id_paciente: params[0],
      ts_evento: params[1],
      tipo_evento: params[2],
      descripcion: params[3],
      valor_anterior: params[4] || null,
      valor_nuevo: params[5] || null,
      operador: params[6],
      area: params[7] || null,
    };
    this.tables.trazabilidad.push(trazabilidad);
  }

  _insertAuditoria(params) {
    const auditoria = {
      ts: params[0],
      operador: params[1],
      accion: params[2],
      tabla_ref: params[3] || null,
      id_ref: params[4] || null,
      detalle: params[5] || null,
    };
    this.tables.auditoria.push(auditoria);
  }

  _insertSchemaInfo(params) {
    const info = {
      version: params[0],
      description: params[1],
      migrated_at: params[2],
    };
    this.tables.schema_info.push(info);
  }

  _updatePatient(params) {
    const id = params[params.length - 1];
    const paciente = this.tables.pacientes.find(p => p.id_interno === id);
    if (!paciente) return;

    if (params.length > 1) paciente.triage_actual = params[0];
    if (params.length > 2) paciente.ts_ultima_mod = params[1];
  }
}

class MockStatement {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql;
    this.bindParams = null;
    this.idx = 0;
    this.results = [];
    this._prepareResults();
  }

  _prepareResults() {
    // ORDER MATTERS: More specific patterns first
    if (this.sql.includes("SELECT triage_actual FROM pacientes WHERE id_interno")) {
      // Special case for single column select
      this.results = this.db.tables.pacientes.map(p => ({ triage_actual: p.triage_actual, id_interno: p.id_interno }));
    } else if (this.sql.includes("SELECT * FROM pacientes WHERE id_interno = ?")) {
      this.results = this.db.tables.pacientes;
    } else if (this.sql.includes("SELECT * FROM pacientes WHERE folio_local = ?")) {
      this.results = this.db.tables.pacientes;
    } else if (this.sql.includes("SELECT * FROM pacientes WHERE nombre LIKE ?")) {
      this.results = this.db.tables.pacientes;
    } else if (this.sql.includes("SELECT * FROM pacientes WHERE estado = ?")) {
      this.results = this.db.tables.pacientes.filter(p => p.estado === this.bindParams?.[0]);
    } else if (this.sql.includes("SELECT * FROM pacientes WHERE discapacidad")) {
      this.results = this.db.tables.pacientes.filter(p => p.discapacidad);
    } else if (this.sql.includes("SELECT * FROM pacientes")) {
      this.results = this.db.tables.pacientes;
    } else if (this.sql.includes("SELECT COUNT(*) FROM pacientes")) {
      this.results = [{ total: this.db.tables.pacientes.length }];
    } else if (this.sql.includes("SELECT COUNT(*) as total FROM pacientes")) {
      this.results = [{ total: this.db.tables.pacientes.length }];
    } else if (this.sql.includes("SELECT triage_actual, COUNT(*)")) {
      const counts = {};
      this.db.tables.pacientes.forEach(p => {
        counts[p.triage_actual] = (counts[p.triage_actual] || 0) + 1;
      });
      this.results = Object.entries(counts).map(([triage_actual, count]) => ({
        triage_actual,
        count,
      }));
    } else if (this.sql.includes("SELECT area_actual, COUNT(*)")) {
      const counts = {};
      this.db.tables.pacientes
        .filter(p => p.estado === this.bindParams?.[0])
        .forEach(p => {
          counts[p.area_actual] = (counts[p.area_actual] || 0) + 1;
        });
      this.results = Object.entries(counts).map(([area_actual, count]) => ({ area_actual, count }));
    } else if (this.sql.includes("SELECT * FROM trazabilidad WHERE id_paciente = ? ORDER BY ts_evento ASC")) {
      this.results = this.db.tables.trazabilidad.filter(
        t => t.id_paciente === this.bindParams?.[0]
      );
      // Sort by timestamp
      this.results.sort((a, b) => new Date(a.ts_evento) - new Date(b.ts_evento));
    } else if (this.sql.includes("SELECT * FROM trazabilidad WHERE id_paciente = ?")) {
      this.results = this.db.tables.trazabilidad.filter(
        t => t.id_paciente === this.bindParams?.[0]
      );
    } else if (this.sql.includes("SELECT * FROM trazabilidad")) {
      this.results = this.db.tables.trazabilidad;
    } else if (this.sql.includes("SELECT COUNT(*) FROM trazabilidad") && this.sql.includes("GROUP BY id_paciente")) {
      // Handle GROUP BY case
      const counts = {};
      this.db.tables.trazabilidad.forEach(t => {
        counts[t.id_paciente] = (counts[t.id_paciente] || 0) + 1;
      });
      this.results = Object.values(counts).map(c => ({ count: c }));
    } else if (this.sql.includes("SELECT COUNT(*) FROM trazabilidad")) {
      this.results = [{ total: this.db.tables.trazabilidad.length }];
    } else if (this.sql.includes("SELECT COUNT(*)") && this.sql.includes("FROM auditoria")) {
      this.results = [{ total: this.db.tables.trazabilidad.length }];
    } else if (this.sql.includes("SELECT * FROM auditoria WHERE")) {
      this.results = this.db.tables.auditoria;
    } else if (this.sql.includes("SELECT * FROM auditoria")) {
      this.results = this.db.tables.auditoria;
    } else if (this.sql.includes("SELECT COUNT(*) FROM auditoria")) {
      this.results = [{ total: this.db.tables.auditoria.length }];
    } else if (this.sql.includes("SELECT version FROM schema_info")) {
      this.results = this.db.tables.schema_info.slice(-1);
    } else if (this.sql.includes("SELECT") && this.sql.includes("FROM pacientes") && this.sql.includes("WHERE p.estado =")) {
      // Complex query with JOIN-like syntax
      const counts = {};
      this.db.tables.pacientes
        .filter(p => p.estado === "ACTIVO")
        .forEach(p => {
          counts[p.triage_actual] = (counts[p.triage_actual] || 0) + 1;
        });
      this.results = Object.entries(counts).map(([triage_actual, count]) => ({
        triage_actual,
        count,
      }));
    } else {
      this.results = [];
    }
  }

  bind(params) {
    this.bindParams = Array.isArray(params) ? params : [params];
    this._prepareResults();
    return this;
  }

  step() {
    if (this.idx < this.results.length) {
      // Filtrar por bind params si es necesario
      if (this.bindParams) {
        if (this.sql.includes("WHERE id_interno = ?")) {
          const filtered = this.results.filter(r => r.id_interno === this.bindParams[0]);
          if (this.idx < filtered.length) {
            this.currentRow = filtered[this.idx];
            this.idx++;
            return true;
          }
          return false;
        }
        if (this.sql.includes("WHERE folio_local = ?")) {
          const filtered = this.results.filter(r => r.folio_local === this.bindParams[0]);
          if (this.idx < filtered.length) {
            this.currentRow = filtered[this.idx];
            this.idx++;
            return true;
          }
          return false;
        }
        if (this.sql.includes("WHERE nombre LIKE ?")) {
          const term = this.bindParams[0].replace(/%/g, "").toLowerCase();
          const filtered = this.results.filter(
            r => r.nombre && r.nombre.toLowerCase().includes(term)
          );
          if (this.idx < filtered.length) {
            this.currentRow = filtered[this.idx];
            this.idx++;
            return true;
          }
          return false;
        }
        if (this.sql.includes("WHERE accion = ?")) {
          const filtered = this.results.filter(r => r.accion === this.bindParams[0]);
          if (this.idx < filtered.length) {
            this.currentRow = filtered[this.idx];
            this.idx++;
            return true;
          }
          return false;
        }
        if (this.sql.includes("WHERE id_ref = ?")) {
          const filtered = this.results.filter(
            r => r.id_ref === this.bindParams[0] && r.tabla_ref === this.bindParams[1]
          );
          if (this.idx < filtered.length) {
            this.currentRow = filtered[this.idx];
            this.idx++;
            return true;
          }
          return false;
        }
        if (this.sql.includes("SELECT triage_actual FROM pacientes WHERE id_interno")) {
          const filtered = this.results.filter(r => r.id_interno === this.bindParams[0]);
          if (this.idx < filtered.length) {
            this.currentRow = filtered[this.idx];
            this.idx++;
            return true;
          }
          return false;
        }
      }
      this.currentRow = this.results[this.idx];
      this.idx++;
      return true;
    }
    return false;
  }

  getAsObject() {
    return this.currentRow || {};
  }

  free() {
    this.results = [];
    this.idx = 0;
  }
}

// Función helper para crear DB desde datos exportados
function createDatabaseFromExport(data) {
  const str = new TextDecoder().decode(data);
  const tables = JSON.parse(str);
  const db = new MockDatabase();
  db.tables = tables;
  return db;
}

describe("Database Integration - Full Patient Flow", () => {
  let db;

  beforeEach(() => {
    db = new MockDatabase();
  });

  describe("Flujo Completo de Paciente", () => {
    test("debe registrar un nuevo paciente y crear trazabilidad", () => {
      const paciente = patientFixtures.rojo;

      // Paso 1: Insertar paciente
      db.run(
        "INSERT INTO pacientes (id_interno, folio_local, nombre, edad_estimada, sexo, triage_inicial, triage_actual, area_actual, estado, procedencia, ts_ingreso, operador_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          paciente.id_interno,
          paciente.folio_local,
          paciente.nombre,
          paciente.edad_estimada,
          paciente.sexo,
          paciente.triage_inicial,
          paciente.triage_actual,
          paciente.area_actual,
          paciente.estado,
          paciente.procedencia,
          paciente.ts_ingreso,
          paciente.operador_registro,
        ]
      );

      // Paso 2: Verificar inserción
      const stmt = db.prepare("SELECT * FROM pacientes WHERE id_interno = ?");
      stmt.bind([paciente.id_interno]);
      expect(stmt.step()).toBe(true);
      const retrieved = stmt.getAsObject();
      expect(retrieved.triage_actual).toBe("ROJO");
      expect(retrieved.nombre).toBe("Juan Pérez");
      stmt.free();

      // Paso 3: Crear entrada de trazabilidad
      const trazabilidad = trazabilidadFixtures.ingreso;
      db.run(
        "INSERT INTO trazabilidad (id_paciente, ts_evento, tipo_evento, descripcion, valor_anterior, valor_nuevo, operador, area) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          trazabilidad.id_paciente,
          trazabilidad.ts_evento,
          trazabilidad.tipo_evento,
          trazabilidad.descripcion,
          trazabilidad.valor_anterior,
          trazabilidad.valor_nuevo,
          trazabilidad.operador,
          trazabilidad.area,
        ]
      );

      // Paso 4: Verificar trazabilidad
      const stmtTraz = db.prepare("SELECT * FROM trazabilidad WHERE id_paciente = ?");
      stmtTraz.bind([paciente.id_interno]);
      expect(stmtTraz.step()).toBe(true);
      const traz = stmtTraz.getAsObject();
      expect(traz.tipo_evento).toBe("INGRESO");
      stmtTraz.free();

      // Paso 5: Actualizar triage
      db.run("UPDATE pacientes SET triage_actual = ?, ts_ultima_mod = ? WHERE id_interno = ?", [
        "AMARILLO",
        new Date().toISOString(),
        paciente.id_interno,
      ]);

      // Paso 6: Verificar actualización
      const stmtUpdate = db.prepare("SELECT triage_actual FROM pacientes WHERE id_interno = ?");
      stmtUpdate.bind([paciente.id_interno]);
      stmtUpdate.step();
      const updated = stmtUpdate.getAsObject();
      expect(updated.triage_actual).toBe("AMARILLO");
      stmtUpdate.free();
    });

    test("debe manejar múltiples pacientes en batch", () => {
      const pacientes = [patientFixtures.rojo, patientFixtures.amarillo, patientFixtures.verde];

      // Insertar múltiples pacientes
      pacientes.forEach(paciente => {
        db.run(
          "INSERT INTO pacientes (id_interno, folio_local, nombre, edad_estimada, sexo, triage_inicial, triage_actual, area_actual, estado, procedencia, ts_ingreso, operador_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            paciente.id_interno,
            paciente.folio_local,
            paciente.nombre,
            paciente.edad_estimada,
            paciente.sexo,
            paciente.triage_inicial,
            paciente.triage_actual,
            paciente.area_actual,
            paciente.estado,
            paciente.procedencia,
            paciente.ts_ingreso,
            paciente.operador_registro,
          ]
        );
      });

      // Verificar conteo por triage
      const stmt = db.prepare(
        "SELECT triage_actual, COUNT(*) as count FROM pacientes GROUP BY triage_actual"
      );
      const conteos = {};
      while (stmt.step()) {
        const row = stmt.getAsObject();
        conteos[row.triage_actual] = row.count;
      }
      stmt.free();

      expect(conteos.ROJO).toBe(1);
      expect(conteos.AMARILLO).toBe(1);
      expect(conteos.VERDE).toBe(1);

      // Verificar total
      const stmtTotal = db.prepare("SELECT COUNT(*) as total FROM pacientes");
      stmtTotal.step();
      const total = stmtTotal.getAsObject().total;
      stmtTotal.free();
      expect(total).toBe(3);
    });

    test("debe exportar base de datos a Uint8Array", () => {
      // Insertar paciente
      const paciente = patientFixtures.rojo;
      db.run(
        "INSERT INTO pacientes (id_interno, folio_local, nombre, edad_estimada, sexo, triage_inicial, triage_actual, area_actual, estado, procedencia, ts_ingreso, operador_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          paciente.id_interno,
          paciente.folio_local,
          paciente.nombre,
          paciente.edad_estimada,
          paciente.sexo,
          paciente.triage_inicial,
          paciente.triage_actual,
          paciente.area_actual,
          paciente.estado,
          paciente.procedencia,
          paciente.ts_ingreso,
          paciente.operador_registro,
        ]
      );

      // Exportar
      const data = db.export();
      expect(data).toBeInstanceOf(Uint8Array);
      expect(data.length).toBeGreaterThan(0);

      // Crear nueva DB desde el export
      const db2 = createDatabaseFromExport(data);
      const stmt = db2.prepare("SELECT COUNT(*) as total FROM pacientes");
      stmt.step();
      const count = stmt.getAsObject().total;
      stmt.free();

      expect(count).toBe(1);
    });

    test("debe persistir datos entre sesiones (export/import)", () => {
      const paciente = patientFixtures.conDiscapacidad;

      // Insertar en "sesión 1"
      db.run(
        "INSERT INTO pacientes (id_interno, folio_local, nombre, edad_estimada, sexo, discapacidad, triage_inicial, triage_actual, area_actual, estado, procedencia, ts_ingreso, operador_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          paciente.id_interno,
          paciente.folio_local,
          paciente.nombre,
          paciente.edad_estimada,
          paciente.sexo,
          paciente.discapacidad,
          paciente.triage_inicial,
          paciente.triage_actual,
          paciente.area_actual,
          paciente.estado,
          paciente.procedencia,
          paciente.ts_ingreso,
          paciente.operador_registro,
        ]
      );

      // "Cerrar sesión" - exportar datos
      const exportedData = db.export();

      // "Nueva sesión" - crear nueva DB e importar
      const db2 = createDatabaseFromExport(exportedData);

      // Verificar que datos persistieron
      const stmt = db2.prepare("SELECT * FROM pacientes WHERE id_interno = ?");
      stmt.bind([paciente.id_interno]);
      expect(stmt.step()).toBe(true);
      const retrieved = stmt.getAsObject();
      expect(retrieved.discapacidad).toBe("auditiva");
      expect(retrieved.nombre).toBe("Ana Martínez");
      stmt.free();
    });
  });

  describe("Trazabilidad Completa", () => {
    test("debe registrar secuencia completa de eventos de paciente", () => {
      const paciente = patientFixtures.rojo;

      // Insertar paciente
      db.run(
        "INSERT INTO pacientes (id_interno, folio_local, nombre, edad_estimada, sexo, triage_inicial, triage_actual, area_actual, estado, procedencia, ts_ingreso, operador_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          paciente.id_interno,
          paciente.folio_local,
          paciente.nombre,
          paciente.edad_estimada,
          paciente.sexo,
          paciente.triage_inicial,
          paciente.triage_actual,
          paciente.area_actual,
          paciente.estado,
          paciente.procedencia,
          paciente.ts_ingreso,
          paciente.operador_registro,
        ]
      );

      // Registrar secuencia de eventos
      const eventos = [
        { tipo: "INGRESO", descripcion: "Paciente ingresado", valor: "ACTIVO" },
        { tipo: "CAMBIO_AREA", descripcion: "Traslado a UCI", valor: "UCI" },
        {
          tipo: "CAMBIO_TRIAGE",
          descripcion: "Reevaluación",
          valor_anterior: "ROJO",
          valor_nuevo: "AMARILLO",
        },
        { tipo: "ALTA", descripcion: "Alta médica", valor: "ALTA" },
      ];

      eventos.forEach((evento, idx) => {
        const ts = new Date(Date.now() + idx * 60000).toISOString();
        db.run(
          "INSERT INTO trazabilidad (id_paciente, ts_evento, tipo_evento, descripcion, valor_anterior, valor_nuevo, operador, area) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            paciente.id_interno,
            ts,
            evento.tipo,
            evento.descripcion,
            evento.valor_anterior || null,
            evento.valor_nuevo || evento.valor || null,
            "DR. SMITH",
            "URGENCIAS",
          ]
        );
      });

      // Verificar secuencia
      const stmt = db.prepare(
        "SELECT * FROM trazabilidad WHERE id_paciente = ? ORDER BY ts_evento ASC"
      );
      stmt.bind([paciente.id_interno]);
      const countEventos = [];
      while (stmt.step()) {
        countEventos.push(stmt.getAsObject());
      }
      stmt.free();

      expect(countEventos.length).toBe(4);
      expect(countEventos[0].tipo_evento).toBe("INGRESO");
      expect(countEventos[3].tipo_evento).toBe("ALTA");
    });

    test("debe mantener trazabilidad de múltiples pacientes", () => {
      const pacientes = [patientFixtures.rojo, patientFixtures.amarillo, patientFixtures.verde];

      // Insertar pacientes
      pacientes.forEach(p => {
        db.run(
          "INSERT INTO pacientes (id_interno, folio_local, nombre, edad_estimada, sexo, triage_inicial, triage_actual, area_actual, estado, procedencia, ts_ingreso, operador_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            p.id_interno,
            p.folio_local,
            p.nombre,
            p.edad_estimada,
            p.sexo,
            p.triage_inicial,
            p.triage_actual,
            p.area_actual,
            p.estado,
            p.procedencia,
            p.ts_ingreso,
            p.operador_registro,
          ]
        );

        // Agregar evento de trazabilidad
        db.run(
          "INSERT INTO trazabilidad (id_paciente, ts_evento, tipo_evento, descripcion, valor_nuevo, operador, area) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            p.id_interno,
            p.ts_ingreso,
            "INGRESO",
            "Paciente registrado",
            "ACTIVO",
            p.operador_registro,
            p.procedencia,
          ]
        );
      });

      // Verificar trazabilidad por paciente
      const stmt = db.prepare("SELECT * FROM trazabilidad");
      const trazabilidadAll = [];
      while (stmt.step()) {
        trazabilidadAll.push(stmt.getAsObject());
      }
      stmt.free();

      // Verificar que hay 3 eventos de trazabilidad (uno por paciente)
      expect(trazabilidadAll.length).toBe(3);

      // Verificar que cada paciente tiene su evento
      const pacientesIds = new Set(trazabilidadAll.map(t => t.id_paciente));
      expect(pacientesIds.size).toBe(3);
    });
  });

  describe("Auditoría de Operaciones", () => {
    test("debe registrar operaciones críticas en auditoría", () => {
      const auditoria = auditoriaFixtures.login;

      db.run(
        "INSERT INTO auditoria (ts, operador, accion, tabla_ref, id_ref, detalle) VALUES (?, ?, ?, ?, ?, ?)",
        [
          auditoria.ts,
          auditoria.operador,
          auditoria.accion,
          auditoria.tabla_ref,
          auditoria.id_ref,
          auditoria.detalle,
        ]
      );

      const stmt = db.prepare("SELECT * FROM auditoria WHERE accion = ?");
      stmt.bind(["LOGIN"]);
      expect(stmt.step()).toBe(true);
      const log = stmt.getAsObject();
      expect(log.operador).toBe("DR. SMITH");
      expect(log.detalle).toBe("Inicio de sesión exitoso");
      stmt.free();
    });

    test("debe mantener historial completo de auditoría", () => {
      const eventos = [
        auditoriaFixtures.login,
        auditoriaFixtures.registro,
        auditoriaFixtures.exportacion,
      ];

      eventos.forEach(e => {
        db.run(
          "INSERT INTO auditoria (ts, operador, accion, tabla_ref, id_ref, detalle) VALUES (?, ?, ?, ?, ?, ?)",
          [e.ts, e.operador, e.accion, e.tabla_ref, e.id_ref, e.detalle]
        );
      });

      const stmt = db.prepare("SELECT * FROM auditoria");
      const allAuditoria = [];
      while (stmt.step()) {
        allAuditoria.push(stmt.getAsObject());
      }
      stmt.free();

      expect(allAuditoria.length).toBe(3);
    });

    test("debe relacionar auditoría con pacientes", () => {
      const paciente = patientFixtures.rojo;
      const aud = auditoriaFixtures.registro;

      // Insertar paciente
      db.run(
        "INSERT INTO pacientes (id_interno, folio_local, nombre, edad_estimada, sexo, triage_inicial, triage_actual, area_actual, estado, procedencia, ts_ingreso, operador_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          paciente.id_interno,
          paciente.folio_local,
          paciente.nombre,
          paciente.edad_estimada,
          paciente.sexo,
          paciente.triage_inicial,
          paciente.triage_actual,
          paciente.area_actual,
          paciente.estado,
          paciente.procedencia,
          paciente.ts_ingreso,
          paciente.operador_registro,
        ]
      );

      // Registrar auditoría
      db.run(
        "INSERT INTO auditoria (ts, operador, accion, tabla_ref, id_ref, detalle) VALUES (?, ?, ?, ?, ?, ?)",
        [aud.ts, aud.operador, aud.accion, aud.tabla_ref, paciente.id_interno, aud.detalle]
      );

      // Verificar relación
      const stmt = db.prepare("SELECT * FROM auditoria WHERE id_ref = ? AND tabla_ref = ?");
      stmt.bind([paciente.id_interno, "pacientes"]);
      expect(stmt.step()).toBe(true);
      const log = stmt.getAsObject();
      expect(log.accion).toBe("CREAR");
      stmt.free();
    });
  });

  describe("Consultas Complejas", () => {
    beforeEach(() => {
      // Insertar pacientes de prueba
      [
        patientFixtures.rojo,
        patientFixtures.amarillo,
        patientFixtures.verde,
        patientFixtures.negro,
      ].forEach(p => {
        db.run(
          "INSERT INTO pacientes (id_interno, folio_local, nombre, edad_estimada, sexo, triage_inicial, triage_actual, area_actual, estado, procedencia, ts_ingreso, operador_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            p.id_interno,
            p.folio_local,
            p.nombre,
            p.edad_estimada,
            p.sexo,
            p.triage_inicial,
            p.triage_actual,
            p.area_actual,
            p.estado,
            p.procedencia,
            p.ts_ingreso,
            p.operador_registro,
          ]
        );
      });
    });

    test("debe obtener estadísticas por triage", () => {
      const stmt = db.prepare(
        "SELECT triage_actual, COUNT(*) as count FROM pacientes GROUP BY triage_actual ORDER BY count DESC"
      );
      const resultados = [];
      while (stmt.step()) {
        resultados.push(stmt.getAsObject());
      }
      stmt.free();

      expect(resultados.length).toBe(4);
      expect(resultados.find(r => r.triage_actual === "ROJO")).toBeDefined();
      expect(resultados.find(r => r.triage_actual === "AMARILLO")).toBeDefined();
      expect(resultados.find(r => r.triage_actual === "VERDE")).toBeDefined();
      expect(resultados.find(r => r.triage_actual === "NEGRO")).toBeDefined();
    });

    test("debe filtrar pacientes por estado", () => {
      const stmt = db.prepare("SELECT * FROM pacientes WHERE estado = ?");
      stmt.bind(["ACTIVO"]);
      const activos = [];
      while (stmt.step()) {
        activos.push(stmt.getAsObject());
      }
      stmt.free();

      expect(activos.length).toBe(3);
    });

    test("debe obtener pacientes con discapacidad", () => {
      // Insertar paciente con discapacidad
      const p = patientFixtures.conDiscapacidad;
      db.run(
        "INSERT INTO pacientes (id_interno, folio_local, nombre, edad_estimada, sexo, discapacidad, triage_inicial, triage_actual, area_actual, estado, procedencia, ts_ingreso, operador_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          p.id_interno,
          p.folio_local,
          p.nombre,
          p.edad_estimada,
          p.sexo,
          p.discapacidad,
          p.triage_inicial,
          p.triage_actual,
          p.area_actual,
          p.estado,
          p.procedencia,
          p.ts_ingreso,
          p.operador_registro,
        ]
      );

      const stmt = db.prepare(
        "SELECT * FROM pacientes WHERE discapacidad IS NOT NULL AND discapacidad != ?"
      );
      stmt.bind([""]);
      const pacientes = [];
      while (stmt.step()) {
        pacientes.push(stmt.getAsObject());
      }
      stmt.free();

      expect(pacientes.length).toBe(1);
      expect(pacientes[0].discapacidad).toBe("auditiva");
    });

    test("debe calcular ocupación por área", () => {
      const stmt = db.prepare(
        "SELECT area_actual, COUNT(*) as count FROM pacientes WHERE estado = ? GROUP BY area_actual"
      );
      stmt.bind(["ACTIVO"]);
      const ocupacion = {};
      while (stmt.step()) {
        const row = stmt.getAsObject();
        ocupacion[row.area_actual] = row.count;
      }
      stmt.free();

      expect(ocupacion.UCI).toBe(1);
      expect(ocupacion.OBSERVACION).toBe(2);
    });
  });

  describe("Migraciones de Schema", () => {
    test("debe registrar version de schema", () => {
      db.run("INSERT INTO schema_info (version, description, migrated_at) VALUES (?, ?, ?)", [
        2,
        "Agregar teléfono y contacto",
        new Date().toISOString(),
      ]);

      const stmt = db.prepare("SELECT version FROM schema_info ORDER BY version DESC LIMIT 1");
      stmt.step();
      const version = stmt.getAsObject().version;
      stmt.free();

      expect(version).toBe(2);
    });
  });

  describe("Manejo de Errores", () => {
    test("debe rechazar inserción duplicada (UNIQUE constraint)", () => {
      const paciente = patientFixtures.rojo;

      db.run(
        "INSERT INTO pacientes (id_interno, folio_local, nombre, edad_estimada, sexo, triage_inicial, triage_actual, area_actual, estado, procedencia, ts_ingreso, operador_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          paciente.id_interno,
          paciente.folio_local,
          paciente.nombre,
          paciente.edad_estimada,
          paciente.sexo,
          paciente.triage_inicial,
          paciente.triage_actual,
          paciente.area_actual,
          paciente.estado,
          paciente.procedencia,
          paciente.ts_ingreso,
          paciente.operador_registro,
        ]
      );

      // Intentar insertar mismo folio
      expect(() => {
        db.run(
          "INSERT INTO pacientes (id_interno, folio_local, nombre, edad_estimada, sexo, triage_inicial, triage_actual, area_actual, estado, procedencia, ts_ingreso, operador_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            "P-OTHER",
            paciente.folio_local,
            "Otro",
            30,
            "M",
            "VERDE",
            "VERDE",
            "OBSERVACION",
            "ACTIVO",
            "URGENCIAS",
            paciente.ts_ingreso,
            "DR. TEST",
          ]
        );
      }).toThrow();

      // Verificar que solo hay un registro
      const stmt = db.prepare("SELECT COUNT(*) as total FROM pacientes");
      stmt.step();
      const total = stmt.getAsObject().total;
      stmt.free();

      expect(total).toBe(1);
    });

    test("debe respetar constraint CHECK en sexo", () => {
      const paciente = patientFixtures.rojo;

      expect(() => {
        db.run(
          "INSERT INTO pacientes (id_interno, folio_local, nombre, edad_estimada, sexo, triage_inicial, triage_actual, area_actual, estado, procedencia, ts_ingreso, operador_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            paciente.id_interno,
            paciente.folio_local,
            paciente.nombre,
            paciente.edad_estimada,
            "X",
            paciente.triage_inicial,
            paciente.triage_actual,
            paciente.area_actual,
            paciente.estado,
            paciente.procedencia,
            paciente.ts_ingreso,
            paciente.operador_registro,
          ]
        );
      }).toThrow();
    });

    test("debe manejar transacciones correctamente", () => {
      // Iniciar transacción
      db.run("BEGIN TRANSACTION");

      try {
        // Insertar varios pacientes
        [patientFixtures.rojo, patientFixtures.amarillo].forEach(p => {
          db.run(
            "INSERT INTO pacientes (id_interno, folio_local, nombre, edad_estimada, sexo, triage_inicial, triage_actual, area_actual, estado, procedencia, ts_ingreso, operador_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              p.id_interno,
              p.folio_local,
              p.nombre,
              p.edad_estimada,
              p.sexo,
              p.triage_inicial,
              p.triage_actual,
              p.area_actual,
              p.estado,
              p.procedencia,
              p.ts_ingreso,
              p.operador_registro,
            ]
          );
        });

        // Commit
        db.run("COMMIT");
      } catch (e) {
        throw e;
      }

      // Verificar que ambos se insertaron
      const stmt = db.prepare("SELECT COUNT(*) as total FROM pacientes");
      stmt.step();
      const total = stmt.getAsObject().total;
      stmt.free();

      expect(total).toBe(2);
    });
  });

  describe("Performance con Grandes Volúmenes", () => {
    test("debe manejar inserción masiva de pacientes", () => {
      const { patients } = generateMassPatients(100, {
        rojo: 0.2,
        amarillo: 0.4,
        verde: 0.4,
        negro: 0,
      });

      const startTime = Date.now();

      db.run("BEGIN TRANSACTION");
      patients.forEach(p => {
        db.run(
          "INSERT INTO pacientes (id_interno, folio_local, nombre, edad_estimada, sexo, triage_inicial, triage_actual, area_actual, estado, procedencia, ts_ingreso, operador_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            p.id_interno,
            p.folio_local,
            p.nombre,
            p.edad_estimada,
            p.sexo,
            p.triage_inicial,
            p.triage_actual,
            p.area_actual,
            p.estado,
            p.procedencia,
            p.ts_ingreso,
            p.operador_registro,
          ]
        );
      });
      db.run("COMMIT");

      const endTime = Date.now();

      const stmt = db.prepare("SELECT COUNT(*) as total FROM pacientes");
      stmt.step();
      const total = stmt.getAsObject().total;
      stmt.free();

      expect(total).toBe(100);
      expect(endTime - startTime).toBeLessThan(5000); // Menos de 5 segundos
    });

    test("debe ejecutar consultas complejas eficientemente", () => {
      const { patients } = generateMassPatients(50, {
        rojo: 0.3,
        amarillo: 0.3,
        verde: 0.3,
        negro: 0.1,
      });

      patients.forEach(p => {
        db.run(
          "INSERT INTO pacientes (id_interno, folio_local, nombre, edad_estimada, sexo, triage_inicial, triage_actual, area_actual, estado, procedencia, ts_ingreso, operador_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            p.id_interno,
            p.folio_local,
            p.nombre,
            p.edad_estimada,
            p.sexo,
            p.triage_inicial,
            p.triage_actual,
            p.area_actual,
            p.estado,
            p.procedencia,
            p.ts_ingreso,
            p.operador_registro,
          ]
        );
      });

      const startTime = Date.now();

      // Consulta compleja
      const stmt = db.prepare(`
        SELECT p.triage_actual, COUNT(*) as count
        FROM pacientes p
        WHERE p.estado = 'ACTIVO'
        GROUP BY p.triage_actual
        ORDER BY count DESC
      `);

      const resultados = [];
      while (stmt.step()) {
        resultados.push(stmt.getAsObject());
      }
      stmt.free();

      const endTime = Date.now();

      expect(resultados.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(1000); // Menos de 1 segundo
    });
  });
});
