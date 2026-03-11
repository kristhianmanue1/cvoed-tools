# 🔵 PLAN DE RECUPERACIÓN - CVOED-TOOLS HACIA 85/100
## Plan Maestro para Salir de Riesgo (52/100 → 85/100)

**Fecha:** 2026-03-10
**Estado Actual:** 🔴 52/100 (PROYECTO EN RIESGO)
**Objetivo:** 🟢 85/100 (SALUDABLE)
**Plazo:** 4 sprints (2 semanas c/u) = 8 semanas
**Contexto:** IMSS FIFA 2026 - Sistemas Portátiles

---

## 📊 ANÁLISIS ACTUALIZADO CON NUEVO MÓDULO

### Nuevo Módulo: Simulador de Emergencias
```
simulacro_nunca_jamas_fifa2026.html
├── Tamaño: 132 KB (portátil)
├── Líneas: 2,951 LOC
├── Funciones: 421
├── Características:
│   ├── 3 escenarios (S1 Sismo, S2 Explosión, S3 FIFA)
│   ├── Sistema de color dual (RAMS-IVE)
│   ├── Modo oscuro/claro
│   ├── Voz SCI-H
│   └── WCAG AAA (7:1+ contraste)
```

**IMPACTO EN MÉTRICAS:**
- Archivos fuente: 10 → 11 JS (antes sin simulacro)
- LOC total: ~4,000 → ~6,951 LOC (+73%)
- Complejidad: Alta (simulador tiene 421 funciones)

---

## 🎯 PLAN DE RECUPERACIÓN: 52/100 → 85/100

### Objetivos por Categoría

| Categoría | Actual | Objetivo | Delta | Prioridad |
|-----------|--------|----------|-------|-----------|
| **Testing** | 25/100 | 85/100 | +60 | 🔴 P0 |
| **Documentación** | 70/100 | 90/100 | +20 | 🟡 P1 |
| **Code Quality** | 30/100 | 85/100 | +55 | 🔴 P0 |
| **Architecture** | 75/100 | 85/100 | +10 | 🟢 P2 |
| **CI/CD** | 20/100 | 80/100 | +60 | 🟡 P1 |
| **TOTAL** | **52/100** | **85/100** | **+33** | |

---

## 📅 ROADMAP POR SPRINTS

### 🏃 SPRINT 1: Fundamentos de Calidad (Semana 1-2)
**Objetivo:** Subir de 52/100 → 62/100

#### 🔴 P0 - Testing Crítico
- [ ] **T1.1:** Ejecutar `npm run test:coverage` y obtener baseline real
- [ ] **T1.2:** Crear tests unitarios para simulador (mínimo 50 tests)
- [ ] **T1.3:** Alcanzar 60% coverage total
- [ ] **T1.4:** Instalar y configurar ESLint + Airbnb config
- [ ] **T1.5:** Corregir todos los errores ESLint críticos

#### 🟡 P1 - Documentación Base
- [ ] **T1.6:** Crear README.md completo
- [ ] **T1.7:** Crear DOCUMENTATION.md con estructura de proyecto

#### Entregables Sprint 1
- Coverage report mostrando 60%
- ESLint configurado con 0 errores
- README.md publicado

---

### 🚀 SPRINT 2: Consolidación de Testing (Semana 3-4)
**Objetivo:** Subir de 62/100 → 72/100

#### 🔴 P0 - Testing Avanzado
- [ ] **T2.1:** Crear suite de tests de integración (mínimo 10 tests)
- [ ] **T2.2:** Crear tests para ECE-DES (expediente clínico)
- [ ] **T2.3:** Crear tests para Dashboard (tablero)
- [ ] **T2.4:** Crear tests para Simulador (3 escenarios)
- [ ] **T2.5:** Alcanzar 85% coverage total (objetivo L6)

#### 🟡 P1 - Code Quality
- [ ] **T2.6:** Instalar y configurar Prettier
- [ ] **T2.7:** Configurar pre-commit hooks (Husky)
- [ ] **T2.8:** Ejecutar Prettier en todo el codebase

#### Entregables Sprint 2
- Coverage 85% (cumple L6)
- Tests de integración funcionando
- Code formateado con Prettier

---

### 🏗️ SPRINT 3: Arquitectura y Modularización (Semana 5-6)
**Objetivo:** Subir de 72/100 → 80/100

#### 🟢 P2 - Architecture
- [ ] **T3.1:** Modularizar app.js (982 LOC → <300 LOC por módulo)
- [ ] **T3.2:** Extraer simulador a módulos separados
- [ ] **T3.3:** Crear ARCHITECTURE.md en root
- [ ] **T3.4:** Documentar patrones de diseño usados

#### 🟡 P1 - CI/CD
- [ ] **T3.5:** Configurar GitHub Actions para tests
- [ ] **T3.6:** Configurar GitHub Actions para coverage
- [ ] **T3.7:** Configurar GitHub Actions para ESLint

#### Entregables Sprint 3
- app.js modularizado en ≤300 LOC
- CI/CD configurado en GitHub
- ARCHITECTURE.md publicado

---

### ✨ SPRINT 4: Excelencia y Documentación (Semana 7-8)
**Objetivo:** Subir de 80/100 → 85/100

#### 🟡 P1 - Documentación Excelente
- [ ] **T4.1:** Crear CHANGELOG.md con formato Keep a Changelog
- [ ] **T4.2:** Crear CONTRIBUTING.md para nuevos desarrolladores
- [ ] **T4.3:** Crear API_DOCS.md para módulos internos
- [ ] **T4.4:** Documentar sistema de color dual (RAMS-IVE)

#### 🔵 P2 - Testing E2E
- [ ] **T4.5:** Implementar tests E2E con Playwright (mínimo 5)
- [ ] **T4.6:** Configurar visual regression tests
- [ ] **T4.7:** Alcanzar 90% coverage (excelencia)

#### Entregables Sprint 4
- Documentación completa (90/100)
- Tests E2E funcionando
- Health Score 85/100 🟢

---

## 👥 ESTRATEGIA MULTI-AGENTE

### Agentes a Lanzar (Paralelo cuando sea posible)

#### 🔵 AGENTE EJECUTOR (Desarrollador)
**Responsabilidad:** Implementación de código y modularización
**Tareas:**
- Modularizar app.js (Sprint 3)
- Extraer simulador a módulos
- Implementar fixes de ESLint
- Crear nueva funcionalidad

#### 🟢 AGENTE QA (Quality Assurance)
**Responsabilidad:** Testing y calidad de código
**Tareas:**
- Crear tests unitarios (Sprint 1-2)
- Crear tests de integración (Sprint 2)
- Crear tests E2E (Sprint 4)
- Ejecutar y reportar coverage

#### 🟡 AGENTE DOCUMENTADOR (Technical Writer)
**Responsabilidad:** Documentación técnica
**Tareas:**
- Crear README.md (Sprint 1)
- Crear ARCHITECTURE.md (Sprint 3)
- Crear CHANGELOG.md (Sprint 4)
- Crear CONTRIBUTING.md (Sprint 4)

---

## 🔄 EJECUCIÓN PARALELA DE AGENTES

### Fase 1 (Sprint 1-2): Testing + Documentación Base
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  AGENTE QA      │     │ AGENTE EJECUTOR │     │ AGENTE DOC      │
│                 │     │                 │     │                 │
│ • Tests unit    │     │ • ESLint setup  │     │ • README.md     │
│ • Coverage 60%  │     │ • Fixes críticos│     │ • Docs base     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        └───────────────────────┴───────────────────────┘
                                │
                        checkpoint: 62/100
```

### Fase 2 (Sprint 3): Architecture + CI/CD
```
┌─────────────────┐     ┌─────────────────┐
│ AGENTE EJECUTOR │     │  AGENTE QA      │
│                 │     │                 │
│ • Modularización│     │ • Tests integr. │
│ • Refactor      │     │ • Coverage 85%  │
└─────────────────┘     └─────────────────┘
        │                       │
        └───────────────────────┘
                │
        checkpoint: 72/100
```

### Fase 3 (Sprint 4): Excelencia
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  AGENTE QA      │     │ AGENTE DOCUMENT │     │ AGENTE EJECUTOR │
│                 │     │                 │     │                 │
│ • Tests E2E     │     │ • CHANGELOG.md  │     │ • Optimización  │
│ • Coverage 90%  │     │ • Contributing  │     │ • Polishing     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        └───────────────────────┴───────────────────────┘
                                │
                    objetivo: 85/100 🟢
```

---

## 📋 TAREAS ESPECÍFICAS PARA AGENTES

### 🔵 AGENTE EJECUTOR (Ejecución Inmediata)

#### Tarea EJEC-001: Configurar ESLint (P0)
```bash
# Prioridad: P0 - Bloqueante
# Tiempo estimado: 2 horas
# Agente: EJECUTOR
```
- Instalar eslint y eslint-config-airbnb-base
- Configurar .eslintrc.js
- Corregir errores críticos en src/
- Verificar cero errores

#### Tarea EJEC-002: Modularizar app.js (P2)
```bash
# Prioridad: P2 - Sprint 3
# Tiempo estimado: 8 horas
# Agente: EJECUTOR
```
- Dividir app.js (982 LOC) en módulos ≤300 LOC
- Crear estructura:
  - `src/ece-des/js/core/`
  - `src/ece-des/js/ui/`
  - `src/ece-des/js/db/`
  - `src/ece-des/js/services/`

#### Tarea EJEC-003: Extraer Simulador a Módulos (P2)
```bash
# Prioridad: P2 - Sprint 3
# Tiempo estimado: 12 horas
# Agente: EJECUTOR
```
- Separar simulacro_nunca_jamas_fifa2026.html
- Extraer CSS a archivo separado
- Extraer JS a módulos
- Mantener portabilidad (bundle en dist/)

#### Tarea EJEC-004: Configurar Prettier (P1)
```bash
# Prioridad: P1 - Sprint 2
# Tiempo estimado: 2 horas
# Agente: EJECUTOR
```
- Instalar prettier y eslint-config-prettier
- Crear .prettierrc
- Formatear todo el codebase

#### Tarea EJEC-005: Configurar Husky Pre-commit (P1)
```bash
# Prioridad: P1 - Sprint 2
# Tiempo estimado: 3 horas
# Agente: EJECUTOR
```
- Instalar husky y lint-staged
- Configurar hooks para ESLint y Prettier
- Verificar funcionamiento

---

### 🟢 AGENTE QA (Ejecución Inmediata)

#### Tarea QA-001: Ejecutar Coverage Baseline (P0)
```bash
# Prioridad: P0 - Bloqueante
# Tiempo estimado: 1 hora
# Agente: QA
```
- Ejecutar `npm run test:coverage`
- Generar reporte baseline
- Identificar archivos sin testear
- Documentar gaps

#### Tarea QA-002: Tests Unitarios Simulador (P0)
```bash
# Prioridad: P0 - Sprint 1
# Tiempo estimado: 12 horas
# Agente: QA
```
- Crear `tests/unit/simulador.test.js`
- Tests para 3 escenarios (S1, S2, S3)
- Tests para sistema de color dual
- Tests para voz SCI-H
- Al menos 50 tests

#### Tarea QA-003: Tests de Integración (P0)
```bash
# Prioridad: P0 - Sprint 2
# Tiempo estimado: 16 horas
# Agente: QA
```
- Crear `tests/integration/db-integration.test.js`
- Crear `tests/integration/ui-integration.test.js`
- Crear `tests/integration/simulador-integration.test.js`
- Probar flujos completos

#### Tarea QA-004: Alcanzar 85% Coverage (P0)
```bash
# Prioridad: P0 - Sprint 2
# Tiempo estimado: 20 horas
# Agente: QA
```
- Crear tests hasta alcanzar 85%
- Documentar líneas sin cobertura
- Justificar excepciones si las hay

#### Tarea QA-005: Tests E2E con Playwright (P2)
```bash
# Prioridad: P2 - Sprint 4
# Tiempo estimado: 16 horas
# Agente: QA
```
- Instalar Playwright
- Crear 5 tests E2E mínimos
- Probar: login → registro → exportación

---

### 🟡 AGENTE DOCUMENTADOR (Ejecución Inmediata)

#### Tarea DOC-001: Crear README.md (P1)
```bash
# Prioridad: P1 - Sprint 1
# Tiempo estimado: 4 horas
# Agente: DOCUMENTADOR
```
Estructura requerida:
```markdown
# CVOED-Tools

## 🎯 Propósito
Suite portátil de herramientas hospitalarias...

## 🚀 Quick Start
\`\`\`bash
npm install
npm run build
npm run test:coverage
\`\`\`

## 📁 Estructura del Proyecto
## 🧪 Testing
## 📖 Documentación
## 🤝 Contribución
## 📄 Licencia
```

#### Tarea DOC-002: Crear DOCUMENTATION.md (P1)
```bash
# Prioridad: P1 - Sprint 1
# Tiempo estimado: 6 horas
# Agente: DOCUMENTADOR
```
- Mapa de documentación existente
- Guía rápida para encontrar información
- Índice de guías CPES-IMSS

#### Tarea DOC-003: Crear ARCHITECTURE.md (P2)
```bash
# Prioridad: P2 - Sprint 3
# Tiempo estimado: 8 horas
# Agente: DOCUMENTADOR
```
- Diagrama de arquitectura
- Flujo de datos
- Patrones de diseño
- Decisiones arquitectónicas (ADRs)

#### Tarea DOC-004: Crear CHANGELOG.md (P1)
```bash
# Prioridad: P1 - Sprint 4
# Tiempo estimado: 4 horas
# Agente: DOCUMENTADOR
```
- Formato: Keep a Changelog
- Registrar cambios desde v1.0.0
- Incluir nuevo módulo simulador

#### Tarea DOC-005: Documentar Sistema de Color (P2)
```bash
# Prioridad: P2 - Sprint 4
# Tiempo estimado: 6 horas
# Agente: DOCUMENTADOR
```
- Documentar RAMS-IVE Clinical
- Explicar modo oscuro/claro
- Guía de uso de tokens de color
- Ejemplos de implementación

---

## 📊 MÉTRICAS DE ÉXITO

### Checkpoints por Sprint

| Sprint | Health Score | Coverage | ESLint | Docs | Estado |
|--------|--------------|----------|--------|------|--------|
| Inicio | 52/100 | ~40% | ❌ | 70% | 🔴 Riesgo |
| Sprint 1 | 62/100 | 60% | ✅ | 75% | 🟡 Alerta |
| Sprint 2 | 72/100 | 85% | ✅ | 80% | 🟢 Recuperando |
| Sprint 3 | 80/100 | 85% | ✅ | 85% | 🟢 Saludable |
| Sprint 4 | 85/100 | 90% | ✅ | 90% | 🟢 Excelente |

---

## 🚀 EJECUCIÓN INMEDIATA

### Agentes a Lanzar (Paralelo)

1. **AGENTE EJECUTOR:** ESLint setup + Fixes
2. **AGENTE QA:** Coverage baseline + Tests unitarios simulador
3. **AGENTE DOCUMENTADOR:** README.md + DOCUMENTATION.md

### Comandos de Lanzamiento

```bash
# Agente EJECUTOR - P0
adrc agent launch ejecutor \
  --task "EJEC-001: Configurar ESLint" \
  --priority P0

# Agente QA - P0
adrc agent launch qa \
  --task "QA-001: Coverage baseline + QA-002: Tests simulador" \
  --priority P0

# Agente DOCUMENTADOR - P1
adrc agent launch documentador \
  --task "DOC-001: README.md" \
  --priority P1
```

---

## 📋 RESUMEN EJECUTIVO

### Situación Actual
- 🔴 Health Score: 52/100 (RIESGO)
- 🚨 3 violaciones P0 del Decálogo Soberano
- ⚠️ Nuevo módulo simulador (+73% LOC) sin tests

### Plan de Recuperación
- 🎯 Objetivo: 85/100 (SALUDABLE)
- ⏱️ Plazo: 8 semanas (4 sprints)
- 👥 Estrategia: Multi-agente paralelo
- 📦 Entregables: Coverage 90%, ESLint, README, Tests E2E

### Próximos Pasos
1. ✅ Lanzar agentes en paralelo
2. ✅ Sprint 1: Fundamentos (62/100)
3. ✅ Sprint 2: Testing (72/100)
4. ✅ Sprint 3: Architecture (80/100)
5. ✅ Sprint 4: Excelencia (85/100)

---

**Plan aprobado por:** CONTROLADOR (ADRC 2.0)
**Fecha:** 2026-03-10
**Próxima revisión:** Post-Sprint 1 (2026-03-24)

---

*"El riesgo no está en no alcanzar el objetivo, sino en no tener un objetivo para alcanzar."*
