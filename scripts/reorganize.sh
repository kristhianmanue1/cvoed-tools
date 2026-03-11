#!/bin/bash
set -e  # Exit on error

# ============================================
# CVOED-TOOLS - Script de Reorganización
# ============================================

echo "🔧 CVOED-Tools - Script de Reorganización"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}Proyecto:${NC} $PROJECT_ROOT"
echo -e "${BLUE}Fecha:${NC} $(date)"
echo ""

# ============================================
# FASE 1: ELIMINACIÓN DE ARCHIVOS TEMPORALES
# ============================================

echo -e "${YELLOW}FASE 1: Eliminación de Archivos Temporales${NC}"
echo ""

# 1.1 Eliminar directorio imgtemp/ (27MB)
if [ -d "imgtemp" ]; then
    echo -e "${GREEN}✓${NC} Eliminando imgtemp/ (27MB)..."
    rm -rf imgtemp/
else
    echo -e "${BLUE}⊙${NC} imgtemp/ no existe, saltando..."
fi

# 1.2 Eliminar archivos generated
echo -e "${GREEN}✓${NC} Eliminando archivos generados..."
rm -f eslint-report.json
rm -f build.log

# 1.3 Eliminar backups
echo -e "${GREEN}✓${NC} Eliminando archivos backup..."
rm -f index.html.backup.redirection-loop
find . -name "*.backup" -type f -delete 2>/dev/null || true
find . -name "*.bak" -type f -delete 2>/dev/null || true

# 1.4 Eliminar .DS_Store
echo -e "${GREEN}✓${NC} Eliminando .DS_Store..."
find . -name ".DS_Store" -delete 2>/dev/null || true

echo ""
echo -e "${GREEN}✅ FASE 1 COMPLETADA${NC}"
echo ""

# ============================================
# FASE 2: REORGANIZACIÓN DE DOCUMENTACIÓN
# ============================================

echo -e "${YELLOW}FASE 2: Reorganización de Documentación${NC}"
echo ""

# 2.1 Crear estructura en docs/
echo -e "${GREEN}✓${NC} Creando estructura de directorios..."
mkdir -p docs/diagnostics
mkdir -p docs/old/md-duplicates
mkdir -p docs/old/project-notes

# 2.2 Mover diagnósticos recientes
echo -e "${GREEN}✓${NC} Moviendo diagnósticos recientes..."
if [ -f "DIAGNOSTICO_INDEX_HTML.md" ]; then
    mv DIAGNOSTICO_INDEX_HTML.md docs/diagnostics/2026-03-11-index-html-diagnosis.md
fi

if [ -f "AUDIT_LINKS_COMPONENTES.md" ]; then
    mv AUDIT_LINKS_COMPONENTES.md docs/diagnostics/2026-03-11-links-audit.md
fi

if [ -f "PLAN_FIXES.md" ]; then
    mv PLAN_FIXES.md docs/diagnostics/2026-03-11-fixes-plan.md
fi

if [ -f "RESUMEN_EJECUTIVO.md" ]; then
    mv RESUMEN_EJECUTIVO.md docs/diagnostics/2026-03-11-executive-summary.md
fi

# 2.3 Mover documentación preparación GitHub
echo -e "${GREEN}✓${NC} Moviendo documentación de preparación GitHub..."
if [ -f "GITHUB_SETUP_GUIDE.md" ]; then
    mv GITHUB_SETUP_GUIDE.md docs/diagnostics/2026-03-11-github-setup-guide.md
fi

if [ -f "ORGANIZACION_GITHUB.md" ]; then
    mv ORGANIZACION_GITHUB.md docs/diagnostics/2026-03-11-github-organization.md
fi

if [ -f "RESUMEN_GITHUB_PREPARACION.md" ]; then
    mv RESUMEN_GITHUB_PREPARACION.md docs/diagnostics/2026-03-11-github-preparation-summary.md
fi

# 2.4 Consolidar md/ en docs/old/
echo -e "${GREEN}✓${NC} Consolidando md/ en docs/old/..."
if [ -d "md" ]; then
    mv md/* docs/old/md-duplicates/ 2>/dev/null || true
    rmdir md 2>/dev/null || true
fi

# 2.5 Mover notas de proyecto
if [ -f "PROYECTO_CURSO_INTERACTIVO.md" ]; then
    mv PROYECTO_CURSO_INTERACTIVO.md docs/old/project-notes/
fi

echo ""
echo -e "${GREEN}✅ FASE 2 COMPLETADA${NC}"
echo ""

# ============================================
# FASE 3: REORGANIZACIÓN DE HTML
# ============================================

echo -e "${YELLOW}FASE 3: Reorganización de HTML${NC}"
echo ""

# 3.1 Crear directorio public/
echo -e "${GREEN}✓${NC} Creando directorio public/..."
mkdir -p public

# 3.2 Mover HTML a public/
echo -e "${GREEN}✓${NC} Moviendo HTML a public/..."
if [ -f "generador_tarjetas.html" ]; then
    mv generador_tarjetas.html public/
fi

if [ -f "guia_operativa_nunca_jamas.html" ]; then
    mv guia_operativa_nunca_jamas.html public/
fi

if [ -f "simulacro_nunca_jamas_fifa2026.html" ]; then
    mv simulacro_nunca_jamas_fifa2026.html public/
fi

# 3.3 Copiar index.html
echo -e "${GREEN}✓${NC} Copiando index.html a public/..."
if [ -f "index.html" ]; then
    cp index.html public/index.html
fi

echo ""
echo -e "${GREEN}✅ FASE 3 COMPLETADA${NC}"
echo ""

# ============================================
# FASE 4: REORGANIZACIÓN DE SCRIPTS
# ============================================

echo -e "${YELLOW}FASE 4: Reorganización de Scripts${NC}"
echo ""

# 4.1 Mover scripts de root a scripts/
echo -e "${GREEN}✓${NC} Moviendo scripts a scripts/..."
if [ -f "build.sh" ]; then
    mv build.sh scripts/
fi

if [ -f "serve.sh" ]; then
    mv serve.sh scripts/
fi

if [ -f "verify-build.sh" ]; then
    mv verify-build.sh scripts/
fi

if [ -f "verify-portability.sh" ]; then
    mv verify-portability.sh scripts/
fi

if [ -f "verify-fix.sh" ]; then
    mv verify-fix.sh scripts/diagnose-index.sh
fi

echo ""
echo -e "${GREEN}✅ FASE 4 COMPLETADA${NC}"
echo ""

# ============================================
# FASE 5: REORGANIZACIÓN DE CONFIGURACIÓN
# ============================================

echo -e "${YELLOW}FASE 5: Reorganización de Configuración${NC}"
echo ""

# 5.1 Crear directorio config/
echo -e "${GREEN}✓${NC} Creando directorio config/..."
mkdir -p config/env

# 5.2 Mover archivos de configuración
echo -e "${GREEN}✓${NC} Moviendo archivos de configuración..."
if [ -f ".env.development" ]; then
    mv .env.development config/env/
fi

if [ -f ".env.production" ]; then
    mv .env.production config/env/
fi

if [ -f ".env.test" ]; then
    mv .env.test config/env/
fi

if [ -f "babel.config.js" ]; then
    mv babel.config.js config/
fi

if [ -f "jest.config.js" ]; then
    mv jest.config.js config/
fi

echo ""
echo -e "${GREEN}✅ FASE 5 COMPLETADA${NC}"
echo ""

# ============================================
# FASE 6: ACTUALIZACIÓN DE .GITIGNORE
# ============================================

echo -e "${YELLOW}FASE 6: Actualización de .gitignore${NC}"
echo ""

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
.env
.env.local

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

echo -e "${GREEN}✓${NC} .gitignore actualizado"
echo ""

echo -e "${GREEN}✅ FASE 6 COMPLETADA${NC}"
echo ""

# ============================================
# RESUMEN
# ============================================

echo "=========================================="
echo -e "${GREEN}✅ REORGANIZACIÓN COMPLETADA${NC}"
echo "=========================================="
echo ""
echo "📊 Resumen de cambios:"
echo ""
echo "Directorios eliminados:"
echo "  • imgtemp/ (27MB)"
echo "  • md/ (consolidado en docs/old/)"
echo ""
echo "Directorios creados:"
echo "  • public/"
echo "  • config/"
echo "  • docs/diagnostics/"
echo "  • docs/old/"
echo ""
echo "Archivos movidos:"
echo "  • HTML → public/"
echo "  • Scripts → scripts/"
echo "  • Config → config/"
echo "  • Diagnósticos → docs/diagnostics/"
echo ""
echo "⚠️  PRÓXIMOS PASOS:"
echo "  1. Verificar que el build funcione"
echo "  2. Ejecutar tests: npm test"
echo "  3. Actualizar package.json con nuevas rutas"
echo "  4. Commit de los cambios"
echo ""
echo "📝 Para revertir los cambios:"
echo "  git checkout ."
echo ""
