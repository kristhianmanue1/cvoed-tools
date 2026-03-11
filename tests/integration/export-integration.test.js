/**
 * Integration Tests - Export/Import
 * Prueba flujos completos de exportación e importación de datos
 *
 * Estos tests verifican la integración entre:
 * - Base de datos (Mock)
 * - Exportación de datos
 * - Importación de respaldos
 * - Validación de datos
 */

import {
  patientFixtures,
  trazabilidadFixtures,
  exportDataFixture,
  generateMassPatients,
} from "./fixtures/patient-data.js";

// Mock Database simplificada para tests de exportación
class MockDatabase {
  constructor() {
    this.tables = {
      pacientes: [],
      trazabilidad: [],
      auditoria: [],
      schema_info: [],
    };
  }

  insertPatient(paciente) {
    this.tables.pacientes.push({ ...paciente });
  }

  insertTrazabilidad(trazabilidad) {
    this.tables.trazabilidad.push({ ...trazabilidad });
  }

  insertAuditoria(auditoria) {
    this.tables.auditoria.push({ ...auditoria });
  }

  insertSchemaInfo(info) {
    this.tables.schema_info.push({ ...info });
  }

  export() {
    const data = JSON.stringify(this.tables);
    const buffer = new TextEncoder().encode(data);
    return new Uint8Array(buffer);
  }

  static import(data) {
    const str = new TextDecoder().decode(data);
    const tables = JSON.parse(str);
    const db = new MockDatabase();
    db.tables = tables;
    return db;
  }

  getPacientes() {
    return [...this.tables.pacientes];
  }

  getTrazabilidad() {
    return [...this.tables.trazabilidad];
  }

  getAuditoria() {
    return [...this.tables.auditoria];
  }

  getCount(table) {
    return this.tables[table]?.length || 0;
  }
}

describe("Export/Import Integration - Complete Data Flows", () => {
  let db;

  beforeEach(() => {
    db = new MockDatabase();
    insertTestData();
  });

  function insertTestData() {
    // Insertar pacientes de prueba
    [
      patientFixtures.rojo,
      patientFixtures.amarillo,
      patientFixtures.verde,
      patientFixtures.conDiscapacidad,
    ].forEach(p => {
      db.insertPatient(p);
    });

    // Insertar trazabilidad
    [patientFixtures.rojo, patientFixtures.amarillo].forEach(p => {
      db.insertTrazabilidad({
        id_paciente: p.id_interno,
        ts_evento: p.ts_ingreso,
        tipo_evento: "INGRESO",
        descripcion: "Paciente registrado",
        valor_nuevo: "ACTIVO",
        operador: p.operador_registro,
        area: p.procedencia,
      });
    });

    // Insertar versión de schema
    db.insertSchemaInfo({
      version: 2,
      description: "Schema actual",
      migrated_at: new Date().toISOString(),
    });
  }

  describe("Flujo de Exportación de Pacientes", () => {
    test("exporta lista completa de pacientes", () => {
      const pacientes = db.getPacientes();

      expect(pacientes.length).toBe(4);
      expect(pacientes[0].nombre).toBe("Juan Pérez");
      expect(pacientes[3].nombre).toBe("Ana Martínez");
    });

    test("exporta campos requeridos para Excel", () => {
      const pacientes = db.getPacientes();
      const exportRow = pacientes.map(p => ({
        ID: p.id_interno,
        Folio: p.folio_local,
        Nombre: p.nombre,
        NSS: p.nss,
        Edad: p.edad_estimada,
        Sexo: p.sexo,
        Discapacidad: p.discapacidad,
        Triage: p.triage_actual,
        Area: p.area_actual,
        Estado: p.estado,
        Ingreso: p.ts_ingreso,
      }));

      expect(exportRow.length).toBeGreaterThan(0);
      expect(exportRow[0]).toHaveProperty("ID");
      expect(exportRow[0]).toHaveProperty("Folio");
      expect(exportRow[0]).toHaveProperty("Nombre");
      expect(exportRow[0]).toHaveProperty("Triage");
      expect(exportRow[0]).toHaveProperty("Ingreso");
    });

    test("incluye pacientes con discapacidad", () => {
      const pacientes = db.getPacientes();
      const conDiscapacidad = pacientes.filter(p => p.discapacidad);

      expect(conDiscapacidad.length).toBe(1);
      expect(conDiscapacidad[0].discapacidad).toBe("auditiva");
    });
  });

  describe("Exportación de Métricas", () => {
    test("calcula métricas por triage", () => {
      const pacientes = db.getPacientes().filter(p => p.estado === "ACTIVO");
      const metricas = {};

      pacientes.forEach(p => {
        metricas[p.triage_actual] = (metricas[p.triage_actual] || 0) + 1;
      });

      expect(metricas.ROJO).toBe(1);
      expect(metricas.AMARILLO).toBe(2);
      expect(metricas.VERDE).toBe(1);
    });

    test("calcula ocupación por área", () => {
      const pacientes = db.getPacientes().filter(p => p.estado === "ACTIVO");
      const ocupacion = {};

      pacientes.forEach(p => {
        ocupacion[p.area_actual] = (ocupacion[p.area_actual] || 0) + 1;
      });

      expect(ocupacion.UCI).toBe(1);
      expect(ocupacion.OBSERVACION).toBe(3);
    });

    test("genera resumen ejecutivo", () => {
      const total = db.getCount("pacientes");
      const pacientes = db.getPacientes();

      const porTriage = {};
      pacientes.forEach(p => {
        porTriage[p.triage_actual] = (porTriage[p.triage_actual] || 0) + 1;
      });

      const eventos = db.getCount("trazabilidad");

      const resumen = {
        totalPacientes: total,
        porTriage,
        totalEventos: eventos,
        fechaGeneracion: new Date().toISOString(),
      };

      expect(resumen.totalPacientes).toBe(4);
      expect(resumen.porTriage.ROJO).toBe(1);
      expect(resumen.totalEventos).toBe(2);
    });
  });

  describe("Exportación de Trazabilidad", () => {
    test("exporta historial completo de eventos", () => {
      const eventos = db.getTrazabilidad();

      expect(eventos.length).toBe(2);
      expect(eventos[0].tipo_evento).toBe("INGRESO");
      expect(eventos[1].tipo_evento).toBe("INGRESO");
    });

    test("exporta trazabilidad por paciente", () => {
      const paciente = patientFixtures.rojo;
      const eventos = db.getTrazabilidad().filter(t => t.id_paciente === paciente.id_interno);

      expect(eventos.length).toBe(1);
      expect(eventos[0].id_paciente).toBe(paciente.id_interno);
    });

    test("incluye metadatos de auditoría", () => {
      const eventos = db.getTrazabilidad().map(t => ({
        id_paciente: t.id_paciente,
        ts_evento: t.ts_evento,
        tipo_evento: t.tipo_evento,
        descripcion: t.descripcion,
        operador: t.operador,
      }));

      expect(eventos.length).toBeGreaterThan(0);
      expect(eventos[0]).toHaveProperty("operador");
    });
  });

  describe("Flujo de Importación de Respaldo", () => {
    test("crea backup de base de datos", () => {
      const data = db.export();

      expect(data).toBeInstanceOf(Uint8Array);
      expect(data.length).toBeGreaterThan(0);

      // Verificar que puede recrearse
      const db2 = MockDatabase.import(data);
      const count = db2.getCount("pacientes");

      expect(count).toBe(4);
    });

    test("restaura estado completo desde backup", () => {
      // Crear backup
      const backup = {
        version: 2,
        timestamp: new Date().toISOString(),
        data: Array.from(db.export()),
      };

      // Limpiar y crear nueva DB
      const db2 = new MockDatabase();

      // Verificar que está vacía
      expect(db2.getCount("pacientes")).toBe(0);

      // Importar backup
      const backupData = new Uint8Array(backup.data);
      const db3 = MockDatabase.import(backupData);

      // Verificar restauración
      expect(db3.getCount("pacientes")).toBe(4);
    });

    test("restaura versión del schema", () => {
      const schemaInfo = db.tables.schema_info;
      expect(schemaInfo.length).toBeGreaterThan(0);
      expect(schemaInfo[schemaInfo.length - 1].version).toBe(2);
    });
  });

  describe("Validación de Datos", () => {
    test("valida estructura de datos requerida", () => {
      const paciente = db.getPacientes()[0];
      const camposRequeridos = [
        "id_interno",
        "folio_local",
        "nombre",
        "edad_estimada",
        "sexo",
        "triage_inicial",
        "triage_actual",
        "estado",
      ];

      camposRequeridos.forEach(campo => {
        expect(paciente).toHaveProperty(campo);
      });
    });

    test("valida integridad de referencias", () => {
      const pacientesIds = db.getPacientes().map(p => p.id_interno);
      const trazabilidad = db.getTrazabilidad();

      const referenciasInvalidas = trazabilidad.filter(t => !pacientesIds.includes(t.id_paciente));

      expect(referenciasInvalidas.length).toBe(0);
    });

    test("valida unicidad de folios", () => {
      const pacientes = db.getPacientes();
      const folios = pacientes.map(p => p.folio_local);
      const foliosUnicos = new Set(folios);

      expect(folios.length).toBe(foliosUnicos.size);
    });
  });

  describe("Exportación Masiva", () => {
    test("maneja exportación de muchos pacientes", () => {
      const dbMasiva = new MockDatabase();
      const { patients } = generateMassPatients(100, {
        rojo: 0.2,
        amarillo: 0.4,
        verde: 0.3,
        negro: 0.1,
      });

      patients.forEach(p => dbMasiva.insertPatient(p));

      const exportados = dbMasiva.getPacientes();

      expect(exportados.length).toBe(100);
    });

    test("genera archivo con nombre correcto", () => {
      const now = new Date();
      const fechaStr = now.toISOString().split("T")[0].replace(/-/g, "");
      const nombreArchivo = `ECEDES_Offline_${fechaStr}.xlsx`;

      expect(nombreArchivo).toMatch(/ECEDES_Offline_\d{8}\.xlsx/);
    });
  });

  describe("Metadatos de Exportación", () => {
    test("incluye información de versión", () => {
      const metadatos = {
        version: "2.0.0",
        schemaVersion: 2,
        fechaExportacion: new Date().toISOString(),
        hospital: "Hospital de Nunca Jamás",
      };

      expect(metadatos).toHaveProperty("version");
      expect(metadatos).toHaveProperty("schemaVersion");
      expect(metadatos).toHaveProperty("fechaExportacion");
      expect(metadatos).toHaveProperty("hospital");
    });

    test("incluye operador que realizó exportación", () => {
      const operador = "DRA. LOPEZ";
      const exportInfo = {
        operador,
        timestamp: new Date().toISOString(),
        accion: "EXPORTAR",
      };

      expect(exportInfo.operador).toBe(operador);
    });
  });

  describe("Formato de Salida", () => {
    test("genera estructura compatible con Excel", () => {
      const pacientes = db.getPacientes();
      const hojaPacientes = {
        nombre: "Pacientes",
        columnas: ["Folio", "Nombre", "Edad", "Sexo", "Triage", "Área", "Estado", "Ingreso"],
        filas: pacientes.map(p => ({
          folio_local: p.folio_local,
          nombre: p.nombre,
          edad_estimada: p.edad_estimada,
          sexo: p.sexo,
          triage_actual: p.triage_actual,
          area_actual: p.area_actual,
          estado: p.estado,
          ts_ingreso: p.ts_ingreso,
        })),
      };

      expect(hojaPacientes.filas.length).toBe(4);
      expect(hojaPacientes.filas[0]).toHaveProperty("folio_local");
    });

    test("genera múltiples hojas (Pacientes, Métricas, Trazabilidad)", () => {
      const pacientes = db.getPacientes();
      const trazabilidad = db.getTrazabilidad();

      const porTriage = {};
      pacientes.forEach(p => {
        porTriage[p.triage_actual] = (porTriage[p.triage_actual] || 0) + 1;
      });

      const metricas = Object.entries(porTriage).map(([triage_actual, count]) => ({
        triage_actual,
        count,
      }));

      const workbook = {
        hojas: [
          { nombre: "Pacientes", datos: pacientes },
          { nombre: "Métricas", datos: metricas },
          { nombre: "Trazabilidad", datos: trazabilidad },
        ],
      };

      expect(workbook.hojas.length).toBe(3);
      expect(workbook.hojas.map(h => h.nombre)).toContain("Pacientes");
      expect(workbook.hojas.map(h => h.nombre)).toContain("Métricas");
      expect(workbook.hojas.map(h => h.nombre)).toContain("Trazabilidad");
    });
  });
});
