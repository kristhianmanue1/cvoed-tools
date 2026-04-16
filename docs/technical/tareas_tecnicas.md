# ECE-DES: Tareas Técnicas Detalladas

Este documento desglosa el Plan de Desarrollo en tareas técnicas ejecutables y especificaciones precisas para la construcción de `ECE-DES.html`.

## Análisis de Viabilidad del Plan

**Veredicto General: ALTAMENTE VIABLE.**
El uso de una arquitectura 100% estática "offline-first" ensamblada en un solo archivo con `sql.js` (SQLite WASM) y `SheetJS` resuelve de manera elegante y eficaz el problema principal: contar con un sistema libre de dependencias operativas durante una contingencia/caída de red.

**Áreas de Mejora o Riesgos Identificados:**
1. **Tamaño del Bundle y Rendimiento WASM**: Unitar todo en un `.html` resultará en un archivo de aprox. 2.5MB a 3MB. Se debe asegurar el "inlining" de JS correctamente.
2. **Ciclo de Guardado e Integridad LocalStorage**: Guardar binarios de SQLite grandes repetidamente en Base64 dentro de `localStorage` puede alcanzar el límite de cuota (~5MB) si no se restringe o limpia data vieja, y es una operación pesada para el navegador principal.
   *Mejora requerida*: Utilizar preferentemente `IndexedDB` a través de un adaptador FS temporal o manejar descargas/respaldos estructurados. LocalStorage es estricto en los límites (5MB max) lo cual para múltiples registros hospitalarios podría superarse pronto. Se sugiere abstraer la capa de persistencia mediante IndexedDB para almacenar los Uint8Arrays completos en lugar de strings asfixiantes en localStorage.
3. **Manejo de estados con Vainilla JS**: Sin un framework y usando puro ES2022 Vanilla, el anidamiento y actualización del DOM para el Census puede complicarse en un archivo único. Recomendación: Utilizar un esquema de "template literals" robusto, o un patrón observable muy simple para disparar re-Renders y aislar componentes modales.
4. **Diseño Visual**: Ya hemos migrado los estilos base a los "Tokens de Diseño v2.0" presentes en `generador_tarjetas.html`. Esto asegura total congruencia estética e integración institucional. La sintaxis del color en el documento original era desactualizada; los estilos estandarizados corrigen problemas de accesibilidad ISO.

---

## Sprint 1: Fundaciones y Registros Básicos

### Tarea 1.1: Boilerplate de Aplicación Offline y Assets
- [ ] Crea `src/index.html` con estructura HTML5 base y las etiquetas para PWA (manifest).
- [ ] Incorpora el bloque CSS `:root` de `generador_tarjetas.html` (Tokens v2.0) en el `<style>` del `<head>`.
- [ ] Implementa el Layout General en Vanilla HTML/CSS (Navbar, Tabs y Main Container).
- [ ] Crea un build script (Node.js o Bash) para leer archivos `.js`, `.css` externos y convertirlos en literales `<script>` e `<style>` inline dentro de un `ECE-DES.html` resultante (bundling en un solo archivo).

### Tarea 1.2: Motor de Base de Datos SQLite (sql.js)
- [ ] Descarga la dependencia `sql.js` (incluyendo su `.wasm`) instalada localmente.
- [ ] Codifica la rutina de inicialización en JS (`initDatabase()`): cargar WASM comprimido en Base64 e iniciar conexión SQLite vacía.
- [ ] Construye esquemas de BD (DDL) para `pacientes`, `trazabilidad`, `operadores`, y `auditoria`.
- [ ] Configura lógica de persistencia y carga desde **IndexedDB**.
  - Evitar limitantes de `localStorage`. Guardar el `Uint8Array` exportado de `db.export()` dentro de IndexedDB tras cada transacción o intervalo de inactividad de 30 segundos.

### Tarea 1.3: Módulo de Autenticación
- [ ] Dibuja la pantalla "Login" (AuthSession).
- [ ] Input de Hospital, Evento, Rol, Nombre de operador y PIN (sólo dígitos numéricos).
- [ ] Al acceder, inyecta `INSERT` con operador y el Hash corto del PIN (pseudo-autenticación local) en sesión temporal de memoria. Cierra vista de Auth y abre "Census".

### Tarea 1.4: Formulario `PatientRegistry` (Registro Rápido)
- [ ] Diseña formulario rápido en Grid (Layout < 60 mins).
- [ ] Lógica controladora JS para Autogenerar el `Folio local` secuencial (`P-{count}`).
- [ ] Construye matriz de botones grandes para el Triage usando tokens `--fn-[color]`.
- [ ] Acciones de Guardado: Ejecuta queries INSERT en `pacientes` y en `trazabilidad`. Invoca re-render reactivo del Census.

---

## Sprint 2: Expedientes, Timeline y Trazabilidad

### Tarea 2.1: Cuadro "Census" (Panel de Control)
- [ ] Crea función JS que cuente agrupaciones de pacientes (`SELECT COUNT(*) FROM pacientes GROUP BY triage_actual`).
- [ ] Actualiza estado de la UI: barra de llenado verde/dorada/guinda según conteos por área definidos por variables (Area_Capacity máxima de contingencia).

### Tarea 2.2: Listado y Buscador Integral
- [ ] Renderiza la tabla de pacientes con estilos base de `generador_tarjetas.html` utilizando los registros devueltos en `SELECT * FROM pacientes ORDER BY ts_ingreso DESC`.
- [ ] Implementa listeners de eventos `keyup` en el Input "Buscar" para filtrar directamente en memoria (sin queries innecesarios) las filas según nombre, folio o código pulsera.

### Tarea 2.3: Vista Expediente Individual (`ClinicalTrace`)
- [ ] Implementa contenedor detallado de expediente.
- [ ] Función para inyectar una "Línea de tiempo / Timeline" invocando `SELECT * FROM trazabilidad WHERE id_paciente=X`.
- [ ] Agrega formularios cortos embebidos o Modales con Selects HTML regulares para "Signos Vitales", "Medicamentos", "Cambiar Triage" y "Traslados/Notas".
- [ ] Inyecta los queries de evento mediante insert. Audita cada inserción silenciosamente a su respectiva tabla.

---

## Sprint 3: Exportaciones, Respaldo offline e Impresión

### Tarea 3.1: Exportador Excel (SheetJS)
- [ ] Integra la librería `xlsx.full.min.js` puramente inlined.
- [ ] Genera subrutina JavaScript `exportToExcel()`:
  - Construye DataArrays desde DB (Ej: hoja 1 para métricas de resumen, hoja 2 para matriz gigante pre-formateada de `pacientes`, hoja 3 con auditoría en formato de log raw continuo).
- [ ] Dispara evento File Saver para desencadenar descarga `Excel_ECE_DES_Offline.xlsx`.

### Tarea 3.2: Sistema Import/Export Binario Interno
- [ ] Configura botón UI "Guardar Base y Terminar." (Descarga `.db` binary Blob o su equivalente serializado PWA JSON).
- [ ] Botón en Header (icono de Disquete / Backup): forzará la descarga raw del archivo `.json`/`.db` sin procesamientos, ideal para copias sucias rapidas a la SD/Drive sin interrumpir flujo.

### Tarea 3.3: Ajustes `@media print`
- [ ] Define jerarquía de impresión PDF:
  - Elimina todo elemento HUD (Nav, Tabs).
  - Maximiza a 100% de la hoja ancho las tarjetas de ingreso/Línea de tiempo.
  - Habilita modo impresión vertical con zoom para la visión por operador.
