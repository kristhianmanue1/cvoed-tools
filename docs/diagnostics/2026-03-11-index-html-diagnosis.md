# 🔍 DIAGNÓSTICO: index.html (Redirección Infinita)

**Fecha**: 2026-03-11
**Proyecto**: CVOED-Tools
**Agente**: CONTROLADOR (ADRC 2.0)
**Prioridad**: CRÍTICA
**Estado**: CONFIRMADO

---

## 🚨 PROBLEMA RAÍZ IDENTIFICADO

### REDIRECCIÓN INFINITA DETECTADA

```
┌─────────────────────────────────────────────────────────────┐
│  /index.html (root)                                        │
│  └──► <meta http-equiv="refresh" content="0; url=dist/index.html">
│  └──► window.location.href = 'dist/index.html'
│      │
│      ▼
│  /dist/index.html
│  └──► <meta http-equiv="refresh" content="0; url=dist/index.html">
│  └──► window.location.href = 'dist/index.html'
│      │
│      └──► ¡REDIRECCIÓN A SÍ MISMO! LOOP INFINITO
│          Intenta cargar: /dist/dist/index.html (NO EXISTE)
└─────────────────────────────────────────────────────────────┘
```

### Evidencia Técnica

**Archivo 1**: `/index.html`
```html
<meta http-equiv="refresh" content="0; url=dist/index.html">
<a href="dist/index.html" class="link">Ir al Portal ahora</a>
<script>window.location.href = 'dist/index.html';</script>
```

**Archivo 2**: `/dist/index.html` (COPIA IDÉNTICA)
```html
<meta http-equiv="refresh" content="0; url=dist/index.html">
<a href="dist/index.html" class="link">Ir al Portal ahora</a>
<script>window.location.href = 'dist/index.html';</script>
```

**Resultado**:
- ✗ El navegador se queda en blanco
- ✗ Consola: "Redirection limit exceeded" o similar
- ✗ El usuario nunca ve el portal principal

---

## 🔍 ANÁLISIS DE CAUSA RAÍZ (5 Whys)

1. **¿Por qué hay redirección infinita?**
   - Porque `/dist/index.html` redirige a sí mismo (`dist/index.html`)

2. **¿Por qué `/dist/index.html` redirige a sí mismo?**
   - Porque el script de build copió `/index.html` sin modificar

3. **¿Por qué el build copia el archivo sin modificar?**
   - El script `tools/build.js` línea 114: `{ src: '../index.html', dest: 'index.html' }`

4. **¿Por qué existe `/index.html` como redireccionador?**
   - Fue diseñado para redirigir al "portal principal" en `dist/`

5. **¿Por qué no existe un portal principal real?**
   - **FALTA DE ARQUITECTURA**: El proyecto necesita un `portal.html` o `home.html` con navegación a las herramientas

---

## 📊 IMPACTO

| Nivel | Descripción |
|-------|-------------|
| **Usuario** | ❌ No puede acceder a ninguna herramienta |
| **Operativo** | ❌ Sistema completamente inoperativo desde el root |
| **Portabilidad** | ⚠️ Solo funciona si el usuario conoce URLs específicas (ej: `dist/ECE-DES.html`) |

---

## 🎯 CONCLUSIÓN

**Severidad**: **CRÍTICA** (Bloqueante completo)

**Diagnóstico**: El archivo `index.html` es un redireccionador mal configurado que causa un loop infinito. No existe un portal principal real con navegación a las herramientas.

**Recomendación Inmediata**: Crear un `index.html` real que funcione como portal de navegación a las 7 herramientas del sistema.

---

**Firma**: CONTROLADOR - ADRC 2.0 Framework
**Registros**: CMF Indexed
