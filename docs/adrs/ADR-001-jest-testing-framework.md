# ADR-001: Jest Testing Framework

## Status
**Aceptado** - 2026-03-04

## Contexto
CVOED-Tools v2.0 requiere un framework de testing robusto para alcanzar 85% de cobertura de código. El proyecto necesita:
- Ejecutar pruebas en entorno de navegador (DOM, IndexedDB, localStorage)
- Generar reportes de cobertura
- Integración con CI/CD
- Soporte para TypeScript/ES6+
- Mocking de APIs del navegador

## Decisión
Seleccionamos **Jest** como framework de testing principal para CVOED-Tools.

### Justificación

#### Ventajas de Jest

1. **Zero Configuration**
   ```bash
   npm install --save-dev jest
   # Funciona fuera de la caja con configuración mínima
   ```

2. **Built-in Coverage**
   - Istanbul integrado
   - Reportes HTML, JSON, CLI
   - Thresholds configurables

3. **DOM Testing con jsdom**
   - Entorno de navegador simulado
   - Acceso a localStorage, IndexedDB (con mocks)
   - Compatible con Testing Library

4. **Ecosistema Maduro**
   - Mantenido por Meta (Facebook)
   - Comunidad activa
   - Plugins abundantes

5. **Performance**
   - Tests en paralelo por defecto
   - Watch mode para desarrollo
   - Snapshots para regreso visual

#### Configuración Implementada

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  collectCoverageFrom: [
    'dist/**/*.js',
    '!dist/**/*.test.js',
    '!dist/**/*.spec.js',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: 'tests/coverage',
      filename: 'report.html',
    }],
  ],
};
```

#### Stack Complementario

| Herramienta | Propósito |
|-------------|-----------|
| **@testing-library/dom** | Queries DOM realistas |
| **@testing-library/user-event** | Simulación de interacciones |
| **fake-indexeddb** | Mock de IndexedDB |
| **babel-jest** | Transpilación ES6+ |
| **jest-html-reporters** | Reportes HTML visuales |

## Consecuencias

### Positivas
1. **Setup rápido** - Framework funcional en menos de 1 día
2. **Documentación extensa** - Fácil encontrar soluciones
3. **Integración CI/CD** - GitHub Actions soporte nativo
4. **Developer experience** - Watch mode, snapshots, verbose output
5. **Comunidad** - Stack Overflow, GitHub issues activos

### Negativas
1. **Bundle size** - ~4 MB en node_modules
2. **Babel dependency** - Requiere configuración adicional para ES6+
3. **jsdom limitations** - No es un navegador real (limitaciones en CSS, iframes)
4. **Memory usage** - Puede ser intensive en projects grandes

## Alternativas Consideradas

### Mocha + Chai
**Pros:**
- Más flexible y modular
- Menos opinionado
- Menor bundle size

**Contras:**
- Requiere más configuración
- Coverage no incluido (instalar Istanbul aparte)
- Más archivos de configuración
- Setup más complejo para jsdom

**Veredicto:** Rechazado por mayor complejidad de setup

### Jasmine
**Pros:**
- Zero config
- Incluido en Angular por defecto

**Contras:**
- Menos TypeScript friendly
- Comunidad menos activa
- Menos flexible que Jest

**Veredicto:** Rechazado por limitaciones en TypeScript y ecosistema

### Vitest
**Pros:**
- Más rápido (native ESM)
- Compatible con Jest API
- Mejor performance

**Contras:**
- Más nuevo (menos establecido)
- Ecosistema menos maduro
- Posibles breaking changes

**Veredicto:** Considerado para v3.0, pero Jest seleccionado por estabilidad en v2.0

### Ava
**Pros:**
- Tests concurrentes
- Minimal API
- TypeScript first

**Contras:**
- No incluye coverage
- Menos popular
- Curva de aprendizaje diferente

**Veredicto:** Rechazado por menor adopción y ecosistema

## Implementación

### Archivos Creados

```
tests/
├── setupTests.js           # Mocks globales
├── unit/                   # Tests unitarios
│   └── example.test.js     # Test de ejemplo
├── integration/            # Tests de integración
├── e2e/                    # Tests end-to-end
└── fixtures/               # Datos de prueba
```

### Ejemplo de Test

```javascript
// tests/unit/auth.test.js (pendiente)
describe('Authentication Module', () => {
  test('login() validates PIN length', () => {
    const app = new App();
    expect(() => app.login('123')).toThrow('PIN must be 4 digits');
  });

  test('login() hashes PIN before storing', () => {
    const app = new App();
    app.login('1234');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'ecedes_pin_hash',
      expect.not.stringContaining('1234')
    );
  });
});
```

## Scripts NPM (Pendientes)

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:e2e": "jest tests/e2e",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  }
}
```

## Referencias

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [fake-indexeddb](https://github.com/dumbmatter/fakeIndexedDB)

---

**Propuesto por:** Agente DOCUMENTADOR
**Aprobado por:** CONTROLADOR (ADRC 2.0)
**Fecha:** 2026-03-04
**Versión:** 1.0
