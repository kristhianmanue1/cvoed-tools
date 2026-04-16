# PLAN DE LIMPIEZA DE DIRECTORIO BASE

**Fecha:** 2026-03-03
**Objetivo:** Organizar archivos según estándares y mejores prácticas

---

## 📊 ANÁLISIS ACTUAL

### Archivos en Raíz (Desordenados)

**Archivos ESENCIALES (mantener en raíz):**
- ✅ README.md
- ✅ LICENSE
- ✅ CHANGELOG.md
- ✅ CONTRIBUTING.md
- ✅ .gitignore

**Scripts (mantener en raíz):**
- ✅ build.sh
- ✅ verify-portability.sh

**Documentación (MOVER a docs/):**
- ❌ AGENTE_SPEC_TARJETAS_ACCION_CPES_IMSS_v2.md
- ❌ catalogo_cvoed.md
- ❌ project_state.md
- ❌ tareas_tecnicas.md

**Archivos dudosos (REVISAR):**
- ❓ planExpediente.mc (¿Qué es?)
- ❓ Archivo.zip (¿Backup?)

---

## 🎯 ESTÁNDARES Y MEJORES PRÁCTICAS

### Raíz del Proyecto (Root)

**Solo debe contener:**
1. **README.md** - Punto de entrada del proyecto
2. **LICENSE** - Licencia del proyecto
3. **CHANGELOG.md** - Registro de cambios
4. **CONTRIBUTING.md** - Guía para contribuidores
5. **.gitignore** - Archivos ignorados por git
6. **package.json** (SI aplica, pero este es portable, NO)
7. **Scripts ejecutivos** - build.sh, verify-portability.sh

**NO debe contener:**
- ❌ Documentación técnica (va en docs/)
- ❌ Especificaciones (van en docs/)
- ❌ Archivos de catálogo (van en docs/)
- ❌ Archivos comprimidos (van en backups/ o se eliminan)
- ❌ Archivos de proyectos extra (eliminar o archivar)

---

## 📋 PLAN DE ORGANIZACIÓN

### Acción 1: Mover Documentación

```bash
# Mover especificaciones técnicas
mv AGENTE_SPEC_TARJETAS_ACCION_CPES_IMSS_v2.md docs/

# Mover documentación de proyecto
mv catalogo_cvoed.md docs/
mv project_state.md docs/
mv tareas_tecnicas.md docs/

# Mover plan de expediente
mv planExpediente.mc docs/  # O eliminar si no es necesario
```

### Acción 2: Eliminar Archivos Innecesarios

```bash
# Eliminar archivo ZIP (backup antiguo)
rm Archivo.zip

# O mover a backups/
# mkdir -p backups
# mv Archivo.zip backups/
```

### Acción 3: Crear Estructura en docs/

```
docs/
├── technical/           # 🆕 Especificaciones técnicas
│   ├── AGENTE_SPEC_*.md
│   ├── tareas_tecnicas.md
│   └── planExpediente.mc
├── project/             # 🆕 Documentación del proyecto
│   ├── catalogo_cvoed.md
│   └── project_state.md
├── architecture/        # Ya existe
├── pdf/                 # Ya existe
└── *.md                 # Documentos generales
```

---

## 📁 ESTRUCTURA PROPUESTA FINAL

### Raíz (Limpia)

```
cvoed-tools/
├── README.md              # ✅ Punto de entrada
├── LICENSE                # ✅ Apache 2.0
├── CHANGELOG.md           # ✅ Historial de cambios
├── CONTRIBUTING.md        # ✅ Guía de contribución
├── .gitignore             # ✅ Git ignore
│
├── build.sh               # ✅ Script build
├── verify-portability.sh  # ✅ Verificación
│
├── dist/                  # Producción
├── src/                   # Desarrollo
├── tools/                 # Herramientas
└── docs/                  # TODA la documentación
```

### docs/ (Organizada)

```
docs/
├── technical/             # Especificaciones técnicas
│   ├── AGENTE_SPEC_TARJETAS_ACCION_CPES_IMSS_v2.md
│   ├── tareas_tecnicas.md
│   └── planExpediente.mc
│
├── project/               # Documentación del proyecto
│   ├── catalogo_cvoed.md
│   └── project_state.md
│
├── architecture/          # Análisis y diseño
│   ├── ARQUITECTURA_ANALISIS_REAL.md
│   ├── REFACTORING_PLAN_V2.md
│   ├── TECH_STACK_DECISION_V2.md
│   └── FILE_REORGANIZATION_PLAN.md
│
├── guides/                # Guías
│   ├── MIGRATION_GUIDE_V2.md
│   └── DEVELOPMENT.md
│
├── reports/               # Reportes
│   ├── TESTING_REPORT.md
│   ├── REORGANIZACION_COMPLETADA.md
│   └── ESTADO_ACTUAL.md
│
├── pdf/                   # Guías IMSS oficiales
│   ├── Guía SMV-H.pdf
│   ├── SCI-Hospitalario.pdf
│   └── ...
│
└── *.md                   # Documentos generales
```

---

## ⚡ EJECUCIÓN

El agente va a:
1. Crear subdirectorios en docs/
2. Mover archivos según clasificación
3. Eliminar archivos innecesarios
4. Verificar estructura final
5. Actualizar README.md si es necesario

---

**Beneficios:**
- ✅ Raíz limpia (solo 7 archivos esenciales)
- ✅ Documentación organizada por categorías
- ✅ Fácil encontrar archivos
- ✅ Profesional y maintainable

---

*Plan de Limpieza v1.0*
*ADRC CONTROLADOR*
*2026-03-03*
