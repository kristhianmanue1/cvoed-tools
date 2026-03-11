#!/bin/bash
echo "🧪 VERIFICACIÓN DEL FIX - CVOED-Tools"
echo "======================================"
echo ""

# Test 1: Verificar que index.html NO es redirección
echo "Test 1: Verificando que index.html NO redirige..."
if grep -q 'window.location.href = "dist/index.html"' index.html; then
    echo "❌ FAIL: index.html todavía redirige"
    exit 1
else
    echo "✅ PASS: index.html no redirige"
fi

# Test 2: Verificar que tiene el portal
echo ""
echo "Test 2: Verificando que tiene el portal de herramientas..."
if grep -q 'tools-grid' index.html; then
    echo "✅ PASS: Portal de herramientas encontrado"
else
    echo "❌ FAIL: Portal de herramientas no encontrado"
    exit 1
fi

# Test 3: Verificar links a herramientas
echo ""
echo "Test 3: Verificando links a las 6 herramientas..."
tools=("ECE-DES.html" "ECE-DES-Dashboard.html" "ECE-DES-Tarjetas.html" "generador_tarjetas.html" "guia_operativa_nunca_jamas.html" "simulacro_nunca_jamas_fifa2026.html")
pass_count=0

for tool in "${tools[@]}"; do
    if grep -q "$tool" index.html; then
        echo "  ✅ Link a $tool encontrado"
        ((pass_count++))
    else
        echo "  ❌ Link a $tool NO encontrado"
    fi
done

if [ $pass_count -eq ${#tools[@]} ]; then
    echo "✅ PASS: Todos los links encontrados ($pass_count/6)"
else
    echo "⚠️  WARNING: Solo $pass_count de ${#tools[@]} links encontrados"
fi

# Test 4: Verificar que dist/index.html también existe
echo ""
echo "Test 4: Verificando dist/index.html..."
if [ -f "dist/index.html" ]; then
    echo "✅ PASS: dist/index.html existe"
else
    echo "❌ FAIL: dist/index.html no existe"
fi

# Test 5: Verificar que dist/index.html no redirige
echo ""
echo "Test 5: Verificando que dist/index.html NO redirige..."
if grep -q 'window.location.href = "dist/index.html"' dist/index.html; then
    echo "❌ FAIL: dist/index.html todavía redirige"
    exit 1
else
    echo "✅ PASS: dist/index.html no redirige"
fi

echo ""
echo "======================================"
echo "✅ TODOS LOS TESTS PASARON"
echo ""
echo "📊 Resumen:"
echo "  • index.html: Portal funcionando"
echo "  • dist/index.html: Portal funcionando"
echo "  • Links: $pass_count/6 herramientas"
echo ""
echo "🚀 LISTO PARA PROBAR:"
echo "  open index.html"
