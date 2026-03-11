const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

// Crear dist si no existe
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('✅ Created dist directory');
}

const bundleHtml = (moduleName, outputName) => {
  try {
    const moduleDir = path.join(srcDir, moduleName);
    const inPath = path.join(moduleDir, 'index.html');
    const outPath = path.join(distDir, outputName);

    if (!fs.existsSync(inPath)) {
      console.log(`⚠️ Skipping ${moduleName} (Not found: ${inPath})`);
      return;
    }

    console.log(`🔨 Building ${moduleName}...`);
    let html = fs.readFileSync(inPath, 'utf8');

    // Replace CSS - busca /*shared*/ en las rutas
    html = html.replace(/<link rel="stylesheet" href="(.*?)">/g, (match, p1) => {
      let cssPath;

      if (p1.includes('/*shared*/')) {
        const cleanPath = p1.replace('/*shared*/', '');
        // Buscar en shared primero
        cssPath = path.join(srcDir, 'shared', cleanPath);
        if (!fs.existsSync(cssPath)) {
          // Si no está en shared, buscar en el módulo actual
          cssPath = path.join(moduleDir, cleanPath);
        }
      } else {
        // Ruta relativa al módulo actual
        cssPath = path.join(moduleDir, p1);
      }

      if (fs.existsSync(cssPath)) {
        console.log(`  ✅ Inlined CSS: ${cssPath}`);
        return `<style>\n${fs.readFileSync(cssPath, 'utf8')}\n</style>`;
      } else {
        console.log(`  ❌ CSS not found: ${cssPath}`);
        return match;
      }
    });

    // Inline JS - busca /*shared*/ en las rutas
    html = html.replace(/<script src="(.*?)"><\/script>/g, (match, p1) => {
      let jsPath;

      if (p1.includes('/*shared*/')) {
        const cleanPath = p1.replace('/*shared*/', '');
        // Buscar en shared primero
        jsPath = path.join(srcDir, 'shared', cleanPath);
        if (!fs.existsSync(jsPath)) {
          // Si no está en shared, buscar en el módulo actual
          jsPath = path.join(moduleDir, cleanPath);
        }
      } else {
        // Ruta relativa al módulo actual
        jsPath = path.join(moduleDir, p1);
      }

      if (!fs.existsSync(jsPath)) {
        console.log(`  ❌ JS not found: ${jsPath}`);
        return match;
      }

      const jsContent = fs.readFileSync(jsPath, 'utf8');

      if (p1.includes('sql-wasm.js')) {
        // Convertir WASM a Base64 (mantener compatibilidad)
        const wasmPath = path.join(srcDir, 'shared', 'js', 'sql-wasm.wasm');
        if (fs.existsSync(wasmPath)) {
          const wasmBase64 = fs.readFileSync(wasmPath).toString('base64');
          const wasmDataURI = `data:application/wasm;base64,${wasmBase64}`;
          console.log(`  ✅ Converted WASM to Base64`);
          return `<script>\nwindow.SQL_WASM_URI = "${wasmDataURI}";\n${jsContent}\n</script>`;
        } else {
          console.log(`  ❌ WASM not found: ${wasmPath}`);
        }
      }

      console.log(`  ✅ Inlined JS: ${jsPath}`);
      return `<script>\n${jsContent}\n</script>`;
    });

    // Verificar dist antes de escribir
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
      console.log('✅ Created dist directory');
    }

    fs.writeFileSync(outPath, html);
    console.log(`✅ Bundle created successfully: ${outputName}\n`);
  } catch (error) {
    console.error(`❌ Error building ${outputName}:`, error);
  }
};

// Generar módulos
bundleHtml('ece-des', 'ECE-DES.html');
bundleHtml('dashboard', 'ECE-DES-Dashboard.html');
bundleHtml('tarjetas', 'ECE-DES-Tarjetas.html');

// Copiar archivos estáticos adicionales (si existen)
const staticFiles = [
  // { src: '../index.html', dest: 'index.html' },  // COMENTADO: index.html es el portal principal, no se copia en build
  { src: '../generador_tarjetas.html', dest: 'generador_tarjetas.html' },
  { src: '../guia_operativa_nunca_jamas.html', dest: 'guia_operativa_nunca_jamas.html' },
  { src: '../simulacro_nunca_jamas_fifa2026.html', dest: 'simulacro_nunca_jamas_fifa2026.html' }
];

console.log('\n📋 Copying static files...');
for (const file of staticFiles) {
  const srcPath = path.join(__dirname, file.src);
  const destPath = path.join(distDir, file.dest);

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`  ✅ Copied: ${file.dest}`);
  }
}

console.log('✅ Build completed!\n');
