# Catálogo General CVOED
**Herramientas para la Preparación y Respuesta Hospitalaria ante Emergencias y Desastres**

**Desarrollado por:** Kristhian Manuel Jimenez y Dra. Carla Abril Perez
**Licencia:** Apache License 2.0 (Se permite el uso comercial, modificación, distribución y uso privado, sujeto a las condiciones de atribución y exención de responsabilidad de la licencia Apache 2.0).

---

Este documento cataloga todos los recursos interactivos (HTML) y normativos (PDF) disponibles en esta suite portátil para hospitales.

## 1. Aplicaciones Web y Sistemas Interactivos (Portables HTML5)
Estos archivos son aplicaciones 100% offline que pueden ejecutarse desde una memoria USB o computadora sin internet.

*   **[ECE-DES.html](./ECE-DES.html)** 
    *   **Descripción:** Expediente Clínico Electrónico para Desastres. Sistema principal para el registro rápido de pacientes durante un evento de Saldos Masivos de Víctimas (SMV).
    *   **Funciones:** Registro Express (START triage), Perfil extendido, Trazabilidad clínica asíncrona, Exportación a Excel y Respaldo interno (IndexedDB).
*   **[ECE-DES-Dashboard.html](./ECE-DES-Dashboard.html)**
    *   **Descripción:** Tablero de Control y Reportes Directivos (Puesto de Mando).
    *   **Funciones:** Lee automáticamente la base de datos de pacientes del ECE-DES y genera gráficas de barras, conteo general e historial de trazabilidad sin afectar el rendimiento de los capturistas.
*   **[ECE-DES-Tarjetas.html](./ECE-DES-Tarjetas.html)**
    *   **Descripción:** Motor de Impresión de Tarjetas/Etiquetas Físicas START.
    *   **Funciones:** Genera una plantilla A4 o Carta con 4 tarjetas de papel recortables en cascada según el estándar internacional, útiles cuando cae la energía eléctrica.
*   **[generador_tarjetas.html](./generador_tarjetas.html)**
    *   **Descripción:** Generador de Tarjetas de Acción del Sistema de Comando de Incidentes Hospitalario (SCI-H).
    *   **Funciones:** Interfaces rellenables para imprimir los chalecos y funciones de los roles de comando (Comandante, Operaciones, Logística) al activarse una alerta.
*   **[guia_operativa_nunca_jamas.html](./guia_operativa_nunca_jamas.html)**
    *   **Descripción:** Manual Digital Formateado.
    *   **Funciones:** Despliegue en formato web amigable de los protocolos operativos del hospital.
*   **[simulacro_nunca_jamas_fifa2026.html](./simulacro_nunca_jamas_fifa2026.html)**
    *   **Descripción:** Plataforma de Evaluación de Simulacro (Mundial 2026).
    *   **Funciones:** Herramienta web para administrar los checklists y métricas durante el ejercicio de prevención masiva.

---

## 2. Biblioteca de Guías y Normativas Oficiales (PDF)
Documentación técnica ubicada en la carpeta `/docs/`, lista para lectura rápida o impresión de escritorio.

### Manejo de Saldo Masivo y SCI-H
*   **[Guía Operativa SMV-H](./docs/Gui%CC%81a%20Operativa%20para%20la%20respuesta%20ante%20Saldo%20Masivo%20de%20Vi%CC%81ctimas%20(SMV-H).pdf):** Protocolo médico de triage prehospitalario y hospitalario.
*   **[SCI Hospitalario](./docs/sci-hospitalario.pdf):** Manual de implementación del Sistema de Comando de Incidentes.
*   **[Marco de Respuesta Multiamenaza](./docs/marco%20de%20respuesta%20multiamenaza.pdf):** Abordaje general de riesgos biológicos, químicos y físicos.

### Operaciones, Evacuación y Planificación (PH-RED)
*   **[Guía Evacuación (EVAC-H)](./docs/Gui%CC%81a%20Operativa%20para%20la%20Evacuacio%CC%81n%20de%20hospitales%20y%20a%CC%81reas%20cri%CC%81ticas%20(EVAC-H).pdf):** Procedimiento para el despoblamiento seguro de áreas críticas.
*   **[Guía de Continuidad (BCP-H)](./docs/Gui%CC%81a%20Operativa%20para%20la%20Continuidad%20de%20Operaciones%20en%20establecimientos%20de%20salud%20(BCP-H).pdf):** Mantenimiento de las funciones vitales del hospital ante el fallo de servicios básicos.
*   **[Guía del Plan Hospitalario (PH-RED)](./docs/Gui%CC%81a%20Operativa%20para%20la%20elaboracio%CC%81n%20e%20implementacio%CC%81n%20del%20Plan%20Hospitalario%20de%20Respuesta%20ante%20Emergencias%20y%20Desastres%20(PH-RED).pdf):** Metodología maestra de prevención.
*   **[Incidentes Intencionales QBRNE](./docs/Gui%CC%81a%20Operativa%20para%20la%20respuesta%20ante%20Incidentes%20Intencionales%20QBRNE.pdf):** Contingencias químicas, biológicas y radiológicas.

### Índices de Seguridad (PHS)
*   **[Manual del evaluador PHS](./docs/Manual%20del%20evaluador%20PHS.pdf) & [Formularios PHS](./docs/Manual%20formularios%20PHS.pdf):** Índice de Seguridad Hospitalaria OMS/OPS.
*   **[Ingrid-H](./docs/Ingrid-h.pdf):** Inclusión para la Gestión del Riesgo de Desastres en Hospitales.

### Ejercicios y Capacitación
*   **[Manual de Simulacros](./docs/Gui%CC%81a%20Operativa%20para%20el%20Disen%CC%83o%20y%20Ejecucio%CC%81n%20de%20Simulacros%20de%20Gabinete%20y%20de%20Campo%20en%20establecimientos%20de%20salud.pdf):** Diseño de simulacros de gabinete y campo.
*   **[Ejercicio FIFA 2026](./docs/Ejercicio%20Hospital%20Nunca%20Jama%CC%81s%20CM%20FIFA%202026.pdf):** Documento base del Ejercicio de Saldo Masivo FIFA 2026.
*   **[Agenda Taller CPES](./docs/Nota%20Conceptual%20y%20Agenda%20TALLER%20CPES%20FEB%202026.pdf):** Formatos de capacitación a brigadistas.
