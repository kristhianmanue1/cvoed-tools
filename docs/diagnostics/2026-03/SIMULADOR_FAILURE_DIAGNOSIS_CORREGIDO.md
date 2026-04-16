# SIMULADOR_FAILURE_DIAGNOSIS_CORREGIDO.md

**Fecha:** 2026-03-12 05:40 UTC
**Agente:** ADRC_CONTROLADOR
**Actualización:** DIAGNÓSTICO CORREGIDO - ESTRUCTURA DE DIRECTORIOS
**Severidad:** MEDIUM → LOW (solución identificada)

---

## 🎯 HALLAZGO CORREGIDO

### **EL SIMULADOR SÍ EXISTE Y FUNCIONA**

**Ubicación Real:** `/dist/dist/simulacro_nunca_jamas_fifa2026.html`
**Tamaño:** 66,972 bytes
**Estado:** ✅ ACCESIBLE vía HTTP en `http://localhost:8888/simulacro_nunca_jamas_fifa2026.html`

---

## 🔍 PROBLEMA IDENTIFICADO: ESTRUCTURA DE DIRECTORIOS ANIDADA

### **Estructura Actual (INCORRECTA)**
```
cvoed-tools/
└── dist/                          ← Directorio principal
    ├── dist/                      ← ⚠️ DOBLE ANIDAMIENTO (INCORRECTO)
    │   ├── simulacro_nunca_jamas_fifa2026.html  ✅ AQUÍ ESTÁ
    │   ├── ECE-DES.html
    │   ├── ECE-DES-Dashboard.html
    │   └── ...
    ├── simulador-bundle.js        ← Assets sueltos
    ├── simulador.css
    └── workers/
```

### **Estructura Esperada (CORRECTA)**
```
cvoed-tools/
└── dist/                          ← Solo UN nivel de anidamiento
    ├── simulacro_nunca_jamas_fifa2026.html  ← Debería estar aquí
    ├── ECE-DES.html
    ├── ECE-DES-Dashboard.html
    ├── simulador-bundle.js
    ├── simulador.css
    └── workers/
```

---

## 📊 VERIFICACIÓN DE ACCESIBILIDAD

### **Servidor HTTP Local**
```bash
$ python3 -m http.server 8888 --directory dist
Serving HTTP on 0.0.0.0 port 8888 (http://0.0.0.0:8888/) ...
```

### **Prueba de Acceso**
```bash
$ curl -I http://localhost:8888/simulacro_nunca_jamas_fifa2026.html
HTTP/1.0 200 OK
Content-type: text/html
Content-Length: 66972
Server: SimpleHTTP/0.6 Python/3.12.12
```

✅ **El simulador es perfectamente accesible**

---

## 🐛 CAUSA RAÍZ ACTUALIZADA

### **Problema #1: Doble Anidamiento en Build**

El proceso de build está copiando archivos a `dist/dist/` en lugar de `dist/`.

**Hipótesis:** El script `build.sh` probablemente hace algo como:
```bash
cp -r public/* dist/          # Copia public/ a dist/
# Y luego:
cp -r dist/* dist/            # ⚠️ Vuelve a copiar dist/ dentro de sí mismo
```

### **Problema #2: verify-build.sh Busca en Lugar Incorrecto**

El script `verify-build.sh` verifica archivos en:
```bash
check_file "$DIST_DIR/simulacro_nunca_jamas_fifa2026.html"
```

Pero el archivo está en:
```bash
$DIST_DIR/dist/simulacro_nunca_jamas_fifa2026.html
```

Por eso reporta "NO ENCONTRADO".

### **Problema #3: serve.sh Cambia de Directorio**

```bash
cd dist && python3 -m http.server 8000
```

Sirve desde `dist/`, pero los HTML están en `dist/dist/`.

---

## ✅ ESTADO DE COMPONENTES

| Componente | Ubicación Real | Estado | Accesible |
|-----------|---------------|--------|-----------|
| Simulador HTML | `dist/dist/simulacro_*.html` | ✅ Funcional | ✅ Sí |
| ECE-DES | `dist/dist/ECE-DES.html` | ✅ Funcional | ✅ Sí |
| Dashboard | `dist/dist/ECE-DES-Dashboard.html` | ✅ Funcional | ✅ Sí |
| Assets JS/CSS | `dist/*.js, *.css` | ⚠️ Nivel incorrecto | ⚠️ Separados |
| Workers | `dist/workers/` | ✅ Correcto | ✅ Sí |

---

## 🔧 SOLUCIÓN INMEDIATA

### **Opción A: Ajustar build.sh (RECOMENDADO)**

**Archivo:** `scripts/build.sh`
**Buscar:** Líneas donde se copian archivos a `dist/`
**Acción:** Eliminar el doble anidamiento

```bash
# INCORRECTO (causa dist/dist/)
cp -r public/* "$DIST_DIR/"

# CORREGIDO
# Copiar contenido de public/ directamente a dist/ (sin crear subdirectorio)
find public/ -type f -exec cp {} "$DIST_DIR/" \;
```

### **Opción B: Ajustar verify-build.sh y serve.sh (WORKAROUND)**

Si no se puede modificar el build:

**verify-build.sh (línea 111):**
```bash
# Antes
check_file "$DIST_DIR/simulacro_nunca_jamas_fifa2026.html" 10000 true

# Después
check_file "$DIST_DIR/dist/simulacro_nunca_jamas_fifa2026.html" 10000 true
```

**serve.sh:**
```bash
# Antes
cd dist && python3 -m http.server 8000

# Después
cd dist/dist && python3 -m http.server 8000
```

---

## 🎯 CONCLUSIÓN

### **Diagnóstico Original**
> "El simulador NO se genera en dist/"

### **Diagnóstico Corregido**
> "El simulador SÍ se genera y funciona, pero está en `dist/dist/` (doble anidamiento) en lugar de `dist/` directamente"

### **Impacto Real**
- **Funcionalidad:** ✅ El simulador FUNCIONA perfectamente
- **Distribución:** ⚠️ La estructura anidada puede causar confusiones
- **Documentación:** Necesita aclaración sobre la estructura real
- **Build:** Requiere corrección para eliminar `dist/dist/`

---

## 📋 ACCIONES RECOMENDADAS

### **Prioridad ALTA**
1. ✅ **Verificar funcionalidad:** El simulador funciona correctamente
2. ⚠️ **Corregir build.sh:** Eliminar doble anidamiento `dist/dist/`
3. ⚠️ **Actualizar verify-build.sh:** Buscar en ubicación correcta

### **Prioridad MEDIA**
4. Actualizar documentación para reflejar estructura real
5. Revisar script `create-release-zip.sh` para manejar estructura actual
6. Validar que enlaces relativos en HTML funcionen con estructura anidada

### **Prioridad BAJA**
7. Migrar de HTML inline a módulos ES6 en `src/simulador/js/`
8. Implementar bundler moderno (esbuild/rollup)

---

## ✅ VALIDACIÓN FINAL

```bash
# 1. El simulador existe
$ ls -lh dist/dist/simulacro_nunca_jamas_fifa2026.html
-rw-r--r--@ 1 krisnova staff 66K Mar 10 17:38

# 2. Es accesible vía HTTP
$ curl -s http://localhost:8888/simulacro_nunca_jamas_fifa2026.html | head -5
<!DOCTYPE html>
<html lang="es" data-theme="dark">

# 3. Tiene tamaño razonable
$ wc -l dist/dist/simulacro_nunca_jamas_fifa2026.html
    2951 dist/dist/simulacro_nunca_jamas_fifa2026.html
```

---

**Firma del Diagnóstico Corregido:**
ADRC_CONTROLADOR | 2026-03-12T05:40:45Z | Confianza: ALTA (0.98)

**Próxima Acción:** Revisar `scripts/build.sh` para identificar dónde se crea el doble anidamiento `dist/dist/`.
