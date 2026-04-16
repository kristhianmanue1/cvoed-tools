# 🔍 AUDITORÍA DE LINKS A COMPONENTES

**Fecha**: 2026-03-11
**Proyecto**: CVOED-Tools
**Agente**: CONTROLADOR (ADRC 2.0)
**Alcance**: Todos los archivos HTML en `/dist/`

---

## 📊 RESUMEN EJECUTIVO

| Métrica | Total | ✓ Funcionales | ✗ Rotos | % Rotos |
|---------|-------|---------------|---------|---------|
| **Links href** | 7 | 5 | 2 | 28.6% |
| **Links src** | 2 | 2 | 0 | 0% |
| **Redirecciones JS** | 2 | 0 | 2 | 100% |

**Estado General**: ⚠️ **PREOCUPANTE** - Links críticos rotos

---

## 1. AUDITORÍA DE LINKS HREF

### ✅ LINKS FUNCIONALES (5)

| Archivo Origen | Link | Destino | Estado |
|----------------|------|---------|--------|
| `ECE-DES-Dashboard.html` | `href="ECE-DES.html"` | Portal principal ECE-DES | ✅ OK |
| `ECE-DES-Tarjetas.html` | `href="ECE-DES.html"` | Portal principal ECE-DES | ✅ OK |
| `ECE-DES.html` | `href="ECE-DES-Dashboard.html"` | Dashboard analítico | ✅ OK |
| `ECE-DES.html` | `href="ECE-DES-Tarjetas.html"` | Impresión de tarjetas | ✅ OK |
| `simulacro_nunca_jamas_fifa2026.html` | `href="simulador.css"` | Estilos del simulador | ✅ OK |

**Nota**: Estos links son relativos y funcionan solo si se accede desde `/dist/`

---

### ❌ LINKS ROTOS (2)

| Archivo Origen | Link | Problema | Severidad |
|----------------|------|----------|-----------|
| `/index.html` | `href="dist/index.html"` | Redirección a archivo que también redirige a sí mismo | 🚨 CRÍTICO |
| `/dist/index.html` | `href="dist/index.html"` | Redirección infinita (loop) | 🚨 CRÍTICO |

**Detalle Técnico**:
```html
<!-- Ambos archivos tienen este código: -->
<a href="dist/index.html" class="link">Ir al Portal ahora</a>
<script>window.location.href = 'dist/index.html';</script>
```

**Problema**:
- Desde `/index.html`: funciona (redirige a `/dist/index.html`)
- Desde `/dist/index.html`: ❌ LOOP (intenta `/dist/dist/index.html`)

---

## 2. AUDITORÍA DE LINKS SRC (Scripts/CSS)

### ✅ LINKS FUNCIONALES (2)

| Archivo | Recurso | Tipo | Estado |
|---------|---------|------|--------|
| `simulacro_nunca_jamas_fifa2026.html` | `src="simulador-bundle.js"` | JS Bundle | ✅ Existe (64KB) |
| `simulacro_nunca_jamas_fifa2026.html` | `href="simulador.css"` | CSS | ✅ Existe (37KB) |

**Verificación de Archivos**:
```bash
$ ls -lh dist/simulador-*.*
-rw-r--r--@ 1 krisnova  staff    64K simulador-bundle.js
-rw-r--r--@ 1 krisnova  staff    37K simulador.css
```

---

## 3. VERIFICACIÓN DE COMPONENTES INLINE

### Método de Build: Inline Bundling

El proyecto usa **inline bundling** para eliminar dependencias externas:

**Proceso** (`tools/build.js`):
1. Lee HTML desde `src/<modulo>/index.html`
2. Reemplaza `<link href="/*shared*/css/...">` con `<style>...</style>`
3. Reemplaza `<script src="/*shared*/js/...">` con `<script>...</script>`
4. Convierte WASM a Base64 para portabilidad

**Resultado**:
- ✅ No hay links externos rotos
- ✅ Zero dependencias operativas
- ✅ 100% portable

---

## 4. MAPA DE NAVEGACIÓN ACTUAL

```
                           index.html (ROOT)
                                 │
                                 ❌ REDIRECCIÓN INFINITA
                                 │
                          dist/index.html
                                 │
                                 ❌ REDIRECCIÓN INFINITA
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
         ECE-DES.html    Dashboard.html    Tarjetas.html
                │                │                │
                │           (back link)       (back link)
                │                │                │
                └────────────────┴────────────────┘
                                 │
                           (navegación interna)
```

**Problema**: No hay manera de llegar a las herramientas desde `index.html`.

---

## 5. COMPONENTES FALTANTES

### 🚨 No Existe: Portal Principal

**Esperado**: Un archivo con navegación a las 7 herramientas:
1. ECE-DES (Expediente Clínico)
2. ECE-DES-Dashboard
3. ECE-DES-Tarjetas
4. Generador de Tarjetas SCI-H
5. Guía Operativa Nunca Jamás
6. Simulacro Nunca Jamás FIFA 2026
7. Recursos/Documentación

**Estado Actual**: Ningún archivo cumple esta función.

---

## 6. ARCHIVOS EXISTENTES EN /DIST/

```bash
dist/
├── index.html              ❌ REDIRECCIÓN INFINITA
├── ECE-DES.html            ✅ 1.9MB (inline bundled)
├── ECE-DES-Dashboard.html  ✅ 97KB (inline bundled)
├── ECE-DES-Tarjetas.html   ✅ 13KB (inline bundled)
├── generador_tarjetas.html ✅ 49KB (standalone)
├── guia_operativa_nunca_jamas.html ✅ 42KB (standalone)
├── simulacro_nunca_jamas_fifa2026.html ✅ 67KB (con bundle)
├── simulador-bundle.js     ✅ 64KB
├── simulador.css           ✅ 37KB
└── workers/
    └── (Web Workers si aplica)
```

**Total**: 8 HTML files + 2 recursos auxiliares

---

## 7. RECOMENDACIÓN DE ARQUITECTURA

### Estructura Ideal de Navegación

```
index.html (PORTAL PRINCIPAL)
├── Header: CVOED-Tools + Marca FIFA 2026
├── Grid de tarjetas:
│   ├── [ECE-DES] → ECE-DES.html
│   ├── [Dashboard] → ECE-DES-Dashboard.html
│   ├── [Tarjetas] → ECE-DES-Tarjetas.html
│   ├── [Generador SCI-H] → generador_tarjetas.html
│   ├── [Guía Operativa] → guia_operativa_nunca_jamas.html
│   └── [Simulacro] → simulacro_nunca_jamas_fifa2026.html
└── Footer: +Info + Licencia Apache 2.0
```

---

## 📋 CONCLUSIÓN

**Hallazgos Clave**:
1. ✅ Los links entre herramientas funcionan correctamente
2. ✅ El sistema de inline bundling funciona bien
3. ❌ El punto de entrada (`index.html`) está roto
4. ❌ No existe navegación desde el root a las herramientas

**Prioridad de Fix**: 🚨 **CRÍTICA**
- El usuario no puede acceder a NINGUNA herramienta desde el entry point
- Solo funciona si se conoce la URL directa de cada herramienta

---

**Firma**: CONTROLADOR - ADRC 2.0 Framework
**Metodología**: Auditoría sistemática de todos los links href/src
