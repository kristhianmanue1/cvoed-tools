# ADR-001: Componente Traslados Aéreos

**Estado:** PROPUESTO
**Fecha:** 2026-04-15
**Decisores:** CONTROLADOR (ADRC 2.0) + Dra. Carla Abril Perez Becerril (CPES)
**Impacto:** HIGH

---

## Contexto y Problema

CVOED-Tools es una suite de herramientas hospitalarias 100% offline para emergencias y desastres. Actualmente incluye 6 componentes (ECE-DES, Dashboard, Tarjetas, SCI-H, Guía, Simulador) pero carece de una herramienta dedicada a la coordinación de **traslados aéreos**, críticos para:

- Evacuación hospitalaria en emergencias masivas
- Coordinación interinstitucional durante Copa Mundial FIFA 2026
- Gestión de recursos aéreos (helicópteros, aviones, jets)

### Requerimientos del Dominio

La Dra. Carla Abril Perez Becerril (especialista CPES) ha especificado 21 campos obligatorios para gestionar un traslado aéreo, incluyendo datos del paciente, origen/destino, prioridad START, aeronave, personal médico y **4 tipos de archivo adjunto** (facturas, documentos, correos, fotos).

## Decisión Arquitectónica

**Crear un nuevo componente `Traslados Aéreos` siguiendo los patrones arquitectónicos existentes en cvoed-tools:**

1. **HTML autocontenido** en `dist/Traslados-Aereos.html`
2. **SQLite con WebAssembly** para persistencia offline
3. **IndexedDB** para backups de la base de datos
4. **Vanilla JavaScript** (sin frameworks)
5. **Módulos ES6** con separación models/services/ui
6. **SheetJS** para exportación a Excel
7. **WCAG 2.2 AAA** compliance (contraste 7:1+)

### Estructura de Directorios

```
src/traslados-aereos/
├── index.html              # ~300 líneas HTML5 semántico
├── css/
│   └── styles.css         # ~400 líneas (hereda tokens.css)
├── js/
│   ├── app.js             # ~500 líneas (controlador principal)
│   ├── config.js          # Configuración específica
│   ├── models/
│   │   ├── TrasladoAereo.js      # 21 campos
│   │   └── ArchivoAdjunto.js     # 4 tipos de archivo
│   ├── services/
│   │   ├── db-service.js         # CRUD SQLite
│   │   ├── export-service.js     # SheetJS Excel
│   │   └── file-service.js       # Gestión de archivos
│   └── ui/
│       ├── traslado-form.js      # Formulario 7 secciones
│       └── traslados-table.js    # Tabla con filtros
└── templates/
    └── print-hoja-ruta.html      # Plantilla impresión
```

### Modelo de Datos

**Tabla principal:** `traslados_aereos` (21 campos especificados por CPES)

**Tabla de archivos:** `traslados_archivos` (4 tipos: FACTURA, DOCUMENTO, CORREO, FOTO)

**Tabla de log:** `traslados_log` (trazabilidad de cambios de estado)

### Máquina de Estados

```
SOLICITADO → PROGRAMADO → EN_VUELO → COMPLETADO
                         ↘ CANCELADO
```

### Almacenamiento de Archivos

**Decisión:** Base64 en SQLite (máx 10MB por archivo)

**Rationale:**
- ✅ 100% offline (sin dependencias externas)
- ✅ Consistente con patrón ECE-DES
- ✅ Fácil backup en SQLite export
- ⚠️ Limitación: Tamaño de DB puede crecer

**Alternativa descartada:** IndexedDB para archivos
- Razón: Complejidad adicional sin beneficio claro para MVP
- Se puede migrar en v2.0 si se requiere manejar >50MB

## Consecuencias

### Positivas

- ✅ **Coherencia arquitectónica:** Sigue patrón probado de ECE-DES
- ✅ **Offline-first:** Funciona sin internet (crítico en emergencias)
- ✅ **Rápido desarrollo:** Reutiliza servicios compartidos (xlsx, tokens, utils)
- ✅ **Bajo mantenimiento:** Vanilla JS, sin deuda de frameworks
- ✅ **Accesible:** WCAG 2.2 AAA (máximo nivel)

### Negativas

- ⚠️ **Tamaño de bundle:** HTML puede llegar a 2.5MB (con archivos base64 embebidos)
- ⚠️ **Performance:** Consultas SQLite con BLOBs pueden ser lentas con muchos archivos
- ⚠️ **Escalabilidad:** No hay backend para sincronización multi-usuario

### Mitigaciones

1. **Tamaño de archivos:** Límite de 10MB por archivo, 50MB total por traslado
2. **Performance:** Índices SQL en columnas frecuentemente consultadas
3. **Escalabilidad:** v2.0 puede considerar sync con API cuando hay internet

## Alternativas Consideradas

### Opción 1: Modificar ECE-DES para incluir traslados
**Descartada porque:**
- Viola Single Responsibility Principle
- ECE-DES ya tiene 1061 líneas (demasiado complejo)
- Traslados aéreos es dominio distinto (logística vs clínico)

### Opción 2: Usar framework moderno (React/Vue)
**Descartada porque:**
- Rompería coherencia arquitectónica del proyecto
- Requeriría rebuild de toda la suite
- Aumentaría tamaño de bundle significativamente
- El equipo tiene expertise en Vanilla JS

### Opción 3: Aplicación separada con backend
**Descartada porque:**
- Requeriría infraestructura de servidor
- Rompería modelo 100% offline
- Añadiría dependencia de internet para sync
- No es viable para MVP en 3 semanas

## Especificación Técnica Completa

Ver documento detallado:
`.adrc/reports/ESPECIFICACION_TECNICA_TRASLADOS_AEREOS_v1.0.md`

## Plan de Implementación

MVP en **3 semanas (112 horas)**:

- **Semana 1:** Fundación + Modelos + Formulario (40h)
- **Semana 2:** Tabla + Archivos + Exportación (40h)
- **Semana 3:** Estados + Tests + Documentación (32h)

Ver task file detallado:
`.adrc/tasks/TASK-001-traslados-aereos-mvp.json`

## Referencias

- Especificación CPES: `.adrc/reports/ESPECIFICACION_TECNICA_TRASLADOS_AEREOS_v1.0.md`
- Patrones existentes: `src/ece-des/js/app.js` (1061 líneas)
- Arquitectura general: `docs/architecture/ARQUITECTURA_COMPLETA_20260304.md`
- Guía EVAC-H: `docs/Guía Operativa para la Evacuación de hospitales y áreas críticas (EVAC-H).pdf`

---

**Firma:** CONTROLADOR (ADRC 2.0)
**Revisión técnica:** Kristhian Manuel Jiménez Sánchez
**Validación dominio:** Dra. Carla Abril Perez Becerril (CPES)
**Aprobación:** PENDIENTE

---

*"La simplicidad es la máxima sofisticación" - Leonardo da Vinci*
