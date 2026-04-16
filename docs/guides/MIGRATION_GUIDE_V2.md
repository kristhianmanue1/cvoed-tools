# GUÍA DE MIGRACIÓN - CVOED-TOOLS (PORTABLE)

**Fecha:** 2026-03-03 (Actualizado)
**Autor:** ADRC CONTROLADOR
**Versión:** 2.0.0 (Arquitectura Portable Correcta)
**Audiencia:** Desarrolladores que mantienen código de CVOED-Tools

---

## ⚠️ ADVERTENCIA CRÍTICA

```
Este NO es un proyecto Node.js moderno.

CVOED-Tools es un sistema PORTABLE que funciona:
✅ Con doble clic
✅ Sin internet
✅ Sin servidor
✅ En file:// protocol

NO hacer:
❌ npm install en producción
❌ Usar frameworks (React, Vue, etc.)
❌ Agregar dependencias externas
❌ Asumir que hay un build process complejo
```

---

## TABLA DE CONTENIDOS

1. [Conceptos Fundamentales](#1-conceptos-fundamentales)
2. [Preparación del Entorno de Desarrollo](#2-preparación-del-entorno)
3. [Flujo de Trabajo](#3-flujo-de-trabajo)
4. [Migración de Código](#4-migración-de-código)
5. [Patrones Comunes](#5-patrones-comunes)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. CONCEPTOS FUNDAMENTALES

### 1.1 Arquitectura Dual

```
DESARROLLO (src/)                    PRODUCCIÓN (dist/)
Código modular                  →    HTML autocontenido
ES modules permitados           →    Todo inline
Archivos separados              →    Todo en un archivo
                                   CSS inline
                                   JS inline
                                   WASM inline (Base64)
```

### 1.2 Cómo Funciona build.js

**Propósito:** Convertir código modular en HTML portable

```javascript
// Entrada: src/ece-des/index.html
<link rel="stylesheet" href="/*shared*/css/tokens.css">
<script src="/*shared*/js/sql-wasm.js"></script>
<script src="js/app.js"></script>

// ↓ build.js procesa

// Salida: dist/ECE-DES.html
<style>
/* Contenido completo de tokens.css */
</style>
<script>
window.SQL_WASM_URI = "data:application/wasm;base64,...";
/* Contenido de sql-wasm.js */
</script>
<script>
/* Contenido de app.js */
</script>
```

### 1.3 Restricciones Críticas

🔴 **NUNCA ROMPER:**

1. **Portabilidad**
   - El HTML final debe abrirse con doble clic
   - No puede haber request HTTP externos
   - Todo debe estar inline

2. **Offline**
   - No usar CDNs
   - No usar Google Fonts
   - No usar librerías externas

3. **file:// Protocol**
   - El sistema debe funcionar sin servidor web
   - No usar APIs que requieran HTTPS
   - No usar Service Workers (requieren HTTPS o localhost)

---

## 2. PREPARACIÓN DEL ENTORNO DE DESARROLLO

### 2.1 Requisitos

**Para desarrollo local (opcional):**
```bash
# Node.js >=18 (SOLO para ejecutar build.js)
node --version

# Git
git --version
```

**Para usar el sistema (producción):**
```
❌ NO SE REQUIERE NADA
Solo un navegador web moderno
```

### 2.2 Estructura de Archivos

```
cvoed-tools/
├── src/              # Código modular (desarrollo)
├── dist/             # HTML autocontenido (producción)
├── tools/            # Herramientas de desarrollo
└── docs/             # Documentación
```

### 2.3 Configuración de Desarrollo (Opcional)

**Solo si quieres hacer desarrollo activo:**

```bash
# Clonar repositorio
git clone <repo-url>
cd cvoed-tools

# Instalar dependencias de desarrollo (OPCIONAL)
npm install --save-dev \
  terser \
  csso

# Las dependencias anteriores son SOLO para minificación
# NO son necesarias para el funcionamiento del sistema
```

---

## 3. FLUJO DE TRABAJO

### 3.1 Ciclo de Desarrollo

```
1. Editar código en src/
   ↓
2. Ejecutar build.js
   ↓
3. Probar HTML en dist/
   ↓
4. Si funciona → Commit
   Si no funciona → Volver a 1
```

### 3.2 Comandos Esenciales

```bash
# Construir HTMLs portátiles
cd tools
node build.js

# Abrir ECE-DES para probar
open dist/ECE-DES.html  # macOS
xdg-open dist/ECE-DES.html  # Linux
start dist/ECE-DES.html  # Windows

# Limpiar archivos generados
rm -rf dist/

# Verificar portabilidad
grep -c "import " dist/ECE-DES.html
# Debería retornar 0 (no hay ES modules en HTML final)
```

### 3.3 Testing Manual

**Checklist obligatorio antes de commit:**

```markdown
## Portabilidad
- [ ] Abrir dist/ECE-DES.html con doble clic
- [ ] Funciona sin internet (desconectar WiFi)
- [ ] Funciona en file:// protocol
- [ ] No hay errores en consola del navegador

## Funcionalidad
- [ ] Login funciona
- [ ] Registro de pacientes
- [ ] Persistencia en IndexedDB
- [ ] Exportación a Excel

## Verificación Técnica
- [ ] No hay imports ES6 en HTML final
- [ ] WASM está inline (window.SQL_WASM_URI)
- [ ] CSS está inline (<style>)
- [ ] JS está inline (<script>)
```

---

## 4. MIGRACIÓN DE CÓDIGO

### 4.1 Agregar Nueva Funcionalidad

**Escenario:** Agregar un nuevo campo al formulario de pacientes

#### Paso 1: Modificar schema de DB

```javascript
// src/ece-des/js/db-migrations.js

export const DB_SCHEMA_VERSION = 3;  // Incrementar versión

export const MIGRATIONS = {
  1: (db) => {
    // Versión 1: Schema inicial
    db.run(`
      CREATE TABLE IF NOT EXISTS pacientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        folio_local TEXT UNIQUE,
        nombre TEXT,
        triage_actual TEXT,
        ts_ingreso INTEGER
      )
    `);
  },

  2: (db) => {
    // Versión 2: Agregar teléfono
    db.run(`ALTER TABLE pacientes ADD COLUMN telefono TEXT`);
  },

  3: (db) => {
    // VERSIÓN 3: Agregar nuevo campo
    db.run(`ALTER TABLE pacientes ADD COLUMN email TEXT`);
  }
};
```

#### Paso 2: Actualizar UI

```html
<!-- src/ece-des/index.html -->
<form id="patient-form">
  <input name="nombre" placeholder="Nombre">
  <input name="telefono" placeholder="Teléfono">
  <input name="email" placeholder="Email">  <!-- NUEVO -->
  <select name="triage">
    <option value="rojo">ROJO</option>
    <option value="amarillo">AMARILLO</option>
    <option value="verde">VERDE</option>
    <option value="negro">NEGRO</option>
  </select>
  <button type="submit">Guardar</button>
</form>
```

#### Paso 3: Actualizar Lógica

```javascript
// src/ece-des/js/app.js

class App {
  registerPatient(formData) {
    const stmt = this.db.prepare(`
      INSERT INTO pacientes (folio_local, nombre, telefono, email, triage_actual, ts_ingreso)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      generateFolio(),
      formData.nombre,
      formData.telefono,
      formData.email,  // NUEVO
      formData.triage,
      Date.now()
    );

    this.renderCensus();
  }
}
```

#### Paso 4: Reconstruir

```bash
cd tools
node build.js
```

#### Paso 5: Probar

```bash
open dist/ECE-DES.html
```

**Verificar:**
- [ ] Nuevo campo aparece en formulario
- [ ] Datos se guardan en IndexedDB
- [ ] Datos persisten al recargar
- [ ] Exportación Excel incluye nuevo campo

---

### 4.2 Extraer Código Compartido

**Escenario:** Dos módulos usan la misma función

#### Paso 1: Identificar duplicación

```javascript
// src/ece-des/js/app.js
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// src/dashboard/js/dashboard.js
function escapeHTML(str) {  // DUPLICADO
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

#### Paso 2: Crear módulo compartido

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
```

#### Paso 3: Actualizar módulos

```html
<!-- src/ece-des/index.html -->
<script src="/*shared*/js/utils.js"></script>
<script src="js/app.js"></script>
```

```javascript
// src/ece-des/js/app.js
import { escapeHTML, generateFolio } from '/*shared*/js/utils.js';

class App {
  // Usar funciones importadas
  renderPatient(patient) {
    const div = document.createElement('div');
    div.textContent = escapeHTML(patient.nombre);
    return div;
  }
}
```

#### Paso 4: Reconstruir y Probar

```bash
cd tools
node build.js
open dist/ECE-DES.html
```

---

### 4.3 Corregir Vulnerabilidad XSS

**Escenario:** Se encontró XSS en app.js

#### Paso 1: Identificar código vulnerable

```javascript
// VULNERABLE
function renderPatientRow(patient) {
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${patient.nombre}</td><td>${patient.triage}</td>`;
  return tr;
}
```

#### Paso 2: Corregir

```javascript
// SEGURO
function renderPatientRow(patient) {
  const tr = document.createElement('tr');

  const tdNombre = document.createElement('td');
  tdNombre.textContent = patient.nombre;  // textContent escapa automáticamente

  const tdTriage = document.createElement('td');
  tdTriage.textContent = patient.triage;

  tr.appendChild(tdNombre);
  tr.appendChild(tdTriage);

  return tr;
}
```

#### Paso 3: Verificar

```javascript
// Test manual
const maliciousInput = '<script>alert("XSS")</script>';
const row = renderPatientRow({ nombre: maliciousInput, triage: 'rojo' });
console.log(row.innerHTML);  // No debe contener <script>
```

---

## 5. PATRONES COMUNES

### 5.1 Acceso a IndexedDB

```javascript
// Guardar SQLite export
function saveToIndexedDB(db) {
  const data = db.export();  // Uint8Array

  const request = indexedDB.open('ECEDES_DB', 1);

  request.onupgradeneeded = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains('backups')) {
      db.createObjectStore('backups');
    }
  };

  request.onsuccess = (e) => {
    const db = e.target.result;
    const tx = db.transaction(['backups'], 'readwrite');
    const store = tx.objectStore('backups');

    store.put({ id: 'sqlite_backup', data: data, timestamp: Date.now() });

    tx.oncomplete = () => {
      console.log('✅ Guardado en IndexedDB');
    };
  };
}

// Cargar SQLite export
function loadFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ECEDES_DB', 1);

    request.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction(['backups'], 'readonly');
      const store = tx.objectStore('backups');
      const getRequest = store.get('sqlite_backup');

      getRequest.onsuccess = () => {
        resolve(getRequest.result);  // { id, data: Uint8Array, timestamp }
      };

      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    };
  });
}
```

### 5.2 Exportación a Excel

```javascript
// Usando SheetJS (ya está en src/shared/js/xlsx.full.min.js)

function exportToExcel(db) {
  // Obtener datos
  const pacientes = db.exec("SELECT * FROM pacientes");

  // Crear workbook
  const workbook = XLSX.utils.book_new();

  // Crear worksheet
  const ws = XLSX.utils.aoa_to_sheet([
    ['Folio', 'Nombre', 'Triage', 'Ingreso'],
    ...pacientes.map(p => [p.folio_local, p.nombre, p.triage_actual, new Date(p.ts_ingreso).toLocaleString()])
  ]);

  // Agregar worksheet al workbook
  XLSX.utils.book_append_sheet(workbook, ws, 'Pacientes');

  // Descargar
  XLSX.writeFile(workbook, 'ECE-DES-Export.xlsx');
}
```

### 5.3 Manejo de Migraciones de DB

```javascript
// En app.js, al inicializar

async initDatabase() {
  // Cargar WASM
  const SQL = await initSqlJs({
    locateFile: file => window.SQL_WASM_URI
  });

  // Crear DB o cargar desde IndexedDB
  try {
    const saved = await loadFromIndexedDB();
    this.db = new SQL.Database(saved.data);
  } catch {
    this.db = new SQL.Database();
  }

  // Verificar versión y migrar si es necesario
  const currentVersion = this.db.exec("PRAGMA user_version")[0].values[0][0];

  if (currentVersion < DB_SCHEMA_VERSION) {
    console.log(`Migrando DB de v${currentVersion} a v${DB_SCHEMA_VERSION}`);

    // Hacer backup
    const backup = this.db.export();

    // Ejecutar migraciones
    for (let v = currentVersion + 1; v <= DB_SCHEMA_VERSION; v++) {
      if (MIGRATIONS[v]) {
        MIGRATIONS[v](this.db);
      }
    }

    // Actualizar versión
    this.db.run(`PRAGMA user_version = ${DB_SCHEMA_VERSION}`);

    // Guardar en IndexedDB
    this.saveToIndexedDB();

    console.log('✅ Migración completada');
  }
}
```

---

## 6. TROUBLESHOOTING

### 6.1 "QuotaExceededError" en LocalStorage

**Problema:**
```
Uncaught DOMException: Failed to execute 'setItem' on 'Storage':
Setting the value of 'sqlite_db' exceeded the quota.
```

**Causa:** LocalStorage tiene límite de 5 MB. SQLite exports son más grandes.

**Solución:** Usar IndexedDB (ya implementado en código actual).

```javascript
// INCORRECTO
localStorage.setItem('sqlite_db', db.export());  // ❌

// CORRECTO
const data = db.export();  // Uint8Array
// Guardar en IndexedDB (ver patrón 5.1)
```

---

### 6.2 "SQL is not defined"

**Problema:**
```
ReferenceError: SQL is not defined
```

**Causa:** sql-wasm.js no se cargó correctamente o el WASM no está inline.

**Solución:**

1. **Verificar que build.js ejecutó correctamente:**
   ```bash
   grep -c "window.SQL_WASM_URI" dist/ECE-DES.html
   # Debe retornar >0
   ```

2. **Verificar orden de scripts en HTML:**
   ```html
   <script src="/*shared*/js/sql-wasm.js"></script>
   <script src="js/app.js"></script>
   ```

3. **Verificar inicialización:**
   ```javascript
   // En app.js
   const SQL = await initSqlJs({
     locateFile: file => window.SQL_WASM_URI
   });
   ```

---

### 6.3 "Cannot use import statement outside a module"

**Problema:**
```
SyntaxError: Cannot use import statement outside a module
```

**Causa:** Hay ES modules en el HTML final (build.js no procesó correctamente).

**Solución:**

1. **Verificar que no hay imports en HTML final:**
   ```bash
   grep "import " dist/ECE-DES.html
   # No debe retornar nada
   ```

2. **Si hay imports, rebuild:**
   ```bash
   cd tools
   node build.js
   ```

3. **Si persiste, verificar referencias en src/:**
   ```bash
   # En src/ece-des/index.html
   # Debe usar /*shared*/ para código compartido
   <script src="/*shared*/js/utils.js"></script>
   ```

---

### 6.4 IndexedDB no persiste entre sesiones

**Problema:** Datos se pierden al cerrar el navegador.

**Causa:** Modo privado/incógnito o navegador configurado para no persistir datos.

**Solución:** No es un bug del código. IndexedDB en modo privado se borra al cerrar.

**Workaround para desarrollo:** Usar modo normal del navegador.

---

### 6.5 WASM no carga en file:// protocol

**Problema:**
```
Fetch API cannot load file:///path/to/sql-wasm.wasm
```

**Causa:** WASM no está inline como data URI.

**Solución:** build.js debe convertir WASM a Base64.

**Verificar:**
```bash
grep -A 2 "window.SQL_WASM_URI" dist/ECE-DES.html | head -3
# Debe mostrar: window.SQL_WASM_URI = "data:application/wasm;base64,...
```

---

### 6.6 Chrome bloquea scripts locales

**Problema:** Chrome muestra advertencia sobre scripts locales.

**Causa:** Política de seguridad de Chrome para file://.

**Solución:** Es una advertencia, no un error. El código sigue funcionando.

**Opcional:** Permitir scripts en chrome://settings/content/javascript

---

## 📋 CHECKLIST FINAL DE MIGRACIÓN

Antes de considerar que una migración está completa:

```markdown
## Código
- [ ] Cambios hechos en src/ (NO en dist/)
- [ ] Código compartido extraído a src/shared/
- [ ] ES modules usados correctamente en src/
- [ ] No hay rutas relativas rotas

## Build
- [ ] build.js ejecutado sin errores
- [ ] HTMLs generados en dist/
- [ ] Tamaños de archivos razonables (<3 MB)

## Portabilidad
- [ ] HTML abre con doble clic
- [ ] Funciona sin internet
- [ ] No hay imports ES6 en HTML final
- [ ] WASM está inline (Base64)
- [ ] CSS está inline

## Funcionalidad
- [ ] Aplicación funciona correctamente
- [ ] No hay errores en consola
- [ ] IndexedDB persiste datos
- [ ] Exportaciones funcionan

## Testing
- [ ] Probado en Chrome
- [ ] Probado en Firefox (opcional)
- [ ] Probado en Edge (opcional)
- [ ] Probado en Safari (opcional si tienes Mac)
```

---

## 🎯 PRINCIPIOS RECTOR

1. **SIMPLICIDAD:** Si es complejo, probablemente está mal.
2. **PORTABILIDAD:** Si no funciona con doble clic, está mal.
3. **OFFLINE:** Si requiere internet, está mal.
4. **TRANSPARENCIA:** El código debe ser entendible por otro desarrollador.

---

**Guía de Migración v2.0 - Arquitectura Portable Correcta**
**ADRC CONTROLADOR**
**2026-03-03**
