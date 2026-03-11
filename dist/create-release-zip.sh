#!/bin/bash
# CVOED-Tools - Script para crear ZIP descargable

echo "📦 CVOED-Tools - Creando ZIP descargable..."
echo "=========================================="

# Crear nombre del ZIP con versión
VERSION="1.0.0"
ZIP_NAME="CVOED-Tools-Completo-v${VERSION}.zip"

# Crear ZIP desde el directorio dist/
echo "📂 Empaquetando archivos de dist/..."
cd dist
zip -q -r "../${ZIP_NAME}" *.html
cd ..

# Verificar tamaño
SIZE=$(du -h "${ZIP_NAME}" | cut -f1)
FILES=$(unzip -l "${ZIP_NAME}" | wc -l | tr -d ' ')

echo ""
echo "✅ ZIP creado exitosamente!"
echo "📦 Archivo: ${ZIP_NAME}"
echo "📊 Tamaño: ${SIZE}"
echo "📄 Archivos incluidos: ${FILES}"
echo ""
echo "📋 Contenido:"
unzip -l "${ZIP_NAME}" | tail -10
echo ""
echo "🚀 Listo para subir a GitHub Release!"
