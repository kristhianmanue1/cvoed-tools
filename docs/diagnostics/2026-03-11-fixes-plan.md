# 🔧 PLAN DE CORRECCIÓN (FIXES)

**Fecha**: 2026-03-11
**Proyecto**: CVOED-Tools
**Agente**: CONTROLADOR (ADRC 2.0)
**Prioridad**: CRÍTICA - BLOQUEANTE
**Tiempo Estimado**: 30 minutos

---

## 🎯 OBJETIVO

Restablecer el acceso al sistema desde `index.html` mediante un portal de navegación funcional a las 7 herramientas.

---

## 📋 PLAN DE ACCIÓN PRIORIZADO

### ✅ FASE 1: FIX INMEDIATO (5 min) - P0 CRÍTICO

#### Fix 1.1: Reemplazar `/index.html` con Portal Real

**Acción**:
```bash
# Backup del archivo actual
cp index.html index.html.backup.redirection-loop

# Crear nuevo index.html con portal de navegación
```

**Especificación del Nuevo `index.html`**:

```html
<!DOCTYPE html>
<html lang="es-MX">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CVOED-Tools | Portal Hospitalario IMSS</title>
    <style>
        :root {
            --inst-guinda: #691C32;
            --inst-guinda-dark: #4A1023;
            --inst-verde-imss: #006657;
            --inst-dorado: #BC955C;
            --bg-primary: #FFFFFF;
            --bg-secondary: #F7F8FA;
            --text-primary: #1A1A2E;
            --text-secondary: #4A5568;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, var(--inst-guinda) 0%, var(--inst-guinda-dark) 40%, var(--inst-verde-imss) 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
            padding: 40px 20px;
        }

        header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }

        header .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
        }

        header .context {
            margin-top: 20px;
            padding: 10px 20px;
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            display: inline-block;
            font-size: 0.9rem;
        }

        .tools-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .tool-card {
            background: var(--bg-primary);
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            border-left: 5px solid var(--inst-dorado);
        }

        .tool-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
        }

        .tool-card h3 {
            color: var(--inst-guinda);
            font-size: 1.4rem;
            margin-bottom: 10px;
        }

        .tool-card .tag {
            display: inline-block;
            background: var(--bg-secondary);
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.75rem;
            color: var(--text-secondary);
            margin-bottom: 15px;
        }

        .tool-card p {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-bottom: 20px;
            line-height: 1.5;
        }

        .tool-card .btn {
            display: inline-block;
            padding: 10px 20px;
            background: var(--inst-guinda);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            transition: background 0.3s ease;
        }

        .tool-card .btn:hover {
            background: var(--inst-guinda-dark);
        }

        .tool-card.featured {
            border-left: 5px solid #C41E3A;
            background: linear-gradient(135deg, #fff 0%, #FDF0F0 100%);
        }

        footer {
            text-align: center;
            color: white;
            padding: 20px;
            opacity: 0.8;
            font-size: 0.85rem;
        }

        .warning-banner {
            background: rgba(255, 193, 7, 0.2);
            border: 1px solid rgba(255, 193, 7, 0.5);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            text-align: center;
            color: white;
        }

        @media (max-width: 768px) {
            header h1 { font-size: 1.8rem; }
            .tools-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🏥 CVOED-Tools</h1>
            <p class="subtitle">Suite Portátil de Herramientas Hospitalarias</p>
            <p class="context">🏆 Copa Mundial FIFA 2026 · IMSS</p>
        </header>

        <div class="warning-banner">
            ⚠️ <strong>Modo Offline:</strong> Este sistema funciona sin internet. Todos los datos se guardan localmente.
        </div>

        <div class="tools-grid">
            <!-- Herramienta 1: ECE-DES (PRINCIPAL) -->
            <div class="tool-card featured">
                <h3>📋 ECE-DES</h3>
                <span class="tag">Herramienta Principal</span>
                <p>Expediente Clínico Electrónico para Desastres. Registro rápido de pacientes, triage START, y trazabilidad clínica completa.</p>
                <a href="dist/ECE-DES.html" class="btn">Acceder →</a>
            </div>

            <!-- Herramienta 2: Dashboard -->
            <div class="tool-card">
                <h3>📊 Dashboard Analítico</h3>
                <span class="tag">Puesto de Mando</span>
                <p>Tablero de control con métricas en tiempo real, gráficas de triage, y reportes directivos para toma de decisiones.</p>
                <a href="dist/ECE-DES-Dashboard.html" class="btn">Acceder →</a>
            </div>

            <!-- Herramienta 3: Tarjetas -->
            <div class="tool-card">
                <h3>🏷️ Impresión de Tarjetas</h3>
                <span class="tag">Soporte Clínico</span>
                <p>Motor de impresión de tarjetas START físicas. Genera plantillas A4 con 4 tarjetas recortables por paciente.</p>
                <a href="dist/ECE-DES-Tarjetas.html" class="btn">Acceder →</a>
            </div>

            <!-- Herramienta 4: Generador SCI-H -->
            <div class="tool-card">
                <h3>👥 Generador SCI-H</h3>
                <span class="tag">Logística</span>
                <p>Genera tarjetas de acción para los roles del Sistema de Comando de Incidentes Hospitalario (Comandante, Operaciones, etc.).</p>
                <a href="dist/generador_tarjetas.html" class="btn">Acceder →</a>
            </div>

            <!-- Herramienta 5: Guía Operativa -->
            <div class="tool-card">
                <h3>📖 Guía Operativa</h3>
                <span class="tag">Referencia</span>
                <p>Manual digital formateado con los protocolos operativos del Hospital Nunca Jamás para emergencias y desastres.</p>
                <a href="dist/guia_operativa_nunca_jamas.html" class="btn">Acceder →</a>
            </div>

            <!-- Herramienta 6: Simulacro -->
            <div class="tool-card">
                <h3>🎯 Simulacro FIFA 2026</h3>
                <span class="tag">Capacitación</span>
                <p>Plataforma de evaluación de simulacros con checklists, métricas de desempeño, y reportes de mejora continua.</p>
                <a href="dist/simulacro_nunca_jamas_fifa2026.html" class="btn">Acceder →</a>
            </div>
        </div>

        <footer>
            <p><strong>CVOED-Tools</strong> · Copyleft 2026 · Apache License 2.0</p>
            <p style="margin-top: 10px;">Desarrollado para el IMSS en el contexto de la Copa Mundial FIFA 2026</p>
            <p style="margin-top: 10px; font-size: 0.8rem; opacity: 0.7;">
                Este sistema es 100% offline y portable. No requiere conexión a internet para funcionar.
            </p>
        </footer>
    </div>
</body>
</html>
```

**Validación**:
```bash
# Verificar que el archivo se creó correctamente
open index.html  # Debe mostrar el portal con las 6 tarjetas
```

---

### ✅ FASE 2: FIX BUILD PROCESS (10 min) - P1 IMPORTANTE

#### Fix 2.1: Actualizar `tools/build.js`

**Problema**: Línea 114 copia el `index.html` roto a `dist/`

**Solución**:
```javascript
// ANTES (línea 114):
const staticFiles = [
  { src: '../index.html', dest: 'index.html' },  // ❌ Copia redirección rota
  // ...
];

// DESPUÉS:
const staticFiles = [
  // { src: '../index.html', dest: 'index.html' },  // ✅ Comentado - no copiar
  { src: '../generador_tarjetas.html', dest: 'generador_tarjetas.html' },
  { src: '../guia_operativa_nunca_jamas.html', dest: 'guia_operativa_nunca_jamas.html' },
  { src: '../simulacro_nunca_jamas_fifa2026.html', dest: 'simulacro_nunca_jamas_fifa2026.html' }
];
```

#### Fix 2.2: Actualizar `build.sh`

**Problema**: Líneas 244-246 copian el `index.html` roto

**Solución**:
```bash
# ANTES (líneas 244-246):
if [ -f "$SRC_DIR/../index.html" ]; then
    cp "$SRC_DIR/../index.html" "$DIST_DIR/"
fi

# DESPUÉS:
# if [ -f "$SRC_DIR/../index.html" ]; then
#     cp "$SRC_DIR/../index.html" "$DIST_DIR/"
# fi
# Nota: index.html ahora es el portal principal, no se copia a dist/
```

---

### ✅ FASE 3: CREAR PORTAL EN DIST (10 min) - P1 IMPORTANTE

#### Fix 3.1: Crear `/dist/index.html` como Portal Real

**Opción A**: Copiar el nuevo `index.html` del root
```bash
cp index.html dist/index.html
```

**Opción B**: Crear un portal específico para `dist/` con links relativos

**Recomendación**: Opción A (mantener consistencia)

---

### ✅ FASE 4: VERIFICACIÓN Y TESTING (5 min) - P0 CRÍTICO

#### Fix 4.1: Test Suite Manual

```bash
#!/bin/bash
echo "🧪 Testing CVOED-Tools Portal..."

# Test 1: Verificar que index.html NO es redirección
if grep -q 'window.location.href = "dist/index.html"' index.html; then
    echo "❌ FAIL: index.html todavía redirige"
    exit 1
else
    echo "✅ PASS: index.html no redirige"
fi

# Test 2: Verificar links a herramientas
for tool in "ECE-DES.html" "ECE-DES-Dashboard.html" "ECE-DES-Tarjetas.html" "generador_tarjetas.html" "guia_operativa_nunca_jamas.html" "simulacro_nunca_jamas_fifa2026.html"; do
    if grep -q "$tool" index.html; then
        echo "✅ PASS: Link a $tool encontrado"
    else
        echo "❌ FAIL: Link a $tool no encontrado"
    fi
done

# Test 3: Verificar que los archivos destino existen
for file in dist/ECE-DES.html dist/ECE-DES-Dashboard.html dist/ECE-DES-Tarjetas.html dist/generador_tarjetas.html dist/guia_operativa_nunca_jamas.html dist/simulacro_nunca_jamas_fifa2026.html; do
    if [ -f "$file" ]; then
        echo "✅ PASS: $file existe"
    else
        echo "❌ FAIL: $file no existe"
    fi
done

echo "✅ Tests completados"
```

**Ejecutar**:
```bash
chmod +x test-portal.sh
./test-portal.sh
```

---

## 📊 RESUMEN DE FIXES

| ID | Fix | Archivos | Tiempo | Prioridad |
|----|-----|----------|--------|-----------|
| 1.1 | Crear portal index.html | `/index.html` | 5 min | 🚨 P0 |
| 2.1 | Actualizar build.js | `tools/build.js` | 3 min | ⚠️ P1 |
| 2.2 | Actualizar build.sh | `build.sh` | 2 min | ⚠️ P1 |
| 3.1 | Copiar portal a dist | `/dist/index.html` | 1 min | ⚠️ P1 |
| 4.1 | Test suite | `test-portal.sh` | 4 min | 🚨 P0 |

**Total**: ~15 minutos de trabajo activo

---

## 🚀 EJECUCIÓN INMEDIATA (Comandos)

```bash
# 1. Backup y creacion del nuevo portal
cp index.html index.html.backup.redirection-loop

# 2. Crear el nuevo index.html (pegar el código HTML de arriba)
cat > index.html << 'EOF'
[PEGAR EL CÓDIGO HTML COMPLETO AQUÍ]
EOF

# 3. Copiar a dist/
cp index.html dist/index.html

# 4. Actualizar build.js
sed -i.tmp "s|{ src: '../index.html', dest: 'index.html' }|// { src: '../index.html', dest: 'index.html' }|g" tools/build.js
rm -f tools/build.js.tmp

# 5. Actualizar build.sh
sed -i.tmp '/cp "$SRC_DIR\/..\/index.html"/s/^/#/' build.sh
rm -f build.sh.tmp

# 6. Verificar
open index.html
```

---

## ✅ CRITERIOS DE ÉXITO

- [ ] Abrir `index.html` muestra el portal con 6 tarjetas
- [ ] Cada tarjeta lleva a la herramienta correcta
- [ ] No hay redirecciones infinitas
- [ ] Consola del navegador sin errores
- [ ] Funciona en todos los navegadores (Chrome, Firefox, Safari)
- [ ] Responsive en móvil

---

## 🔄 PROCESO DE VALIDACIÓN

1. **Test Manual**: Abrir `index.html` en navegador
2. **Test Links**: Clic en cada una de las 6 tarjetas
3. **Test Build**: Ejecutar `./build.sh` y verificar que no rompe nada
4. **Test Dist**: Abrir `dist/index.html` y verificar que funciona igual

---

**Firma**: CONTROLADOR - ADRC 2.0 Framework
**Estado**: LISTO PARA EJECUCIÓN
**Próxima Acción**: 🔨 **IMPLEMENTAR FIX 1.1** (Crear portal index.html)
