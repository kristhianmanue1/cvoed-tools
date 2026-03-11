# 🎯 PLAN TÉCNICO DETALLADO - 5 FASES CVOED-TOOLS

**Fecha:** 2026-03-04
**Agente:** CONTROLADOR (ADRC 2.0)
**Versión:** 1.1.0 → 2.0.0
**Timeline:** 12 semanas
**Prioridad:** CRÍTICA

---

## 📋 ÍNDICE

1. [Visión General](#visión-general)
2. [Fase 1: Foundation](#fase-1-foundation)
3. [Fase 2: Quality](#fase-2-quality)
4. [Fase 3: Enhancement](#fase-3-enhancement)
5. [Fase 4: Automation](#fase-4-automation)
6. [Fase 5: Evolution](#fase-5-evolution)
7. [Pasos Críticos](#pasos-críticos)
8. [Matriz de Riesgos](#matriz-de-riesgos)
9. [Recursos Requeridos](#recursos-requeridos)

---

## 🎯 VISIÓN GENERAL

### Objetivo Principal

Transformar CVOED-Tools v1.1.0 en v2.0.0 con:
- **85%+ cobertura de pruebas**
- **Security score 9/10**
- **Performance score 9/10**
- **CI/CD pipeline automatizado**
- **Arquitectura modular**

### Enfoque: Quality First (Gate 3)

```
┌─────────────────────────────────────────────────────────────┐
│                    QUALITY GATE (L6)                        │
├─────────────────────────────────────────────────────────────┤
│  ✅ Mypy strict (type safety)                               │
│  ✅ Test coverage >85%                                      │
│  ✅ Documentación técnica viva                              │
│  ✅ Sin warnings críticos                                   │
│  ✅ Performance benchmarks                                  │
└─────────────────────────────────────────────────────────────┘
```

### Timeline

```
Fase 1: Foundation     ████░░░░░░  Semana 1-2   (10 tareas)
Fase 2: Quality        ░░░████░░░░  Semana 3-6   (45 tareas)
Fase 3: Enhancement    ░░░░░░████░  Semana 7-9   (30 tareas)
Fase 4: Automation     ░░░░░░░░░██  Semana 10-11 (15 tareas)
Fase 5: Evolution      ░░░░░░░░░░█  Semana 12    (10 tareas)
                       ───────────────────────────
                       Total: 110 tareas en 12 semanas
```

---

## 📦 FASE 1: FOUNDATION (Semanas 1-2)

### Objetivo
Establecer fundamentos técnicos sólidos para desarrollo escalable.

### Tareas Críticas

#### 1.1 Setup de Infraestructura de Testing (3 días)

**Especificación Técnica:**

```yaml
Tarea: SETUP_TESTING_FRAMEWORK
Prioridad: P0
Estimado: 3 días
Dependencies: Ninguna

Especificación:
  framework: Jest + Testing Library
  config:
    - jest.config.js con presets
    - setupTests.js para IndexedDB mock
    - transformadores para ES6+
    - coverage thresholds (85%)
    - reporters (HTML, JSON, CLI)

Comandos:
  - npm install --save-dev jest @testing-library/dom @testing-library/user-event
  - npm install --save-dev @babel/preset-env
  - npm install --save-dev jest-html-reporters
  - npm install --save-dev fake-indexeddb

Archivos a crear:
  - jest.config.js
  - babel.config.js
  - setupTests.js
  - tests/unit/setup.js
  - tests/integration/setup.js

Quality Gate:
  - jest --passWithNoTests retorna exit 0
  - npm run test:coverage reporta >0% cobertura
```

**Criterios de Aceptación:**
- [ ] Jest ejecuta sin errores
- [ ] Coverage report generado
- [ ] Mock de IndexedDB funcional
- [ ] Tests pueden acceder a DOM

---

#### 1.2 Implementar Hashing para PINs (2 días)

**Especificación Técnica:**

```yaml
Tarea: IMPLEMENT_PIN_HASHING
Prioridad: P0
Estimado: 2 días
Dependencies: SETUP_TESTING_FRAMEWORK

Especificación:
  algoritmo: bcrypt (cost factor: 10)
  implementación:
    - login(): Hash PIN antes de almacenar
    - verify(): Comparar hash en login
    - migration: Migrar PINs existentes

Código de referencia:
  // Usar bcryptjs para browser
  import bcrypt from 'bcryptjs';

  // En login()
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(pin, salt);
  localStorage.setItem('ecedes_pin_hash', hash);

  // Verificación
  const isValid = bcrypt.compareSync(inputPin, storedHash);

Tests requeridos:
  - test('PIN hashing produces consistent hashes')
  - test('PIN verification works correctly')
  - test('PIN migration preserves existing data')
  - test('different PINs produce different hashes')

Quality Gate:
  - 4 unit tests pasando
  - Coverage >90% para hashing module
```

**Criterios de Aceptación:**
- [ ] PINs almacenados como hash bcrypt
- [ ] Verificación funcional
- [ ] Migración de PINs existentes
- [ ] Tests implementados

---

#### 1.3 Sanitización XSS (2 días)

**Especificación Técnica:**

```yaml
Tarea: SANITIZE_XSS
Prioridad: P0
Estimado: 2 días
Dependencies: SETUP_TESTING_FRAMEWORK

Especificación:
  approach: Reemplazar innerHTML con textContent
  scope:
    - app.renderCensus()
    - app.renderTimeline()
    - app.showNotification()
    - app.showPatientDetails()

Implementación:
  function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Reemplazar todos los innerHTML con:
  element.textContent = data; // o
  element.insertAdjacentHTML('beforeend', sanitizeHTML(data));

Tests requeridos:
  - test('XSS injection via patient name is prevented')
  - test('script tags are escaped in renderCensus')
  - test('HTML entities are preserved')
  - test('textContent does not execute scripts')

Quality Gate:
  - OWASP ZAP scan: 0 high vulnerabilities
  - 4 unit tests pasando
```

**Criterios de Aceptación:**
- [ ] Zero innerHTML sin sanitización
- [ ] OWASP ZAP clean
- [ ] Tests implementados

---

#### 1.4 Web Workers para Exportación (3 días)

**Especificación Técnica:**

```yaml
Tarea: IMPLEMENT_WEB_WORKERS
Prioridad: P0
Estimado: 3 días
Dependencies: Ninguna

Especificación:
  archivo: dist/workers/export-worker.js
  funcionalidad:
    - Generar Excel en background thread
    - No bloquear UI principal
    - Progress reporting

Implementación:
  // En main thread
  const worker = new Worker('dist/workers/export-worker.js');

  worker.postMessage({
    type: 'export',
    data: patientsData
  });

  worker.onmessage = (e) => {
    if (e.data.type === 'progress') {
      updateProgressBar(e.data.percent);
    } else if (e.data.type === 'complete') {
      downloadBlob(e.data.blob);
    }
  };

  // En worker
  self.onmessage = (e) => {
    if (e.data.type === 'export') {
      const blob = generateExcel(e.data.data);
      self.postMessage({ type: 'complete', blob });
    }
  };

Tests requeridos:
  - test('export with 1000 patients completes in <5s')
  - test('UI remains responsive during export')
  - test('progress callback fires correctly')
  - test('worker terminates after export')

Quality Gate:
  - Performance test: <5s para 1000 pacientes
  - UI responsiveness test: passed
  - 4 unit tests pasando
```

**Criterios de Aceptación:**
- [ ] Exportación en worker thread
- [ ] UI no bloquea durante exportación
- [ ] Progress indicator funcional
- [ ] Tests implementados

---

#### 1.5 Validaciones de Datos (2 días)

**Especificación Técnica:**

```yaml
Tarea: IMPLEMENT_VALIDATIONS
Prioridad: P0
Estimado: 2 días
Dependencies: SETUP_TESTING_FRAMEWORK

Especificación:
  schema: JSON Schema validation
  campos a validar:
    - nombre: string, 2-100 chars, sin HTML
    - edad: integer, 0-150
    - sexo: enum ['M', 'F', 'I']
    - nss: string, 10-15 digits (opcional)
    - pulsera_id: string, alphanumeric (opcional)

Implementación:
  import Ajv from 'ajv';

  const patientSchema = {
    type: 'object',
    required: ['nombre', 'edad', 'sexo'],
    properties: {
      nombre: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        pattern: '^[^<>]+$'  // Sin HTML tags
      },
      edad: {
        type: 'integer',
        minimum: 0,
        maximum: 150
      },
      sexo: {
        type: 'string',
        enum: ['M', 'F', 'I']
      }
    }
  };

  const ajv = new Ajv();
  const validate = ajv.compile(patientSchema);

  function validatePatient(data) {
    const valid = validate(data);
    if (!valid) {
      throw new ValidationException(validate.errors);
    }
  }

Tests requeridos:
  - test('valid patient data passes validation')
  - test('invalid age throws error')
  - test('HTML tags in name are rejected')
  - test('invalid sex enum throws error')
  - test('validation errors are user-friendly')

Quality Gate:
  - 5 unit tests pasando
  - Coverage >90% para validation module
```

**Criterios de Aceptación:**
- [ ] JSON Schema implementado
- [ ] Validaciones en frontend
- [ ] Errores user-friendly
- [ ] Tests implementados

---

### Tareas Adicionales Fase 1

- [ ] **1.6** Setup ESLint + Prettier (1 día)
- [ ] **1.7** Configurar pre-commit hooks (1 día)
- [ ] **1.8** Documentar README development (1 día)
- [ ] **1.9** Setup environment variables (0.5 días)
- [ ] **1.10** Crear script de build mejorado (0.5 días)

### Entregables Fase 1

- ✅ Framework de testing funcional
- ✅ PINs hasheados con bcrypt
- ✅ Zero vulnerabilidades XSS
- ✅ Exportación en Web Workers
- ✅ Validaciones robustas
- ✅ Linting configurado
- ✅ Pre-commit hooks activos

### Quality Gates Fase 1

```bash
# Todos deben pasar:
npm run test              # 85%+ coverage
npm run lint              # Zero errors
npm run audit             # Zero high vulnerabilities
npm run build             # Build exitoso
```

---

## 🧪 FASE 2: QUALITY (Semanas 3-6)

### Objetivo
Alcanzar 85% cobertura de pruebas con calidad enterprise.

### Tareas Críticas

#### 2.1 Unit Tests - Authentication Module (3 días)

**Especificación Técnica:**

```yaml
Tarea: UNIT_TESTS_AUTH
Prioridad: P0
Estimado: 3 días
Dependencies: SETUP_TESTING_FRAMEWORK

Tests a implementar:
  1. login() valida PIN length (4 digits)
  2. login() hashea PIN antes de almacenar
  3. login() almacena sesión en localStorage
  4. login() audita evento LOGIN
  5. logout() limpia sesión
  6. logout() audita evento LOGOUT
  7. verifyPIN() compara hash correctamente
  8. verifyPIN() rechaza PIN incorrecto
  9. session persistence across reloads
  10. session expire después de inactivity

Ubicación: tests/unit/auth.test.js

Target Coverage: >90%

Mocks requeridos:
  - localStorage mock
  - bcrypt mock
  - Date mock (para timestamps)
```

**Criterios de Aceptación:**
- [ ] 10 tests implementados
- [ ] Coverage >90%
- [ ] Todos los tests pasan

---

#### 2.2 Unit Tests - Patient Registration (4 días)

**Especificación Técnica:**

```yaml
Tarea: UNIT_TESTS_PATIENTS
Prioridad: P0
Estimado: 4 días
Dependencies: SETUP_TESTING_FRAMEWORK

Tests a implementar:
  1. registerPatient() genera folio único
  2. registerPatient() inserta en DB
  3. registerPatient() audita registro
  4. registerPatient() valida campos requeridos
  5. registerPatient() setea triage default
  6. registerPatient() genera UUID válido
  7. registerPatient() valida rango de edad
  8. registerPatient() valida enum de sexo
  9. registerPatient() almacena operador
  10. registerPatient() trigger save con throttling
  11. updatePatient() modifica registro existente
  12. updatePatient() valida cambios
  13. deletePatient() marca como eliminado
  14. searchPatient() busca por nombre
  15. searchPatient() busca por folio

Ubicación: tests/unit/patients.test.js

Target Coverage: >90%
```

**Criterios de Aceptación:**
- [ ] 15 tests implementados
- [ ] Coverage >90%
- [ ] Todos los tests pasan

---

#### 2.3 Unit Tests - Triage System (3 días)

**Especificación Técnica:**

```yaml
Tarea: UNIT_TESTS_TRIAGE
Prioridad: P0
Estimado: 3 días
Dependencies: SETUP_TESTING_FRAMEWORK

Tests a implementar:
  1. updateTriage() cambia nivel correctamente
  2. updateTriage() valida valores (ROJO, AMARILLO, VERDE, NEGRO)
  3. updateTriage() crea registro trazabilidad
  4. updateTriage() almacena valor anterior
  5. updateTriage() audita cambio
  6. updateTriage() actualiza UI
  7. updateTriage() previene mismo triage
  8. updateTriage() maneja cambios concurrentes
  9. getTriageStats() calcula distribución
  10. getTriageStats() retorna métricas correctas

Ubicación: tests/unit/triage.test.js

Target Coverage: >90%
```

**Criterios de Aceptación:**
- [ ] 10 tests implementados
- [ ] Coverage >90%
- [ ] Todos los tests pasan

---

#### 2.4 Unit Tests - Persistence Layer (5 días)

**Especificación Técnica:**

```yaml
Tarea: UNIT_TESTS_PERSISTENCE
Prioridad: P0
Estimado: 5 días
Dependencies: SETUP_TESTING_FRAMEWORK

Tests a implementar:
  1. saveToIndexedDB() almacena SQLite binary
  2. saveToIndexedDB() throttle funciona correctamente
  3. saveToIndexedDB() maneja errores
  4. loadFromIndexedDB() restaura DB
  5. loadFromIndexedDB() maneja DB vacía
  6. migration backup antes de cambios
  7. migration version 1 to 2
  8. migration preserva integridad de datos
  9. indexedDB quota handling
  10. concurrent writes race conditions
  11. cross-tab synchronization
  12. persistent session across reloads
  13. backup creation antes de migración
  14. restore from backup
  15. clearDatabase() elimina todos los datos

Ubicación: tests/unit/persistence.test.js

Target Coverage: >90%

Mocks requeridos:
  - fake-indexeddb
  - SQLite mock
```

**Criterios de Aceptación:**
- [ ] 15 tests implementados
- [ ] Coverage >90%
- [ ] Todos los tests pasan

---

#### 2.5 Integration Tests - DB Operations (4 días)

**Especificación Técnica:**

```yaml
Tarea: INTEGRATION_TESTS_DB
Prioridad: P0
Estimado: 4 días
Dependencies: UNIT_TESTS_PERSISTENCE

Tests a implementar:
  1. complete patient registration flow
  2. triage change actualiza tablas relacionadas
  3. search funciona con queries reales
  4. dashboard lee de ECE-DES database
  5. concurrent registration maneja race conditions
  6. transaction rollback on error
  7. indexedDB preserva data integrity
  8. large dataset no bloquea UI
  9. export incluye todos los datos relacionados
  10. print badge genera HTML correcto

Ubicación: tests/integration/database.test.js

Target Coverage: >80%

Setup:
  - Database real (SQLite)
  - IndexedDB real (fake-indexeddb)
  - DOM real (jsdom)
```

**Criterios de Aceptación:**
- [ ] 10 tests implementados
- [ ] Coverage >80%
- [ ] Todos los tests pasan

---

### Tareas Adicionales Fase 2

- [ ] **2.6** Unit Tests - Clinical Records (3 días)
- [ ] **2.7** Unit Tests - Export Module (3 días)
- [ ] **2.8** Unit Tests - UI Components (4 días)
- [ ] **2.9** Integration Tests - Dashboard (3 días)
- [ ] **2.10** Integration Tests - Export (2 días)
- [ ] **2.11** E2E Tests - Patient Flow (3 días)
- [ ] **2.12** E2E Tests - Dashboard Flow (2 días)
- [ ] **2.13** Performance Tests - Load (2 días)
- [ ] **2.14** Security Tests - OWASP (2 días)
- [ ] **2.15** Cross-browser Tests (3 días)

### Entregables Fase 2

- ✅ 110 unit tests implementados
- ✅ 65 integration tests implementados
- ✅ 45 E2E tests implementados
- ✅ 85%+ coverage alcanzado
- ✅ Performance benchmarks establecidos
- ✅ Security suite pasando

### Quality Gates Fase 2

```bash
npm run test:unit        # 100% pass
npm run test:integration # 100% pass
npm run test:e2e         # 100% pass
npm run test:coverage    # >85%
npm run test:performance # <5s export
npm run test:security    # 0 high vulns
```

---

## 🚀 FASE 3: ENHANCEMENT (Semanas 7-9)

### Objetivo
Mejorar UX y añadir funcionalidades críticas.

### Tareas Críticas

#### 3.1 Sistema de Roles RBAC (4 días)

**Especificación Técnica:**

```yaml
Tarea: IMPLEMENT_RBAC
Prioridad: P1
Estimado: 4 días
Dependencies: Ninguna

Especificación:
  roles:
    - MEDICO: Acceso completo
    - ENFERMERA: Registro y triage, sin exportación
    - ADMIN: Solo dashboard y reportes
    - AUDITOR: Solo lectura de auditoría

  permissions:
    - patients.create
    - patients.read
    - patients.update
    - patients.delete
    - triage.update
    - clinical_events.create
    - export.excel
    - dashboard.view

Implementación:
  const roles = {
    MEDICO: ['*'],  // All permissions
    ENFERMERA: [
      'patients.create',
      'patients.read',
      'triage.update',
      'clinical_events.create'
    ],
    ADMIN: [
      'dashboard.view',
      'export.excel'
    ],
    AUDITOR: [
      'auditor.read'
    ]
  };

  function hasPermission(role, permission) {
    const permissions = roles[role];
    return permissions.includes('*') ||
           permissions.includes(permission);
  }

  // En login()
  this.session = {
    hospital,
    operador,
    rol: selectedRole,  // Dropdown para seleccionar
    permissions: roles[selectedRole]
  };

Migrations:
  - ALTER TABLE operadores ADD COLUMN rol TEXT
  - ALTER TABLE operadores ADD COLUMN permissions TEXT

Tests requeridos:
  - test('MEDICO role has all permissions')
  - test('ENFERMERA cannot export Excel')
  - test('ADMIN cannot register patients')
  - test('AUDITOR can only read audit logs')
  - test('permission check works correctly')

UI Changes:
  - Role selector en login
  - Hide/show buttons based on permissions
  - Permission denied notifications
```

**Criterios de Aceptación:**
- [ ] 4 roles definidos
- [ ] Permissions funcionales
- [ ] UI adaptativa por rol
- [ ] 5 tests implementados

---

#### 3.2 Mobile Optimization (5 días)

**Especificación Técnica:**

```yaml
Tarea: MOBILE_OPTIMIZATION
Prioridad: P1
Estimado: 5 días
Dependencies: Ninguna

Especificación:
  breakpoints:
    - mobile: < 768px
    - tablet: 768px - 1024px
    - desktop: > 1024px

  cambios requeridos:
    - CSS Grid responsive
    - Touch targets min 44x44px
    - Stack layout en mobile
    - Sticky headers
    - Bottom navigation en mobile

Implementación CSS:
  /* Mobile-first approach */
  .census-table {
    display: block;
  }

  @media (min-width: 768px) {
    .census-table {
      display: table;
    }
  }

  /* Touch-friendly buttons */
  .btn-triage {
    min-width: 44px;
    min-height: 44px;
    font-size: 16px;  /* Previne zoom en iOS */
  }

  /* Stack en mobile */
  @media (max-width: 767px) {
    .patient-row {
      flex-direction: column;
    }
  }

Tests requeridos:
  - test('layout is responsive on mobile')
  - test('buttons are tappable on mobile')
  - test('table stacks correctly on mobile')
  - test('navigation works on mobile')
  - test('no horizontal scroll on mobile')

Devices a testear:
  - iPhone 12/13/14
  - iPad Pro
  - Android 12+ (varios tamaños)
```

**Criterios de Aceptación:**
- [ ] Responsive en todos los breakpoints
- [ ] Touch targets ≥44px
- [ ] No horizontal scroll
- [ ] 5 device tests pasando

---

#### 3.3 Sistema de Notificaciones Push (3 días)

**Especificación Técnica:**

```yaml
Tarea: NOTIFICATION_SYSTEM
Prioridad: P1
Estimado: 3 días
Dependencies: Ninguna

Especificación:
  canales:
    - in-app: Notificaciones dentro de la app
    - browser: Browser Notifications API
    - audio: Sonidos para eventos críticos

  tipos:
    - success (verde)
    - warning (amarillo)
    - error (rojo)
    - info (azul)

Implementación:
  class NotificationManager {
    show(message, type = 'info', options = {}) {
      // In-app notification
      const el = this.createElement(message, type);
      document.body.appendChild(el);

      // Browser notification si permitido
      if (this.browserPermission === 'granted') {
        new Notification(message, {
          icon: '/icon.png',
          badge: '/badge.png',
          ...options
        });
      }

      // Audio para eventos críticos
      if (type === 'error' || type === 'warning') {
        this.playSound(type);
      }

      // Auto-remove
      setTimeout(() => el.remove(), 5000);
    }

    requestPermission() {
      Notification.requestPermission().then(permission => {
        this.browserPermission = permission;
      });
    }
  }

Events que disparan notificaciones:
  - Paciente registrado → success
  - Triage cambiado a ROJO → warning + audio
  - Error de validación → error + audio
  - Exportación completada → success
  - Cambio de rol → info

Tests requeridos:
  - test('notification appears on screen')
  - test('notification auto-removes after 5s')
  - test('browser notification works')
  - test('audio plays for critical events')
  - test('multiple notifications stack correctly')
```

**Criterios de Aceptación:**
- [ ] 4 tipos de notificaciones
- [ ] Browser notifications funcionales
- [ ] Audio para eventos críticos
- [ ] 5 tests implementados

---

#### 3.4 Dark Mode (2 días)

**Especificación Técnica:**

```yaml
Tarea: IMPLEMENT_DARK_MODE
Prioridad: P2
Estimado: 2 días
Dependencies: Ninguna

Especificación:
  approach: CSS custom properties + toggle
  persistencia: localStorage
  default: system preference

Implementación:
  :root {
    --bg-primary: #FFFFFF;
    --text-primary: #1A1A2E;
  }

  [data-theme="dark"] {
    --bg-primary: #1A1A2E;
    --text-primary: #F7F8FA;
  }

  // JS
  function toggleTheme() {
    const current = document.body.dataset.theme;
    const next = current === 'dark' ? 'light' : 'dark';
    document.body.dataset.theme = next;
    localStorage.setItem('theme', next);
  }

  // Detect system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.dataset.theme = 'dark';
  }

Components afectados:
  - Navbar
  - Cards
  - Tables
  - Forms
  - Modals

Tests requeridos:
  - test('toggle switches theme')
  - test('theme persists across reloads')
  - test('system preference is detected')
  - test('all components adapt to dark mode')

```

**Criterios de Aceptación:**
- [ ] Toggle funcional
- [ ] Persistencia en localStorage
- [ ] System preference detectada
- [ ] 4 tests implementados

---

### Tareas Adicionales Fase 3

- [ ] **3.5** Mejorar accessibility WCAG 2.1 (3 días)
- [ ] **3.6** Implementar atajos de keyboard (2 días)
- [ ] **3.7** Añadir tooltips y help text (2 días)
- [ ] **3.8** Mejorar error messages (2 días)
- [ ] **3.9** Implementar undo/redo (3 días)
- [ ] **3.10** Añadir bulk operations (2 días)

### Entregables Fase 3

- ✅ Sistema RBAC funcional
- ✅ Mobile responsive
- ✅ Notificaciones push
- ✅ Dark mode
- ✅ Accessibility mejorada
- ✅ Keyboard navigation

---

## 🤖 FASE 4: AUTOMATION (Semanas 10-11)

### Objetivo
Implementar CI/CD pipeline completo.

### Tareas Críticas

#### 4.1 GitHub Actions Workflow (3 días)

**Especificación Técnica:**

```yaml
Tarea: SETUP_CI_CD
Prioridad: P0
Estimado: 3 días
Dependencies: Todas las anteriores

Workflow: .github/workflows/ci.yml

name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Unit tests
        run: npm run test:unit

      - name: Integration tests
        run: npm run test:integration

      - name: Coverage
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run audit
        run: npm audit --production

      - name: OWASP ZAP
        uses: zaproxy/action-full-scan@v0.4.0
        with:
          target: 'http://localhost:8000'

  build:
    needs: [test, e2e, security]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
```

**Criterios de Aceptación:**
- [ ] Pipeline ejecuta en cada push
- [ ] Todos los jobs pasan
- [ ] Artifacts generados
- [ ] Reports disponibles

---

#### 4.2 Automated Deployments (2 días)

**Especificación Técnica:**

```yaml
Tarea: AUTOMATED_DEPLOYMENT
Prioridad: P1
Estimado: 2 días
Dependencies: SETUP_CI_CD

Especificación:
  ambiente: GitHub Pages o Netlify
  trigger: Push a main branch
  preview: Deploy preview para PRs

Implementación:
  # .github/workflows/deploy.yml
  name: Deploy to Production

  on:
    push:
      branches: [main]

  jobs:
    deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3

        - name: Build
          run: npm run build

        - name: Deploy to Netlify
          uses: nwtgck/actions-netlify@v1.2
          with:
            publish-dir: './dist'
            production-branch: main
            github-token: ${{ secrets.GITHUB_TOKEN }}
            deploy-message: "Deploy from GitHub Actions"

Tests requeridos:
  - test('deployment succeeds on main push')
  - test('preview deploy works for PRs')
  - test('rollback works if needed')
```

**Criterios de Aceptación:**
- [ ] Deploy automático en main
- [ ] Preview deploys en PRs
- [ ] Rollback funcional

---

### Tareas Adicionales Fase 4

- [ ] **4.3** Setup de monitoring (2 días)
- [ ] **4.4** Configurar alerts (1 día)
- [ ] **4.5** Documentar deployment (1 día)
- [ ] **4.6** Crear runbooks (2 días)
- [ ] **4.7** Setup staging environment (2 días)

### Entregables Fase 4

- ✅ CI/CD pipeline funcional
- ✅ Automated deployments
- ✅ Monitoring configurado
- ✅ Alerts activos
- ✅ Runbooks documentados

---

## 🔄 FASE 5: EVOLUTION (Semana 12)

### Objetivo
Preparar groundwork para arquitectura modular v2.0.

### Tareas Críticas

#### 5.1 State Management Evaluation (2 días)

**Especificación Técnica:**

```yaml
Tarea: EVALUATE_STATE_MANAGEMENT
Prioridad: P2
Estimado: 2 días
Dependencies: Ninguna

Opciones a evaluar:
  - Zustand (ligero, simple)
  - Redux Toolkit (robusto, boilerplate)
  - Pinia (Vue-compatible)
  - Custom implementation (control total)

Criterios de evaluación:
  1. Tamaño del bundle
  2. Curva de aprendizaje
  3. DevTools support
  4. TypeScript support
  5. Persistencia integrada
  6. Performance benchmarks

Implementación POC:
  // Probar Zustand
  import create from 'zustand';

  const useAppStore = create((set) => ({
    patients: [],
    session: null,
    addPatient: (patient) =>
      set((state) => ({
        patients: [...state.patients, patient]
      })),
    setSession: (session) => set({ session })
  }));

Entregable:
  - Reporte de comparación (markdown)
  - POC funcional
  - Recomendación con justificación
```

**Criterios de Aceptación:**
- [ ] 3 opciones evaluadas
- [ ] POC funcional
- [ ] Recomendación documentada

---

#### 5.2 Modular Architecture Design (3 días)

**Especificación Técnica:**

```yaml
Tarea: DESIGN_MODULAR_ARCH
Prioridad: P2
Estimado: 3 días
Dependencies: EVALUATE_STATE_MANAGEMENT

Estructura propuesta:
  src/
    ├── core/           # Core business logic
    │   ├── auth/
    │   ├── patients/
    │   ├── triage/
    │   └── clinical/
    ├── ui/             # UI components
    │   ├── components/
    │   ├── layouts/
    │   └── themes/
    ├── data/           # Data layer
    │   ├── repositories/
    │   ├── models/
    │   └── migrations/
    ├── services/       # External services
    │   ├── indexeddb/
    │   ├── export/
    │   └── notification/
    └── utils/          # Utilities
        ├── validators/
        ├── formatters/
        └── constants/

Documentación requerida:
  - ADR (Architecture Decision Record)
  - Diagramas de componentes
  - API contracts
  - Migration guide v1 → v2

Entregables:
  - ADR markdown
  - Diagramas Mermaid
  - API documentation
  - Migration plan
```

**Criterios de Aceptación:**
- [ ] ADR creado
- [ ] Diagramas documentados
- [ ] Migration plan definido

---

### Tareas Adicionales Fase 5

- [ ] **5.3** Performance optimization plan (2 días)
- [ ] **5.4** Research PWA features (2 días)
- [ ] **5.5] Experiment with WebAssembly (1 día)

### Entregables Fase 5

- ✅ State management evaluado
- ✅ Arquitectura modular diseñada
- ✅ ADR documentado
- ✅ Roadmap v2.0 creado

---

## ⚠️ PASOS CRÍTICOS

### 1. Critical Path (Dependencies)

```
SETUP_TESTING → PIN_HASHING → XSS_SANITIZATION → WEB_WORKERS
     ↓
UNIT_TESTS → INTEGRATION_TESTS → E2E_TESTS
     ↓
CI_CD_SETUP → AUTOMATED_DEPLOYMENT
```

### 2. Go/No-Go Decision Points

| Gate | Criterios | Owner | Fecha |
|------|-----------|-------|-------|
| **Gate 1** | Testing framework OK, 5 P0 tests passing | CONTROLADOR | Semana 2 |
| **Gate 2** | 85% coverage, security clean | QA | Semana 6 |
| **Gate 3** | CI/CD functional, first auto-deploy | DEVOPS | Semana 10 |
| **Gate 4** | All features documented, ADR approved | CONTROLADOR | Semana 12 |

### 3. Risk Mitigation

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| **Coverage target missed** | Media | Alta | Priorizar unit tests primero |
| **Performance degradation** | Baja | Alta | Benchmark cada cambio |
| **CI/CD failures** | Media | Media | Peer review + staging |
| **Scope creep** | Alta | Media | Strict change control |

---

## 📊 MATRIZ DE RIESGOS

### Riesgos Técnicos

| ID | Riesgo | Probabilidad | Impacto | Score | Mitigación |
|----|--------|-------------|---------|-------|------------|
| T1 | Web Workers no compatibles | Baja (5%) | Alta (9) | 45 | Polyfill, fallback |
| T2 | IndexedDB quota exceeded | Media (30%) | Alta (8) | 240 | Monitoreo, cleanup |
| T3 | Browser compatibility | Media (25%) | Media (6) | 150 | Polyfills, testing |
| T4 | Performance regression | Media (35%) | Alta (8) | 280 | Benchmarks, alerts |
| T5 | Security vulnerabilities | Baja (15%) | Crítica (10) | 150 | OWASP ZAP, audits |

**Score Prioritario:** T4 (280), T2 (240), T3/T5 (150)

### Riesgos de Proyecto

| ID | Riesgo | Probabilidad | Impacto | Score | Mitigación |
|----|--------|-------------|---------|-------|------------|
| P1 | Timeline overrun | Alta (40%) | Media (7) | 280 | Buffer 20% |
| P2 | Resource shortage | Media (25%) | Alta (8) | 200 | Cross-training |
| P3 | Scope creep | Alta (50%) | Media (6) | 300 | Change control |
| P4 | Technical debt | Alta (60%) | Alta (8) | 480 | Refactor sprints |

**Score Prioritario:** P4 (480), P3 (300), P1 (280)

---

## 👥 RECURSOS REQUERIDOS

### Equipo

| Rol | FTE | Responsabilidades |
|-----|-----|-------------------|
| **CONTROLADOR** | 0.5 | Arquitectura, decisiones técnicas |
| **EJECUTOR** | 1.5 | Implementación features |
| **QA** | 1.0 | Testing, quality assurance |
| **DOCUMENTADOR** | 0.5 | Documentación técnica |

### Herramientas

| Categoría | Herramienta | Costo |
|-----------|-------------|-------|
| **Testing** | Jest, Playwright | Free |
| **CI/CD** | GitHub Actions | Free |
| **Code Quality** | ESLint, Prettier | Free |
| **Security** | OWASP ZAP | Free |
| **Monitoring** | Lighthouse CI | Free |
| **Documentation** | Markdown, Mermaid | Free |

### Infraestructura

| Recurso | Especificación |
|---------|----------------|
| **Repositorio** | GitHub (Free tier) |
| **CI/CD** | GitHub Actions (2000 min/mes free) |
| **Hosting** | Netlify (100GB bandwidth free) |
| **Monitoring** | GitHub Insights (Free) |

---

## 📈 MÉTRICAS DE ÉXITO

### Fase 1 (Foundation)
- [ ] Testing framework operational
- [ ] 25+ unit tests passing
- [ ] Zero high vulnerabilities
- [ ] CI ejecutando

### Fase 2 (Quality)
- [ ] 85%+ coverage
- [ ] 110 unit tests
- [ ] 65 integration tests
- [ ] 45 E2E tests

### Fase 3 (Enhancement)
- [ ] 4 roles implementados
- [ ] Mobile responsive
- [ ] Push notifications
- [ ] Dark mode

### Fase 4 (Automation)
- [ ] CI/CD pipeline
- [ ] Auto-deploy functional
- [ ] Monitoring activo
- [ ] <30 min deploy time

### Fase 5 (Evolution)
- [ ] State management evaluado
- [ ] Arquitectura modular diseñada
- [ ] ADR documentado
- [ ] Roadmap v2.0

---

## 📝 ENTREGABLES FINALES

1. **Código Fuente**
   - 110+ unit tests
   - 65+ integration tests
   - 45+ E2E tests
   - 85%+ coverage

2. **Documentación**
   - ADRs
   - API docs
   - Runbooks
   - Migration guides

3. **Infraestructura**
   - CI/CD pipeline
   - Automated deployments
   - Monitoring dashboards
   - Alerting system

4. **Calidad**
   - Security score 9/10
   - Performance score 9/10
   - Zero high vulnerabilities
   - <5s export time

---

**Plan Aprobado por:** CONTROLADOR (ADRC 2.0)
**Fecha:** 2026-03-04
**Firma:** ________________

*Este plan es la hoja de ruta técnica para CVOED-Tools v2.0*
