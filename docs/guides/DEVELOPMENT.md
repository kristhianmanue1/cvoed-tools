# Desarrollo CVOED-Tools

## Estructura del proyecto

```
cvoed-tools/
├── src/                  # Código fuente modular
│   ├── shared/          # Recursos compartidos
│   │   ├── css/         # CSS compartidos
│   │   ├── js/          # JavaScript compartidos
│   │   └── fonts/       # Fuentes compartidas
│   ├── dashboard/       # Módulo Dashboard
│   │   ├── css/
│   │   └── js/
│   ├── ece-des/         # Módulo ECE-DES principal
│   │   ├── css/
│   │   └── js/
│   └── tarjetas/        # Módulo de Tarjetas
│       ├── css/
│       └── js/
├── tools/              # Herramientas de construcción
│   └── build.js        # Script de build principal
├── dist/               # Archivos generados (portables)
└── scripts/            # Scripts adicionales
```

## Flujo de desarrollo

### 1. Modificar código fuente

Edita los archivos en `src/`:

- **CSS**: Añade nuevos estilos en los archivos CSS del módulo correspondiente
- **JavaScript**: Desarrolla lógica en los archivos JS
- **HTML**: Modifica los archivos `index.html` de cada módulo

#### Referencia a recursos compartidos

Para usar recursos compartidos, utiliza la ruta especial `/*shared*/`:

```html
<!-- CSS compartido -->
<link rel="stylesheet" href="/*shared*/css/estilos-comunes.css">

<!-- JavaScript compartido -->
<script src="/*shared*/js/utils.js"></script>
```

### 2. Construir el proyecto

Usa el script de build para generar los archivos portables:

```bash
# Desde la raíz del proyecto
./build.sh
```

O ejecuta directamente:
```bash
cd tools
node build.js
```

### 3. Verificar portabilidad

Después del build, verifica que todo esté correctamente embebido:

```bash
./verify-portability.sh
```

El script verificará:
- ✅ No hay ES modules (import/export)
- ✅ WASM inline (Base64)
- ✅ CSS inline
- ✅ Todos los recursos incluidos

## Características del build system

### Automatización del build

El script `build.js` hace lo siguiente:

1. **In-lined CSS**: Convierte todas las etiquetas `<link>` en `<style>` con el contenido CSS
2. **In-lined JS**: Convierte todas las etiquetas `<script src>` en `<script>` con el contenido JS
3. **WASM inline**: Convierte el archivo WASM a Base64 y lo embebe directamente
4. **Manejo de rutas**: Soporta rutas relativas y el prefijo `/*shared*/` para recursos compartidos

### Recursos compartidos

El sistema permite compartir recursos entre módulos:

- Los archivos en `src/shared/` son accesibles desde cualquier módulo
- Usa `/*shared*/` en las rutas para indicar que es un recurso compartido
- El build buscará primero en `shared/` y luego en el módulo local si no se encuentra

## Testing manual

### Pasos para testing:

1. **Abrir en navegador**: Abre los archivos HTML en `dist/` directamente en el navegador
2. **Verificar funcionalidad**:
   - Todos los botones deben funcionar
   - Las interacciones deben ser responsivas
   - No debe haber errores en la consola del navegador
3. **Verificar recursos**:
   - Abre el inspector de elementos
   - Verifica que no haya peticiones externas fallidas
   - Confirma que CSS y JS están inline
4. **Cross-browser**: Prueba en diferentes navegadores (Chrome, Firefox, Safari)

### Common issues

- **Recursos no encontrados**: Verifica que las rutas en los HTML apunten a archivos existentes
- **CSS no aplicado**: Revisa que no haya conflictos de estilos
- **JS no ejecutado**: Verifica que no haya errores de sintaxis en los archivos JS

## Consejos de desarrollo

### Organización del código

- Mantén los módulos independientes cuando sea posible
- Usa recursos compartidos solo para código que se repite
- Documenta las dependencias en los archivos `index.html`

### Optimización

- Minimiza el CSS y JS para producción
- Considera el peso total de los archivos
- Usa comentarios para mantener el código legible

### Versionado

- Mantén un registro de cambios en cada build
- Usa nombres de archivo descriptivos
- Considera añadir un hash en el nombre para versiones caching

## Herramientas adicionales

### verify-portability.sh

Script para verificar que los archivos generados son completamente portables:

- Lista todos los archivos en dist/
- Verifica ausencia de ES modules
- Confirma WASM inline
- Verifica CSS inline
- Muestra tamaños de archivo

### build.sh

Script conveniente para construir todo el proyecto:

```bash
./build.sh
```

Ejecuta el build y muestra los archivos resultantes.