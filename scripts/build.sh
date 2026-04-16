#!/bin/bash
set -e  # Exit on error

# ============================================
# CVOED-TOOLS - Build Script v2.1
# ============================================

echo "🔨 CVOED-Tools Build Script v2.1"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOLS_DIR="$SCRIPT_DIR/../tools"
SRC_DIR="$SCRIPT_DIR/../src"
DIST_DIR="$SCRIPT_DIR/../dist"
BUILD_LOG="$SCRIPT_DIR/../build.log"

# Parse arguments
ENV=${1:-production}
CLEAN=${2:-false}

echo -e "${BLUE}Environment:${NC} $ENV"
echo -e "${BLUE}Clean build:${NC} $CLEAN"
echo ""

# ============================================
# SIMULADOR BUNDLE FUNCTION
# ============================================

bundle_simulador_js() {
    log "Bundling simulador JS modules..."

    local SIMULADOR_JS_DIR="$SRC_DIR/simulador/js"
    local BUNDLE_FILE="$DIST_DIR/simulador-bundle.js"
    local SOURCEMAP_FILE="$DIST_DIR/simulador-bundle.js.map"

    # Check if simulador modules exist
    if [ ! -d "$SIMULADOR_JS_DIR" ]; then
        warning "Simulador JS modules directory not found at $SIMULADOR_JS_DIR"
        return 1
    fi

    # Create bundle header
    cat > "$BUNDLE_FILE" << 'EOF'
// Simulador Bundle - CVOED-Tools
// Auto-generated from src/simulador/js/
// Generated at: $(date)
// DO NOT EDIT MANUALLY

(function() {
  'use strict';

  // Module registry for ES6 imports
  const modules = {};

EOF

    # Find and concatenate all JS files
    local module_count=0

    # Process core modules
    for category in core ui scenarios config utils; do
        if [ -d "$SIMULADOR_JS_DIR/$category" ]; then
            for file in "$SIMULADOR_JS_DIR/$category"/*.js; do
                if [ -f "$file" ]; then
                    local basename=$(basename "$file")
                    local modulename="${category}/${basename}"

                    echo "  // === $modulename ===" >> "$BUNDLE_FILE"
                    echo "  modules['$modulename'] = (function() {" >> "$BUNDLE_FILE"

                    # Convert ES6 exports to module.exports format
                    sed -e '/^import /d' \
                        -e "s/^export class /class /" \
                        -e "s/^export function /function /" \
                        -e "s/^export const /const /" \
                        -e "s/^export default /module.exports = /" \
                        -e "s/^export {/module.exports = {/" \
                        "$file" >> "$BUNDLE_FILE"

                    echo "  }).call(this);" >> "$BUNDLE_FILE"
                    echo "" >> "$BUNDLE_FILE"

                    module_count=$((module_count + 1))
                fi
            done
        fi
    done

    # Close the module wrapper
    cat >> "$BUNDLE_FILE" << 'EOF'
  // Make modules available globally for backward compatibility
  if (typeof window !== 'undefined') {
    window.SimuladorModules = modules;
  }
})();
EOF

    log "  Bundled $module_count JS modules into $(basename "$BUNDLE_FILE")"

    # Get file size
    local size=$(du -h "$BUNDLE_FILE" | cut -f1)
    log "  Bundle size: $size"

    return 0
}

# ============================================
# SIMULADOR HTML BUILD FUNCTION
# ============================================

build_simulador_html() {
    log "Building simulador HTML..."

    local SIMULADOR_HTML="$SRC_DIR/simulador/simulador-nunca-jamas.html"
    local OUTPUT_HTML="$DIST_DIR/simulacro_nunca_jamas_fifa2026.html"

    if [ ! -f "$SIMULADOR_HTML" ]; then
        # Fallback to public directory
        SIMULADOR_HTML="$SCRIPT_DIR/../public/simulacro_nunca_jamas_fifa2026.html"
    fi

    if [ ! -f "$SIMULADOR_HTML" ]; then
        # Fallback to root HTML
        SIMULADOR_HTML="$SCRIPT_DIR/../simulacro_nunca_jamas_fifa2026.html"
    fi

    if [ ! -f "$SIMULADOR_HTML" ]; then
        warning "Simulador HTML source not found"
        return 1
    fi

    # Copy HTML to dist WITHOUT processing
    # The simulator has all JavaScript inline and should not be bundled
    cp "$SIMULADOR_HTML" "$OUTPUT_HTML"

    log "  Built $(basename "$OUTPUT_HTML") (copied intact, inline JS)"
    return 0
}

# ============================================
# TRASLADOS AEREOS BUILD FUNCTION
# ============================================

build_traslados_aereos() {
    log "Building Traslados Aereos..."

    local TRASLADOS_DIR="$SRC_DIR/traslados-aereos"
    local OUTPUT_HTML="$DIST_DIR/Traslados-Aereos.html"

    if [ ! -d "$TRASLADOS_DIR" ]; then
        warning "Traslados Aereos directory not found at $TRASLADOS_DIR"
        return 1
    fi

    # Copy main HTML
    cp "$TRASLADOS_DIR/index.html" "$OUTPUT_HTML"
    log "  Copied Traslados-Aereos.html"

    # Create asset directories
    mkdir -p "$DIST_DIR/css"
    mkdir -p "$DIST_DIR/js/services"
    mkdir -p "$DIST_DIR/data"

    # Copy CSS
    if [ -f "$TRASLADOS_DIR/css/styles.css" ]; then
        cp "$TRASLADOS_DIR/css/styles.css" "$DIST_DIR/css/styles.css"
        log "  Copied css/styles.css"
    fi

    # Copy JS files
    if [ -f "$TRASLADOS_DIR/js/app.js" ]; then
        cp "$TRASLADOS_DIR/js/app.js" "$DIST_DIR/js/app.js"
        log "  Copied js/app.js"
    fi

    if [ -f "$TRASLADOS_DIR/js/catalogo-data.js" ]; then
        cp "$TRASLADOS_DIR/js/catalogo-data.js" "$DIST_DIR/js/catalogo-data.js"
        log "  Copied js/catalogo-data.js"
    fi

    # Copy services
    if [ -d "$TRASLADOS_DIR/js/services" ]; then
        for file in "$TRASLADOS_DIR/js/services"/*.js; do
            if [ -f "$file" ]; then
                cp "$file" "$DIST_DIR/js/services/"
                log "  Copied js/services/$(basename "$file")"
            fi
        done
    fi

    # Copy data
    if [ -f "$TRASLADOS_DIR/data/catalogo-unidades.json" ]; then
        cp "$TRASLADOS_DIR/data/catalogo-unidades.json" "$DIST_DIR/data/catalogo-unidades.json"
        log "  Copied data/catalogo-unidades.json"
    fi

    log "  Built Traslados-Aereos.html with assets"
    return 0
}

# ============================================
# CSS EXTRACTION FUNCTION
# ============================================

extract_simulador_css() {
    log "Extracting simulador CSS..."

    local CSS_FILE="$SRC_DIR/simulador/css/simulador.css"
    local OUTPUT_CSS="$DIST_DIR/simulador.css"

    if [ ! -f "$CSS_FILE" ]; then
        warning "Simulador CSS not found at $CSS_FILE"
        return 1
    fi

    cp "$CSS_FILE" "$OUTPUT_CSS"

    log "  Copied $(basename "$CSS_FILE") to dist/"

    # If HTML exists, link the CSS file
    local HTML_FILE="$DIST_DIR/simulacro_nunca_jamas_fifa2026.html"
    if [ -f "$HTML_FILE" ]; then
        # Check if already has link to simulador.css
        if ! grep -q "simulador.css" "$HTML_FILE"; then
            log "  Adding CSS link to HTML..."
            sed -i.tmp 's|</head>|<link rel="stylesheet" href="simulador.css">\n</head>|' "$HTML_FILE"
            rm -f "$HTML_FILE.tmp"
        fi
    fi

    return 0
}

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1" | tee -a "$BUILD_LOG"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$BUILD_LOG"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$BUILD_LOG"
}

# Clean dist directory if requested
if [ "$CLEAN" = "true" ]; then
    log "Limpiando dist/..."
    rm -rf "$DIST_DIR"
fi

# Create dist directory
log "Creando directorio dist/..."
mkdir -p "$DIST_DIR"
mkdir -p "$DIST_DIR/workers"
mkdir -p "$DIST_DIR/workers/lib"

# Check if tools directory exists
if [ ! -d "$TOOLS_DIR" ]; then
    error "Directorio tools/ no encontrado. Creando..."
    mkdir -p "$TOOLS_DIR"
fi

# Check if build.js exists
if [ ! -f "$TOOLS_DIR/build.js" ]; then
    warning "build.js no encontrado, usando build alternativo..."

    # Build alternativo
    log "Copiando archivos desde src/ a dist/..."

    # Copiar archivos HTML
    if [ -d "$SRC_DIR" ]; then
        # Copy index.html if exists
        # COMENTADO: index.html es el portal principal, no se copia en build
        # if [ -f "$SRC_DIR/../index.html" ]; then
        #     cp "$SRC_DIR/../index.html" "$DIST_DIR/"
        # fi

        # Copy each module's index.html
        for module in ece-des dashboard tarjetas traslados-aereos; do
            if [ -f "$SRC_DIR/$module/index.html" ]; then
                case "$module" in
                    ece-des)
                        cp "$SRC_DIR/$module/index.html" "$DIST_DIR/ECE-DES.html"
                        ;;
                    dashboard)
                        cp "$SRC_DIR/$module/index.html" "$DIST_DIR/ECE-DES-Dashboard.html"
                        ;;
                    tarjetas)
                        cp "$SRC_DIR/$module/index.html" "$DIST_DIR/ECE-DES-Tarjetas.html"
                        ;;
                    traslados-aereos)
                        cp "$SRC_DIR/$module/index.html" "$DIST_DIR/Traslados-Aereos.html"
                        ;;
                esac
            fi
        done

        log "Archivos copiados: $(find "$DIST_DIR" -name '*.html' | wc -l | tr -d ' ')"
    else
        warning "Directorio src/ no encontrado, usando dist/ existente"
    fi

    # Build simulador modules
    bundle_simulador_js
    build_simulador_html
    extract_simulador_css

    # Copiar portal principal ajustando rutas
    if [ -f "$SRC_DIR/../index.html" ]; then
        sed 's|href="dist/|href="|g' "$SRC_DIR/../index.html" > "$DIST_DIR/index.html"
        log "  Copied index.html to dist/ (paths adjusted)"
    fi

    # Copiar archivos HTML estáticos de public/
    for public_html in generador_tarjetas.html guia_operativa_nunca_jamas.html; do
        if [ -f "$SRC_DIR/../public/$public_html" ]; then
            cp "$SRC_DIR/../public/$public_html" "$DIST_DIR/$public_html"
            log "  Copied public/$public_html to dist/"
        fi
    done

else
    # Usar build.js existente
    log "Ejecutando build.js..."
    cd "$TOOLS_DIR"
    node build.js "$ENV"
    cd "$SCRIPT_DIR"

    # Build simulador modules (even with build.js)
    bundle_simulador_js
    build_simulador_html
    extract_simulador_css

    # Copiar portal principal ajustando rutas
    if [ -f "$SRC_DIR/../index.html" ]; then
        sed 's|href="dist/|href="|g' "$SRC_DIR/../index.html" > "$DIST_DIR/index.html"
        log "  Copied index.html to dist/ (paths adjusted)"
    fi

    # Copiar archivos HTML estáticos de public/
    for public_html in generador_tarjetas.html guia_operativa_nunca_jamas.html; do
        if [ -f "$SRC_DIR/../public/$public_html" ]; then
            cp "$SRC_DIR/../public/$public_html" "$DIST_DIR/$public_html"
            log "  Copied public/$public_html to dist/"
        fi
    done
fi

# Build traslados aereos solo en build alternativo (build.js ya lo genera inline)
if [ ! -f "$TOOLS_DIR/build.js" ]; then
    build_traslados_aereos
fi

# Minificar HTML si es production
if [ "$ENV" = "production" ]; then
    log "Minificando HTML..."

    for html in "$DIST_DIR"/*.html; do
        if [ -f "$html" ]; then
            log "  Minificando $(basename "$html")..."
            # Usar html-minifier si está disponible
            if command -v html-minifier &> /dev/null; then
                html-minifier --collapse-whitespace --remove-comments --minify-js true -o "$html.min" "$html"
                mv "$html.min" "$html"
            else
                # Minificación básica con sed
                sed -i.tmp 's/^[[:space:]]*//; s/[[:space:]]*$//; /^$/d' "$html"
                rm -f "$html.tmp"
            fi
        fi
    done
fi

# Generar source maps si es development
if [ "$ENV" = "development" ]; then
    log "Generando source maps..."
    # Source map generation si aplica
fi

# Calcular tamaños
log "Calculando tamaños..."
TOTAL_SIZE=$(du -sh "$DIST_DIR" 2>/dev/null | cut -f1)
FILE_COUNT=$(find "$DIST_DIR" -type f | wc -l | tr -d ' ')
HTML_COUNT=$(find "$DIST_DIR" -name '*.html' | wc -l | tr -d ' ')

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ BUILD COMPLETADO${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}Estadísticas:${NC}"
echo "  Archivos: $FILE_COUNT"
echo "  HTML files: $HTML_COUNT"
echo "  Tamaño total: ${TOTAL_SIZE:-N/A}"
echo ""
echo -e "${BLUE}Output:${NC} $DIST_DIR"
echo ""

# Verificar archivos HTML críticos
CRITICAL_FILES=(
    "$DIST_DIR/index.html"
    "$DIST_DIR/ECE-DES.html"
    "$DIST_DIR/ECE-DES-Dashboard.html"
    "$DIST_DIR/Traslados-Aereos.html"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        SIZE=$(du -h "$file" | cut -f1)
        echo -e "  ${GREEN}✓${NC} $(basename "$file") ($SIZE)"
    else
        echo -e "  ${RED}✗${NC} $(basename "$file") (NO ENCONTRADO)"
    fi
done

echo ""
log "Build completado exitosamente!"
echo ""
echo "Para probar las aplicaciones:"
echo "  cd dist && python3 -m http.server 8000"
echo "  O abrir: dist/index.html"
