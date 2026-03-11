# 🔍 ANÁLISIS DE ESTRUCTURA - CVOED-TOOLS

**Fecha:** 2026-03-11
**Proyecto:** CVOED-Tools
**Objetivo:** Analizar organización actual y proponer mejoras según mejores prácticas

---

## 📊 DIAGNÓSTICO ACTUAL

### 📁 Estructura de Directorios

```
cvoed-tools/
├── 📁 .adrc/                    # ADRC Framework (memoria)
├── 📁 .claude/                  # Claude Code config
├── 📁 .github/                  # GitHub configuración
├── 📁 coverage/                 # Coverage reports (generated)
├── 📁 dist/                     # Build de producción (3.1MB)
├── 📁 docs/                     # Documentación (32MB)
├── 📁 imgtemp/                  # Imágenes temporales (27MB) ❌
├── 📁 md/                       # Documentación duplicada (192KB) ❌
├── 📁 scripts/                  # Scripts (vacío) ❌
├── 📁 src/                      # Código fuente (2MB)
├── 📁 tests/                    # Tests (484KB)
└── 📁 tools/                   # Scripts de utilidad (52KB)
```

### 📄 Archivos en Root (Sobrecargado)

```
🚨 PROBLEMA: 30+ archivos en el directorio raíz

Configuración (9 archivos):
  - .babelrc, babel.config.js, jest.config.js
  - .eslintrc.js, .eslintignore, .prettierrc, .prettierignore
  - .gitignore
  - .env.development, .env.production, .env.test

Documentación (9 archivos):
  - README.md, LICENSE, CONTRIBUTING.md ✅
  - DOCUMENTATION.md ✅
  - DIAGNOSTICO_INDEX_HTML.md ⚠️
  - AUDIT_LINKS_COMPONENTES.md ⚠️
  - PLAN_FIXES.md ⚠️
  - RESUMEN_EJECUTIVO.md ⚠️
  - RESUMEN_GITHUB_PREPARACION.md ⚠️
  - GITHUB_SETUP_GUIDE.md ⚠️
  - ORGANIZACION_GITHUB.md ⚠️

Scripts (5 archivos):
  - build.sh, serve.sh ✅
  - verify-build.sh, verify-portability.sh ✅
  - verify-fix.sh ⚠️

HTML (4 archivos):
  - index.html ✅
  - generador_tarjetas.html ✅
  - guia_operativa_nunca_jamas.html ✅
  - simulacro_nunca_jamas_fifa2026.html ✅
  - index.html.backup.redirection-loop ❌

Otros:
  - package.json, package-lock.json ✅
  - eslint-report.json (generated) ❌
  - build.log (generated) ❌
  - PROYECTO_CURSO_INTERACTIVO.md ⚠️
```

---

## ⚠️ PROBLEMAS IDENTIFICADOS

### 🔴 CRÍTICOS

1. **imgtemp/ (27MB)** - Directorio con imágenes temporales
   - Contiene archivos HEIC y JPG convertidos
   - No debería estar en el repositorio
   - Debe eliminarse o movido a assets/

2. **md/ (192KB)** - Duplicación de docs/
   - Contiene documentación vieja/duplicada
   - Archivos de marzo 2026 (diagnósticos)
   - Debe consolidarse con docs/

3. **Archivos temporales en root**
   - `eslint-report.json` - Generated
   - `build.log` - Generated
   - `index.html.backup.redirection-loop` - Backup

### 🟡 MODERADOS

4. **Documentación dispersa**
   - 9 archivos MD en root
   - Mezcla de documentación activa y diagnósticos
   - Falta estructura clara

5. **scripts/ vacío**
   - Directorio existe pero está vacío
   - Debe eliminarse o usarse

### 🟢 LEVES

6. **Configuración dispersa**
   - 9 archivos de config en root
   - Podrían agruparse en config/

7. **HTML en root**
   - 4 archivos HTML listos para producción
   - Deberían estar en dist/ o public/

---

## 🎯 PROPUESTA DE REORGANIZACIÓN

### Estructura Optima

```
cvoed-tools/
│
├── 📁 public/                    # ARCHIVOS PÚBLICOS (NUEVO)
│   ├── index.html               # Portal principal
│   ├── generador_tarjetas.html  # Herramienta SCI-H
│   ├── guia_operativa_nunca_jamas.html
│   └── simulacro_nunca_jamas_fifa2026.html
│
├── 📁 src/                       # CÓDIGO FUENTE
│   ├── ece-des/
│   ├── dashboard/
│   ├── simulador/
│   ├── tarjetas/
│   ├── shared/
│   └── config/
│
├── 📁 docs/                      # DOCUMENTACIÓN
│   ├── architecture/            # Arquitectura
│   ├── guides/                  # Guías de usuario
│   ├── api/                     # Referencias API
│   ├── diagnostics/             # ANEXO: Documentos de diagnóstico
│   │   ├── 2026-03-11-index-html-diagnosis.md
│   │   ├── 2026-03-11-links-audit.md
│   │   └── 2026-03-11-fixes-plan.md
│   └── old/                     # ANEXO: Documentación vieja
│       ├── md-duplicates/        # Contenido de md/
│       └── project-notes/        # PROYECTO_CURSO_INTERACTIVO.md
│
├── 📁 tests/                     # TESTS
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
│
├── 📁 scripts/                   # SCRIPTS DE UTILIDAD
│   ├── build.sh                 # Build de producción
│   ├── serve.sh                 # Servidor desarrollo
│   ├── verify-build.sh          # Verificación build
│   └── verify-portability.sh     # Verificación portabilidad
│
├── 📁 tools/                     # HERRAMIENTAS
│   └── build.js
│
├── 📁 .github/                   # CONFIGURACIÓN GITHUB
│   ├── workflows/               # GitHub Actions
│   ├── ISSUE_TEMPLATE/          # Templates de issues
│   └── PULL_REQUEST_TEMPLATE.md  # Template de PR
│
├── 📁 config/                    # CONFIGURACIÓN (NUEVO)
│   ├── env/
│   │   ├── .env.development
│   │   ├── .env.production
│   │   └── .env.test
│   ├── babel.config.js
│   ├── jest.config.js
│   ├── .eslintrc.js
│   └── .prettierrc
│
├── 📄 README.md                  # README PRINCIPAL
├── 📄 LICENSE                    # LICENCIA
├── 📄 CONTRIBUTING.md            # GUÍA CONTRIBUCIÓN
├── 📄 CHANGELOG.md               # REGISTRO DE CAMBIOS
├── 📄 package.json               # DEPENDENCIAS NPM
├── 📄 .gitignore                 # GIT IGNORE
│
└── 📄 .git/                      # GIT REPOSITORY
```

---

## 📋 PLAN DE LIMPIEZA

### FASE 1: Eliminación de Archivos Temporales

```bash
# 1.1 Eliminar directorio imgtemp/ (27MB)
rm -rf imgtemp/

# 1.2 Eliminar archivos generated
rm -f eslint-report.json
rm -f build.log

# 1.3 Eliminar backups
rm -f index.html.backup.redirection-loop
find . -name "*.backup" -delete
find . -name "*.bak" -delete

# 1.4 Eliminar .DS_Store
find . -name ".DS_Store" -delete
```

### FASE 2: Reorganización de Documentación

```bash
# 2.1 Crear estructura en docs/
mkdir -p docs/diagnostics
mkdir -p docs/old/md-duplicates
mkdir -p docs/old/project-notes

# 2.2 Mover diagnósticos recientes
mv DIAGNOSTICO_INDEX_HTML.md docs/diagnostics/2026-03-11-index-html-diagnosis.md
mv AUDIT_LINKS_COMPONENTES.md docs/diagnostics/2026-03-11-links-audit.md
mv PLAN_FIXES.md docs/diagnostics/2026-03-11-fixes-plan.md
mv RESUMEN_EJECUTIVO.md docs/diagnostics/2026-03-11-executive-summary.md

# 2.3 Mover documentación preparación GitHub
mv GITHUB_SETUP_GUIDE.md docs/diagnostics/
mv ORGANIZACION_GITHUB.md docs/diagnostics/
mv RESUMEN_GITHUB_PREPARACION.md docs/diagnostics/

# 2.4 Consolidar md/ en docs/old/
mv md/* docs/old/md-duplicates/
mv PROYECTO_CURSO_INTERACTIVO.md docs/old/project-notes/

# 2.5 Eliminar directorio vacío md/
rmdir md/
```

### FASE 3: Reorganización de HTML

```bash
# 3.1 Crear directorio public/
mkdir -p public

# 3.2 Mover HTML a public/
mv generador_tarjetas.html public/
mv guia_operativa_nunca_jamas.html public/
mv simulacro_nunca_jamas_fifa2026.html public/

# 3.3 Copiar index.html (ya está actualizado)
# index.html se queda en root y se copia a public/
cp index.html public/index.html
```

### FASE 4: Reorganización de Scripts

```bash
# 4.1 Mover scripts de root a scripts/
mv build.sh scripts/
mv serve.sh scripts/
mv verify-build.sh scripts/
mv verify-portability.sh scripts/
mv verify-fix.sh scripts/diagnose-index.sh  # Renombrar

# 4.2 Actualizar rutas en package.json
# (Editar manualmente las rutas de los scripts)
```

### FASE 5: Reorganización de Configuración

```bash
# 5.1 Crear directorio config/
mkdir -p config/env

# 5.2 Mover archivos de configuración
mv .env.* config/env/
mv babel.config.js config/
mv jest.config.js config/

# 5.3 Actualizar referencias
# (Actualizar package.json y otros archivos)
```

### FASE 6: Actualización de .gitignore

```bash
# Actualizar .gitignore para incluir nuevos directorios
cat > .gitignore << 'EOF'
# Dependencias
node_modules/
package-lock.json

# Archivos generados
dist/
coverage/
*.log
eslint-report.json

# Configuración local
config/env/.env.local

# Archivos temporales
*.backup
*.bak
*.tmp
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/
*.swp
*.swo
*~

# Directorios temporales
imgtemp/
scripts/tmp/

# Tests coverage
tests/coverage/

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOF
```

---

## 📊 COMPARATIVA: ANTES vs DESPUÉS

### Archivos en Root

| Categoría | Antes | Después | Mejora |
|-----------|--------|---------|--------|
| **Total** | 30+ | 12 | -60% |
| **Configuración** | 9 | 2 (config/ + .gitignore) | -78% |
| **Documentación** | 9 | 0 (todos en docs/) | -100% |
| **Scripts** | 5 | 0 (todos en scripts/) | -100% |
| **HTML** | 5 | 1 (index.html) | -80% |
| **Ejecutables** | 3 | 3 | 0% |

### Directorios

| Directorio | Antes | Después | Acción |
|-----------|--------|---------|--------|
| **imgtemp/** | 27MB | Eliminado | ❌ Eliminar |
| **md/** | 192KB | Consolidado en docs/old/ | 🔄 Mover |
| **docs/** | 32MB | Estructurado | 🏗️ Organizar |
| **public/** | No existe | Nuevo | ➕ Crear |
| **scripts/** | Vacío | Con scripts | 📦 Poblar |
| **config/** | No existe | Nuevo | ➕ Crear |

---

## 🎯 MEJORES PRÁCTICAS APLICADAS

### ✅ Estructura de Proyecto

1. **Separación de Intereses**
   - `src/` - Código fuente
   - `public/` - Archivos públicos estáticos
   - `tests/` - Suite de pruebas
   - `docs/` - Documentación
   - `scripts/` - Scripts de utilidad

2. **Directorio Único de Verdad**
   - `docs/` como única fuente de documentación
   - Eliminar duplicación `md/`

3. **Limpieza de Root**
   - Solo archivos esenciales en root
   - README, LICENSE, CONTRIBUTING, CHANGELOG, package.json

4. **Gestión de Configuración**
   - `config/` centraliza toda configuración
   - Separación de config local (`.env.local`)

### ✅ Gestión de Archivos

5. **Eliminación de Temporales**
   - `imgtemp/` - 27MB liberados
   - `*.backup`, `*.bak` - Backups eliminados
   - `*.log` - Logs excluidos

6. **Versionamiento de Documentos**
   - `docs/diagnostics/` con fechas
   - `docs/old/` para documentación histórica

7. **Naming Conventions**
   - Scripts con prefijos descriptivos
   - Fechas en archivos de diagnóstico

### ✅ Configuración

8. **.gitignore Mejorado**
   - Cobertura completa de archivos generados
   - Configuración local excluida
   - Archivos temporales excluidos

---

## 🚀 PLAN DE EJECUCIÓN

### Prioridad ALTA (Hoy)

1. ✅ **Crear directorio `public/`**
2. ✅ **Mover HTML a `public/`**
3. ✅ **Eliminar `imgtemp/`**
4. ✅ **Organizar `docs/diagnostics/`**

### Prioridad MEDIA (Esta Semana)

5. ✅ **Consolidar `md/` en `docs/old/`**
6. ✅ **Mover scripts a `scripts/`**
7. ✅ **Crear `config/`**
8. ✅ **Actualizar `.gitignore`**

### Prioridad BAJA (Cuando Sea Posible)

9. ⏳ **Crear `config/env/`**
10. ⏳ **Actualizar `package.json` scripts**
11. ⏳ **Revisar `coverage/`**
12. ⏳ **Documentar nueva estructura**

---

## 📈 BENEFICIOS ESPERADOS

### Inmediatos

- ✅ **-27MB** en tamaño de repositorio (eliminando imgtemp/)
- ✅ **-60%** archivos en root (de 30+ a 12)
- ✅ **Estructura clara** con separación de intereses

### Mediano Plazo

- ✅ **Onboarding más rápido** para nuevos colaboradores
- ✅ **Build más limpio** sin archivos temporales
- ✅ **Documentación organizada** y fácil de encontrar

### Largo Plazo

- ✅ **Mantenibilidad** mejorada
- ✅ **Escalabilidad** para nuevos módulos
- ✅ **Profesionalismo** en la estructura del proyecto

---

## ⚠️ RIESGOS Y CONSIDERACIONES

### Riesgos

1. **Romper rutas relativas** al mover archivos
   - **Mitigación:** Actualizar rutas en `package.json` y scripts

2. **Perder historial de Git** con mv masivo
   - **Mitigación:** Usar `git mv` para preservar historial

3. **Links rotos** en documentación
   - **Mitigación:** Actualizar referencias relativas

### Consideraciones

- **Comunicación:** Informar a colaboradores antes de reestructurar
- **Branching:** Crear branch `restructure` para cambios
- **Testing:** Verificar build y tests después de cambios
- **Rollback:** Tener plan de reversión si algo falla

---

## 📋 CHECKLIST DE VALIDACIÓN

### Post-Reorganización

- [ ] Build funciona correctamente
- [ ] Tests pasan sin errores
- [ ] Scripts actualizados con nuevas rutas
- [ ] Documentación actualizada
- [ ] .gitignore configurado correctamente
- [ ] No hay archivos temporales en staging
- [ ] `public/` contiene todos los HTML necesarios
- [ ] `docs/` está organizado correctamente

---

**Creado por:** CONTROLADOR - ADRC 2.0 Framework
**Fecha:** 2026-03-11
**Estado:** ✅ LISTO PARA REVISIÓN Y EJECUCIÓN
