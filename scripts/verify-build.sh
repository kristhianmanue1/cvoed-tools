#!/bin/bash
set -e

echo "🔍 Verificando build de CVOED-Tools..."
echo ""

DIST_DIR="dist"
ERRORS=0
WARNINGS=0

# Funciones de verificación
check_file() {
    local file=$1
    local min_size=$2
    local optional=${3:-false}

    if [ ! -f "$file" ]; then
        if [ "$optional" = "true" ]; then
            return 0
        fi
        echo -e "❌ $file: NO ENCONTRADO"
        ((ERRORS++))
        return 1
    fi

    local size=$(wc -c < "$file" | tr -d ' ')
    if [ $size -lt $min_size ]; then
        echo -e "❌ $file: Demasiado pequeño ($size bytes, mínimo: $min_size)"
        ((ERRORS++))
        return 1
    fi

    # Convert size to human readable if numfmt is available
    local size_hr
    if command -v numfmt &> /dev/null; then
        size_hr=$(echo $size | numfmt --to=iec)
    else
        size_hr="$size bytes"
    fi

    echo -e "✅ $file: $size_hr"
    return 0
}

check_html() {
    local file=$1
    local title=$2

    if ! grep -q "<title>$title" "$file"; then
        echo -e "⚠️  $file: Title incorrecto o faltante (esperado: '$title')"
        ((WARNINGS++))
        return 1
    fi

    # Verificar estructura básica
    if ! grep -q "<!DOCTYPE html>" "$file"; then
        echo -e "❌ $file: DOCTYPE faltante"
        ((ERRORS++))
        return 1
    fi

    echo -e "✅ $file: Estructura HTML válida, título correcto"
    return 0
}

check_links() {
    local file=$1
    local dir=$(dirname "$file")
    local broken_links=0

    # Extraer links relativos
    local links=$(grep -oE 'href="[^"]+\.html"' "$file" | sed 's/href="//;s/"$//' || true)

    for link in $links; do
        # Skip absolute URLs and anchors
        if [[ "$link" =~ ^https?:// ]] || [[ "$link" =~ ^# ]]; then
            continue
        fi

        local target_file="$dir/$link"
        if [ ! -f "$target_file" ]; then
            echo -e "  ⚠️  Link posiblemente roto: $link (archivo: $target_file)"
            ((broken_links++))
        fi
    done

    if [ $broken_links -eq 0 ]; then
        echo -e "✅ $file: Links verificados"
    else
        echo -e "⚠️  $file: $broken_links link(s) que requieren atención"
        ((WARNINGS++))
    fi
    return 0
}

# Verificar archivos críticos
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Verificando archivos HTML críticos..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# index.html is a redirect page, so it can be smaller
check_file "$DIST_DIR/index.html" 2000
check_file "$DIST_DIR/ECE-DES.html" 1000000
check_file "$DIST_DIR/ECE-DES-Dashboard.html" 500000
check_file "$DIST_DIR/ECE-DES-Tarjetas.html" 5000

# Optional files - mark as optional (third parameter)
check_file "$DIST_DIR/generador_tarjetas.html" 50000 true
check_file "$DIST_DIR/guia_operativa_nunca_jamas.html" 10000 true
check_file "$DIST_DIR/simulacro_nunca_jamas_fifa2026.html" 10000 true

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Verificando estructura HTML..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

check_html "$DIST_DIR/ECE-DES.html" "ECE-DES | Expediente Clínico de Desastres" 2>/dev/null || echo -e "⚠️  ECE-DES.html: Verificación de título fallida (opcional)"
check_html "$DIST_DIR/ECE-DES-Dashboard.html" "ECE-DES | Dashboard Analítico" 2>/dev/null || echo -e "⚠️  ECE-DES-Dashboard.html: Verificación de título fallida (opcional)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Verificando links relativos..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

check_links "$DIST_DIR/index.html"
check_links "$DIST_DIR/ECE-DES.html" 2>/dev/null || true

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Verificando dependencias JavaScript..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar sql.js inline
if grep -q "sql.js" "$DIST_DIR/ECE-DES.html" 2>/dev/null; then
    echo -e "✅ sql.js encontrado en ECE-DES.html"
else
    echo -e "⚠️  sql.js no encontrado en ECE-DES.html"
    ((WARNINGS++))
fi

# Verificar SheetJS inline
if grep -q "XLSX" "$DIST_DIR/ECE-DES.html" 2>/dev/null; then
    echo -e "✅ SheetJS encontrado en ECE-DES.html"
else
    echo -e "⚠️  SheetJS no encontrado en ECE-DES.html"
    ((WARNINGS++))
fi

# Verificar funciones de seguridad (pueden tener nombres diferentes)
if grep -q "escapeHTML" "$DIST_DIR/ECE-DES.html" 2>/dev/null; then
    echo -e "✅ Función escapeHTML encontrada en ECE-DES.html"
else
    echo -e "⚠️  Función escapeHTML no encontrada en ECE-DES.html"
    ((WARNINGS++))
fi

# Verificar PIN/Hash functions
if grep -qE "(PIN|hash|crypto|Crypto)" "$DIST_DIR/ECE-DES.html" 2>/dev/null; then
    echo -e "✅ Funciones criptográficas encontradas en ECE-DES.html"
else
    echo -e "⚠️  Funciones criptográficas no encontradas en ECE-DES.html"
    ((WARNINGS++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Verificando Web Workers..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Workers are optional (may be inlined in HTML)
if [ -d "$DIST_DIR/workers" ]; then
    if [ -f "$DIST_DIR/workers/export-worker.js" ]; then
        SIZE=$(wc -c < "$DIST_DIR/workers/export-worker.js" | tr -d ' ')
        echo -e "✅ export-worker.js presente ($SIZE bytes)"
    else
        echo -e "⚠️  export-worker.js NO encontrado (puede estar inlined)"
    fi

    if [ -f "$DIST_DIR/workers/export-worker-client.js" ]; then
        SIZE=$(wc -c < "$DIST_DIR/workers/export-worker-client.js" | tr -d ' ')
        echo -e "✅ export-worker-client.js presente ($SIZE bytes)"
    else
        echo -e "⚠️  export-worker-client.js NO encontrado (opcional)"
    fi
else
    echo -e "⚠️  Directorio workers/ no encontrado (puede estar inlined)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Generando reporte final..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Listar todos los archivos HTML generados
echo "Archivos HTML en dist/:"
for html in "$DIST_DIR"/*.html; do
    if [ -f "$html" ]; then
        SIZE=$(wc -c < "$html" | tr -d ' ')
        if command -v numfmt &> /dev/null; then
            SIZE_HR=$(echo $SIZE | numfmt --to=iec)
        else
            SIZE_HR="$SIZE bytes"
        fi
        echo "  - $(basename "$html"): $SIZE_HR"
    fi
done

echo ""
echo "================================"
if [ $ERRORS -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "✅ VERIFICACIÓN COMPLETADA: 0 errores, 0 advertencias"
        exit 0
    else
        echo -e "⚠️  VERIFICACIÓN COMPLETADA: $WARNINGS advertencia(s)"
        exit 0
    fi
else
    echo -e "❌ VERIFICACIÓN FALLIDA: $ERRORS errore(s), $WARNINGS advertencia(s)"
    exit 1
fi
