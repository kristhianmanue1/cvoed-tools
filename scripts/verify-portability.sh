#!/bin/bash
echo "🔍 Verificando portabilidad de CVOED-Tools..."

# 1. Verificar HTMLs generados
echo "📦 Archivos en dist/:"
ls -la dist/

# 2. Verificar ES modules (debe ser 0)
echo "🔍 Verificando ES modules..."
grep -c "import " dist/ECE-DES.html && echo "❌ ERROR: Hay ES modules" || echo "✅ No hay ES modules"

# 3. Verificar WASM inline
echo "🔍 Verificando WASM inline..."
grep -q "window.SQL_WASM_URI" dist/ECE-DES.html && echo "✅ WASM inline encontrado" || echo "❌ ERROR: WASM no inline"

# 4. Verificar CSS inline
echo "🔍 Verificando CSS inline..."
grep -q "<style>" dist/ECE-DES.html && echo "✅ CSS inline encontrado" || echo "❌ ERROR: CSS no inline"

# 5. Mostrar tamaños
echo "📊 Tamaños:"
du -h dist/*.html

echo "✅ Verificación completada"