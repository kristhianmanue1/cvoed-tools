# PLAN DE REORGANIZACIÓN DE ARCHIVOS - CVOED-TOOLS

**Fecha:** 2026-03-03
**Arquitecto:** ADRC CONTROLADOR
**Versión:** 1.0.0
**Objetivo:** Organizar estructura de proyecto para claridad y mantenibilidad

---

## 📊 ESTADO ACTUAL VS DESEADO

### Estado Actual (Desorganizado)

```
cvoed-tools/                    # ~37 MB total
├── ECE-DES.html               # 1.8 MB - (¿Producción?)
├── ECE-DES-Dashboard.html     # 919 KB - (¿Producción?)
├── ECE-DES-Tarjetas.html      # 13 KB - (¿Producción?)
├── index.html                 # 14 KB - (¿Producción o Desarrollo?)
├── generador_tarjetas.html    # 117 KB - (Standalone)
├── guia_operativa_nunca_jamas.html    # 41 KB - (Standalone)
├── simulacro_nunca_jamas_fifa2026.html  # 84 KB - (Standalone)
│
├── src/                       # (¿Código de desarrollo?)
│   ├── index.html            # → ¿Espera, hay dos index.html?
│   ├── dashboard.html
│   ├── tarjetas.html
│   ├── js/
│   │   ├── app.js            # 588 líneas
│   │   ├── app.js.backup     # ¿Backup?
│   │   ├── dashboard.js      # 195 líneas
│   │   ├── dashboard.js.backup
│   │   ├── db-migrations.js  # 151 líneas (nuevo)
│   │   ├── sql-wasm.js       # 192 líneas
│   │   ├── sql-wasm.wasm     # 655 KB
│   │   └── xlsx.full.min.js  # 945 KB
│   └── css/
│       └── style.css         # Tokens v2.0
│
├── docs/                      # (Documentación mezclada)
│   ├── ARQUITECTURA_ANALISIS.md
│   ├── ARQUITECTURA_ANALISIS_REAL.md
│   ├── REFACTORING_PLAN.md
│   ├── REFACTORING_PLAN_V2.md
│   ├── TECH_STACK_DECISION.md
│   ├── TECH_STACK_DECISION_V2.md
│   ├── MIGRATION_GUIDE.md
│   ├── ESTIMATIONS.md
│   ├── AGENT_TASKS_SPEC.md
│   ├── TARES_TECNICAS.md
│   └── pdf/
│       ├── Guía SMV-H.pdf
│       └── ... (más PDFs)
│
├── build.js                   # (¿Herramienta?)
├── patch_table.js            # ¿Qué es esto?
├── coverage/                  # ❌ NO DEBERÍA ESTAR AQUÍ
│   └── ... (Vitest coverage)
├── vitest.config.js          # ❌ NO APLICA
├── node_modules/             # ❌ NO DEBERÍA ESTAR EN REPO
│   └── ... (dependencias dev)
├── package.json              # ❌ NO APLICA EN PRODUCCIÓN
├── README.md                 # ✅ CORRECTO
└── LICENSE                   # ¿Existe?
```

**Problemas Identificados:**

1. ❌ **Mezcla de producción y desarrollo** en raíz
2. ❌ **Archivos duplicados** (index.html en raíz y src/)
3. ❌ **Archivos incorrectos** (coverage/, vitest.config.js, node_modules/)
4. ❌ **Backups en repo** (.backup files)
5. ❌ **Estructura plana** - TODO está en raíz o src/
6. ❌ **Sin separación de concerns** - HTML standalone mezclado con HTML modular
7. ❌ **Documentación desorganizada** - Varios archivos obsoletos (v1 vs v2)

---

### Estado Deseado (Organizado)

```
cvoed-tools/                    # ~3 MB en dist/
│
├── README.md                  # ✅ Explica sistema portable
├── LICENSE                    # Apache 2.0
├── .gitignore                 # Ignora node_modules, dist/, etc.
│
├── 📁 dist/                   # PRODUCCIÓN (HTML autocontenidos)
│   ├── ECE-DES.html          # 1.8 MB - Generado por build.js
│   ├── ECE-DES-Dashboard.html  # 919 KB - Generado por build.js
│   ├── ECE-DES-Tarjetas.html   # 13 KB - Generado por build.js
│   ├── index.html            # Portal principal (12 KB)
│   ├── generador_tarjetas.html  # Standalone (117 KB)
│   ├── guia_operativa_nunca_jamas.html  # Standalone (41 KB)
│   └── simulacro_nunca_jamas_fifa2026.html  # Standalone (84 KB)
│
├── 📁 src/                    # DESARROLLO (Código modular)
│   │
│   ├── 📁 ece-des/           # Módulo: Expediente Clínico
│   │   ├── index.html        # → dist/ECE-DES.html
│   │   ├── 📁 js/
│   │   │   ├── app.js        # Lógica principal
│   │   │   └── db-migrations.js  # Sistema de versioning DB
│   │   └── 📁 css/
│   │       └── custom.css    # Estilos específicos ECE-DES
│   │
│   ├── 📁 dashboard/         # Módulo: Dashboard
│   │   ├── index.html        # → dist/ECE-DES-Dashboard.html
│   │   └── 📁 js/
│   │       └── dashboard.js  # Lógica dashboard
│   │
│   ├── 📁 tarjetas/          # Módulo: Impresión de Tarjetas
│   │   ├── index.html        # → dist/ECE-DES-Tarjetas.html
│   │   └── 📁 js/
│   │       └── tarjetas.js   # Lógica de impresión
│   │
│   └── 📁 shared/            # CÓDIGO COMPARTIDO
│       ├── 📁 css/
│       │   └── tokens.css    # Tokens v2.0 (compartido por todos)
│       ├── 📁 js/
│       │   ├── sql-wasm.js   # SQLite WASM (655 KB + 192 líneas JS)
│       │   ├── sql-wasm.wasm
│       │   ├── xlsx.full.min.js  # SheetJS (945 KB)
│       │   └── utils.js      # Utilidades comunes
│       └── 📁 fonts/         # (Si se usan fonts locales)
│           └── .gitkeep
│
├── 📁 tools/                 # HERRAMIENTAS DE DESARROLLO
│   ├── build.js              # Build system (actualizado)
│   └── dev-server.js         # (Opcional) Server de desarrollo local
│
├── 📁 docs/                  # DOCUMENTACIÓN TÉCNICA
│   ├── 📁 pdf/               # Guías IMSS en PDF
│   │   ├── Guía SMV-H.pdf
│   │   ├── SCI-Hospitalario.pdf
│   │   ├── Guía EVAC-H.pdf
│   │   ├── Guía BCP-H.pdf
│   │   ├── Guía PH-RED.pdf
│   │   ├── Guía QBRNE.pdf
│   │   ├── Manual PHS.pdf
│   │   └── Ejercicio FIFA 2026.pdf
│   │
│   ├── ARQUITECTURA_ANALISIS_REAL.md  # ✅ Análisis correcto
│   ├── REFACTORING_PLAN_V2.md         # ✅ Plan v2 portable
│   ├── TECH_STACK_DECISION_V2.md      # ✅ Decisiones v2
│   ├── FILE_REORGANIZATION_PLAN.md    # ✅ Este documento
│   ├── TARES_TECNICAS.md              # Especificación original
│   └── AGENT_TASKS_SPEC.md            # Para agentes IA
│
├── 📁 scripts/               # (Opcional) Scripts de utilidad
│   ├── migrate-structure.sh  # Script de migración
│   ├── clean.sh              # Limpia dist/ y artifacts
│   └── test.sh               # Ejecuta tests manuales
│
└── 📁 development/           # (Opcional) Para desarrollo local
    ├── node_modules/         # ❌ Ignorado por git
    ├── package.json         # ❌ Ignorado por git (solo para desarrollo)
    └── vitest.config.js     # ❌ Ignorado por git (solo si se usa)
```

---

## 🔄 PLAN DE MIGRACIÓN

### Fase 1: Limpieza (Día 1)

#### 1.1 Eliminar Archivos Incorrectos

```bash
#!/bin/bash
# clean-incorrect-files.sh

echo "🧹 Limpiando archivos incorrectos..."

# Eliminar coverage (Vitest no aplica)
if [ -d "coverage" ]; then
  rm -rf coverage/
  echo "✅ Eliminado coverage/"
fi

# Eliminar vitest.config.js
if [ -f "vitest.config.js" ]; then
  rm vitest.config.js
  echo "✅ Eliminado vitest.config.js"
fi

# Eliminar node_modules (se puede recrear con npm install si es necesario)
if [ -d "node_modules" ]; then
  rm -rf node_modules/
  echo "✅ Eliminado node_modules/"
fi

# Eliminar archivos .backup
find src/ -name "*.backup" -delete
echo "✅ Eliminados archivos .backup"

# Eliminar patch_table.js (no se usa)
if [ -f "patch_table.js" ]; then
  rm patch_table.js
  echo "✅ Eliminado patch_table.js"
fi

# Eliminar documentos obsoletos v1
cd docs/
rm -f ARQUITECTURA_ANALISIS.md
rm -f REFACTORING_PLAN.md
rm -f TECH_STACK_DECISION.md
rm -f MIGRATION_GUIDE.md
rm -f ESTIMATIONS.md
cd ..
echo "✅ Eliminados documentos obsoletos v1"

echo "🎉 Limpieza completada!"
```

#### 1.2 Crear .gitignore

```bash
# .gitignore
# Dependencias de desarrollo
node_modules/
coverage/

# Archivos generados
dist/
*.log

# Archivos de editor
.vscode/
.idea/
*.swp
*.swo
*~

# Backups
*.backup
*.bak

# OS
.DS_Store
Thumbs.db
```

---

### Fase 2: Crear Nueva Estructura (Día 2)

#### 2.1 Script de Migración

```bash
#!/bin/bash
# migrate-to-new-structure.sh

set -e  # Detener si hay error

echo "🚀 Migrando a nueva estructura..."

# Crear nuevas carpetas
echo "📁 Creando nueva estructura..."
mkdir -p dist
mkdir -p src/ece-des/{js,css}
mkdir -p src/dashboard/{js,css}
mkdir -p src/tarjetas/{js,css}
mkdir -p src/shared/{js,css,fonts}
mkdir -p tools
mkdir -p scripts
mkdir -p development

# Mover archivos de producción
echo "📦 Moviando archivos de producción..."
mv ECE-DES.html dist/ 2>/dev/null || echo "⚠️  ECE-DES.html no encontrado"
mv ECE-DES-Dashboard.html dist/ 2>/dev/null || echo "⚠️  ECE-DES-Dashboard.html no encontrado"
mv ECE-DES-Tarjetas.html dist/ 2>/dev/null || echo "⚠️  ECE-DES-Tarjetas.html no encontrado"
mv index.html dist/ 2>/dev/null || echo "⚠️  index.html no encontrado"
mv generador_tarjetas.html dist/ 2>/dev/null || echo "⚠️  generador_tarjetas.html no encontrado"
mv guia_operativa_nunca_jamas.html dist/ 2>/dev/null || echo "⚠️  guia_operativa_nunca_jamas.html no encontrado"
mv simulacro_nunca_jamas_fifa2026.html dist/ 2>/dev/null || echo "⚠️  simulacro_nunca_jamas_fifa2026.html no encontrado"

# Mover código modular ECE-DES
echo "📦 Moviendo código ECE-DES..."
mv src/index.html src/ece-des/ 2>/dev/null || echo "⚠️  src/index.html no encontrado"
mv src/js/app.js src/ece-des/js/ 2>/dev/null || echo "⚠️  src/js/app.js no encontrado"
mv src/js/db-migrations.js src/ece-des/js/ 2>/dev/null || echo "⚠️  src/js/db-migrations.js no encontrado"

# Mover código modular Dashboard
echo "📦 Moviendo código Dashboard..."
mv src/dashboard.html src/dashboard/index.html 2>/dev/null || echo "⚠️  src/dashboard.html no encontrado"
mv src/js/dashboard.js src/dashboard/js/ 2>/dev/null || echo "⚠️  src/js/dashboard.js no encontrado"

# Mover código modular Tarjetas
echo "📦 Moviendo código Tarjetas..."
mv src/tarjetas.html src/tarjetas/index.html 2>/dev/null || echo "⚠️  src/tarjetas.html no encontrado"
# mv src/js/tarjetas.js src/tarjetas/js/ 2>/dev/null || echo "⚠️  src/js/tarjetas.js no encontrado"

# Mover código compartido
echo "📦 Moviendo código compartido..."
mv src/js/sql-wasm.js src/shared/js/ 2>/dev/null || echo "⚠️  src/js/sql-wasm.js no encontrado"
mv src/js/sql-wasm.wasm src/shared/js/ 2>/dev/null || echo "⚠️  src/js/sql-wasm.wasm no encontrado"
mv src/js/xlsx.full.min.js src/shared/js/ 2>/dev/null || echo "⚠️  src/js/xlsx.full.min.js no encontrado"
mv src/css/style.css src/shared/css/tokens.css 2>/dev/null || echo "⚠️  src/css/style.css no encontrado"

# Crear utils.js compartido si no existe
if [ ! -f "src/shared/js/utils.js" ]; then
  cat > src/shared/js/utils.js << 'EOF'
// Utilidades compartidas para CVOED-Tools

export function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function formatDate(date) {
  return new Date(date).toLocaleString('es-MX');
}

export function generateFolio() {
  return `P-${Date.now().toString(36).toUpperCase()}`;
}

export const TRIAGE_COLORS = {
  rojo: { hex: '#C41E3A', symbol: '◆', name: 'ROJO' },
  amarillo: { hex: '#D4940A', symbol: '▲', name: 'AMARILLO' },
  verde: { hex: '#1B7340', symbol: '●', name: 'VERDE' },
  negro: { hex: '#1A1A2E', symbol: '✚', name: 'NEGRO' }
};

export function getTriageInfo(triage) {
  return TRIAGE_COLORS[triage.toLowerCase()] || TRIAGE_COLORS.verde;
}
EOF
  echo "✅ Creado src/shared/js/utils.js"
fi

# Mover herramientas
echo "🔧 Moviendo herramientas..."
mv build.js tools/ 2>/dev/null || echo "⚠️  build.js no encontrado"

# Crear .gitkeep en carpetas vacías
touch src/shared/fonts/.gitkeep

echo ""
echo "🎉 Migración completada!"
echo ""
echo "📊 Estructura resultante:"
tree -L 3 -I 'node_modules|coverage' || ls -R
```

#### 2.2 Ejecutar Migración

```bash
# Hacer backup primero (PRECAUCIÓN)
cp -r . ../cvoed-tools-backup-$(date +%Y%m%d)

# Ejecutar script
chmod +x migrate-to-new-structure.sh
./migrate-to-new-structure.sh
```

---

### Fase 3: Actualizar Referencias (Días 3-4)

#### 3.1 Actualizar src/ece-des/index.html

**ANTES (src/index.html antiguo):**
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <script src="js/sql-wasm.js"></script>
  <script src="js/xlsx.full.min.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

**DESPUÉS (src/ece-des/index.html nuevo):**
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>ECE-DES - Expediente Clínico para Desastres</title>
  <!-- CÓDIGO COMPARTIDO: CSS Tokens -->
  <link rel="stylesheet" href="/*shared*/css/tokens.css">
  <!-- ESTILOS ESPECÍFICOS: ECE-DES -->
  <link rel="stylesheet" href="css/custom.css">
</head>
<body>
  <!-- CÓDIGO COMPARTIDO: SQLite WASM -->
  <script src="/*shared*/js/sql-wasm.js"></script>
  <!-- CÓDIGO COMPARTIDO: SheetJS -->
  <script src="/*shared*/js/xlsx.full.min.js"></script>
  <!-- CÓDIGO COMPARTIDO: Utils -->
  <script src="/*shared*/js/utils.js"></script>
  <!-- LÓGICA ESPECÍFICA: ECE-DES -->
  <script src="js/db-migrations.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

#### 3.2 Actualizar src/dashboard/index.html

**Cambios similares:**
- Reemplazar referencias a `css/style.css` → `/*shared*/css/tokens.css`
- Reemplazar referencias a `js/sql-wasm.js` → `/*shared*/js/sql-wasm.js`
- Actualizar imports en dashboard.js si usa módulos ES6

#### 3.3 Actualizar imports en JavaScript

**src/ece-des/js/app.js:**
```javascript
// ANTES (si usaba ES modules)
import { migrateDatabase } from './db-migrations.js';

// DESPUÉS (sigue igual porque está en la misma carpeta)
import { migrateDatabase } from './db-migrations.js';

// NUEVO: Importar utils compartido
import { escapeHTML, generateFolio, TRIAGE_COLORS } from '/*shared*/js/utils.js';
```

---

### Fase 4: Actualizar build.js (Día 5)

#### 4.1 Nueva Versión: tools/build.js

```javascript
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

// Crear directorio dist si no existe
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const bundleHtml = (moduleName, outputName) => {
  try {
    const inPath = path.join(srcDir, moduleName, 'index.html');
    const outPath = path.join(distDir, outputName);

    if (!fs.existsSync(inPath)) {
      console.log(`⚠️  Skipping ${moduleName} (not found: ${inPath})`);
      return;
    }

    let html = fs.readFileSync(inPath, 'utf8');
    let originalSize = html.length;

    // Inline CSS desde shared/
    html = html.replace(/<link rel="stylesheet" href="\/\*shared\*\/(.*?)">/g, (match, p1) => {
      const cssPath = path.join(srcDir, 'shared', p1);
      if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        console.log(`  📝 Inlining CSS: shared/${p1}`);
        return `<style>\n${cssContent}\n</style>`;
      }
      console.log(`  ⚠️  CSS not found: shared/${p1}`);
      return match;
    });

    // Inline CSS desde módulo específico
    html = html.replace(/<link rel="stylesheet" href="(.*?)">/g, (match, p1) => {
      const cssPath = path.join(srcDir, moduleName, p1);
      if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        console.log(`  📝 Inlining CSS: ${moduleName}/${p1}`);
        return `<style>\n${cssContent}\n</style>`;
      }
      return match;
    });

    // Inline JS desde shared/
    html = html.replace(/<script src="\/\*shared\*\/(.*?)"><\/script>/g, (match, p1) => {
      const jsPath = path.join(srcDir, 'shared', p1);
      if (!fs.existsSync(jsPath)) {
        console.log(`  ⚠️  JS not found: shared/${p1}`);
        return match;
      }

      const jsContent = fs.readFileSync(jsPath, 'utf8');

      // Caso especial: sql-wasm.js necesita inline del WASM
      if (p1.includes('sql-wasm.js')) {
        const wasmPath = path.join(srcDir, 'shared', 'js', 'sql-wasm.wasm');
        if (fs.existsSync(wasmPath)) {
          const wasmBase64 = fs.readFileSync(wasmPath).toString('base64');
          const wasmDataURI = `data:application/wasm;base64,${wasmBase64}`;
          console.log(`  📦 Inlining WASM: sql-wasm.wasm (${(wasmBase64.length/1024).toFixed(0)} KB base64)`);
          return `<script>\nwindow.SQL_WASM_URI = "${wasmDataURI}";\n${jsContent}\n</script>`;
        }
      }

      console.log(`  📜 Inlining JS: shared/${p1}`);
      return `<script>\n${jsContent}\n</script>`;
    });

    // Inline JS desde módulo específico
    html = html.replace(/<script src="(.*?)"><\/script>/g, (match, p1) => {
      const jsPath = path.join(srcDir, moduleName, p1);
      if (!fs.existsSync(jsPath)) {
        console.log(`  ⚠️  JS not found: ${moduleName}/${p1}`);
        return match;
      }

      const jsContent = fs.readFileSync(jsPath, 'utf8');
      console.log(`  📜 Inlining JS: ${moduleName}/${p1}`);
      return `<script>\n${jsContent}\n</script>`;
    });

    // Procesar imports ES6 (simple inline - no resuelve dependencias complejas)
    // Nota: ES modules en src/ se convierten a código plano en el HTML final
    // build.js NO resuelve imports, solo hace inline de archivos

    fs.writeFileSync(outPath, html);
    const finalSize = html.length;
    const sizeKB = (finalSize / 1024).toFixed(0);
    const sizeMB = (finalSize / 1024 / 1024).toFixed(2);

    console.log(`✅ Bundle creado: ${outputName} (${sizeMB} MB | ${sizeKB} KB)`);
    console.log(`   Tamaño: ${finalSize.toLocaleString()} bytes`);

  } catch (error) {
    console.error(`❌ Error building ${outputName}:`, error.message);
  }
};

console.log('🔨 CVOED-Tools Build System v2.0\n');
console.log('📂 SRC:', srcDir);
console.log('📂 DIST:', distDir);
console.log('');

// Generar módulos
console.log('🏗️  Building modules...\n');
bundleHtml('ece-des', 'ECE-DES.html');
bundleHtml('dashboard', 'ECE-DES-Dashboard.html');
bundleHtml('tarjetas', 'ECE-DES-Tarjetas.html');

console.log('\n✅ Build completado!');
console.log('📂 Archivos generados en dist/');
console.log('');
console.log('💡 Para probar:');
console.log('   open dist/ECE-DES.html');
```

#### 4.2 Ejecutar Nuevo Build

```bash
cd tools
node build.js
```

**Salida esperada:**
```
🔨 CVOED-Tools Build System v2.0

📂 SRC: /path/to/cvoed-tools/src
📂 DIST: /path/to/cvoed-tools/dist

🏗️  Building modules...

📝 Inlining CSS: shared/css/tokens.css
📝 Inlining CSS: ece-des/css/custom.css
📦 Inlining WASM: sql-wasm.wasm (872 KB base64)
📜 Inlining JS: shared/js/sql-wasm.js
📜 Inlining JS: shared/js/xlsx.full.min.js
📜 Inlining JS: shared/js/utils.js
📜 Inlining JS: ece-des/js/db-migrations.js
📜 Inlining JS: ece-des/js/app.js
✅ Bundle creado: ECE-DES.html (1.82 MB | 1864 KB)
   Tamaño: 1,908,736 bytes

... (más módulos)

✅ Build completado!
📂 Archivos generados en dist/

💡 Para probar:
   open dist/ECE-DES.html
```

---

### Fase 5: Verificación (Día 6)

#### 5.1 Checklist de Verificación

```bash
#!/bin/bash
# verify-migration.sh

echo "🔍 Verificando migración...\n"

# 1. Verificar estructura de carpetas
echo "✅ Verificando estructura..."
[ -d "dist" ] && echo "  ✓ dist/ existe" || echo "  ✗ dist/ NO existe"
[ -d "src/ece-des" ] && echo "  ✓ src/ece-des/ existe" || echo "  ✗ src/ece-des/ NO existe"
[ -d "src/dashboard" ] && echo "  ✓ src/dashboard/ existe" || echo "  ✗ src/dashboard/ NO existe"
[ -d "src/tarjetas" ] && echo "  ✓ src/tarjetas/ existe" || echo "  ✗ src/tarjetas/ NO existe"
[ -d "src/shared" ] && echo "  ✓ src/shared/ existe" || echo "  ✗ src/shared/ NO existe"
[ -d "tools" ] && echo "  ✓ tools/ existe" || echo "  ✗ tools/ NO existe"

# 2. Verificar archivos incorrectos eliminados
echo "\n✅ Verificando limpieza..."
[ ! -d "coverage" ] && echo "  ✓ coverage/ eliminado" || echo "  ✗ coverage/ aún existe"
[ ! -f "vitest.config.js" ] && echo "  ✓ vitest.config.js eliminado" || echo "  ✗ vitest.config.js aún existe"
[ ! -d "node_modules" ] && echo "  ✓ node_modules/ eliminado" || echo "  ⚠️  node_modules/ existe (opcional para dev)"

# 3. Verificar archivos de producción
echo "\n✅ Verificando archivos de producción..."
[ -f "dist/ECE-DES.html" ] && echo "  ✓ dist/ECE-DES.html existe" || echo "  ✗ dist/ECE-DES.html NO existe"
[ -f "dist/ECE-DES-Dashboard.html" ] && echo "  ✓ dist/ECE-DES-Dashboard.html existe" || echo "  ✗ dist/ECE-DES-Dashboard.html NO existe"
[ -f "dist/ECE-DES-Tarjetas.html" ] && echo "  ✓ dist/ECE-DES-Tarjetas.html existe" || echo "  ✗ dist/ECE-DES-Tarjetas.html NO existe"

# 4. Verificar código compartido
echo "\n✅ Verificando código compartido..."
[ -f "src/shared/css/tokens.css" ] && echo "  ✓ tokens.css existe" || echo "  ✗ tokens.css NO existe"
[ -f "src/shared/js/sql-wasm.js" ] && echo "  ✓ sql-wasm.js existe" || echo "  ✗ sql-wasm.js NO existe"
[ -f "src/shared/js/xlsx.full.min.js" ] && echo "  ✓ xlsx.full.min.js existe" || echo "  ✗ xlsx.full.min.js NO existe"
[ -f "src/shared/js/utils.js" ] && echo "  ✓ utils.js existe" || echo "  ✗ utils.js NO existe"

# 5. Verificar tamaños
echo "\n✅ Verificando tamaños..."
if [ -f "dist/ECE-DES.html" ]; then
  SIZE=$(wc -c < "dist/ECE-DES.html" | awk '{print int($1/1024/1024*100)/100 " MB"}')
  echo "  ECE-DES.html: $SIZE"
fi

# 6. Verificar portabilidad (básico)
echo "\n✅ Verificando portabilidad..."
if grep -q "window.SQL_WASM_URI" dist/ECE-DES.html; then
  echo "  ✓ WASM inline encontrado"
else
  echo "  ✗ WASM inline NO encontrado"
fi

if grep -q "import " dist/ECE-DES.html; then
  echo "  ✗ ERROR: Hay ES modules en HTML final (no debería)"
else
  echo "  ✓ No hay ES modules en HTML final"
fi

echo "\n🎉 Verificación completada!"
```

#### 5.2 Testing Funcional

```bash
# Abrir HTML en navegador (macOS)
open dist/ECE-DES.html

# Abrir HTML en navegador (Linux)
xdg-open dist/ECE-DES.html

# Abrir HTML en navegador (Windows)
start dist/ECE-DES.html
```

**Checklist manual:**
- [ ] HTML abre con doble clic
- [ ] No hay errores en consola
- [ ] SQLite WASM carga correctamente
- [ ] IndexedDB funciona
- [ ] Persistencia de datos funciona

---

## 📊 BENEFICIOS DE LA REORGANIZACIÓN

### Antes
```
❌ Mezcla de producción y desarrollo
❌ Duplicación de archivos (index.html en raíz y src/)
❌ Archivos incorrectos en repo (coverage/, vitest.config.js)
❌ Sin separación de código compartido
❌ Estructura plana confusa
```

### Después
```
✅ Producción (dist/) separada de desarrollo (src/)
✅ Código compartido claramente identificado (src/shared/)
✅ Cada módulo tiene su carpeta (ece-des/, dashboard/, tarjetas/)
✅ Herramientas de desarrollo en tools/
✅ Documentación organizada en docs/
✅ Solo archivos necesarios en repo
```

---

## 🎯 PRÓXIMOS PASOS

1. ✅ **Ejecutar script de migración**
2. ✅ **Verificar que todo funciona**
3. ✅ **Probar build.js nuevo**
4. ✅ **Commit a git con nueva estructura**
5. ⏭️ **Actualizar README.md con nueva estructura**
6. ⏭️ **Documentar proceso de desarrollo**

---

**Plan de Reorganización v1.0**
**ADRC CONTROLADOR**
**2026-03-03**
