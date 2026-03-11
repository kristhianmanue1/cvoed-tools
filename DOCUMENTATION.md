# Documentacion CVOED-Tools

## Mapa de Documentacion

### Guias Rápidas

- [README.md](README.md) - Informacion general
- [Quick Start](#quick-start) - Guia de inicio rapido

### Documentacion Tecnica

- [Arquitectura](docs/architecture/) - Diseno del sistema
- [ADRs](docs/adrs/) - Decisiones arquitectonicas
- [Guias de Desarrollo](docs/guides/) - Guias tecnicas

### Guias CPES-IMSS

- [SMV-H](docs/Guia Operativa para la respuesta ante Saldo Masivo de Victimas (SMV-H).pdf) - Saldo Masivo
- [EVAC-H](docs/Guia Operativa para la Evacuacion de hospitales y areas criticas (EVAC-H).pdf) - Evacuacion
- [BCP-H](docs/Guia Operativa para la Continuidad de Operaciones en establecimientos de salud (BCP-H).pdf) - Continuidad
- [PH-RED](docs/Guia Operativa para la elaboracion e implementacion del Plan Hospitalario de Respuesta ante Emergencias y Desastres (PH-RED).pdf) - Plan Hospitalario
- [QBRNE](docs/Guia Operativa para la respuesta ante Incidentes Intencionales QBRNE.pdf) - Incidentes Intencionales
- [Simulacros](docs/Guia Operativa para el Diseno y Ejecucion de Simulacros de Gabinete y de Campo en establecimientos de salud.pdf) - Ejecucion de Simulacros

---

## Quick Start

### Instalacion Rapida

```bash
# 1. Clonar repositorio
git clone https://github.com/IMSS-CPES/cvoed-tools.git
cd cvoed-tools

# 2. Instalar dependencias
npm install

# 3. Configurar ambiente
npm run env:dev

# 4. Ejecutar servidor
./serve.sh
```

### Acceso a Herramientas

Una vez iniciado el servidor, accede a:

- **ECE-DES:** http://localhost:8000/ECE-DES.html
- **Dashboard:** http://localhost:8000/ECE-DES-Dashboard.html
- **Tarjetas:** http://localhost:8000/ECE-DES-Tarjetas.html
- **Simulador:** http://localhost:8000/simulacro_nunca_jamas_fifa2026.html

---

## Guias por Rol

### Para Desarrolladores

Ver [docs/guides/DESARROLLO.md](docs/guides/DESARROLLO.md) para:

- Estructura del codigo fuente
- Convenciones de nomenclatura
- Guia de contribucion
- Testing y coverage

### Para Personal Clinico

- [Guia ECE-DES](docs/architecture/) - Uso del Expediente Clinico
- [Guia Simulador](docs/Ejercicio Hospital Nunca Jamas CM FIFA 2026.md) - Escenarios de entrenamiento
- [Guia SCI-H](docs/sci-hospitalario.md) - Sistema de Comando de Incidentes

### Para Personal IT

- [Configuracion de Ambiente](docs/ENV_CONFIGURATION.md) - Variables de entorno
- [Seguridad PIN](docs/PIN_HASHING_SECURITY_MIGRATION.md) - Sistema de seguridad
- [Verificacion de Build](verify-build.sh) - Script de verificacion

---

## Documentacion de Arquitectura

### Decisiones de Diseño (ADRs)

| ADR | Titulo | Fecha | Estado |
|-----|--------|-------|--------|
| [ADR-001](docs/adrs/ADR-001-jest-testing-framework.md) | Jest Testing Framework | 2026-03-04 | Aceptado |
| [ADR-002](docs/adrs/ADR-002-indexeddb-persistence.md) | IndexedDB Persistence | 2026-03-04 | Aceptado |
| [ADR-003](docs/adrs/ADR-003-inline-architecture.md) | Inline Architecture | 2026-03-04 | Aceptado |

### Especificaciones Tecnicas

- [ECE-DES Architecture](docs/architecture/) - Arquitectura del Expediente Clinico
- [Sistema de Color Dual](tools/sistema-color-dual-rams-ive.html) - Especificacion de colores

---

## Reportes y Analisis

### Reportes ADRC

- [Analisis Estructural Completo](.adrc/reports/CONTROLADOR_CVOED_ANALYSIS.md) - Arquitectura y calidad
- [Plan de Recuperacion](.adrc/reports/PLAN_RECUPERACION_85_SCORE.md) - Plan de mejora

### Diagnosticos

- [Diagnostico CVOED-Tools](docs/CVOED_TOOLS_DIAGNOSTICO_20260304.md) - Analisis inicial
- [Herramientas Completo](docs/HERRAMIENTAS_CVOED_COMPLETO_20260304.md) - Catalogo de herramientas

---

## Recursos Externos

### IMSS CPES

- [Coordinacion de Proyectos Especiales en Salud](https://www.imss.gob.mx)
- Guias operativas oficiales (ver docs/)

### Estándares

- [WCAG 2.2 AAA](https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa) - Accesibilidad web
- [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) - Licencia del proyecto

---

## Soporte y Contacto

Para mas informacion:

- **Issues:** GitHub Issues (repositorio del proyecto)
- **Documentacion:** [docs/](docs/)
- **CPES IMSS:** contacto@imss.gob.mx

---

**Ultima actualizacion:** Marzo 2026
