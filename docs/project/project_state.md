# CVOED-TOOLS Project State

## Project Information
**Project:** cvoed-tools
**Type:** JavaScript/HTML5 Suite
**Domain:** Salud / Emergencias Hospitalarias
**Status:** Activo
**Version:** 1.1.0
**Registered in ADRC:** 2026-03-03

---

## 📋 Executive Summary

**CVOED-Tools** es una suite portátil de **herramientas hospitalarias para emergencias y desastres** desarrollada para el IMSS en el contexto de la Copa Mundial FIFA 2026.

**Propósito:** Herramientas offline para la preparación y respuesta hospitalaria ante emergencias y desastres.

**Licencia:** Apache License 2.0
**Autores:** Kristhian Manuel Jimenez y Dra. Carla Abril Perez
**Tamaño:** 37 MB
**Líneas de Código:** ~8,482 (HTML + JS)

---

## 🛠️ Core Components

### 1. Aplicaciones Web HTML5 (100% Offline)

| Archivo | Función | Estado |
|---------|---------|--------|
| `ECE-DES.html` | Expediente Clínico Electrónico para Desastres (Sistema principal de registro de pacientes SMV) | ✅ Funcional |
| `ECE-DES-Dashboard.html` | Tablero de Control y Reportes Directivos (Puesto de Mando) | ✅ Funcional |
| `ECE-DES-Tarjetas.html` | Motor de Impresión de Tarjetas/Etiquetas START | ✅ Funcional |
| `generador_tarjetas.html` | Generador de Tarjetas de Acción SCI-H | ✅ Funcional |
| `guia_operativa_nunca_jamas.html` | Manual Digital Formateado de protocolos operativos | ✅ Funcional |
| `simulacro_nunca_jamas_fifa2026.html` | Plataforma de Evaluación de Simulacro Mundial 2026 | ✅ Funcional |
| `index.html` | Portal principal | ✅ Funcional |

### 2. Biblioteca de Guías y Normativas (`/docs/`)

- Guía SMV-H (Saldo Masivo de Víctimas)
- SCI Hospitalario (Sistema de Comando de Incidentes)
- Marco de Respuesta Multiamenaza
- Guía EVAC-H (Evacuación)
- Guía BCP-H (Continuidad de Operaciones)
- Plan Hospitalario PH-RED
- Incidentes QBRNE (Químicos, Biológicos, Radiológicos)
- Índices PHS (Seguridad Hospitalaria OMS/OPS)
- Ejercicio FIFA 2026

### 3. Especificaciones Técnicas

| Documento | Descripción |
|-----------|-------------|
| `tareas_tecnicas.md` | Plan de desarrollo detallado de ECE-DES (Sprint 1-3) |
| `AGENTE_SPEC_TARJETAS_ACCION_CPES_IMSS_v2.md` | Especificación para agentes de IA que generan tarjetas de acción |
| `catalogo_cvoed.md` | Catálogo general de recursos |

---

## 🏗️ Technical Architecture

**Stack Tecnológico:**
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES2022)
- **Base de Datos:** SQLite in-browser (sql.js con WebAssembly)
- **Exportación:** SheetJS (XLSX)
- **Persistencia:** IndexedDB + localStorage
- **Diseño:** Sistema de tokens v2.0 (doble codificación color + forma)
- **Patrón:** Single-file HTML (todo inline, 100% offline)

**Características Clave:**
- ✅ Zero dependencies operativas
- ✅ Funciona sin internet
- ✅ Portable en USB
- ✅ Diseño accesible ISO/WCAG
- ✅ Persistencia local (IndexedDB)
- ✅ Exportación Excel
- ✅ Impresión de tarjetas START

---

## 📊 Current Status

### Completed
- [x] ECE-DES core system
- [x] Dashboard analytics
- [x] Tarjeta printing engine
- [x] Simulation evaluation platform
- [x] Technical documentation
- [x] AI agent specifications

### In Progress / Technical Debt
- [x] Build system optimization (v1.1.0 - Completado)
- [x] IndexedDB persistence implementation (v1.1.0 - Completado)
- [x] Bundle size optimization (v1.1.0 - Optimizado a 1.8MB)
- [ ] Test coverage (Testing manual completado, automatizado pendiente)
- [ ] CI/CD pipeline (Pendiente)

### Known Issues
1. **LocalStorage limit:** ✅ RESUELTO - Ahora usa IndexedDB (sin límite de 5MB)
2. **Bundle size:** ✅ MEJORADO - 1.8MB ECE-DES.html, 924KB Dashboard
3. **Vanilla JS complexity:** Aceptado por diseño (portabilidad)

---

## 🎯 Roadmap

### Phase 1: Technical Cleanup
- Refactor IndexedDB persistence layer
- Optimize bundle size (target <1MB per file)
- Implement proper state management pattern

### Phase 2: Testing & Quality
- Unit tests for JavaScript modules
- Integration tests for SQLite operations
- E2E tests for user workflows

### Phase 3: Deployment
- Build automation
- Version management
- Distribution system

---

## 🔗 ADRC Integration

**Registered:** 2026-03-03
**Agent Capabilities:**
- CONTROLADOR: Architecture analysis
- EJECUTOR: Feature implementation
- QA: Testing strategy
- DOCUMENTADOR: Documentation updates

**Next Steps:**
1. Deep architecture analysis with CONTROLADOR
2. Refactoring recommendations
3. Test suite implementation
4. CI/CD pipeline setup

---

## 📝 Notes

- **Context:** FIFA World Cup 2026 Mexico
- **Target Users:** Hospital IMSS staff
- **Use Case:** Emergency response when network is unavailable
- **Critical Success Factor:** 100% offline functionality

---

*Last Updated: 2026-03-03*
*ADRC-Python Session ID: 54166d9f-065d-41f8-bb2d-c18093b77a30*
