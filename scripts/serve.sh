#!/bin/bash

# CVOED-Tools - Servidor HTTP Local
# Para desarrollo y testing

echo "🚀 Iniciando CVOED-Tools Server..."
echo ""
echo "📂 Sirviendo desde: $(pwd)/dist"
echo "🌐 URL: http://localhost:8000"
echo ""
echo "⏹️  Presiona Ctrl+C para detener"
echo ""

# Cambiar al directorio dist y servir
cd dist && python3 -m http.server 8000

# Nota: Si python3 no está disponible, usa:
# python -m http.server 8000
# o
# php -S localhost:8000
