# 📘 FASES 2-5 - GUÍA DETALLADA

**Fecha:** 2026-03-04
**Agente:** CONTROLADOR (ADRC 2.0)
**Versión:** 2.0.0-dev
**Documento:** Guía completa de implementación Fases 2-5

---

## 📋 ÍNDICE

1. [Fase 2: Quality - Detallado](#fase-2-quality)
2. [Fase 3: Enhancement - Detallado](#fase-3-enhancement)
3. [Fase 4: Automation - Detallado](#fase-4-automation)
4. [Fase 5: Evolution - Detallado](#fase-5-evolution)
5. [Timeline y Roadmap](#timeline-y-roadmap)

---

## 🧪 FASE 2: QUALITY (Semanas 3-6)

### Objetivo Principal
Alcanzar **85% de cobertura** con pruebas automatizadas y calidad enterprise-grade.

### Duración
- **4 semanas** estimadas
- **45 tareas** totales
- **120+ tests** adicionales planificados

### Valor de Negocio
- **Confianza:** Código probado y robusto
- **Mantenibilidad:** Tests facilitan cambios futuros
- **Cumplimiento:** Requisitos legales de software médico
- **Performance:** Benchmarks aseguran calidad

---

## 🔬 FASE 2.1 - UNIT TESTS PERSISTENCE LAYER

### Especificación Técnica

**Tarea:** Unit tests para sistema de persistencia IndexedDB

**Prioridad:** P0 - CRÍTICA
**Estimado:** 5 días
**Dependencies:** SETUP_TESTING_FRAMEWORK

---

#### Implementación

##### Paso 1: Setup para Tests de Persistencia

Crear: `/Users/krisnova/www/cvoed-tools/tests/unit/persistence.test.js`

```javascript
describe('Persistence Layer - IndexedDB', () => {
  let db;
  let request;
  let indexedDB;

  beforeEach(async () => {
    // Setup fake-indexeddb
    indexedDB = new IDBFactory();

    // Limpiar DB antes de cada test
    await indexedDB.delete('ECEDES_DB');

    // Crear mock para sql.js
    global.SQL = {
      Database: jest.fn().mockImplementation(() => ({
        run: jest.fn(),
        exec: jest.fn(),
        export: jest.fn(() => new Uint8Array([1, 2, 3])),
        close: jest.fn()
      }))
    };
  });

  afterEach(async () => {
    if (request && request.result) {
      await request.result.close();
    }
  });

  describe('saveToIndexedDB()', () => {
    test('should save SQLite binary to IndexedDB', async () => {
      // Arrange
      const mockDB = new SQL.Database();
      const data = mockDB.export();

      db = await indexedDB.open('ECEDES_DB', 1);
      const tx = db.transaction(['sqlite_backup'], 'readwrite');
      const store = tx.objectStore('sqlite_backup');

      // Act
      await store.put({ id: 'latest', data: data, timestamp: Date.now() });

      // Assert
      const saved = await store.get('latest');
      expect(saved.data).toEqual(data);
    });

    test('should throttle saves to 2s', async () => {
      // Arrange
      const app = createTestApp();
      const saveSpy = jest.spyOn(app, 'saveToIndexedDB');

      // Act
      app.registerPatient({ nombre: 'Test 1' });
      app.registerPatient({ nombre: 'Test 2' });
      app.registerPatient({ nombre: 'Test 3' });

      // Assert - Solo 1 save (throttled)
      expect(saveSpy).not.toHaveBeenCalled();

      // Esperar throttle
      await sleep(2100);

      // Ahora debería haber guardado
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });

    test('should handle IndexedDB quota errors gracefully', async () => {
      // Arrange
      db = await indexedDB.open('ECEDES_DB', 1);
      const tx = db.transaction(['sqlite_backup'], 'readwrite');
      const store = tx.objectStore('sqlite_backup');

      // Act - Simular quota exceeded
      const originalPut = store.put.bind(store);
      store.put = jest.fn(() => {
        const error = new DOMException('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      });

      const app = createTestApp();

      // Act & Assert
      await expect(app.saveToIndexedDB()).rejects.toThrow('QuotaExceededError');
    });
  });

  describe('loadFromIndexedDB()', () => {
    test('should restore SQLite DB from IndexedDB', async () => {
      // Arrange
      const originalDB = new SQL.Database();
      const data = originalDB.export();

      db = await indexedDB.open('ECEDES_DB', 1);
      const tx = db.transaction(['sqlite_backup'], 'readwrite');
      const store = tx.objectStore('sqlite_backup');
      await store.put({ id: 'latest', data: data });

      // Act
      const app = createTestApp();
      await app.loadFromIndexedDB();

      // Assert
      expect(app.db).toBeTruthy();
      expect(app.db.run).toBeDefined();
    });

    test('should handle empty IndexedDB gracefully', async () => {
      // Act - IndexedDB vacío
      const app = createTestApp();
      await app.loadFromIndexedDB();

      // Assert - No debe fallar
      expect(app.db).toBeNull();
    });

    test('should decrypt SQLite binary correctly', async () => {
      // Arrange
      const testQuery = 'SELECT COUNT(*) FROM pacientes';
      const originalDB = new SQL.Database();
      originalDB.run(testQuery);
      const data = originalDB.export();

      db = await indexedDB.open('ECEDES_DB', 1);
      const tx = db.transaction(['sqlite_backup'], 'readwrite');
      const store = tx.objectStore('sqlite_backup');
      await store.put({ id: 'latest', data: data });

      // Act
      const app = createTestApp();
      await app.loadFromIndexedDB();

      // Assert - Query debe funcionar
      const result = app.db.exec(testQuery);
      expect(result).toBeTruthy();
    });
  });

  describe('Database Migration', () => {
    test('should create backup before migration v1→v2', async () => {
      // Arrange
      const app = createTestApp({ schemaVersion: 1 });
      app.db.run('CREATE TABLE pacientes (id INTEGER PRIMARY KEY, nombre TEXT)');

      // Act
      await app.runMigration();

      // Assert - Backup creado
      const backups = await app.getBackups();
      expect(backups.length).toBeGreaterThan(0);
    });

    test('should add new columns in v2 migration', async () => {
      // Arrange
      const app = createTestApp({ schemaVersion: 1 });
      app.db.run('CREATE TABLE pacientes (id INTEGER PRIMARY KEY, nombre TEXT)');

      // Act
      await app.runMigration();

      // Assert - Columnas nuevas agregadas
      const schema = app.db.exec('PRAGMA table_info(pacientes)');
      const hasEmail = schema[0].values.some(col => col[1] === 'email');
      expect(hasEmail).toBe(true);
    });

    test('should preserve data during migration', async () => {
      // Arrange
      const app = createTestApp({ schemaVersion: 1 });
      app.db.run('INSERT INTO pacientes (nombre) VALUES ("Test")');

      // Act
      await app.runMigration();

      // Assert - Datos preservados
      const result = app.db.exec('SELECT nombre FROM pacientes');
      expect(result[0].values[0][0]).toBe('Test');
    });
  });
});

// Helper function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createTestApp(config = {}) {
  const defaults = {
    schemaVersion: 1,
    saveThrottleMs: 100 // Reducir para tests
  };

  return {
    ...defaults,
    ...config,
    db: null,
    saveToIndexedDB: jest.fn(async () => {
      await sleep(50);
    }),
    loadFromIndexedDB: jest.fn(async () => {
      await sleep(50);
    }),
    getBackups: jest.fn(async () => []),
    runMigration: jest.fn(async () => {
      await sleep(100);
    })
  };
}
```

##### Criterios de Éxito

- [ ] 15 tests de persistencia creados
- [ ] Coverage >90% para persistence
- [ ] Todos los tests pasan
- [ ] Tests de throttling funcionales

---

## 🔄 FASE 2.2 - INTEGRATION TESTS DATABASE

### Especificación Técnica

**Tarea:** Tests de integración para operaciones de base de datos

**Prioridad:** P0 - CRÍTICA
**Estimado:** 4 días
**Dependencies:** UNIT_TESTS_PERSISTENCE

---

#### Implementación

Crear: `/Users/krisnova/www/cvoed-tools/tests/integration/database.test.js`

```javascript
describe('Database Integration Tests', () => {
  let app;
  let indexedDB;

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    await indexedDB.delete('ECEDES_DB');
    app = createApp();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    await indexedDB.delete('ECEDES_DB');
  });

  describe('Patient Registration Flow', () => {
    test('complete patient registration flow', async () => {
      // Act
      const patientId = await app.registerPatient({
        nombre: 'Juan Pérez',
        edad: 45,
        sexo: 'M',
        triage: 'ROJO'
      });

      // Assert - DB updated
      const patients = app.db.exec('SELECT * FROM pacientes WHERE id_interno=?', [patientId]);
      expect(patients[0].values.length).toBe(1);
      expect(patients[0].values[0][1]).toBe('Juan Pérez');

      // Assert - Traceability created
      const trace = app.db.exec('SELECT * FROM trazabilidad WHERE id_paciente=?', [patientId]);
      expect(trace[0].values.length).toBe(1);

      // Assert - Audit log created
      const audit = app.db.exec('SELECT * FROM auditoria WHERE accion="REGISTRO_PACIENTE"');
      expect(audit[0].values.length).toBeGreaterThan(0);
    });

    test('should generate unique folio for each patient', async () => {
      // Act
      const id1 = await app.registerPatient({ nombre: 'P1' });
      const id2 = await app.registerPatient({ nombre: 'P2' });

      // Assert - Folios únicos
      const folios = app.db.exec('SELECT folio_local FROM pacientes ORDER BY ts_ingreso');
      const folio1 = folios[0].values[0][0];
      const folio2 = folios[1].values[0][0];

      expect(folio1).not.toBe(folio2);
      expect(folio1).toMatch(/^P-/);
      expect(folio2).toMatch(/^P-/);
    });
  });

  describe('Triage Change Flow', () => {
    test('should update all related tables on triage change', async () => {
      // Arrange
      const patientId = await app.registerPatient({
        nombre: 'Test',
        triage_inicial: 'VERDE'
      });

      // Act - Cambiar a ROJO
      await app.updateTriage(patientId, 'ROJO');

      // Assert - Pacientes actualizado
      const patient = app.db.exec('SELECT triage_actual FROM pacientes WHERE id_interno=?', [patientId]);
      expect(patient[0].values[0][0]).toBe('ROJO');

      // Assert - Trazabilidad creada
      const trace = app.db.exec('SELECT * FROM trazabilidad WHERE id_paciente=?', [patientId]);
      expect(trace[0].values.length).toBe(1);
      expect(trace[0].values[0][3]).toBe('VERDE'); // valor_anterior
      expect(trace[0].values[0][4]).toBe('ROJO');  // valor_nuevo

      // Assert - Auditoría creada
      const audit = app.db.exec('SELECT * FROM auditoria WHERE accion="CAMBIO_TRIAGE"');
      expect(audit[0].values.length).toBe(1);
    });
  });

  describe('Export Integration', () => {
    test('should export all related data to Excel', async () => {
      // Arrange
      await app.registerPatient({ nombre: 'P1' });
      await app.registerPatient({ nombre: 'P2' });

      // Act
      const blob = await app.exportToExcel();

      // Assert
      expect(blob.type).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      expect(blob.size).toBeGreaterThan(1000);
    });

    test('should include patient, traceability, and audit sheets', async () => {
      // Arrange
      const patientId = await app.registerPatient({ nombre: 'Test' });
      await app.addClinicalEvent(patientId, 'NOTE', 'Test note');

      // Act
      const blob = await app.exportToExcel();

      // Assert - Verify structure (simplified)
      const arrayBuffer = await blob.arrayBuffer();
      const decoder = new TextDecoder();
      const text = decoder.decode(arrayBuffer);

      expect(text).toContain('Censo Pacientes');
      expect(text).toContain('Trazabilidad');
      expect(text).toContain('Auditoría');
    });
  });

  describe('Dashboard Integration', () => {
    test('dashboard should read from ECE-DES database', async () => {
      // Arrange - ECE-DES registers patients
      await app.registerPatient({ nombre: 'P1', triage: 'ROJO' });
      await app.registerPatient({ nombre: 'P2', triage: 'VERDE' });
      await app.saveToIndexedDB();

      // Act - Dashboard reads from IndexedDB
      const dash = createDashboard();
      await dash.loadDatabase();

      // Assert
      expect(dash.kpis.totalPatients).toBe(2);
      expect(dash.kpis.criticalPatients).toBe(1);
      expect(dash.kpis.distribution.ROJO).toBe(1);
      expect(dash.kpis.distribution.VERDE).toBe(1);
    });
  });
});
```

##### Criterios de Éxito

- [ ] 10 tests de integración creados
- [ ] Prueba flujos completos end-to-end
- [ ] Verifica integridad referencial
- [ ] Coverage >80% para integración

---

## 🎭 FASE 2.3 - E2E TESTS SETUP

### Especificación Técnica

**Tarea:** Configurar y crear primeros tests E2E con Playwright

**Prioridad:** P1 - ALTA
**Estimado:** 3 días
**Dependencies:** UNIT_TESTS, INTEGRATION_TESTS

---

#### Implementación

##### Paso 1: Instalar Playwright

```bash
cd /Users/krisnova/www/cvoed-tools
npm install --save-dev @playwright/test
npx playwright install
```

##### Paso 2: Configurar Playwright

Crear: `/Users/krisnova/www/cvoed-tools/playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',

  // Timeout global
  timeout: 30000,

  // Retry flaky tests
  retries: process.env.CI ? 2 : 0,

  // Output
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],

  use: {
    // Base URL para tests
    baseURL: 'file:///Users/krisnova/www/cvoed-tools/dist/',

    // Traza de tests
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  // Projects
  projects: [
    {
      name: 'ECE-DES',
      testMatch: /.*\.spec\.ts/,
    },
    {
      name: 'Dashboard',
      testMatch: /.*dashboard\.spec\.ts/,
    }
  ],

  // Browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
  ],
});
```

##### Paso 3: Crear primer test E2E

Crear: `/Users/krisnova/www/cvoed-tools/tests/e2e/login.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully with valid PIN', async ({ page }) => {
    // Navegar a ECE-DES.html
    await page.goto('file:///Users/krisnova/www/cvoed-tools/dist/ECE-DES.html');

    // Esperar a que cargue
    await page.waitForSelector('#view-login');

    // Llenar formulario de login
    await page.fill('#login-hospital', 'Hospital General');
    await page.fill('#login-operador', 'Dr. Test');
    await page.fill('#login-pin', '1234');

    // Click login button
    await page.click('#btn-login');

    // Verificar - Main view aparece
    await expect(page.locator('#view-main')).toBeVisible();
    await expect(page.locator('#view-login')).toBeHidden();

    // Verificar - Session info visible
    await expect(page.locator('.hospital-name')).toContainText('Hospital General');
    await expect(page.locator('.operador-name')).toContainText('Dr. Test');
  });

  test('should reject invalid PIN', async ({ page }) => {
    await page.goto('file:///Users/krisnova/www/cvoed-tools/dist/ECE-DES.html');

    await page.waitForSelector('#view-login');

    // Llenar formulario con PIN inválido
    await page.fill('#login-hospital', 'Hospital');
    await page.fill('#login-operador', 'Operador');
    await page.fill('#login-pin', '123'); // Muy corto

    // Intentar login
    await page.click('#btn-login');

    // Verificar - Error message
    await expect(page.locator('.notification-error')).toBeVisible();
    await expect(page.locator('.notification-error')).toContainText('PIN debe ser 4 dígitos');
  });
});

test.describe('Patient Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    await page.goto('file:///Users/krisnova/www/cvoed-tools/dist/ECE-DES.html');
    await page.waitForSelector('#view-login');
    await page.fill('#login-hospital', 'Test Hospital');
    await page.fill('#login-operador', 'Test Operator');
    await page.fill('#login-pin', '1234');
    await page.click('#btn-login');
    await page.waitForSelector('#view-main');
  });

  test('should register new patient successfully', async ({ page }) => {
    // Click "Nuevo Paciente"
    await page.click('#btn-new-patient');

    // Esperar modal
    await expect(page.locator('.modal-paciente')).toBeVisible();

    // Llenar formulario
    await page.fill('#patient-name', 'María García');
    await page.fill('#patient-age', '35');
    await page.selectOption('#patient-sex', 'F');

    // Seleccionar triage
    await page.click('.btn-triage-verde');

    // Guardar
    await page.click('#btn-save-patient');

    // Verificar - Modal cerrado
    await expect(page.locator('.modal-paciente')).toBeHidden();

    // Verificar - Paciente en tabla
    await expect(page.locator('#census-table')).toContainText('María García');
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('#btn-new-patient');

    // Intentar guardar sin llenar campos
    await page.click('#btn-save-patient');

    // Verificar - Mensaje de error
    await expect(page.locator('.notification-error')).toBeVisible();
    await expect(page.locator('#btn-save-patient')).toBeDisabled();
  });
});

test.describe('Triage Update Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login y registrar paciente
    await page.goto('file:///Users/krisnova/www/cvoed-tools/dist/ECE-DES.html');
    await page.waitForSelector('#view-login');

    // Login
    await page.fill('#login-hospital', 'Test');
    await page.fill('#login-operador', 'Op');
    await page.fill('#login-pin', '1234');
    await page.click('#btn-login');
    await page.waitForSelector('#view-main');

    // Registrar paciente
    await page.click('#btn-new-patient');
    await page.fill('#patient-name', 'Test');
    await page.fill('#patient-age', '40');
    await page.click('.btn-triage-verde');
    await page.click('#btn-save-patient');
    await expect(page.locator('#census-table')).toContainText('Test');
  });

  test('should update triage level', async ({ page }) => {
    // Click en paciente
    await page.click('[data-patient-id]');

    // Esperar modal de expediente
    await expect(page.locator('#modal-expediente')).toBeVisible();

    // Cambiar triage a ROJO
    await page.selectOption('#change-triage', 'ROJO');
    await page.click('#btn-update-triage');

    // Verificar - Modal cerrado
    await expect(page.locator('#modal-expediente')).toBeHidden();

    // Verificar - Badge actualizado
    await expect(page.locator('.badge-triage-rojo')).toBeVisible();
  });
});
```

##### Criterios de Éxito

- [ ] Playwright instalado y configurado
- [ ] 3 escenarios E2E creados
- [ ] Tests pasan consistentemente
- [ ] Screenshot en fallos
- [ ] Reports generados

---

## 🤖 FASE 2.4 - CI/CD PIPELINE

### Especificación Técnica

**Tarea:** Configurar GitHub Actions para CI/CD automatizado

**Prioridad:** P0 - CRÍTICA
**Estimado:** 3 días
**Dependencies:** TODOS LOS ANTERIORES

---

#### Implementación

##### Paso 1: Crear workflow de CI

Crear: `/.github/workflows/ci.yml`

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Check formatting
        run: npm run format:check

  test-unit:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Generate coverage
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./tests/coverage/*.json
          flags: unittests
          name: codecov-umbrella

  test-integration:
    runs-on: ubuntu-latest
    needs: test-unit
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run integration tests
        run: npm run test:integration

  test-e2e:
    runs-on: ubuntu-latest
    needs: test-integration
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  security:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v3

      - name: Run security audit
        run: npm audit --production
        continue-on-error: true

      - name: Run OWASP ZAP
        uses: zaproxy/action-full-scan@v0.4.0
        with:
          target: 'http://localhost:8000'
          cmd: '-r baby'
          fail_action: 'warn'

  build:
    runs-on: ubuntu-latest
    needs: [test-unit, test-integration]
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload dist artifact
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
          retention-days: 7
```

##### Paso 2: Crear workflow de CD

Crear: `/.github/workflows/cd.yml`

```yaml
name: CD Pipeline

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions - ${{ github.event.head_commit.message }}"
          enable-pull-request-comment: true
          enable-commit-status: true
```

##### Criterios de Éxito

- [ ] CI pipeline ejecuta en cada push
- [ ] Todos los tests pasan
- [ ] Coverage reportado
- [ ] CD deploy automático
- [ ] Artifacts generados

---

## 📊 MÉTRICAS FASE 2

### Objetivos de Calidad

| Métrica | Actual | Target Fase 2 | Gap |
|---------|--------|--------------|-----|
| **Tests Unitarios** | 149 | 110 | -39 |
| **Tests Integración** | 27 | 65 | -38 |
| **Tests E2E** | 0 | 45 | -45 |
| **Coverage** | 28% | 85% | -57% |
| **CI/CD** | No | Sí | - |
| **Security Scan** | Manual | Automatizado | - |

### Entregables Fase 2

1. **25 Unit Tests Persistence**
2. **10 Integration Tests DB**
3. **5 E2E Tests** (mínimo)
4. **CI Pipeline** (GitHub Actions)
5. **CD Pipeline** (Netlify)
6. **Coverage Reports** automatizados
7. **Security Scans** automatizados

---

## 🚀 FASE 3: ENHANCEMENT (Semanas 7-9)

### Objetivo Principal
Mejorar UX y añadir funcionalidades enterprise-grade.

### Duración
- **3 semanas** estimadas
- **30 tareas** totales

---

## 🎭 FASE 3.1 - SISTEMA DE ROLES RBAC

### Especificación Técnica Detallada

**Tarea:** Implementar control de acceso basado en roles (RBAC)

**Prioridad:** P1 - ALTA
**Estimado:** 4 días

---

#### Implementación

##### Paso 1: Definir Roles y Permisos

```javascript
// ============================================
// RBAC SYSTEM - Role-Based Access Control
// ============================================

const ROLES = {
  MEDICO: {
    nombre: 'Médico',
    descripcion: 'Acceso completo a funciones clínicas',
    permisos: [
      'patients.create',
      'patients.read',
      'patients.update',
      'patients.delete',
      'triage.update',
      'clinical_events.create',
      'clinical_events.read',
      'export.excel',
      'dashboard.view'
    ]
  },

  ENFERMERA: {
    nombre: 'Enfermera',
    descripcion: 'Registro y triage, sin exportación',
    permisos: [
      'patients.create',
      'patients.read',
      'triage.update',
      'clinical_events.create',
      'clinical_events.read'
    ]
  },

  ADMIN: {
    nombre: 'Administrador',
    descripcion: 'Dashboard y reportes, sin modificación',
    permisos: [
      'dashboard.view',
      'export.excel',
      'auditor.read'
    ]
  },

  AUDITOR: {
    nombre: 'Auditor',
    descripcion: 'Solo lectura de auditoría',
    permisos: [
      'auditor.read'
    ]
  }
};

// Permiso comodín para wildcard
const ADMIN_WILDCARD = '*';
```

##### Paso 2: Sistema de Permisos

```javascript
// ============================================
// PERMISSION SYSTEM
// ============================================

class PermissionManager {
  constructor(session) {
    this.session = session;
    this.role = session.rol;
    this.permissions = ROLES[this.role].permisos;
  }

  hasPermission(permission) {
    // Admin wildcard
    if (this.permissions.includes(ADMIN_WILDCARD)) {
      return true;
    }

    // Check exact permission
    return this.permissions.includes(permission);
  }

  hasAnyPermission(permissions) {
    return permissions.some(p => this.hasPermission(p));
  }

  require(permission) {
    if (!this.hasPermission(permission)) {
      throw new Error(`Permiso denegado: ${permission}`);
    }
  }

  filterUI(element) {
    // Ocultar elementos basado en permisos
    const requiredPermission = element.dataset.permission;

    if (requiredPermission && !this.hasPermission(requiredPermission)) {
      element.style.display = 'none';
      element.disabled = true;
    }
  }

  initializeUI() {
    // Aplicar permisos a toda la UI
    document.querySelectorAll('[data-permission]').forEach(el => {
      this.filterUI(el);
    });
  }
}

// Uso en la app
app.permissionManager = new PermissionManager(app.session);

// Al cargar página
window.addEventListener('load', () => {
  app.permissionManager.initializeUI();
});
```

##### Paso 3: Modificar Login para Selección de Rol

```javascript
// Modificar vista de login para incluir selector de rol
async login() {
  // Verificar campos existentes
  const hosp = document.getElementById("login-hospital").value;
  const oper = document.getElementById("login-operador").value;
  const pin = document.getElementById("login-pin").value;

  // Nuevo: Selector de rol
  const rolSelect = document.getElementById("login-rol");
  const rol = rolSelect ? rolSelect.value : 'MEDICO';

  // Validar PIN
  if (!pin || pin.length !== 4) {
    this.showNotification("PIN debe ser 4 dígitos", "error");
    return;
  }

  // Hash PIN
  const pinHash = await Crypto.hashPIN(pin);

  // Crear sesión con rol
  this.session = {
    hospital: hosp,
    operador: operador,
    rol: rol,
    permisos: ROLES[rol].permisos,
    loginTime: Date.now()
  };

  // Guardar sesión
  localStorage.setItem("ecedes_session", JSON.stringify(this.session));

  // Inicializar permisos
  this.permissionManager = new PermissionManager(this.session);
  this.permissionManager.initializeUI();

  // Auditoría
  this.audit("LOGIN", "operadores", "SESSION",
    `Rol: ${rol}, Operador: ${operador}`
  );

  // Actualizar UI
  this.updateUIForRole(rol);

  // Transición a main view
  document.getElementById("view-login").classList.add("hidden");
  document.getElementById("view-main").classList.remove("hidden");
  this.renderCensus();

  this.showNotification(`Bienvenido, ${operador} (${ROLES[rol].nombre})`, "success");
}
```

##### Paso 4: Actualizar UI Según Rol

```javascript
updateUIForRole(rol) {
  // Ocultar/mostrar elementos según permisos

  // Botón exportar (solo MEDICO)
  const exportBtn = document.getElementById('btn-export-excel');
  if (exportBtn) {
    const canExport = this.permissionManager.hasPermission('export.excel');
    exportBtn.style.display = canExport ? 'block' : 'none';
  }

  // Botón Dashboard (todos excepto AUDITOR)
  const dashboardBtn = document.getElementById('btn-dashboard');
  if (dashboardBtn) {
    const canView = this.permissionManager.hasPermission('dashboard.view');
    dashboardBtn.style.display = canView ? 'block' : 'none';
  }

  // Badge de rol en navbar
  const roleBadge = document.getElementById('current-role-badge');
  if (roleBadge) {
    roleBadge.textContent = ROLES[rol].nombre;
    roleBadge.className = `badge-role-${rol.toLowerCase()}`;
  }
}
```

##### Tests RBAC

Crear: `/Users/krisnova/www/cvoed-tools/tests/unit/rbac.test.js`

```javascript
describe('RBAC System', () => {
  describe('PermissionManager', () => {
    let pm;

    beforeEach(() => {
      const session = {
        rol: 'MEDICO',
        permisos: ROLES.MEDICO.permisos
      };
      pm = new PermissionManager(session);
    });

    test('MEDICO role has all permissions', () => {
      expect(pm.hasPermission('patients.create')).toBe(true);
      expect(pm.hasPermission('export.excel')).toBe(true);
    });

    test('ENFERMERA cannot export', () => {
      pm.session.rol = 'ENFERMERA';
      pm.permissions = ROLES.ENFERMERA.permisos;

      expect(pm.hasPermission('patients.create')).toBe(true);
      expect(pm.hasPermission('export.excel')).toBe(false);
    });

    test('ADMIN cannot modify patients', () => {
      pm.session.rol = 'ADMIN';
      pm.permissions = ROLES.ADMIN.permisos;

      expect(pm.hasPermission('patients.create')).toBe(false);
      expect(pm.hasPermission('dashboard.view')).toBe(true);
    });

    test('AUDITOR can only read', () => {
      pm.session.rol = 'AUDITOR';
      pm.permissions = ROLES.AUDITOR.permisos;

      expect(pm.hasPermission('auditor.read')).toBe(true);
      expect(pm.hasPermission('patients.create')).toBe(false);
    });
  });

  describe('Role Selection in Login', () => {
    test('login() stores selected role in session', () => {
      const app = createTestApp();

      // Mock de rol seleccionado
      document.getElementById('login-rol').value = 'ENFERMERA';

      app.login('Hospital', 'Operador', '1234');

      expect(app.session.rol).toBe('ENFERMERA');
      expect(app.session.permisos).toEqual(ROLES.ENFERMERA.permisos);
    });
  });
});
```

##### Criterios de Éxito

- [ ] 4 roles definidos (MEDICO, ENFERMERA, ADMIN, AUDITOR)
- [ ] 10 permisos implementados
- [ ] Sistema de login actualizado
- [ ] UI adaptativa por rol
- [ ] 15 tests RBAC creados
- [ ] Coverage >90% para RBAC

---

## 📱 FASE 3.2 - MOBILE OPTIMIZATION

### Especificación Técnica

**Tarea:** Optimizar UI para dispositivos móviles

**Prioridad:** P1 - ALTA
**Estimado:** 5 días

---

#### Implementación

##### Paso 1: Media Queries CSS

Agregar en ECE-DES.html:

```css
/* ============================================
/* RESPONSIVE DESIGN - MOBILE OPTIMIZATION
/* ============================================

/* Base: Mobile-first approach */
.census-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .census-container {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .census-container {
    flex-wrap: nowrap;
  }
}

/* Patient Table - Responsive */
.patient-table {
  display: block;
}

/* Mobile: Stack rows */
@media (max-width: 767px) {
  .patient-row {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #E5E7EB;
    padding: 10px 0;
  }

  .patient-cell {
    padding: 5px 0;
    border: none;
  }

  .patient-cell::before {
    content: attr(data-label);
    font-weight: bold;
    color: var(--text-secondary);
    display: block;
  }
}

/* Tablet+: Table layout */
@media (min-width: 768px) {
  .patient-row {
    display: table-row;
  }

  .patient-cell {
    display: table-cell;
    border: 1px solid #E5E7EB;
    padding: 8px;
  }
}

/* Touch Targets - Minimum 44x44 */
@media (max-width: 767px) {
  .btn-triage {
    min-width: 44px;
    min-height: 44px;
    font-size: 16px; /* Previne zoom en iOS */
    padding: 12px 24px;
  }

  .btn-primary {
    min-height: 44px;
    font-size: 16px;
  }
}

/* Navbar - Responsive */
.navbar {
  flex-direction: column;
  gap: 10px;
}

@media (min-width: 768px) {
  .navbar {
    flex-direction: row;
    justify-content: space-between;
  }
}

/* Modal - Responsive */
.modal-content {
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
}

@media (min-width: 768px) {
  .modal-content {
    width: 600px;
    max-height: 80vh;
  }
}

/* Form - Responsive */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

@media (min-width: 768px) {
  .form-group {
    flex-direction: row;
    gap: 20px;
  }

  .form-group > * {
    flex: 1;
  }
}
```

##### Paso 2: Meta Tags para Mobile

Agregar en `<head>`:

```html
<!-- Mobile Meta Tags -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="theme-color" content="#691C32">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" href="icon-192.png">
<link rel="apple-touch-icon" sizes="192x192" href="icon-192.png">

<!-- Android Manifest -->
<link rel="manifest" href="/manifest.json">
```

##### Paso 3: Testing Mobile

Crear: `/Users/krisnova/www/cvoed-tools/tests/mobile/mobile.test.js`

```javascript
describe('Mobile Optimization', () => {
  describe('Responsive Layout', () => {
    test('should stack patient rows on mobile', async () => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

      await page.goto('file:///Users/krisnova/www/cvoed-tools/dist/ECE-DES.html');

      // Login and register patient
      await login(page);
      await registerPatient(page);

      // Verify stacked layout
      const rows = await page.locator('.patient-row').all();
      const firstRow = rows[0];

      const display = await firstRow.evaluate(el =>
        window.getComputedStyle(el).display
      );

      // Mobile: flex (column)
      // Desktop: table-row
      expect(display).toBe('flex');
    });

    test('should have minimum touch targets', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('file:///Users/krisnova/www/cvoed-tools/dist/ECE-DES.html');

      // Check button sizes
      const btn = page.locator('.btn-triage-rojo').first();
      const box = await btn.boundingBox();

      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    });
  });
});
```

##### Criterios de Éxito

- [ ] CSS responsive implementado
- [ ] Touch targets ≥44px
- [ ] No horizontal scroll
- [ ] 5 mobile tests creados
- [ ] Probado en iPhone/Android

---

## 🔔 FASE 3.3 - NOTIFICATIONES PUSH

### Especificación Técnica

**Tarea:** Sistema de notificaciones push e in-app

**Prioridad:** P1 - ALTA
**Estimado:** 3 días

---

#### Implementación

##### Paso 1: Notification Manager

```javascript
// ============================================
// NOTIFICATION SYSTEM
// ============================================

class NotificationManager {
  constructor() {
    this.container = null;
    this.browserPermission = 'default';
    this.audioContext = null;
  }

  init() {
    // Crear container
    this.container = document.createElement('div');
    this.container.id = 'notification-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);

    // Cargar audio context
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Request browser permission
    this.requestBrowserPermission();
  }

  async requestBrowserPermission() {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      this.browserPermission = result;
    }
  }

  show(message, type = 'info', options = {}) {
    const notification = this.createNotification(message, type, options);
    this.container.appendChild(notification);

    // Browser notification si permitido
    if (this.browserPermission === 'granted' && options.browser !== false) {
      this.showBrowserNotification(message, type);
    }

    // Audio para eventos críticos
    if (type === 'error' || type === 'warning') {
      this.playSound(type);
    }

    // Auto-remove
    const duration = options.duration || 5000;
    setTimeout(() => {
      notification.remove();
    }, duration);
  }

  createNotification(message, type, options) {
    const div = document.createElement('div');
    div.className = `notification notification-${type}`;
    div.style.cssText = `
      background: var(--bg-${type === 'error' ? 'tertiary' : 'primary'});
      border-left: 4px solid var(--fn-${type});
      border-radius: 4px;
      padding: 15px 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      min-width: 300px;
      pointer-events: auto;
      animation: slideIn 0.3s ease-out;
    `;

    div.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 5px;">
        ${this.getIcon(type)} ${type.toUpperCase()}
      </div>
      <div>${message}</div>
    `;

    return div;
  }

  showBrowserNotification(message, type) {
    if (this.browserPermission !== 'granted') return;

    const icons = {
      success: '/icons/success.png',
      error: '/icons/error.png',
      warning: '/icons/warning.png',
      info: '/icons/info.png'
    };

    new Notification(message, {
      icon: icons[type],
      badge: '/icon-192.png',
      body: 'CVOED-Tools'
    });
  }

  playSound(type) {
    if (!this.audioContext) return;

    // Crear oscilador para beep
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Frecuencias según tipo
    const frequencies = {
      error: 800,
      warning: 600,
      info: 400
    };

    oscillator.frequency.value = frequencies[type] || 400;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
    this.audioContext.currentTime + 0.5
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  getIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  }
}

// Animación CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(styleSheet);
```

##### Criterios de Éxito

- [ ] Notification manager implementado
- [ ] Browser notifications funcionan
- [ ] Audio alerts para eventos críticos
- [ ] 5 tests de notificaciones creados
- [ ] Coverage >90%

---

## 🌙 FASE 3.4 - DARK MODE

### Especificación Técnica

**Tarea:** Implementar tema oscuro

**Prioridad:** P2 - MEDIA
**Estimado:** 2 días

---

#### Implementación

##### Paso 1: CSS Variables para Dark Mode

```css
:root {
  /* Variables base (light mode) */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F7F8FA;
  --text-primary: #1A1A2E;
  --text-secondary: #4A5568;
  --border-default: #D1D5DB;

  /* Sistema institucional */
  --inst-guinda: #691C32;
  --inst-dorado: #BC955C;
  --inst-verde-imss: #006657;
  --inst-negro: #161A1D;
}

[data-theme="dark"] {
  /* Override para dark mode */
  --bg-primary: #1A1A2E;
  --bg-secondary: #161A1D;
  --text-primary: #F7F8FA;
  --text-secondary: #D1D5DB;
  --border-default: #4A5568;

  /* Sistema institucional ajustado */
  --inst-guinda: #8B3A47;      /* Más claro para dark */
  --inst-guinda-dark: #691C32;
  --inst-dorado: #D4A76C;       /* Más brillante */
  --inst-verde-imss: #008877;    /* Más brillante */
  --inst-negro: #E0E0E0;        /* Gris claro */
}

/* Funcionales ajustados para contraste */
[data-theme="dark"] {
  --fn-rojo: #E85258;            /* Más claro */
  --fn-rojo-bg: #FDE8E8;
  --fn-amarillo: #E8A820;        /* Más brillante */
  --fn-amarillo-bg: #FFF8E7;
  --fn-verde: #2C8C5C;            /* Más claro */
  --fn-verde-bg: #F0F8F4;
  --fn-negro: #E0E0E0;           /* Gris claro */
}
```

##### Paso 2: Toggle Button

```javascript
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    // Aplicar tema guardado o detectar preferencia del sistema
    if (this.currentTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? 'dark' : 'light';
    }

    this.applyTheme(this.currentTheme);

    // Escuchar cambios en preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
      if (localStorage.getItem('theme') === 'system') {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  toggleTheme() {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.currentTheme = themes[nextIndex];

    this.applyTheme(this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }

  applyTheme(theme) {
    let actualTheme = theme;

    if (theme === 'system') {
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    document.body.setAttribute('data-theme', actualTheme);

    // Actualizar botón toggle
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = this.getThemeIcon(actualTheme);
    }
  }

  getThemeIcon(theme) {
    const icons = {
      light: '🌞',
      dark: '🌙',
      system: '💻'
    };
    return icons[theme] || icons.light;
  }
}
```

##### Criterios de Éxito

- [ ] CSS variables implementadas
- [ ] Toggle button funcional
- [ ] Persistencia en localStorage
- [ ] System preference detectada
- [ ] 5 tests de tema creados

---

## 📊 RESUMEN FASE 3

| Tarea | Duración | Prioridad | Tests |
|-------|----------|-----------|-------|
| **RBAC System** | 4 días | P1 | 15 |
| **Mobile Optimization** | 5 días | P1 | 5 |
| **Notifications Push** | 3 días | P1 | 5 |
| **Dark Mode** | 2 días | P2 | 5 |
| **Accessibility WCAG** | 3 días | P1 | 8 |
| **Keyboard Shortcuts** | 2 días | P2 | 6 |
| **Undo/Redo** | 3 días | P2 | 4 |
| **Bulk Operations** | 2 días | P2 | 3 |
| **Error Messages** | 2 días | P2 | 5 |
| **Help Tooltips** | 1 día | P3 | 3 |
| **User Preferences** | 2 días | P3 | 4 |

**Total Fase 3:** 30 tareas, ~3 semanas, **~90 tests** adicionales

---

## 🤖 FASE 4: AUTOMATION (Semanas 10-11)

### Objetivo Principal
Implementar CI/CD pipeline automatizado para deployment continuo.

### Duración
- **2 semanas** estimadas
- **15 tareas** totales

---

## 🚀 FASE 4.1 - GITHUB ACTIONS COMPLETO

### Especificación Técnica

**Workflow de CI/CD completo:**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  CI: true

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '/Users/krisnova/www/cvoed-tools/dist'
          format: 'table'
          output: 'trivy-report.txt'

      - name: Upload security results
        uses: actions/upload-artifact@v3
        with:
          name: security-scan-results
          path: trivy-report.txt

  code-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run Prettier check
        run: npm run format:check

      - name: Check types (if TypeScript)
        run: npm run type-check || echo "No TypeScript"

      - name: Complexity analysis
        run: npx complexity-report src/

  test-unit:
    runs-on: ubuntu-latest
    needs: code-quality
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Generate coverage
        run: npm run test:coverage

      - name: Check coverage threshold
        run: |
          COVERAGE=$(cat tests/coverage/coverage-summary.json | jq '.total.lines.pct')
          echo "Coverage: $COVERAGE%"
          if (( $(echo "$COVERAGE < 85" | bc -l) )); then
            echo "❌ Coverage below 85%"
            exit 1
          fi

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./tests/coverage/*.json

      - name: Comment coverage on PR
        if: github.event_name == 'pull_request'
          uses: romeovs/coverage-commentator@v1
          with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  test-integration:
    runs-on: ubuntu-latest
    needs: test-unit
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install dependencies
        run: npm ci

      - name: Run integration tests
        run: npm run test:integration

      - name: Upload integration test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: integration-test-results
          path: tests/integration/results/

  test-e2e:
    runs-on: ubuntu-latest
    needs: test-integration
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - name: Upload Playwright screenshots
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-screenshots
          path: tests/e2e/screenshots/
          retention-days: 7

  performance-test:
    runs-on: ubuntu-latest
    needs: test-unit
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@3
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install dependencies
        run: npm ci

      - name: Run performance benchmarks
        run: npm run test:performance

      - name: Compare with baseline
        run: |
          # Comparar con baseline de performance
          node scripts/compare-performance.js

      - name: Upload performance results
        uses: actions/upload-artifact@v3
        with:
          name: performance-results
          path: performance-results.json

  build:
    runs-on: ubuntu-latest
    needs: [test-unit, test-integration, test-e2e, security-scan, code-quality]
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install dependencies
        run: npm ci

      - name: Run build
        run: npm run build

      - name: Minify HTML files
        run: |
          for html in dist/*.html; do
            html-minifier --collapse-whitespace --remove-comments \
              --minify-js true -o "$html" "$html"
          done

      - name: Calculate build metrics
        run: |
          echo "BUILD_METRICS=$(du -sh dist | cut -f1)" >> $GITHUB_ENV
          echo "FILE_COUNT=$(find dist -name '*.html' | wc -l)" >> $GITHUB_ENV

      - name: Upload dist artifact
        uses: actions/upload-artifact@v3
        with:
          name: dist-${{ github.sha }}
          path: dist/
          retention-days: 7

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            dist/*.html
            dist/workers/*
          tag_name: v${{ github.run_number }}
          tag_message: |
            Release v${{ github.run_number }}

            Build: ${{ env.BUILD_METRICS }}
            Files: ${{ env.FILE_COUNT }}

            Changes:
            - See commits for details
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Netlify Staging
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './dist'
          production-branch: develop
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: |
            Deploy to STAGING from develop

            Commit: ${{ github.sha }}
            Author: ${{ github.actor }}

            ⚠️ PREVIEW ONLY
          enable-pull-request-comment: true
          enable-commit-status: true

  deploy-production:
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'release' && github.event.action == 'created'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Netlify Production
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: |
            PRODUCTION DEPLOYMENT

            Release: ${{ github.event.release.tag_name }}

            Build: ${{ env.BUILD_METRICS }}
            Files: ${{ env.FILE_COUNT }}

            ✅ VERIFICADO Y TESTEADO
          enable-pull-request-comment: true
          enable-commit-status: true

      - name: Update deployment status
        run: |
          curl -X POST \\
            -H "Authorization: Bearer ${{ secrets.SLACK_WEBHOOK }}" \\
            -H 'Content-Type: application/json' \\
            '{"text": "✅ CVOED-Tools v2.0 deployed to PRODUCTION\n\nRelease: '"${{ github.event.release.tag_name }}"'}'
```

---

## 🎯 FASE 5: EVOLUTION (Semana 12)

### Objetivo Principal
Preparar groundwork para arquitectura modular v2.0.

### Duración
- **1 semana** estimada
- **10 tareas** de investigación/diseño

---

## 🔍 FASE 5.1 - STATE MANAGEMENT EVALUATION

### Tareas

1. **Evaluar Zustand** (1 día)
   - Setup simple POC
   - Comparar con Redux
   - Probar con ECE-DES
   - Documentar pros/contras

2. **Evaluar Pinia** (0.5 días)
   - Setup simple POC
   - Comparar con Zustand
   - Probar con ECE-DES
   - Documentar pros/contras

3. **Evaluar Redux Toolkit** (0.5 días)
   - Setup POC
   - Comparar con alternativas
   - Análisis de overhead

**Entregable:**
- Reporte de comparación (markdown)
- POC funcional
- Recomendación con justificación

---

## 🏗️ FASE 5.2 - MODULAR ARCHITECTURE DESIGN

### Especificación Técnica

**Objetivo:** Diseñar arquitectura modular para ECE-DES v2.0

---

#### Estructura Propuesta

```
src/v2/
├── core/                    # Lógica de negocio pura
│   ├── domain/             # Entidades de dominio
│   │   ├── Patient.ts
│   │   ├── TriageLevel.ts
│   │   └── ClinicalEvent.ts
│   ├── services/           # Servicios de lógica
│   │   ├── PatientService.ts
│   │   ├── TriageService.ts
│   │   └── ExportService.ts
│   └── repositories/       # Acceso a datos
│       ├── PatientRepository.ts
│       └── TriageRepository.ts
│
├── infrastructure/        # Infraestructura técnica
│   ├── database/           # Database abstraction
│   │   ├── SQLiteConnection.ts
│   │   └── IndexedDBWrapper.ts
│   ├── persistence/        # Capa de persistencia
│   │   └── IndexedDBService.ts
│   └── export/             # Exportación
│       └── ExcelExporter.ts
│
├── ui/                     # Capa de presentación
│   ├── components/         # Componentes UI
│   │   ├── LoginForm.tsx
│   │   ├── PatientForm.tsx
│   │   ├── TriageButtons.tsx
│   │   └── PatientTable.tsx
│   ├── layouts/             # Layouts completos
│   │   ├── MainLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── ModalLayout.tsx
│   └── themes/              # Temas y estilos
│       ├── ThemeProvider.tsx
│       ├── useTheme.ts
│       └── global.css
│
└── shared/                 # Código compartido
    ├── utils/              # Utilidades
    │   ├── validators.ts
    │   ├── formatters.ts
    │   └── constants.ts
    └── types/              # TypeScript types
        ├── patient.types.ts
        ├── triage.types.ts
        └── api.types.ts
```

---

## 📊 ROADMAP COMPLETO

### Timeline Visual

```
MES 1: FASE 1 - FOUNDATION ✅ 100%
├── D1: Framework setup ✅
├── D2: Security fixes ✅
├── D3: Performance ✅
└── D5: Configuración ✅

MES 2: FASE 2 - QUALITY 🔄
├── W1: Unit tests persistence
├── W2: Integration tests
├── W3: E2E tests setup
├── W4: CI/CD pipeline
└── W5: Quality gates

MES 3: FASE 3 - ENHANCEMENT 📋
├── W1: RBAC system
├── W2: Mobile optimization
├── W3: Push notifications
├── W4: Dark mode
└── W5: Accessibility

MES 4: FASE 4 - AUTOMATION 📋
├── W1: CI pipeline completo
├── W2: CD automatizado
├── W3: Monitoring
├── W4: Alerts setup
└── W5: Runbooks

MES 5: FASE 5 - EVOLUTION 📋
├── W1: State management eval
├── W2: Modular architecture
├── W3: ADRs y roadmap
└── W4: v2.0 roadmap
```

---

## 🎯 CRITERIOS DE ÉXITO POR FASE

### Fase 2: Quality
- [ ] 85%+ coverage
- [ ] CI/CD funcional
- [ ] 220 tests pasando
- [ ] Zero security vulns

### Fase 3: Enhancement
- [ ] 4 roles implementados
- [ ] Mobile responsive
- [ ] Push notifications
- [ ] Dark mode funcional
- [ ] WCAG 2.1 AA compliant

### Fase 4: Automation
- [ ] CI/CD pipeline activo
- [ ] Deploy automático funcional
- [ ] Monitoreo activo
- [ ] Alerts configurados

### Fase 5: Evolution
- [ ] State management evaluado
- [ ] Arquitectura modular diseñada
- [ ] ADRs completados
- [ ] Roadmap v2.0 creado

---

## 📈 ESTIMACIONES

### Esfuerzo por Fase

| Fase | Tareas | Tests | Días | Horas |
|------|--------|-------|------|------|
| **Fase 1** | 10 | 252 | 0.8 | 27 |
| **Fase 2** | 45 | 120 | 20 | 160 |
| **Fase 3** | 30 | 90 | 15 | 120 |
| **Fase 4** | 15 | 20 | 10 | 80 |
| **Fase 5** | 10 | 5 | 5 | 40 |
| **TOTAL** | **110** | **487** | **51** | **427 horas (~10 semanas)** |

### Costo-Beneficio

| Fase | Valor | Costo | ROI |
|------|-------|------|-----|
| Fase 1 | Security + Performance | 27 min | **10x** |
| Fase 2 | Quality Assurance | 160 hrs | **5x** |
| Fase 3 | UX Enhancement | 120 hrs | **3x** |
| Fase 4 | Automation | 80 hrs | **8x** |
| Fase 5 | Evolution | 40 hrs | **15x** |

---

**¿Continuamos con alguna fase específica o prefieres un resumen ejecutivo?** 🎯
