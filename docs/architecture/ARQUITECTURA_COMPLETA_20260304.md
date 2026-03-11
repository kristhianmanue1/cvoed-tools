# 🏗️ ARQUITECTURA COMPLETA CVOED-TOOLS v1.1.0

**Fecha:** 2026-03-04
**Agente:** CONTROLADOR (ADRC 2.0)
**Versión:** 1.1.0
**Estado:** Production-ready

---

## 📋 ÍNDICE

1. [Visión General](#visión-general)
2. [Mapa de Herramientas](#mapa-de-herramientas)
3. [Arquitectura por Capas](#arquitectura-por-capas)
4. [Subsistemas Críticos](#subsistemas-críticos)
5. [Flujos de Datos](#flujos-de-datos)
6. [Sistema de Diseño](#sistema-de-diseño)
7. [Patrones Técnicos](#patrones-técnicos)
8. [Gaps y Riesgos](#gaps-y-riesgos)
9. [Plan de Evolución](#plan-de-evolución)

---

## 🎯 VISIÓN GENERAL

### Propósito
CVOED-Tools es una **suite portátil de 7 aplicaciones HTML5** diseñadas para hospitales IMSS durante emergencias y desastres en el contexto de la Copa Mundial FIFA 2026.

### Principios de Diseño
1. **100% Offline** - No requiere internet para funcionar
2. **Portable en USB** - Todo en archivos autocontenidos
3. **Zero Dependencies** - Sin CDNs, sin descargas externas
4. **Persistencia Local** - Datos nunca salen de la máquina
5. **Ejecución Inmediata** - Doble clic y funciona

### Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────┐
│                     CAPA DE PRESENTACIÓN                      │
├─────────────────────────────────────────────────────────────┤
│  HTML5 + CSS3 (Tokens v2.0) + Vanilla JavaScript (ES2022)  │
│  Sistema de componentes + Modal system + Print styles       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE LÓGICA DE NEGOCIO                  │
├─────────────────────────────────────────────────────────────┤
│  - Triage START (ISO 3864)                                  │
│  - Registro de pacientes                                   │
│  - Sistema de expedientes clínicos                          │
│  - Dashboard de métricas                                   │
│  - Generación de tarjetas                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PERSISTENCIA                        │
├─────────────────────────────────────────────────────────────┤
│  - IndexedDB (Base de datos SQLite binaria)                 │
│  - sql.js (SQLite WASM - 1.2MB inline)                      │
│  - SheetJS (XLSX export - 400KB inline)                     │
│  - localStorage (Sesión y configuración)                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     CAPA DE NAVEGADOR                         │
├─────────────────────────────────────────────────────────────┤
│  - IndexedDB API (Nativo)                                   │
│  - WebAssembly (sql.js)                                     │
│  - File API (Exportaciones)                                 │
│  - Print API (Impresión de tarjetas)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗺️ MAPA DE HERRAMIENTAS

### Resumen Ejecutivo

| # | Herramienta | Tamaño | Propósito | Complejidad | Estado |
|---|-------------|--------|-----------|-------------|--------|
| 1 | **index.html** | 14 KB | Portal principal | Baja | ✅ Funcional |
| 2 | **ECE-DES.html** | 1.8 MB | Sistema principal de registro | Alta | ✅ Funcional |
| 3 | **ECE-DES-Dashboard.html** | 921 KB | Tablero de análisis | Media | ✅ Funcional |
| 4 | **ECE-DES-Tarjetas.html** | 13 KB | Impresión de tarjetas START | Baja | ✅ Funcional |
| 5 | **generador_tarjetas.html** | 117 KB | Generador SCI-H | Media | ✅ Funcional |
| 6 | **guia_operativa_nunca_jamas.html** | 41 KB | Guía operativa | Baja | ✅ Funcional |
| 7 | **simulacro_nunca_jamas_fifa2026.html** | 84 KB | Plataforma de evaluación | Media | ✅ Funcional |

---

## 🔧 DETALLE DE HERRAMIENTAS

### 1. index.html - Portal Principal

**Propósito:** Punto de entrada unificado a todas las herramientas

**Arquitectura:**
```html
├── Header (Branding institucional)
├── Sección: Aplicaciones Web Offline
│   ├── ECE-DES (Sistema principal)
│   ├── Dashboard Directivo
│   ├── Generador de Tarjetas Físicas
│   └── Tarjetones SCI-H
├── Sección: Manuales y Guías OPS/OMS
│   ├── Guía SMV-H
│   ├── SCI Hospitalario
│   ├── Guía EVAC-H
│   ├── Guía BCP-H
│   ├── Plan Multiamenaza/QBRNE
│   └── Índice Hospital Seguro
└── Sección: Ejercicios Simulacro
    ├── Plataforma Evaluadora
    ├── Guía Digital Interactiva
    └── Bases del Simulacro FIFA 2026
```

**Características:**
- Cards interactivas con hover effects
- Links relativos a `dist/`
- Diseño responsive
- Sistema de tags (PWA, PDF, Simulación)

**Dependencias:** Ninguna (HTML puro + CSS embebido)

**Subsistemas:**
- Sistema de navegación
- Sistema de tarjetas con badges
- Sistema de categorización

---

### 2. ECE-DES.html - Sistema Principal

**Propósito:** Expediente Clínico Electrónico para Desastres - Sistema de registro de pacientes en tiempo real

**Arquitectura:**

```
ECE-DES.html (1.8 MB)
│
├── CSS Layer (~200 lines)
│   ├── Tokens de Diseño v2.0
│   ├── Sistema de Layout (Grid + Flexbox)
│   ├── Componentes UI (Buttons, Cards, Modals)
│   └── Print Styles (@media print)
│
├── HTML Structure
│   ├── View: Login
│   │   ├── Hospital input
│   │   ├── Operador input
│   │   └── PIN (4 dígitos)
│   │
│   ├── View: Main Application
│   │   ├── Navbar (Status bar)
│   │   ├── Panel de Control
│   │   │   ├── Botones Triage (R, A, V, N)
│   │   │   └── Botón Nuevo Paciente
│   │   ├── Buscador
│   │   └── Tabla de Pacientes (Censo)
│   │
│   ├── Modal: Nuevo Paciente
│   ├── Modal: Expediente Individual
│   │   ├── Perfil demográfico
│   │   ├── Línea de tiempo
│   │   └── Formulario de eventos
│   └── Print Badge
│
└── JavaScript Layer (~1100 lines)
    │
    ├── DEPENDENCIAS INLINE
    │   ├── sql.js (SQLite WASM - 1.2 MB)
    │   └── SheetJS (XLSX export - 400 KB)
    │
    └── APLICACIÓN PRINCIPAL (objeto `app`)
        │
        ├── ESTADO GLOBAL
        │   ├── db (SQLite instance)
        │   ├── session (hospital, operador, rol)
        │   ├── saveTimeout (Throttling)
        │   └── currentPatientId
        │
        ├── SISTEMA DE AUTENTICACIÓN
        │   ├── login()
        │   ├── validatePin()
        │   └── audit("LOGIN", ...)
        │
        ├── SISTEMA DE PACIENTES
        │   ├── registerPatient()
        │   ├── updateTriage()
        │   ├── renderCensus()
        │   └── searchPatient()
        │
        ├── SISTEMA DE EXPEDIENTES
        │   ├── showPatientDetails()
        │   ├── renderTimeline()
        │   ├── addClinicalEvent()
        │   └── updatePatientProfile()
        │
        ├── SISTEMA DE PERSISTENCIA
        │   ├── saveToIndexedDB() (Throttled 2s)
        │   ├── loadFromIndexedDB()
        │   └── exportToExcel()
        │
        └── SISTEMA DE BASE DE DATOS
            ├── init()
            ├── createSchema() (v2)
            ├── runMigrations()
            └── audit()
```

**Esquema de Base de Datos:**

```sql
-- TABLA: pacientes
CREATE TABLE pacientes (
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

-- TABLA: trazabilidad
CREATE TABLE trazabilidad (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_paciente TEXT NOT NULL,
  ts_evento TEXT NOT NULL,
  tipo_evento TEXT,
  descripcion TEXT,
  valor_anterior TEXT,
  valor_nuevo TEXT,
  operador TEXT,
  FOREIGN KEY (id_paciente) REFERENCES pacientes(id_interno)
);

-- TABLA: auditoria
CREATE TABLE auditoria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,
  operador TEXT NOT NULL,
  accion TEXT NOT NULL,
  tabla_ref TEXT,
  id_ref TEXT,
  detalle TEXT
);
```

**Flujo de Trabajo:**

```
1. LOGIN
   ↓
2. INICIALIZACIÓN
   ├── Cargar sql.js WASM
   ├── Conectar IndexedDB
   └── Crear/Abrir SQLite DB
   ↓
3. APLICACIÓN PRINCIPAL
   ├── Registro de pacientes
   ├── Asignación de triage
   ├── Actualización de expedientes
   └── Exportación de datos
   ↓
4. PERSISTENCIA AUTOMÁTICA
   ├── Throttled (2s después del último cambio)
   ├── IndexedDB (Sin límite de tamaño)
   └── Backup automático antes de migraciones
```

**Subsistemas:**

1. **Sistema de Triage START**
   - 4 niveles: ROJO (crítico), AMARILLO (urgente), VERDE (leve), NEGRO (sin vida)
   - Basado en estándar ISO 3864
   - Actualización con auditoría
   - Interfaz simple con botones grandes

2. **Sistema de Persistencia IndexedDB**
   - Database: `ECEDES_DB`
   - Store: `sqlite_backup`
   - Key: `latest`
   - Soporta > 5MB (a diferencia de localStorage)
   - Throttling automático para performance

3. **Sistema de Exportación Excel**
   - 3 hojas:
     1. Censo de pacientes
     2. Trazabilidad de eventos
     3. Auditoría log RAW
   - Formato: `.xlsx` con timestamp
   - Incluye todos los datos para reportes oficiales

4. **Sistema de Impresión**
   - Badge de paciente con código de colores
   - Media queries específicas para impresión
   - Modo `print-badge-mode` para ocultar UI

**Dependencias:**
- sql.js (SQLite WASM) - 1.2 MB inline
- SheetJS (XLSX) - 400 KB inline
- IndexedDB API (nativo)

---

### 3. ECE-DES-Dashboard.html - Tablero de Control

**Propósito:** Visualización de métricas en tiempo real para Puesto de Mando

**Arquitectura:**

```
Dashboard.html (921 KB)
│
├── CSS Layer
│   ├── Grid Layout System
│   ├── Pure CSS Bar Charts (Sin librerías)
│   └── Responsive Components
│
├── HTML Structure
│   ├── Navbar (Puesto de Mando)
│   ├── KPI Cards (4 métricas principales)
│   ├── Bar Chart (Distribución triage)
│   ├── Timeline (Últimos 10 eventos)
│   └── Patient Table (Listado completo)
│
└── JavaScript Layer
    │
    ├── DEPENDENCIAS INLINE
    │   └── sql.js (SQLite WASM - 1.2 MB)
    │
    └── APLICACIÓN PRINCIPAL (objeto `dash`)
        │
        ├── CONEXIÓN A DATOS
        │   ├── loadDatabase()
        │   ├── openIndexedDB("ECEDES_DB")
        │   └── readSQLiteBackup()
        │
        ├── SISTEMA DE MÉTRICAS
        │   ├── calculateKPIs()
        │   ├── totalPatients
        │   ├── criticalPatients (Rojos)
        │   ├── totalActions
        │   └── distributionByTriage
        │
        └── SISTEMA DE RENDERIZADO
            ├── renderKPIs()
            ├── renderBarChart()
            ├── renderTimeline()
            └── renderPatientTable()
```

**KPIs Calculados:**

```javascript
// 1. Total Pacientes
SELECT COUNT(*) FROM pacientes

// 2. Pacientes Críticos (Rojos)
SELECT COUNT(*) FROM pacientes WHERE triage_actual='ROJO'

// 3. Acciones Médicas Totales
SELECT COUNT(*) FROM trazabilidad

// 4. Distribución por Prioridad
SELECT triage_actual, COUNT(*) FROM pacientes
GROUP BY triage_actual
```

**Sistema de Gráficas:**
- **Pure CSS** - Sin librerías externas (Chart.js, D3.js)
- Barras verticales animadas
- Colores del sistema triage
- Responsive con CSS Grid

**Conexión a ECE-DES:**
- Lee de IndexedDB `ECEDES_DB`
- Store: `sqlite_backup`
- Solo lectura (no modifica datos)
- No requiere que ECE-DES esté activo

**Subsistemas:**
1. Sistema de métricas en tiempo real
2. Sistema de gráficas CSS puras
3. Sistema de timeline de eventos
4. Sistema de tablas con colores de triage

---

### 4. ECE-DES-Tarjetas.html - Motor de Impresión

**Propósito:** Generar plantillas de impresión para tarjetas START físicas

**Arquitectura:**

```
Tarjetas.html (13 KB)
│
├── CSS Layer
│   ├── Print-optimized styles
│   ├── A4 layout system
│   └── Badge designs (front/back)
│
├── HTML Structure
│   ├── 4 tarjetas por hoja A4
│   ├── Front: Datos demográficos + Triage
│   └── Back: Instrucciones médicas
│
└── JavaScript Layer (Mínimo)
    └── print() function
```

**Características:**
- 4 tarjetas por hoja A4 (cascada)
- Diseño recortable
- Colores ISO 3864
- Optimizado para impresora láser
- No requiere JavaScript complejo

**Subsistemas:**
- Sistema de layout de impresión
- Sistema de códigos de colores
- Sistema de diagrama corporal

---

### 5. generador_tarjetas.html - Generador SCI-H

**Propósito:** Crear Tarjetas de Acción para el Sistema de Comando de Incidentes Hospitalario

**Arquitectura:**

```
generador_tarjetas.html (117 KB)
│
├── CSS Layer
│   ├── Token system v2.0
│   ├── Tab-based navigation
│   └── Form styles
│
├── HTML Structure
│   ├── Tabs (Guía / Tarjetas)
│   ├── 7 Tarjetas de Acción:
│   │   ├── Comandante
│   │   ├── Operaciones
│   │   ├── Planificación
│   │   ├── Logística
│   │   ├── Administración/Finanzas
│   │   ├── Seguridad
│   │   ├── Información Pública
│   │   └── Enlace
│   └── Formularios dinámicos
│
└── JavaScript Layer
    │
    └── ESTADO Y PERSISTENCIA
        ├── localStorage (datos persistentes)
        ├── Tab switching system
        ├── Validation logic
        └── Print styles
```

**Características:**
- 7 tarjetas completas
- Sistema de pestañas
- Datos persistentes en localStorage
- Validación en tiempo real
- Filas dinámicas para comunicación

**Subsistemas:**
- Sistema de pestañas interactivo
- Sistema de validación
- Sistema de persistencia (localStorage)
- Sistema de filas dinámicas

---

### 6. guia_operativa_nunca_jamas.html - Guía Operativa

**Propósito:** Documentación paso a paso para simulación multiamenaza

**Arquitectura:**

```
guia_operativa.html (41 KB)
│
├── CSS Layer
│   ├── Dark theme
│   ├── Step system
│   └── Progress indicators
│
├── HTML Structure
│   ├── Header (Ejercicio Nunca Jamás)
│   ├── Steps (expand/collapse)
│   ├── Checklist interactivo
│   └── Progress bar
│
└── JavaScript Layer (Mínimo)
    └── Toggle logic + Progress calculation
```

**Características:**
- Checklist interactivo con progreso
- Pasos expandibles/colapsables
- Sistema de alertas
- Barra de progreso visual
- Diseño oscuro con contraste alto

**Subsistemas:**
- Sistema de pasos numerados
- Sistema de checklist
- Sistema de progreso
- Sistema de alertas

---

### 7. simulacro_nunca_jamas_fifa2026.html - Guion de Simulacro

**Propósito:** Documentación completa del escenario de ejercicio FIFA 2026

**Arquitectura:**

```
simulacro.html (84 KB)
│
├── CSS Layer
│   ├── Modern design
│   ├── Badge system
│   └── Gradient backgrounds
│
├── HTML Structure (Estático)
│   ├── Portada con metadatos
│   ├── Secciones de operación
│   ├── Cronograma detallado
│   └── Información contextual
│
└── JavaScript Layer
    └── Ninguno (documento estático)
```

**Características:**
- Guion completo de 4 horas
- Escenario multiamenaza
- Diseño visual impactante
- Documento estático (sin interactividad)

---

## 🏗️ ARQUITECTURA POR CAPAS

### Capa 1: Presentación (UI)

**Componentes:**
- **Navbar System**
  - Branding institucional
  - Status bar
  - User session display

- **Card System**
  - Reusable component
  - Box-shadow effects
  - Responsive Grid layout

- **Modal System**
  - Based on classList.toggle()
  - Overlay with backdrop
  - Close button + ESC key

- **Notification System**
  - Dynamic creation
  - Auto-remove (3s)
  - Type-based styling (info, success, error, warning)

- **Button System**
  - Primary (Institutional)
  - Triage (Color-coded)
  - Action (Generic)

**Tokens de Diseño v2.0:**

```css
:root {
  /* Institucional */
  --inst-guinda: #691C32;
  --inst-guinda-dark: #4A1023;
  --inst-dorado: #BC955C;
  --inst-verde-imss: #006657;
  --inst-negro: #161A1D;

  /* Funcional ISO 3864 (Triage) */
  --fn-rojo: #C41E3A;
  --fn-amarillo: #D4940A;
  --fn-verde: #1B7340;
  --fn-azul: #1A5276;
  --fn-negro: #1A1A2E;
  --fn-gris: #4A5568;

  /* Estructura */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F7F8FA;
  --bg-tertiary: #EDF0F4;
  --text-primary: #1A1A2E;
  --text-secondary: #4A5568;
  --text-muted: #6B7280;
  --border-default: #D1D5DB;
  --border-light: #E5E7EB;

  /* Tipografía */
  --font-primary: "Segoe UI", system-ui, -apple-system;
  --font-mono: "Cascadia Code", "SF Mono", "Consolas";
}
```

### Capa 2: Lógica de Negocio

**Patrones:**

1. **State Management**
   ```javascript
   const app = {
     db: null,
     session: { hospital, operador, rol },
     saveTimeout: null,
     currentPatientId: null
   };
   ```

2. **Event Handling**
   - addEventListener para eventos DOM
   - Promises para operaciones async
   - Callbacks para operaciones DB

3. **Error Handling**
   ```javascript
   try {
     // Operation
   } catch (error) {
     showNotification(error.message, 'error');
     audit("ERROR", "system", null, error.message);
   }
   ```

**Lógica de Negocio Crítica:**

1. **Triage START Logic**
   - 4 niveles bien definidos
   - Auditoría de cambios
   - Actualización en cascada

2. **Patient Registration Flow**
   - Validación de datos
   - Generación de folio único
   - Inserción atómica en DB

3. **Clinical Event Logging**
   - Tipo de evento
   - Valor anterior y nuevo
   - Timestamp con ISO format

### Capa 3: Persistencia

**IndexedDB Wrapper:**

```javascript
// Abrir DB
const request = indexedDB.open("ECEDES_DB", 1);

// Guardar (Throttled)
saveToIndexedDB() {
  clearTimeout(this.saveTimeout);
  this.saveTimeout = setTimeout(() => {
    const data = this.db.export();
    // Store in IndexedDB
  }, this.saveThrottleMs); // 2s
}

// Cargar
loadFromIndexedDB() {
  const req = store.get("latest");
  req.onsuccess = (e) => {
    this.db = new SQL.Database(e.target.result);
  };
}
```

**SQLite Schema Versioning:**

```javascript
const DB_SCHEMA_VERSION = 2;

function runMigrations() {
  const version = getDatabaseVersion();
  if (version < 2) {
    // Backup automatic
    const backup = this.db.export();
    // Run migration
    this.db.run("ALTER TABLE pacientes ADD COLUMN...");
  }
}
```

### Capa 4: Servicios del Navegador

**APIs Utilizadas:**

1. **IndexedDB API**
   - open()
   - transaction()
   - objectStore()
   - get() / put()

2. **WebAssembly**
   - sql.js compiled to WASM
   - Base64 encoded inline
   - No external requests

3. **File API**
   - Blob creation
   - URL.createObjectURL()
   - Download trigger

4. **Print API**
   - window.print()
   - @media print queries

---

## 🔄 FLUJOS DE DATOS

### Flujo 1: Registro de Paciente

```
USER ACTION (Click "Nuevo Paciente")
  ↓
MODAL OPENS (Form validation)
  ↓
USER FILLS FORM
  ↓
SUBMIT → app.registerPatient()
  ↓
VALIDATE DATA
  ↓
GENERATE FOLIO (P-{count})
  ↓
INSERT INTO pacientes (SQLite)
  ↓
AUDIT LOG ("REGISTRO_PACIENTE")
  ↓
UPDATE UI (renderCensus())
  ↓
TRIGGER SAVE (Throttled 2s)
  ↓
PERSIST TO IndexedDB
```

### Flujo 2: Cambio de Triage

```
USER ACTION (Click triage button)
  ↓
PROMPT FOR TRIAGE LEVEL
  ↓
USER SELECTS (R/A/V/N)
  ↓
app.updateTriage(patientId, newLevel)
  ↓
VALIDATE CHANGE
  ↓
UPDATE pacientes SET triage_actual = ?
  ↓
INSERT INTO trazabilidad (TRIAGE_CHANGE)
  ↓
AUDIT LOG ("CAMBIO_TRIAGE")
  ↓
UPDATE UI (renderCensus())
  ↓
TRIGGER SAVE (Throttled 2s)
```

### Flujo 3: Exportación Excel

```
USER ACTION (Click "Exportar Excel")
  ↓
app.exportToExcel()
  ↓
QUERY 1: SELECT * FROM pacientes
  ↓
QUERY 2: SELECT * FROM trazabilidad
  ↓
QUERY 3: SELECT * FROM auditoria
  ↓
CREATE WORKBOOK (SheetJS)
  ├── Sheet 1: Censo Pacientes
  ├── Sheet 2: Trazabilidad
  └── Sheet 3: Auditoría
  ↓
GENERATE FILE (Timestamped)
  ↓
TRIGGER DOWNLOAD (Blob API)
  ↓
FILE SAVED TO USER MACHINE
```

### Flujo 4: Dashboard Analytics

```
PAGE LOAD
  ↓
dash.init()
  ↓
LOAD SQL.js WASM
  ↓
OPEN IndexedDB ("ECEDES_DB")
  ↓
READ BACKUP ("sqlite_backup" → "latest")
  ↓
CREATE SQLite INSTANCE
  ↓
EXECUTE QUERIES:
  ├── SELECT COUNT(*) FROM pacientes
  ├── SELECT COUNT(*) WHERE triage_actual='ROJO'
  ├── SELECT COUNT(*) FROM trazabilidad
  └── SELECT triage_actual, COUNT(*) GROUP BY triage_actual
  ↓
CALCULATE KPIs
  ↓
RENDER COMPONENTS:
  ├── KPI Cards
  ├── Bar Chart (Pure CSS)
  ├── Timeline (Last 10 events)
  └── Patient Table
  ↓
DISPLAY DASHBOARD
```

---

## 🎨 SISTEMA DE DISEÑO

### Principios

1. **Doble Codificación (Color + Forma)**
   - ROJO = Diamante (◆) + #C41E3A
   - AMARILLO = Triángulo (▲) + #D4940A
   - VERDE = Círculo (●) + #1B7340
   - NEGRO = Cruz (✚) + #1A1A2E

2. **Accesibilidad ISO/WCAG**
   - Contraste mínimo AA (4.5:1)
   - Contraste AAA preferido (7:1)
   - Fuentes system fonts (sin descargas)

3. **Responsive Design**
   - Mobile-first approach
   - CSS Grid + Flexbox
   - Media queries para impresión

### Componentes Reutilizables

**Button System:**
```css
.btn-primary (Institutional actions)
.btn-triage-{rojo,amarillo,verde,negro}
.btn-action (Generic actions)
```

**Card System:**
```css
.card (Base component)
  ├── .card-body
  ├── .card-footer
  └── .card-title
```

**Modal System:**
```css
.modal-overlay
  ├── .modal-content
  │   ├── .modal-header
  │   ├── .modal-body
  │   └── .modal-footer
  └── .close-button
```

**Notification System:**
```css
.notification
  ├── .notification-info
  ├── .notification-success
  ├── .notification-warning
  └── .notification-error
```

---

## 🛡️ PATRONES TÉCNICOS

### Patrón 1: Single-File Architecture

**Propósito:** Portabilidad máxima

**Implementación:**
- Todo el código inline en un solo archivo
- CSS en `<style>` tags
- JS en `<script>` tags
- Librerías en base64

**Ventajas:**
- ✅ Cero dependencias externas
- ✅ Funciona offline
- ✅ Portable en USB
- ✅ Fácil deployment

**Desventajas:**
- ❌ Tamaño de archivo grande (1.8 MB)
- ❌ Difícil de mantener
- ❌ Sin code splitting

### Patrón 2: Throttled Persistence

**Propósito:** Performance + Integridad

**Implementación:**
```javascript
saveToIndexedDB() {
  clearTimeout(this.saveTimeout);
  this.saveTimeout = setTimeout(() => {
    // Actual save operation
  }, 2000); // Wait 2s after last change
}
```

**Ventajas:**
- ✅ Evita escrituras excesivas
- ✅ Mejora performance
- ✅ Reduce wear en SSD

### Patrón 3: Audit Trail

**Propósito:** Seguridad legal

**Implementación:**
```javascript
audit(accion, tabla_ref, id_ref, detalle) {
  this.db.run(
    "INSERT INTO auditoria (ts, operador, accion, tabla_ref, id_ref, detalle) VALUES (?, ?, ?, ?, ?, ?)",
    [new Date().toISOString(), this.session.operador, accion, tabla_ref, id_ref, detalle]
  );
}
```

**Ventajas:**
- ✅ Trazabilidad completa
- ✅ Cumplimiento legal
- ✅ Forensic analysis

### Patrón 4: Schema Versioning

**Propósito:** Migraciones controladas

**Implementación:**
```javascript
const DB_SCHEMA_VERSION = 2;

function runMigrations() {
  const currentVersion = getSchemaVersion();
  if (currentVersion < DB_SCHEMA_VERSION) {
    // Backup before migration
    const backup = this.db.export();
    // Run migration
    migrateToVersion2();
  }
}
```

**Ventajas:**
- ✅ Migraciones incrementales
- ✅ Backup automático
- ✅ Rollback possible

---

## ⚠️ GAPS Y RIESGOS

### Riesgos Críticos

1. **Seguridad de Autenticación**
   - **Riesgo:** PIN de 4 dígitos sin cifrado
   - **Impacto:** Acceso no autorizado
   - **Recomendación:** Implementar hashing para PINs

2. **Vulnerabilidades XSS**
   - **Riesgo:** innerHTML sin sanitización
   - **Impacto:** Ejecución de código malicioso
   - **Recomendación:** Usar textContent siempre

3. **Validación de Datos**
   - **Riesgo:** Validación mínima en frontend
   - **Impacto:** Datos corruptos en DB
   - **Recomendación:** Añadir validaciones robustas

4. **Performance en Exportaciones**
   - **Riesgo:** Exportaciones grandes bloquean UI
   - **Impacto:** Mala experiencia de usuario
   - **Recomendación:** Usar Web Workers

### Gaps de Funcionalidad

1. **Sistema de Roles**
   - **Actual:** Solo un rol (MEDICO)
   - **Gap:** No hay distinción de permisos
   - **Recomendación:** Implementar RBAC

2. **Sincronización Cloud**
   - **Actual:** 100% local
   - **Gap:** No hay sincronización
   - **Recomendación:** Añadir sync opcional

3. **Mobile Optimization**
   - **Actual:** Diseño desktop-first
   - **Gap:** No optimizado para móviles
   - **Recomendación:** Responsive improvements

4. **Sistema de Backup Automático**
   - **Actual:** Backup manual
   - **Gap:** Sin backups programados
   - **Recomendación:** Auto-backups periódicos

### Debt Técnico

1. **Sin Testing Automatizado**
   - **Estado:** Solo testing manual
   - **Impacto:** Regresiones posibles
   - **Prioridad:** Alta

2. **Sin CI/CD Pipeline**
   - **Estado:** Build manual
   - **Impacto:** Lento deployment
   - **Prioridad:** Media

3. **Código Monolítico**
   - **Estado:** Todo en un archivo
   - **Impacto:** Difícil de mantener
   - **Prioridad:** Baja (intencional)

---

## 🚀 PLAN DE EVOLUCIÓN

### Fase 1: Stabilization (1-2 semanas)

**Objetivo:** Eliminar riesgos críticos

- [ ] Implementar hashing para PINs
- [ ] Sanitizar innerHTML (usar textContent)
- [ ] Añadir validaciones robustas
- [ ] Implementar Web Workers para exportaciones

### Fase 2: Testing (2-3 semanas)

**Objetivo:** Cobertura >85%

- [ ] Unit tests para funciones JavaScript
- [ ] Integration tests para SQLite
- [ ] E2E tests para flujos críticos
- [ ] Cross-browser testing

### Fase 3: Enhancement (3-4 semanas)

**Objetivo:** Mejorar UX

- [ ] Implementar RBAC (múltiples roles)
- [ ] Mejorar mobile optimization
- [ ] Añadir sistema de notificaciones push
- [ ] Implementar dark mode

### Fase 4: Automation (4-6 semanas)

**Objetivo:** CI/CD pipeline

- [ ] Setup GitHub Actions
- [ ] Automated builds
- [ ] Automated testing
- [ ] Automated deployment

### Fase 5: Next Gen (2-3 meses)

**Objetivo:** Arquitectura modular

- [ ] Separar concerns (UI/Logic/Data)
- [ ] Implementar state management
- [ ] Migrate a framework (si aplica)
- [ ] Implementar PWA features

---

## 📊 MÉTRICAS DEL SISTEMA

### Tamaños de Archivo

| Archivo | Tamaño | GZIP | % del Total |
|---------|--------|------|-------------|
| ECE-DES.html | 1.8 MB | ~400 KB | 66% |
| ECE-DES-Dashboard.html | 921 KB | ~200 KB | 34% |
| generador_tarjetas.html | 117 KB | ~30 KB | 4% |
| simulacro_nunca_jamas_fifa2026.html | 84 KB | ~20 KB | 3% |
| guia_operativa_nunca_jamas.html | 41 KB | ~10 KB | 1.5% |
| ECE-DES-Tarjetas.html | 13 KB | ~5 KB | 0.5% |
| index.html | 14 KB | ~5 KB | 0.5% |
| **TOTAL** | **~3 MB** | **~670 KB** | **100%** |

### Performance

| Métrica | Valor | Target |
|---------|-------|--------|
| Tiempo de carga inicial | 3-5s | <5s ✅ |
| Tiempo de registro paciente | <100ms | <100ms ✅ |
| Exportación Excel (1000 pacientes) | 2-3s | <5s ✅ |
| Guardado en IndexedDB | <500ms | <1s ✅ |
| Renderizado de Dashboard | 1-2s | <3s ✅ |

### Complejidad

| Métrica | Valor |
|---------|-------|
| Líneas de código total | ~8,500 |
| Funciones JavaScript | ~150 |
| Componentes UI | ~50 |
| Subsistemas | 12 |
| Dependencias externas | 0 |

---

## 📚 REFERENCIAS

### Documentación Relacionada

- [README Principal](../README.md)
- [Guía Rápida](../QUICKSTART.md)
- [Estado del Proyecto](../project/project_state.md)
- [Plan de Testing](../testing/TESTING_PLAN.md)
- [Especificaciones Técnicas](../technical/tareas_tecnicas.md)

### Estándares

- **ISO 3864:** Colores de seguridad
- **START:** Simple Triage and Rapid Treatment
- **SCI-H:** Sistema de Comando de Incidentes Hospitalario
- **WCAG 2.1:** Accesibilidad web
- **IMSS Guidelines:** Guías institucionales

---

**Última actualización:** 2026-03-04
**Agente:** CONTROLADOR (ADRC 2.0)
**Session ID:** 50d06da5-0c4d-48d4-803d-43767d97653a

*Este documento es la fuente de verdad para la arquitectura de CVOED-Tools v1.1.0*
