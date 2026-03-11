# CVOED-Tools Suite de Unit Tests

Suite completa de pruebas unitarias para el proyecto CVOED-Tools (IMSS FIFA 2026).

## Tabla de Contenidos

- [Overview](#overview)
- [Estructura de Tests](#estructura-de-tests)
- [Requisitos Previos](#requisitos-previos)
- [Instalacion](#instalacion)
- [Ejecutar Tests](#ejecutar-tests)
- [Coverage Report](#coverage-report)
- [Escribiendo Tests](#escribiendo-tests)
- [Troubleshooting](#troubleshooting)

## Overview

La suite de tests cubre los modulos criticos del sistema:

| Modulo | Archivo | Tests | Coverage Target |
|--------|---------|-------|-----------------|
| Autenticacion | `auth.test.js` | 10 | >90% |
| Pacientes | `patients.test.js` | 15 | >85% |
| Triage | `triage.test.js` | 10 | >85% |

**Total: 35 tests**

## Estructura de Tests

```
tests/
├── unit/
│   ├── auth.test.js       # Tests de autenticacion
│   ├── patients.test.js   # Tests de registro de pacientes
│   └── triage.test.js     # Tests de sistema de triage
├── __mocks__/
│   └── fileMock.js        # Mock para assets estaticos
├── setup.js               # Configuracion global de Jest
└── README.md              # Este archivo
```

## Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0

## Instalacion

1. Instalar dependencias:

```bash
npm install
```

## Ejecutar Tests

### Ejecutar todos los tests

```bash
npm test
```

### Ejecutar solo tests unitarios

```bash
npm run test:unit
```

### Ejecutar tests en modo watch (desarrollo)

```bash
npm run test:watch
```

### Ejecutar con coverage

```bash
npm run test:coverage
```

### Ejecutar un archivo especifico

```bash
npm test -- auth.test.js
```

### Ejecutar tests que coincidan con un patron

```bash
npm test -- --testNamePattern="login"
```

## Coverage Report

El reporte de cobertura se genera en:

- **Terminal**: Resumen ejecutivo
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info`

### Ver reporte HTML

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

### Thresholds de Coverage

- Branches: 70%
- Functions: 75%
- Lines: 85%
- Statements: 85%

## Escribiendo Tests

### Estructura AAA (Arrange-Act-Assert)

```javascript
test('descripcion del test', () => {
  // Arrange: Configurar el escenario
  const input = 'valor de prueba';
  const expected = 'resultado esperado';

  // Act: Ejecutar la funcion bajo test
  const result = app.functionUnderTest(input);

  // Assert: Verificar el resultado
  expect(result).toBe(expected);
});
```

### Mocks Utilizados

```javascript
// localStorage mock
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// IndexedDB mock
const FDBFactory = require('fake-indexeddb/lib/FDBFactory');
global.indexedDB = new FDBFactory();

// Database mock
const mockDB = {
  run: jest.fn(),
  prepare: jest.fn(() => ({
    step: jest.fn(),
    getAsObject: jest.fn(() => ({})),
    bind: jest.fn(),
    free: jest.fn(),
  })),
};
```

## Descripcion de Tests

### auth.test.js (10 tests)

1. `login() validates PIN length (4 digits)` - Valida que el PIN tenga exactamente 4 digitos
2. `login() rejects non-numeric PIN` - Rechaza PIN con caracteres no numericos
3. `login() stores session in localStorage` - Verifica persistencia de sesion
4. `login() audits LOGIN event` - Verifica auditoria de login
5. `login() rejects empty fields` - Valida campos requeridos
6. `logout() clears session from localStorage` - Verifica limpieza de sesion
7. `logout() audits LOGOUT event` - Verifica auditoria de logout
8. `session persists across reloads via localStorage` - Verifica persistencia
9. `verifyPIN() correctly validates 4-digit PIN` - Verifica validacion de PIN
10. `session expires after inactivity period` - Verifica expiracion por inactividad

### patients.test.js (15 tests)

1. `registerPatient() generates unique folio` - Generacion de folio unico
2. `registerPatient() inserts into database` - Insercion en DB
3. `registerPatient() audits registration` - Auditoria de registro
4. `registerPatient() validates required fields` - Validacion de campos
5. `registerPatient() sets default triage when not provided` - Triage por defecto
6. `registerPatient() generates valid UUID` - Generacion de UUID valido
7. `registerPatient() validates age range (0-150)` - Validacion de rango de edad
8. `registerPatient() rejects negative age` - Rechaza edad negativa
9. `registerPatient() validates sex enum (M, F, I)` - Validacion de enum sexo
10. `registerPatient() stores operator from session` - Almacena operador
11. `registerPatient() triggers save with throttling` - Throttling de guardado
12. `updatePatient() modifies existing patient record` - Modificacion de registro
13. `updatePatient() validates age changes` - Validacion de cambios de edad
14. `deletePatient() marks patient as deleted` - Marcado como eliminado
15. `searchPatient() finds by folio` - Busqueda por folio

### triage.test.js (10 tests)

1. `updateTriage() changes level correctly` - Cambio correcto de nivel
2. `updateTriage() validates triage values (ROJO, AMARILLO, VERDE, NEGRO)` - Validacion de valores
3. `updateTriage() creates traceability record` - Creacion de registro de trazabilidad
4. `updateTriage() stores previous value` - Almacenamiento de valor anterior
5. `updateTriage() audits change` - Auditoria de cambios
6. `updateTriage() updates UI` - Actualizacion de UI
7. `updateTriage() prevents same triage change` - Prevencion de mismo triage
8. `updateTriage() handles concurrent changes (last write wins)` - Manejo de cambios concurrentes
9. `getTriageStats() calculates distribution` - Calculo de distribucion
10. `getTriageStats() returns correct metrics` - Metricas correctas

## Troubleshooting

### Error: "Cannot find module 'jsdom'"

```bash
npm install --save-dev jsdom
```

### Error: "Jest encountered an unexpected token"

Asegurate de que Babel este configurado correctamente. Verifica `.babelrc` y `jest.config.js`.

### Tests fallan con "ReferenceError: app is not defined"

Los tests crean su propio objeto `app` mockeado. Verifica que el mock este completo.

### Coverage no se genera

Verifica que los archivos de origen esten en la ruta correcta (`src/**/*.js`) y que `collectCoverageFrom` en `jest.config.js` apunte a ellos.

## Continua Testing

Para integrales y E2E, consulta:

- Integration Tests: `tests/integration/`
- E2E Tests: `tests/e2e/`

## Recursos

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [JSDOM](https://github.com/jsdom/jsdom)
