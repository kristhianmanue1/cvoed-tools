ECE-DES: Plan Técnico Completo
Sistema de Expediente Clínico Electrónico Portable para Desastres
Te entrego los 4 documentos completos. Por limitaciones temporales del sistema de archivos, los presento como artefactos renderizables — puedes copiar cada uno a un archivo .md.

📄 DOCUMENTO 1/4 — ARQUITECTURA DEL SISTEMA
markdown# ECE-DES: Expediente Clínico Electrónico para Desastres y Emergencias
## Documento 1 de 4 — Arquitectura del Sistema

> **Proyecto:** CPES-IMSS · Copa Mundial FIFA 2026 | **Versión:** 1.0 · Marzo 2026
> **Paleta institucional:** Guinda `#691C32` · Verde IMSS `#006657` · Dorado `#BC955C`

---

## 1. VISIÓN GENERAL

El **ECE-DES** es una aplicación web estática (HTML5 + JavaScript + SQLite-WASM) que corre
completamente en el navegador. Sin servidor. Sin internet. Sin instalación. Un solo archivo .html
ejecutable desde USB, red local o SD Card.

### Principios de diseño

| Principio | Implementación | Justificación CPES |
|-----------|---------------|-------------------|
| Portabilidad total | Archivo .html único autocontenido | BCP-H: sistemas con respaldo offline |
| Offline-first | SQLite en WASM, cero red | PH-RED: continuidad ante ciberataques |
| Trazabilidad inmutable | Auditoría insert-only | EVAC-H: trazabilidad legal institucional |
| Eficiencia bajo presión | Flujos máx. 3 clics | SMV-H: binomio médico-enfermería en crisis |
| Inclusión | WCAG 2.2 AAA, ISO 3864 | INGRID-H: 35% pacientes con discapacidad |

---

## 2. STACK TECNOLÓGICO

CAPA PRESENTACIÓN  → HTML5 semántico · CSS IMSS custom · ISO 3864 · WCAG 2.2 AAA
CAPA LÓGICA       → JavaScript ES2022 vanilla · Módulos: triage, registro, trazabilidad, exportación
CAPA DATOS        → sql.js (SQLite-WASM) · localStorage cifrado AES-256-GCM · SheetJS bundled

Dependencias bundleadas (sin CDN en producción):
- sql.js 1.10.3 — SQLite en WebAssembly (~1.5 MB)
- SheetJS 0.20.2 — Exportación Excel (.xlsx) (~900 KB)
- CSS + JS app propia (~95 KB)
- TOTAL: ~2.5 MB

⚠️ CRÍTICO: El .html final debe ser 100% autocontenido. Ningún recurso externo.
   Esto garantiza funcionamiento desde USB sin internet, cumpliendo BCP-H.

---

## 3. MÓDULOS DEL SISTEMA

ECE-DES.html
├── AuthSession        → Login por turno (PIN 4 dígitos + nombre + rol)
├── PatientRegistry    → Registro rápido (< 60 segundos por paciente)
│   ├── Identificación: nombre / código pulsera / NN (no identificado)
│   ├── Triage START: 4 botones grandes ROJO/AMARILLO/VERDE/NEGRO
│   └── Discapacidad: motor / visual / auditivo / intelectual / ninguna
├── ClinicalTrace      → Timeline de intervenciones (insert-only)
│   ├── Signos vitales seriados
│   ├── Medicamentos y procedimientos
│   ├── Cambios de clasificación triage con justificación obligatoria
│   └── Destino: área / traslado / alta / fallecido / evacuado
├── Census             → Panel de control en tiempo real
│   ├── Conteo por color de triage y por área
│   └── Alertas automáticas (capacidad al 80% / 100%)
├── Export             → Exportación .xlsx + JSON + impresión A5
└── AuditLog           → Auditoría inmutable de cada acción

---

## 4. ESQUEMA DE BASE DE DATOS SQLite

### Tabla: pacientes
CREATE TABLE pacientes (
  id_interno       TEXT PRIMARY KEY,        -- UUID local
  folio_local      TEXT UNIQUE,             -- P-001, P-002...
  nombre           TEXT,                    -- Nullable (NN)
  nss              TEXT,                    -- Nullable
  edad_estimada    INTEGER,
  sexo             TEXT CHECK(sexo IN ('M','F','I')),
  pulsera_id       TEXT,
  discapacidad     TEXT,                    -- JSON array
  triage_inicial   TEXT,                    -- ROJO/AMARILLO/VERDE/NEGRO/BLANCO
  triage_actual    TEXT,
  area_actual      TEXT,
  estado           TEXT,                    -- ACTIVO/TRASLADO/ALTA/FALLECIDO/EVACUADO
  procedencia      TEXT,
  ts_ingreso       TEXT NOT NULL,           -- ISO 8601 UTC
  ts_ultima_mod    TEXT,
  operador_registro TEXT NOT NULL
);

### Tabla: trazabilidad (insert-only)
CREATE TABLE trazabilidad (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  id_paciente     TEXT NOT NULL REFERENCES pacientes(id_interno),
  ts_evento       TEXT NOT NULL,
  tipo_evento     TEXT NOT NULL,            -- TRIAGE_CAMBIO | SIGNOVITAL | MEDICAMENTO |
                                            -- PROCEDIMIENTO | TRASLADO | ALTA | EVACUACION | NOTA
  descripcion     TEXT NOT NULL,
  valor_anterior  TEXT,
  valor_nuevo     TEXT,
  operador        TEXT NOT NULL,
  area            TEXT
);

### Tabla: operadores
CREATE TABLE operadores (
  id        TEXT PRIMARY KEY,
  nombre    TEXT NOT NULL,
  rol       TEXT NOT NULL,                  -- MEDICO|ENFERMERIA|ADMIN|TRIAGE|LOGISTICA
  turno     TEXT,
  pin_hash  TEXT,                           -- SHA-256 del PIN
  activo    INTEGER DEFAULT 1,
  ts_login  TEXT
);

### Tabla: auditoria (INSERT-ONLY — nunca UPDATE ni DELETE)
CREATE TABLE auditoria (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  ts        TEXT NOT NULL,
  operador  TEXT NOT NULL,
  accion    TEXT NOT NULL,                  -- CREATE|UPDATE_TRIAGE|EXPORT|LOGIN
  tabla_ref TEXT,
  id_ref    TEXT,
  detalle   TEXT
);

---

## 5. FLUJOS CRÍTICOS

### Registro de paciente en SMV (objetivo: < 60 segundos)
1. Abrir formulario rápido
2. Folio automático (P-XXX) — sin intervención del operador
3. Nombre O botón "NN" (un clic)
4. Triage START: 4 botones grandes con color ISO 3864 + forma geométrica
5. Área destino: menú de 4 opciones
6. [GUARDAR] → INSERT pacientes + INSERT trazabilidad(INGRESO) + INSERT auditoria

### Cambio de triage durante emergencia
1. Buscar por folio o pulsera (campo de búsqueda único)
2. Botón "Cambiar triage" → selección color nuevo
3. Razón del cambio: OBLIGATORIO (lista rápida + campo libre)
4. [CONFIRMAR] → UPDATE triage_actual + INSERT trazabilidad + INSERT auditoria

### Exportación para CVOED/CRUM
Opción A — "Listado actual":
  .xlsx Hoja 1: Census (resumen por color y área con totales)
  .xlsx Hoja 2: Listado completo (un paciente por fila)

Opción B — "Trazabilidad completa":
  .xlsx con hoja por paciente: timeline de intervenciones con timestamps

---

## 6. SEGURIDAD Y PRIVACIDAD

| Aspecto | Implementación |
|---------|---------------|
| Autenticación | PIN 4 dígitos + nombre (sin contraseña compleja en emergencia) |
| Almacenamiento | localStorage cifrado AES-256-GCM |
| Sin telemetría | Cero llamadas de red; offline total |
| Auditoría | Tabla auditoria: solo INSERT, nunca UPDATE/DELETE desde UI |
| Respaldo papel | Botón "Imprimir" → hoja A5 por paciente con folio y datos esenciales |

⚠️ ALERTA QBRNE: El dispositivo físico debe estar en ZONA FRÍA del incidente.
   Según guía CPES-QBRNE: "Verificar integridad de sistemas digitales ante ciberataques asociados."

---

## 7. REQUISITOS DE HARDWARE

| Componente | Mínimo | Recomendado |
|-----------|--------|-------------|
| Dispositivo | Cualquier navegador moderno | Tablet 10" + teclado físico |
| Navegador | Chrome 90+ / Firefox 88+ | Chrome 120+ |
| RAM disponible | 512 MB | 2 GB |
| Almacenamiento | 50 MB | 500 MB para respaldos |
| Pantalla | 768px ancho | 1024px+ |
| Energía | Batería ≥ 4h | UPS o generador (BCP-H) |

---
ECE-DES v1.0 · CPES-IMSS · FIFA 2026 · Documento 1/4: Arquitectura

📄 DOCUMENTO 2/4 — DISEÑO DE INTERFAZ Y EXPERIENCIA DE USUARIO
markdown# ECE-DES: Expediente Clínico Electrónico para Desastres
## Documento 2 de 4 — Diseño de Interfaz y Experiencia de Usuario

> **Sistema de diseño:** Síntesis Rams-Ive para emergencias hospitalarias · IMSS
> **Estándares:** ISO 3864-1 · ISO 7010 · WCAG 2.2 AAA · Manual Identidad IMSS-Bienestar 2024

---

## 1. SISTEMA DE COLOR INSTITUCIONAL

### Paleta IMSS (implementación CSS)
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
  --fn-rojo-bg: #FDF0F0;
  --fn-rojo-border: #E8A0A0;
  --fn-amarillo: #D4940A;
  --fn-amarillo-bg: #FFF8E7;
  --fn-amarillo-border: #F0D070;
  --fn-verde: #1B7340;
  --fn-verde-bg: #F0F8F4;
  --fn-azul: #1A5276;
  --fn-azul-bg: #EDF4FA;
  --fn-azul-border: #A8C8E0;
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
  /* Tipografia */
  --font-primary: "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "Cascadia Code", "SF Mono", "Consolas", ui-monospace, monospace;
}
```

### Regla de doble codificación (accesibilidad daltonismo + impresión B&N)
Cada categoría de triage usa SIEMPRE color + forma geométrica:
- 🔴 ROJO → `#C41E3A` + diamante ◆
- 🟡 AMARILLO → `#D4940A` + triángulo ▲
- 🟢 VERDE → `#1B7340` + círculo ●
- ⬛ NEGRO → `#1A1A2E` + cruz ✚
- ⬜ BLANCO → borde `#000000` + cuadrado □ (sin clasificar)

---

## 2. LAYOUT GENERAL — ESTRUCTURA DE PANTALLAS

### Pantalla de inicio / Login
```
┌──────────────────────────────────────────────────────────┐
│  [Logo IMSS]  ECE-DES · Emergencias y Desastres          │
│  Guinda #691C32 · Copa Mundial FIFA 2026                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│         HOSPITAL: [_________________________]            │
│         EVENTO:   [_________________________]            │
│         OPERADOR: [_________________________]            │
│         ROL:      [Médico ▼]                             │
│         PIN:      [● ● ● ●]                              │
│                                                          │
│              [  INICIAR SESIÓN  ]                        │
│              (botón guinda #691C32)                      │
│                                                          │
│  ⚠️ Este sistema opera sin internet.                    │
│     Guarda respaldo manual cada 30 minutos.              │
└──────────────────────────────────────────────────────────┘
```

### Pantalla principal — Dashboard de Crisis
```
┌─────────────────────────────────────────────────────────────┐
│ ▌ECE-DES  [Hospital de Nunca Jamás]  [Turno: MAT]  [14:32] │
│ Guinda header + barra dorada inferior                        │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│ ROJO ◆   │AMARILLO▲ │ VERDE ●  │ NEGRO ✚  │  [+ NUEVO PAC.] │
│   12     │   24     │   31     │    3     │  botón verde     │
│ #C41E3A  │ #D4940A  │ #1B7340  │ #1A1A2E  │  #006657        │
├──────────┴──────────┴──────────┴──────────┴─────────────────┤
│  LISTADO DE PACIENTES                         [Buscar: ___] │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ FOLIO │ NOMBRE     │TRIAGE│ ÁREA      │ ESTADO │ TIEMPO│ │
│  │ P-001 │ García M.  │ ◆    │ Área Roja │ ACTIVO │ 00:23 │ │
│  │ P-002 │ NN         │ ▲    │ Á.Amarilla│ ACTIVO │ 00:18 │ │
│  │ P-003 │ López S.   │ ●    │ Á.Verde   │ ACTIVO │ 00:45 │ │
│  │ ...   │ ...        │ ...  │ ...       │ ...    │ ...   │ │
│  └────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ [Exportar Excel] [Exportar JSON] [Imprimir resumen] [Backup]│
└─────────────────────────────────────────────────────────────┘
```

### Formulario de registro rápido (objetivo: < 60 segundos)
```
┌─────────────────────────────────────────────────────────────┐
│ NUEVO PACIENTE · Folio automático: P-071                     │
├─────────────────────────────────────────────────────────────┤
│ Nombre: [___________________]  [No identificado (NN)]        │
│ NSS:    [___________________]  Edad: [__] años (estimada)   │
│ Sexo:   [M] [F] [I]           Pulsera: [________]           │
│ Procedencia: [__________________________________]            │
│ Discapacidad: [Motor] [Visual] [Auditivo] [Intelectual] [—] │
├─────────────────────────────────────────────────────────────┤
│                 CLASIFICACIÓN TRIAGE START                   │
│                                                             │
│   ┌────────┐  ┌─────────┐  ┌────────┐  ┌────────┐          │
│   │   ◆    │  │    ▲    │  │   ●    │  │   ✚    │          │
│   │  ROJO  │  │AMARILLO │  │ VERDE  │  │ NEGRO  │          │
│   │Crítico │  │Urgente  │  │  Leve  │  │S/Vida  │          │
│   └────────┘  └─────────┘  └────────┘  └────────┘          │
│   (botones grandes, min 80x80px, colores ISO 3864)          │
├─────────────────────────────────────────────────────────────┤
│ Área inicial: [Roja ▼]   Nota rápida: [_________________]  │
│                                                             │
│       [CANCELAR]              [REGISTRAR PACIENTE]          │
│       (borde guinda)          (botón guinda #691C32)        │
└─────────────────────────────────────────────────────────────┘
```

### Vista de expediente individual (trazabilidad)
```
┌─────────────────────────────────────────────────────────────┐
│ P-071 · García Martínez, Manuel · 45 años · NSS: 123456     │
│ Triage: ◆ ROJO  →  Área Roja  →  ACTIVO  │ Ingreso: 14:09  │
├─────────────────────────────────────────────────────────────┤
│ ACCIONES RÁPIDAS:                                           │
│ [Cambiar triage] [Agregar evento] [Trasladar] [Alta/Egreso] │
├─────────────────────────────────────────────────────────────┤
│ LÍNEA DE TIEMPO (más reciente arriba)                       │
│ ─────────────────────────────────────────────────          │
│ 14:32 │ SIGNOVITAL │ TA:100/70 · FC:110 · FR:24 · SpO2:91% │
│       │ Operador: Enf. Torres │ Área Roja                   │
│ ─────────────────────────────────────────────────          │
│ 14:25 │ MEDICAMENTO│ Morfina 5mg IV · Dx: trauma torácico   │
│       │ Operador: Dr. Ramírez │ Área Roja                   │
│ ─────────────────────────────────────────────────          │
│ 14:09 │ INGRESO    │ Procedencia: sector norte estadio      │
│       │ Triage inicial: ◆ ROJO · Pulsera: P071              │
│       │ Discapacidad: Ninguna · Operador: Enf. Soto         │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. COMPONENTES DE INTERFAZ CRÍTICOS

### Botones de triage (accesibilidad bajo estrés)
```css
.btn-triage {
  min-width: 80px;
  min-height: 80px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: transform 0.1s, box-shadow 0.1s;
}
.btn-triage-rojo     { background: var(--fn-rojo); color: #FFFFFF; }
.btn-triage-amarillo { background: var(--fn-amarillo); color: #1A1A1A; }
.btn-triage-verde    { background: var(--fn-verde); color: #FFFFFF; }
.btn-triage-negro    { background: var(--fn-negro); color: #FFFFFF; }
.btn-triage:hover    { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
.btn-triage:active   { transform: scale(0.98); }
```

### Indicadores de capacidad (alertas automáticas)
```
Capacidad < 70%  → barra verde #006657
Capacidad 70-80% → barra dorada #BC955C + ícono ⚠️
Capacidad > 80%  → barra guinda #691C32 + pulso animado
Capacidad = 100% → fondo guinda + texto blanco + campana 🔔
```

### Tipografía (system fonts — sin dependencias de red)
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
               Roboto, 'Helvetica Neue', Arial, sans-serif;
  /* Cero descarga de fuentes → funciona offline garantizado */
}
h1, h2 { font-weight: 700; color: var(--guinda); }
.dato-critico { font-size: 2rem; font-weight: 900; }
.label-campo  { font-size: 0.85rem; color: var(--gris-texto); text-transform: uppercase; }
```

---

## 4. ACCESIBILIDAD — REQUERIMIENTOS INGRID-H

Basado en el componente 2 (atención diferenciada) de INGRID-H, el ECE-DES implementa:

### Para pacientes con discapacidad visual registrada
- Badge visible en la tarjeta del paciente: icono + texto "VISUAL"
- Color de fondo diferenciado en la tarjeta (borde dorado #BC955C)
- Nota automática en trazabilidad al registrar: "Paciente requiere guía personal"

### Para pacientes con discapacidad auditiva registrada
- Badge "AUDITIVO" en tarjeta
- Nota automática: "Verificar alarmas visuales / intérprete de señas si disponible"

### Para pacientes con discapacidad motriz
- Badge "MOTRIZ" con icono de silla de ruedas
- Campo adicional: tipo de dispositivo (silla / camilla / andadera)

### Para la interfaz del operador
- Contraste WCAG 2.2 AAA en todos los elementos interactivos
- Navegación completa por teclado (Tab, Enter, Space, flechas)
- Zona de toque mínima: 44x44px en todos los botones
- Labels `aria-label` en todos los campos

---

## 5. MODO DEGRADADO (CONTINGENCIA)

Si el navegador no soporta WebAssembly (dispositivos muy antiguos):
1. El sistema detecta automáticamente la limitación
2. Muestra aviso: "Modo de respaldo activo. Datos en memoria temporal."
3. Activa modo JSON-only: toda la información se almacena como JSON en localStorage
4. La exportación funciona igualmente (SheetJS no requiere WASM)
5. Al recargar: los datos persisten desde localStorage
6. ⚠️ Riesgo: Si se cierra la ventana del navegador, los datos se pierden → recordatorio visible

---
ECE-DES v1.0 · CPES-IMSS · FIFA 2026 · Documento 2/4: Diseño UI/UX

📄 DOCUMENTO 3/4 — FUNCIONALIDADES CLÍNICAS Y OPERATIVAS
markdown# ECE-DES: Expediente Clínico Electrónico para Desastres
## Documento 3 de 4 — Funcionalidades Clínicas y Operativas

> **Guías base:** SMV-H · EVAC-H · PH-RED · SCI-H · INGRID-H · QBRNE

---

## 1. REGISTRO DE PACIENTE — CAMPOS Y VALIDACIONES

### Datos de identificación
| Campo | Tipo | Obligatorio | Valor por defecto | Notas |
|-------|------|-------------|-------------------|-------|
| Folio local | Texto generado | Sí (automático) | P-001... | Secuencial por sesión |
| Nombre completo | Texto libre | No | — | Si vacío: se etiqueta "NN" |
| NSS | Texto | No | — | Alfanumérico, 11 caracteres |
| Edad estimada | Número entero | No | — | Rango válido: 0-120 |
| Sexo | Selección | No | "I" (indeterminado) | M/F/I |
| Pulsera ID | Texto | No | — | Código físico de pulsera de emergencia |
| Procedencia | Texto libre | No | — | Ej: "Sector Norte Estadio", "Calle 5" |

### Clasificación de discapacidad (INGRID-H)
Campo de selección múltiple. Opciones:
- `MOTRIZ`: Usa silla de ruedas, camilla, andadera, prótesis
- `VISUAL`: Ceguera total o baja visión
- `AUDITIVA`: Sordera o hipoacusia severa
- `INTELECTUAL`: Comunicación adaptada necesaria
- `NINGUNA`: Sin discapacidad registrada
- `NO_EVALUADO`: No se pudo determinar en contexto de emergencia

Al seleccionar MOTRIZ: campo adicional → tipo de dispositivo (silla/camilla/andadera)

### Clasificación triage START
Implementación según guía SMV-H CPES y método START:

| Categoría | Criterio clínico | Color | Forma ISO 3864 |
|-----------|-----------------|-------|----------------|
| ROJO | Crítico tratable: FR>30 o <8, llenado capilar >2s, estado alterado | #C41E3A | ◆ Diamante |
| AMARILLO | Urgente diferible: camina con ayuda, FR 10-29, llenado <2s | #D4940A | ▲ Triángulo |
| VERDE | Ambulatorio: camina solo, FR normal, responde | #1B7340 | ● Círculo |
| NEGRO | Sin signos de vida o lesión incompatible con vida | #1A1A2E | ✚ Cruz |
| BLANCO | Sin clasificar (recién ingresado) | #FFFFFF (borde negro) | □ Cuadrado |

⚠️ La guía SMV-H indica: "No trasladar sin registro." El sistema bloquea el cambio de área
   hasta que exista al menos un registro de triage.

---

## 2. TRAZABILIDAD CLÍNICA — TIPOS DE EVENTO

Todos los eventos se registran en la tabla `trazabilidad`. Son INSERT-ONLY.

### Tipo: SIGNOVITAL
Campos:
- Tensión arterial (sistólica / diastólica)
- Frecuencia cardíaca (lpm)
- Frecuencia respiratoria (rpm)
- Saturación de oxígeno (SpO2 %)
- Temperatura (°C)
- Glucemia capilar (mg/dL) — opcional
- Glasgow (3-15) — para pacientes neurológicos
- Nota libre

Validaciones:
- FC fuera de rango 20-300: advertencia ⚠️ (no bloquea guardado)
- SpO2 < 90%: alerta visible en tarjeta del paciente
- Glasgow < 8: alerta "Considerar manejo de vía aérea"

### Tipo: MEDICAMENTO
Campos:
- Nombre del medicamento (lista rápida + campo libre)
- Dosis
- Vía de administración (IV/IM/VO/SL/Tópica/Inhalada)
- Indicación / diagnóstico de presunción
- Operador que administra

### Tipo: PROCEDIMIENTO
Campos:
- Tipo de procedimiento (lista: IOT / VVP / VVC / SV / SNG / Drenaje / Desfibrilación / RCP / Otro)
- Descripción libre
- Resultado / evolución inmediata

### Tipo: TRIAGE_CAMBIO
Campos:
- Triage anterior (automático desde base de datos)
- Triage nuevo (selección obligatoria)
- Motivo del cambio (OBLIGATORIO): lista + campo libre
  Opciones rápidas: "Mejoría clínica" / "Deterioro" / "Re-evaluación posterior a procedimiento" / "Error de clasificación inicial" / "Otro"

### Tipo: TRASLADO
Campos:
- Destino: unidad receptora (texto libre) o selección si red RISS configurada
- Medio de transporte: Ambulancia terrestre / Aérea / Traslado interno
- Personal que acompaña
- Estado clínico al momento del traslado
- Hora de salida (automática con opción de editar)
- ¿Documentos enviados? (checklist: nota / estudios / consentimiento)

### Tipo: ALTA / EGRESO
Campos:
- Tipo: Alta médica / Transferencia / Fuga voluntaria / Defunción
- Diagnóstico de egreso (texto libre)
- Condición al egreso: Estable / Crítico / Fallecido
- Hora (automática)

### Tipo: EVACUACION
Campos:
- Grupo de evacuación EVAC-H (1/2/3/4/5)
- Zona de destino: Zona Interna / Zona Externa / Punto de encuentro
- Equipo responsable del traslado
- Hora
Basado en EVAC-H: registro obligatorio de "hora de ingreso y egreso, identidad, destino final"

### Tipo: NOTA
Campo libre de texto. Sin restricciones.
Ejemplos de uso: observaciones de familiares, hallazgos adicionales, comunicaciones verbales importantes.

---

## 3. PANEL DE CENSUS — CONTROL EN TIEMPO REAL

### Métricas principales (actualizadas en tiempo real)
```
┌─────────────────────────────────────────────────────┐
│              CENSO EN TIEMPO REAL                   │
│                                                     │
│   TOTAL ACTIVOS: 70    TOTAL SESIÓN: 82             │
│                                                     │
│   ◆ ROJO:    12  (17%)  ▲ AMARILLO: 24  (34%)       │
│   ● VERDE:   31  (44%)  ✚ NEGRO:     3   (4%)       │
│                                                     │
│   TRASLADOS: 8  |  ALTAS: 4  |  FALLECIDOS: 3       │
│                                                     │
│   POR ÁREA:                                         │
│   Urgencias:  35/50 (70%) ▓▓▓▓▓▓▓░░░  🟡            │
│   UCI:         7/8  (87%) ▓▓▓▓▓▓▓▓░   🔴            │
│   Área Roja:  12/15 (80%) ▓▓▓▓▓▓▓▓░░  🔴            │
│   Expansión:  16/30 (53%) ▓▓▓▓▓▓░░░░  🟢            │
└─────────────────────────────────────────────────────┘
```

### Alertas automáticas del sistema
| Condición | Alerta | Nivel |
|-----------|--------|-------|
| Cualquier área > 80% | Banner dorado + ícono ⚠️ | Advertencia |
| Cualquier área > 100% | Banner guinda + pulso | Crítico |
| 5+ pacientes ROJO sin evento en 15 min | Recordatorio | Atención |
| Último respaldo > 30 min | Recordatorio respaldo | Informativo |
| Batería dispositivo < 20% (API disponible) | Alerta urgente | Crítico |

---

## 4. MÓDULO DE EXPORTACIÓN EXCEL

### Archivo: ECE-DES_[HOSPITAL]_[FECHA]_[HORA].xlsx

#### Hoja 1: RESUMEN_EJECUTIVO
Diseño para reporte al CVOED / CRUM / COE:
- Datos del hospital y evento
- Fecha y hora del reporte
- Totales por categoría triage
- Totales por área
- Totales por estado (activo/traslado/alta/fallecido)
- Gráfico de barras (SheetJS soporta gráficos básicos)

Color de encabezados: fondo guinda #691C32, texto blanco

#### Hoja 2: LISTADO_PACIENTES
Una fila por paciente. Columnas:
| Folio | Nombre | NSS | Edad | Sexo | Pulsera | Discapacidad | Triage inicial | Triage actual | Área | Estado | Procedencia | Ingreso | Última modificación | Operador |

Formato condicional por color de triage:
- ROJO: fondo #FDF0F0
- AMARILLO: fondo #FFF8E7
- VERDE: fondo #F0F8F4
- NEGRO: fondo #EDF4FA

#### Hoja 3: TRAZABILIDAD_COMPLETA
Una fila por evento. Columnas:
| Folio paciente | Nombre | Timestamp | Tipo evento | Descripción | Valor anterior | Valor nuevo | Operador | Área |

Ordenada por timestamp ascendente (cronológico).

#### Hoja 4: DISCAPACIDAD
Filtro automático de pacientes con discapacidad registrada.
Para coordinación con INGRID-H y trabajo social durante evacuación.

---

## 5. INTEGRACIÓN CON FLUJOS CPES

### Durante SMV (SMV-H)
- El Comandante del Incidente consulta el panel de Census para decidir expansión de capacidad
- El Responsable de Logística exporta el listado cada 30 minutos para enviar al CVOED
- El Médico de Triage actualiza clasificaciones directamente desde tablet

### Durante evacuación (EVAC-H)
- El Jefe de Piso registra el grupo de evacuación en el evento tipo EVACUACION de cada paciente
- El sistema genera un listado filtrado por grupo para el Coordinador de Evacuación
- Los pacientes con discapacidad motriz se marcan automáticamente como prioritarios

### Durante QBRNE
- El sistema permite marcar pacientes como "POTENCIAL CONTAMINACION" (campo adicional en TRIAGE)
- Se genera alerta visual en el panel: "X pacientes con sospecha de contaminación"
- Estos pacientes aparecen en color diferenciado en el listado hasta confirmación de descontaminación

---

## 6. FUNCIONALIDAD DE RESPALDO

### Respaldo automático cada 30 minutos
- Descarga automática del archivo JSON con toda la base de datos
- Nombre: `ECE-DES-backup-[TIMESTAMP].json`
- El usuario puede silenciar los recordatorios pero no desactivar el mecanismo

### Restauración desde respaldo
- Botón "Restaurar desde archivo JSON"
- El sistema valida la integridad del archivo antes de importar
- Si hay datos existentes: pregunta si fusionar o reemplazar

### Exportación de la base de datos SQLite
- Descarga el archivo .db completo (binary)
- Compatible con cualquier cliente SQLite para auditoría posterior
- Nombre: `ECE-DES-[HOSPITAL]-[FECHA].db`

---
ECE-DES v1.0 · CPES-IMSS · FIFA 2026 · Documento 3/4: Funcionalidades Clínicas

📄 DOCUMENTO 4/4 — PLAN DE IMPLEMENTACIÓN Y DESPLIEGUE
markdown# ECE-DES: Expediente Clínico Electrónico para Desastres
## Documento 4 de 4 — Plan de Implementación y Despliegue

> **Contexto:** Copa Mundial FIFA 2026 · CPES-IMSS
> **Hito crítico:** Sistema operativo antes del primer partido FIFA

---

## 1. FASES DE IMPLEMENTACIÓN

### FASE 0 — Preparación (Semanas 1-2)
| Actividad | Responsable | Entregable |
|-----------|------------|-----------|
| Validar esquema SQLite con equipo clínico | Líder técnico + médico de urgencias | Esquema aprobado |
| Definir listas rápidas de medicamentos | Farmacéutico + Jefe de Urgencias | Lista JSON validada |
| Definir red RISS de unidades receptoras | Coordinador OOAD | Directorio JSON |
| Configurar paleta IMSS y probar accesibilidad | Desarrollador UI | Componentes validados |
| Validar con evaluador ISH (módulo 4, punto 128) | Evaluador ISH | Conformidad documentada |

### FASE 1 — Desarrollo (Semanas 3-6)
| Sprint | Módulos | Criterio de aceptación |
|--------|---------|----------------------|
| Sprint 1 (S3-S4) | AuthSession + PatientRegistry + SQLite base | Registrar 10 pacientes en < 10 min |
| Sprint 2 (S4-S5) | ClinicalTrace completo + AuditLog | Timeline de 5 eventos visibles por paciente |
| Sprint 3 (S5-S6) | Census + Alertas + Export (.xlsx + JSON) | Exportar listado completo con formato correcto |

### FASE 2 — Pruebas (Semanas 7-8)
| Tipo de prueba | Método | Estándar |
|----------------|--------|---------|
| Prueba de carga | Simular 200 pacientes, 500 eventos | < 200ms por operación |
| Prueba offline | Desconectar red durante uso | Sin pérdida de datos |
| Prueba de accesibilidad | Navegación solo teclado + lector pantalla | WCAG 2.2 AA mínimo |
| Prueba de exportación | Generar .xlsx con 200 pacientes | Archivo abre correctamente en Excel |
| Prueba de respaldo/restauración | Simular cierre abrupto del navegador | Restaurar desde JSON sin pérdida |
| Simulacro integrado (CPES) | Ejercicio de gabinete Hospital Nunca Jamás | Personal registra sin asistencia técnica |

### FASE 3 — Capacitación (Semanas 8-9)
Basado en microlearning CPES: cada rol recibe su entrenamiento específico.

| Rol | Duración | Formato | Enfoque |
|-----|---------|---------|---------|
| Médico de triage | 20 min | Demostración + práctica | Registro rápido + cambio triage |
| Enfermería | 20 min | Demostración + práctica | Signos vitales + medicamentos |
| Jefe de turno | 30 min | Taller | Census + alertas + exportación |
| Personal de sistemas | 45 min | Técnico | Instalación en USB + respaldo |
| Coordinador SCI-H | 30 min | Taller | Integración con CVOED + reporte |

### FASE 4 — Despliegue (Semanas 10-11)
| Actividad | Detalle |
|-----------|---------|
| Preparar USB maestros | 1 por servicio crítico (Urgencias, UCI, Área Roja, Puesto de Comando) |
| Instalar en dispositivos asignados | Tablet por área + laptop en Puesto de Comando |
| Verificar funcionamiento offline en cada dispositivo | Check funcional completo |
| Entrega formal a responsables de servicio | Con Tarjeta de Acción de uso del sistema |
| Activar protocolo de respaldo (quién, cuándo, dónde guarda) | Procedimiento firmado |

### FASE 5 — Operación FIFA (Semanas 12+)
| Actividad | Frecuencia | Responsable |
|-----------|-----------|------------|
| Prueba funcional pre-partido | Antes de cada partido | Jefe de Sistemas |
| Exportar respaldo JSON a unidad externa | Cada 30 min durante evento | Jefe de Turno |
| Reporte de census al CVOED | Cada hora durante SMV activo | Operador ECE-DES |
| Revisión post-evento | Después de cada partido con incidentes | Coordinador CPES |

---

## 2. DISTRIBUCIÓN DEL ARCHIVO

### Estructura de entrega
```
ECE-DES-v1.0/
├── ECE-DES.html              ← Archivo principal (copia este, es todo lo que necesitas)
├── ECE-DES-MANUAL-RAPIDO.pdf ← 2 páginas: cómo empezar en emergencia
├── ECE-DES-GUIA-TECNICA.pdf  ← Instalación, respaldo, solución de problemas
└── README.txt                ← Instrucciones mínimas para personal técnico
```

### Canales de distribución
| Canal | Público | Ventaja |
|-------|---------|---------|
| USB institucional | Servicios críticos | Funciona sin red, sin servidor |
| Servidor intranet hospitalaria | Todo el personal con acceso | Actualización centralizada |
| Correo electrónico (zip) | Coordinadores OOAD | Distribución masiva |
| Google Drive CPES (respaldo) | Coordinadores con acceso | Descarga rápida |

---

## 3. REQUERIMIENTOS PARA OPERACIÓN EN CAMPO

### Por servicio crítico — lista de verificación pre-evento FIFA
```
CHECKLIST ECE-DES POR SERVICIO (completar antes de cada partido)

Servicio: ________________  Responsable: ________________  Fecha: ________

[ ] El archivo ECE-DES.html está disponible en el dispositivo asignado
[ ] El navegador abre el archivo correctamente (sin mensajes de error)
[ ] Se puede registrar un paciente de prueba en < 60 segundos
[ ] El módulo de exportación genera el .xlsx correctamente
[ ] El respaldo JSON funciona (descarga el archivo)
[ ] El dispositivo tiene al menos 4 horas de batería cargada
[ ] El operador de turno conoce el PIN de sesión de emergencia
[ ] Se dispone de USB de respaldo con la última versión del sistema

Firma del responsable: ___________________
```

---

## 4. PLAN DE CONTINGENCIA TECNOLÓGICA

Basado en BCP-H: "Procedimientos de respaldo de sistemas electrónicos para emergencias."

### Escenario A: Falla del dispositivo principal
**Respuesta:**
1. Activar dispositivo de respaldo (tablet o laptop secundaria)
2. Copiar ECE-DES.html desde USB maestro
3. Restaurar último backup JSON si es una sesión activa
4. Tiempo estimado de recuperación: < 5 minutos

### Escenario B: Falla del navegador / corrupción de localStorage
**Respuesta:**
1. Exportar datos actuales si el sistema responde parcialmente
2. Abrir en modo incógnito (localStorage limpio)
3. Restaurar desde último archivo JSON descargado
4. Si no hay JSON: activar FORMULARIO PAPEL (ver siguiente sección)

### Escenario C: Ciberataque / falla de red hospitalaria
**Respuesta:**
El ECE-DES es inmune a fallas de red (opera 100% offline). Sin acción requerida para el sistema.
Sin embargo, según guía CPES-QBRNE: el dispositivo físico debe mantenerse en zona limpia y no conectarse a redes comprometidas durante el incidente.

### Escenario D: Dispositivos insuficientes (SMV masivo > capacidad)
**Respuesta:**
Activar **formulario papel de emergencia** (incluido en el ZIP como `FORMULARIO-PAPEL.pdf`).
Los datos se capturan en papel y se ingresan en el ECE-DES cuando se estabilice la situación.
El formulario papel replica exactamente los campos del sistema para facilitar la transcripción.

---

## 5. MÉTRICAS DE ÉXITO

| Métrica | Meta | Instrumento de medición |
|---------|------|------------------------|
| Tiempo de registro por paciente | < 60 segundos | Cronómetro en simulacro |
| Tasa de adopción en simulacros | > 80% del personal registra sin asistencia | Observación directa |
| Integridad de trazabilidad | 100% de eventos con timestamp y operador | Revisión de export .xlsx |
| Disponibilidad del sistema | > 99% durante partidos FIFA | Log de incidentes |
| Satisfacción del operador | > 4/5 en escala de usabilidad | Encuesta post-simulacro |
| Tiempo de exportación para CVOED | < 2 minutos desde solicitud | Cronómetro en drill |

---

## 6. BRECHAS IDENTIFICADAS Y GESTIÓN

Los siguientes elementos no están cubiertos por la base documental CPES-IMSS y deben
ser completados por el equipo institucional antes del despliegue:

| Brecha | Impacto | Acción requerida |
|--------|---------|-----------------|
| Normativa NOM-004-SSA3 (expediente clínico) | Legal: el ECE-DES es una herramienta de emergencia, no el expediente oficial | Obtener aval de la Dirección Jurídica IMSS como "registro de emergencia complementario" |
| Integración con CVOED-IMSS (API) | Reporte automático vs. manual | Consultar a CPES si existe API documentada para CVOED |
| Firma electrónica de eventos clínicos | Validez legal de los registros | Definir alcance: el sistema registra operador por PIN, no firma digital |
| Lista maestra de medicamentos IMSS | Listas rápidas de medicamentos | Solicitar CBUM (Cuadro Básico) a Farmacia del hospital |
| Versión iOS/Android nativa | Mayor portabilidad en campo | Evaluar PWA (Progressive Web App) como siguiente iteración |

---

## 7. COSTOS Y RECURSOS

| Recurso | Costo | Nota |
|---------|-------|------|
| Desarrollo del sistema | Interno (desarrolladores CPES) o contratación | Estimado 80-120 horas de desarrollo |
| sql.js + SheetJS | $0 | Licencias MIT y Apache 2.0 |
| Tablets para servicios críticos | Variable | Si no existen: 4-6 tablets ~$5,000-8,000 MXN c/u |
| USB maestros | ~$100 MXN c/u | 10-20 unidades recomendadas |
| Capacitación del personal | Interno (microlearning CPES ya desarrollado) | Integrar como Bloque 4 del programa |
| Mantenimiento anual | Mínimo | El sistema no requiere infraestructura de servidor |

---

## 8. ALINEACIÓN CON DOCUMENTOS CPES

| Documento CPES | Sección relacionada con ECE-DES |
|---------------|--------------------------------|
| PH-RED | §3.2.1 sistemas de información; §3.3 activación del plan |
| SMV-H | §3.3 acciones durante la respuesta; binomio médico-enfermería |
| EVAC-H | §4.vi trazabilidad y control institucional; §5.v control de pacientes |
| BCP-H | §Procesos críticos: gestión de información clínica; respaldo offline |
| QBRNE | §Paso 2: verificar integridad de sistemas digitales; respaldo offline |
| ISH (punto 128) | Gestión de información de pacientes; procedimientos de respaldo |
| INGRID-H | Componente 2: atención diferenciada; registro de discapacidad |

---
ECE-DES v1.0 · CPES-IMSS · Copa Mundial FIFA 2026 · Documento 4/4: Implementación
Colores institucionales: Guinda #691C32 · Verde IMSS #006657 · Dorado #BC955C

Resumen del plan técnico
Los 4 documentos cubren el sistema completo:
Doc 1 — Arquitectura: Stack tecnológico (HTML5 + SQLite-WASM + SheetJS), esquema completo de 5 tablas SQLite, flujos críticos de operación y requerimientos de hardware mínimos.
Doc 2 — Diseño UI/UX: Paleta IMSS completa con variables CSS, layouts de todas las pantallas clave, sistema de doble codificación ISO 3864 para triage, y requerimientos de accesibilidad INGRID-H.
Doc 3 — Funcionalidades clínicas: 8 tipos de evento de trazabilidad, validaciones clínicas, panel de Census con alertas automáticas, estructura del Excel de exportación con 4 hojas, e integración con flujos SMV-H / EVAC-H / QBRNE.
Doc 4 — Implementación: 5 fases de despliegue con cronograma, checklists operativos por servicio, 4 escenarios de contingencia tecnológica, métricas de éxito, brechas identificadas (NOM-004, API CVOED) y tabla de alineación con los 7 documentos CPES relevantes.