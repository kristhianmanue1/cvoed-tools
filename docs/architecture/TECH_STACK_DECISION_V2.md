# DECISIONES DE STACK TECNOLÓGICO - CVOED-TOOLS (PORTABLE)

**Fecha:** 2026-03-03 (Actualizado)
**Arquitecto:** ADRC CONTROLADOR
**Versión:** 2.0.0 (Arquitectura Portable Correcta)
**Formato:** ADR (Architecture Decision Record)

---

## 🎯 PRINCIPIO RECTOR

```
REQUISITO CRÍTICO: "100% PORTABLE - Doble clic para abrir"

Cualquier tecnología que comprometa este requisito es
AUTOMÁTICAMENTE DESCARTADA.
```

---

## ÍNDICE DE DECISIONES

1. [Arquitectura: Portable vs Server-Based](#1-arquitectura-portable)
2. [Build System: build.js vs esbuild vs webpack](#2-build-system)
3. [State Management: Vanilla JS vs Framework](#3-state-management)
4. [Persistencia: IndexedDB vs localStorage vs Cloud](#4-persistencia)
5. [CSS Strategy: Custom Properties vs Framework](#5-css-strategy)
6. [Testing: Manual vs Automated](#6-testing)
7. [Code Splitting: Módulos vs Monolito](#7-code-splitting)

---

## 1. ARQUITECTURA: PORTABLE VS SERVER-BASED

### Decisión
**ELEGIDO:** Portable HTML (Autocontenido)

### Alternativas Consideradas
| Opción | Pros | Cons | Veredicto |
|--------|------|------|-----------|
| **Portable HTML** | • Zero dependencias<br>• Funciona offline<br>• Doble clic para abrir<br>• USB portable | • No actualizaciones automáticas<br>• Manual testing | ✅ **ELEGIDO** |
| Node.js Backend | • CRUD fácil<br>• Base de datos real | • Requiere servidor<br>• No funciona offline<br>• Rompe portabilidad | ❌ **DESCARTADO** |
| PWA con Service Worker | • Caching inteligente<br>• Instalable | • Requiere HTTPS<br>• Más complejo<br>• Sobreingeniería | ❌ **DESCARTADO** |
| Static Site Gen | • Build optimizado | • Requiere server<br>• No file:// protocol | ❌ **DESCARTADO** |

### Justificación Técnica

**Caso de Uso:** Emergencias hospitalarias IMSS FIFA 2026

Durante un desastre:
- ❌ Servidores pueden caer
- ❌ Internet puede no estar disponible
- ❌ El personal necesita herramientas INMEDIATAS

**Portable HTML resuelve:**
- ✅ Doble clic y funciona
- ✅ Cabe en USB
- ✅ Zero configuración
- ✅ Funciona en cualquier computadora

### ADR-001: Arquitectura Portable
```
Status: Accepted
Date: 2026-03-03
Context: Sistema para emergencias hospitalarias donde la
         infraestructura puede fallar.
Decision: HTML autocontenido que funciona via file:// protocol.
Consequences:
 + Funciona sin internet
 + Portable en USB
 + Zero dependencias operativas
 + Actualizaciones manuales
 - Testing debe ser manual
 - No hay backend centralizado
```

---

## 2. BUILD SYSTEM

### Decisión
**ELEGIDO:** build.js (Node.js custom script)

### Alternativas Consideradas
| Opción | Build Time | Bundle Size | Portable-Compatible | Veredicto |
|--------|------------|-------------|---------------------|-----------|
| **build.js** | ~200ms | No minified | ✅ SÍ | ✅ **ELEGIDO** |
| esbuild | ~50ms | Minified | ⚠️ Requiere integración | ⚠️ Opcional |
| webpack | ~5s | Minified | ❌ Demasiado complejo | ❌ Descartado |
| Rollup | ~2s | Minified | ❌ Sobreingeniería | ❌ Descartado |
| Ninguno | N/A | Máximo | ✅ SÍ pero manual | ❌ Impráctico |

### Análisis de build.js

**Propósito:** Convertir código modular (src/) en HTML autocontenido (dist/)

**Funcionamiento:**
```javascript
// 1. Lee src/module/index.html
// 2. Reemplaza <link href="css/style.css">
//    → <style>...css content...</style>
// 3. Reemplaza <script src="js/app.js">
//    → <script>...js content...</script>
// 4. Caso especial: sql-wasm.js
//    → Lee .wasm file
//    → Convierte a Base64
//    → Crea data URI: data:application/wasm;base64,...
// 5. Escribe dist/module.html
```

**Ventajas:**
- ✅ Simple y entendible
- ✅ Genera HTML 100% autocontenido
- ✅ Funciona para file:// protocol
- ✅ Sin dependencias complejas

**Desventajas:**
- ❌ No minifica el código
- ❌ No tree-shaking
- ❌ CSS y JS sin optimizar

### Mejoras Futuras (Opcionales)

**Opción 1: Integrar minificación en build.js**
```javascript
const terser = require('terser');

// En bundleHtml()
const minifiedJS = await terser.minify(jsContent, {
  compress: true,
  mangle: true
});
```

**Trade-off:**
- Pros: -30% tamaño de bundle
- Cons: Más complejo, código menos legible en producción

**Decisión:** NO implementar por ahora. La legibilidad del código en producción es útil para debugging en emergencias.

### ADR-002: Build System
```
Status: Accepted
Date: 2026-03-03
Context: Necesitamos convertir código modular en HTML autocontenido.
Decision: build.js custom script que hace inline de CSS/JS/WASM.
Consequences:
 + HTML generado es 100% portable
 + Build process simple y entendible
 + Código de producción es legible (útil para debugging)
 - Bundle no está minificado
 - No hay tree-shaking
```

---

## 3. STATE MANAGEMENT

### Decisión
**ELEGIDO:** Vanilla JS con ES modules (src/) + Código plano (HTML final)

### Alternativas Consideradas
| Opción | Bundle Size | Reactivity | DevTools | Portable-Compatible | Veredicto |
|--------|-------------|------------|----------|---------------------|-----------|
| **Vanilla JS** | 0 KB | Manual | Chrome DevTools | ✅ SÍ | ✅ **ELEGIDO** |
| Zustand | +9 KB | Sí | Bueno | ❌ External dependency | ❌ Descartado |
| Redux | +15 KB | Sí | Maduro | ❌ External dependency | ❌ Descartado |
| Svelte | +12 KB | Sí | Bueno | ❌ Requires compiler | ❌ Descartado |

### Análisis de Vanilla JS

**Estado Actual:**
```javascript
// src/ece-des/js/app.js
class App {
  constructor() {
    this.db = null;
    this.session = { hospital: '', operador: '' };
    this.patients = [];
  }

  renderCensus() {
    // Actualización manual del DOM
    const counts = this.countByTriage();
    document.getElementById('count-rojo').textContent = counts.rojo;
    // ...
  }
}
```

**Pros:**
- ✅ Zero dependencias
- ✅ Código transparente
- ✅ DevTools nativo del navegador
- ✅ Fácil de debuggear en emergencias

**Cons:**
- ❌ Actualización manual del DOM
- ❌ No hay reactividad automática
- ❌ Más código boilerplate

### ¿Necesitamos un Store Pattern?

**Análisis de Complejidad:**
- ECE-DES: ~588 líneas de JS
- Dashboard: ~195 líneas de JS
- Estado relativamente simple

**Conclusión:** NO vale la pena agregar un framework por ahora. El costo en bundle size (+9-15KB) no justifica el beneficio para este nivel de complejidad.

### Patrón Actual (Funcional)

```javascript
// Estado simple
const state = {
  db: null,
  session: null,
  patients: []
};

// Actualización explícita
function addPatient(patient) {
  state.patients.push(patient);
  renderCensus();
}

// Renderizado reactivo manual
function renderCensus() {
  const counts = countByTriage();
  updateDOM(counts);
}
```

### ADR-003: State Management
```
Status: Accepted
Date: 2026-03-03
Context: Aplicación de complejidad media (~600 líneas JS).
Decision: Vanilla JS sin framework de state management.
Consequences:
 + Zero dependencias runtime
 + Código transparente y fácil de debuggear
 + Actualización manual del DOM
 + No hay reactividad automática
```

---

## 4. PERSISTENCIA

### Decisión
**ELEGIDO:** IndexedDB (nativo del navegador)

### Alternativas Consideradas
| Opción | Capacidad | Async | Offline | Portable-Compatible | Veredicto |
|--------|-----------|-------|---------|---------------------|-----------|
| **IndexedDB** | Ilimitada | ✅ Sí | ✅ Sí | ✅ SÍ | ✅ **ELEGIDO** |
| localStorage | 5 MB | ❌ No | ✅ Sí | ⚠️ Limitado | ❌ Descartado |
| SessionStorage | 5 MB | ❌ No | ✅ Sí | ❌ Se pierde al cerrar | ❌ Descartado |
| Cloud DB | Ilimitada | ✅ Sí | ❌ No | ❌ Requiere internet | ❌ Descartado |
| File System API | Ilimitada | ✅ Sí | ✅ Sí | ⚠️ Experimental | ❌ Inmaduro |

### Por qué NO localStorage

**Problema Crítico:**
```javascript
// LocalStorage tiene límite de 5 MB
localStorage.setItem('sqlite_db', largeBinary); // ❌ QuotaExceededError

// SQLite WASM export es ~1-2 MB
// Con varios pacientes, fácilmente excede 5 MB
```

**Ejemplo de Falla:**
```
Hospital atiende 100 pacientes en SMV
→ SQLite DB crece a ~3 MB
→ localStorage.setItem() falla
→ DATOS PERDIDOS
```

### IndexedDB: Solución Correcta

**Ventajas:**
- ✅ Sin límite práctico de tamaño
- ✅ Soporta datos binarios (Uint8Array)
- ✅ Asíncrono (no bloquea UI)
- ✅ Persistente entre sesiones
- ✅ Funciona en file:// protocol

**Implementación:**
```javascript
// Guardar SQLite export
function saveToIndexedDB() {
  const data = db.export(); // Uint8Array
  const request = indexedDB.open('ECEDES_DB', 1);

  request.onupgradeneeded = (e) => {
    const db = e.target.result;
    db.createObjectStore('backups');
  };

  request.onsuccess = (e) => {
    const db = e.target.result;
    const tx = db.transaction(['backups'], 'readwrite');
    tx.objectStore('backups').put(data, 'sqlite_backup');
  };
}

// Cargar SQLite export
function loadFromIndexedDB() {
  const request = indexedDB.open('ECEDES_DB', 1);

  request.onsuccess = (e) => {
    const db = e.target.result;
    const tx = db.transaction(['backups'], 'readonly');
    const getRequest = tx.objectStore('backups').get('sqlite_backup');

    getRequest.onsuccess = () => {
      const data = getRequest.result; // Uint8Array
      const newDb = new SQL.Database(data);
      // Usar newDb...
    };
  };
}
```

### ADR-004: Persistencia
```
Status: Accepted
Date: 2026-03-03
Context: Necesitamos persistir SQLite DB de tamaño variable.
Decision: IndexedDB para almacenar binarios de SQLite.
Consequences:
 + Soporta bases de datos grandes
 + Asíncrono (no bloquea UI)
 + Funciona offline y en file://
 - API más compleja que localStorage
 - Requiere manejo de callbacks/promesas
```

---

## 5. CSS STRATEGY

### Decisión
**ELEGIDO:** CSS Custom Properties (Tokens v2.0)

### Alternativas Consideradas
| Opción | Bundle Size | Dinamismo | Portabilidad | Veredicto |
|--------|-------------|-----------|--------------|-----------|
| **CSS Custom Props** | ~2 KB | Medio | ✅ Nativo | ✅ **ELEGIDO** |
| Tailwind (CDN) | +200 KB | Alto | ❌ Requiere CDN | ❌ Descartado |
| Bootstrap (CDN) | +150 KB | Bajo | ❌ Requiere CDN | ❌ Descartado |
| CSS-in-JS | +20 KB | Alto | ⚠️ Requiere runtime | ❌ Descartado |
| SASS/SCSS | 0 KB | Bajo | ✅ Compilado | ⚠️ Overkill |

### Sistema de Tokens v2.0

**Doble Codificación (Color + Forma):**

```css
:root {
  /* Colores Institucionales */
  --color-guinda: #691C32;
  --color-dorado: #BC955C;
  --color-verde-imss: #006657;

  /* Colores Funcionales */
  --fn-rojo: #C41E3A;
  --fn-amarillo: #D4940A;
  --fn-verde: #1B7340;
  --fn-negro: #1A1A2E;

  /* Símbolos Unicode */
  --symbol-rojo: "◆";
  --symbol-amarillo: "▲";
  --symbol-verde: "●";
  --symbol-negro: "✚";

  /* Estructura */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F7F8FA;
  --text-primary: #1A1A2E;
  --text-secondary: #4A5568;
  --border-default: #D1D5DB;
}
```

**Uso:**
```css
.triage-rojo {
  color: var(--fn-rojo);
}

.triage-rojo::before {
  content: var(--symbol-rojo);
}
```

**Ventajas:**
- ✅ Accesibilidad ISO 3864 (doble codificación)
- ✅ Zero dependencias
- ✅ Nativo del navegador
- ✅ Fácil de mantener

### ADR-005: CSS Strategy
```
Status: Accepted
Date: 2026-03-03
Context: Necesitamos sistema de diseño consistente y accesible.
Decision: CSS Custom Properties con Tokens v2.0.
Consequences:
 + Zero dependencias
 + Doble codificación color+forma (accesibilidad)
 + Variables CSS nativas
 - No hay preprocesador (SASS features)
```

---

## 6. TESTING

### Decisión
**ELEGIDO:** Testing Manual (Portable HTML no permite tests automatizados fácilmente)

### Alternativas Consideradas
| Opción | Coverage | CI/CD | Portable-Compatible | Veredicto |
|--------|----------|-------|---------------------|-----------|
| **Manual** | Variable | ❌ No | ✅ SÍ | ✅ **ELEGIDO** |
| Vitest | Alta | ✅ Sí | ❌ Solo en src/ | ⚠️ Parcial |
| Playwright | Alta | ✅ Sí | ✅ Sí | ⚠️ Complejo |
| Jasmine | Media | ❌ No | ❌ Karma required | ❌ Descartado |

### Por qué NO Testing Automatizado (Principalmente)

**Problema 1: DOM en file:// protocol**
```javascript
// Vitest/Jest funcionan en Node.js
// No pueden ejecutar HTML files con file:// protocol
// Requieren un server o jsdom
```

**Problema 2: WebAssembly**
```javascript
// sql.js usa WASM
// jsdom no soporta WASM completamente
// Tests fallarían
```

### Estrategia de Testing Manual

**Checklist de Testing:**
```markdown
## Portabilidad
- [ ] Abrir HTML con doble clic
- [ ] Funciona sin internet
- [ ] Funciona en file:// protocol
- [ ] Funciona en Chrome/Firefox/Edge/Safari

## Funcionalidad ECE-DES
- [ ] Login con hospital + nombre + PIN
- [ ] Registro de pacientes
- [ ] Asignación de triage (R/A/V/N)
- [ ] Actualización de censo en tiempo real
- [ ] Persistencia en IndexedDB
- [ ] Cierre y reapertura (datos persisten)
- [ ] Exportación a Excel
- [ ] Backup de DB

## Seguridad
- [ ] XSS: Intentar inyectar <script> en nombre de paciente
- [ ] Validación de inputs
- [ ] Escaping de HTML

## Rendimiento
- [ ] Tiempo de carga <5 segundos
- [ ] No hay lag al interactuar
- [ ] Guardado no bloquea UI
```

### Testing Parcial en src/ (Opcional)

**Solo para lógica de pure functions:**
```javascript
// tests/utils.test.js (Vitest solo para src/)
import { escapeHTML, generateFolio } from '../src/shared/js/utils.js';

describe('Utils', () => {
  it('should escape HTML', () => {
    expect(escapeHTML('<script>alert("xss")</script>'))
      .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('should generate unique folios', () => {
    const folio1 = generateFolio();
    const folio2 = generateFolio();
    expect(folio1).not.toBe(folio2);
  });
});
```

**Limitación:** Esto NO prueba el HTML final, solo el código fuente.

### ADR-006: Testing
```
Status: Accepted
Date: 2026-03-03
Context: Sistema portable HTML no permite testing automatizado completo.
Decision: Testing manual con checklist structured.
Consequences:
 + Prueba real del usuario final
 + No hay falsos positivos de tests
 + Tiempo de testing más largo
 - No hay integración con CI/CD
 - Coverage es variable
```

---

## 7. CODE SPLITTING

### Decisión
**ELEGIDO:** Módulos por aplicación (ece-des/, dashboard/, tarjetas/)

### Alternativas Consideradas
| Opción | Bundle Size | Cache | Portabilidad | Veredicto |
|--------|-------------|-------|--------------|-----------|
| **Por App** | Medio | N/A | ✅ SÍ | ✅ **ELEGIDO** |
| Monolito (1 HTML) | Grande | N/A | ✅ SÍ | ❌ Descartado |
| Service Worker | Bajo | ✅ Sí | ❌ Complejo | ❌ Descartado |
| Iframe Lazy | Bajo | N/A | ⚠️ Complejo | ⚠️ Opcional |

### Estructura de Módulos

```
dist/
├── ECE-DES.html              # Aplicación principal
├── ECE-DES-Dashboard.html    # Dashboard (opcional)
├── ECE-DES-Tarjetas.html     # Impresión de tarjetas
├── generador_tarjetas.html   # Standalone
├── guia_operativa_nunca_jamas.html  # Standalone
└── simulacro_nunca_jamas_fifa2026.html  # Standalone
```

**Por qué separar:**
1. **Uso Independiente:** No todas las aplicaciones se usan juntas
2. **Tamaño de Carga:** Usuario puede cargar solo lo que necesita
3. **Mantenibilidad:** Cada app tiene su código aislado

### Código Compartido

**src/shared/** contiene:
- CSS: tokens.css (compartido por todas)
- JS: sql-wasm.js, xlsx.full.min.js (compartido por ECE-DES y Dashboard)
- JS: utils.js (utilidades comunes)

**build.js** hace inline del código compartido en cada HTML final.

### Lazy Loading (Opcional/Futuro)

**Dashboard podría cargarse bajo demanda:**
```javascript
// En ECE-DES.html
function openDashboard() {
  window.open('ECE-DES-Dashboard.html', '_blank');
}
```

**Ventaja:** Usuario de ECE-DES no carga Dashboard hasta que lo necesita.

### ADR-007: Code Splitting
```
Status: Accepted
Date: 2026-03-03
Context: 7 aplicaciones con diferente frecuencia de uso.
Decision: Separar por aplicación, con código compartido en src/shared/.
Consequences:
 + Cada aplicación es independiente
 + Usuario carga solo lo que necesita
 + build.js hace inline de shared code
 + Algo de duplicación en HTML finales (SQL, XLSX en múltiples files)
```

---

## RESUMEN DE DECISIONES

| Aspecto | Decisión | Justificación |
|---------|----------|---------------|
| **Arquitectura** | Portable HTML | Requisito crítico: funciona sin internet |
| **Build System** | build.js custom | Genera HTML autocontenido |
| **State Management** | Vanilla JS | Zero dependencias |
| **Persistencia** | IndexedDB | Soporta DB grandes, funciona offline |
| **CSS** | Custom Properties (Tokens v2.0) | Zero dependencias, accesible |
| **Testing** | Manual | Portable HTML no permite tests automatizados completos |
| **Code Splitting** | Por aplicación | Cada app es independiente |

---

## PRINCIPIOS DE DECISIÓN

### 1. Portabilidad ante Todo
```
¿Esta decisión compromete "doble clic para abrir"?
SI → NO IMPLEMENTAR
NO → CONSIDERAR
```

### 2. Zero Dependencies Operativas
```
¿Esta decisión agrega una dependencia externa?
SI → NO IMPLEMENTAR (a menos que sea crítica)
NO → CONSIDERAR
```

### 3. Simplicidad sobre Optimización
```
¿Esta decisión agrega complejidad significativa?
SI → NO IMPLEMENTAR (a menos que el beneficio sea claro)
NO → CONSIDERAR
```

---

**Documento V2.0 - Decisiones Correctas para Arquitectura Portable**
**ADRC CONTROLADOR**
**2026-03-03**
