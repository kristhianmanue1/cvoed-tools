# Quick Start - CVOED-Tools

**Versión:** 1.1.0
**Tiempo de lectura:** 2 minutos

---

## Para Usuarios Hospitalarios (En 2 Minutos)

### Paso 1: Abrir el Sistema

**Opción A: Doble Clic (Más Fácil)**
```
1. Abrir carpeta dist/
2. Doble clic en ECE-DES.html
3. ¡Listo! Funciona sin internet
```

**Opción B: Desde el Navegador**
```
1. Abrir Chrome/Firefox/Edge/Safari
2. Arrastrar ECE-DES.html a la ventana
3. ¡Listo!
```

### Paso 2: Iniciar Sesión

Cuando se abra la aplicación:
1. **Hospital:** Escribe el nombre de tu hospital (ej: "Hospital General")
2. **Tu nombre:** Escribe tu nombre completo (ej: "Dr. Martínez")
3. **PIN:** Crea un PIN de 4 dígitos (solo para registro local)

Click en **"INICIAR SESIÓN"**

### Paso 3: Registrar Pacientes

1. Click en **"+ NUEVO PACIENTE"**
2. Ingresa el nombre (o déjalo vacío para "NN" - No Identificado)
3. Click en el botón de **TRIAGE**:
   - 🔴 **ROJO (R)** - Crítico (atención inmediata)
   - 🟡 **AMARILLO (A)** - Urgente (atención en minutos)
   - 🟢 **VERDE (V)** - Leve (puede esperar)
   - ⚫ **NEGRO (N)** - Sin vida

### Paso 4: Ver Detalles del Paciente

1. En la lista de pacientes, click en **"VER DETALLE"**
2. Ver línea de tiempo clínica
3. Agregar notas, medicación, cambios de triage
4. Imprimir brazalete del paciente

### Paso 5: Exportar al Finalizar

1. Click en **"Exportar Excel"** → Descarga archivo .xlsx
2. Click en **"Backup DB"** → Descarga copia de seguridad SQLite

---

## Para Desarrolladores (En 5 Minutos)

### Paso 1: Entender la Estructura

```
cvoed-tools/
├── dist/              # PRODUCCIÓN (HTML autocontenidos)
│   └── ECE-DES.html   # Doble clic para abrir
├── src/               # DESARROLLO (Código modular)
│   ├── ece-des/       # Módulo principal
│   ├── dashboard/     # Módulo dashboard
│   ├── tarjetas/      # Módulo de tarjetas
│   └── shared/        # Código compartido
└── tools/
    └── build.js       # Genera HTMLs portátiles
```

### Paso 2: Editar Código

```bash
# 1. Editar archivos en src/
cd src/ece-des/js/
# Editar app.js

# O editar HTML
cd src/ece-des/
# Editar index.html
```

### Paso 3: Construir

```bash
# Método 1: Usar script (recomendado)
./build.sh

# Método 2: Manualmente
cd tools
node build.js
```

Esto generará los archivos HTML portátiles en `dist/`

### Paso 3.1: Entender el Build System

El script `build.sh` hace lo siguiente:
1. Ejecuta `node tools/build.js`
2. Combina código modular en HTML autocontenidos
3. Optimiza para portabilidad (offline, sin dependencias)
4. Genera todos los HTML de producción

**Importante:** Los archivos en `src/` son para desarrollo, los archivos en `dist/` son para producción.

### Paso 4: Probar

```bash
# Abrir en navegador
open dist/ECE-DES.html

# O verificar portabilidad
./verify-portability.sh
```

### Paso 5: Si Funciona, Commit

```bash
git add .
git commit -m "Descripción del cambio"
```

---

## Referencias Rápidas

### Archivos Principales

| Archivo | Qué es | Para qué sirve |
|---------|--------|----------------|
| `ECE-DES.html` | Sistema principal | Registro de pacientes en emergencias |
| `ECE-DES-Dashboard.html` | Tablero de control | Reportes y métricas directivas |
| `ECE-DES-Tarjetas.html` | Motor de impresión | Imprimir tarjetas START |
| `generador_tarjetas.html` | Generador SCI-H | Crear chalecos y funciones de comando |

### Sistema de Triage START

| Color | Significado | Tiempo de Atención |
|-------|-------------|-------------------|
| 🔴 ROJO | Crítico | Inmediata (segundos) |
| 🟡 AMARILLO | Urgente | Minutos (hasta 1 hora) |
| 🟢 VERDE | Leve | Puede esperar (horas) |
| ⚫ NEGRO | Sin vida | No requiere intervención |

### Comandos Útiles

```bash
# Construir todo (recomendado)
./build.sh

# Construir manualmente
cd tools && node build.js

# Probar sistema
open dist/ECE-DES.html

# Ver tamaño de archivos
ls -lh dist/

# Verificar estado del build
ls -la dist/*.html | wc -l  # Debe mostrar 7 archivos
```

---

## Troubleshooting Rápido

### El archivo HTML no abre

**Solución:**
- Usar un navegador moderno (Chrome 90+, Firefox 88+, Safari 15+, Edge 90+)
- Verificar que el archivo tenga extensión `.html`
- Intentar arrastrar el archivo al navegador en lugar de doble clic

### Los datos no se guardan

**Solución:**
- Verificar que el navegador permita IndexedDB
- No usar modo incógnito (los datos se borran al cerrar)
- Asegurarse de no estar en un navegador con restricciones de seguridad

### El sistema está lento

**Solución:**
- Cerrar otras pestañas del navegador
- Verificar que no haya >100 pacientes (límite recomendado)
- Usar Dashboard.html en lugar de ECE-DES.html para reportes

### Error al construir

**Solución:**
```bash
# Verificar que Node.js esté instalado
node --version

# Reconstruir desde cero
rm -rf dist/*
./build.sh

# Si falla, verificar rutas en tools/build.js
# O construir manualmente:
cd tools && node build.js
```

---

## ¿Necesitas Más Ayuda?

### Para Usuarios Hospitalarios
- Contactar a CPES (Coordinación de Proyectos Especiales en Salud)
- Canales oficiales del IMSS

### Para Desarrolladores
- **Documentación completa:** Ver [Índice de Documentación](docs/INDEX.md)
- **Guía de desarrollo:** [docs/guides/DEVELOPMENT.md](guides/DEVELOPMENT.md)
- **Estado del proyecto:** [docs/reports/PROYECTO_COMPLETO.md](reports/PROYECTO_COMPLETO.md)

---

## Características Clave

- ✅ **100% OFFLINE** - No requiere internet
- ✅ **PORTÁTIL** - Cabe en memoria USB
- ✅ **AUTOCONTENIDO** - Todo en un solo archivo
- ✅ **ZERO DEPENDENCIAS** - No hay descargas externas
- ✅ **FÁCIL DE USAR** - Doble clic para abrir

---

**¿Listo?** Abre `dist/ECE-DES.html` y comienza a registrar pacientes.

---

*Última actualización: 2026-03-03*
*Versión 1.1.0*
