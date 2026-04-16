# 🔍 ANÁLISIS DE LIMPIEZA - Solo HTML Portátiles

**Fecha:** 2026-03-11 18:00
**Proyecto:** CVOED-Tools
**Repositorio:** https://github.com/kristhianmanue1/cvoed-tools
**Objetivo:** Dejar SOLO los archivos HTML portátiles en GitHub

---

## 📊 ESTADO ACTUAL

### Archivos en Repositorio

```
Total: 226 archivos
```

### Desglose por Directorio

| Directorio | Archivos | ¿Mantener? | Acción |
|-----------|----------|------------|--------|
| **dist/** | 8 HTML | ✅ SÍ | **MANTENER** - Son los portátiles bundled |
| **docs/** | 76 | ❌ NO | Eliminar de GitHub |
| **.adrc/** | 36 | ❌ NO | Eliminar de GitHub |
| **tests/** | 33 | ❌ NO | Eliminar de GitHub |
| **src/** | 25 | ❌ NO | Eliminar de GitHub |
| **scripts/** | 6 | ❌ NO | Eliminar de GitHub |
| **config/** | 5 | ❌ NO | Eliminar de GitHub |
| **public/** | 4 HTML | ❌ NO | Duplicados de dist/ |
| **coverage/** | ~20 | ❌ NO | Eliminar de GitHub |
| **.github/** | 3 | ❌ NO | Eliminar de GitHub |
| **tools/** | 2 | ❌ NO | Eliminar de GitHub |
| **root/** | 9 MD/TXT | ❌ NO | Eliminar de GitHub |

---

## 🎯 ARCHIVOS HTML PORTÁTILES REQUERIDOS

### ✅ HTML Portátiles (dist/)

Estos son los archivos **autocontenidos** que incluyen todo el CSS y JS inline (según arquitectura "single-file HTML" del proyecto):

```
dist/ECE-DES.html              (1.9MB) - Expediente Clínico
dist/ECE-DES-Dashboard.html    (952KB) - Dashboard Analítico
dist/ECE-DES-Tarjetas.html     (13KB)  - Motor de Impresión
dist/index.html                (9.6KB) - Portal Principal
dist/generador_tarjetas.html   (48KB)  - Generador SCI-H
dist/guia_operativa_nunca_jamas.html (41KB) - Guía Operativa
dist/simulacro_nunca_jamas_fifa2026.html (65KB) - Simulador
```

**Total: 7 archivos HTML portátiles = ~3MB**

### ❌ HTML NO Portátiles (Eliminables)

```
public/ - Duplicados de dist/ (no bundled)
src/ - Código fuente (no portátil)
coverage/ - Reports de tests (no portátil)
tools/sistema-color-dual-rams-ive.html - Herramienta de desarrollo
```

---

## 📋 PLAN DE LIMPIEZA

### OPCIÓN 1: Limpieza Radical (Recomendada)

**Mantener SOLO:**
- ✅ 7 HTML portátiles en `dist/`
- ✅ README.md (actualizado)
- ✅ LICENSE
- ✅ .gitignore

**Eliminar TODO lo demás:**
- ❌ src/
- ❌ tests/
- ❌ docs/
- ❌ config/
- ❌ scripts/
- ❌ public/
- ❌ coverage/
- ❌ .adrc/
- ❌ .github/
- ❌ tools/
- ❌ package.json
- ❌ Todos los MD/TXT de root

**Resultado:**
- De 226 archivos → **11 archivos**
- De ~37MB → **~3MB** (solo HTML portátiles)

### OPCIÓN 2: Limpieza Parcial

**Mantener:**
- ✅ 7 HTML portátiles en `dist/`
- ✅ README.md
- ✅ LICENSE
- ✅ .gitignore
- ✅ docs/ (solo PDFs oficiales IMSS)

**Eliminar:**
- ❌ src/
- ❌ tests/
- ❌ config/
- ❌ scripts/
- ❌ public/
- ❌ coverage/
- ❌ .adrc/
- ❌ .github/
- ❌ tools/
- ❌ MD/TXT de documentación

**Resultado:**
- De 226 archivos → **~50 archivos**
- De ~37MB → **~35MB** (HTML + docs PDF)

---

## 🚀 ESTRATEGIA DE LIMPIEZA

### PASO 1: Crear .gitignore Actualizado

```bash
cat > .gitignore << 'EOF'
# TODO menos los HTML portátiles
*

# PERMITIR solo los HTML portátiles
!dist/*.html

# PERMITIR documentación esencial
!README.md
!LICENSE

# PERMITIR .gitignore
!.gitignore

# EXCLUIR explícitamente
src/
tests/
docs/
config/
scripts/
public/
coverage/
.adrc/
.github/
tools/
package*.json
*.md
*.txt
EOF
```

### PASO 2: Eliminar Archivos del Git

```bash
# Eliminar del índice de Git (no del disco local)
git rm -r --cached src/
git rm -r --cached tests/
git rm -r --cached docs/
git rm -r --cached config/
git rm -r --cached scripts/
git rm -r --cached public/
git rm -r --cached coverage/
git rm -r --cached .adrc/
git rm -r --cached .github/
git rm -r --cached tools/
git rm --cached package.json
git rm --cached package-lock.json
git rm --cached *.md
git rm --cached *.txt

# Mantener solo los esenciales
git add -f dist/*.html
git add -f README.md
git add -f LICENSE
git add -f .gitignore
```

### PASO 3: Commit y Push

```bash
git commit -m "refactor: keep only portable HTML files

- Remove all non-portable files (src/, tests/, docs/, etc.)
- Keep only 7 portable HTML files in dist/
- Update .gitignore to exclude everything else
- Repository now contains only distributable files

Co-authored-by: CONTROLADOR <controlador@cvoed-tools>"

git push origin main
```

---

## 📊 RESULTADO ESPERADO

### Repositorio Limpio (Opción 1)

```
cvoed-tools/
│
├── 📁 dist/                    # ✅ ÚNICO directorio
│   ├── ECE-DES.html
│   ├── ECE-DES-Dashboard.html
│   ├── ECE-DES-Tarjetas.html
│   ├── index.html
│   ├── generador_tarjetas.html
│   ├── guia_operativa_nunca_jamas.html
│   └── simulacro_nunca_jamas_fifa2026.html
│
├── 📄 README.md                # ✅ Actualizado
├── 📄 LICENSE                  # ✅ Apache 2.0
└── 📄 .gitignore               # ✅ Configurado
```

**Estadísticas:**
- Archivos: **11** (de 226)
- Tamaño: **~3MB** (de ~37MB)
- Reducción: **-95% archivos, -92% tamaño**

### Repositorio con Docs (Opción 2)

```
cvoed-tools/
│
├── 📁 dist/                    # ✅ HTML portátiles
├── 📁 docs/                    # ✅ Solo PDFs IMSS
│   ├── *.pdf (Guías oficiales)
│   └── README.md
│
├── 📄 README.md
├── 📄 LICENSE
└── 📄 .gitignore
```

**Estadísticas:**
- Archivos: **~50** (de 226)
- Tamaño: **~35MB** (de ~37MB)
- Reducción: **-78% archivos, -5% tamaño**

---

## ⚠️ PRECAUCIONES

### Antes de Eliminar

1. **Backup Local**
   ```bash
   # Hacer backup del repositorio completo localmente
   cp -r . ../cvoed-tools-backup-$(date +%Y%m%d)
   ```

2. **Verificar HTML Portátiles**
   ```bash
   # Asegurarse de que los HTML en dist/ funcionan
   open dist/index.html
   open dist/ECE-DES.html
   # etc.
   ```

3. **Documentar Fuera de GitHub**
   - Mantener src/, tests/, docs/ en tu máquina local
   - Usar otro sistema de backup (Dropbox, Google Drive, etc.)
   - GitHub SOLO para distribución de HTML portátiles

### Reversión

Si necesitas revertir:

```bash
# Ver commits anteriores
git log --oneline

# Volver a commit anterior
git checkout <commit-hash>

# O reset completo
git reflog
git reset --hard HEAD@{n}
```

---

## 🎯 RECOMENDACIÓN

**Usar OPCIÓN 1 (Limpieza Radical)** porque:

1. ✅ GitHub es para **distribución**, no para desarrollo
2. ✅ Los HTML portátiles son **autocontenidos** (no necesitan src/)
3. ✅ Reduce drásticamente el tamaño del repositorio
4. ✅ Facilita clonado y descarga
5. ✅ Sigue el principio de "single-purpose repository"

**Desarrollo local:**
- Mantener estructura completa en tu máquina
- Usar Git localmente para desarrollo
- GitHub SOLO para distribuir HTML portátiles

---

## 📋 PASOS SIGUIENTES

### Inmediato

1. ✅ Decidir qué opción prefieres (1 o 2)
2. ✅ Hacer backup local del repositorio
3. ✅ Verificar que HTML portátiles funcionan
4. ✅ Ejecutar limpieza

### Post-Limpieza

5. ✅ Actualizar README.md
6. ✅ Commit y push a GitHub
7. ✅ Verificar en GitHub que solo estén HTML
8. ✅ Documentar proceso para futuro

---

**¿Estás listo para proceder con la limpieza?**

Confirma qué opción prefieres (1 o 2) y ejecutaré el proceso.
