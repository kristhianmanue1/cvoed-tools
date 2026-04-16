# CVOED-TOOLS - Suite Portátil de Herramientas Hospitalarias

**Versión:** 1.1.0
**Para:** IMSS - Copa Mundial FIFA 2026
**Licencia:** Apache License 2.0
**Fecha:** Marzo 2026

**¿Nuevo aquí?** Consulta la [Guía Rápida (Quick Start)](docs/QUICKSTART.md) o el [Índice de Documentación](docs/INDEX.md)

---

## 📚 Documentación

### 📖 Guías Esenciales
- **[📚 Índice de Documentación](docs/INDEX.md)** - Catálogo completo de toda la documentación
- **[🚀 Guía Rápida (Quick Start)](docs/QUICKSTART.md)** - Para usuarios y desarrolladores (2-5 min)

### 📋 Documentación TécnicA
- **[🤝 Guía para Contribuidores](CONTRIBUTING.md)** - Restricciones y flujo de trabajo
- **[📋 Changelog](CHANGELOG.md)** - Registro de cambios
- **[🏗️ Análisis de Arquitectura](docs/architecture/ARQUITECTURA_ANALISIS_REAL.md)** - Diseño técnico completo

### 📈 Reportes y Estado
- **[📊 Estado Actual del Proyecto](docs/reports/PROYECTO_COMPLETO.md)** - Resumen ejecutivo v1.1.0
- **[🧪 Reporte de Testing](docs/reports/TESTING_REPORT.md)** - Pruebas de funcionalidad
- **[🔧 Especificaciones Técnicas](docs/technical/tareas_tecnicas.md)** - Plan de desarrollo

---

## 🎯 ¿QUÉ ES CVOED-TOOLS?

**CVOED-Tools** es una suite de **7 aplicaciones HTML5 portátiles** diseñadas para uso hospitalario durante emergencias y desastres.

### Características Clave

✅ **100% OFFLINE** - No requiere internet para funcionar
✅ **PORTÁTIL** - Cabe en una memoria USB
✅ **AUTOCONTENIDO** - Todo el código está dentro de cada archivo HTML
✅ **ZERO DEPENDENCIAS** - No hay descargas de CDNs
✅ **EJECUCIÓN DIRECTA** - Solo abrir el archivo HTML en el navegador

---

## 🚀 CÓMO ACCEDER AL SISTEMA

### Opción 1: Desde el Root (Recomendado) ⭐

1. Abre una terminal o finder en `/Users/krisnova/www/cvoed-tools/`
2. **Doble clic** en `index.html` (o arrástralo al navegador)
3. El sistema te redirigirá **automáticamente** al portal principal

```
index.html (root)
    ↓ (redirección automática)
dist/index.html (portal principal)
    ↓
7 aplicaciones HTML5 portátiles
```

### Opción 2: Directo a dist/

1. Navega a `/Users/krisnova/www/cvoed-tools/dist/`
2. **Doble clic** en `index.html`
3. Accede directamente a las 7 aplicaciones

### Copiar a USB (Portable)

```bash
# Copiar solo lo esencial (2.8 MB)
cp -r dist/ /Volumes/TU_USB/CVOED-Tools/

# En la USB, abre:
/Volumes/TU_USB/CVOED-Tools/index.html
```

> **⚠️ IMPORTANTE:** Este sistema **NO requiere servidor web**. Solo abre el archivo HTML directamente en tu navegador (protocolo `file://`).

---

## 🚀 CÓMO USAR ESTE SISTEMA

### Para Usuarios Hospitalarios (Producción)

**Método 1: Doble Clic (Más Fácil)**

1. Ve a la carpeta `dist/`
2. Localiza el archivo HTML que deseas usar
3. **Doble clic** para abrirlo en tu navegador
4. ¡Listo! La aplicación está funcionando

**No hay nada que instalar.**

### Método 2: Navegador

1. Abre tu navegador (Chrome, Firefox, Edge)
2. **Arrastra** el archivo HTML a la ventana
3. Suelta para abrir la aplicación

---

## 📦 APLICACIONES DISPONIBLES

| Archivo | Tamaño | Descripción | Uso |
|---------|--------|-------------|-----|
| **index.html** | 14 KB | 🚪 Portal principal | Navegación entre aplicaciones |
| **ECE-DES.html** | 1.8 MB | 🏥 Expediente Clínico Electrónico | Registro de pacientes en emergencias |
| **ECE-DES-Dashboard.html** | 919 KB | 📊 Tablero de Control | Reportes directivos y métricas |
| **ECE-DES-Tarjetas.html** | 13 KB | 🖨️ Motor de Impresión | Imprimir tarjetas START |
| **generador_tarjetas.html** | 117 KB | 🎩 Generador de Tarjetas SCI-H | Crear chalecos y funciones de comando |
| **guia_operativa_nunca_jamas.html** | 41 KB | 📖 Manual Digital | Protocolos operativos |
| **simulacro_nunca_jamas_fifa2026.html** | 84 KB | 🎭 Plataforma de Simulacro | Evaluación de ejercicios |

**Tamaño total:** ~3 MB (cabe en cualquier USB)

---

## 🏠 ECE-DES: SISTEMA PRINCIPAL

### ¿Qué es?

**ECE-DES (Expediente Clínico Electrónico para Desastres)** es la aplicación principal para registrar pacientes durante un **Saldo Masivo de Víctimas**.

### Flujo de Trabajo

1. **INICIO**
   - Abre `dist/ECE-DES.html`
   - Ingresa:
     - Hospital (ej: "Hospital General")
     - Tu nombre (ej: "Dr. Martínez")
     - PIN de 4 dígitos (solo para registro local)

2. **REGISTRO DE PACIENTES**
   - Click "NUEVO PACIENTE"
   - Ingresa nombre (o deja vacío para "NN")
   - Selecciona nivel de triage:
     - **R** = ROJO (Crítico)
     - **A** = AMARILLO (Urgente)
     - **V** = VERDE (Leve)
     - **N** = NEGRO (Sin vida)

3. **CENSO EN TIEMPO REAL**
   - Contadores automáticos por nivel
   - Lista de pacientes actualizada
   - Búsqueda por folio o nombre

4. **EXPEDIENTE CLÍNICO**
   - Click "VER DETALLE" en cualquier paciente
   - Ver línea de tiempo con eventos clínicos
   - Agregar: notas, medicación, cambios de triage
   - Imprimir brazalete del paciente

5. **EXPORTACIÓN DE DATOS**
   - Click "Exportar Excel" → Archivo .xlsx con todos los datos
   - Click "Backup DB" → Archivo .sqlite (copia de seguridad)

---

## 🗄️ BASE DE DATOS (SQLite in-browser)

**Tecnología:** sql.js (SQLite compilado a WebAssembly)

### Características

- ✅ **100% local** - Los datos nunca salen de tu computadora
- ✅ **Persistencia automática** - Se guarda en IndexedDB del navegador
- ✅ **Sin límite de tamaño** - A diferencia de localStorage (5MB), IndexedDB maneja miles de pacientes
- ✅ **Exportación** - Puedes llevar los datos en Excel o SQLite

### ¿Dónde se guardan los datos?

```
Navegador → IndexedDB → "ECEDES_DB" → sqlite_backup
```

Los datos **NO se pierden** si cierras el navegador.

---

## 📋 SISTEMA DE TRIAGE START

El sistema usa el estándar internacional **START (Simple Triage and Rapid Treatment)**:

| Color | Símbolo | Significado | Tiempo de Atención |
|-------|---------|-------------|-------------------|
| 🔴 **ROJO** | ◆ | Crítico | Inmediata (segundos) |
| 🟡 **AMARILLO** | ▲ | Urgente | Minutos (hasta 1 hora) |
| 🟢 **VERDE** | ● | Leve | Puede esperar (horas) |
| ⚫ **NEGRO** | ✚ | Sin vida | No requiere intervención |

---

## 🎨 SISTEMA DE DISEÑO

### Tokens v2.0

Todas las aplicaciones usan el **Sistema de Tokens v2.0** con:

#### Doble Codificación Color + Forma

Para accesibilidad universal (incluyendo personas daltónicas):

- **ROJO** = Color (#C41E3A) + Diamante (◆)
- **AMARILLO** = Color (#D4940A) + Triángulo (▲)
- **VERDE** = Color (#1B7340) + Círculo (●)
- **NEGRO** = Color (#1A1A2E) + Cruz (✚)

#### Colores Institucionales

- **Guinda** (#691C32) - Gobierno de México 2024-2030
- **Dorado** (#BC955C) - Escudo institucional
- **Verde IMSS** (#006657) - Identidad corporativa

---

## 💾 PERSISTENCIA DE DATOS

### IndexedDB vs localStorage

**LocalStorage (NO usado):**
- ❌ Límite de 5 MB
- ❌ Solo guarda strings
- ❌ Bloquea el navegador al guardar

**IndexedDB (USADO):**
- ✅ Sin límite práctico de tamaño
- ✅ Guarda datos binarios (SQLite WASM)
- ✅ Asíncrono (no bloquea navegador)
- ✅ Persistente entre sesiones

---

## 🛠️ ARQUITECTURA TÉCNICA

### Estructura del Proyecto

```
🎯 CVOED-TOOLS v1.1.0 - Suite Portátil para IMSS FIFA 2026
│
├── 📄 README.md                    # 📖 Documentación principal (¡Empieza aquí!)
├── 🚀 QUICKSTART.md               # ⚡ Guía rápida (2-5 min)
├── 🤝 CONTRIBUTING.md              # 👥 Guía para contribuidores
├── 📋 CHANGELOG.md                 # 📝 Registro de cambios
├── ⚖️ LICENSE                      # 📜 Licencia Apache 2.0
│
├── 📚 docs/                        # 📚 Documentación completa
│   ├── 📋 INDEX.md                 # 🗂️ Índice maestro
│   ├── 🚀 QUICKSTART.md            # ⚡ Guía rápida
│   ├── 📊 REPORTE_DOCUMENTADOR.md  # 📋 Reporte de auditoría
│   ├── 🏗️ architecture/            # 🏗️ Documentación arquitectónica
│   ├── 📖 guides/                  # 📖 Guías para desarrolladores
│   ├── 📦 project/                 # 📦 Documentos del proyecto
│   ├── 📈 reports/                 # 📈 Reportes de estado
│   ├── 🔧 technical/               # 🔧 Especificaciones técnicas
│   └── 📕 PDFs/                    # 📕 Guías IMSS oficiales
│
├── 🔨 src/                         # 🔨 Código fuente (desarrollo)
│   ├── ece-des/                    # 🏥 Módulo principal
│   ├── dashboard/                  # 📊 Módulo dashboard
│   ├── tarjetas/                   # 🖨️ Módulo de tarjetas
│   └── shared/                     # 🔗 Código compartido
│
├── 🎯 dist/                        # 🎯 HTMLs portátiles (producción)
│   ├── ECE-DES.html                # 🏥 Sistema principal (1.8 MB)
│   ├── ECE-DES-Dashboard.html      # 📊 Tablero (924 KB)
│   ├── ECE-DES-Tarjetas.html       # 🖨️ Impresión de tarjetas
│   ├── generador_tarjetas.html     # 🎩 Generador SCI-H
│   ├── guia_operativa_*.html       # 📖 Manuales digitales
│   └── simulacro_*.html            # 🎭 Plataforma de evaluación
│
└── 🛠️ tools/                       # 🛠️ Herramientas de desarrollo
    └── build.js                    # 🔨 Genera HTMLs portátiles
```

### Stack Tecnológico (100% Inline)

```
HTML5
  ├── CSS3 (Tokens v2.0 inline)
  ├── JavaScript (ES2022)
  │   ├── sql.js WASM (1.2 MB inline)
  │   ├── SheetJS XLSX (400 KB inline)
  │   └── Lógica de aplicación
  └── IndexedDB (nativo del navegador)
```

### Por qué Todo Inline?

1. **Portabilidad** - Un solo archivo contiene todo
2. **Offline** - No hay request HTTP externos
3. **Seguridad** - No hay dependencias de terceros
4. **Simplicidad** - El usuario no tiene que configurar nada

---

## 👨‍💻 PARA DESARROLLADORES

### Flujo de Trabajo de Desarrollo

```
1. Editar código en src/
   ↓
2. Ejecutar: cd tools && node build.js
   ↓
3. Probar HTML en dist/
   ↓
4. Si funciona → Commit
```

### Construir HTMLs Portátiles

```bash
cd tools
node build.js
```

Esto generará los archivos HTML autocontenidos en `dist/`.

### Documentación Técnica

Ver carpeta `docs/` para:
- Análisis arquitectónico completo
- Plan de refactorización
- Decisiones técnicas (ADRs)
- Guía de migración
- Plan de reorganización de archivos

---

## 📖 GUÍAS DE OPERATIVA

En la carpeta `docs/pdf/` encontrarás las guías oficiales del IMSS:

- **Guía SMV-H** - Saldo Masivo de Víctimas
- **Guía SCI-H** - Sistema de Comando de Incidentes Hospitalario
- **Guía EVAC-H** - Evacuación de hospitales
- **Guía BCP-H** - Continuidad de Operaciones
- **Guía PH-RED** - Plan Hospitalario de Respuesta
- **Guía QBRNE** - Incidentes Químicos/Biológicos
- **Manual del Evaluador PHS** - Índice de Seguridad Hospitalaria

---

## ⚠️ REQUISITOS DEL SISTEMA

### Navegador Compatible

Cualquier navegador moderno con soporte de:
- HTML5
- IndexedDB
- WebAssembly (WASM)

**Recomendados:**
- Chrome 90+ (Windows/Mac/Android)
- Edge 90+ (Windows)
- Firefox 88+ (Windows/Mac/Linux)
- Safari 15+ (Mac/iOS)

### Hardware

- **Mínimo:** Cualquier computadora fabricada después de 2015
- **Recomendado:** 4GB RAM o más
- **Almacenamiento:** Al menos 100 MB libres para IndexedDB

---

## 🔐 SEGURIDAD Y PRIVACIDAD

### Datos 100% Locales

- ✅ Los datos **NUNCA salen** de tu computadora
- ✅ No hay comunicación con servidores externos
- ✅ No hay telemetría ni analytics
- ✅ No hay "phone home"

### Autenticación

El PIN de 4 dígitos es **solo un registro local**:
- No se envía a ningún servidor
- Sirve para auditoría local
- No hay encriptación real (por diseño, para emergencias)

---

## 📊 MÉTRICAS DEL SISTEMA

| Métrica | Valor |
|----------|-------|
| **Tamaño total** | ~3 MB |
| **Aplicaciones** | 7 HTML files |
| **Líneas de código** | ~8,500 |
| **Dependencias externas** | 0 |
| **Requisito de red** | Ninguno |
| **Tiempo de carga** | <5 segundos |

---

## 🚨 DESPLIEGUE EN EMERGENCIAS

### Escenario de Uso Típico

1. **Alerta de emergencia** (ej: terremoto, multitud de heridos)
2. **Coordinador** abre `dist/ECE-DES.html` en su laptop
3. **Ingresa** hospital, nombre, PIN
4. **Comienza** registro rápido de pacientes (START triage)
5. **Personal** en triage asigna niveles (ROJO/AMARILLO/VERDE/NEGRO)
6. **Dashboard** se actualiza en tiempo real
7. **Al finalizar**, exportan a Excel para reportes oficiales

### Ventajas Operativas

- ✅ **Cero dependencias operativas** - No falla por falta de red
- ✅ **Inmediato** - No hay tiempo de configuración
- ✅ **Formación** - El personal ya conoce el flujo START
- ✅ **Portabilidad** - Cabe en USB, se mueve entre computadoras

---

## 🔄 VERSIONADO Y CAMBIOS

### Versión Actual

**Versión:** 1.1.0
**Fecha:** Marzo 2026
**Contexto:** Copa Mundial FIFA 2026
**Estado:** Production-ready con estructura modular refactorizada

### Registro de Cambios

Ver `docs/ARQUITECTURA_ANALISIS_REAL.md` para historial completo.

---

## 📞 SOPORTE

### Para Usuarios Hospitalarios

- **CPES (Coordinación de Proyectos Especiales en Salud)**
- Contacto a través de canales oficiales del IMSS

### Para Desarrolladores

- **Código Fuente:** Disponible en este repositorio
- **Documentación Técnica:** Ver archivos en `docs/`
- **Licencia:** Apache License 2.0 (permite modificación y distribución)

---

## 📄 LICENCIA

```
Copyright 2026 Kristhian Manuel Jimenez y Dra. Carla Abril Perez

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

---

## 🤝 Contributing

Para contribuir al desarrollo de CVOED-Tools, consulta el archivo [CONTRIBUTING.md](CONTRIBUTING.md) para obtener instrucciones detalladas sobre el flujo de trabajo y las restricciones críticas del proyecto.

## 📈 Changelog

Consulta el archivo [CHANGELOG.md](CHANGELOG.md) para ver un registro de todos los cambios notables en el proyecto.

## 📊 Progreso de Desarrollo v2.0

### Plan Técnico de 5 Fases

**Fecha de inicio:** 2026-03-04
**Timeline:** 12 semanas
**Versión objetivo:** 2.0.0

#### Estado Actual

```
Fase 1: Foundation     ████████░░  80%   (8/10 tareas)
Fase 2: Quality        ░░░░░░░░░░░   0%   (0/45 tareas)
Fase 3: Enhancement    ░░░░░░░░░░░   0%   (0/30 tareas)
Fase 4: Automation     ░░░░░░░░░░░   0%   (0/15 tareas)
Fase 5: Evolution      ░░░░░░░░░░░   0%   (0/10 tareas)
                       ─────────────────
                       Total: 8/110 tareas (7.3%)
```

#### Logros Recientes (Día 1)

- [x] Plan técnico de 5 fases creado y documentado
- [x] Jest framework configurado
- [x] Estructura de pruebas establecida
- [x] Mocks de localStorage e IndexedDB implementados
- [x] Directorios de documentación creados

#### Métricas de Testing

| Métrica | Actual | Target (Fase 2) |
|---------|--------|-----------------|
| Tests creados | 0 | 110 |
| Coverage | 0% | 85% |
| Integration tests | 0 | 65 |
| E2E tests | 0 | 45 |

#### Documentación de Progreso

- **[Log de Progreso Diario](docs/progress/PROGRESO_DIARIO_20260304.md)** - Seguimiento día a día
- **[Reporte de Testing](docs/testing/TESTING_REPORT_20260304.md)** - Métricas y estado de pruebas
- **[Plan Técnico Completo](docs/technical/PLAN_TECNICO_5_FASES_20260304.md)** - 110 tareas detalladas

#### Architecture Decision Records (ADRs)

| ADR | Título | Estado |
|-----|--------|--------|
| [ADR-001](docs/adrs/ADR-001-jest-testing-framework.md) | Jest Testing Framework | Aceptado |
| [ADR-002](docs/adrs/ADR-002-indexeddb-persistence.md) | IndexedDB Persistence | Aceptado |
| [ADR-003](docs/adrs/ADR-003-inline-architecture.md) | Inline Architecture | Aceptado |

---

## 📚 Documentación Completa

Para explorar toda la documentación del proyecto, consulta el [Índice de Documentación](docs/INDEX.md) donde encontrarás:

- Guías para usuarios hospitalarios
- Documentación para desarrolladores
- Análisis de arquitectura
- Reportes de estado y testing
- Decisiones técnicas

## 📄 License

Este proyecto está licenciado bajo la Licencia Apache 2.0. Consulta el archivo [LICENSE](LICENSE) para obtener más detalles.

---

## 🎯 PROPÓSITO FINAL

**CVOED-Tools existe para salvar vidas.**

Durante una emergencia o desastre, cuando los sistemas convencionales pueden fallar, esta suite portátil garantiza que el personal hospitalario pueda:

1. ✅ Registrar pacientes rápidamente
2. ✅ Trazar pacientes en tiempo real
3. ✅ Priorizar atención según gravedad
4. ✅ Generar reportes oficiales
5. ✅ Todo sin depender de internet o servidores externos

**En una emergencia, cada segundo cuenta. CVOED-Tools está diseñado para no fallar.**

---

*Última actualización: Marzo 2026*
*Para uso en IMSS - Copa Mundial FIFA 2026*
