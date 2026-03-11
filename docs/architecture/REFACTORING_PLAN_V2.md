# PLAN DE REFACTORIZACIÓN - CVOED-TOOLS (PORTABLE)

**Fecha:** 2026-03-03 (Actualizado)
**Arquitecto:** ADRC CONTROLADOR
**Versión:** 2.0.0 (Arquitectura Portable Correcta)
**Horizonte:** 6 semanas
**Proyecto:** cvoed-tools

---

## 🔍 CLARIDAD ARQUITECTÓNICA

### Lo que ES el sistema
- ✅ Suite de **7 aplicaciones HTML5 portátiles**
- ✅ **100% offline** - Funciona sin internet
- ✅ **Autocontenido** - Todo el código está dentro de cada HTML
- ✅ **Ejecutable con doble clic** - file:// protocol
- ✅ **Zero dependencias operativas** - No hay npm install en producción

### Lo que NO es el sistema
- ❌ NO es una aplicación Node.js
- ❌ NO requiere servidor web
- ❌ NO descarga dependencias de CDNs
- ❌ NO usa frameworks modernos (React/Vue)

### Arquitectura Dual

```
┌─────────────────────────────────────────────────────────────┐
│  DESARROLLO (src/) - CÓDIGO MODULAR                         │
├─────────────────────────────────────────────────────────────┤
│  Propósito: Mantenimiento y desarrollo de código             │
│                                                             │
│  src/index.html                                            │
│    ├─ <link rel="stylesheet" href="css/style.css">          │
│    ├─ <script src="js/sql-wasm.js">                       │
│    ├─ <script src="js/xlsx.full.min.js">                    │
│    └─ <script src="js/app.js">                             │
│                                                             │
│  src/js/app.js (588 líneas)                                │
│    ├─ Importa db-migrations.js (ES modules)                │
│    ├─ Código bien estructurado                             │
│    └─ Puede usar módulos separados                         │
│                                                             │
│  src/js/db-migrations.js (151 líneas)                        │
│    ├─ Sistema de versioning de DB                           │
│    └─ Módulo ES6 reutilizable                               │
│                                                             │
│  src/css/style.css (Tokens v2.0)                            │
│    └─ Sistema de diseño completo                             │
└─────────────────────────────────────────────────────────────┘
                          ↓ node build.js
┌─────────────────────────────────────────────────────────────┐
│  PRODUCCIÓN (HTML Finales) - AUTOCONTENIDOS                 │
├─────────────────────────────────────────────────────────────┤
│  Propósito: Ejecutar en navegador sin dependencias            │
│                                                             │
│  ECE-DES.html (1.8 MB)                                     │
│    ├─ Todo CSS inline en <style>                            │
│    ├─ Todo JS inline en <script>                            │
│    ├─ sql.wasm como Base64 data URI                         │
│    └─ SheetJS inline                                         │
│                                                             │
│  ✅ Zero dependencias externas                               │
│  ✅ Funciona en file:// protocol                            │
│  ✅ 100% portable                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## VISIÓN ESTRATÉGICA

### Objetivos SMART (Reales y Ajustados)

- **S**pecific: Reorganizar estructura de archivos y reducir duplicación
- **M**easurable: Reducir tamaño total de ~3MB a <2.5MB mediante shared code
- **A**chievable: 6 semanas manteniendo portabilidad 100%
- **R**elevant: Mantener compatibilidad con file:// protocol
- **T**ime-bound: Listo para FIFA 2026 (junio 2026)

### Restricciones Críticas

🔴 **NO ROMPER:**
1. Portabilidad (doble clic debe funcionar)
2. Offline (no request HTTP externos)
3. Autocontenido (todo inline en HTML)
4. file:// protocol (no requiere servidor)

---

## FASE 1: REORGANIZACIÓN DE ARCHIVOS (Semana 1)

### Objetivo
Limpiar estructura de proyecto y separar código de producción de desarrollo.

### Sprint 1.1: Limpieza de Archivos Incorrectos (Día 1)

**Archivos a Eliminar:**
```
❌ coverage/                    # Vitest no aplica a portable
❌ vitest.config.js            # No aplicable
❌ node_modules/               # Solo para desarrollo local
❌ .gitignore                  # Si contiene node_modules
❌ docs/SETUP_GUIDE.md         # Documento incorrecto (npm install)
```

**Comando:**
```bash
# En Unix/macOS
rm -rf coverage/ vitest.config.js node_modules/

# Verificar limpieza
ls -la
```

### Sprint 1.2: Reorganización de Estructura (Días 2-3)

**Estructura Actual (Desordenada):**
```
cvoed-tools/
├── ECE-DES.html              # (Producción)
├── ECE-DES-Dashboard.html    # (Producción)
├── ECE-DES-Tarjetas.html     # (Producción)
├── index.html                # (¿Producción o desarrollo?)
├── generador_tarjetas.html   # (Producción standalone)
├── guia_operativa_nunca_jamas.html  # (Producción standalone)
├── simulacro_nunca_jamas_fifa2026.html  # (Producción standalone)
├── src/                      # (Desarrollo)
│   ├── index.html
│   ├── dashboard.html
│   ├── tarjetas.html
│   └── ...
├── docs/                     # (Documentación)
└── build.js                  # (Herramienta desarrollo)
```

**Estructura Propuesta (Organizada):**
```
cvoed-tools/
├── README.md                 # Explica sistema portable
├── LICENSE                   # Apache 2.0
│
├── dist/                     # 🆕 PRODUCCIÓN (HTML autocontenidos)
│   ├── ECE-DES.html         # ← Desde src/index.html
│   ├── ECE-DES-Dashboard.html  # ← Desde src/dashboard.html
│   ├── ECE-DES-Tarjetas.html   # ← Desde src/tarjetas.html
│   ├── index.html           # Portal principal
│   ├── generador_tarjetas.html  # Standalone
│   ├── guia_operativa_nunca_jamas.html  # Standalone
│   └── simulacro_nunca_jamas_fifa2026.html  # Standalone
│
├── src/                      # DESARROLLO (Código modular)
│   ├── ece-des/             # 🆕 Módulo ECE-DES
│   │   ├── index.html       # → dist/ECE-DES.html
│   │   ├── js/
│   │   │   ├── app.js
│   │   │   ├── db-migrations.js
│   │   │   ├── sql-wasm.js
│   │   │   └── xlsx.full.min.js
│   │   └── css/
│   │       └── style.css    # Tokens v2.0
│   │
│   ├── dashboard/           # 🆕 Módulo Dashboard
│   │   ├── index.html       # → dist/ECE-DES-Dashboard.html
│   │   └── js/
│   │       └── dashboard.js
│   │
│   ├── tarjetas/            # 🆕 Módulo Tarjetas
│   │   ├── index.html       # → dist/ECE-DES-Tarjetas.html
│   │   └── js/
│   │       └── tarjetas.js
│   │
│   └── shared/              # 🆕 Código compartido
│       ├── css/
│       │   └── tokens.css   # Tokens v2.0 (compartido)
│       ├── js/
│       │   ├── sql-wasm.js  # SQLite (compartido)
│       │   ├── sql-wasm.wasm
│       │   ├── xlsx.full.min.js  # Excel (compartido)
│       │   └── utils.js     # 🆕 Utilidades comunes
│       └── fonts/           # Si se usan fonts locales
│
├── tools/                   # 🆕 Herramientas de desarrollo
│   ├── build.js             # Build system actualizado
│   └── dev-server.js        # 🆕 Server de desarrollo (opcional)
│
├── docs/                    # Documentación
│   ├── ARQUITECTURA_ANALISIS_REAL.md  # Análisis correcto
│   ├── REFACTORING_PLAN_V2.md  # Este documento
│   ├── TARES_TECNICAS.md    # Especificación original
│   ├── AGENT_TASKS_SPEC.md  # Especificación para agentes
│   └── pdf/                 # Guías IMSS en PDF
│       ├── Guía SMV-H.pdf
│       ├── SCI-Hospitalario.pdf
│       └── ...
│
└── .gitignore              # Ignorar node_modules, dist/
```

**Script de Migración:**
```bash
#!/bin/bash
# migrate-structure.sh

# Crear nuevas carpetas
mkdir -p dist
mkdir -p src/ece-des/{js,css}
mkdir -p src/dashboard/{js,css}
mkdir -p src/tarjetas/{js,css}
mkdir -p src/shared/{js,css,fonts}
mkdir -p tools

# Mover archivos de producción
mv ECE-DES.html dist/
mv ECE-DES-Dashboard.html dist/
mv ECE-DES-Tarjetas.html dist/
mv index.html dist/
mv generador_tarjetas.html dist/
mv guia_operativa_nunca_jamas.html dist/
mv simulacro_nunca_jamas_fifa2026.html dist/

# Mover código modular
mv src/index.html src/ece-des/
mv src/dashboard.html src/dashboard/
mv src/tarjetas.html src/tarjetas/

# Mover JS específicos
mv src/js/app.js src/ece-des/js/
mv src/js/dashboard.js src/dashboard/js/

# Mover código compartido
mv src/js/sql-wasm.js src/shared/js/
mv src/js/sql-wasm.wasm src/shared/js/
mv src/js/xlsx.full.min.js src/shared/js/
mv src/js/db-migrations.js src/ece-des/js/

# Mover CSS compartido
mv src/css/style.css src/shared/css/tokens.css

# Mover herramienta de build
mv build.js tools/

echo "Migración completada. Verifica con: tree -L 3"
```

### Sprint 1.3: Actualizar build.js (Días 4-5)

**Nueva Versión: tools/build.js**

```javascript
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

const bundleHtml = (moduleName, outputName) => {
  try {
    const inPath = path.join(srcDir, moduleName, 'index.html');
    const outPath = path.join(distDir, outputName);

    if (!fs.existsSync(inPath)) {
      console.log(`⚠️  Skipping ${moduleName} (not found)`);
      return;
    }

    let html = fs.readFileSync(inPath, 'utf8');

    // Inline CSS desde shared/
    html = html.replace(/<link rel="stylesheet" href="\/\*shared\*\/(.*?)">/g, (match, p1) => {
      const cssPath = path.join(srcDir, 'shared', p1);
      if (fs.existsSync(cssPath)) {
        return `<style>\n${fs.readFileSync(cssPath, 'utf8')}\n</style>`;
      }
      return match;
    });

    // Inline JS
    html = html.replace(/<script src="\/\*shared\*\/(.*?)"><\/script>/g, (match, p1) => {
      const jsPath = path.join(srcDir, 'shared', p1);
      if (!fs.existsSync(jsPath)) return match;

      const jsContent = fs.readFileSync(jsPath, 'utf8');

      // Caso especial: sql-wasm.js
      if (p1.includes('sql-wasm.js')) {
        const wasmPath = path.join(srcDir, 'shared', 'js', 'sql-wasm.wasm');
        const wasmBase64 = fs.readFileSync(wasmPath).toString('base64');
        const wasmDataURI = `data:application/wasm;base64,${wasmBase64}`;
        return `<script>\nwindow.SQL_WASM_URI = "${wasmDataURI}";\n${jsContent}\n</script>`;
      }

      return `<script>\n${jsContent}\n</script>`;
    });

    // Inline JS desde módulo específico
    html = html.replace(/<script src="(.*?)"><\/script>/g, (match, p1) => {
      const jsPath = path.join(srcDir, moduleName, p1);
      if (!fs.existsSync(jsPath)) return match;

      const jsContent = fs.readFileSync(jsPath, 'utf8');
      return `<script>\n${jsContent}\n</script>`;
    });

    fs.writeFileSync(outPath, html);
    console.log(`✅ Bundle creado: ${outputName} (${(html.length/1024/1024).toFixed(2)} MB)`);
  } catch (error) {
    console.error(`❌ Error building ${outputName}:`, error.message);
  }
};

console.log('🔨 Building CVOED-Tools...\n');

// Generar módulos que usan build system
bundleHtml('ece-des', 'ECE-DES.html');
bundleHtml('dashboard', 'ECE-DES-Dashboard.html');
bundleHtml('tarjetas', 'ECE-DES-Tarjetas.html');

console.log('\n✅ Build completado. Archivos en dist/');
```

**Uso:**
```bash
cd tools
node build.js
```

---

## FASE 2: EXTRACCIÓN DE CÓDIGO COMPARTIDO (Semana 2)

### Objetivo
Eliminar duplicación extrayendo código común a src/shared/.

### Sprint 2.1: Identificar Código Duplicado (Día 1)

**Análisis de Duplicación:**
```bash
# Encontrar código duplicado
fd -e html -x wc -l {} | sort -n

# Análisis manual
grep -r "Tokens v2.0" src/
grep -r "sql.js" src/
grep -r "function escapeHTML" src/
```

**Código a Extraer:**

1. **CSS Tokens** (ya en src/shared/css/tokens.css)
   - Usado por: ECE-DES, Dashboard, Tarjetas
   - Ahorro: ~60 líneas × 3 archivos = 180 líneas

2. **SQLite WASM** (ya en src/shared/js/)
   - Usado por: ECE-DES, Dashboard
   - Ahorro: ~192 JS + 655 KB WASM

3. **SheetJS XLSX** (ya en src/shared/js/)
   - Usado por: ECE-DES, Dashboard
   - Ahorro: ~945 KB

4. **Utilidades Comunes** (NUEVO)
   ```javascript
   // src/shared/js/utils.js
   export function escapeHTML(str) {
     const div = document.createElement('div');
     div.textContent = str;
     return div.innerHTML;
   }

   export function formatDate(date) {
     return new Date(date).toLocaleString('es-MX');
   }

   export function generateFolio() {
     return `P-${Date.now().toString(36).toUpperCase()}`;
   }

   export const TRIAGE_COLORS = {
     rojo: { hex: '#C41E3A', symbol: '◆' },
     amarillo: { hex: '#D4940A', symbol: '▲' },
     verde: { hex: '#1B7340', symbol: '●' },
     negro: { hex: '#1A1A2E', symbol: '✚' }
   };
   ```

### Sprint 2.2: Actualizar Referencias en Módulos (Días 2-5)

**Ejemplo: src/ece-des/index.html**

**ANTES:**
```html
<link rel="stylesheet" href="css/style.css">
<script src="js/sql-wasm.js"></script>
<script src="js/xlsx.full.min.js"></script>
<script src="js/app.js"></script>
```

**DESPUÉS:**
```html
<link rel="stylesheet" href="/*shared*/css/tokens.css">
<script src="/*shared*/js/sql-wasm.js"></script>
<script src="/*shared*/js/xlsx.full.min.js"></script>
<script src="js/utils.js"></script>
<script src="js/app.js"></script>
```

**Cambios en src/ece-des/js/app.js:**
```javascript
// ANTES
const escapeHTML = (str) => { /* ... */ };

// DESPUÉS
import { escapeHTML, formatDate, generateFolio, TRIAGE_COLORS } from '/*shared*/js/utils.js';
```

---

## FASE 3: MEJORAS DE CÓDIGO (Semana 3-4)

### Sprint 3.1: Seguridad XSS (Día 1)

**Ya completado por agentes anteriores:** ✅
- app.js: XSS corregidos
- dashboard.js: XSS corregidos

**Verificación:**
```bash
grep -n "innerHTML" src/ece-des/js/app.js
grep -n "textContent\|createElement" src/ece-des/js/app.js
```

### Sprint 3.2: Optimización de IndexedDB (Días 2-3)

**Problema:** La persistencia puede ser lenta con grandes DBs.

**Solución:** Implementar throttling en saveToIndexedDB()

```javascript
// src/ece-des/js/app.js
class App {
  constructor() {
    this.db = null;
    this.saveTimeout = null;
    this.saveThrottleMs = 2000; // Esperar 2s después del último cambio
  }

  saveToIndexedDB() {
    // Clear timeout anterior
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Programar nuevo save
    this.saveTimeout = setTimeout(() => {
      this._performSave();
    }, this.saveThrottleMs);
  }

  _performSave() {
    const data = this.db.export();
    const request = indexedDB.open('ECEDES_DB', 1);

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(['backups'], 'readwrite');
      const store = tx.objectStore('backups');
      store.put({ id: 'sqlite_backup', data: data, timestamp: Date.now() });
      console.log('💾 Guardado en IndexedDB');
    };
  }
}
```

### Sprint 3.3: Optimización de Bundle Size (Días 4-5)

**Estrategias:**

1. **Minificar CSS y JS en producción**
   - Herramienta: `terser` para JS, `csso` para CSS
   - Integrar en build.js

2. **Comprimir WASM con gzip**
   - Ya está comprimido, pero se puede usar Brotli

3. **Lazy Loading de Dashboard**
   - Dashboard solo se carga cuando el usuario lo solicita
   - Reducir tamaño inicial de ECE-DES.html

**Actualización de build.js con minificación:**
```javascript
const terser = require('terser');
const csso = require('csso');

// En bundleHtml()
const minifiedJS = await terser.minify(jsContent);
const minifiedCSS = csso.minify(cssContent).css;
```

---

## FASE 4: TESTING MANUAL (Semana 5)

### Objetivo
Verificar que el sistema portable funciona correctamente después de los cambios.

### Checklist de Testing

**Portabilidad:**
- [ ] Abrir dist/ECE-DES.html con doble clic
- [ ] Verificar que funciona sin internet (desconectar WiFi)
- [ ] Verificar que funciona en file:// protocol
- [ ] Probar en múltiples navegadores (Chrome, Firefox, Edge, Safari)

**Funcionalidad:**
- [ ] Login funciona
- [ ] Registro de pacientes
- [ ] Persistencia en IndexedDB
- [ ] Exportación a Excel
- [ ] Impresión de tarjetas

**Rendimiento:**
- [ ] Tiempo de carga <5 segundos
- [ ] Tamaño de archivos en dist/ <2.5MB

---

## FASE 5: DOCUMENTACIÓN FINAL (Semana 6)

### Sprint 5.1: Actualizar README.md (Días 1-2)

**Secciones a Actualizar:**
- Estructura de carpetas
- Instrucciones de desarrollo (si aplica)
- Instrucciones de build

### Sprint 5.2: Crear DEVELOPMENT.md (Días 3-4)

**Contenido:**
- Cómo trabajar en src/
- Cómo ejecutar build.js
- Cómo probar cambios

---

## MÉTRICAS DE ÉXITO

### Antes de Refactorización
| Métrica | Valor |
|---------|-------|
| Tamaño total | ~3 MB |
| Duplicación CSS | ~180 líneas |
| Duplicación JS | ~1,100 líneas |
| Estructura | Desorganizada |

### Después de Refactorización (Meta)
| Métrica | Valor | Mejora |
|---------|-------|--------|
| Tamaño total | <2.5 MB | -17% |
| Duplicación CSS | 0 líneas | -100% |
| Duplicación JS | 0 líneas | -100% |
| Estructura | Organizada | ✅ |

---

## RIESGOS Y MITIGACIÓN

### Riesgo 1: Romper Portabilidad
- **Probabilidad:** Media
- **Impacto:** Crítico
- **Mitigación:** Testing manual exhaustivo en file:// protocol
- **Plan B:** Revertir a estructura anterior usando git

### Riesgo 2: Errores en build.js
- **Probabilidad:** Baja
- **Impacto:** Alto
- **Mitigación:** Mantener archivos HTML viejos como respaldo
- **Plan B:** Usar build.js original (ya probado)

---

## CRONOGRAMA SEMANAL

```
Semana 1: Reorganización ✅
  Día 1: Limpieza de archivos incorrectos
  Día 2-3: Migración de estructura
  Día 4-5: Actualizar build.js

Semana 2: Código Compartido ✅
  Día 1: Identificar duplicación
  Día 2-5: Extraer y actualizar referencias

Semana 3: Mejoras de Código ✅
  Día 1: Verificar XSS (ya completado)
  Día 2-3: Optimizar IndexedDB
  Día 4-5: Minificación

Semana 4: Testing y Ajustes ✅
  Día 1-3: Testing manual
  Día 4-5: Corregir bugs encontrados

Semana 5: Documentación ✅
  Día 1-2: Actualizar README
  Día 3-4: Crear DEVELOPMENT.md

Semana 6: Buffer y Deploy ✅
  Día 1-2: Testing final
  Día 3-4: Preparar distribución
  Día 5: Entrega final
```

---

## CONCLUSIÓN

Este plan de refactorización **MANTIENE** la arquitectura portable que hace único a CVOED-Tools, mientras mejora la organización del código y reduce el tamaño del bundle mediante extracción de código compartido.

**Principio rector:** Si un cambio compromete la portabilidad (doble clic para abrir), NO se implementa.

---

*Plan V2.0 - Arquitectura Portable Correcta*
*Actualizado por CONTROLADOR*
*2026-03-03*
