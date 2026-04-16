# 🚀 Guía de Configuración GitHub - CVOED-Tools

## ✅ Checklist de Preparación

### 1. Archivos Obligatorios ✅

- [x] **README.md** - Descripción completa del proyecto con créditos
- [x] **LICENSE** - Apache License 2.0 con nombres de autores
- [x] **CONTRIBUTING.md** - Guía de contribución
- [x] **.gitignore** - Archivos a ignorar
- [x] **package.json** - Dependencias y scripts
- [x] **.github/CODE_OF_CONDUCT.md** - Código de conducta
- [ ] **CHANGELOG.md** - Registro de cambios (por crear)
- [ ] **.github/ISSUE_TEMPLATE/** - Templates de issues (por crear)
- [ ] **.github/PULL_REQUEST_TEMPLATE.md** - Template de PR (por crear)
- [ ] **.github/workflows/ci.yml** - GitHub Actions (por crear)

### 2. Archivos HTML con Créditos ✅

- [x] **index.html** - Portal principal con créditos en comentarios
- [ ] **dist/ECE-DES.html** - Por actualizar
- [ ] **dist/ECE-DES-Dashboard.html** - Por actualizar
- [ ] **dist/ECE-DES-Tarjetas.html** - Por actualizar
- [ ] **dist/generador_tarjetas.html** - Por actualizar
- [ ] **dist/simulacro_nunca_jamas_fifa2026.html** - Por actualizar
- [ ] **dist/guia_operativa_nunca_jamas.html** - Por actualizar

### 3. Configuración de Repositorio

- [ ] **Nombre:** cvoed-tools
- [ ] **Descripción:** Suite portátil de herramientas hospitalarias para emergencias y desastres - IMSS Copa Mundial FIFA 2026
- [ ] **Visibilidad:** Public
- [ ] **Licencia:** Apache License 2.0
- [ ] **Topics:** hospital-emergencies, medical-software, disaster-management, imss, fifa-2026, offline-first

---

## 📝 Pasos para Publicar en GitHub

### Paso 1: Crear CHANGELOG.md

```bash
cat > CHANGELOG.md << 'EOF'
# Changelog - CVOED-Tools

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Portal principal con navegación a las 6 herramientas
- Créditos completos de autores en todos los archivos HTML
- Metadata de autores en archivos HTML

### Fixed
- Redirección infinita en index.html (dist/dist/index.html)
- Links rotos entre componentes
- Verificación de build mejorada

### Authors
- Dra. Carla Abril Perez Becerril
- Kristhian Manuel Jiménez Sánchez

## [1.0.0] - 2026-03-11

### Added
- ECE-DES: Expediente Clínico Electrónico para Desastres
- Dashboard Analítico con métricas en tiempo real
- Motor de Impresión de Tarjetas START
- Generador de Tarjetas SCI-H
- Simulador de Emergencias con 3 escenarios
- Guía Operativa Hospital de Nunca Jamás

### Features
- 100% offline - Funciona sin internet
- Portable - Distribuible en USB
- Zero dependencies operativas
- Persistencia local con IndexedDB
- Exportación a Excel
- WCAG 2.2 AAA compliance

### Authors
- Dra. Carla Abril Perez Becerril (Contenido clínico y validación)
- Kristhian Manuel Jiménez Sánchez (Arquitectura y desarrollo)

### License
Apache License 2.0

### Context
Copa Mundial FIFA 2026 - IMSS CPES
EOF
```

### Paso 2: Crear Templates de Issues

```bash
# Crear directorio
mkdir -p .github/ISSUE_TEMPLATE

# Template de Bug
cat > .github/ISSUE_TEMPLATE/bug_report.md << 'EOF'
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
EOF

# Template de Feature Request
cat > .github/ISSUE_TEMPLATE/feature_request.md << 'EOF'
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
EOF
```

### Paso 3: Crear Template de Pull Request

```bash
cat > .github/PULL_REQUEST_TEMPLATE.md << 'EOF'
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
- [ ] He comentado mi código, particularly en áreas difíciles de entender
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
EOF
```

### Paso 4: Crear GitHub Actions CI

```bash
mkdir -p .github/workflows

cat > .github/workflows/ci.yml << 'EOF'
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
EOF
```

### Paso 5: Preparar Commit Inicial

```bash
# Asegurarse de estar en el directorio correcto
cd /Users/krisnova/www/cvoed-tools

# Agregar todos los archivos
git add .

# Commit inicial con información completa
git commit -m "feat: initial commit - CVOED-Tools Suite Completa v1.0.0

Suite Portátil de Herramientas Hospitalarias para Emergencias y Desastres
IMSS - Copa Mundial FIFA 2026

Componentes incluidos:
- ECE-DES: Expediente Clínico Electrónico para Desastres
- Dashboard Analítico con métricas en tiempo real
- Motor de Impresión de Tarjetas START
- Generador de Tarjetas SCI-H
- Simulador de Emergencias con 3 escenarios
- Guía Operativa Hospital de Nunca Jamás

Características:
- 100% offline - Funciona sin internet
- Portable - Distribuible en USB
- Zero dependencies operativas
- Persistencia local con IndexedDB
- Exportación a Excel
- WCAG 2.2 AAA compliance

Autores:
- Dra. Carla Abril Perez Becerril (Contenido clínico y validación)
- Kristhian Manuel Jiménez Sánchez (Arquitectura y desarrollo)

Licencia: Apache License 2.0
Contexto: Copa Mundial FIFA 2026 - IMSS CPES

Co-authored-by: Dra. Carla Abril Perez Becerril <carla.abril@imss.gob.mx>
Co-authored-by: Kristhian Manuel Jiménez Sánchez <kristhian.jimenez@imss.gob.mx>"
```

### Paso 6: Crear Repositorio en GitHub

1. Ir a https://github.com/new
2. Configurar:
   - **Repository name:** cvoed-tools
   - **Description:** Suite portátil de herramientas hospitalarias para emergencias y desastres - IMSS Copa Mundial FIFA 2026
   - **Visibility:** Public ☑️
   - **Initialize:** NO (no marcar ninguna opción)
3. Clic en "Create repository"
4. Copiar la URL del repositorio

### Paso 7: Conectar y Push

```bash
# Agregar remote (reemplazar con tu URL real)
git remote add origin https://github.com/IMSS-CPES/cvoed-tools.git

# Verificar remote
git remote -v

# Renombrar rama a main
git branch -M main

# Push inicial
git push -u origin main
```

### Paso 8: Crear Tag v1.0.0

```bash
# Crear tag anotado
git tag -a v1.0.0 -m "Release v1.0.0 - CVOED-Tools Suite Completa

Suite Portátil de Herramientas Hospitalarias para Emergencias y Desastres
IMSS - Copa Mundial FIFA 2026

Componentes:
- ECE-DES: Expediente Clínico Electrónico para Desastres
- Dashboard Analítico con métricas en tiempo real
- Motor de Impresión de Tarjetas START
- Generador de Tarjetas SCI-H
- Simulador de Emergencias con 3 escenarios
- Guía Operativa Hospital de Nunca Jamás

Autores:
- Dra. Carla Abril Perez Becerril (Contenido clínico)
- Kristhian Manuel Jiménez Sánchez (Arquitectura y desarrollo)

Licencia: Apache License 2.0
Contexto: Copa Mundial FIFA 2026 - IMSS CPES"

# Push del tag
git push origin v1.0.0
```

### Paso 9: Configurar Repositorio en GitHub

1. Ir a: https://github.com/IMSS-CPES/cvoed-tools/settings

2. **Settings → General:**
   - ✅ Verify "Repository name"
   - ✅ Verify "Description"
   - ✅ Verify "License" (Apache License 2.0)

3. **Settings → Options → Features:**
   - ☑️ Issues
   - ☑️ Projects
   - ☑️ Wiki
   - ☑️ Discussions
   - ☑️ Actions

4. **Settings → Options → Merge button:**
   - Allow merge commits: ☑️
   - Allow squashing: ☑️
   - Allow rebase merging: ☐

5. **Settings → Branches:**
   - Default branch: main
   - Branch protection rule: (configurar después)

6. **Settings → Topics:**
   Agregar las siguientes etiquetas:
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
   mexico
   ```

---

## ✅ Verificación Final

### Checklist Post-Publicación

- [ ] Repositorio accesible en: https://github.com/IMSS-CPES/cvoed-tools
- [ ] README.md se muestra correctamente
- [ ] LICENSE aparece en la sidebar
- [ ] Code of Conduct aparece
- [ ] Contributing guidelines aparecen
- [ ] Issues templates funcionan
- [ ] PR template funciona
- [ ] GitHub Actions CI funciona
- [ ] Tag v1.0.0 aparece en Releases
- [ ] Topics están configurados
- [ ] Descripción está completa
- [ ] Autores están acreditados

---

## 📞 Soporte

Para ayuda con la configuración:
- **GitHub Docs:** https://docs.github.com
- **Support Email:** cpes@imss.gob.mx
- **Issues:** https://github.com/IMSS-CPES/cvoed-tools/issues

---

**Creado por:** Dra. Carla Abril Perez Becerril & Kristhian Manuel Jiménez Sánchez
**Fecha:** 2026-03-11
**Licencia:** Apache License 2.0
**Repositorio:** https://github.com/IMSS-CPES/cvoed-tools
