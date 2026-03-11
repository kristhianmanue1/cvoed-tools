# CVOED-Tools

> **Suite Portátil de Herramientas Hospitalarias para Emergencias y Desastres**
> **Iniciativa Personal - Basada en curso CPES**
> **Licencia:** Apache License 2.0

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

---

## ⚠️ AVISO IMPORTANTE

**Este es un proyecto PERSONAL de los autores.**

CVOED-Tools es una iniciativa independiente desarrollada basándose en el conocimiento adquirido durante el **curso de preparación para eventos en emergencias y desastres de la CPES** (Coordinación de Proyectos Especiales en Salud).

**NO es una publicación oficial.** Es una herramienta educativa independiente creada para apoyar la preparación hospitalaria ante emergencias, inspirada en la capacitación recibida.

---

## 👥 Autores

**Dra. Carla Abril Perez Becerril**
- 🏥 Médica Cirujana
- 📚 Especialista en Medicina de Emergencia y Desastres
- ✅ Contenido clínico y validación médica
- 📧 carpeb05@yahoo.com.mx

**Kristhian Manuel Jiménez Sánchez**
- 💻 Lead Developer & Software Architect
- 🔧 Especialista en Desarrollo Frontend y Sistemas de Información Hospitalaria
- ✅ Arquitectura técnica y desarrollo de componentes interactivos
- 📧 krisnova@hotmail.com

---

## 📜 Licencia

Este proyecto está licenciado bajo la **Apache License 2.0**.

- 📄 [Ver licencia completa](LICENSE)
- 🔗 https://opensource.org/licenses/Apache-2.0

**Copyright © 2026 Dra. Carla Abril Perez Becerril & Kristhian Manuel Jiménez Sánchez**

---

## 🎯 Propósito

CVOED-Tools es una suite **100% portátil** de herramientas hospitalarias diseñada como **iniciativa personal** de los autores, basada en el curso de preparación para eventos en emergencias y desastres de la CPES en el contexto de la **Copa Mundial FIFA 2026**.

Todos los componentes funcionan **sin internet** y pueden distribuirse en memoria USB.

### Características Principales

- ✅ **100% Offline** - Funciona sin conexión a internet
- ✅ **Portable** - Distribuible en USB
- ✅ **Zero Dependencies Operativas** - No requiere instalación
- ✅ **Persistencia Local** - IndexedDB + localStorage
- ✅ **Exportación Excel** - SheetJS integrado
- ✅ **Accesible** - WCAG 2.2 AAA (7:1+ contraste)

---

## 🚀 Quick Start

### Requisitos Previos

- Navegador moderno (Chrome/Edge/Firefox) - Para producción
- Node.js 18+ (para desarrollo)

### Uso Inmediato (Producción)

```bash
# Descargar o clonar el repositorio
git clone https://github.com/IMSS-CPES/cvoed-tools.git
cd cvoed-tools

# Abrir directamente en el navegador
open dist/index.html
# O hacer doble clic en index.html
```

Los archivos en `dist/` son **100% portátiles** y pueden ejecutarse directamente.

### Desarrollo

```bash
# Instalar dependencias de desarrollo
npm install

# Ejecutar servidor de desarrollo
./serve.sh

# Build para desarrollo
npm run build:dev
```

### Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar con coverage
npm run test:coverage
```

---

## 🛠️ Herramientas Incluidas

### 1. ECE-DES - Expediente Clínico Electrónico para Desastres
**Archivo:** `dist/ECE-DES.html` (1.8 MB)
**Autoría:** Dra. Carla Abril Perez (contenido clínico) + Kristhian Manuel Jiménez (desarrollo)

Sistema principal para el registro rápido de pacientes durante saldos masivos de víctimas.

- Registro Express con triage START
- Perfil extendido de pacientes
- Trazabilidad clínica asincrónica
- Exportación a Excel
- Persistencia en IndexedDB

### 2. ECE-DES Dashboard - Tablero de Control
**Archivo:** `dist/ECE-DES-Dashboard.html` (916 KB)
**Autoría:** Kristhian Manuel Jiménez Sánchez

Panel directivo con análisis en tiempo real de la emergencia.

- Métricas en tiempo real
- Gráficas de ocupación
- Reportes ejecutivos
- Análisis de trazabilidad

### 3. ECE-DES Tarjetas - Motor de Impresión START
**Archivo:** `dist/ECE-DES-Tarjetas.html` (9.2 KB)
**Autoría:** Kristhian Manuel Jiménez Sánchez

Genera tarjetas físicas de triage para impresión.

- Plantilla A4/carta con 4 tarjetas
- Estándar internacional START
- Impresión offline
- Código de barras integrado

### 4. Generador de Tarjetas SCI-H
**Archivo:** `dist/generador_tarjetas.html` (31 KB)
**Autoría:** Dra. Carla Abril Perez (protocolos SCI-H) + Kristhian Manuel Jiménez (desarrollo)

Genera tarjetas de acción para roles del Sistema de Comando de Incidentes Hospitalario.

- Roles: Comandante, Operaciones, Logística
- Sistema de tokens v2.0
- Doble codificación color + forma
- Impresión inmediata

### 5. Simulador de Emergencias - Hospital de Nunca Jamás
**Archivo:** `dist/simulacro_nunca_jamas_fifa2026.html` (119 KB)
**Autoría:** Dra. Carla Abril Perez (diseño de escenarios) + Kristhian Manuel Jiménez (desarrollo)

Plataforma de simulación para entrenamiento de personal hospitalario.

- **3 Escenarios:** Sismo 7.4, Explosión, Cuartos de Final FIFA
- **Sistema de color dual** (RAMS-IVE Clinical)
- **Modo oscuro/claro** (WCAG AAA)
- **Voz SCI-H** para accesibilidad
- **Dinámicas realistas** de emergencia

### 6. Guía Operativa Hospital de Nunca Jamás
**Archivo:** `dist/guia_operativa_nunca_jamas.html` (39 KB)
**Autoría:** Dra. Carla Abril Perez Becerril

Guía interactiva del escenario de simulación con referencia completa SCI-H.

---

## 📁 Estructura del Proyecto

```
cvoed-tools/
├── src/                    # Código fuente modular
│   ├── ece-des/           # Expediente Clínico
│   ├── dashboard/         # Tablero de Control
│   ├── simulador/         # Simulador de Emergencias
│   ├── tarjetas/          # Generador de Tarjetas
│   ├── shared/            # Utilidades compartidas
│   └── config/            # Configuración
├── tests/                  # Suite de pruebas
├── docs/                   # Documentación técnica
├── dist/                   # Build de producción (portátil)
└── tools/                  # Scripts de utilidad
```

---

## 🏗️ Arquitectura

### Stack Tecnológico

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES2022)
- **Base de Datos:** SQLite in-browser (sql.js con WebAssembly)
- **Exportación:** SheetJS (XLSX)
- **Persistencia:** IndexedDB + localStorage
- **Testing:** Jest + jsdom
- **Build:** Babel + Bash scripts

### Patrones de Diseño

- **Offline-First:** Todo funciona sin internet
- **Single-File HTML:** Cada herramienta es un archivo portátil
- **Modularidad:** Código organizado por funcionalidad
- **Accesibilidad:** WCAG 2.2 AAA (7:1+ contraste)

---

## 🚀 Despliegue

Los archivos HTML en `dist/` pueden:
- Abrirse directamente en un navegador (doble clic)
- Distribuirse en memoria USB
- Alojarse en cualquier servidor web estático
- Funcionar sin conexión a internet

---

## 🤝 Contribución

### Flujo de Trabajo

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- **Testing:** Coverage >85% requerido
- **Documentación:** Todo código debe estar documentado
- **Commits:** Mensajes claros y descriptivos

---

## 📞 Soporte

Para soporte técnico o preguntas:
- **Issues:** [GitHub Issues](https://github.com/IMSS-CPES/cvoed-tools/issues)
- **Dra. Carla Abril Perez:** carpeb05@yahoo.com.mx
- **Kristhian Manuel Jiménez:** krisnova@hotmail.com

---

## 🙏 Agradecimientos

- **CPES-IMSS** - Por la capacitación en preparación para emergencias y desastres
- **OPS/OMS** - Por las guías técnicas de referencia
- **Hospital de Nunca Jamás** - Escenario de simulación inspirado en el curso CPES

---

## 📊 Estado del Proyecto

**Última actualización:** Marzo 2026
**Versión:** 1.0.0
**Naturaleza:** Iniciativa personal basada en curso CPES

---

## 🔗 Links Importantes

- **Licencia Apache 2.0:** https://www.apache.org/licenses/LICENSE-2.0
- **Repositorio:** https://github.com/IMSS-CPES/cvoed-tools
- **Descargas:** https://github.com/IMSS-CPES/cvoed-tools/releases

---

**Creado con ❤️ como iniciativa personal**
**Dra. Carla Abril Perez Becerril & Kristhian Manuel Jiménez Sánchez**

*Basado en el conocimiento adquirido durante el curso de preparación para eventos en emergencias y desastres de la CPES - Coordinación de Proyectos Especiales en Salud.*
