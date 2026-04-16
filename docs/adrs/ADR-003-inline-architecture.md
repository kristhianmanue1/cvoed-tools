# ADR-003: Arquitectura Inline/Autocontenida

## Status
**Aceptado** - Arquitectura fundacional de CVOED-Tools

## Contexto
CVOED-Tools está diseñado para uso en emergencias hospitalarias donde:
- La conectividad a internet es inexistente o unreliable
- No hay tiempo para instalaciones o configuraciones
- El personal técnico puede no estar disponible
- La portabilidad es crítica (USB, transferencia peer-to-peer)

### Requerimientos Operativos

1. **Zero setup** - Solo abrir el archivo HTML
2. **Zero dependencies** - No descargar nada de CDNs
3. **100% portable** - Un solo archivo contiene todo
4. **Offline** - Funcionar sin internet
5. **Cross-platform** - Cualquier navegador moderno

## Decisión
Adoptar **arquitectura inline/autocontenida** donde cada aplicación HTML contiene:
- Todo el CSS inline (`<style>`)
- Todo el JavaScript inline (`<script>`)
- Todas las dependencias inline (base64 o WASM)
- Recursos de UI inline (SVGs)

### Estructura de Archivo

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>ECE-DES - Expediente Clínico</title>

  <!-- CSS Tokens v2.0 - Inline -->
  <style>
    :root {
      --color-rojo: #C41E3A;
      --color-amarillo: #D4940A;
      /* ... más tokens ... */
    }
    /* ... ~5KB de CSS ... */
  </style>
</head>
<body>
  <!-- Markup -->
  <div id="app">...</div>

  <!-- sql.js WASM - Inline (~1.2 MB) -->
  <script>
    var Module=typeof Module!=="undefined"?Module:{};var moduleOverrides={};
    /* ... WASM binary como base64 ... */
  </script>

  <!-- SheetJS XLSX - Inline (~400 KB) -->
  <script>
    /* ... XLSX library ... */
  </script>

  <!-- Aplicación - Inline (~50 KB) -->
  <script>
    class App {
      constructor() { /* ... */ }
      /* ... lógica de aplicación ... */
    }
  </script>
</body>
</html>
```

## Justificación

### Ventajas de la Arquitectura Inline

#### 1. Portabilidad Absoluta

```
Un archivo = Todo lo necesario

dist/
├── ECE-DES.html          ← 1.8 MB (todo incluido)
├── ECE-DES-Dashboard.html  ← 924 KB (todo incluido)
└── ECE-DES-Tarjetas.html   ← 13 KB (todo incluido)
```

**Escenarios de uso:**
- Copiar a USB → Funciona en otra computadora
- Enviar por email → El destinatario solo abre el archivo
- Guardar en escritorio → Funciona inmediatamente
- Compartir por Bluetooth/airdrop → Sin dependencias

#### 2. Zero Setup

**Usuario final:**
```
1. Recibir archivo HTML
2. Doble clic
3. Aplicación funcionando
```

**No se necesita:**
- npm install
- servidor web
- configuración
- descargas adicionales
- cuentas o logins

#### 3. Offline First

**Dependencias externas = 0**

```javascript
// ❌ NO hacemos esto:
<script src="https://cdn.jsdelivr.net/npm/sql.js@1.6.2/dist/sql-wasm.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet">

// ✅ Sí hacemos esto:
<script>/* sql.js inline */</script>
<style>/* fonts inline */</style>
```

#### 4. Versioning Explícito

```
ECE-DES-v1.1.0-20260304.html
```

- El archivo ES la versión
- No hay actualizaciones silenciosas
- Control total sobre cambios
- Rollback trivial (usar archivo anterior)

#### 5. Seguridad

- No hay request HTTP (sin ataque MITM posible)
- No hay telemetría
- No hay tracking
- Todo es local

### Trade-offs Aceptados

#### Con: Tamaño de Archivo

| Archivo | Tamaño | Contenido |
|---------|--------|-----------|
| ECE-DES.html | 1.8 MB | WASM + JS + CSS + Markup |
| Dashboard.html | 924 KB | JS + CSS + Gráficos |
| Tarjetas.html | 13 KB | JS mínimo + CSS |

**Impacto:** Menor que el beneficio de portabilidad
**Mitigación:** Compresión no necesita (1.8 MB es trivial hoy)

#### Con: Tiempo de Carga Inicial

- ECE-DES.html: ~3-5 segundos en carga inicial
- Dashboard.html: ~1-2 segundos

**Impacto:** Una vez por sesión
**Mitigación:** Service Worker para caché (futuro v3.0)

#### Con: Desarrollo más complejo

- Build step requerido
- No es "editable directamente"

**Impacto:** Solo afecta desarrolladores
**Mitigación:** `tools/build.js` automatiza el proceso

## Implementación

### Proceso de Build

```javascript
// tools/build.js
const fs = require('fs');
const path = require('path');

function buildInlineHTML(sourceDir, outputFile) {
  // 1. Leer template
  const template = fs.readFileSync('src/template.html', 'utf8');

  // 2. Leer CSS
  const css = fs.readFileSync('src/shared/styles.css', 'utf8');

  // 3. Leer dependencias
  const sqljs = fs.readFileSync('node_modules/sql.js/dist/sql-wasm.js', 'utf8');
  const xlsx = fs.readFileSync('node_modules/xlsx/dist/xlsx.full.min.js', 'utf8');

  // 4. Leer aplicación
  const app = fs.readFileSync(`${sourceDir}/app.js`, 'utf8');

  // 5. Inyectar todo en template
  const html = template
    .replace('<!-- CSS -->', `<style>${css}</style>`)
    .replace('<!-- DEPS -->', `<script>${sqljs}\n${xlsx}</script>`)
    .replace('<!-- APP -->', `<script>${app}</script>`);

  // 6. Escribir HTML autocontenido
  fs.writeFileSync(outputFile, html);
}
```

### Estructura de Desarrollo vs Producción

```
 Desarrollo (src/)              Producción (dist/)
├── ece-des/                   ├── ECE-DES.html (1.8 MB)
│   ├── app.js                ├── ECE-DES-Dashboard.html
│   ├── db.js                 ├── ECE-DES-Tarjetas.html
│   └── ui.js                 └── (otros HTMLs)
├── dashboard/
│   ├── app.js
│   └── charts.js
├── shared/
│   ├── styles.css
│   └── utils.js
└── template.html
```

## Consecuencias

### Positivas

1. **Despliegue instantáneo**
   - No hay servers
   - No hay CI/CD para producción
   - Copiar archivo = desplegar

2. **Versionado simple**
   - Un archivo = una versión
   - No hay dependency hell
   - No hay breaking changes por librerías

3. **Independencia**
   - No depende de GitHub, npm, CDNs
   - Funciona para siempre (aunque internet desaparezca)
   - No hay EOL por dependencias externas

4. **Auditoría**
   - Todo el código es visible
   - No hay código minificado/obfuscado
   - Fácil de revisar para seguridad

### Negativas

1. **Tamaño de archivo**
   - 1.8 MB por archivo principal
   - Duplicación de código entre archivos

2. **Actualizaciones**
   - No hay actualizaciones automáticas
   - Requiere distribución de nuevos archivos

3. **Desarrollo**
   - Build step obligatorio
   - No es "live edit" en producción

## Alternativas Consideradas

### SPA con Bundle (React/Vue + Webpack)

**Pros:**
- Mejor DX (hot reload)
- Code splitting
- Tree shaking

**Contras:**
- Requiere build + deploy
- No es un solo archivo
- Dependencia de node_modules
- Más complejo para usuario final

**Veredicto:** Rechazado - Violante requerimiento de portabilidad

### Multi-file con Relative Paths

```
dist/
├── index.html
├── js/
│   ├── app.js
│   ├── db.js
│   └── vendor/
│       ├── sql.js
│       └── xlsx.js
└── css/
    └── styles.css
```

**Pros:**
- Código no duplicado
- Caché de browser

**Contras:**
- 5+ archivos por aplicación
- Usuario debe copiar carpeta completa
- Mayor probabilidad de error

**Verdito:** Rechazado - No es suficientemente portable

### PWA (Progressive Web App)

**Pros:**
- Instalable
- Offline con service workers
- Actualizaciones automáticas

**Contras:**
- Requiere HTTPS (o localhost)
- Más complejo
- Service workers pueden fallar

**Veredicto:** Considerado para v3.0, pero no para v2.0

## Recomendaciones para v3.0

### Híbrido Inline + PWA

```
Opción 1: Inline (actual)     Opción 2: PWA (futuro)
├── Single file HTML          ├── index.html
├── 100% portable             ├── service-worker.js
├── Zero setup                ├── sw.js (assets)
└── USB ready                 └── Instalable
```

**Strategy:**
1. Mantener inline para v2.0
2. Añadir opción PWA en v3.0
3. Usuario elige: portable vs instalable

### Optimizaciones

1. **Shared dependencies via Blob URL**
   ```javascript
   const sharedCode = new Blob([/* common code */], {type: 'application/javascript'});
   const sharedURL = URL.createObjectURL(sharedCode);
   // Import en otros archivos
   ```

2. **Compression**
   - gzip inline assets
   - Descomprimir al inicio

3. **Web Workers para código común**
   - Código shared en worker
   - Comunicación via postMessage

## Referencias

- [HTML5 Single File Components](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)
- [WebAssembly Inline](https://webassembly.org/)
- [Data URIs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs)

---

**Propuesto por:** Arquitectura original v1.0
**Mantenido por:** Agente DOCUMENTADOR
**Aprobado por:** CONTROLADOR (ADRC 2.0)
**Fecha:** 2026-03-04
**Versión:** 2.0
