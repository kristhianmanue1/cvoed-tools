# 📚 DOCUMENTACIÓN COMPLETA DE LAS 7 HERRAMIENTAS CVOED-TOOLS

**Fecha:** 2026-03-04
**Versión:** 1.1.0
**Autores:** Kristhian Manuel Jimenez & Dra. Carla Abril Perez
**Licencia:** Apache License 2.0

---

## 🎯 INTRODUCCIÓN

Este documento proporciona una descripción técnica detallada de cada una de las 7 aplicaciones que conforman CVOED-Tools, incluyendo estructura, funcionalidades, stack técnico y uso específico.

---

## 📋 ÍNDICE DE HERRAMIENTAS

1. [index.html](#1-indexhtml-portal-principal) - Portal Principal
2. [ECE-DES.html](#2-ece-deshtml-expediente-clínico-electrónico) - Sistema Principal
3. [ECE-DES-Dashboard.html](#3-ece-des-dashboardhtml-tablero-de-control) - Dashboard Analytics
4. [ECE-DES-Tarjetas.html](#4-ece-des-tarjetashtml-impresión-de-tarjetas) - Motor de Impresión START
5. [generador_tarjetas.html](#5-generador-tarjetashtml-generador-sci-h) - Generador de Tarjetas de Acción
6. [guia_operativa_nunca_jamas.html](#6-guia-operativa-nunca-jamashtml-manual-digital) - Guía Operativa
7. [simulacro_nunca_jamas_fifa2026.html](#7-simulacro-nunca-jamas-fifa2026html-plataforma-de-simulacro) - Evaluación de Simulacros

---

## 1. INDEX.HTML - PORTAL PRINCIPAL

### 🎯 Propósito
Punto de entrada unificado a las 7 herramientas CVOED-Tools. Proporciona navegación organizada por categorías funcionales.

### 📐 Especificaciones Técnicas

| Atributo | Valor |
|-----------|-------|
| **Ubicación** | `/dist/index.html` |
| **Tamaño** | 4.0 KB |
| **Tipo** | HTML5 estático + CSS3 + JavaScript |
| **Dependencias** | Ninguna (100% self-contained) |
| **Responsive** | Sí (móvil + desktop) |

### 🏗️ Estructura

```
index.html
├── Header
│   ├── Título: "CVOED-Tools"
│   ├── Subtítulo: "Suite Portátil de Herramientas Hospitalarias"
│   ├── Contexto: "Copa Mundial FIFA 2026 • IMSS"
│   └── Indicador: "100% Offline • Portable en USB"
├── Sección 1: Módulo ECE-DES (3 apps)
│   ├── ECE-DES (badge: PRINCIPAL)
│   ├── Dashboard de Control
│   └── Impresión de Tarjetas START
├── Sección 2: Herramientas Complementarias (3 apps)
│   ├── Generador de Tarjetas SCI-H
│   ├── Guía Operativa "Nunca Jamás"
│   └── Plataforma de Simulacro (badge: NUEVO)
└── Footer
    ├── Versión: v1.1.0
    ├── Licencia: Apache 2.0
    └── Autores: Kristhian Manuel Jimenez & Dra. Carla Abril Perez
```

### 🎨 Características de UI

- **Diseño:** Gradiente institucional IMSS (#691C32, #4A1023, #006657)
- **Grid:** CSS Grid auto-fit (320px minimum)
- **Cards:** 7 tarjetas interactivas con hover effects
- **Badges:** PRINCIPAL, NUEVO para destacar apps clave
- **Iconografía:** Emojis para identificación visual rápida

### 🔗 Links de Navegación

```html
<!-- Módulo ECE-DES -->
<a href="ECE-DES.html">🏥 ECE-DES</a>
<a href="ECE-DES-Dashboard.html">📊 Dashboard</a>
<a href="ECE-DES-Tarjetas.html">🖨️ Tarjetas START</a>

<!-- Herramientas Complementarias -->
<a href="generador_tarjetas.html">🎩 Generador SCI-H</a>
<a href="guia_operativa_nunca_jamas.html">📖 Guía Operativa</a>
<a href="simulacro_nunca_jamas_fifa2026.html">🎭 Simulacro FIFA 2026</a>
```

### 📊 Uso Recomendado

1. **Usuario final** abrir `index.html` (root) → redirección automática
2. Seleccionar aplicación deseada del portal
3. Aplicación se abre en nueva pestaña

---

## 2. ECE-DES.HTML - EXPEDIENTE CLÍNICO ELECTRÓNICO

### 🎯 Propósito
Sistema principal de registro de pacientes durante Saldo Masivo de Víctimas (SMV). Implementa protocolo START de triage y gestión de expedientes clínicos.

### 📐 Especificaciones Técnicas

| Atributo | Valor |
|-----------|-------|
| **Ubicación** | `/dist/ECE-DES.html` |
| **Tamaño** | 1.8 MB (desde src/ece-des/) |
| **Tipo** | HTML5 + JavaScript ES2022 |
| **Database** | SQLite WASM (sql.js 1.2MB inline) |
| **Persistencia** | IndexedDB (sin límite de 5MB localStorage) |
| **Exportación** | SheetJS (XLSX 400KB inline) |

### 🏗️ Arquitectura Interna

```
ECE-DES.html
├── CSS (Tokens v2.0 inline)
│   ├── Colores institucionales IMSS
│   ├── Tokens funcionales (triage)
│   └── Responsive breakpoints
├── JavaScript Modules
│   ├── CONFIG (environment-aware)
│   ├── CRYPTO (PIN hashing con bcrypt)
│   ├── SECURITY (XSS prevention)
│   ├── AUTH (login de usuario)
│   ├── PATIENTS (registro de pacientes)
│   ├── TRIAGE (sistema START)
│   ├── EXPEDIENTE (historial clínico)
│   ├── DATABASE (SQLite WASM wrapper)
│   ├── PERSISTENCE (IndexedDB)
│   ├── EXPORT (Excel generation)
│   └── UI (renderizado de componentes)
└── Web Workers
    └── export-worker.js (background thread)
```

### 📋 Funcionalidades Principales

#### 1. Autenticación
```javascript
// Login con PIN hasheado (bcrypt)
- Hospital: texto libre
- Usuario: nombre del personal
- PIN: 4 dígitos (hash local con bcrypt cost 10)
- Session timeout: 1 hora
```

#### 2. Registro de Pacientes
```javascript
// Formulario de registro express
- Folio local: P-{count} automático
- Nombre: texto (opcional, "NN" si vacío)
- Triage START:
  * ROJO (◆) - Crítico - Atención inmediata
  * AMARILLO (▲) - Urgente - Minutos
  * VERDE (●) - Leve - Puede esperar
  * NEGRO (✚) - Sin vida - No interviene
- Edad: número
- Sexo: M/F
- Ubicación: libre texto
```

#### 3. Base de Datos SQLite
```sql
-- Tablas principales
CREATE TABLE pacientes (
    id INTEGER PRIMARY KEY,
    folio_local TEXT UNIQUE,
    nombre TEXT,
    triage_actual TEXT, -- ROJO/AMARILLO/VERDE/NEGRO
    edad INTEGER,
    sexo TEXT,
    ubicacion TEXT,
    ts_ingreso TEXT, -- timestamp ISO 8601
    ts_actualizacion TEXT
);

CREATE TABLE trazabilidad (
    id INTEGER PRIMARY KEY,
    id_paciente INTEGER,
    tipo_evento TEXT,
    descripcion TEXT,
    responsable TEXT,
    ts_evento TEXT,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id)
);

CREATE TABLE operadores (
    id INTEGER PRIMARY KEY,
    hospital TEXT,
    nombre TEXT,
    pin_hash TEXT, -- bcrypt hash
    ts_login TEXT
);
```

#### 4. Persistencia IndexedDB
```javascript
// Base de datos del navegador
const DB_NAME = "ECEDES_DB";
const STORES = ["pacientes_backup", "settings"];

// Persistencia automática cada 30 segundos
function throttlePersistence() {
  // Guarda Uint8Array de SQLite exportado en IndexedDB
  // Evita límites de localStorage (5MB)
}
```

#### 5. Exportación a Excel
```javascript
// Genera archivo .xlsx con:
- Hoja 1: Métricas de resumen
- Hoja 2: Todos los pacientes
- Hoja 3: Historial de trazabilidad
- Hoja 4: Log de auditoría
```

### 🔄 Flujo de Trabajo

1. **Inicio** → Login (hospital, usuario, PIN)
2. **Registro** → Nuevo paciente (triage START)
3. **Censo** → Contadores por nivel en tiempo real
4. **Expediente** → Ver detalle de paciente, agregar eventos
5. **Exportar** → Excel con todos los datos
6. **Backup** → Copia de seguridad SQLite

### 🔒 Seguridad

- ✅ **PINs hasheados** con bcrypt (cost 10)
- ✅ **XSS prevention** (textContent vs innerHTML)
- ✅ **Input validation** (sanitización de entradas)
- ✅ **Session timeout** (1 hora de inactividad)
- ✅ **100% offline** (datos en IndexedDB local)

---

## 3. ECE-DES-DASHBOARD.HTML - DASHBOARD DE CONTROL

### 🎯 Propósito
Tablero de monitoreo y reportes directivos para Puesto de Mando. Lee la base de datos de ECE-DES sin afectar rendimiento de capturistas.

### 📐 Especificaciones Técnicas

| Atributo | Valor |
|-----------|-------|
| **Ubicación** | `/dist/ECE-DES-Dashboard.html` |
| **Tamaño** | 920 KB |
| **Tipo** | HTML5 + JavaScript ES2022 |
| **Database** | SQLite WASM (lectura) |
| **Gráficas** | CSS puro (sin dependencias) |

### 🏗️ Arquitectura Interna

```
ECE-DES-Dashboard.html
├── CSS (Tokens v2.0 inline)
├── JavaScript Modules
│   ├── DASHBOARD (analytics)
│   ├── CONFIG (environment)
│   ├── DATABASE (SQLite reader)
│   ├── CHARTS (CSS bar charts)
│   ├── PATIENTS (list viewer)
│   └── REAL-TIME (updates cada 30s)
└── Componentes Visuales
    ├── Stat Cards (totales)
    ├── Bar Chart (distribución triage)
    ├── Timeline List (últimos eventos)
    └── Patient Table (solo lectura)
```

### 📋 Funcionalidades Principales

#### 1. Tarjetas de Métricas
```javascript
// Métricas en tiempo real
{
  total_pacientes: 0,
  criticos_rojo: 0,
  urgentes_amarillo: 0,
  leves_verde: 0,
  acciones_medicas: 0
}
```

#### 2. Gráfica de Barras CSS
```html
<!-- Gráfico de distribución START puro CSS -->
<div class="css-chart">
  <div class="css-bar red" style="height: 60%;">0</div>
  <div class="css-bar yellow" style="height: 25%;">0</div>
  <div class="css-bar green" style="height: 10%;">0</div>
  <div class="css-bar black" style="height: 5%;">0</div>
</div>
```

#### 3. Lista de Pacientes
```javascript
// Tabla solo lectura (no editable)
- ID Interno
- Folio START
- Triage Actual
- Edad
- Sexo
- Hora Ingreso
- Última Modificación
```

#### 4. Timeline de Eventos
```javascript
// Últimos 10 eventos registrados
[
  { paciente: "P-001", accion: "Registro ROJO", hora: "10:30" },
  { paciente: "P-002", accion: "Cambio a VERDE", hora: "10:31" },
  ...
]
```

### 🔄 Flujo de Trabajo

1. **Apertura** → Lee DB de ECE-DES desde IndexedDB
2. **Carga** → Calcula métricas de resumen
3. **Actualización** → Refresh cada 30 segundos
4. **Visualización** → Muestra:
   - Totales por triage
   - Distribución visual
   - Lista de pacientes
   - Timeline de acciones
5. **Exportación** → Reportes listos para imprimir

### 🎨 Características de UI

- **Auto-refresh:** Actualización automática sin recargar página
- **Responsive:** Adaptado para pantallas de monitoreo
- **Read-only:** No permite edición (solo visualización)
- **Performance:** No afecta rendimiento de ECE-DES

---

## 4. ECE-DES-TARJETAS.HTML - IMPRESIÓN DE TARJETAS START

### 🎯 Propósito
Motor de impresión de tarjetas/etiquetas START para identificación de pacientes. Genera plantilla A4/Carta con 4 tarjetas recortables en cascada.

### 📐 Especificaciones Técnicas

| Atributo | Valor |
|-----------|-------|
| **Ubicación** | `/dist/ECE-DES-Tarjetas.html` |
| **Tamaño** | 13 KB |
| **Tipo** | HTML5 + CSS3 + JavaScript |
| **Formato** | A4 o Carta (4 tarjetas por hoja) |
| **Impresión** | CSS @media print |

### 🏗️ Estructura de Tarjetas

```
Hoja A4/Carta (horizontal)
┌─────────────────────────────────────┐
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │
│ │Tarj.1│ │Tarj.2│ │Tarj.3│ │Tarj.4│          │
│ └─────┘ └─────┘ └─────┘ └─────┘          │
│  (corte)  (corte)  (corte)  (corte)        │
└─────────────────────────────────────┘
```

### 📋 Componentes de Tarjeta

#### Cara Frontal (Paciente)
```html
<div class="tarjeta-start-front">
  <!-- Código de barras -->
  <div class="barcode">▲-P-0123</div>

  <!-- Triage (gran símbolo) -->
  <div class="triage-symbol">◆</div> <!-- ROJO -->

  <!-- Datos del paciente -->
  <div class="patient-name">JUÁREZ JUAN</div>
  <div class="patient-age">45 AÑOS</div>
  <div class="patient-location">URGENCIAS</div>
</div>
```

#### Cara Trasera (Médico)
```html
<div class="tarjeta-start-back">
  <!-- Instrucciones START -->
  <ul>
    <li>1. Reevaluar cada 5 min</li>
    <li>2. ¿Respira? SÍ → VERDE</li>
    <li>3. ¿Pulso? SÍ → AMARILLO</li>
    <li>4. ¿Camina? NO → ROJO</li>
  </ul>
</div>
```

### 🎨 Diseño START

| Color | Forma | Significado |
|-------|-------|-------------|
| 🔴 ROJO | ◆ Diamante | Crítico - Atención inmediata |
| 🟡 AMARILLO | ▲ Triángulo | Urgente - Minutos |
| 🟢 VERDE | ● Círculo | Leve - Puede esperar |
| ⚫ NEGRO | ✚ Cruz | Sin vida - No interviene |

### 🖨️ Proceso de Impresión

1. **Seleccionar** → Rango de folios (ej: P-001 a P-004)
2. **Generar** → Vista previa de tarjetas
3. **Imprimir** → Ctrl+P o Cmd+P
4. **Configuración**:
   - Orientación: Horizontal
   - Papel: A4 o Carta
   - Escala: 100%
   - Márgenes: Ninguno (full page)

### 📏 Dimensiones de Tarjeta

```
Ancho: 10.5 cm (4.13 pulgadas)
Alto: 7.5 cm (2.95 pulgadas)
Diseño: Horizontal (2 filas x 2 columnas)
Corte: Líneas de guía para recortar
```

---

## 5. GENERADOR_TARJETAS.HTML - GENERADOR SCI-H

### 🎯 Propósito
Generador de Tarjetas de Acción del Sistema de Comando de Incidentes Hospitalario (SCI-H). Crea chalecos y funciones de comando para activación de alertas.

### 📐 Especificaciones Técnicas

| Atributo | Valor |
|-----------|-------|
| **Ubicación** | `/dist/generador_tarjetas.html` |
| **Tamaño** | 48 KB |
| **Tipo** | HTML5 + CSS3 + JavaScript |
| **Función** | Generación de tarjetas imprimibles |
| **Output** | PDF/HTML para impresión |

### 🏗️ Roles SCI-H Disponibles

```javascript
const ROLES_SCIH = {
  COMANDANTE: {
    nombre: "Comandante",
    color: "#C41E3A",
    responsabilidades: [
      "Activar SCI-H",
      "Delegar funciones",
      "Tomar decisiones estratégicas"
    ]
  },
  OPERACIONES: {
    nombre: "Jefe de Operaciones",
    color: "#1A5276",
    responsabilidades: [
      "Coordinar respuesta táctica",
      "Asignar recursos",
      "Supervisar ejecución"
    ]
  },
  LOGISTICA: {
    nombre: "Jefe de Logística",
    color: "#D4940A",
    responsabilidades: [
      "Gestionar recursos",
      "Controlar inventario",
      "Proveer suministros"
    ]
  },
  PLANIFICACION: {
    nombre: "Jefe de Planificación",
    color: "#1B7340",
    responsabilidades: [
      "Análisis de riesgos",
      "Elaborar planes",
      "Coordinar con planes externos"
    ]
  }
};
```

### 📋 Secciones de Tarjeta

#### Cara Frontal
```html
<div class="tarjeta-scih-front">
  <!-- Header Institucional -->
  <div class="header-imss">
    <h1>IMSS</h1>
    <h2>Sistema de Comando Hospitalario</h2>
  </div>

  <!-- Identificación -->
  <div class="role-info">
    <span class="rol-badge">COMANDANTE</span>
    <h3>Jefe de Incidentes</h3>
  </div>

  <!-- Contexto -->
  <div class="context-info">
    <p><strong>Hospital:</strong> [Usuario ingresa]</p>
    <p><strong>Fecha:</strong> [Usuario ingresa]</p>
    <p><strong>Hora Activación:</strong> [Usuario ingresa]</p>
  </div>

  <!-- Código QR -->
  <div class="qr-code">
    [Genera código QR con datos del rol]
  </div>
</div>
```

#### Cara Trasera (Acciones)
```html
<div class="tarjeta-scih-back">
  <h3>Acciones Inmediatas</h3>
  <ul class="action-list">
    <li>1. Activar protocolo SCI-H</li>
    <li>2. Convocar a Jefes Seccionales</li>
    <li>3. Abrir Puesto de Mando</li>
    <li>4. Iniciar triage masivo</li>
  </ul>

  <h3>Checklist de Verificación</h3>
  <ul class="checklist">
    <li>☐ Área de comando identificada</li>
    <li>☐ Canales de comunicación activos</li>
    <li>☐ Roles asignados</li>
    <li>☐ Protocolo activado</li>
  </ul>
</div>
```

### 🎛️ Funcionalidades Interactivas

#### 1. Generador de Tarjetas
```javascript
// Formulario de personalización
function generarTarjeta() {
  // Inputs del usuario:
  - Hospital
  - Fecha
  - Rol SCI-H (4 opciones)
  - Nombre del responsable

  // Output:
  - Tarjeta frontal (datos + diseño)
  - Tarjeta trasera (acciones + checklist)
  - Código QR con datos codificados
  - Vista previa en pantalla
}
```

#### 2. Impresión
```javascript
// Configuración de impresión
const printConfig = {
  orientacion: 'vertical',
  formato: 'A4',
  margenes: '0',
  escala: '100%',
  color: true,
  duplex: false
};
```

#### 3. Exportación
```javascript
// Opciones de exportación
- PDF: Descargar como PDF completo
- HTML: Guardar como HTML standalone
- Imagen: PNG/JPG de vista previa
```

### 🔢 Generación de Código QR

```javascript
// Datos codificados en QR
const qrData = {
  hospital: "Hospital General",
  rol: "COMANDANTE",
  responsable: "Dr. Martínez",
  fecha: "2026-03-04",
  activacion: "14:30"
};

// Generar QR con librería (qrcode.js)
// QR contiene JSON codificado para escaneo rápido
```

---

## 6. GUÍA_OPERATIVA_NUNCA_JAMAS.HTML - MANUAL DIGITAL

### 🎯 Propósito
Manual digital con protocolos operativos del hospital para emergencias y desastres. Versión web amigable de guías PDF del IMSS.

### 📐 Especificaciones Técnicas

| Atributo | Valor |
|-----------|-------|
| **Ubicación** | `/dist/guia_operativa_nunca_jamas.html` |
| **Tamaño** | 41 KB |
| **Tipo** | HTML5 + CSS3 + JavaScript |
| **Formato** | Single-page application |
| **Navegación** | Table of contents + secciones |

### 🏗️ Estructura del Manual

```
guia_operativa_nunca_jamas.html
├── Header
│   ├── Título: "Guía Operativa 'Nunca Jamás'"
│   ├── Contexto: SMV-H (Saldo Masivo de Víctimas)
│   └── Versión: Marzo 2026
├── Navigation
│   ├── Table of Contents (ancla)
│   ├── Secciones: 6 principales
│   └── Búsqueda en texto
├── Sección 1: Introducción
│   ├── Propósito del manual
│   ├── Contexto FIFA 2026
│   └── Importancia de preparación
├── Sección 2: Protocolo SMV-H
│   ├── Definición de SMV-H
│   ├── Criterios de activación
│   └── Niveles de respuesta
├── Sección 3: Organización Hospitalaria
│   ├── Estructura de comando
│   ├── Roles y responsabilidades
│   └── Canales de comunicación
├── Sección 4: Procedimientos Tácticos
│   ├── Triage prehospitalario
│   ├── Triage hospitalario
│   ├── Flujo de pacientes
│   └── Criterios de traslado
├── Sección 5: Recursos y Checklists
│   ├── Lista de verificación
│   ├── Materiales necesarios
│   └── Contactos clave
└── Sección 6: Anexos
    ├── Formularios
    ├── Procedimientos específicos
    └── Glosario de términos
```

### 📋 Contenido Principal

#### Sección 2: Protocolo SMV-H
```markdown
## 2. Protocolo SMV-H

### 2.1 Definición
El Saldo Masivo de Víctimas (SMV-H) es una situación en la que el número de pacientes que requieren atención médica excede la capacidad instalada del hospital.

### 2.2 Criterios de Activación
- More than 20 patients in 1 hour
- Incidente with multiple victims
- Disaster declared officially
- Hospital commander activates SMV-H protocol

### 2.3 Niveles de Respuesta
**Nivel 1:** Local (hospital)
- Recursos internos
- Protocolos básicos

**Nivel 2:** Regional (jurisdicción)
- Apoyo de otros hospitales
- Coordinación inter-institucional

**Nivel 3:** Nacional
- Apoyo federal
- Recursos nacionales de emergencia
```

#### Sección 3: Organización Hospitalaria
```markdown
## 3. Organización Hospitalaria SCI-H

### 3.1 Estructura de Comando
```
Comandante de Incidentes
├── Jefe de Operaciones
│   ├── Sección Triage
│   ├── Sección Tratamiento
│   └── Sección Logística
├── Jefe de Planificación
├── Jefe de Logística
├── Jefe de Información Pública
└── Jefe de Seguridad
```

### 3.2 Roles Específicos
- **Comandante:** Responsable final
- **Jefe de Operaciones:** Ejecución táctica
- **Jefe de Planificación:** Análisis y estrategia
- **Jefe de Logística:** Recursos y suministros
- **Jefe de Información:** Comunicaciones
```

### 🔍 Características de UI

- **Table of Contents:** Navegación por secciones
- **Search:** Búsqueda en tiempo real
- **Responsive:** Optimizado para tablets
- **Print-friendly:** @media print para PDF
- **Offline:** Funciona sin internet

---

## 7. SIMULACRO_NUNCA_JAMAS_FIFA2026.HTML - PLATAFORMA DE SIMULACRO

### 🎯 Propósito
Sistema de evaluación y monitoreo para ejercicios de simulacro FIFA 2026. Gestiona checklists, métricas y evaluación de ejercicios de prevención masiva.

### 📐 Especificaciones Técnicas

| Atributo | Valor |
|-----------|-------|
| **Ubicación** | `/dist/simulacro_nunca_jamas_fifa2026.html` |
| **Tamaño** | 84 KB |
| **Tipo** | HTML5 + CSS3 + JavaScript |
| **Persistencia** | localStorage + Exportación JSON |
| **Evaluación** | Checklists con scoring |

### 🏗️ Arquitectura de la Plataforma

```
simulacro_nunca_jamas_fifa2026.html
├── CSS (Tokens v2.0)
├── JavaScript Modules
│   ├── SIMULACRO (lógica principal)
│   ├── CHECKLIST (gestión de items)
│   ├── SCORING (cálculo de métricas)
│   ├── TIMER (control de tiempo)
│   ├── EXPORT (JSON/Excel)
│   └── STORAGE (localStorage)
└── Componentes Visuales
    ├── Checklist Manager
    ├── Timer Display
    ├── Score Calculator
    ├── Metrics Dashboard
    └── Evaluation Form
```

### 📋 Funcionalidades Principales

#### 1. Configuración de Simulacro
```javascript
const simulacroConfig = {
  nombre: "Ejercicio SMV-H",
  fecha: "2026-03-04",
  hora_inicio: "09:00",
  duracion_estimada: "2 horas",
  ubicacion: "Hospital General",
  participantes: 25,
  evaluadores: 3
};
```

#### 2. Checklists Evaluables
```javascript
const checklists = {
  preparacion: [
    { id: 1, item: "Área de comando identificada", puntos: 10 },
    { id: 2, item: "Roles SCI-H asignados", puntos: 15 },
    { id: 3, item: "Comunicaciones probadas", puntos: 10 },
    { id: 4, item: "Triage habilitado", puntos: 20 },
    // ... más items
  ],
  ejecucion: [
    { id: 10, item: "Triage iniciado en <5 min", puntos: 25 },
    { id: 11, item: "Flujo de pacientes optimizado", puntos: 20 },
    // ... más items
  ],
  cierre: [
    { id: 20, item: "Reporte final generado", puntos: 30 },
    { id: 21, item: "Reunión de lecciones aprendidas", puntos: 20 }
  ]
};
```

#### 3. Sistema de Scoring
```javascript
function calcularScore(checklist) {
  const items = checklist.items;
  const completados = items.filter(i => i.verificado).length;
  const total = items.length;
  const score = (completados / total) * 100;

  return {
    score: score,
    nivel: score >= 80 ? 'EXCELENTE' :
           score >= 60 ? 'SATISFACTORIO' :
           'NECESITA_MEJORAR',
    items_completados: completados,
    items_totales: total
  };
}
```

#### 4. Timer y Cronómetro
```javascript
const timer = {
  inicio: null,
  transcurrido: 0,
  interval: null,

  iniciar() {
    this.inicio = Date.now();
    this.interval = setInterval(() => {
      this.transcurrido = Date.now() - this.inicio;
      this.actualizarDisplay();
    }, 1000);
  },

  detener() {
    clearInterval(this.interval);
  },

  formatearTiempo(ms) {
    const segundos = Math.floor(ms / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    return `${horas}h ${minutos % 60}m ${segundos % 60}s`;
  }
};
```

#### 5. Exportación de Resultados
```javascript
function exportarResultados() {
  const resultados = {
    simulacro: config.nombre,
    fecha: config.fecha,
    hora_inicio: timer.inicio,
    hora_fin: Date.now(),
    duracion: timer.formatearTiempo(timer.transcurrido),
    scores: scores_por_checklist,
    scores_globales: score_total,
    observaciones: notas_evaluadores,
    participantes: lista_asistencia
  };

  // Exportar como JSON
  downloadJSON(resultados, `simulacro_${config.fecha}.json`);

  // Exportar como Excel
  exportToExcel(resultados, `simulacro_${config.fecha}.xlsx`);
}
```

### 🔄 Flujo de Simulacro

1. **Preparación**
   - Configurar datos del simulacro
   - Seleccionar checklists
   - Asignar evaluadores

2. **Ejecución**
   - Iniciar timer
   - Marcar items completados
   - Monitorear score en tiempo real
   - Agregar observaciones

3. **Evaluación**
   - Revisar items pendientes
   - Asignar scores cualitativos
   - Agregar fotos/evidencias

4. **Cierre**
   - Detener timer
   - Generar reporte final
   - Exportar resultados
   - Guardar en localStorage

### 📊 Dashboard de Métricas

```javascript
const metrics = {
  checklists_completados: 0,
  porcentaje_completitud: 0,
  score_promedio: 0,
  items_criticos_pendientes: 0,
  tiempo_transcurrido: "0h 0m 0s",
  participantes_activos: 0
};
```

### 🎨 Características de UI

- **Timer Countdown:** Tiempo restante visible
- **Progress Bars:** Completitud por checklist
- **Color Coding:**
  - Verde: >80% completado
  - Amarillo: 60-80%
  - Rojo: <60%
- **Notifications:** Alertas de hitos críticos
- **Responsive:** Optimizado para tablets

---

## 🔗 INTEGRACIÓN ENTRE HERRAMIENTAS

### Flujo de Datos

```
ECE-DES.html (BD de pacientes)
    ↓ (IndexedDB compartido)
ECE-DES-Dashboard.html
    ↓ (lee BD)
    ↓ (reporta)
┌─────────────┬─────────────┐
│             │             │
ECE-DES       │ Otros 3     │
│ (registro)   │ (HTMLs       │
│              │ estáticos)    │
│              │             │
ECE-DES-       │ Generador    │
│ Tarjetas.html │ SCI-H        │
└─────────────┴─────────────┘
```

### Compartición de Datos

```javascript
// Shared IndexedDB
const SHARED_DB = "ECEDES_SHARED_DB";

// Tablas compartidas
STORES = {
  pacientes_backup: "Pacientes registrados",
  settings: "Configuración global",
  logs: "Auditoría de acciones"
};

// Todas las apps leen/escriben a través de este wrapper
const DB = {
  async getPacientes() {
    return JSON.parse(await indexedDB.get("pacientes_backup"));
  },
  async savePaciente(paciente) {
    await indexedDB.put("pacientes_backup", paciente);
  }
};
```

---

## 📊 RESUMEN COMPARATIVO

| Herramienta | Tipo | Tamaño | Offline | DB | Export |
|-------------|------|--------|--------|-----|--------|
| **index.html** | Portal | 4 KB | ✅ | No | No |
| **ECE-DES.html** | Registro | 1.8 MB | ✅ | SQLite | ✅ Excel |
| **Dashboard** | Analytics | 920 KB | ✅ | Read | No |
| **Tarjetas** | Impresión | 13 KB | ✅ | No | Print |
| **Generador SCI-H** | Editor | 48 KB | ✅ | No | PDF |
| **Guía Operativa** | Manual | 41 KB | ✅ | No | No |
| **Simulacro** | Evaluación | 84 KB | ✅ | LocalStorage | JSON |

---

## 🚀 GUÍAS DE USO RÁPIDO

### Para Emergencias Reales

1. **Paso 1:** Abrir `index.html` o `ECE-DES.html` directamente
2. **Paso 2:** Ingresar datos básicos (hospital, usuario, PIN)
3. **Paso 3:** Registrar pacientes con triage START
4. **Paso 4:** Abrir Dashboard para monitoreo
5. **Paso 5:** Al finalizar, exportar a Excel

### Para Simulacros

1. **Paso 1:** Abrir `simulacro_nunca_jamas_fifa2026.html`
2. **Paso 2:** Configurar datos del ejercicio
3. **Paso 3:** Seleccionar checklists relevantes
4. **Paso 4:** Ejecutar simulacro con timer
5. **Paso 5:** Evaluar resultados y exportar

### Para Capacitación

1. **Paso 1:** Abrir `guia_operativa_nunca_jamas.html`
2. **Paso 2:** Navegar por sección de interés
3. **Paso 3:** Revisar procedimientos tácticos
4. **Paso 4:** Usar como referencia durante simulacro

### Para Preparación

1. **Paso 1:** Abrir `generador_tarjetas.html`
2. **Paso 2:** Seleccionar rol SCI-H deseado
3. **Paso 3:** Personalizar datos del hospital
4. **Paso 4:** Generar tarjetas PDF
5. **Paso 5:** Imprimir y plastificar

---

## 📝 MANTENIMIENTO

### Actualización de Contenidos

Los documentos markdown en `/docs/` son la fuente de verdad para actualizar las aplicaciones HTML. Para actualizar:

1. Editar archivo `.md` correspondiente
2. Ejecutar: `bash build.sh production`
3. Probar cambios en `dist/`

### Soporte Técnico

**Reportar bugs:** Usar plantilla en `CONTRIBUTING.md`
**Solicitar features:** Abrir issue en repositorio
**Documentación mejoras:** Crear Pull Request

---

## 🔒 CONSIDERACIONES DE SEGURIDAD

### Datos Sensibles
- ✅ **100% local** - Nada sale de la computadora
- ✅ **Sin telemetría** - No hay analytics ni tracking
- ✅ **PIN local** - Solo para auditoría, no autenticación real
- ✅ **Sin logging** - No se envían logs a servidores

### Auditoría
- Todas las acciones se guardan localmente
- Exportación manual de datos (Excel, JSON)
- Sin conexión a internet = sin vector de ataque externo

---

## 📞 CONTACTO Y SOPORTE

### Usuarios Hospitalarios
- **CPES (Coordinación de Proyectos Especiales en Salud)**
- Canales oficiales del IMSS

### Desarrolladores
- **Issues:** Repositorio del proyecto
- **Email:** Ver `package.json`
- **Licencia:** Apache 2.0 (permite modificaciones)

---

**Última actualización:** Marzo 2026
**Versión documentación:** 1.1.0
**Estado:** ✅ Completo y actualizado con 7 herramientas funcionales

*Esta documentación debe mantenerse sincronizada con los cambios en las aplicaciones HTML.*
