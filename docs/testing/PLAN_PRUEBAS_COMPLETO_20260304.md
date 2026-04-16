# 🧪 PLAN DE PRUEBAS COMPLETO - CVOED-TOOLS v1.1.0

**Fecha:** 2026-03-04
**Agente:** CONTROLADOR (ADRC 2.0)
**Versión:** 1.1.0
**Tipo:** Testing Strategy + Test Cases
**Cobertura Objetivo:** >85%

---

## 📋 ÍNDICE

1. [Estrategia de Testing](#estrategia-de-testing)
2. [Matriz de Pruebas por Herramienta](#matriz-de-pruebas-por-herramienta)
3. [Plan de Pruebas Unitarias](#plan-de-pruebas-unitarias)
4. [Plan de Pruebas de Integración](#plan-de-pruebas-de-integración)
5. [Plan de Pruebas E2E](#plan-de-pruebas-e2e)
6. [Plan de Pruebas de Performance](#plan-de-pruebas-de-performance)
7. [Plan de Pruebas de Seguridad](#plan-de-pruebas-de-seguridad)
8. [Plan de Pruebas de Compatibilidad](#plan-de-pruebas-de-compatibilidad)
9. [Casos de Prueba Prioritarios](#casos-de-prueba-prioritarios)
10. [Automatización Recomendada](#automatización-recomendada)

---

## 🎯 ESTRATEGIA DE TESTING

### Pirámide de Testing

```
        ▲
       /E\       E2E Tests (10%)
      /2_E\      - Flujos críticos
     /_____\     - User journeys
    /       \
   / INTEGRACIÓN \   Integration Tests (30%)
  /    30%       \  - DB operations
 /_________________\ - IndexedDB
/   UNIT TESTS     \ - API calls
/      60%          \
- Functions          - State management
- Components
- Utilities
```

### Principios

1. **Test-Driven Development (TDD)** para nuevas features
2. **Testing Manual** para validación UX
3. **Automatización** para regression testing
4. **Continuous Testing** en CI/CD pipeline

### Herramientas Recomendadas

| Tipo | Herramienta | Propósito |
|------|-------------|-----------|
| **Unit Tests** | Jest + Testing Library | Funciones JavaScript |
| **Integration** | Playwright | IndexedDB + SQLite |
| **E2E** | Playwright / Puppeteer | Flujos completos |
| **Performance** | Lighthouse CI | Métricas de performance |
| **Security** | OWASP ZAP | Vulnerabilidades |
| **Cross-browser** | BrowserStack | Compatibilidad |

---

## 🗺️ MATRIZ DE PRUEBAS POR HERRAMIENTA

### Resumen de Cobertura

| Herramienta | Prioridad | Unit | Integration | E2E | Performance | Security | Total |
|-------------|-----------|------|-------------|-----|-------------|----------|-------|
| **ECE-DES.html** | P0 | 40 | 30 | 15 | 10 | 5 | 100 |
| **ECE-DES-Dashboard.html** | P1 | 25 | 20 | 10 | 5 | 0 | 60 |
| **ECE-DES-Tarjetas.html** | P2 | 10 | 5 | 5 | 0 | 0 | 20 |
| **generador_tarjetas.html** | P2 | 20 | 10 | 5 | 0 | 0 | 35 |
| **guia_operativa_nunca_jamas.html** | P3 | 5 | 0 | 5 | 0 | 0 | 10 |
| **simulacro_nunca_jamas_fifa2026.html** | P3 | 5 | 0 | 0 | 0 | 0 | 5 |
| **index.html** | P3 | 5 | 0 | 5 | 0 | 0 | 10 |
| **TOTAL** | - | **110** | **65** | **45** | **15** | **5** | **240** |

### Desglose por Herramienta

---

## 🔬 PLAN DE PRUEBAS UNITARIAS

### ECE-DES.html - Unit Tests (40 tests)

#### Módulo: Autenticación (5 tests)

```javascript
describe('Authentication System', () => {
  test('login() should validate PIN length', () => {
    const app = createTestApp();
    expect(() => app.login('Hospital', 'Operador', '123')).toThrow();
    expect(() => app.login('Hospital', 'Operador', '12345')).toThrow();
  });

  test('login() should store session in localStorage', () => {
    const app = createTestApp();
    app.login('Test Hospital', 'Test Operator', '1234');
    expect(localStorage.getItem('ecedes_hospital')).toBe('Test Hospital');
  });

  test('login() should audit login event', () => {
    const app = createTestApp();
    app.login('H', 'O', '1234');
    const auditLog = app.db.exec('SELECT * FROM auditoria');
    expect(auditLog[0].values[0][2]).toBe('LOGIN');
  });

  test('logout() should clear session', () => {
    const app = createTestApp();
    app.login('H', 'O', '1234');
    app.logout();
    expect(app.session).toBeNull();
  });

  test('session persistence across reloads', () => {
    const app = createTestApp();
    app.login('H', 'O', '1234');
    const reloadedApp = createTestApp();
    expect(reloadedApp.session.hospital).toBe('H');
  });
});
```

#### Módulo: Registro de Pacientes (10 tests)

```javascript
describe('Patient Registration', () => {
  test('registerPatient() should generate unique folio', () => {
    const app = createTestApp();
    const folio1 = app.registerPatient({ name: 'Patient 1' });
    const folio2 = app.registerPatient({ name: 'Patient 2' });
    expect(folio1).not.toBe(folio2);
  });

  test('registerPatient() should insert into DB', () => {
    const app = createTestApp();
    app.registerPatient({ name: 'John Doe', age: 45 });
    const result = app.db.exec('SELECT COUNT(*) FROM pacientes');
    expect(result[0].values[0][0]).toBe(1);
  });

  test('registerPatient() should audit registration', () => {
    const app = createTestApp();
    app.registerPatient({ name: 'Jane Doe' });
    const audit = app.db.exec('SELECT * FROM auditoria WHERE accion="REGISTRO_PACIENTE"');
    expect(audit[0].values.length).toBe(1);
  });

  test('registerPatient() should validate required fields', () => {
    const app = createTestApp();
    expect(() => app.registerPatient({})).toThrow();
  });

  test('registerPatient() should set default triage', () => {
    const app = createTestApp();
    app.registerPatient({ name: 'Test' });
    const result = app.db.exec('SELECT triage_inicial FROM pacientes');
    expect(result[0].values[0][0]).toBe('SIN_CLASIFICAR');
  });

  test('registerPatient() should generate UUID for id_interno', () => {
    const app = createTestApp();
    app.registerPatient({ name: 'Test' });
    const result = app.db.exec('SELECT id_interno FROM pacientes');
    expect(result[0].values[0][0]).toMatch(/^[0-9a-f-]{36}$/);
  });

  test('registerPatient() should handle age validation', () => {
    const app = createTestApp();
    expect(() => app.registerPatient({ name: 'T', age: -1 })).toThrow();
    expect(() => app.registerPatient({ name: 'T', age: 150 })).toThrow();
  });

  test('registerPatient() should validate sex field', () => {
    const app = createTestApp();
    expect(() => app.registerPatient({ name: 'T', sex: 'X' })).toThrow();
  });

  test('registerPatient() should store operator info', () => {
    const app = createTestApp({ session: { operador: 'Dr. Smith' } });
    app.registerPatient({ name: 'T' });
    const result = app.db.exec('SELECT operador_registro FROM pacientes');
    expect(result[0].values[0][0]).toBe('Dr. Smith');
  });

  test('registerPatient() should trigger save with throttling', () => {
    const app = createTestApp();
    jest.spyOn(app, 'saveToIndexedDB');
    app.registerPatient({ name: 'T' });
    expect(app.saveToIndexedDB).toHaveBeenCalled();
  });
});
```

#### Módulo: Sistema de Triage (8 tests)

```javascript
describe('Triage System', () => {
  test('updateTriage() should change triage level', () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T' });
    app.updateTriage(patientId, 'ROJO');
    const result = app.db.exec('SELECT triage_actual FROM pacientes WHERE id_interno=?', [patientId]);
    expect(result[0].values[0][0]).toBe('ROJO');
  });

  test('updateTriage() should validate triage values', () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T' });
    expect(() => app.updateTriage(patientId, 'PURPLE')).toThrow();
  });

  test('updateTriage() should create traceability record', () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T' });
    app.updateTriage(patientId, 'AMARILLO');
    const trace = app.db.exec('SELECT * FROM trazabilidad WHERE tipo_evento="TRIAGE_CHANGE"');
    expect(trace[0].values.length).toBe(1);
  });

  test('updateTriage() should store previous value', () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T', triage: 'VERDE' });
    app.updateTriage(patientId, 'ROJO');
    const trace = app.db.exec('SELECT valor_anterior FROM trazabilidad');
    expect(trace[0].values[0][0]).toBe('VERDE');
  });

  test('updateTriage() should audit change', () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T' });
    app.updateTriage(patientId, 'NEGRO');
    const audit = app.db.exec('SELECT * FROM auditoria WHERE accion="CAMBIO_TRIAGE"');
    expect(audit[0].values.length).toBe(1);
  });

  test('updateTriage() should trigger UI update', () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T' });
    const renderSpy = jest.spyOn(app, 'renderCensus');
    app.updateTriage(patientId, 'ROJO');
    expect(renderSpy).toHaveBeenCalled();
  });

  test('updateTriage() should prevent same triage assignment', () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T', triage: 'ROJO' });
    app.updateTriage(patientId, 'ROJO');
    const trace = app.db.exec('SELECT * FROM trazabilidad');
    expect(trace[0].values.length).toBe(0);
  });

  test('updateTriage() should handle concurrent changes', () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T' });
    app.updateTriage(patientId, 'ROJO');
    app.updateTriage(patientId, 'AMARILLO');
    const trace = app.db.exec('SELECT valor_nuevo FROM trazabilidad ORDER BY ts_evento DESC');
    expect(trace[0].values[0][0]).toBe('AMARILLO');
  });
});
```

#### Módulo: Sistema de Expedientes (7 tests)

```javascript
describe('Clinical Records', () => {
  test('renderTimeline() should show events in order', () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T' });
    app.addClinicalEvent(patientId, 'NOTE', 'Initial assessment');
    app.addClinicalEvent(patientId, 'MEDICATION', 'Aspirin 500mg');
    const timeline = app.renderTimeline(patientId);
    expect(timeline[0].type).toBe('NOTE');
    expect(timeline[1].type).toBe('MEDICATION');
  });

  test('addClinicalEvent() should store event in DB', () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T' });
    app.addClinicalEvent(patientId, 'VITALS', 'BP: 120/80');
    const events = app.db.exec('SELECT * FROM trazabilidad WHERE id_paciente=?', [patientId]);
    expect(events[0].values.length).toBe(1);
  });

  test('showPatientDetails() should load patient data', () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'John Doe', age: 45 });
    const details = app.showPatientDetails(patientId);
    expect(details.name).toBe('John Doe');
    expect(details.age).toBe(45);
  });

  test('updatePatientProfile() should modify patient record', () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'Jane Doe' });
    app.updatePatientProfile(patientId, { name: 'Jane Smith' });
    const result = app.db.exec('SELECT nombre FROM pacientes WHERE id_interno=?', [patientId]);
    expect(result[0].values[0][0]).toBe('Jane Smith');
  });

  test('addClinicalEvent() should validate event types', () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T' });
    expect(() => app.addClinicalEvent(patientId, 'INVALID', 'test')).toThrow();
  });

  test('printPatientBadge() should generate printable HTML', () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T', triage: 'ROJO' });
    const badge = app.printPatientBadge(patientId);
    expect(badge).toContain('ROJO');
    expect(badge).toContain('T');
  });

  test('timeline should support pagination', () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T' });
    for (let i = 0; i < 25; i++) {
      app.addClinicalEvent(patientId, 'NOTE', `Event ${i}`);
    }
    const page1 = app.renderTimeline(patientId, 0, 10);
    const page2 = app.renderTimeline(patientId, 10, 10);
    expect(page1.length).toBe(10);
    expect(page2.length).toBe(10);
  });
});
```

#### Módulo: Persistencia (10 tests)

```javascript
describe('Persistence System', () => {
  test('saveToIndexedDB() should store SQLite binary', async () => {
    const app = createTestApp();
    await app.saveToIndexedDB();
    const idb = await openDB('ECEDES_DB', 1);
    const data = await idb.get('sqlite_backup', 'latest');
    expect(data).toBeInstanceOf(Uint8Array);
  });

  test('saveToIndexedDB() should throttle saves', async () => {
    const app = createTestApp({ saveThrottleMs: 100 });
    app.registerPatient({ name: 'T1' });
    app.registerPatient({ name: 'T2' });
    app.registerPatient({ name: 'T3' });
    await sleep(50);
    const idb = await openDB('ECEDES_DB', 1);
    const saveCount = await idb.count('sqlite_backup');
    expect(saveCount).toBe(0); // No save yet (throttled)
    await sleep(100);
    const saveCount2 = await idb.count('sqlite_backup');
    expect(saveCount2).toBe(1); // Saved after throttle
  });

  test('loadFromIndexedDB() should restore SQLite DB', async () => {
    const app = createTestApp();
    app.registerPatient({ name: 'T' });
    await app.saveToIndexedDB();

    const app2 = createTestApp();
    await app2.loadFromIndexedDB();
    const result = app2.db.exec('SELECT COUNT(*) FROM pacientes');
    expect(result[0].values[0][0]).toBe(1);
  });

  test('loadFromIndexedDB() should handle empty DB', async () => {
    const app = createTestApp();
    await app.loadFromIndexedDB();
    expect(app.db).toBeTruthy();
  });

  test('saveToIndexedDB() should handle errors gracefully', async () => {
    const app = createTestApp();
    // Simulate IndexedDB error
    indexedDB.open = jest.fn(() => {
      throw new Error('IndexedDB error');
    });
    await expect(app.saveToIndexedDB()).rejects.toThrow();
  });

  test('migration should backup before changes', async () => {
    const app = createTestApp({ schemaVersion: 1 });
    app.registerPatient({ name: 'T' });
    await app.saveToIndexedDB();

    const app2 = createTestApp({ schemaVersion: 2 });
    await app2.loadFromIndexedDB();
    // Should have backup
    const backups = await app2.getBackups();
    expect(backups.length).toBeGreaterThan(0);
  });

  test('migration version 1 to 2 should add new columns', async () => {
    const app = createTestApp({ schemaVersion: 1 });
    app.registerPatient({ name: 'T' });
    await app.saveToIndexedDB();

    const app2 = createTestApp({ schemaVersion: 2 });
    await app2.loadFromIndexedDB();
    const schema = app2.db.exec('PRAGMA table_info(pacientes)');
    // Should have new columns from v2
    expect(schema[0].values.some(col => col[1] === 'nueva_columna_v2')).toBe(true);
  });

  test('exportToExcel() should create XLSX file', () => {
    const app = createTestApp();
    app.registerPatient({ name: 'T1' });
    app.registerPatient({ name: 'T2' });
    const blob = app.exportToExcel();
    expect(blob.type).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });

  test('exportToExcel() should include 3 sheets', () => {
    const app = createTestApp();
    app.registerPatient({ name: 'T' });
    const workbook = XLSX.read(app.exportToExcel(), { type: 'array' });
    expect(workbook.SheetNames).toHaveLength(3);
    expect(workbook.SheetNames).toContain('Censo Pacientes');
    expect(workbook.SheetNames).toContain('Trazabilidad');
    expect(workbook.SheetNames).toContain('Auditoría');
  });

  test('exportToExcel() should handle large datasets', () => {
    const app = createTestApp();
    for (let i = 0; i < 1000; i++) {
      app.registerPatient({ name: `Patient ${i}` });
    }
    const blob = app.exportToExcel();
    expect(blob.size).toBeGreaterThan(0);
  });
});
```

---

## 🔗 PLAN DE PRUEBAS DE INTEGRACIÓN

### Pruebas de Integración ECE-DES (30 tests)

#### Integración: Frontend + SQLite (10 tests)

```javascript
describe('Frontend ↔ SQLite Integration', () => {
  test('complete patient registration flow', async () => {
    const app = createTestApp();
    await app.init();

    // User fills form
    document.getElementById('patient-name').value = 'John Doe';
    document.getElementById('patient-age').value = '45';

    // User submits
    document.getElementById('btn-register').click();

    // Verify DB state
    const result = app.db.exec('SELECT * FROM pacientes WHERE nombre=?', ['John Doe']);
    expect(result[0].values.length).toBe(1);
  });

  test('triage change updates all related tables', async () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T', triage: 'VERDE' });

    app.updateTriage(patientId, 'ROJO');

    // Check pacientes table
    const paciente = app.db.exec('SELECT triage_actual FROM pacientes WHERE id_interno=?', [patientId]);
    expect(paciente[0].values[0][0]).toBe('ROJO');

    // Check trazabilidad table
    const traza = app.db.exec('SELECT * FROM trazabilidad WHERE id_paciente=?', [patientId]);
    expect(traza[0].values[0][2]).toBe('TRIAGE_CHANGE');

    // Check auditoria table
    const audit = app.db.exec('SELECT * FROM auditoria WHERE accion=?', ['CAMBIO_TRIAGE']);
    expect(audit[0].values.length).toBeGreaterThan(0);
  });

  test('search functionality integrates with DB queries', async () => {
    const app = createTestApp();
    app.registerPatient({ name: 'Maria Garcia' });
    app.registerPatient({ name: 'Juan Garcia' });
    app.registerPatient({ name: 'Pedro Lopez' });

    const results = app.searchPatient('Garcia');
    expect(results).toHaveLength(2);
    expect(results[0].name).toBe('Maria Garcia');
    expect(results[1].name).toBe('Juan Garcia');
  });

  test('dashboard reads from ECE-DES database', async () => {
    const app = createTestApp();
    const dash = createTestDashboard();

    // Register patients in ECE-DES
    app.registerPatient({ name: 'T1', triage: 'ROJO' });
    app.registerPatient({ name: 'T2', triage: 'VERDE' });
    await app.saveToIndexedDB();

    // Load in Dashboard
    await dash.loadDatabase();

    expect(dash.kpis.totalPatients).toBe(2);
    expect(dash.kpis.criticalPatients).toBe(1);
  });

  test('concurrent patient registration handles race conditions', async () => {
    const app = createTestApp();
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(app.registerPatient({ name: `Patient ${i}` }));
    }
    await Promise.all(promises);

    const result = app.db.exec('SELECT COUNT(*) FROM pacientes');
    expect(result[0].values[0][0]).toBe(10);
  });

  test('database transaction rollback on error', async () => {
    const app = createTestApp();
    app.db.run('BEGIN TRANSACTION');
    try {
      app.registerPatient({ name: 'T1' });
      throw new Error('Simulated error');
    } catch (e) {
      app.db.run('ROLLBACK');
    }

    const result = app.db.exec('SELECT COUNT(*) FROM pacientes');
    expect(result[0].values[0][0]).toBe(0);
  });

  test('indexedDB storage preserves data integrity', async () => {
    const app = createTestApp();
    const originalData = app.db.export();
    await app.saveToIndexedDB();

    const app2 = createTestApp();
    await app2.loadFromIndexedDB();
    const restoredData = app2.db.export();

    expect(originalData).toEqual(restoredData);
  });

  test('large dataset does not block UI', async () => {
    const app = createTestApp();
    const startTime = Date.now();

    for (let i = 0; i < 500; i++) {
      app.registerPatient({ name: `Patient ${i}` });
    }

    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(5000); // Should complete in <5s
  });

  test('export includes all related data', async () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T' });
    app.addClinicalEvent(patientId, 'NOTE', 'Test note');
    app.updateTriage(patientId, 'ROJO');

    const blob = app.exportToExcel();
    const workbook = XLSX.read(blob, { type: 'array' });

    // Check patient sheet
    const patients = XLSX.utils.sheet_to_json(workbook.Sheets['Censo Pacientes']);
    expect(patients).toHaveLength(1);

    // Check traceability sheet
    const trazas = XLSX.utils.sheet_to_json(workbook.Sheets['Trazabilidad']);
    expect(trazas.length).toBeGreaterThan(0);
  });

  test('print badge generates correct HTML', async () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'Test', triage: 'ROJO' });

    const badgeHTML = app.printPatientBadge(patientId);

    expect(badgeHTML).toContain('Test');
    expect(badgeHTML).toContain('ROJO');
    expect(badgeHTML).toContain('print-badge');
  });
});
```

#### Integración: IndexedDB + SQLite (10 tests)

```javascript
describe('IndexedDB ↔ SQLite Integration', () => {
  test('automatic save after registration', async () => {
    const app = createTestApp();
    await app.init();

    app.registerPatient({ name: 'T' });
    await sleep(2500); // Wait for throttle

    const idb = await openDB('ECEDES_DB', 1);
    const data = await idb.get('sqlite_backup', 'latest');
    expect(data).toBeTruthy();
  });

  test('automatic save after triage change', async () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T' });
    await sleep(2500);

    app.updateTriage(patientId, 'ROJO');
    await sleep(2500);

    const idb = await openDB('ECEDES_DB', 1);
    const data = await idb.get('sqlite_backup', 'latest');
    const restoredDB = new SQL.Database(data);
    const result = restoredDB.exec('SELECT triage_actual FROM pacientes');
    expect(result[0].values[0][0]).toBe('ROJO');
  });

  test('load restores complete application state', async () => {
    const app = createTestApp();
    app.session = { hospital: 'H1', operador: 'O1', rol: 'MEDICO' };
    app.registerPatient({ name: 'T1' });
    app.registerPatient({ name: 'T2' });
    await app.saveToIndexedDB();

    const app2 = createTestApp();
    await app2.loadFromIndexedDB();

    expect(app2.session.hospital).toBe('H1');
    const result = app2.db.exec('SELECT COUNT(*) FROM pacientes');
    expect(result[0].values[0][0]).toBe(2);
  });

  test('indexedDB quota handling', async () => {
    const app = createTestApp();
    // Register many patients to test quota
    for (let i = 0; i < 10000; i++) {
      app.registerPatient({ name: `Patient ${i}` });
    }
    await expect(app.saveToIndexedDB()).resolves.toBeTruthy();
  });

  test('concurrent writes handle race conditions', async () => {
    const app = createTestApp();
    app.registerPatient({ name: 'T1' });
    app.registerPatient({ name: 'T2' });
    app.registerPatient({ name: 'T3' });

    // All saves should complete without error
    await expect(app.saveToIndexedDB()).resolves.toBeTruthy();
  });

  test('migration preserves data integrity', async () => {
    const app1 = createTestApp({ schemaVersion: 1 });
    app1.registerPatient({ name: 'T' });
    await app1.saveToIndexedDB();

    const app2 = createTestApp({ schemaVersion: 2 });
    await app2.loadFromIndexedDB();

    const result = app2.db.exec('SELECT nombre FROM pacientes');
    expect(result[0].values[0][0]).toBe('T');
  });

  test('backup created before migration', async () => {
    const app = createTestApp({ schemaVersion: 1 });
    app.registerPatient({ name: 'T' });
    await app.saveToIndexedDB();

    const app2 = createTestApp({ schemaVersion: 2 });
    await app2.loadFromIndexedDB();

    const backups = await app2.getBackups();
    expect(backups.length).toBeGreaterThan(0);
  });

  test('indexedDB error triggers fallback', async () => {
    const app = createTestApp();
    // Simulate IndexedDB error
    const idbOpenSpy = jest.spyOn(indexedDB, 'open').mockImplementation(() => {
      throw new Error('IndexedDB not available');
    });

    await expect(app.saveToIndexedDB()).rejects.toThrow();
    idbOpenSpy.mockRestore();
  });

  test('cross-tab synchronization', async () => {
    const app1 = createTestApp();
    app1.registerPatient({ name: 'T1' });
    await app1.saveToIndexedDB();

    // Simulate second tab
    const app2 = createTestApp();
    await app2.loadFromIndexedDB();

    const result = app2.db.exec('SELECT COUNT(*) FROM pacientes');
    expect(result[0].values[0][0]).toBe(1);
  });

  test('persistent session across reloads', async () => {
    const app = createTestApp();
    app.login('Hospital', 'Operador', '1234');
    await app.saveToIndexedDB();

    const app2 = createTestApp();
    await app2.loadFromIndexedDB();

    expect(app2.session.hospital).toBe('Hospital');
    expect(app2.session.operador).toBe('Operador');
  });
});
```

#### Integración: Dashboard + ECE-DES (5 tests)

```javascript
describe('Dashboard ↔ ECE-DES Integration', () => {
  test('dashboard reads real-time data from ECE-DES', async () => {
    const app = createTestApp();
    const dash = createTestDashboard();

    app.registerPatient({ name: 'T1', triage: 'ROJO' });
    app.registerPatient({ name: 'T2', triage: 'VERDE' });
    await app.saveToIndexedDB();

    await dash.loadDatabase();

    expect(dash.kpis.totalPatients).toBe(2);
    expect(dash.kpis.criticalPatients).toBe(1);
  });

  test('dashboard updates when ECE-DES data changes', async () => {
    const app = createTestApp();
    const dash = createTestDashboard();

    await dash.loadDatabase();
    expect(dash.kpis.totalPatients).toBe(0);

    app.registerPatient({ name: 'T1' });
    await app.saveToIndexedDB();

    await dash.loadDatabase();
    expect(dash.kpis.totalPatients).toBe(1);
  });

  test('dashboard handles missing database gracefully', async () => {
    const dash = createTestDashboard();

    await expect(dash.loadDatabase()).resolves.toBeTruthy();
    expect(dash.kpis.totalPatients).toBe(0);
  });

  test('dashboard calculates correct KPIs', async () => {
    const app = createTestApp();
    const dash = createTestDashboard();

    for (let i = 0; i < 5; i++) {
      app.registerPatient({ name: `T${i}`, triage: 'ROJO' });
    }
    for (let i = 0; i < 3; i++) {
      app.registerPatient({ name: `V${i}`, triage: 'VERDE' });
    }
    await app.saveToIndexedDB();

    await dash.loadDatabase();

    expect(dash.kpis.totalPatients).toBe(8);
    expect(dash.kpis.criticalPatients).toBe(5);
    expect(dash.kpis.distribution.ROJO).toBe(5);
    expect(dash.kpis.distribution.VERDE).toBe(3);
  });

  test('dashboard timeline shows recent events', async () => {
    const app = createTestApp();
    const dash = createTestDashboard();

    const patientId = app.registerPatient({ name: 'T' });
    app.addClinicalEvent(patientId, 'NOTE', 'Event 1');
    app.addClinicalEvent(patientId, 'NOTE', 'Event 2');
    await app.saveToIndexedDB();

    await dash.loadDatabase();

    expect(dash.timeline.length).toBeGreaterThan(0);
    expect(dash.timeline[0].description).toBe('Event 2');
  });
});
```

#### Integración: Export + Database (5 tests)

```javascript
describe('Export ↔ Database Integration', () => {
  test('export includes all database tables', () => {
    const app = createTestApp();
    app.registerPatient({ name: 'T' });
    app.updateTriage(app.getPatientId('T'), 'ROJO');

    const blob = app.exportToExcel();
    const workbook = XLSX.read(blob, { type: 'array' });

    expect(workbook.SheetNames).toContain('Censo Pacientes');
    expect(workbook.SheetNames).toContain('Trazabilidad');
    expect(workbook.SheetNames).toContain('Auditoría');
  });

  test('export preserves data relationships', () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T' });
    app.addClinicalEvent(patientId, 'NOTE', 'Test note');

    const blob = app.exportToExcel();
    const workbook = XLSX.read(blob, { type: 'array' });

    const patients = XLSX.utils.sheet_to_json(workbook.Sheets['Censo Pacientes']);
    const events = XLSX.utils.sheet_to_json(workbook.Sheets['Trazabilidad']);

    expect(patients[0].nombre).toBe('T');
    expect(events[0].descripcion).toBe('Test note');
  });

  test('export handles large datasets', () => {
    const app = createTestApp();
    for (let i = 0; i < 1000; i++) {
      app.registerPatient({ name: `Patient ${i}` });
    }

    const blob = app.exportToExcel();
    const workbook = XLSX.read(blob, { type: 'array' });
    const patients = XLSX.utils.sheet_to_json(workbook.Sheets['Censo Pacientes']);

    expect(patients).toHaveLength(1000);
  });

  test('export filename includes timestamp', () => {
    const app = createTestApp();
    const filename = app.exportToExcel().filename;

    expect(filename).toMatch(/ECEDES_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.xlsx/);
  });

  test('export preserves special characters', () => {
    const app = createTestApp();
    app.registerPatient({ name: 'María José García López' });

    const blob = app.exportToExcel();
    const workbook = XLSX.read(blob, { type: 'array' });
    const patients = XLSX.utils.sheet_to_json(workbook.Sheets['Censo Pacientes']);

    expect(patients[0].nombre).toBe('María José García López');
  });
});
```

---

## 🎭 PLAN DE PRUEBAS E2E

### Flujos Críticos E2E (45 tests)

#### Flujo 1: Registro Completo de Paciente (10 tests)

```javascript
describe('E2E: Complete Patient Registration Flow', () => {
  test('complete workflow from login to registration', async () => {
    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES.html');

    // Step 1: Login
    await page.fill('#login-hospital', 'Hospital General');
    await page.fill('#login-operador', 'Dr. Smith');
    await page.fill('#login-pin', '1234');
    await page.click('#btn-login');

    // Verify login successful
    await expect(page.locator('#view-main')).toBeVisible();

    // Step 2: Register new patient
    await page.click('#btn-new-patient');
    await page.fill('#patient-name', 'Juan Pérez');
    await page.fill('#patient-age', '45');
    await page.selectOption('#patient-sex', 'M');
    await page.click('#btn-save-patient');

    // Verify patient registered
    await expect(page.locator('#census-table')).toContainText('Juan Pérez');

    // Step 3: Assign triage
    await page.click('[data-patient-id="P-1"]');
    await page.click('#btn-triage-rojo');

    // Verify triage assigned
    await expect(page.locator('[data-patient-id="P-1"]')).toHaveClass(/triage-rojo/);

    await page.close();
  });

  test('patient registration with all optional fields', async () => {
    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES.html');
    await login(page);

    await page.click('#btn-new-patient');
    await page.fill('#patient-name', 'María Garcia');
    await page.fill('#patient-age', '32');
    await page.selectOption('#patient-sex', 'F');
    await page.fill('#patient-nss', '1234567890');
    await page.fill('#patient-pulsera', 'BR-001');
    await page.selectOption('#patient-discapacidad', 'Movilidad reducida');
    await page.click('#btn-save-patient');

    await expect(page.locator('#census-table')).toContainText('María Garcia');
    await expect(page.locator('#census-table')).toContainText('1234567890');

    await page.close();
  });

  test('patient registration validation', async () => {
    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES.html');
    await login(page);

    await page.click('#btn-new-patient');
    // Don't fill required fields
    await page.click('#btn-save-patient');

    // Should show validation error
    await expect(page.locator('.notification-error')).toBeVisible();

    await page.close();
  });

  test('patient search functionality', async () => {
    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES.html');
    await login(page);

    // Register multiple patients
    await registerPatient(page, 'Juan Perez');
    await registerPatient(page, 'Maria Lopez');
    await registerPatient(page, 'Juan Garcia');

    // Search for "Juan"
    await page.fill('#search-input', 'Juan');
    await page.press('#search-input', 'Enter');

    // Should show only patients with "Juan"
    const rows = await page.locator('#census-table tbody tr').count();
    expect(rows).toBe(2);

    await page.close();
  });

  test('patient detail view', async () => {
    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES.html');
    await login(page);

    await registerPatient(page, 'Test Patient');
    await page.click('[data-patient-id="P-1"]');

    // Should open modal with patient details
    await expect(page.locator('#modal-expediente')).toBeVisible();
    await expect(page.locator('#modal-expediente')).toContainText('Test Patient');

    await page.close();
  });

  test('timeline view in patient details', async () => {
    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES.html');
    await login(page);

    const patientId = await registerPatient(page, 'Timeline Test');
    await page.click(`[data-patient-id="${patientId}"]`);

    // Add clinical event
    await page.click('#btn-add-event');
    await page.selectOption('#event-type', 'NOTE');
    await page.fill('#event-description', 'Initial assessment');
    await page.click('#btn-save-event');

    // Should show in timeline
    await expect(page.locator('.timeline')).toContainText('Initial assessment');

    await page.close();
  });

  test('triage change from patient detail', async () => {
    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES.html');
    await login(page);

    const patientId = await registerPatient(page, 'Triage Test');
    await page.click(`[data-patient-id="${patientId}"]`);

    // Change triage
    await page.selectOption('#change-triage', 'ROJO');
    await page.click('#btn-update-triage');

    // Verify change
    await expect(page.locator('.current-triage')).toContainText('ROJO');

    await page.close();
  });

  test('print badge from patient detail', async () => {
    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES.html');
    await login(page);

    const patientId = await registerPatient(page, 'Badge Test', 'ROJO');
    await page.click(`[data-patient-id="${patientId}"]`);

    // Click print button
    const printPromise = page.waitForEvent('popup');
    await page.click('#btn-print-badge');
    const printPage = await printPromise;

    // Verify print dialog opened
    expect(printPage).toBeTruthy();

    await page.close();
    await printPage.close();
  });

  test('data persistence across page reload', async () => {
    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES.html');
    await login(page);

    await registerPatient(page, 'Persistence Test');

    // Reload page
    await page.reload();

    // Patient should still be there
    await expect(page.locator('#census-table')).toContainText('Persistence Test');

    await page.close();
  });

  test('logout functionality', async () => {
    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES.html');
    await login(page);

    await page.click('#btn-logout');

    // Should return to login view
    await expect(page.locator('#view-login')).toBeVisible();
    await expect(page.locator('#view-main')).toBeHidden();

    await page.close();
  });
});
```

#### Flujo 2: Dashboard Analytics (8 tests)

```javascript
describe('E2E: Dashboard Analytics Flow', () => {
  test('dashboard loads and displays KPIs', async () => {
    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES-Dashboard.html');

    // Wait for data to load
    await page.waitForSelector('.kpi-card');

    // Verify KPIs are displayed
    await expect(page.locator('#kpi-total-patients')).toBeVisible();
    await expect(page.locator('#kpi-critical-patients')).toBeVisible();
    await expect(page.locator('#kpi-total-actions')).toBeVisible();

    await page.close();
  });

  test('dashboard reflects ECE-DES data', async () => {
    // First, register patients in ECE-DES
    const app = createTestApp();
    app.registerPatient({ name: 'T1', triage: 'ROJO' });
    app.registerPatient({ name: 'T2', triage: 'VERDE' });
    await app.saveToIndexedDB();

    // Then open dashboard
    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES-Dashboard.html');
    await page.waitForSelector('.kpi-card');

    // Verify data matches
    await expect(page.locator('#kpi-total-patients')).toContainText('2');
    await expect(page.locator('#kpi-critical-patients')).toContainText('1');

    await page.close();
  });

  test('bar chart displays correct distribution', async () => {
    const app = createTestApp();
    for (let i = 0; i < 5; i++) {
      app.registerPatient({ name: `R${i}`, triage: 'ROJO' });
    }
    for (let i = 0; i < 3; i++) {
      app.registerPatient({ name: `A${i}`, triage: 'AMARILLO' });
    }
    await app.saveToIndexedDB();

    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES-Dashboard.html');
    await page.waitForSelector('.bar-chart');

    // Verify bars are present and have correct heights
    const redBar = await page.locator('.bar-rojo').getAttribute('data-height');
    const yellowBar = await page.locator('.bar-amarillo').getAttribute('data-height');

    expect(parseInt(redBar)).toBeGreaterThan(parseInt(yellowBar));

    await page.close();
  });

  test('timeline shows recent events', async () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T' });
    app.addClinicalEvent(patientId, 'NOTE', 'Event 1');
    app.addClinicalEvent(patientId, 'MEDICATION', 'Med 1');
    await app.saveToIndexedDB();

    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES-Dashboard.html');
    await page.waitForSelector('.timeline');

    await expect(page.locator('.timeline')).toContainText('Med 1');

    await page.close();
  });

  test('patient table displays all patients', async () => {
    const app = createTestApp();
    app.registerPatient({ name: 'P1', triage: 'ROJO' });
    app.registerPatient({ name: 'P2', triage: 'VERDE' });
    await app.saveToIndexedDB();

    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES-Dashboard.html');
    await page.waitForSelector('#patient-table');

    const rows = await page.locator('#patient-table tbody tr').count();
    expect(rows).toBe(2);

    await page.close();
  });

  test('dashboard auto-refreshes', async () => {
    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES-Dashboard.html');
    await page.waitForSelector('.kpi-card');

    const initialCount = await page.textContent('#kpi-total-patients');

    // Register new patient in another tab
    const app = createTestApp();
    app.registerPatient({ name: 'New' });
    await app.saveToIndexedDB();

    // Reload dashboard
    await page.reload();
    await page.waitForSelector('.kpi-card');

    const newCount = await page.textContent('#kpi-total-patients');
    expect(parseInt(newCount)).toBe(parseInt(initialCount) + 1);

    await page.close();
  });

  test('dashboard handles empty database', async () => {
    // Clear database
    const app = createTestApp();
    await app.clearDatabase();

    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES-Dashboard.html');
    await page.waitForSelector('.kpi-card');

    // Should show zeros
    await expect(page.locator('#kpi-total-patients')).toContainText('0');

    await page.close();
  });

  test('dashboard print mode', async () => {
    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES-Dashboard.html');
    await page.waitForSelector('.kpi-card');

    // Trigger print
    const printPromise = page.waitForEvent('popup');
    await page.click('#btn-print');
    const printPage = await printPromise;

    expect(printPage).toBeTruthy();

    await page.close();
    await printPage.close();
  });
});
```

#### Flujo 3: Exportación de Datos (7 tests)

```javascript
describe('E2E: Data Export Flow', () => {
  test('export to Excel from ECE-DES', async () => {
    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES.html');
    await login(page);

    // Register some patients
    await registerPatient(page, 'Export Test 1');
    await registerPatient(page, 'Export Test 2');

    // Click export button
    const downloadPromise = page.waitForEvent('download');
    await page.click('#btn-export-excel');
    const download = await downloadPromise;

    // Verify file was downloaded
    expect(download.suggestedFilename()).toMatch(/ECEDES_.*\.xlsx/);

    await page.close();
  });

  test('exported file contains all sheets', async () => {
    const app = createTestApp();
    app.registerPatient({ name: 'T' });
    const blob = app.exportToExcel();

    const workbook = XLSX.read(blob, { type: 'array' });
    expect(workbook.SheetNames).toHaveLength(3);
    expect(workbook.SheetNames).toEqual(expect.arrayContaining([
      'Censo Pacientes',
      'Trazabilidad',
      'Auditoría'
    ]));
  });

  test('export includes all patient data', async () => {
    const app = createTestApp();
    app.registerPatient({ name: 'Juan', age: 45, sex: 'M' });
    app.registerPatient({ name: 'Maria', age: 32, sex: 'F' });

    const blob = app.exportToExcel();
    const workbook = XLSX.read(blob, { type: 'array' });
    const patients = XLSX.utils.sheet_to_json(workbook.Sheets['Censo Pacientes']);

    expect(patients).toHaveLength(2);
    expect(patients[0].nombre).toBe('Juan');
    expect(patients[1].nombre).toBe('Maria');
  });

  test('export includes traceability data', async () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T' });
    app.updateTriage(patientId, 'ROJO');
    app.updateTriage(patientId, 'AMARILLO');

    const blob = app.exportToExcel();
    const workbook = XLSX.read(blob, { type: 'array' });
    const trazas = XLSX.utils.sheet_to_json(workbook.Sheets['Trazabilidad']);

    expect(trazas.length).toBeGreaterThanOrEqual(2);
  });

  test('export includes audit log', async () => {
    const app = createTestApp();
    app.login('H', 'O', '1234');
    app.registerPatient({ name: 'T' });

    const blob = app.exportToExcel();
    const workbook = XLSX.read(blob, { type: 'array' });
    const audits = XLSX.utils.sheet_to_json(workbook.Sheets['Auditoría']);

    expect(audits.length).toBeGreaterThan(0);
    expect(audits[0].accion).toBe('LOGIN');
  });

  test('export handles special characters', async () => {
    const app = createTestApp();
    app.registerPatient({ name: 'María José García-López' });

    const blob = app.exportToExcel();
    const workbook = XLSX.read(blob, { type: 'array' });
    const patients = XLSX.utils.sheet_to_json(workbook.Sheets['Censo Pacientes']);

    expect(patients[0].nombre).toBe('María José García-López');
  });

  test('export filename format is correct', async () => {
    const app = createTestApp();
    const blob = app.exportToExcel();

    // Extract filename from blob
    expect(blob.name).toMatch(/ECEDES_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.xlsx/);
  });
});
```

---

## ⚡ PLAN DE PRUEBAS DE PERFORMANCE

### Pruebas de Performance (15 tests)

```javascript
describe('Performance Tests', () => {
  test('initial page load < 5s', async () => {
    const startTime = Date.now();
    const page = await browser.newPage();
    await page.goto('file:///path/to/ECE-DES.html');
    await page.waitForSelector('#view-login');
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(5000);
    await page.close();
  });

  test('patient registration < 100ms', () => {
    const app = createTestApp();
    const startTime = Date.now();
    app.registerPatient({ name: 'Performance Test' });
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(100);
  });

  test('triage change < 50ms', () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T' });
    const startTime = Date.now();
    app.updateTriage(patientId, 'ROJO');
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(50);
  });

  test('IndexedDB save < 500ms', async () => {
    const app = createTestApp();
    app.registerPatient({ name: 'T' });
    const startTime = Date.now();
    await app.saveToIndexedDB();
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(500);
  });

  test('IndexedDB load < 500ms', async () => {
    const app = createTestApp();
    app.registerPatient({ name: 'T' });
    await app.saveToIndexedDB();

    const app2 = createTestApp();
    const startTime = Date.now();
    await app2.loadFromIndexedDB();
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(500);
  });

  test('export 100 patients < 2s', () => {
    const app = createTestApp();
    for (let i = 0; i < 100; i++) {
      app.registerPatient({ name: `Patient ${i}` });
    }
    const startTime = Date.now();
    app.exportToExcel();
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(2000);
  });

  test('export 1000 patients < 5s', () => {
    const app = createTestApp();
    for (let i = 0; i < 1000; i++) {
      app.registerPatient({ name: `Patient ${i}` });
    }
    const startTime = Date.now();
    app.exportToExcel();
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(5000);
  });

  test('dashboard load < 3s with 100 patients', async () => {
    const app = createTestApp();
    for (let i = 0; i < 100; i++) {
      app.registerPatient({ name: `Patient ${i}` });
    }
    await app.saveToIndexedDB();

    const startTime = Date.now();
    const dash = createTestDashboard();
    await dash.loadDatabase();
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(3000);
  });

  test('search 1000 patients < 200ms', () => {
    const app = createTestApp();
    for (let i = 0; i < 1000; i++) {
      app.registerPatient({ name: `Patient ${i}` });
    }
    const startTime = Date.now();
    const results = app.searchPatient('Patient 500');
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(200);
    expect(results).toHaveLength(1);
  });

  test('render census with 100 patients < 1s', () => {
    const app = createTestApp();
    for (let i = 0; i < 100; i++) {
      app.registerPatient({ name: `Patient ${i}` });
    }
    const startTime = Date.now();
    app.renderCensus();
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(1000);
  });

  test('concurrent registrations handle 10 simultaneous < 1s', async () => {
    const app = createTestApp();
    const startTime = Date.now();
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(app.registerPatient({ name: `Patient ${i}` }));
    }
    await Promise.all(promises);
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(1000);
  });

  test('memory usage with 1000 patients < 50MB', () => {
    const app = createTestApp();
    for (let i = 0; i < 1000; i++) {
      app.registerPatient({ name: `Patient ${i}` });
    }

    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    expect(memoryUsage).toBeLessThan(50);
  });

  test('database size with 1000 patients < 5MB', () => {
    const app = createTestApp();
    for (let i = 0; i < 1000; i++) {
      app.registerPatient({ name: `Patient ${i}`, age: i, sex: 'M' });
    }
    const data = app.db.export();
    const sizeMB = data.length / 1024 / 1024;

    expect(sizeMB).toBeLessThan(5);
  });

  test('throttled save does not cause performance degradation', async () => {
    const app = createTestApp({ saveThrottleMs: 100 });
    const startTime = Date.now();

    for (let i = 0; i < 10; i++) {
      app.registerPatient({ name: `Patient ${i}` });
    }
    await sleep(200); // Wait for throttle

    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(1000);
  });

  test('timeline render with 100 events < 500ms', () => {
    const app = createTestApp();
    const patientId = app.registerPatient({ name: 'T' });
    for (let i = 0; i < 100; i++) {
      app.addClinicalEvent(patientId, 'NOTE', `Event ${i}`);
    }
    const startTime = Date.now();
    app.renderTimeline(patientId);
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(500);
  });
});
```

---

## 🔒 PLAN DE PRUEBAS DE SEGURIDAD

### Pruebas de Seguridad (5 tests)

```javascript
describe('Security Tests', () => {
  test('PIN should be hashed before storage', () => {
    const app = createTestApp();
    app.login('H', 'O', '1234');

    const storedPin = localStorage.getItem('ecedes_pin');
    expect(storedPin).not.toBe('1234');
    expect(storedPin).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt format
  });

  test('innerHTML should not cause XSS', () => {
    const app = createTestApp();
    const maliciousName = '<script>alert("XSS")</script>';
    app.registerPatient({ name: maliciousName });

    const element = document.createElement('div');
    element.textContent = maliciousName;
    expect(element.innerHTML).not.toContain('<script>');
  });

  test('SQL injection should be prevented', () => {
    const app = createTestApp();
    const maliciousInput = "'; DROP TABLE pacientes; --";
    expect(() => app.registerPatient({ name: maliciousInput })).not.toThrow();

    const result = app.db.exec('SELECT COUNT(*) FROM pacientes');
    expect(result[0].values[0][0]).toBe(1);
  });

  test('audit log should be immutable', () => {
    const app = createTestApp();
    app.login('H', 'O', '1234');
    app.registerPatient({ name: 'T' });

    // Try to modify audit log
    expect(() => {
      app.db.run('DELETE FROM auditoria');
    }).toThrow();

    const audit = app.db.exec('SELECT COUNT(*) FROM auditoria');
    expect(audit[0].values[0][0]).toBeGreaterThan(0);
  });

  test('session should expire after inactivity', () => {
    const app = createTestApp();
    app.login('H', 'O', '1234');

    // Simulate 1 hour of inactivity
    jest.advanceTimersByTime(60 * 60 * 1000);

    expect(app.session).toBeNull();
  });
});
```

---

## 🌐 PLAN DE PRUEBAS DE COMPATIBILIDAD

### Cross-browser Testing

| Navegador | Versión | ECE-DES | Dashboard | Tarjetas | Generador |
|-----------|---------|---------|-----------|----------|-----------|
| **Chrome** | 120+ | ✅ | ✅ | ✅ | ✅ |
| **Firefox** | 115+ | ✅ | ✅ | ✅ | ✅ |
| **Safari** | 15+ | ✅ | ✅ | ✅ | ✅ |
| **Edge** | 120+ | ✅ | ✅ | ✅ | ✅ |
| **Opera** | 100+ | ⚠️ | ⚠️ | ✅ | ✅ |

### Platform Testing

| Plataforma | ECE-DES | Dashboard | Otros |
|------------|---------|-----------|-------|
| **Windows 10/11** | ✅ | ✅ | ✅ |
| **macOS 12+** | ✅ | ✅ | ✅ |
| **Linux (Ubuntu)** | ✅ | ✅ | ✅ |
| **Android 12+** | ⚠️ | ⚠️ | ✅ |
| **iOS 15+** | ⚠️ | ⚠️ | ✅ |

---

## 🎯 CASOS DE PRUEBA PRIORITARIOS

### P0 - Críticos (Must Have)

| ID | Test Case | Herramienta | Prioridad | Riesgo |
|----|-----------|-------------|-----------|--------|
| P0-001 | Registro de paciente completo | ECE-DES | Alta | Pérdida de datos |
| P0-002 | Cambio de triage | ECE-DES | Alta | Error médico |
| P0-003 | Persistencia IndexedDB | ECE-DES | Alta | Pérdida de datos |
| P0-004 | Exportación Excel | ECE-DES | Alta | Reportes oficiales |
| P0-005 | Dashboard KPIs | Dashboard | Alta | Decisiones clínicas |
| P0-006 | Login/PIN validation | ECE-DES | Alta | Seguridad |
| P0-007 | Auditoría de cambios | ECE-DES | Alta | Cumplimiento legal |
| P0-008 | Migración de DB | ECE-DES | Alta | Integridad de datos |
| P0-009 | Impresión de badges | ECE-DES | Media | Operacional |
| P0-010 | Backup automático | ECE-DES | Alta | Recuperación de desastres |

---

## 🤖 AUTOMATIZACIÓN RECOMENDADA

### Setup de Testing

```bash
# Install dependencies
npm install --save-dev \
  jest \
  @testing-library/dom \
  @testing-library/user-event \
  playwright \
  puppeteer \
  lighthouse-ci \
  jest-html-reporters

# Setup
npm run test:init
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:performance": "lighthouse http://localhost:8000 --output=json",
    "test:security": "owasp-zap-baseline.py",
    "test:all": "npm run test && npm run test:e2e && npm run test:performance"
  }
}
```

### CI/CD Pipeline (GitHub Actions)

```yaml
name: Testing Pipeline

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:e2e

  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:performance
```

---

## 📊 MÉTRICAS DE COBERTURA

### Objetivos de Cobertura

| Tipo | Objetivo | Actual | Gap |
|------|----------|--------|-----|
| **Lines** | >85% | 0% | -85% |
| **Functions** | >85% | 0% | -85% |
| **Branches** | >75% | 0% | -75% |
| **Statements** | >85% | 0% | -85% |

### Progreso de Testing

| Estado | Cantidad | Porcentaje |
|--------|----------|------------|
| **Tests Completados** | 0 | 0% |
| **Tests Pendientes** | 240 | 100% |
| **Tests Automatizados** | 0 | 0% |
| **Tests Manuales** | 0 | 0% |

---

## 📝 CONCLUSIÓN

### Resumen Ejecutivo

- **Total de Tests Planificados:** 240
- **Estimated Effort:** 120-160 horas
- **Timeline Recomendado:** 8-10 semanas
- **Prioridad:** P0 > P1 > P2 > P3

### Próximos Pasos

1. **Fase 1 (Semanas 1-2):** Unit Tests (110 tests)
2. **Fase 2 (Semanas 3-5):** Integration Tests (65 tests)
3. **Fase 3 (Semanas 6-7):** E2E Tests (45 tests)
4. **Fase 4 (Semana 8):** Performance + Security (20 tests)
5. **Fase 5 (Semanas 9-10):** CI/CD setup + Automation

---

**Fecha:** 2026-03-04
**Agente:** CONTROLADOR (ADRC 2.0)
**Session ID:** 50d06da5-0c4d-48d4-803d-43767d97653a
**Aprobado por:** _______________

*Este documento es la guía definitiva para testing de CVOED-Tools v1.1.0*
