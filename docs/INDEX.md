# Índice de Documentación - CVOED-Tools

**Versión:** 1.1.0
**Fecha:** 2026-03-03
**Última actualización:** 2026-03-03

---

## 📚 Por Audiencia

### Para Usuarios Hospitalarios (Personal IMSS)

Documentación esencial para el uso operativo del sistema en emergencias.

- **[README.md](../README.md)** - Guía principal del sistema
  - Cómo usar las aplicaciones (doble clic)
  - Descripción de las 7 herramientas disponibles
  - Flujo de trabajo de ECE-DES (Sistema principal)
  - Sistema de triage START

- **[Catálogo General](project/catalogo_cvoed.md)** - Lista completa de herramientas
  - Aplicaciones web portátiles (HTML5)
  - Guías y normativas oficiales (PDF)
  - Descripción detallada de cada componente

### Para Desarrolladores

Documentación técnica para contribuir al proyecto.

- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Guía para contribuidores
  - Restricciones críticas del proyecto
  - Flujo de trabajo básico
  - Qué hacer y qué NO hacer

- **[Guía de Desarrollo](guides/DEVELOPMENT.md)** - Flujo de trabajo completo
  - Estructura del proyecto (src/ vs dist/)
  - Cómo editar código y construir HTMLs
  - Referencia a recursos compartidos (/*shared*/)
  - Testing manual y common issues

- **[Guía de Migración V2](guides/MIGRATION_GUIDE_V2.md)** - Migración a estructura modular
  - Cambios en la arquitectura
  - Nuevas rutas y estructura de carpetas
  - Actualización de código existente

### Para Arquitectos y Líderes Técnicos

Documentación de alto nivel sobre decisiones de diseño.

- **[Análisis de Arquitectura](architecture/ARQUITECTURA_ANALISIS_REAL.md)** - Análisis técnico completo
  - Estructura dual: Desarrollo vs Producción
  - Build process explicado
  - Componentes del sistema
  - Verificación de portabilidad

- **[Decisiones Técnicas V2](architecture/TECH_STACK_DECISION_V2.md)** - ADRs (Architecture Decision Records)
  - Por qué HTML portable vs frameworks modernos
  - Por qué SQLite in-browser vs APIs
  - Por qué IndexedDB vs localStorage
  - Por qué Vanilla JS vs TypeScript
  - Por qué Single-file vs Multi-file
  - Por qué Tokens v2.0 (Doble codificación)
  - Por qué Sin dependencias operativas

- **[Plan de Refactorización V2](architecture/REFACTORING_PLAN_V2.md)** - Plan de 6 semanas
  - Fases de mejora continua
  - Roadmap técnico detallado
  - Prioridades de desarrollo

- **[Plan de Reorganización](architecture/FILE_REORGANIZATION_PLAN.md)** - Reorganización completada
  - Nueva estructura modular (ece-des/, dashboard/, tarjetas/, shared/)
  - Código compartido extraído
  - Sistema de build actualizado

### Para QA y Testing

Documentación sobre pruebas y estado del sistema.

- **[Testing Report](reports/TESTING_REPORT.md)** - Reporte completo de pruebas
  - Verificación de portabilidad
  - Testing funcional de ECE-DES
  - Testing de persistencia IndexedDB
  - Testing de Dashboard
  - Bugs encontrados y recomendaciones

- **[Estado Actual](reports/ESTADO_ACTUAL.md)** - Análisis del estado del proyecto
  - Componentes implementados
  - Issues conocidos
  - Próximos pasos recomendados

### Reports y Estados del Proyecto

Documentos sobre el progreso y estado actual.

- **[Proyecto Completo](reports/PROYECTO_COMPLETO.md)** - Resumen ejecutivo v1.1.0
  - Fases completadas (Reorganización, Código compartido, Optimizaciones)
  - Métricas finales (Portabilidad, Tamaños, Testing)
  - Cómo usar el sistema (Usuarios y Desarrolladores)

- **[Reorganización Completada](reports/REORGANIZACION_COMPLETADA.md)** - Detalle de reorganización
  - Cambios realizados fase por fase
  - Métricas de éxito
  - Lecciones aprendidas

- **[Plan de Limpieza](reports/PLAN_LIMPIEZA_RAIZ.md)** - Limpieza técnica del proyecto
  - Archivos eliminados
  - Problemas resueltos
  - Estado final

### Especificaciones Técnicas

Documentos de especificación para desarrollo.

- **[Estado del Proyecto](project/project_state.md)** - Estado actual del proyecto
  - Información ejecutiva
  - Componentes core
  - Roadmap
  - Integración con ADRC

- **[Tareas Técnicas](technical/tareas_tecnicas.md)** - Plan de desarrollo detallado
  - Sprint 1-3 para ECE-DES
  - Tareas técnicas pendientes
  - Planificación de mejoras

- **[Spec Tarjetas Acción CPES](technical/AGENTE_SPEC_TARJETAS_ACCION_CPES_IMSS_v2.md)** - Especificación de IA
  - Generación de tarjetas de acción
  - Formatos y especificaciones técnicas
  - Integración con SCI-H

### Planificación de Tareas

- **[AGENT_TASKS_SPEC.md](../AGENT_TASKS_SPEC.md)** - Especificación de agentes IA
  - Tareas automatizadas
  - Plan de ejecución paralela
  - Coordinación de agentes

---

## 🗂️ Estructura de Documentos

```
CVOED-TOOLS v1.1.0
│
├── 📄 README.md                    # Documentación principal (¡Empieza aquí!)
├── 🚀 QUICKSTART.md               # Guía rápida (2-5 min)
├── 🤝 CONTRIBUTING.md              # Guía para contribuidores
├── 📋 CHANGELOG.md                 # Registro de cambios
├── ⚖️ LICENSE                      # Licencia Apache 2.0
│
├── 📚 docs/                        # Documentación completa
│   ├── 📋 INDEX.md                 # Este archivo - Índice maestro
│   ├── 🚀 QUICKSTART.md            # Guía rápida
│   ├── 📊 REPORTE_DOCUMENTADOR.md  # Reporte de auditoría
│   │
│   ├── 🏗️ architecture/            # Documentación arquitectónica
│   │   ├── ARQUITECTURA_ANALISIS_REAL.md
│   │   ├── REFACTORING_PLAN_V2.md
│   │   ├── TECH_STACK_DECISION_V2.md
│   │   └── FILE_REORGANIZATION_PLAN.md
│   │
│   ├── 📖 guides/                  # Guías para desarrolladores
│   │   ├── DEVELOPMENT.md
│   │   └── MIGRATION_GUIDE_V2.md
│   │
│   ├── 📦 project/                 # Documentos del proyecto
│   │   ├── catalogo_cvoed.md
│   │   └── project_state.md
│   │
│   ├── 📈 reports/                 # Reportes de estado
│   │   ├── TESTING_REPORT.md
│   │   ├── ESTADO_ACTUAL.md
│   │   ├── PLAN_LIMPIEZA_RAIZ.md
│   │   ├── PROYECTO_COMPLETO.md
│   │   └── REORGANIZACION_COMPLETADA.md
│   │
│   ├── 🔧 technical/               # Especificaciones técnicas
│   │   ├── tareas_tecnicas.md
│   │   └── AGENTE_SPEC_TARJETAS_ACCION_CPES_IMSS_v2.md
│   │
│   └── 📕 PDFs/                    # Guías IMSS oficiales
│       ├── Guía SMV-H
│       ├── SCI Hospitalario
│       ├── Guía EVAC-H
│       ├── Guía BCP-H
│       ├── Guía PH-RED
│       ├── Guía QBRNE
│       ├── Manual PHS
│       └── ... (más guías)
│
├── 🔨 src/                         # Código fuente (desarrollo)
│   ├── ece-des/                    # Módulo principal
│   ├── dashboard/                  # Módulo dashboard
│   ├── tarjetas/                   # Módulo de tarjetas
│   └── shared/                     # Código compartido
│
├── 🎯 dist/                        # HTMLs portátiles (producción)
│   ├── ECE-DES.html                # Sistema principal (1.8 MB)
│   ├── ECE-DES-Dashboard.html      # Tablero (924 KB)
│   ├── ECE-DES-Tarjetas.html       # Impresión de tarjetas
│   ├── generador_tarjetas.html     # Generador SCI-H
│   ├── guia_operativa_*.html       # Manuales digitales
│   └── simulacro_*.html            # Plataforma de evaluación
│
└── 🛠️ tools/                       # Herramientas de desarrollo
    └── build.js                    # Genera HTMLs portátiles
```

---

## 📖 Biblioteca de Guías IMSS

Guías operativas oficiales en formato PDF (ubicadas en `/docs/`):

### Manejo de Emergencias
- **Guía SMV-H** - Saldo Masivo de Víctimas
- **SCI Hospitalario** - Sistema de Comando de Incidentes
- **Marco de Respuesta Multiamenaza** - Riesgos QBRNE

### Operaciones Hospitalarias
- **Guía EVAC-H** - Evacuación de hospitales
- **Guía BCP-H** - Continuidad de Operaciones
- **Guía PH-RED** - Plan Hospitalario de Respuesta
- **Guía QBRNE** - Incidentes Químicos/Biológicos/Radiológicos

### Seguridad y Evaluación
- **Manual del Evaluador PHS** - Índice de Seguridad Hospitalaria
- **Formularios PHS** - Herramientas de evaluación
- **Ingrid-H** - Inclusión en Gestión del Riesgo

### Capacitación
- **Manual de Simulacros** - Diseño y ejecución de ejercicios
- **Ejercicio FIFA 2026** - Ejercicio "Hospital Nunca Jamás"
- **Agenda Taller CPES** - Formatos de capacitación

---

## 🎯 Flujo de Lectura Recomendado

### Nuevo Usuario Hospitalario
1. [README.md](../README.md) - Comprender el sistema
2. [Catálogo General](project/catalogo_cvoed.md) - Conocer las herramientas
3. Abrir `dist/ECE-DES.html` - Probar el sistema

### Nuevo Desarrollador
1. [README.md](../README.md) - Comprender el sistema
2. [CONTRIBUTING.md](../CONTRIBUTING.md) - Restricciones y flujo básico
3. [Guía de Desarrollo](guides/DEVELOPMENT.md) - Flujo completo
4. [Análisis de Arquitectura](architecture/ARQUITECTURA_ANALISIS_REAL.md) - Entender la arquitectura
5. [Decisiones Técnicas](architecture/TECH_STACK_DECISION_V2.md) - Por qué estas decisiones

### Arquitecto/Líder Técnico
1. [Proyecto Completo](reports/PROYECTO_COMPLETO.md) - Estado actual
2. [Análisis de Arquitectura](architecture/ARQUITECTURA_ANALISIS_REAL.md) - Arquitectura técnica
3. [Decisiones Técnicas](architecture/TECH_STACK_DECISION_V2.md) - ADRs
4. [Plan de Refactorización](architecture/REFACTORING_PLAN_V2.md) - Roadmap

---

## 📊 Versionado de Documentación

| Documento | Versión | Última Actualización |
|-----------|---------|---------------------|
| README.md | 1.0 | 2026-03-03 |
| INDEX.md | 1.0 | 2026-03-03 |
| DEVELOPMENT.md | 1.0 | 2026-03-03 |
| PROYECTO_COMPLETO.md | 1.1.0 | 2026-03-03 |
| TESTING_REPORT.md | 1.0 | 2026-03-03 |
| ARQUITECTURA_ANALISIS_REAL.md | 1.1 | 2026-03-03 |
| TECH_STACK_DECISION_V2.md | 2.0 | 2026-03-03 |

---

## 🔍 Búsqueda Rápida

### Por Tema

- **Portabilidad:** [ARQUITECTURA_ANALISIS_REAL.md](architecture/ARQUITECTURA_ANALISIS_REAL.md)
- **Build System:** [DEVELOPMENT.md](guides/DEVELOPMENT.md)
- **Testing:** [TESTING_REPORT.md](reports/TESTING_REPORT.md)
- **Migraciones:** [MIGRATION_GUIDE_V2.md](guides/MIGRATION_GUIDE_V2.md)
- **Estado del Proyecto:** [PROYECTO_COMPLETO.md](reports/PROYECTO_COMPLETO.md)
- **Decisiones Técnicas:** [TECH_STACK_DECISION_V2.md](architecture/TECH_STACK_DECISION_V2.md)

### Por Problema

- **¿Cómo construir el proyecto?** → [DEVELOPMENT.md](guides/DEVELOPMENT.md)
- **¿Por qué HTML portable?** → [TECH_STACK_DECISION_V2.md](architecture/TECH_STACK_DECISION_V2.md)
- **¿Qué módulos existen?** → [FILE_REORGANIZATION_PLAN.md](architecture/FILE_REORGANIZATION_PLAN.md)
- **¿Cómo contribuir?** → [CONTRIBUTING.md](../CONTRIBUTING.md)
- **¿Qué está implementado?** → [PROYECTO_COMPLETO.md](reports/PROYECTO_COMPLETO.md)

---

## 📝 Notas Importantes

1. **Versionado:** El proyecto está en versión 1.1.0 (post-reorganización)
2. **Estado:** Production-ready para IMSS FIFA 2026
3. **Licencia:** Apache License 2.0
4. **Contacto:** CPES - Coordinación de Proyectos Especiales en Salud (IMSS)

---

*Índice mantenido por el equipo de documentación*
*Última actualización: 2026-03-03*
