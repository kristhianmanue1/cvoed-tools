# CVOED-Tools 🏥

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Release: v1.0.0](https://img.shields.io/badge/release-v1.0.0-green.svg)](https://github.com/kristhianmanue1/cvoed-tools/releases)
[![100% Offline](https://img.shields.io/badge/offline-100%25-brightgreen.svg)]()
[![WCAG 2.2 AAA](https://img.shields.io/badge/WCAG-2.2%20AAA-success.svg)]()

**Suite Portátil de Herramientas Hospitalarias para Emergencias y Desastres**

---

## 📋 ¿Qué es CVOED-Tools?

CVOED-Tools es una suite de **6 herramientas hospitalarias** diseñadas para gestionar **emergencias y desastres**, especialmente saldos masivos de víctimas.

### 🚨 El Problema que Resuelve

Durante emergencias (terremotos, explosiones, eventos masivos), los hospitales necesitan:
- ✅ Registrar rápidamente a muchos pacientes
- ✅ Clasificar por gravedad (triaje)
- ✅ Coordinar recursos y personal
- ✅ Generar reportes rápidos
- ✅ **Todo SIN internet** (redes suelen colapsar)

### 💡 La Solución

CVOED-Tools provee 6 herramientas que funcionan **100% offline**, en una memoria USB, para:
- 📋 **Registrar pacientes** (ECE-DES) - Registro express con triage START
- 📊 **Monitorear la emergencia** (Dashboard) - Métricas en tiempo real para puestos de mando
- 🏷️ **Imprimir tarjetas de triaje** (Tarjetas) - Generación de tarjetas físicas START
- 👥 **Generar roles de comando** (Generador SCI-H) - Tarjetas de acción para el Sistema de Comando de Incidentes
- 📖 **Consultar protocolos** (Guía) - Manual digital del Hospital Nunca Jamás
- 🎯 **Simular escenarios** (Simulador) - Plataforma de evaluación de simulacros

### 🏥 Para Quién Es

- 👨‍⚕️ Médicos de emergencia
- 👩‍⚕️ Enfermeras de triage
- 👨‍💼 Administradores hospitalarios
- 🏥 Puestos de mando
- 📋 Coordinadores de desastres

---

## 🛠️ ¿Cómo Funciona?

### Arquitectura

Todas las herramientas son **archivos HTML autocontenidos**:
- No requieren instalación
- Funcionan sin internet
- Se guardan en memoria USB
- Se ejecutan en cualquier navegador (Chrome, Firefox, Edge)

### Características Técnicas

📱 **Modo Offline 100%**
- Base de datos SQLite integrada (sql.js con WebAssembly)
- Persistencia en el navegador (IndexedDB)
- Exportación a Excel sin servidor

🎨 **Diseño Accesible**
- Contraste 7:1+ (WCAG 2.2 AAA - máximo nivel de accesibilidad)
- Fuentes del sistema (sin descargas adicionales)
- Responsive (funciona en móvil y escritorio)

🔒 **Privacidad de Datos**
- Todo se guarda localmente en el navegador
- No se envían datos a la nube
- Paciente 100% anónimo
- Sin rastreo ni telemetría

---

## 🎯 ¿Cuándo Usar CVOED-Tools?

### 🚨 En Emergencias Reales

- **Sismo** con muchas víctimas
- **Explosión** en evento masivo
- **Multitud** con lesionados
- **Colapso** de servicios (electricidad, internet, telefonía)
- **Saldos masivos de víctimas** (SMV)

### 🏋️ En Simulacros y Capacitación

- Ejercicios de preparación hospitalaria
- Entrenamiento de personal en triage START
- Evaluación de protocolos SCI-H
- Simulacros de desastres (como Hospital Nunca Jamás)

### 📋 En Preparación

- Planificación hospitalaria para eventos masivos
- Elaboración de planes de respuesta ante emergencias
- Actualización de directorios y protocolos
- Capacitación continua del personal

---

## 📥 ¿Cómo Obtener CVOED-Tools?

### Opción 1: TODO EN UN ZIP ⭐ RECOMENDADO

**[📥 Descargar CVOED-Tools-Completo-v1.0.0.zip (1.2MB)](https://github.com/kristhianmanue1/cvoed-tools/releases/download/v1.0.0/CVOED-Tools-Completo-v1.0.0.zip)**

Todas las 6 herramientas en un solo archivo. ¡Listo para usar!

> **📢 Actualización (2026-03-12):** ZIP actualizado con estructura corregida. Todos los archivos ahora están en la raíz (sin subdirectorios anidados). El simulador funciona correctamente.

**Instrucciones:**
1. 📥 Clic en descargar
2. 📂 Descomprimir ZIP en escritorio o carpeta
3. 🖱️ Abrir `index.html`
4. 🎯 Elegir herramienta del menú
5. ✅ Usar sin internet

### Opción 2: Descargar Individualmente

Seleccione solo la herramienta que necesita:

| Herramienta | Qué Hace | Descargar | Tamaño |
|-------------|----------|----------|--------|
| **ECE-DES** | Registro de pacientes con triage START | [📥](https://github.com/kristhianmanue1/cvoed-tools/raw/main/dist/ECE-DES.html) | 1.9MB |
| **Dashboard** | Monitoreo y métricas para puestos de mando | [📥](https://github.com/kristhianmanue1/cvoed-tools/raw/main/dist/ECE-DES-Dashboard.html) | 952KB |
| **Tarjetas** | Impresión de tarjetas START físicas | [📥](https://github.com/kristhianmanue1/cvoed-tools/raw/main/dist/ECE-DES-Tarjetas.html) | 13KB |
| **Generador SCI-H** | Tarjetas de acción para roles de comando | [📥](https://github.com/kristhianmanue1/cvoed-tools/raw/main/dist/generador_tarjetas.html) | 48KB |
| **Guía Operativa** | Manual digital del Hospital Nunca Jamás | [📥](https://github.com/kristhianmanue1/cvoed-tools/raw/main/dist/guia_operativa_nunca_jamas.html) | 41KB |
| **Simulador** | Plataforma de evaluación de simulacros | [📥](https://github.com/kristhianmanue1/cvoed-tools/raw/main/dist/simulacro_nunca_jamas_fifa2026.html) | 65KB |

**Uso individual:**
1. 📥 Descargar el HTML
2. 🖱️ Doble clic para abrir
3. ✅ Usar sin internet

---

## 📖 Guía Rápida

### Primeros Pasos (ZIP)

1. **Descargar** el archivo ZIP completo
2. **Descomprimir** en cualquier carpeta (escritorio, documentos, USB)
3. **Abrir** `index.html` (es el portal principal)
4. **Elegir** la herramienta que necesitas del menú

### Tips de Uso

- 💾 **Guardar trabajo:** Las herramientas guardan datos automáticamente en el navegador
- 📊 **Exportar:** Usa el botón "Exportar a Excel" para respaldar datos
- 🔄 **Compatibilidad:** Funciona en Windows, Mac, Linux, Chrome, Firefox, Edge
- 🔋 **Batería:** Bajo consumo, funciona en laptops viejas

---

## 🛠️ Herramientas Detalladas

### 📋 ECE-DES (1.9MB)
**Expediente Clínico Electrónico para Desastres**

Sistema principal de registro de pacientes:
- Registro express (30 segundos por paciente)
- Triage START con botones táctiles
- Base de datos SQLite integrada (miles de pacientes)
- Trazabilidad clínica completa
- Exportación a Excel

### 📊 Dashboard Analítico (952KB)
**Tablero de Control para Puesto de Mando**

Panel para toma de decisiones:
- Métricas en tiempo real
- Gráficas de ocupación por triage
- Reportes ejecutivos
- Análisis de trazabilidad
- Lectura de base de datos ECE-DES

### 🏷️ Motor de Impresión (13KB)
**Generación de Tarjetas START**

Crea tarjetas físicas cuando no hay electricidad:
- Plantilla A4 estándar
- 4 tarjetas por hoja en cascada
- Impresión en cualquier impresora
- Código de barras incluido

### 🔧 Generador SCI-H (48KB)
**Tarjetas de Acción para Roles**

Sistema de Comando de Incidentes Hospitalario:
- Comandante del Incidente
- Jefe de Operaciones
- Jefe de Planificación
- Jefe de Logística
- Jefe de Administración/Finanzas
- Oficial de Información Pública
- Oficial de Seguridad
- Oficial de Enlace

### 📖 Guía Operativa (41KB)
**Manual del Hospital de Nunca Jamás**

Guía interactiva con protocolos:
- Procedimientos estandarizados
- Referencias rápidas
- Soporte completo SCI-H
- Navegación por búsqueda

### 🎯 Simulador (65KB)
**Plataforma de Evaluación de Simulacros**

Sistema de entrenamiento:
- Escenarios de emergencia
- Evaluación en tiempo real
- Reportes de desempeño
- Retroalimentación automática
- Checklists de verificación

---

## ✨ Características Técnicas

- ✅ **100% Offline** - Funciona sin conexión a internet
- ✅ **Portable** - Distribuible en memoria USB
- ✅ **Sin instalación** - Doble clic y listo
- ✅ **Autocontenido** - Todo incluido, sin dependencias externas
- ✅ **WCAG 2.2 AAA** - Máximo nivel de accesibilidad (contraste 7:1+)
- ✅ **SQLite WASM** - Base de datos completa en el navegador
- ✅ **Excel Export** - SheetJS integrado para reportes
- ✅ **Responsive** - Funciona en móvil, tablet y escritorio
- ✅ **Privado** - Datos 100% locales, sin envío a la nube

---

## 👥 Autores

**Dra. Carla Abril Perez Becerril**
- 📧 carpeb05@yahoo.com.mx
- 🏥 Médica Cirujana, Especialista en Medicina de Emergencia y Desastres
- 🎓 Capacitada en CPES (Coordinación de Proyectos Especiales en Salud)

**Kristhian Manuel Jiménez Sánchez**
- 📧 krisnova@hotmail.com
- 💻 Lead Developer & Software Architect
- 🎓 Especialista en Desarrollo Frontend y Sistemas de Información Hospitalaria

---

## 📜 Licencia

[Apache License 2.0](LICENSE)

© 2026 Dra. Carla Abril Perez Becerril & Kristhian Manuel Jiménez Sánchez

- ✅ Uso comercial permitido
- ✅ Modificación permitida
- ✅ Distribución permitida
- ✅ Uso privado permitido
- ⚠️ Atribución requerida
- ⚠️ Sin garantía

---

## 📊 Contexto

- **Programa:** CPES - Coordinación de Proyectos Especiales en Salud (IMSS)
- **Evento:** Copa Mundial FIFA 2026
- **País:** México
- **Año:** 2026
- **Contexto:** Preparación hospitalaria para emergencias masivas

---

## 🙏 Agradecimientos

- **CPES-IMSS** por la capacitación en preparación para emergencias
- **OPS/OMS** por las guías técnicas de referencia
- **Comunidad médica** por su retroalimentación constante

---

## ⚠️ Disclaimer

**Este es un proyecto PERSONAL de los autores.**

CVOED-Tools es una iniciativa independiente basada en el curso de preparación para eventos en emergencias y desastres de la CPES (Coordinación de Proyectos Especiales en Salud).

**NO es una publicación oficial del IMSS.**

Estas herramientas son **material de apoyo** para situaciones de emergencia y **NO sustituyen** la capacitación profesional ni los protocolos oficiales de cada institución.

El uso de estas herramientas es responsabilidad exclusiva del usuario. Los autores no se hacen responsables por el mal uso o interpretación de la información contenida.

---

**Versión:** 1.0.0
**Fecha:** Marzo 2026
**Estado:** Producción
**Tamaño ZIP:** 1.2MB (comprimido) / 3.1MB (descomprimido)

🚀 **Listo para usar**

---

**[⬆ Volver al inicio](#)**
