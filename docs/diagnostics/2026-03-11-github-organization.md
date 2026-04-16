# 📁 Estructura de Proyecto para Publicación en GitHub

## Organización de Archivos y Directorios

### 🎯 Estructura Recomendada

```
cvoed-tools/
│
├── 📄 README.md                    ✅ Actualizado con créditos completos
├── 📄 LICENSE                      ✅ Apache 2.0 con autores
├── 📄 CONTRIBUTING.md              ✅ Guía de contribución
├── 📄 CHANGELOG.md                 ⚠️  Por crear
├── 📄 .gitignore                   ✅ Configurado
├── 📄 package.json                 ✅ Configurado
├── 📄 package-lock.json            ✅ Generado
├── 📄 jest.config.js               ✅ Configurado
├── 📄 .eslintrc.js                 ✅ Configurado
├── 📄 .prettierrc                  ✅ Configurado
│
├── 📁 .github/
│   ├── 📄 CODE_OF_CONDUCT.md       ✅ Creado
│   ├── 📁 workflows/
│   │   ├── 📄 html-header-template.txt  ✅ Template de comentarios
│   │   ├── 📄 ci.yml               ⚠️  Por crear (GitHub Actions)
│   │   └── 📄 deploy.yml           ⚠️  Por crear
│   ├── 📁 ISSUE_TEMPLATE/
│   │   ├── bug_report.md           ⚠️  Por crear
│   │   ├── feature_request.md      ⚠️  Por crear
│   │   └── documentation.md        ⚠️  Por crear
│   └── 📁 PULL_REQUEST_TEMPLATE.md ⚠️  Por crear
│
├── 📁 src/                         # Código fuente
│   ├── ece-des/
│   │   ├── index.html
│   │   ├── css/
│   │   ├── js/
│   │   └── README.md
│   ├── dashboard/
│   ├── simulador/
│   ├── tarjetas/
│   ├── shared/
│   └── config/
│
├── 📁 dist/                        # Build de producción (portátil)
│   ├── index.html                  ✅ Portal principal actualizado
│   ├── ECE-DES.html
│   ├── ECE-DES-Dashboard.html
│   ├── ECE-DES-Tarjetas.html
│   ├── generador_tarjetas.html
│   ├── simulacro_nunca_jamas_fifa2026.html
│   ├── guia_operativa_nunca_jamas.html
│   ├── simulador-bundle.js
│   └── simulador.css
│
├── 📁 tests/                       # Suite de pruebas
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── performance/
│
├── 📁 docs/                        # Documentación
│   ├── architecture/
│   ├── guides/
│   ├── adrs/
│   ├── *.pdf                       # Guías CPES-IMSS (13 archivos)
│   └── INDEX.md
│
├── 📁 tools/                       # Scripts de utilidad
│   ├── build.js
│   └── build.sh
│
├── 📁 scripts/                     # Scripts adicionales
│   └── ...
│
├── 📁 .adrc/                       # ADRC Framework (memoria)
│   ├── data/
│   ├── reports/
│   └── scripts/
│
└── 📁 .claude/                     # Claude Code config
    └── ...
```

---

## 📝 Archivos por Crear

### 1. CHANGELOG.md

```markdown
# Changelog - CVOED-Tools

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Portal principal con navegación a las 6 herramientas
- Créditos completos de autores en todos los archivos HTML

### Fixed
- Redirección infinita en index.html
- Links rotos entre componentes

## [1.0.0] - 2026-03-11

### Added
- ECE-DES: Expediente Clínico Electrónico para Desastres
- Dashboard Analítico
- Motor de Impresión de Tarjetas START
- Generador de Tarjetas SCI-H
- Simulador de Emergencias
- Guía Operativa Hospital de Nunca Jamás

### Authors
- Dra. Carla Abril Perez Becerril
- Kristhian Manuel Jiménez Sánchez

### License
Apache License 2.0
```

### 2. .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm test
    - run: npm run build

  lint:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js 18.x
      uses: actions/setup-node@v3
      with:
        node-version: 18.x
        cache: 'npm'
    - run: npm ci
    - run: npm run lint
```

### 3. .github/ISSUE_TEMPLATE/bug_report.md

```markdown
---
name: Bug report
about: Crear un reporte para ayudarnos a mejorar el proyecto
title: '[BUG] '
labels: bug
assignees: ''
---

## Descripción del Bug
Describe claramente cuál es el problema.

## Pasos para Reproducir
1. Ir a '...'
2. Clic en '....'
3. Desplazar hasta '....'
4. Ver error

## Comportamiento Esperado
Describe qué debería pasar.

## Capturas de Pantalla
Si aplica, agrega capturas.

## Información del Sistema
 - OS: [ej. Windows 11, macOS 14.2]
 - Navegador: [ej. Chrome 120, Firefox 121]
 - Versión: [ej. 1.0.0]

## Contexto Adicional
Agrega cualquier otra información relevante.
```

### 4. .github/ISSUE_TEMPLATE/feature_request.md

```markdown
---
name: Feature request
about: Sugerir una idea para este proyecto
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## ¿Es tu feature request relacionada con un problema?
Describe el problema o la necesidad.

## Solución Propuesta
Describe tu solución deseada con claridad.

## Alternativas Consideradas
Describe alternativas que has considerado.

## Contexto Adicional
Agrega cualquier otra información o capturas.
```

### 5. .github/PULL_REQUEST_TEMPLATE.md

```markdown
## Descripción
Describe brevemente los cambios que propones.

## Tipo de Cambio
- [ ] Bug fix (no breaking change)
- [ ] New feature (no breaking change)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)

## Testing
Describe los tests que agregaste o actualizaste.

## Checklist
- [ ] Mi código sigue los estilos de este proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código, particularmente en áreas difíciles de entender
- [ ] He actualizado la documentación accordingly
- [ ] Mis cambios no generan nuevos warnings
- [ ] He agregado tests que prueban mi cambios
- [ ] Los tests nuevos y existentes pasan localmente
- [ ] He actualizado el CHANGELOG.md

## Autores
- Nombre: [Tu Nombre]
- Email: [Tu Email]
- Institución: [Si aplica]

## Reviewers
@kristhian-jimenez
@carla-abril
```

---

## 🔄 Comandos para Preparar GitHub

### 1. Inicializar Git (si no está inicializado)

```bash
cd /Users/krisnova/www/cvoed-tools
git init
git add .
git commit -m "feat: initial commit with complete CVOED-Tools suite

- ECE-DES: Expediente Clínico Electrónico para Desastres
- Dashboard Analítico con métricas en tiempo real
- Motor de Impresión de Tarjetas START
- Generador de Tarjetas SCI-H
- Simulador de Emergencias con 3 escenarios
- Guía Operativa Hospital de Nunca Jamás

Authors: Dra. Carla Abril Perez Becerril & Kristhian Manuel Jiménez Sánchez
License: Apache License 2.0
Context: Copa Mundial FIFA 2026 - IMSS CPES"
```

### 2. Crear Repositorio en GitHub

```bash
# Crear repositorio en GitHub
# Nombre: cvoed-tools
# Descripción: Suite Portátil de Herramientas Hospitalarias para Emergencias y Desastres - IMSS Copa Mundial FIFA 2026
# Visibilidad: Public
# Licencia: Apache License 2.0

# Agregar remote
git remote add origin https://github.com/IMSS-CPES/cvoed-tools.git

# Push
git branch -M main
git push -u origin main
```

### 3. Crear Tags para Versiones

```bash
# Crear tag v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0 - CVOED-Tools Suite Completa

Autores:
- Dra. Carla Abril Perez Becerril
- Kristhian Manuel Jiménez Sánchez

Licencia: Apache License 2.0
Context: Copa Mundial FIFA 2026"

# Push tags
git push origin v1.0.0
```

---

## 📊 Configuración de GitHub

### Topics (Etiquetas)
```
hospital-emergencies
medical-software
disaster-management
imss
fifa-2026
offline-first
web-tools
healthcare
emergency-medicine
triage-system
spanish
```

### Descripción Corta
```
Suite portátil de herramientas hospitalarias para emergencias y desastres. IMSS - Copa Mundial FIFA 2026. 100% offline, portable en USB.
```

### Descripción Larga
```
CVOED-Tools es una suite 100% portátil de herramientas hospitalarias diseñada para el IMSS en el contexto de la Copa Mundial FIFA 2026. Incluye 6 herramientas interactivas que funcionan completamente sin internet:

📋 ECE-DES: Expediente Clínico Electrónico para Desastres con registro rápido y triage START
📊 Dashboard Analítico: Tablero de control con métricas en tiempo real
🏷️ Motor de Impresión START: Generación de tarjetas físicas de triage
👥 Generador SCI-H: Tarjetas de acción para roles de comando de incidentes
🎯 Simulador: Plataforma de entrenamiento con 3 escenarios realistas
📖 Guía Operativa: Referencia completa de protocolos hospitalarios

Características principales:
✅ 100% Offline - Funciona sin internet
✅ Portable - Distribuible en USB
✅ Zero Dependencies - No requiere instalación
✅ WCAG AAA - Accesibilidad certificada
✅ SQLite in-browser - Persistencia local
✅ Exportación Excel - Reportes completos

Autores: Dra. Carla Abril Perez Becerril & Kristhian Manuel Jiménez Sánchez
Licencia: Apache License 2.0
```

---

## 🔗 Links Importantes

- **Repositorio:** https://github.com/IMSS-CPES/cvoed-tools
- **Documentación:** https://github.com/IMSS-CPES/cvoed-tools/wiki
- **Issues:** https://github.com/IMSS-CPES/cvoed-tools/issues
- **Discussions:** https://github.com/IMSS-CPES/cvoed-tools/discussions
- **Licencia:** https://github.com/IMSS-CPES/cvoed-tools/blob/main/LICENSE
- **Releases:** https://github.com/IMSS-CPES/cvoed-tools/releases

---

**Creado por:** Dra. Carla Abril Perez Becerril & Kristhian Manuel Jiménez Sánchez
**Fecha:** 2026-03-11
**Licencia:** Apache License 2.0
