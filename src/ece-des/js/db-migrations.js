/**
 * Sistema de Migraciones de Base de Datos
 *
 * Permite versionar el schema y migrar datos existentes
 * cuando cambia la estructura de la base de datos.
 */

const DB_SCHEMA_VERSION = 2;

/**
 * Mapa de versiones del schema
 * Cada versión tiene una función de migración
 */
const MIGRATIONS = {
  1: {
    version: 1,
    description: "Schema inicial",
    up: () => {
      // Schema inicial ya existe en app.js:createSchema()
      // No requiere migración
    },
  },

  2: {
    version: 2,
    description: "Agregar teléfono y contacto al paciente",
    up: db => {
      // Agregar columnas nuevas
      db.run("ALTER TABLE pacientes ADD COLUMN telefono TEXT");
      db.run("ALTER TABLE pacientes ADD COLUMN contacto TEXT");

      // Crear índice para búsqueda por teléfono
      db.run("CREATE INDEX IF NOT EXISTS idx_pacientes_telefono ON pacientes(telefono)");
    },
  },
};

/**
 * Obtiene la versión actual del schema desde la base de datos
 * @param {Object} db - Instancia de SQL.js
 * @returns {number} Versión actual (0 si no existe tabla de versión)
 */
function getDBVersion(db) {
  try {
    const stmt = db.prepare("SELECT version FROM schema_info ORDER BY version DESC LIMIT 1");
    if (stmt.step()) {
      return stmt.getAsObject().version;
    }
    return 0; // Base de datos nueva
  } catch (e) {
    // Tabla schema_info no existe
    return 0;
  }
}

/**
 * Crea la tabla de control de versiones
 * @param {Object} db - Instancia de SQL.js
 */
function createVersionTable(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS schema_info (
      version INTEGER PRIMARY KEY,
      description TEXT NOT NULL,
      migrated_at TEXT NOT NULL
    );
  `);
}

/**
 * Ejecuta todas las migraciones pendientes
 * @param {Object} db - Instancia de SQL.js
 * @returns {number} Versión final después de migraciones
 */
function _migrateDatabase(db) {
  const currentVersion = getDBVersion(db);
  const targetVersion = DB_SCHEMA_VERSION;

  console.log(`[DB Migration] Versión actual: ${currentVersion}, Target: ${targetVersion}`);

  if (currentVersion === targetVersion) {
    console.log("[DB Migration] Ya está en la última versión");
    return currentVersion;
  }

  // Crear tabla de versiones si no existe
  createVersionTable(db);

  // Ejecutar migraciones en orden
  for (let v = currentVersion + 1; v <= targetVersion; v++) {
    if (!MIGRATIONS[v]) {
      console.error(`[DB Migration] Error: No existe migración para versión ${v}`);
      throw new Error(`Missing migration for version ${v}`);
    }

    console.log(`[DB Migration] Ejecutando migración v${v}: ${MIGRATIONS[v].description}`);

    try {
      MIGRATIONS[v].up(db);

      // Registrar migración
      db.run("INSERT INTO schema_info (version, description, migrated_at) VALUES (?, ?, ?)", [
        v,
        MIGRATIONS[v].description,
        new Date().toISOString(),
      ]);

      console.log(`[DB Migration] Migración v${v} completada`);
    } catch (e) {
      console.error(`[DB Migration] Error en migración v${v}:`, e);
      throw e;
    }
  }

  const finalVersion = getDBVersion(db);
  console.log(`[DB Migration] Migraciones completadas. Versión final: ${finalVersion}`);

  return finalVersion;
}

/**
 * Exporta un backup de la base de datos antes de migrar
 * @param {Object} db - Instancia de SQL.js
 * @returns {Uint8Array} Binario de la base de datos
 */
function _backupDatabaseForMigration(db) {
  const data = db.export();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `backup-pre-migration-${timestamp}.sqlite`;

  // En navegador: descargar blob
  const blob = new Blob([data], { type: "application/octet-stream" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);

  console.log(`[DB Backup] Backup descargado: ${filename}`);
  return data;
}

/**
 * Restaura un backup de la base de datos
 * @param {Uint8Array} backupData - Binario del backup
 * @param {Object} SQL - Constructor de SQL.js
 * @returns {Object} Instancia de SQL.js con datos restaurados
 */
function _restoreDatabase(backupData, SQL) {
  return new SQL.Database(backupData);
}
