# ESPECIFICACIÓN DE TARES PARA AGENTES ADRC - CVOED-TOOLS Refactorización

**Fecha:** 2026-03-03
**Arquitecto:** ADRC CONTROLADOR
**Versión:** 1.0.0
**Horizonte:** 10 semanas
**Proyecto:** cvoed-tools

---

## TABLA DE CONTENIDOS

1. [Matriz de Dependencias](#1-matriz-de-dependencias)
2. [Agente EJECUTOR: Especificaciones Técnicas](#2-agente-ejecutor)
3. [Agente QA: Especificaciones de Pruebas](#3-agente-qa)
4. [Agente DOCUMENTADOR: Especificaciones de Docs](#4-agente-documentador)
5. [Secuencia de Ejecución Óptima](#5-secuencia-de-ejecución)

---

## 1. MATRIZ DE DEPENDENCIAS

### 1.1 Grafo de Tareas (Nivel Fase)

```
FASE 1: Fundaciones (Bloqueante para todo)
├─ EJECUTOR-01: Setup Testing Infra [CRÍTICO]
├─ EJECUTOR-02: XSS Fixes [CRÍTICO]
├─ EJECUTOR-03: DB Migration Path
└─ DOCUMENTADOR-01: Setup Guide [PARALELO]

FASE 2: State Management (Depende: Fase 1)
├─ EJECUTOR-04: Store Pattern [CRÍTICO]
├─ EJECUTOR-05: Migrate app.js
├─ EJECUTOR-06: Migrate dashboard.js
└─ QA-01: Unit Tests Store [PARALELO]

FASE 3: Code Sharing (Depende: Fase 2)
├─ EJECUTOR-07: Common Module
├─ EJECUTOR-08: Shared Bundle
└─ QA-02: Integration Tests [PARALELO]

FASE 4: Build System (Depende: Fase 3)
├─ EJECUTOR-09: esbuild Setup
├─ EJECUTOR-10: Build Scripts
└─ QA-03: Bundle Verification [PARALELO]

FASE 5: Polish (Depende: Fase 4, PARALELO entre sí)
├─ EJECUTOR-11: Accessibility
├─ EJECUTOR-12: Error Handling
├─ QA-04: E2E Tests
└─ DOCUMENTADOR-02: User Guides
```

### 1.2 Tabla de Paralelización

| Semana | EJECUTOR | QA | DOCUMENTADOR | Paralelización |
|--------|----------|-----|--------------|----------------|
| 1-2 | 01, 02, 03 | SETUP-01 | 01 | ✅ Alto (3 agentes) |
| 3-4 | 04, 05, 06 | 01 | - | ⚠️ Medio (QA depende de EJECUTOR-04) |
| 5-6 | 07, 08 | 02 | - | ⚠️ Medio (QA depende de EJECUTOR-07) |
| 7 | 09, 10 | 03 | - | ✅ Alto (QA en paralelo) |
| 8-9 | 11, 12 | 04 | 02 | ✅ Alto (3 agentes) |
| 10 | BUFFER | VALIDATION | 03 | ✅ Máximo |

---

## 2. AGENTE EJECUTOR

### ROL Y RESPONSABILIDADES

**Misión:** Implementar el código de refactorización según especificaciones técnicas.

**Autoridad:**
- ✅ Leer/escribir archivos en `/src/`
- ✅ Modificar `/docs/` (solo para code comments)
- ✅ Ejecutar tests (`npm test`)
- ❌ NO modificar `/docs/` sin aprobación
- ❌ NO commits directos a `main` (usar PRs)

**Métricas de Éxito:**
- Test coverage >85%
- Zero linting errors
- Zero regression failures
- Bundles size targets cumplidos

---

### EJECUTOR-01: SETUP TESTING INFRASTRUCTURE

**Prioridad:** P0 (CRÍTICO)
**Estimación:** 2 días
**Depende:** Nada
**Paralelo con:** DOCUMENTADOR-01

#### Especificación Técnica

**Archivo a crear:** `vitest.config.js`

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.test.js',
        '**/*.spec.js'
      ],
      // Thresholds obligatorios (fallo si no se cumple)
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 80,
        statements: 85
      },
      // Fail si coverage baja de threshold
      perFile: false
    }
  },
  resolve: {
    alias: {
      '@': new URL('./src/js', import.meta.url).pathname
    }
  }
});
```

**Archivo a crear:** `tests/setup.js`

```javascript
import { vi } from 'vitest';

// Mock de sql.js para tests
global.SQL = vi.fn();

// Mock de IndexedDB
global.indexedDB = {
  open: vi.fn(() => ({
    onupgradeneeded: null,
    onsuccess: null,
    onerror: null,
    result: {
      objectStoreNames: { contains: vi.fn() },
      transaction: vi.fn(() => ({
        objectStore: vi.fn(() => ({
          get: vi.fn(),
          put: vi.fn()
        })),
        oncomplete: null,
        onerror: null
      }))
    }
  }))
};
```

**Archivo a crear:** `tests/smoke.test.js`

```javascript
import { describe, it, expect } from 'vitest';

describe('Smoke Test', () => {
  it('should run a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have DOM environment', () => {
    document.body.innerHTML = '<div id="test">Hello</div>';
    expect(document.getElementById('test').textContent).toBe('Hello');
  });
});
```

**Archivo a modificar:** `package.json`

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  },
  "devDependencies": {
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "@testing-library/dom": "^9.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jsdom": "^23.0.0",
    "@vitest/coverage-v8": "^1.0.0"
  }
}
```

#### Pasos de Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install --save-dev vitest @vitest/ui @testing-library/dom @testing-library/user-event jsdom @vitest/coverage-v8
   ```

2. **Crear archivos de configuración:**
   - Crear `vitest.config.js` con el contenido de arriba
   - Crear `tests/setup.js`
   - Crear `tests/smoke.test.js`

3. **Verificar instalación:**
   ```bash
   npm run test:run
   # Debe mostrar: ✓ smoke.test.js (2 tests)
   ```

4. **Ejecutar coverage (debe fallar, 0% esperado):**
   ```bash
   npm run test:coverage
   # Debe mostrar ERROR: coverage below thresholds
   ```

#### Criterios de Aceptación

- [ ] `npm run test:run` ejecuta sin errores
- [ ] `npm run test:coverage` reporta 0% baseline (esperado)
- [ ] `vitest.config.js` tiene thresholds >85%
- [ ] `tests/setup.js` tiene mocks de SQL e IndexedDB
- [ ] `package.json` tiene scripts actualizados

#### Salida Esperada

**Archivos creados:**
- `vitest.config.js`
- `tests/setup.js`
- `tests/smoke.test.js`

**Archivos modificados:**
- `package.json`

---

### EJECUTOR-02: XSS VULNERABILITY FIXES

**Prioridad:** P0 (CRÍTICO - Seguridad)
**Estimación:** 1.5 días
**Depende:** Nada
**Paralelo con:** EJECUTOR-01, DOCUMENTADOR-01

#### Especificación Técnica

**Archivos a modificar:**
- `src/js/app.js` (líneas 242-249, 342-359)
- `src/js/dashboard.js` (líneas 165-173)

#### Cambio 1: `app.js:renderPatientTable()`

**ANTES (VULNERABLE):**
```javascript
tr.innerHTML =
  "<td style='padding: 10px;'>" + row.folio_local + "</td>" +
  "<td style='padding: 10px; font-weight:bold;'>" + (row.nombre || 'NN') + "</td>" +
  "<td style='padding: 10px;'>" + badge + "</td>" +
  "<td style='padding: 10px;'>" + (row.area_actual || '-') + "</td>" +
  "<td style='padding: 10px;'>" + new Date(row.ts_ingreso).toLocaleTimeString() + "</td>" +
  "<td style='padding: 10px;'><button class='btn' style='background:var(--inst-dorado); color:white; padding:5px 10px; font-size:0.8rem;' onclick='app.openExpediente(\"" + row.id_interno + "\")'>VER DETALLE</button></td>";
```

**DESPUÉS (SEGURO):**
```javascript
// Crear celdas individualmente con textContent
const tdFolio = document.createElement('td');
tdFolio.style.padding = '10px';
tdFolio.textContent = row.folio_local;

const tdNombre = document.createElement('td');
tdNombre.style.padding = '10px';
tdNombre.style.fontWeight = 'bold';
tdNombre.textContent = row.nombre || 'NN';

const tdTriage = document.createElement('td');
tdTriage.style.padding = '10px';
tdTriage.innerHTML = badge; // badge es HTML seguro (generado internamente)

const tdArea = document.createElement('td');
tdArea.style.padding = '10px';
tdArea.textContent = row.area_actual || '-';

const tdIngreso = document.createElement('td');
tdIngreso.style.padding = '10px';
tdIngreso.textContent = new Date(row.ts_ingreso).toLocaleTimeString();

const tdAccion = document.createElement('td');
tdAccion.style.padding = '10px';
const btn = document.createElement('button');
btn.className = 'btn';
btn.style.cssText = 'background:var(--inst-dorado); color:white; padding:5px 10px; font-size:0.8rem;';
btn.textContent = 'VER DETALLE';
btn.onclick = () => app.openExpediente(row.id_interno);
tdAccion.appendChild(btn);

tr.append(tdFolio, tdNombre, tdTriage, tdArea, tdIngreso, tdAccion);
```

#### Cambio 2: `app.js:renderTimeline()`

**ANTES (VULNERABLE):**
```javascript
div.innerHTML =
  "<div style='position:absolute; left:-25px; top:5px; width:10px; height:10px; border-radius:50%; background:var(--inst-dorado);'></div>" +
  "<div style='font-size:0.8rem; color:var(--text-muted);'>" + new Date(ev.ts_evento).toLocaleString() + " - " + ev.operador + "</div>" +
  "<strong style='color:var(--inst-guinda);'>" + ev.tipo_evento + ":</strong> " + ev.descripcion +
  (ev.valor_nuevo && ev.tipo_evento === 'TRIAGE_CHANGE' ? " <span style='background:var(--bg-tertiary); padding:2px 5px; border-radius:3px;'>→ " + ev.valor_nuevo + "</span>" : "");
```

**DESPUÉS (SEGURO):**
```javascript
// Crear estructura con DOM API
const dot = document.createElement('div');
dot.style.cssText = 'position:absolute; left:-25px; top:5px; width:10px; height:10px; border-radius:50%; background:var(--inst-dorado);';

const meta = document.createElement('div');
meta.style.cssText = 'font-size:0.8rem; color:var(--text-muted);';
meta.textContent = `${new Date(ev.ts_evento).toLocaleString()} - ${ev.operador}`;

const content = document.createElement('div');
content.innerHTML = `<strong style='color:var(--inst-guinda);'>${ev.tipo_evento}:</strong> ${this.escapeHTML(ev.descripcion)}`;

if (ev.valor_nuevo && ev.tipo_evento === 'TRIAGE_CHANGE') {
  const span = document.createElement('span');
  span.style.cssText = 'background:var(--bg-tertiary); padding:2px 5px; border-radius:3px;';
  span.textContent = `→ ${ev.valor_nuevo}`;
  content.appendChild(span);
}

div.append(dot, meta, content);
```

#### Cambio 3: Agregar `escapeHTML()` helper

**Agregar en `src/js/app.js`:**
```javascript
/**
 * Escapa HTML para prevenir XSS
 * @param {string} str - String potencialmente inseguro
 * @returns {string} String escapado
 */
escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

#### Cambio 4: `dashboard.js:renderPatientTable()`

**ANTES (VULNERABLE):**
```javascript
tr.innerHTML = `
  <td style="padding:10px;">${p.id_interno.substring(0, 8)}</td>
  <td style="padding:10px; font-weight:bold;">${p.folio_local}</td>
  <td style="padding:10px; background-color:${tcolor}; color:${fcolor}; text-align:center; font-weight:bold; border-radius:4px;">${p.triage_actual}</td>
  <td style="padding:10px;">${p.edad_estimada || '-'}</td>
  <td style="padding:10px;">${p.sexo || '-'}</td>
  <td style="padding:10px;">${new Date(p.ts_ingreso).toLocaleString('es-MX')}</td>
  <td style="padding:10px;">${new Date(p.ts_ultima_mod).toLocaleString('es-MX')}</td>
`;
```

**DESPUÉS (SEGURO):**
```javascript
// Crear celdas con textContent
const createCell = (text, styles = '') => {
  const td = document.createElement('td');
  td.style.padding = '10px';
  if (styles) td.style.cssText = `padding:10px;${styles}`;
  td.textContent = text;
  return td;
};

tr.append(
  createCell(p.id_interno.substring(0, 8)),
  createCell(p.folio_local, 'font-weight:bold;'),
  createCell(p.triage_actual, `background-color:${tcolor}; color:${fcolor}; text-align:center; font-weight:bold; border-radius:4px;`),
  createCell(p.edad_estimada || '-'),
  createCell(p.sexo || '-'),
  createCell(new Date(p.ts_ingreso).toLocaleString('es-MX')),
  createCell(new Date(p.ts_ultima_mod).toLocaleString('es-MX'))
);
```

#### Pasos de Ejecución

1. **Audit inicial:**
   ```bash
   grep -n "innerHTML" src/js/app.js src/js/dashboard.js
   # Documentar todas las ocurrencias
   ```

2. **Backup:**
   ```bash
   cp src/js/app.js src/js/app.js.backup
   cp src/js/dashboard.js src/js/dashboard.js.backup
   ```

3. **Aplicar cambios:**
   - Modificar `app.js:renderPatientTable()` con DOM API
   - Modificar `app.js:renderTimeline()` con DOM API
   - Agregar `escapeHTML()` helper
   - Modificar `dashboard.js:renderPatientTable()` con DOM API

4. **Verificar:**
   ```bash
   npm run test:run
   ```

#### Criterios de Aceptación

- [ ] Zero usos de `innerHTML` con datos de usuario
- [ ] `escapeHTML()` implementado y usado
- [ ] Tests de XSS pasando (ver QA-01)
- [ ] Manual QA: abrir HTML en browser, verificar renderizado

#### Salida Esperada

**Archivos modificados:**
- `src/js/app.js`
- `src/js/dashboard.js`

**Archivos backup:**
- `src/js/app.js.backup`
- `src/js/dashboard.js.backup`

---

### EJECUTOR-03: DB MIGRATION PATH

**Prioridad:** P1
**Estimación:** 1.5 días
**Depende:** Nada
**Paralelo con:** EJECUTOR-01, EJECUTOR-02, DOCUMENTADOR-01

#### Especificación Técnica

**Archivo a crear:** `src/js/db-migrations.js`

```javascript
/**
 * Sistema de Migraciones de Base de Datos
 *
 * Permite versionar el schema y migrar datos existentes
 * cuando cambia la estructura de la base de datos.
 */

export const DB_SCHEMA_VERSION = 2;

/**
 * Mapa de versiones del schema
 * Cada versión tiene una función de migración
 */
const MIGRATIONS = {
  1: {
    version: 1,
    description: 'Schema inicial',
    up: (db) => {
      // Schema inicial ya existe en app.js:createSchema()
      // No requiere migración
    }
  },

  2: {
    version: 2,
    description: 'Agregar teléfono y contacto al paciente',
    up: (db) => {
      // Agregar columnas nuevas
      db.run(`ALTER TABLE pacientes ADD COLUMN telefono TEXT`);
      db.run(`ALTER TABLE pacientes ADD COLUMN contacto TEXT`);

      // Crear índice para búsqueda por teléfono
      db.run(`CREATE INDEX IF NOT EXISTS idx_pacientes_telefono ON pacientes(telefono)`);
    }
  }
};

/**
 * Obtiene la versión actual del schema desde la base de datos
 * @param {Object} db - Instancia de SQL.js
 * @returns {number} Versión actual (0 si no existe tabla de versión)
 */
export function getDBVersion(db) {
  try {
    const stmt = db.prepare('SELECT version FROM schema_info ORDER BY version DESC LIMIT 1');
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
export function createVersionTable(db) {
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
export function migrateDatabase(db) {
  const currentVersion = getDBVersion(db);
  const targetVersion = DB_SCHEMA_VERSION;

  console.log(`[DB Migration] Versión actual: ${currentVersion}, Target: ${targetVersion}`);

  if (currentVersion === targetVersion) {
    console.log('[DB Migration] Ya está en la última versión');
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
      db.run(
        'INSERT INTO schema_info (version, description, migrated_at) VALUES (?, ?, ?)',
        [v, MIGRATIONS[v].description, new Date().toISOString()]
      );

      console.log(`[DB Migration] ✅ Migración v${v} completada`);
    } catch (e) {
      console.error(`[DB Migration] ❌ Error en migración v${v}:`, e);
      throw e;
    }
  }

  const finalVersion = getDBVersion(db);
  console.log(`[DB Migration] ✅ Migraciones completadas. Versión final: ${finalVersion}`);

  return finalVersion;
}

/**
 * Exporta un backup de la base de datos antes de migrar
 * @param {Object} db - Instancia de SQL.js
 * @returns {Uint8Array} Binario de la base de datos
 */
export function backupDatabase(db) {
  const data = db.export();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup-pre-migration-${timestamp}.sqlite`;

  // En navegador: descargar blob
  const blob = new Blob([data], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
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
export function restoreDatabase(backupData, SQL) {
  return new SQL.Database(backupData);
}
```

#### Modificación a `src/js/app.js`

**Agregar después de `createSchema()`:**

```javascript
import { migrateDatabase, getDBVersion, backupDatabase } from './db-migrations.js';

// En initDatabase():
async initDatabase() {
  const SQL = await initSqlJs(config);

  const savedData = await this.loadFromIndexedDB();
  if (savedData) {
    this.db = new SQL.Database(savedData);

    // NUEVO: Ejecutar migraciones automáticas
    try {
      const oldVersion = getDBVersion(this.db);
      if (oldVersion < DB_SCHEMA_VERSION) {
        // Backup antes de migrar
        const backup = backupDatabase(this.db);

        // Ejecutar migraciones
        const newVersion = migrateDatabase(this.db);
        console.log(`Migración completada: v${oldVersion} → v${newVersion}`);

        // Guardar versión migrada
        this.saveToIndexedDB();
      }
    } catch (e) {
      console.error('Error en migración:', e);
      alert('Error migrando base de datos. Se descargó un backup automáticamente.');
      throw e;
    }

    console.log("Base de datos restaurada desde IndexedDB.");
  } else {
    this.db = new SQL.Database();
    this.createSchema();

    // NUEVO: Inicializar versión
    migrateDatabase(this.db);

    this.saveToIndexedDB();
    console.log("Base de datos nueva creada.");
  }

  this.checkSession();
}
```

#### Pasos de Ejecución

1. **Crear archivo de migraciones:**
   - Crear `src/js/db-migrations.js`

2. **Modificar app.js:**
   - Agregar imports de migraciones
   - Modificar `initDatabase()` para ejecutar `migrateDatabase()`

3. **Tests:**
   ```bash
   npm run test:run
   ```

#### Criterios de Aceptación

- [ ] `db-migrations.js` tiene `MIGRATIONS` map
- [ ] `migrateDatabase()` ejecuta upgrades secuenciales
- [ ] `backupDatabase()` descarga `.sqlite` file
- [ ] Tests de migration pasando (ver QA-01)

#### Salida Esperada

**Archivos creados:**
- `src/js/db-migrations.js`

**Archivos modificados:**
- `src/js/app.js`

---

### EJECUTOR-04: STORE PATTERN IMPLEMENTATION

**Prioridad:** P0 (CRÍTICO)
**Estimación:** 2 días
**Depende:** EJECUTOR-01 (tests setup)
**Paralelo con:** QA-01

#### Especificación Técnica

**Archivo a crear:** `src/js/store.js`

```javascript
/**
 * Observable Store Pattern
 *
 * Implementación ligera de state management reactivo
 * Sin dependencias externas, <100 LOC
 */

export class Store {
  #state;
  #listeners;
  #history;
  #maxHistory;

  /**
   * @param {Object} initialState - Estado inicial
   * @param {Object} options - Opciones de configuración
   * @param {number} options.maxHistory - Máximo de estados en history (default: 50)
   */
  constructor(initialState, options = {}) {
    this.#state = { ...initialState };
    this.#listeners = [];
    this.#history = [];
    this.#maxHistory = options.maxHistory || 50;
  }

  /**
   * Obtiene una copia del estado actual (inmutable)
   * @returns {Object} Copia del estado
   */
  getState() {
    return { ...this.#state };
  }

  /**
   * Actualiza el estado y notifica a los subscriptores
   * @param {Object|Function} updater - Objeto a mergear o función reducer
   */
  setState(updater) {
    const prevState = this.#state;

    // Calcular nuevo estado
    const newState = typeof updater === 'function'
      ? updater(prevState)
      : { ...prevState, ...updater };

    // Guardar en history antes de actualizar
    this.#history.push(prevState);
    if (this.#history.length > this.#maxHistory) {
      this.#history.shift();
    }

    // Actualizar estado
    this.#state = newState;

    // Notificar a los subscriptores
    this.#notify();
  }

  /**
   * Suscribe una función a los cambios de estado
   * @param {Function} listener - Función a ejecutar cuando cambie el estado
   * @returns {Function} Función para cancelar la suscripción
   */
  subscribe(listener) {
    this.#listeners.push(listener);

    // Ejecutar inmediatamente con estado actual
    listener(this.#state);

    // Retornar función de unsuscribe
    return () => {
      this.#listeners = this.#listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notifica a todos los subscriptores
   * @private
   */
  #notify() {
    this.#listeners.forEach(listener => {
      try {
        listener(this.#state);
      } catch (e) {
        console.error('[Store] Error en listener:', e);
      }
    });
  }

  /**
   * Viaja hacia atrás en el history
   * @param {number} steps - Cuántos pasos retroceder (default: 1)
   */
  timeTravel(steps = 1) {
    if (this.#history.length < steps) {
      console.warn('[Store] No hay suficiente history');
      return;
    }

    const targetState = this.#history[this.#history.length - steps];

    // Remover estados del history
    this.#history = this.#history.slice(0, this.#history.length - steps);

    // Restaurar estado
    this.#state = targetState;
    this.#notify();
  }

  /**
   * Obtiene el history completo (para debugging)
   * @returns {Array} Array de estados previos
   */
  getHistory() {
    return [...this.#history];
  }

  /**
   * Limpia el history
   */
  clearHistory() {
    this.#history = [];
  }
}

/**
 * Crea un store con estado inicial
 * @param {Object} initialState - Estado inicial
 * @returns {Store} Instancia del store
 */
export function createStore(initialState) {
  return new Store(initialState);
}

/**
 * Combina múltiples stores
 * @param  {...Store} stores - Stores a combinar
 * @returns {Object} Objeto con getState combinado
 */
export function combineStores(...stores) {
  return {
    getState() {
      return stores.reduce((acc, store, index) => {
        return {
          ...acc,
          [`store${index}`]: store.getState()
        };
      }, {});
    }
  };
}
```

#### Tests para Store (QA-01 trabajará en paralelo)

**Archivo a crear:** `tests/unit/store.test.js`

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { Store, createStore } from '@/js/store.js';

describe('Store Pattern', () => {
  let store;

  beforeEach(() => {
    store = createStore({ count: 0, name: 'Test' });
  });

  it('should return initial state', () => {
    expect(store.getState()).toEqual({ count: 0, name: 'Test' });
  });

  it('should update state with object', () => {
    store.setState({ count: 1 });
    expect(store.getState().count).toBe(1);
  });

  it('should update state with function', () => {
    store.setState(s => ({ count: s.count + 1 }));
    expect(store.getState().count).toBe(1);
  });

  it('should notify subscribers', () => {
    const listener = { fn: (state) => listener.state = state };
    store.subscribe(listener.fn);

    store.setState({ count: 5 });

    expect(listener.state.count).toBe(5);
  });

  it('should return unsubscribe function', () => {
    let callCount = 0;
    const unsubscribe = store.subscribe(() => callCount++);

    store.setState({ count: 1 });
    expect(callCount).toBe(1);

    unsubscribe();
    store.setState({ count: 2 });
    expect(callCount).toBe(1); // No se volvió a llamar
  });

  it('should maintain history', () => {
    store.setState({ count: 1 });
    store.setState({ count: 2 });
    store.setState({ count: 3 });

    const history = store.getHistory();
    expect(history).toHaveLength(3);
    expect(history[0]).toEqual({ count: 0, name: 'Test' });
    expect(history[2]).toEqual({ count: 2, name: 'Test' });
  });

  it('should time travel', () => {
    store.setState({ count: 1 });
    store.setState({ count: 2 });
    store.setState({ count: 3 });

    store.timeTravel(2);

    expect(store.getState().count).toBe(1);
  });
});
```

#### Pasos de Ejecución

1. **Crear store.js:**
   - Crear archivo `src/js/store.js`

2. **Tests en paralelo:**
   - QA-01 creará `tests/unit/store.test.js`
   - Ejecutar: `npm run test:run`

3. **Verificar:**
   ```bash
   npm run test:coverage
   # Debe mostrar >95% coverage para store.js
   ```

#### Criterios de Aceptación

- [ ] `Store` class tiene <100 LOC
- [ ] `getState()` retorna copia inmutable
- [ ] `setState()` acepta object y function
- [ ] `subscribe()` retorna unsubscribe function
- [ ] Tests unitarios pasando
- [ ] Coverage >95% para store.js

#### Salida Esperada

**Archivos creados:**
- `src/js/store.js`
- `tests/unit/store.test.js` (por QA-01)

---

### EJECUTOR-05: MIGRATE APP.JS TO STORE

**Prioridad:** P0
**Estimación:** 5 días
**Depende:** EJECUTOR-04 (Store implementado)
**Paralelo con:** EJECUTOR-06 (tras completar parcialmente)

#### Especificación Técnica

**Estrategia de Migración:**

1. Identificar estado global en `app.js`
2. Crear store inicial
3. Convertir métodos a actions
4. Convertir renders a componentes
5. Migrar HTML a usar componentes

#### Paso 1: Identificar Estado Global

**Estado actual en `app.js`:**
```javascript
const app = {
  db: null,                    // ← Estado
  session: {                   // ← Estado
    hospital: '',
    operador: '',
    rol: '',
    ingreso: null
  },
  currentPatientId: null,      // ← Estado
  // ... métodos
};
```

#### Paso 2: Crear Store Inicial

**Archivo a crear:** `src/js/app-store.js`

```javascript
import { Store } from './store.js';

/**
 * Store principal de ECE-DES
 */
export const appStore = new Store({
  // Base de datos SQLite
  db: null,

  // Sesión de usuario
  session: {
    hospital: '',
    operador: '',
    rol: '',
    ingreso: null
  },

  // Estado UI
  currentPatientId: null,
  view: 'login', // 'login' | 'app'

  // Datos de pacientes
  patients: [],

  // Censo (contadores)
  census: {
    rojo: 0,
    amarillo: 0,
    verde: 0,
    negro: 0
  },

  // Estado de carga
  loading: false,
  error: null
});

/**
 * Actions del Store
 */

// Action: Inicializar base de datos
export async function initDatabaseAction() {
  appStore.setState({ loading: true, error: null });

  try {
    const SQL = await initSqlJs({ locateFile: () => window.SQL_WASM_URI });
    const savedData = await loadFromIndexedDBAction();

    let db;
    if (savedData) {
      db = new SQL.Database(savedData);
      await runMigrationsAction(db);
    } else {
      db = new SQL.Database();
      createSchemaAction(db);
      await runMigrationsAction(db);
      await saveToIndexedDBAction(db);
    }

    appStore.setState({ db, loading: false });
    checkSessionAction();
  } catch (e) {
    appStore.setState({ error: e.message, loading: false });
    console.error('Error inicializando DB:', e);
  }
}

// Action: Login
export function loginAction(hospital, operador, pin) {
  if (!hospital || !operador || !pin) {
    alert("Llena todos los campos.");
    return;
  }

  appStore.setState(state => ({
    session: {
      ...state.session,
      hospital,
      operador
    },
    view: 'app'
  }));

  localStorage.setItem("ecedes_hospital", hospital);
  localStorage.setItem("ecedes_operador", operador);

  renderCensusAction();
}

// Action: Cargar pacientes desde DB
export function loadPatientsAction() {
  const { db } = appStore.getState();

  const patients = [];
  const stmt = db.prepare("SELECT * FROM pacientes ORDER BY ts_ingreso DESC");

  while (stmt.step()) {
    patients.push(stmt.getAsObject());
  }
  stmt.free();

  appStore.setState({ patients });

  return patients;
}

// Action: Calcular censo
export function calculateCensusAction() {
  const { db } = appStore.getState();
  const counts = { rojo: 0, amarillo: 0, verde: 0, negro: 0 };

  try {
    const stmt = db.prepare("SELECT triage_actual, COUNT(*) as c FROM pacientes GROUP BY triage_actual");

    while (stmt.step()) {
      const row = stmt.getAsObject();
      if (row.triage_actual === 'ROJO') counts.rojo = row.c;
      if (row.triage_actual === 'AMARILLO') counts.amarillo = row.c;
      if (row.triage_actual === 'VERDE') counts.verde = row.c;
      if (row.triage_actual === 'NEGRO') counts.negro = row.c;
    }
    stmt.free();

    appStore.setState({ census: counts });
  } catch (e) {
    console.error('Error calculando censo:', e);
  }

  return counts;
}

// Action: Registrar nuevo paciente
export function registerPatientAction(nombre, triage) {
  const { db, session } = appStore.getState();

  const stmt = db.prepare("SELECT count(*) as total FROM pacientes");
  stmt.step();
  const count = stmt.getAsObject().total + 1;
  stmt.free();

  const folioStr = "P-" + count.toString().padStart(3, '0');
  const internalId = generateUUID();
  const ts = new Date().toISOString();

  try {
    db.run(
      "INSERT INTO pacientes (id_interno, folio_local, nombre, triage_inicial, triage_actual, estado, ts_ingreso, operador_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [internalId, folioStr, nombre || 'NN', triage, triage, 'ACTIVO', ts, session.operador]
    );

    db.run(
      "INSERT INTO trazabilidad (id_paciente, ts_evento, tipo_evento, descripcion, valor_nuevo, operador) VALUES (?, ?, ?, ?, ?, ?)",
      [internalId, ts, 'INGRESO', 'Registro inicial START', triage, session.operador]
    );

    saveToIndexedDBAction(db);
    loadPatientsAction();
    calculateCensusAction();
  } catch (e) {
    console.error('Error registrando paciente:', e);
    alert("Error registrando paciente");
  }
}

// Helpers
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function loadFromIndexedDBAction() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ECEDES_DB", 1);
    request.onupgradeneeded = (e) => {
      const idb = e.target.result;
      if (!idb.objectStoreNames.contains("sqlite_backup")) {
        idb.createObjectStore("sqlite_backup");
      }
    };
    request.onsuccess = (e) => {
      const idb = e.target.result;
      const tx = idb.transaction("sqlite_backup", "readonly");
      const store = tx.objectStore("sqlite_backup");
      const getReq = store.get("latest");
      getReq.onsuccess = () => {
        idb.close();
        resolve(getReq.result);
      };
      getReq.onerror = () => { idb.close(); resolve(null); };
    };
    request.onerror = (e) => resolve(null);
  });
}

async function saveToIndexedDBAction(db) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ECEDES_DB", 1);
    request.onupgradeneeded = (e) => {
      const idb = e.target.result;
      if (!idb.objectStoreNames.contains("sqlite_backup")) {
        idb.createObjectStore("sqlite_backup");
      }
    };
    request.onsuccess = (e) => {
      const idb = e.target.result;
      const tx = idb.transaction("sqlite_backup", "readwrite");
      const store = tx.objectStore("sqlite_backup");
      const data = db.export();
      store.put(data, "latest");
      tx.oncomplete = () => { idb.close(); resolve(); };
      tx.onerror = (err) => { reject(err); };
    };
    request.onerror = (e) => reject(e);
  });
}

function createSchemaAction(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS pacientes (
      id_interno TEXT PRIMARY KEY,
      folio_local TEXT UNIQUE,
      nombre TEXT,
      nss TEXT,
      edad_estimada INTEGER,
      sexo TEXT CHECK(sexo IN ('M','F','I')),
      pulsera_id TEXT,
      discapacidad TEXT,
      triage_inicial TEXT,
      triage_actual TEXT,
      area_actual TEXT,
      estado TEXT,
      procedencia TEXT,
      ts_ingreso TEXT NOT NULL,
      ts_ultima_mod TEXT,
      operador_registro TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS trazabilidad (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_paciente TEXT NOT NULL REFERENCES pacientes(id_interno),
      ts_evento TEXT NOT NULL,
      tipo_evento TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      valor_anterior TEXT,
      valor_nuevo TEXT,
      operador TEXT NOT NULL,
      area TEXT
    );

    CREATE TABLE IF NOT EXISTS operadores (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      rol TEXT NOT NULL,
      turno TEXT,
      pin_hash TEXT,
      activo INTEGER DEFAULT 1,
      ts_login TEXT
    );

    CREATE TABLE IF NOT EXISTS auditoria (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts TEXT NOT NULL,
      operador TEXT NOT NULL,
      accion TEXT NOT NULL,
      tabla_ref TEXT,
      id_ref TEXT,
      detalle TEXT
    );
  `);
}

function checkSessionAction() {
  const savedHospital = localStorage.getItem("ecedes_hospital");
  const savedOperador = localStorage.getItem("ecedes_operador");

  if (savedHospital && savedOperador) {
    appStore.setState(state => ({
      session: {
        ...state.session,
        hospital: savedHospital,
        operador: savedOperador
      },
      view: 'app'
    }));

    renderCensusAction();
  }
}

function renderCensusAction() {
  calculateCensusAction();
  loadPatientsAction();
}

async function runMigrationsAction(db) {
  const { migrateDatabase } = await import('./db-migrations.js');
  migrateDatabase(db);
}
```

#### Paso 3: Crear Componentes Reactivos

**Archivo a crear:** `src/js/components/CensusComponent.js`

```javascript
import { appStore } from '../app-store.js';

/**
 * Componente de Censo - Panel de contadores
 * @param {HTMLElement} container - Elemento contenedor
 * @returns {Function} Función para limpiar (unsubscribe)
 */
export function CensusComponent(container) {
  // Render inicial
  render(appStore.getState());

  // Suscribir a cambios
  const unsubscribe = appStore.subscribe((state) => {
    // Solo re-render si cambió el censo
    if (shouldUpdate(state)) {
      render(state);
    }
  });

  return unsubscribe;

  function render(state) {
    const { census } = state;

    container.innerHTML = `
      <div class="census-panel" style="display:flex; justify-content: space-around; text-align: center; margin-bottom: 15px;">
        <div class="census-item">
          <div class="count-rojo" style="color:var(--fn-rojo); font-size: 2rem; font-weight:bold;">
            ${census.rojo}
          </div>
          <div>◆ ROJO</div>
        </div>
        <div class="census-item">
          <div class="count-amarillo" style="color:var(--fn-amarillo); font-size: 2rem; font-weight:bold;">
            ${census.amarillo}
          </div>
          <div>▲ AMARILLLO</div>
        </div>
        <div class="census-item">
          <div class="count-verde" style="color:var(--fn-verde); font-size: 2rem; font-weight:bold;">
            ${census.verde}
          </div>
          <div>● VERDE</div>
        </div>
        <div class="census-item">
          <div class="count-negro" style="color:var(--fn-negro); font-size: 2rem; font-weight:bold;">
            ${census.negro}
          </div>
          <div>✚ NEGRO</div>
        </div>
      </div>
    `;
  }

  function shouldUpdate(newState) {
    // Optimización: solo re-render si cambió el censo
    const oldCensus = container._lastCensus;
    if (!oldCensus) return true;

    return (
      oldCensus.rojo !== newState.census.rojo ||
      oldCensus.amarillo !== newState.census.amarillo ||
      oldCensus.verde !== newState.census.verde ||
      oldCensus.negro !== newState.census.negro
    );
  }
}
```

**Archivo a crear:** `src/js/components/PatientTableComponent.js`

```javascript
import { appStore } from '../app-store.js';

/**
 * Componente de Tabla de Pacientes
 * @param {HTMLElement} container - Elemento contenedor
 * @returns {Function} Función para limpiar
 */
export function PatientTableComponent(container) {
  render(appStore.getState());
  const unsubscribe = appStore.subscribe((state) => {
    render(state);
  });
  return unsubscribe;

  function render(state) {
    const { patients } = state;
    const tbody = container.querySelector('tbody') || document.createElement('tbody');

    tbody.innerHTML = '';

    patients.forEach(patient => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--border-light)';

      // Usar textContent para seguridad XSS
      const tdFolio = document.createElement('td');
      tdFolio.style.padding = '10px';
      tdFolio.textContent = patient.folio_local;

      const tdNombre = document.createElement('td');
      tdNombre.style.padding = '10px';
      tdNombre.style.fontWeight = 'bold';
      tdNombre.textContent = patient.nombre || 'NN';

      const tdTriage = document.createElement('td');
      tdTriage.style.padding = '10px';
      tdTriage.innerHTML = renderTriageBadge(patient.triage_actual);

      const tdArea = document.createElement('td');
      tdArea.style.padding = '10px';
      tdArea.textContent = patient.area_actual || '-';

      const tdIngreso = document.createElement('td');
      tdIngreso.style.padding = '10px';
      tdIngreso.textContent = new Date(patient.ts_ingreso).toLocaleTimeString();

      const tdAccion = document.createElement('td');
      tdAccion.style.padding = '10px';
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.style.cssText = 'background:var(--inst-dorado); color:white; padding:5px 10px; font-size:0.8rem;';
      btn.textContent = 'VER DETALLE';
      btn.onclick = () => openExpedienteAction(patient.id_interno);
      tdAccion.appendChild(btn);

      tr.append(tdFolio, tdNombre, tdTriage, tdArea, tdIngreso, tdAccion);
      tbody.appendChild(tr);
    });

    if (!container.querySelector('tbody')) {
      container.appendChild(tbody);
    }
  }

  function renderTriageBadge(triage) {
    const colors = {
      'ROJO': '#C41E3A',
      'AMARILLO': '#D4940A',
      'VERDE': '#1B7340',
      'NEGRO': '#1A1A2E'
    };
    const symbols = {
      'ROJO': '◆',
      'AMARILLO': '▲',
      'VERDE': '●',
      'NEGRO': '✚'
    };
    const color = colors[triage] || '#666';
    const symbol = symbols[triage] || '?';
    return `<span style="color:${color}">${symbol} ${triage}</span>`;
  }
}

function openExpedienteAction(patientId) {
  appStore.setState({ currentPatientId: patientId });
  // TODO: Mostrar modal de expediente
}
```

#### Paso 4: Actualizar HTML

**Modificar `src/index.html`:**

```html
<!DOCTYPE html>
<html lang="es-MX">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ECE-DES | Expediente Clínico de Desastres</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <!-- APP -->
  <div id="app"></div>

  <!-- MODAL DE EXPEDIENTE -->
  <div id="modal-expediente" class="hidden">
    <!-- TODO: Implementar modal -->
  </div>

  <!-- SCRIPTS -->
  <script type="module">
    import { appStore, initDatabaseAction } from './js/app-store.js';
    import { CensusComponent } from './js/components/CensusComponent.js';
    import { PatientTableComponent } from './js/components/PatientTableComponent.js';

    // Inicializar componentes
    const censusContainer = document.getElementById('census-container');
    const tableContainer = document.getElementById('table-container');

    CensusComponent(censusContainer);
    PatientTableComponent(tableContainer);

    // Inicializar app
    initDatabaseAction();
  </script>

  <!-- NOTA: sql.js y xlsx se cargarán via esbuild bundle -->
</body>
</html>
```

#### Pasos de Ejecución

1. **Crear app-store.js:**
   - Crear `src/js/app-store.js` con store y actions

2. **Crear componentes:**
   - Crear `src/js/components/CensusComponent.js`
   - Crear `src/js/components/PatientTableComponent.js`

3. **Modificar HTML:**
   - Actualizar `src/index.html` para usar `<script type="module">`

4. **Tests:**
   ```bash
   npm run test:coverage
   # Debe mantener >85% coverage
   ```

#### Criterios de Aceptación

- [ ] `app-store.js` tiene todas las actions
- [ ] Componentes son funciones puras
- [ ] HTML usa `<script type="module">`
- [ ] No hay estado global mutable
- [ ] Tests pasando
- [ ] Manual QA: App funciona en browser

#### Salida Esperada

**Archivos creados:**
- `src/js/app-store.js`
- `src/js/components/CensusComponent.js`
- `src/js/components/PatientTableComponent.js`

**Archivos modificados:**
- `src/index.html`

**Archivos deprecados:**
- `src/js/app.js` → renombrar a `app.js.legacy`

---

### EJECUTOR-06: MIGRATE DASHBOARD.JS TO STORE

**Prioridad:** P1
**Estimación:** 3 días
**Depende:** EJECUTOR-05
**Paralelo con:** EJECUTOR-07

#### Especificación Técnica

**Estrategia similar a EJECUTOR-05 pero para dashboard:**

1. Crear `src/js/dashboard-store.js`
2. Migrar lógica a actions
3. Crear componentes

**Archivo a crear:** `src/js/dashboard-store.js`

```javascript
import { Store } from './store.js';

/**
 * Store del Dashboard
 */
export const dashStore = new Store({
  db: null,
  kpis: {
    total: 0,
    critical: 0,
    actions: 0
  },
  triageData: {
    ROJO: 0,
    AMARILLO: 0,
    VERDE: 0,
    NEGRO: 0
  },
  latestEvents: [],
  patients: [],
  loading: false,
  error: null
});

/**
 * Actions
 */

export async function initDashboardAction() {
  dashStore.setState({ loading: true });

  try {
    const SQL = await initSqlJs({ locateFile: () => window.SQL_WASM_URI });
    const dbData = await loadDatabaseAction();

    if (!dbData) {
      dashStore.setState({
        error: 'No hay datos. Abre ECE-DES primero.',
        loading: false
      });
      return;
    }

    const db = new SQL.Database(dbData);
    dashStore.setState({ db });

    await loadKPIsAction(db);
    await loadTriageDataAction(db);
    await loadLatestEventsAction(db);
    await loadPatientsAction(db);

    dashStore.setState({ loading: false });
  } catch (e) {
    dashStore.setState({ error: e.message, loading: false });
  }
}

async function loadDatabaseAction() {
  return new Promise((resolve) => {
    const request = indexedDB.open("ECEDES_DB", 1);
    request.onsuccess = (e) => {
      const idb = e.target.result;
      const tx = idb.transaction(["sqlite_backup"], "readonly");
      const store = tx.objectStore("sqlite_backup");
      const req = store.get("latest");
      req.onsuccess = () => {
        idb.close();
        resolve(req.result);
      };
      req.onerror = () => { idb.close(); resolve(null); };
    };
    request.onerror = () => resolve(null);
  });
}

async function loadKPIsAction(db) {
  const kpis = { total: 0, critical: 0, actions: 0 };

  try {
    const stmt = db.prepare("SELECT COUNT(*) as t FROM pacientes;");
    stmt.step();
    kpis.total = stmt.getAsObject().t;
    stmt.free();

    const stmt2 = db.prepare("SELECT COUNT(*) as cr FROM pacientes WHERE triage_actual='ROJO';");
    stmt2.step();
    kpis.critical = stmt2.getAsObject().cr;
    stmt2.free();

    const stmt3 = db.prepare("SELECT COUNT(*) as tr FROM trazabilidad;");
    stmt3.step();
    kpis.actions = stmt3.getAsObject().tr;
    stmt3.free();

    dashStore.setState({ kpis });
  } catch (e) {
    console.error('Error cargando KPIs:', e);
  }
}

async function loadTriageDataAction(db) {
  const triageData = { ROJO: 0, AMARILLO: 0, VERDE: 0, NEGRO: 0 };

  try {
    const stmt = db.prepare("SELECT triage_actual, COUNT(*) as c FROM pacientes GROUP BY triage_actual");
    while (stmt.step()) {
      const row = stmt.getAsObject();
      if (triageData[row.triage_actual] !== undefined) {
        triageData[row.triage_actual] = row.c;
      }
    }
    stmt.free();

    dashStore.setState({ triageData });
  } catch (e) {
    console.error('Error cargando triage data:', e);
  }
}

async function loadLatestEventsAction(db) {
  const events = [];

  try {
    const stmt = db.prepare("SELECT * FROM trazabilidad ORDER BY ts_evento DESC LIMIT 10");
    while (stmt.step()) {
      events.push(stmt.getAsObject());
    }
    stmt.free();

    dashStore.setState({ latestEvents: events });
  } catch (e) {
    console.error('Error cargando eventos:', e);
  }
}

async function loadPatientsAction(db) {
  const patients = [];

  try {
    const stmt = db.prepare("SELECT * FROM pacientes ORDER BY ts_ingreso DESC");
    while (stmt.step()) {
      patients.push(stmt.getAsObject());
    }
    stmt.free();

    dashStore.setState({ patients });
  } catch (e) {
    console.error('Error cargando pacientes:', e);
  }
}
```

#### Pasos de Ejecución

1. **Crear dashboard-store.js**
2. **Crear componentes del dashboard**
3. **Actualizar HTML**
4. **Tests**

#### Criterios de Aceptación

- [ ] `dashStore` es una instancia de `Store`
- [ ] Actions son asíncronas
- [ ] Componentes reactivos implementados
- [ ] Tests pasando

#### Salida Esperada

**Archivos creados:**
- `src/js/dashboard-store.js`
- `src/js/components/DashboardKPIsComponent.js`
- `src/js/components/TriageChartComponent.js`

**Archivos modificados:**
- `src/dashboard.html`

---

### EJECUTOR-07: COMMON MODULE EXTRACTION

**Prioridad:** P1
**Estimación:** 2 días
**Depende:** EJECUTOR-05, EJECUTOR-06
**Paralelo con:** EJECUTOR-08

#### Especificación Técnica

**Archivo a crear:** `src/js/common.js`

```javascript
/**
 * Módulo de utilidades compartidas
 * Extraídas de app.js y dashboard.js
 */

/**
 * Genera UUID v4
 * @returns {string} UUID en formato xxxxxxxx-xxxx-4xxx-yxxx
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Formatea fecha ISO a local español
 * @param {string} isoString - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
export function formatDateTime(isoString) {
  return new Date(isoString).toLocaleString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Colores oficiales de triage según tokens v2.0
 * @constant {Object}
 */
export const TRIAGE_COLORS = {
  ROJO: '#C41E3A',
  AMARILLO: '#D4940A',
  VERDE: '#1B7340',
  NEGRO: '#1A1A2E'
};

/**
 * Símbolos Unicode de triage (doble codificación color + forma)
 * @constant {Object}
 */
export const TRIAGE_SYMBOLS = {
  ROJO: '◆',  // U+25C6 Black Diamond
  AMARILLO: '▲', // U+25B2 Black Up-Pointing Triangle
  VERDE: '●', // U+25CF Black Circle
  NEGRO: '✚'  // U+2715 Heavy Multiplication X
};

/**
 * Escapa HTML para prevenir XSS
 * @param {string} str - String potencialmente inseguro
 * @returns {string} String escapado
 */
export function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Genera badge HTML de triage
 * @param {string} triage - ROJO|AMARILLO|VERDE|NEGRO
 * @returns {string} HTML del badge
 */
export function renderTriageBadge(triage) {
  const color = TRIAGE_COLORS[triage];
  const symbol = TRIAGE_SYMBOLS[triage];
  return `<span style="color:${color}">${symbol} ${triage}</span>`;
}

/**
 * Crea un elemento TD con estilos
 * @param {string} text - Contenido de texto
 * @param {string} styles - Estilos CSS (opcional)
 * @returns {HTMLTableCellElement}
 */
export function createTD(text, styles = '') {
  const td = document.createElement('td');
  td.style.padding = '10px';
  if (styles) td.style.cssText = `padding:10px;${styles}`;
  td.textContent = text;
  return td;
}

/**
 * Crea un elemento button con estilos
 * @param {string} text - Texto del botón
 * @param {Function} onClick - Handler de click
 * @param {string} styles - Estilos CSS (opcional)
 * @returns {HTMLButtonElement}
 */
export function createButton(text, onClick, styles = '') {
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = text;
  btn.onclick = onClick;
  if (styles) btn.style.cssText = styles;
  return btn;
}

/**
 * Muestra un mensaje de error al usuario
 * @param {string} message - Mensaje de error
 */
export function showError(message) {
  alert(`❌ Error: ${message}`);
  console.error('[App Error]', message);
}

/**
 * Muestra un mensaje de éxito al usuario
 * @param {string} message - Mensaje de éxito
 */
export function showSuccess(message) {
  alert(`✅ ${message}`);
  console.log('[App Success]', message);
}
```

#### Pasos de Ejecución

1. **Crear common.js**
2. **Actualizar imports en app-store.js**
3. **Actualizar imports en dashboard-store.js**
4. **Tests**

#### Criterios de Aceptación

- [ ] `common.js` tiene todas las utilidades
- [ ] No hay código duplicado entre app y dashboard
- [ ] Tests de common.js pasando
- [ ] Coverage >90% para common.js

#### Salida Esperada

**Archivos creados:**
- `src/js/common.js`
- `tests/unit/common.test.js`

**Archivos modificados:**
- `src/js/app-store.js`
- `src/js/dashboard-store.js`

---

### EJECUTOR-08: SHARED DEPENDENCIES BUNDLE

**Prioridad:** P1
**Estimación:** 3 días
**Depende:** EJECUTOR-07
**Paralelo con:** EJECUTOR-09 (preparación)

#### Especificación Técnica

**Estrategia:** Crear un bundle compartido con WASM y XLSX

**Archivo a crear:** `src/shared.html`

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Shared Dependencies - CVOED-TOOLS</title>
</head>
<body>
  <!-- SHARED DEPENDENCIES -->
  <script>
    // sql.js WASM (base64 encoded)
    window.SQL_WASM_URI = "data:application/wasm;base64,<!-- BASE64 DEL WASM -->";
  </script>
  <script>
    // sql.js (inline)
    <!-- CONTENIDO DE sql-wasm.js -->
  </script>
  <script>
    // SheetJS (inline)
    <!-- CONTENIDO DE xlsx.full.min.js -->
  </script>

  <!-- SHARED CSS TOKENS -->
  <style>
    :root {
      /* Tokens v2.0 */
      --inst-guinda: #691C32;
      --fn-rojo: #C41E3A;
      /* ... resto de tokens */
    }
  </style>
</body>
</html>
```

**Script para generar shared.html:**

**Archivo a crear:** `scripts/build-shared.js`

```javascript
const fs = require('fs');
const path = require('path');

function buildShared() {
  console.log('Building shared dependencies...');

  // Leer WASM
  const wasmPath = path.join(__dirname, '../src/js/sql-wasm.wasm');
  const wasmBuffer = fs.readFileSync(wasmPath);
  const wasmBase64 = wasmBuffer.toString('base64');

  // Leer sql.js
  const sqlJsPath = path.join(__dirname, '../src/js/sql-wasm.js');
  const sqlJsContent = fs.readFileSync(sqlJsPath, 'utf8');

  // Leer xlsx
  const xlsxPath = path.join(__dirname, '../src/js/xlsx.full.min.js');
  const xlsxContent = fs.readFileSync(xlsxPath, 'utf8');

  // Leer CSS tokens
  const cssPath = path.join(__dirname, '../src/css/style.css');
  const cssTokens = fs.readFileSync(cssPath, 'utf8')
    .match(/:root \{[\s\S]*?\}/)[0];

  // Generar HTML
  const sharedHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Shared Dependencies - CVOED-TOOLS</title>
  <style>
${cssTokens}
  </style>
</head>
<body>
  <script>
    window.SQL_WASM_URI = "data:application/wasm;base64,${wasmBase64}";
  </script>
  <script>
    ${sqlJsContent}
  </script>
  <script>
    ${xlsxContent}
  </script>
</body>
</html>`;

  // Escribir
  const outputPath = path.join(__dirname, '../dist/shared.html');
  fs.writeFileSync(outputPath, sharedHTML);

  console.log(`✅ Shared bundle created: ${outputPath}`);
  console.log(`   Size: ${(sharedHTML.length / 1024 / 1024).toFixed(2)} MB`);
}

buildShared();
```

#### Pasos de Ejecución

1. **Crear script de build**
2. **Ejecutar: `node scripts/build-shared.js`**
3. **Verificar tamaño**
4. **Actualizar HTML files para usar shared**

#### Criterios de Aceptación

- [ ] `shared.html` creado en `dist/`
- [ ] Tamaño <2MB
- [ ] ECE-DES.html usa shared
- [ ] Dashboard.html usa shared

#### Salida Esperada

**Archivos creados:**
- `scripts/build-shared.js`
- `dist/shared.html`

**Archivos modificados:**
- `dist/ECE-DES.html`
- `dist/ECE-DES-Dashboard.html`

---

### EJECUTOR-09: ESBUILD SETUP

**Prioridad:** P1
**Estimación:** 2 días
**Depende:** EJECUTOR-08
**Paralelo con:** QA-03

#### Especificación Técnica

**Archivo a crear:** `esbuild.config.js`

```javascript
import esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import { readFileSync } from 'fs';

// Configuración compartida
const baseConfig = {
  bundle: true,
  minify: true,
  sourcemap: 'external',
  target: ['es2020'],
  format: 'esm', // ES Modules
  platform: 'browser',
  loader: {
    '.wasm': 'binary'
  }
};

// Leer WASM y convertir a Base64
const wasmPath = './src/js/sql-wasm.wasm';
const wasmBuffer = readFileSync(wasmPath);
const wasmBase64 = wasmBuffer.toString('base64');
const wasmDataURI = `data:application/wasm;base64,${wasmBase64}`;

// Build app.js
async function buildApp() {
  await esbuild.build({
    ...baseConfig,
    entryPoints: ['./src/js/app-store.js'],
    outfile: './dist/js/app.min.js',
    define: {
      'window.SQL_WASM_URI': JSON.stringify(wasmDataURI)
    },
    plugins: [
      copy({
        assets: [{
          from: './src/css/style.css',
          to: './dist/css/'
        }]
      })
    ]
  });
  console.log('✅ app.min.js built');
}

// Build dashboard.js
async function buildDashboard() {
  await esbuild.build({
    ...baseConfig,
    entryPoints: ['./src/js/dashboard-store.js'],
    outfile: './dist/js/dash.min.js',
    define: {
      'window.SQL_WASM_URI': JSON.stringify(wasmDataURI)
    }
  });
  console.log('✅ dash.min.js built');
}

// Build common.js
async function buildCommon() {
  await esbuild.build({
    ...baseConfig,
    entryPoints: ['./src/js/common.js'],
    outfile: './dist/js/common.min.js'
  });
  console.log('✅ common.min.js built');
}

// Build todos
async function build() {
  try {
    await Promise.all([
      buildApp(),
      buildDashboard(),
      buildCommon()
    ]);
    console.log('✅ All builds completed');
  } catch (e) {
    console.error('❌ Build failed:', e);
    process.exit(1);
  }
}

build();
```

**Modificar `package.json`:**

```json
{
  "scripts": {
    "build": "node esbuild.config.js",
    "build:watch": "node esbuild.config.js --watch",
    "build:dev": "node esbuild.config.js --sourcemap"
  },
  "devDependencies": {
    "esbuild": "^0.19.0",
    "esbuild-plugin-copy": "^2.0.0"
  }
}
```

#### Pasos de Ejecución

1. **Instalar esbuild**
2. **Crear esbuild.config.js**
3. **Ejecutar `npm run build`**
4. **Verificar output**

#### Criterios de Aceptación

- [ ] `npm run build` ejecuta sin errores
- [ ] `dist/js/app.min.js` creado
- [ ] `dist/js/dash.min.js` creado
- [ ] Source maps generados
- [ ] Build time <1s

#### Salida Esperada

**Archivos creados:**
- `esbuild.config.js`
- `dist/js/app.min.js`
- `dist/js/app.min.js.map`
- `dist/js/dash.min.js`
- `dist/js/dash.min.js.map`

**Archivos modificados:**
- `package.json`

---

### EJECUTOR-10: BUILD SCRIPTS INTEGRATION

**Prioridad:** P2
**Estimación:** 2 días
**Depende:** EJECUTOR-09
**Paralelo con:** QA-03

#### Especificación Técnica

**Archivo a crear:** `scripts/verify-bundle-size.js`

```javascript
const fs = require('fs');
const path = require('path');

const limits = {
  'dist/ECE-DES.html': { max: 1000000 }, // 1MB target
  'dist/ECE-DES-Dashboard.html': { max: 500000 }, // 500KB target
  'dist/js/app.min.js': { max: 200000 }, // 200KB target
  'dist/js/dash.min.js': { max: 150000 } // 150KB target
};

function verifyBundleSize() {
  let passed = true;

  Object.entries(limits).forEach(([file, limit]) => {
    const filePath = path.join(__dirname, '..', file);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  ${file}: Not found (skipping)`);
      return;
    }

    const size = fs.statSync(filePath).size;
    const sizeKB = (size / 1024).toFixed(0);
    const sizeMB = (size / 1024 / 1024).toFixed(2);

    if (size > limit.max) {
      console.log(`❌ ${file}: ${sizeKB}KB (${sizeMB}MB) exceeds limit ${limit.max} bytes`);
      passed = false;
    } else {
      console.log(`✅ ${file}: ${sizeKB}KB (${sizeMB}MB)`);
    }
  });

  if (!passed) {
    console.error('\n❌ Bundle size verification failed');
    process.exit(1);
  } else {
    console.log('\n✅ All bundles within size limits');
  }
}

verifyBundleSize();
```

**Modificar `package.json`:**

```json
{
  "scripts": {
    "verify": "node scripts/verify-bundle-size.js",
    "prebuild": "npm run verify",
    "postbuild": "npm run verify"
  }
}
```

#### Pasos de Ejecución

1. **Crear verify script**
2. **Ejecutar `npm run verify`**
3. **Integrar en build**

#### Criterios de Aceptación

- [ ] `npm run verify` valida tamaños
- [ ] Pre-build check ejecuta
- [ ] Post-build check ejecuta
- [ ] Falla si excede límite

#### Salida Esperada

**Archivos creados:**
- `scripts/verify-bundle-size.js`

**Archivos modificados:**
- `package.json`

---

### EJECUTOR-11: ACCESSIBILITY FIXES

**Prioridad:** P2
**Estimación:** 2 días
**Depende:** EJECUTOR-10
**Paralelo con:** EJECUTOR-12, QA-04

#### Especificación Técnica

**Instalar axe-core:**
```bash
npm install --save-dev @axe-core/cli
```

**Ejecutar auditoría:**
```bash
npx axe dist/*.html --tags wcag2aa
```

**Correcciones típicas:**

1. **Agregar ARIA labels a botones:**
   ```html
   <!-- ANTES -->
   <button onclick="app.printPatientBadge()">🖨️</button>

   <!-- DESPUÉS -->
   <button
     onclick="app.printPatientBadge()"
     aria-label="Imprimir brazalete del paciente">
     🖨️ <span class="sr-only">Imprimir</span>
   </button>
   ```

2. **Agregar .sr-only class:**
   ```css
   .sr-only {
     position: absolute;
     width: 1px;
     height: 1px;
     padding: 0;
     margin: -1px;
     overflow: hidden;
     clip: rect(0, 0, 0, 0);
     white-space: nowrap;
     border-width: 0;
   }
   ```

3. **Keyboard navigation:**
   ```javascript
   // Agregar handlers de teclado
   element.addEventListener('keydown', (e) => {
     if (e.key === 'Enter' || e.key === ' ') {
       e.preventDefault();
       // Ejecutar acción
     }
   });
   ```

#### Pasos de Ejecución

1. **Instalar axe-core**
2. **Ejecutar auditoría**
3. **Documentar violaciones**
4. **Aplicar fixes**
5. **Re-auditar**

#### Criterios de Aceptación

- [ ] `axe` reporta 0 violaciones críticas
- [ ] Todos los botones tienen aria-label
- [ ] Keyboard navigation funciona
- [ ] Screen reader announcements presentes

#### Salida Esperada

**Archivos modificados:**
- Todos los archivos HTML
- CSS (agregar .sr-only)

---

### EJECUTOR-12: ERROR HANDLING

**Prioridad:** P2
**Estimación:** 1 día
**Depende:** EJECUTOR-10
**Paralelo con:** EJECUTOR-11

#### Especificación Técnica

**Global error handler:**

```javascript
// Agregar en app-store.js
window.addEventListener('error', (event) => {
  const error = {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack,
    timestamp: new Date().toISOString()
  };

  // Loggear IndexedDB
  logToIndexedDB('ERROR', error);

  // Mostrar al usuario
  showUserFriendlyError(error.message);
});

window.addEventListener('unhandledrejection', (event) => {
  const error = {
    reason: event.reason,
    promise: event.promise,
    timestamp: new Date().toISOString()
  };

  logToIndexedDB('UNHANDLED_REJECTION', error);
  showUserFriendlyError('Error en operación asíncrona');
});

function showUserFriendlyError(message) {
  const existing = document.getElementById('error-banner');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.id = 'error-banner';
  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: var(--fn-rojo);
    color: white;
    padding: 1rem;
    z-index: 9999;
    text-align: center;
  `;
  banner.textContent = `Error: ${message}`;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.marginLeft = '1rem';
  closeBtn.onclick = () => banner.remove();
  banner.appendChild(closeBtn);

  document.body.appendChild(banner);
}

function logToIndexedDB(type, data) {
  const request = indexedDB.open("ECEDES_LOGS", 1);
  request.onupgradeneeded = (e) => {
    const idb = e.target.result;
    if (!idb.objectStoreNames.contains("logs")) {
      idb.createObjectStore("logs", { keyPath: "timestamp" });
    }
  };
  request.onsuccess = (e) => {
    const idb = e.target.result;
    const tx = idb.transaction("logs", "readwrite");
    const store = tx.objectStore("logs");
    store.add({ type, ...data });
  };
}
```

**Retry wrapper para IndexedDB:**

```javascript
async function retryOperation(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000; // Exponential backoff
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

#### Pasos de Ejecución

1. **Agregar global error handlers**
2. **Implementar retry wrapper**
3. **Usar retry en IndexedDB operations**

#### Criterios de Aceptación

- [ ] Global error handler implementado
- [ ] Retry wrapper funciona
- [ ] Errores se loguean en IndexedDB
- [ ] Errores se muestran al usuario

#### Salida Esperada

**Archivos modificados:**
- `src/js/app-store.js`
- `src/js/dashboard-store.js`

---

## 3. AGENTE QA

### ROL Y RESPONSABILIDADES

**Misión:** Asegurar calidad del código a través de tests exhaustivos.

**Autoridad:**
- ✅ Crear/modificar archivos en `/tests/`
- ✅ Ejecutar `npm test`
- ✅ Reportar bugs a EJECUTOR
- ❌ NO modificar `/src/` (solo reportar)

**Métricas de Éxito:**
- Test coverage >85%
- Zero bugs críticos en producción
- Todos los tests pasando

---

### QA-01: UNIT TESTS FOR STORE

**Prioridad:** P0
**Estimación:** 1 día
**Depende:** EJECUTOR-04
**Paralelo con:** EJECUTOR-05

#### Especificación de Tests

**Archivo a crear:** `tests/unit/store.test.js`

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Store, createStore } from '@/js/store.js';

describe('Store Pattern', () => {
  let store;

  beforeEach(() => {
    store = createStore({ count: 0, user: null });
  });

  describe('getState', () => {
    it('should return initial state', () => {
      expect(store.getState()).toEqual({ count: 0, user: null });
    });

    it('should return immutable copy', () => {
      const state1 = store.getState();
      state1.count = 999;
      const state2 = store.getState();
      expect(state2.count).toBe(0);
    });
  });

  describe('setState', () => {
    it('should update state with object', () => {
      store.setState({ count: 5 });
      expect(store.getState().count).toBe(5);
    });

    it('should merge with existing state', () => {
      store.setState({ user: 'Alice' });
      expect(store.getState()).toEqual({ count: 0, user: 'Alice' });
    });

    it('should update state with function', () => {
      store.setState(s => ({ count: s.count + 1 }));
      expect(store.getState().count).toBe(1);

      store.setState(s => ({ count: s.count + 1 }));
      expect(store.getState().count).toBe(2);
    });
  });

  describe('subscribe', () => {
    it('should call listener immediately on subscribe', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({ count: 0, user: null });
    });

    it('should call listener on state change', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      store.setState({ count: 5 });

      expect(listener).toHaveBeenCalledTimes(2); // Initial + update
      expect(listener).toHaveBeenCalledWith({ count: 5, user: null });
    });

    it('should return unsubscribe function', () => {
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      unsubscribe();
      store.setState({ count: 5 });

      expect(listener).toHaveBeenCalledTimes(1); // Only initial
    });
  });

  describe('history', () => {
    it('should track state changes', () => {
      store.setState({ count: 1 });
      store.setState({ count: 2 });
      store.setState({ count: 3 });

      const history = store.getHistory();
      expect(history).toHaveLength(3);
      expect(history[0]).toEqual({ count: 0, user: null });
    });

    it('should time travel', () => {
      store.setState({ count: 1 });
      store.setState({ count: 2 });
      store.setState({ count: 3 });

      store.timeTravel(2);
      expect(store.getState().count).toBe(1);
    });

    it('should limit history size', () => {
      const smallStore = createStore({ count: 0 }, { maxHistory: 3 });

      smallStore.setState({ count: 1 });
      smallStore.setState({ count: 2 });
      smallStore.setState({ count: 3 });
      smallStore.setState({ count: 4 });
      smallStore.setState({ count: 5 });

      const history = smallStore.getHistory();
      expect(history.length).toBeLessThanOrEqual(3);
    });
  });

  describe('error handling', () => {
    it('should catch listener errors', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const badListener = () => { throw new Error('Test error'); };
      const goodListener = vi.fn();

      store.subscribe(badListener);
      store.subscribe(goodListener);

      expect(() => store.setState({ count: 1 })).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
      expect(goodListener).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
```

#### Pasos de Ejecución

1. **Crear tests/store.test.js**
2. **Ejecutar `npm test`**
3. **Verificar coverage >95%**
4. **Reportar bugs si hay**

#### Criterios de Aceptación

- [ ] Tests cubren todos los métodos de Store
- [ ] Coverage >95%
- [ ] Todos los tests pasan

#### Salida Esperada

**Archivos creados:**
- `tests/unit/store.test.js`

---

### QA-02: INTEGRATION TESTS

**Prioridad:** P1
**Estimación:** 2 días
**Depende:** EJECUTOR-05, EJECUTOR-06
**Paralelo con:** EJECUTOR-07, EJECUTOR-08

#### Especificación de Tests

**Archivo a crear:** `tests/integration/database.test.js`

```javascript
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import initSqlJs from 'sql.js';

describe('Database Integration', () => {
  let SQL;
  let db;

  beforeAll(async () => {
    SQL = await initSqlJs();
  });

  beforeEach(() => {
    db = new SQL.Database();
    createSchema(db);
  });

  function createSchema(database) {
    database.run(`
      CREATE TABLE pacientes (
        id_interno TEXT PRIMARY KEY,
        folio_local TEXT UNIQUE,
        nombre TEXT,
        triage_actual TEXT
      );
    `);
  }

  describe('Patient CRUD', () => {
    it('should insert patient successfully', () => {
      db.run(
        "INSERT INTO pacientes VALUES (?, ?, ?, ?)",
        ['uuid-123', 'P-001', 'Juan Pérez', 'ROJO']
      );

      const stmt = db.prepare("SELECT * FROM pacientes WHERE folio_local = ?");
      stmt.bind(['P-001']);
      stmt.step();
      const row = stmt.getAsObject();
      stmt.free();

      expect(row.nombre).toBe('Juan Pérez');
      expect(row.triage_actual).toBe('ROJO');
    });

    it('should prevent duplicate folio_local', () => {
      db.run("INSERT INTO pacientes VALUES (?, ?, ?, ?)", ['a', 'P-001', 'A', 'ROJO']);

      expect(() => {
        db.run("INSERT INTO pacientes VALUES (?, ?, ?, ?)", ['b', 'P-001', 'B', 'VERDE']);
      }).toThrow();
    });

    it('should update patient triage', () => {
      db.run("INSERT INTO pacientes VALUES (?, ?, ?, ?)", ['uuid', 'P-001', 'Juan', 'ROJO']);

      db.run("UPDATE pacientes SET triage_actual = ? WHERE folio_local = ?", ['VERDE', 'P-001']);

      const stmt = db.prepare("SELECT triage_actual FROM pacientes WHERE folio_local = ?");
      stmt.bind(['P-001']);
      stmt.step();
      const row = stmt.getAsObject();
      stmt.free();

      expect(row.triage_actual).toBe('VERDE');
    });
  });

  describe('Triage Counts', () => {
    beforeEach(() => {
      // Insertar pacientes de prueba
      const patients = [
        ['p1', 'P-001', 'A', 'ROJO'],
        ['p2', 'P-002', 'B', 'ROJO'],
        ['p3', 'P-003', 'C', 'AMARILLO'],
        ['p4', 'P-004', 'D', 'VERDE']
      ];

      patients.forEach(p => {
        db.run("INSERT INTO pacientes VALUES (?, ?, ?, ?)", p);
      });
    });

    it('should count patients by triage', () => {
      const stmt = db.prepare("SELECT triage_actual, COUNT(*) as c FROM pacientes GROUP BY triage_actual");

      const counts = {};
      while (stmt.step()) {
        const row = stmt.getAsObject();
        counts[row.triage_actual] = row.c;
      }
      stmt.free();

      expect(counts.ROJO).toBe(2);
      expect(counts.AMARILLO).toBe(1);
      expect(counts.VERDE).toBe(1);
    });
  });
});
```

#### Pasos de Ejecución

1. **Crear tests/integration/database.test.js**
2. **Ejecutar `npm test`**
3. **Verificar coverage**

#### Criterios de Aceptación

- [ ] Tests cubren CRUD de pacientes
- [ ] Tests cubren agrupaciones de triage
- [ ] Coverage >80% para db operations

#### Salida Esperada

**Archivos creados:**
- `tests/integration/database.test.js`

---

### QA-03: BUNDLE VERIFICATION

**Prioridad:** P1
**Estimación:** 1 día
**Depende:** EJECUTOR-09
**Paralelo con:** EJECUTOR-10

#### Especificación de Tests

**Archivo a crear:** `tests/bundle/size.test.js`

```javascript
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Bundle Size Verification', () => {
  const bundles = {
    app: path.resolve('dist/js/app.min.js'),
    dash: path.resolve('dist/js/dash.min.js'),
    common: path.resolve('dist/js/common.min.js')
  };

  const limits = {
    app: 200000, // 200KB
    dash: 150000, // 150KB
    common: 50000 // 50KB
  };

  describe('File existence', () => {
    it('should create app.min.js', () => {
      expect(fs.existsSync(bundles.app)).toBe(true);
    });

    it('should create dash.min.js', () => {
      expect(fs.existsSync(bundles.dash)).toBe(true);
    });

    it('should create common.min.js', () => {
      expect(fs.existsSync(bundles.common)).toBe(true);
    });
  });

  describe('Size limits', () => {
    it('should keep app.min.js under limit', () => {
      const size = fs.statSync(bundles.app).size;
      const sizeKB = (size / 1024).toFixed(2);
      console.log(`app.min.js: ${sizeKB}KB`);

      expect(size).toBeLessThan(limits.app);
    });

    it('should keep dash.min.js under limit', () => {
      const size = fs.statSync(bundles.dash).size;
      const sizeKB = (size / 1024).toFixed(2);
      console.log(`dash.min.js: ${sizeKB}KB`);

      expect(size).toBeLessThan(limits.dash);
    });

    it('should keep common.min.js under limit', () => {
      const size = fs.statSync(bundles.common).size;
      const sizeKB = (size / 1024).toFixed(2);
      console.log(`common.min.js: ${sizeKB}KB`);

      expect(size).toBeLessThan(limits.common);
    });
  });

  describe('Minification', () => {
    it('should minify app code', () => {
      const content = fs.readFileSync(bundles.app, 'utf8');

      // Verificar que no hay comentarios largos
      expect(content).not.toMatch(/\/\*[\s\S]{100,}\*\//);

      // Verificar que no hay newlines excesivos
      const lineCount = content.split('\n').length;
      expect(lineCount).toBeLessThan(50); // Código minificado tiene pocas líneas
    });

    it('should not have console.log in production', () => {
      const content = fs.readFileSync(bundles.app, 'utf8');

      // Solo permitir console.error y console.warn
      expect(content).not.toMatch(/console\.log/);
    });
  });

  describe('Source maps', () => {
    it('should generate source map for app', () => {
      const mapPath = bundles.app + '.map';
      expect(fs.existsSync(mapPath)).toBe(true);
    });

    it('should have valid source map', () => {
      const mapPath = bundles.app + '.map';
      const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

      expect(map.version).toBe(3);
      expect(map.sources).toHaveLengthGreaterThan(0);
      expect(map.mappings).toBeTruthy();
    });
  });
});
```

#### Pasos de Ejecución

1. **Crear tests/bundle/size.test.js**
2. **Ejecutar `npm test`**
3. **Reportar si excede límites**

#### Criterios de Aceptación

- [ ] Tests validan tamaños
- [ ] Tests validan minificación
- [ ] Tests validan source maps

#### Salida Esperada

**Archivos creados:**
- `tests/bundle/size.test.js`

---

### QA-04: E2E TESTS

**Prioridad:** P2
**Estimación:** 2 días
**Depende:** EJECUTOR-11, EJECUTOR-12
**Paralelo con:** DOCUMENTADOR-02

#### Especificación de Tests

**Instalar Playwright:**
```bash
npm install --save-dev @playwright/test
```

**Archivo a crear:** `playwright.config.js`

```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'file://' + __dirname + '/dist/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  }
});
```

**Archivo a crear:** `tests/e2e/login.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('ECE-DES Login Flow', () => {
  test('should show login screen initially', async ({ page }) => {
    await page.goto('ECE-DES.html');

    await expect(page.locator('#view-login')).toBeVisible();
    await expect(page.locator('#view-app')).toBeHidden();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('ECE-DES.html');

    await page.fill('#login-hospital', 'Hospital Test');
    await page.fill('#login-operador', 'Dr. Test');
    await page.fill('#login-pin', '1234');

    await page.click('button:has-text("INICIAR SESIÓN")');

    await expect(page.locator('#view-app')).toBeVisible();
    await expect(page.locator('#nav-hospital')).toHaveText('Hospital Test');
  });

  test('should show error with empty fields', async ({ page }) => {
    await page.goto('ECE-DES.html');

    // Click sin llenar campos
    await page.click('button:has-text("INICIAR SESIÓN")');

    // Verificar alert (manejar alert)
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('Llena todos los campos');
      dialog.accept();
    });
  });
});
```

**Archivo a crear:** `tests/e2e/patient-registration.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('Patient Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('ECE-DES.html');
    await page.fill('#login-hospital', 'Test');
    await page.fill('#login-operador', 'Test');
    await page.fill('#login-pin', '1234');
    await page.click('button:has-text("INICIAR SESIÓN")');
  });

  test('should register new patient', async ({ page }) => {
    // Click "NUEVO PACIENTE"
    await page.click('button:has-text("NUEVO PACIENTE")');

    // Manejar prompt (simular input)
    page.on('dialog', async dialog => {
      // Primer prompt: nombre
      await dialog.accept('Paciente Test');
    });

    page.on('dialog', async dialog => {
      // Segundo prompt: triage
      await dialog.accept('R'); // Rojo
    });

    // Verificar que apareció en la tabla
    await expect(page.locator('text=Paciente Test')).toBeVisible();
  });

  test('should update census after registration', async ({ page }) => {
    const rojoCountBefore = await page.textContent('#count-rojo');

    // Registrar paciente rojo
    page.on('dialog', dialog => dialog.accept('Test'));
    page.on('dialog', dialog => dialog.accept('R'));

    await page.click('button:has-text("NUEVO PACIENTE")');

    // Esperar actualización
    await page.waitForTimeout(500);

    const rojoCountAfter = await page.textContent('#count-rojo');

    expect(parseInt(rojoCountAfter)).toBe(parseInt(rojoCountBefore) + 1);
  });
});
```

#### Pasos de Ejecución

1. **Instalar Playwright**
2. **Crear config y tests**
3. **Ejecutar `npx playwright test`**

#### Criterios de Aceptación

- [ ] Tests de login pasan
- [ ] Tests de registro pasan
- [ ] Tests de censo pasan
- [ ] Screenshots generados en fallos

#### Salida Esperada

**Archivos creados:**
- `playwright.config.js`
- `tests/e2e/login.spec.js`
- `tests/e2e/patient-registration.spec.js`

---

## 4. AGENTE DOCUMENTADOR

### ROL Y RESPONSABILIDADES

**Misión:** Crear y mantener documentación técnica y para usuario.

**Autoridad:**
- ✅ Crear/modificar archivos en `/docs/`
- ✅ Actualizar README.md
- ❌ NO modificar `/src/` (solo docs en código)

**Métricas de Éxito:**
- Docs claras y completas
- Todo cambio documentado
- Guías para usuario final

---

### DOCUMENTADOR-01: SETUP GUIDE

**Prioridad:** P1
**Estimación:** 1 día
**Depende:** Nada
**Paralelo con:** EJECUTOR-01, EJECUTOR-02, EJECUTOR-03

#### Especificación de Contenido

**Archivo a crear:** `/docs/SETUP_GUIDE.md`

```markdown
# Guía de Configuración - CVOED-TOOLS Refactorizado

**Versión:** 2.0
**Fecha:** 2026-03-03
**Requisitos:** Node.js 18+, npm 9+

---

## Requisitos Previos

### Software Necesario

- **Node.js:** v18.17.0 o superior
- **npm:** v9.0.0 o superior
- **Git:** Para control de versiones

### Verificación

```bash
node --version  # Debe mostrar v18.17.0+
npm --version   # Debe mostrar 9.0.0+
```

---

## Instalación

### 1. Clonar Repositorio

```bash
git clone https://github.com/your-org/cvoed-tools.git
cd cvoed-tools
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Verificar Instalación

```bash
npm test -- --run
# Debe mostrar: ✓ Smoke Test (2 tests)
```

---

## Estructura del Proyecto

```
cvoed-tools/
├── src/                    # Código fuente
│   ├── js/
│   │   ├── store.js       # Store pattern
│   │   ├── app-store.js   # Store principal
│   │   ├── common.js      # Utilidades compartidas
│   │   └── components/    # Componentes reactivos
│   ├── css/
│   │   └── style.css      # Tokens v2.0
│   └── html/
│       └── index.html     # HTML modular
├── tests/                 # Suite de tests
│   ├── unit/             # Tests unitarios
│   ├── integration/      # Tests de integración
│   └── e2e/              # Tests end-to-end
├── dist/                  # Build output (generado)
├── docs/                  # Documentación
└── scripts/               # Scripts de utilidad
```

---

## Desarrollo

### Modo Desarrollo

```bash
# Ejecutar tests en modo watch
npm test

# Build con source maps
npm run build:dev
```

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Con coverage
npm run test:coverage

# E2E tests
npx playwright test
```

### Build

```bash
# Build de producción
npm run build

# Verificar tamaño de bundles
npm run verify
```

---

## Troubleshooting

### Error: "Cannot use import statement outside a module"

**Causa:** HTML no tiene `<script type="module">`

**Solución:**
```html
<!-- INCORRECTO -->
<script src="js/app.js"></script>

<!-- CORRECTO -->
<script type="module" src="js/app.js"></script>
```

### Error: "sql.js module not found"

**Causa:** WASM no está cargado

**Solución:** Verificar que `window.SQL_WASM_URI` está definido antes de `initSqlJs()`:

```javascript
console.log(window.SQL_WASM_URI); // Debe ser data:application/wasm;base64,...
const SQL = await initSqlJs({ locateFile: () => window.SQL_WASM_URI });
```

### Tests fallan con "ReferenceError: document is not defined"

**Causa:** Vitest no tiene jsdom configurado

**Solución:** Verificar `vitest.config.js`:
```javascript
export default defineConfig({
  test: {
    environment: 'jsdom'  // ← Debe estar presente
  }
});
```

---

## Recursos

- [ADRC Documentation](https://adrc.example.com)
- [Vitest Docs](https://vitest.dev/)
- [esbuild Docs](https://esbuild.github.io/)
- [Playwright Docs](https://playwright.dev/)
```

#### Pasos de Ejecución

1. **Crear `/docs/SETUP_GUIDE.md`**
2. **Verificar claridad**
3. **Probar guía en entorno limpio**

#### Criterios de Aceptación

- [ ] Guía tiene pasos claros
- [ ] Comandos son copiables
- [ ] Troubleshooting cubre casos comunes
- [ ] Formato Markdown válido

#### Salida Esperada

**Archivos creados:**
- `/docs/SETUP_GUIDE.md`

---

### DOCUMENTADOR-02: USER GUIDES

**Prioridad:** P2
**Estimación:** 2 días
**Depende:** EJECUTOR-11, EJECUTOR-12
**Paralelo con:** QA-04

#### Especificación de Contenido

**Archivo a crear:** `/docs/USER_GUIDE_ECE_DES.md`

```markdown
# Guía de Usuario - ECE-DES v2.0

**Para:** Personal Hospitalario IMSS
**Contexto:** Emergencias y Desastres (FIFA 2026)

---

## Inicio Rápido

### 1. Abrir Aplicación

La aplicación ECE-DES.html se abrirá automáticamente al iniciar:

```
Pantalla de Login
```

### 2. Iniciar Sesión

**CAMPOS REQUERIDOS:**
- **Hospital:** Nombre de tu hospital (ej: "Hospital General")
- **Operador:** Tu nombre completo (ej: "Dr. Martínez")
- **PIN:** 4 dígitos (ej: 1234)

**NOTA:** Esta es una autenticación local. No hay contraseña real porque el sistema funciona sin internet.

### 3. Pantalla Principal

Verás dos secciones principales:

#### CENSO EN TIEMPO REAL
Contadores de pacientes por nivel de triage:
- ◆ ROJO (Crítico)
- ▲ AMARILLO (Urgente)
- ● VERDE (Leve)
- ✚ NEGRO (Sin vida)

#### LISTADO DE PACIENTES
Tabla con todos los pacientes registrados, ordenados por hora de ingreso.

---

## Registrar Nuevo Paciente

### Paso 1: Click en "NUEVO PACIENTE"

Botón verde en la parte superior de la pantalla.

### Paso 2: Ingresar Datos

**PROMPT 1:** Nombre del paciente
- Dejar vacío para "NN" (No Identificado)
- Ejemplo: "Juan Pérez"

**PROMPT 2:** Nivel de Triage START
- **R** = ROJO (Crítico, atención inmediata)
- **A** = AMARILLO (Urgente, atención en minutos)
- **V** = VERDE (Leve, puede esperar)
- **N** = NEGRO (Sin signos vitales)

### Paso 3: Verificar

El paciente aparecerá automáticamente en:
- Lista de pacientes
- Contador de triage correspondiente

---

## Ver Expediente de Paciente

### Paso 1: Buscar Paciente

Usa el campo "Buscar" para encontrar por:
- Folio (ej: P-001)
- Nombre
- Código de pulsera

### Paso 2: Click en "VER DETALLE"

### Paso 3: Explorar Expediente

Verás:
- **Datos demográficos:** Edad, sexo, NSS
- **Línea de tiempo:** Todos los eventos clínicos
- **Acciones disponibles:** Cambiar triage, agregar nota, medicación

---

## Cambiar Triage

### Cuándo Cambiar
El nivel de triage puede cambiar según evolución:
- **MEJORA:** Rojo → Amarillo → Verde
- **DETERIORO:** Verde → Amarillo → Rojo

### Cómo Cambiar
1. Abrir expediente del paciente
2. Click en "Añadir Acción"
3. Seleccionar "Cambio de Triage"
4. Ingresar nuevo nivel (R/A/V/N)

---

## Exportar Datos

### Excel

Click en botón "Exportar Excel" → Se descargará archivo con:
- Hoja 1: Censo de pacientes
- Hoja 2: Trazabilidad clínica
- Hoja 3: Auditoría del sistema

### Backup de Base de Datos

Click en botón "Backup DB" → Se descargará archivo `.sqlite`

---

## Atajos de Teclado

| Acción | Atajo |
|--------|-------|
| Buscar paciente | Ctrl+F / Cmd+F |
| Nuevo paciente | Ctrl+N / Cmd+N |
| Exportar | Ctrl+E / Cmd+E |

---

## Preguntas Frecuentes

**¿Puedo usar esto sin internet?**
SÍ. ECE-DES funciona 100% offline.

**¿Se pierden los datos si cierro el navegador?**
NO. Los datos se guardan automáticamente en IndexedDB.

**¿Cuántos pacientes puedo registrar?
MILES. IndexedDB no tiene límite de 5MB como localStorage.

**¿Cómo llevo los datos a otro sistema?**
Exporta a Excel o respalda la base de datos `.sqlite`.

---

## Soporte

Para problemas técnicos:
1. Revisa la Guía de Configuración
2. Contacta al CPES de tu delegación
```

#### Pasos de Ejecución

1. **Crear `/docs/USER_GUIDE_ECE_DES.md`**
2. **Crear guías para otros módulos**
3. **Verificar claridad para usuario no técnico**

#### Criterios de Aceptación

- [ ] Guía es entendible por personal médico
- [ ] Capturas de pantalla incluidas (si aplica)
- [ /> FAQ cubre preguntas comunes
- [ ] Lenguaje claro, sin jerga técnica

#### Salida Esperada

**Archivos creados:**
- `/docs/USER_GUIDE_ECE_DES.md`
- `/docs/USER_GUIDE_DASHBOARD.md`
- `/docs/USER_GUIDE_TARJETAS.md`

---

### DOCUMENTADOR-03: API REFERENCE

**Prioridad:** P2
**Estimación:** 1 día
**Depende:** EJECUTOR-07 (common module)
**Paralelo con:** EJECUTOR-11, EJECUTOR-12

#### Especificación de Contenido

**Archivo a crear:** `/docs/API_REFERENCE.md`

```markdown
# Referencia de API - CVOED-TOOLS v2.0

**Para:** Desarrolladores que extienden el sistema

---

## Store API

### `Store`

Clase principal de state management.

#### Constructor

```javascript
new Store(initialState, options)
```

**Parámetros:**
- `initialState` (Object): Estado inicial
- `options` (Object, opcional):
  - `maxHistory` (Number): Máximo de estados en history (default: 50)

**Retorna:** Instancia de Store

#### Métodos

##### `getState()`

Obtiene copia inmutable del estado actual.

**Retorna:** Object

```javascript
const state = store.getState();
```

##### `setState(updater)`

Actualiza el estado y notifica a subscriptores.

**Parámetros:**
- `updater` (Object|Function):
  - Object: Mergear con estado actual
  - Function: Recibe estado actual, retorna nuevo estado

```javascript
// Object
store.setState({ count: 1 });

// Function
store.setState(s => ({ count: s.count + 1 }));
```

##### `subscribe(listener)`

Suscribe una función a cambios de estado.

**Parámetros:**
- `listener` (Function): Recibe estado actual como argumento

**Retorna:** Function (unsubscribe)

```javascript
const unsubscribe = store.subscribe((state) => {
  console.log('Nuevo estado:', state);
});

// Dejar de escuchar
unsubscribe();
```

##### `timeTravel(steps)`

Viaja hacia atrás en el history de estados.

**Parámetros:**
- `steps` (Number): Cuántos pasos retroceder (default: 1)

```javascript
store.timeTravel(2); // Volver 2 estados atrás
```

---

## Common Module API

### Funciones

#### `generateUUID()`

Genera UUID v4.

**Retorna:** String

```javascript
const id = generateUUID(); // "xxxxxxxx-xxxx-4xxx-yxxx"
```

#### `formatDateTime(isoString)`

Formatea fecha ISO a local español.

**Parámetros:**
- `isoString` (String): Fecha en formato ISO

**Retorna:** String

```javascript
const formatted = formatDateTime('2026-03-03T14:30:00Z');
// "03/03/2026, 14:30"
```

#### `renderTriageBadge(triage)`

Genera HTML del badge de triage.

**Parámetros:**
- `triage` (String): ROJO|AMARILLO|VERDE|NEGRO

**Retorna:** String (HTML)

```javascript
const badge = renderTriageBadge('ROJO');
// '<span style="color:#C41E3A">◆ ROJO</span>'
```

#### `escapeHTML(str)`

Escapa HTML para prevenir XSS.

**Parámetros:**
- `str` (String): String potencialmente inseguro

**Retorna:** String

```javascript
const safe = escapeHTML('<script>alert("XSS")</script>');
// "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"
```

---

## Database API

### Acceso Directo SQLite

Para operaciones complejas, accede directamente a `db`:

```javascript
import { appStore } from './js/app-store.js';

const { db } = appStore.getState();

// Ejecutar query
const stmt = db.prepare('SELECT * FROM pacientes WHERE triage_actual = ?');
stmt.bind(['ROJO']);
while (stmt.step()) {
  const row = stmt.getAsObject();
  console.log(row);
}
stmt.free();
```

---

## Components API

### `CensusComponent(container)`

Componente reactivo de censo.

**Parámetros:**
- `container` (HTMLElement): Elemento DOM donde renderizar

**Retorna:** Function (unsubscribe)

```javascript
import { CensusComponent } from './js/components/CensusComponent.js';

const cleanup = CensusComponent(document.getElementById('census'));

// Cleanup cuando ya no se necesite
cleanup();
```

---

## Eventos Customizados

### `store:changed`

Disparado cuando el store cambia de estado.

```javascript
window.addEventListener('store:changed', (e) => {
  const { state, previousState } = e.detail;
  console.log('Estado cambió:', state, previousState);
});
```

---

## Constantes

### `TRIAGE_COLORS`

```javascript
import { TRIAGE_COLORS } from './js/common.js';

TRIAGE_COLORS.ROJO    // '#C41E3A'
TRIAGE_COLORS.AMARILLO // '#D4940A'
TRIAGE_COLORS.VERDE   // '#1B7340'
TRIAGE_COLORS.NEGRO   // '#1A1A2E'
```

### `TRIAGE_SYMBOLS`

```javascript
import { TRIAGE_SYMBOLS } from './js/common.js';

TRIAGE_SYMBOLS.ROJO    // '◆'
TRIAGE_SYMBOLS.AMARILLO // '▲'
TRIAGE_SYMBOLS.VERDE   // '●'
TRIAGE_SYMBOLS.NEGRO   // '✚'
```

---

## Hooks (para extensión futura)

Si se migra a React en el futuro, estos hooks estarán disponibles:

```javascript
import { useStore, useSelector } from './js/hooks.js';

// Store completo
const store = useStore();

// Selector
const census = useSelector(state => state.census);
```
```

#### Pasos de Ejecución

1. **Crear `/docs/API_REFERENCE.md`**
2. **Documentar todos los módulos**
3. **Incluir ejemplos de código**

#### Criterios de Aceptación

- [ ] Todos los métodos documentados
- [ ] Ejemplos de código incluidos
- [ ] Tipos de parámetros especificados
- [ ] Formato consistente

#### Salida Esperada

**Archivos creados:**
- `/docs/API_REFERENCE.md`

---

## 5. SECUENCIA DE EJECUCIÓN ÓPTIMA

### 5.1 Plan de 10 Semanas (Paralelo Máximo)

```
SEMANA 1: FUNDACIONES (Máximo paralelismo)
├─ EJECUTOR-01: Testing Infra (2 días) → PARALELO CON:
├─ EJECUTOR-02: XSS Fixes (1.5 días) → PARALELO CON:
├─ EJECUTOR-03: DB Migration (1.5 días) → PARALELO CON:
│  └─ DOCUMENTADOR-01: Setup Guide (1 día)
└─ RESULTADO: Tests running, 0 XSS, Migration path

SEMANA 2-3: STATE MANAGEMENT (Alto paralelismo)
├─ EJECUTOR-04: Store Pattern (2 días)
├─ QA-01: Unit Tests Store (1 día) → PARALELO CON:
├─ EJECUTOR-05: Migrate app.js (5 días)
│  └─ DOCUMENTADOR-02: User Guides (inicia)
└─ RESULTADO: Store implementado, app.js migrado

SEMANA 4: DASHBOARD (Medio paralelismo)
├─ EJECUTOR-06: Migrate dashboard.js (3 días)
├─ QA-02: Integration Tests (2 días) → PARALELO CON:
└─ DOCUMENTADOR-02: User Guides (continúa)
└─ RESULTADO: Dashboard migrado, tests cubren DB

SEMANA 5: COMMON MODULE (Medio paralelismo)
├─ EJECUTOR-07: Common Module (2 días)
├─ EJECUTOR-08: Shared Bundle (3 días)
└─ RESULTADO: Código compartido extraído

SEMANA 6: BUILD SYSTEM (Alto paralelismo)
├─ EJECUTOR-09: esbuild Setup (2 días)
├─ EJECUTOR-10: Build Scripts (2 días)
├─ QA-03: Bundle Verification (1 día) → PARALELO CON:
└─ DOCUMENTADOR-03: API Reference (1 día)
└─ RESULTADO: Build moderno, verified

SEMANA 7-8: POLISH (Máximo paralelismo)
├─ EJECUTOR-11: Accessibility (2 días) → PARALELO CON:
├─ EJECUTOR-12: Error Handling (1 día) → PARALELO CON:
├─ QA-04: E2E Tests (2 días) → PARALELO CON:
└─ DOCUMENTADOR-02: User Guides (finaliza)
└─ RESULTADO: WCAG AA, error handling, E2E tests

SEMANA 9: VALIDATION (Todos los agentes)
├─ EJECUTOR: Bug fixes, refinamientos
├─ QA: Full test suite regression
├─ DOCUMENTADOR: Final docs review
└─ RESULTADO: Sistema validado

SEMANA 10: BUFFER & HANDOFF
└─ Contingency para retrasos, deploy
```

### 5.2 Matriz de Paralelización por Día

| Día | EJECUTOR | QA | DOCUMENTADOR | Paralelo |
|-----|----------|-----|--------------|----------|
| 1-5 | 01, 02, 03 | - | 01 | ✅ |
| 6-10 | 04 | 01 | - | ⚠️ |
| 11-20 | 05 | 01 (cont) | 02 (inicia) | ⚠️ |
| 21-25 | 06 | 02 | 02 (cont) | ⚠️ |
| 26-30 | 07 | - | 02 (cont) | ✅ |
| 31-35 | 08 | 03 | 03 | ✅ |
| 36-40 | 09, 10 | 03 (cont) | - | ✅ |
| 41-45 | 11, 12 | 04 | 02 (finaliza) | ✅ |
| 46-47 | Buffer | Validation | 03 (finaliza) | ✅ |
| 48-50 | Handoff | - | - | - |

**Leyenda:**
- ✅ = Máximo paralelismo (3 agentes simultáneos)
- ⚠️ = Medio paralelismo (2 agentes, uno depende del otro)
- Sin marca = Secuencial

---

## CONCLUSIÓN

Este documento proporciona **especificaciones técnicamente detalladas** para:

1. **EJECUTOR:** 12 tareas de implementación con código exacto
2. **QA:** 4 tareas de testing con suites completas
3. **DOCUMENTADOR:** 3 tareas de documentación con contenido

**Paralelización óptima:** Hasta 3 agentes trabajando simultáneamente en semanas selectas.

**Siguiente paso:** Lanzar agentes según la secuencia de ejecución óptima.

---

*Documento generado por CONTROLADOR*
*2026-03-03*
*Especificaciones técnicas para agentes ADRC*
