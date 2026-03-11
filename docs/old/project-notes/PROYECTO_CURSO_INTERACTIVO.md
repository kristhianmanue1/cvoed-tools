# PROYECTO: Curso Interactivo y Escenario de Simulación HTML5
## CPES-IMSS · Preparativos Hospitalarios · Copa Mundial FIFA 2026
### Documento de Proyecto Completo — Versión 1.0

> **Clasificación:** Documento de diseño instruccional y especificación técnica  
> **Alcance:** Curso e-learning interactivo + Simulador de escenario HTML5 autónomo  
> **Base documental:** 13 documentos CPES-IMSS + OPS/OMS  
> **Hospital ancla:** Hospital de Nunca Jamás (220 camas, ISH 0.52, Categoría B)  
> **Contexto:** Taller de Formación de Facilitadores + Copa Mundial FIFA 2026

---

## ÍNDICE DEL PROYECTO

1. [Análisis de Insumos](#1-análisis-de-insumos)
2. [Fundamentos Pedagógicos del Proyecto](#2-fundamentos-pedagógicos)
3. [Arquitectura General: Dos Productos Complementarios](#3-arquitectura-general)
4. [PRODUCTO A: Curso Interactivo Modular](#4-producto-a-curso-interactivo-modular)
5. [PRODUCTO B: Escenario de Simulación HTML5](#5-producto-b-escenario-de-simulación-html5)
6. [Integración Técnica y Flujo de Usuario](#6-integración-técnica-y-flujo-de-usuario)
7. [Especificaciones de Contenido por Módulo](#7-especificaciones-de-contenido-por-módulo)
8. [Especificaciones del Simulador de Escenarios](#8-especificaciones-del-simulador)
9. [Gamificación y Sistema de Evaluación](#9-gamificación-y-evaluación)
10. [Diseño Visual e Identidad IMSS](#10-diseño-visual-e-identidad-imss)
11. [Arquitectura Técnica HTML5](#11-arquitectura-técnica-html5)
12. [Plan de Producción y Priorización](#12-plan-de-producción)
13. [Criterios de Aceptación y Control de Calidad](#13-criterios-de-aceptación)

---

## 1. ANÁLISIS DE INSUMOS

### 1.1 Material recibido para análisis

#### PPTX: Escenarios SMV y EVAC-H (Taller 19/02/2026)

La presentación analizada contiene **tres escenarios clínicos-operativos** de alta calidad pedagógica ya utilizados en el taller presencial:

| Escenario | Amenaza principal | Guías activadas | Complejidad |
|-----------|-------------------|-----------------|-------------|
| **Escenario 1** | Sismo 7.4, daño estructural, 4 VM, 1 cirugía en curso | EVAC-H + SCI-H + PH-RED | Alta |
| **Escenario 2** | Sismo + explosión por gas (60 víctimas) + réplica sísmica | EVAC-H + SMV-H + SCI-H | Muy alta |
| **Escenario 3** | Estampida FIFA (>120 lesionados) — 20 críticos, 40 mod., 60 leves | SMV-H + SCI-H + QBRNE parcial | Máxima |

**Hallazgo pedagógico clave:** Cada escenario ya está diseñado con preguntas escalonadas en nivel Bloom (Aplicar → Analizar → Evaluar/Crear). Esto es la columna vertebral del simulador interactivo.

**Brecha identificada:** El PPTX es un instrumento facilitador — requiere presencia de un experto para activar la discusión. El proyecto convierte estos tres escenarios en experiencias autodirigidas con retroalimentación inteligente, accesibles sin facilitador.

#### Fotografías del taller (IMG_0571–0575)

Las cinco imágenes capturan evidencia directa del trabajo con maqueta del Hospital de Nunca Jamás:
- Personal manipulando el croquis impreso del hospital para simular flujos de evacuación
- Grupos de trabajo activos con fichas de pacientes y roles diferenciados
- Uso de representaciones físicas (figuras) para ambulancias, personal, pacientes

**Hallazgo crítico para el simulador HTML5:** El formato de maqueta física tiene alta eficacia pedagógica comprobada. El simulador HTML5 debe **replicar esta dinámica** en formato digital: un plano funcional interactivo del hospital donde el usuario mueve recursos, toma decisiones espaciales y ve consecuencias en tiempo real del escenario.

### 1.2 Análisis de brechas actuales del Hospital de Nunca Jamás

Las brechas documentadas en el ISH (puntaje 0.52, Categoría B) y el ejercicio no son limitaciones — son **el motor pedagógico** del proyecto:

| Brecha operativa | Guía afectada | Tensión pedagógica generada |
|-----------------|---------------|----------------------------|
| PH-RED desactualizado (18 meses, sin FIFA, sin ciberseguridad) | PH-RED | ¿Quién activa qué cuando el plan no incluye el escenario real? |
| 35% pacientes con discapacidad no registrados en base de emergencias | EVAC-H + INGRID-H | ¿Cómo evacuas a quien no sabes que necesita ayuda diferenciada? |
| Sin zona de descontaminación QBRNE establecida ni señalizada | QBRNE | ¿Dónde pones al primer paciente contaminado que llega solo? |
| Solo 2 de 5 servicios críticos con OTR documentado | BCP-H | ¿Qué servicios colapsarán primero y cuánto tiempo aguantan? |
| Personal de turno nocturno sin capacitación SMV en el último año | SMV-H | ¿Puede el jefe de turno de las 3 AM activar el Código Naranja solo? |
| Sin telecomunicaciones redundantes | PH-RED + BCP-H | ¿Qué pasa cuando el celular no funciona y la red está saturada? |
| Déficit 56% medicamentos clave en almacén | SMV-H + BCP-H | ¿Con qué recursos reales cuentas cuando llegan 30 heridos? |

**Principio de diseño:** Cada brecha genera un dilema en el curso y en el simulador. No se "resuelve" la brecha — se pone al usuario en la posición de tomar decisiones bajo esas condiciones reales.

---

## 2. FUNDAMENTOS PEDAGÓGICOS DEL PROYECTO

### 2.1 Marco andragógico aplicado

El personal hospitalario IMSS que recibirá este curso tiene características específicas que determinan el diseño:

**Perfil del aprendiz adulto en contexto operativo:**
- Experiencia clínica previa sólida (urgencias, guardias, protocolos clínicos)
- Tiempo fragmentado: guardias de 12-24 h, alta carga asistencial
- Motivación extrínseca alta cuando la amenaza es real y próxima (FIFA en semanas)
- Resistencia a formatos escolares pasivos
- Alta capacidad de aprendizaje situado (aprende mejor "en el problema")

**Implicaciones de diseño:**
1. El "para qué" (FIFA 2026 ya llega) precede a cualquier contenido
2. El Hospital de Nunca Jamás reemplaza a los ejemplos abstractos — siempre es el mismo hospital, siempre los mismos pacientes, siempre las mismas brechas
3. El error es pedagógico: el simulador permite fallar con consecuencias visibles pero sin riesgo real
4. Microformatos prioritarios: el personal no tiene 45 minutos continuos — tiene 5-7 minutos entre actividades

### 2.2 Currículo en espiral aplicado al proyecto

```
DIAGNÓSTICO (Semana 0)
    ↓ mide brechas reales
BLOQUE 1: PH-RED + SCI-H — ¿Qué estructura toma el mando?
    ↓ introduce el marco
BLOQUE 2: EVAC-H — ¿Quién sale primero y cómo lo decido?
    ↓ aplica el marco a decisiones espaciales
BLOQUE 3: SMV-H — ¿Cómo proceso 30 heridos en 15 minutos?
    ↓ escala la complejidad
BLOQUE 4: BCP-H — ¿Qué servicios debo proteger para no colapsar?
    ↓ añade continuidad operativa
BLOQUE 5: QBRNE — ¿Qué hago cuando la amenaza no se ve?
    ↓ introduce la amenaza más compleja
BLOQUE 6: Integrador — El simulacro del día del partido
    ↓ activa TODOS los bloques simultáneamente
SIMULADOR HTML5 — Escenarios completos con decisiones en tiempo real
    ↓ evalúa competencias bajo presión
```

### 2.3 Taxonomía de Bloom aplicada a los tres escenarios del PPTX

Los escenarios del taller ya tienen estructura Bloom implícita. El proyecto la hace explícita y la digitaliza:

**Escenario 1 (Sismo + EVAC-H):**
- Nivel Aplicar: "¿En qué grupo de evacuación va el paciente en VM parámetros bajos?" → respuesta directa con criterios EVAC-H
- Nivel Analizar: "¿Qué información crítica falta para decidir evacuación parcial vs. total?" → análisis de vacíos de información
- Nivel Evaluar: "Diseña el plan de los primeros 30 minutos. Justifica por qué no evacúas a los Grupo 5." → decisión documentada

**Escenario 2 (Sismo + SMV-H simultáneo):**
- Nivel Aplicar: "Activa el Código SMV. ¿Quién llama al CRUM y qué le dice?" → protocolo paso a paso
- Nivel Analizar: "¿Cómo organizas dos comandos simultáneos sin que colisionen?" → análisis de mando unificado
- Nivel Evaluar: "¿A cuál de los dos eventos asignas el 70% de los binomios médico-enfermería? Justifica." → dilema de recursos escasos

**Escenario 3 (Estampida FIFA):**
- Nivel Aplicar: "¿En qué grado activas el SMV? Verde, Amarillo o Rojo." → criterios de grado de activación
- Nivel Analizar: "10 pacientes llegaron antes de la notificación oficial. ¿Esto es un criterio de activación?" → análisis criterios operacionales
- Nivel Evaluar: "¿Cómo priorizas entre los 20 rojos en paro recuperado y los 40 amarillos que saturan urgencias?" → triage de recursos y dilema ético

---

## 3. ARQUITECTURA GENERAL: DOS PRODUCTOS COMPLEMENTARIOS

### 3.1 Descripción de los dos productos

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ECOSISTEMA DIGITAL CPES-IMSS                      │
│                    Copa Mundial FIFA 2026                            │
├─────────────────────────────┬───────────────────────────────────────┤
│   PRODUCTO A                │   PRODUCTO B                          │
│   CURSO INTERACTIVO MODULAR │   SIMULADOR DE ESCENARIOS HTML5        │
│                             │                                       │
│   • 6 bloques temáticos     │   • 3 escenarios completos            │
│   • Microformatos variados  │   • Plano interactivo del hospital    │
│   • Autoaprendizaje dirigido│   • Decisiones en tiempo real         │
│   • Evaluación formativa    │   • Roles SCI-H jugables              │
│   • 12 semanas de programa  │   • Retroalimentación inteligente     │
│                             │                                       │
│   PARA: Aprendizaje previo  │   PARA: Práctica y evaluación         │
│   al simulacro              │   de competencias                     │
└─────────────────────────────┴───────────────────────────────────────┘
```

### 3.2 Relación pedagógica entre los dos productos

- El **Curso** prepara el conocimiento declarativo y procedimental: qué es EVAC-H, cuáles son los 5 grupos, cuándo se activa el SMV
- El **Simulador** evalúa si ese conocimiento se convierte en competencia bajo presión: ¿puedes clasificar a 8 pacientes simultáneamente con información incompleta en 3 minutos?
- El flujo ideal: completar el bloque relevante del curso → entrar al simulador del escenario correspondiente
- El flujo alternativo (taller presencial): el facilitador proyecta el simulador y el grupo decide colectivamente — exactamente como hicieron con la maqueta física

### 3.3 Principio de portabilidad absoluta

Ambos productos deben ser:
- **Archivos únicos HTML5** sin dependencias externas
- Ejecutables sin servidor, sin internet, sin instalación
- Compatibles con tablet, laptop y proyector (resoluciones 768px en adelante)
- Funcionales en red interna de hospital o en dispositivo local del facilitador
- En idioma español, sin versiones paralelas

---

## 4. PRODUCTO A: CURSO INTERACTIVO MODULAR

### 4.1 Estructura general del curso

El curso se organiza en **7 módulos HTML5** (Módulo 0 diagnóstico + 6 bloques temáticos):

```
MÓDULO 0: DIAGNÓSTICO INICIAL
├── 10 preguntas diagnósticas (2 por guía prioritaria)
├── Retroalimentación por respuesta incorrecta
└── Informe de brechas para el facilitador

MÓDULO 1: EL HOSPITAL QUE RESPONDE — PH-RED + SCI-H
├── ¿Por qué el PH-RED del Nunca Jamás es un problema ahora?
├── La estructura SCI-H: 8 funciones, mando único
└── Mi rol en el SCI-H el día del partido

MÓDULO 2: QUIÉN SALE Y QUIÉN SE QUEDA — EVAC-H
├── Los 5 grupos de evacuación: criterios clínicos exactos
├── Decisiones espaciales: horizontal vs. vertical
└── El paciente con discapacidad: 4 tipos, 4 protocolos

MÓDULO 3: TREINTA HERIDOS EN QUINCE MINUTOS — SMV-H
├── Criterios de activación y grados I, II, III
├── Los 6 pasos del procedimiento operativo
└── Triage START en SMV: diferencias con triage clínico habitual

MÓDULO 4: QUÉ NO PUEDE FALLAR — BCP-H
├── Servicios críticos y tiempos de recuperación
├── OTR: qué es y por qué el Nunca Jamás tiene solo 2 de 5
└── Continuidad bajo ciberataque en día de partido

MÓDULO 5: LA AMENAZA QUE NO SE VE — QBRNE
├── Tipos de agentes: Q-B-R-N-E en contexto FIFA
├── Protocolo de descontaminación: antes de que el paciente entre
└── ALARA y EPP: límites de exposición del personal

MÓDULO 6: EL SIMULACRO DEL DÍA DEL PARTIDO — Integrador
├── Diseñar un ejercicio de gabinete en 30 minutos
├── Rol del facilitador: principios andragógicos
└── Lista de verificación ISH + INGRID-H post-simulacro
```

### 4.2 Microformatos por módulo

Cada módulo contiene exactamente este conjunto mínimo de piezas:

| Tipo de pieza | Cantidad por módulo | Duración/tamaño | Descripción |
|---------------|---------------------|-----------------|-------------|
| **Pantalla de apertura** | 1 | 30 segundos lectura | El dilema del módulo: un problema sin resolver presentado en 2-3 líneas |
| **Video/Audio Pill** | 2-3 | 2:30-3:00 min | Concepto central narrado con apoyo visual mínimo |
| **Cápsula Visual** | 2-3 | 1 pantalla | Tabla, diagrama o algoritmo de decisión interactivo |
| **Preguntas Desafío** | 6-8 | 1-2 min c/u | Escenario del Nunca Jamás + opción múltiple + retroalimentación inmediata |
| **Microescenario** | 1 | 5-7 min | Caso con 3-4 decisiones encadenadas usando el plano del hospital |
| **Tarjeta de Acción** | 2-4 | Referencia | Descargable, imprimible, por rol específico |
| **Verificación de cierre** | 1 | 2-3 min | Caso integrador del módulo + criterio de avance al siguiente |

### 4.3 Especificaciones de las Preguntas Desafío (pieza central)

Las Preguntas Desafío son el motor de aprendizaje del curso. Cada pregunta tiene:

**Estructura de una pregunta desafío:**
```
ENCABEZADO
──────────────────────────────────────────────
[T+XX min] [Día de partido · Nunca Jamás]
Escenario de 3-5 líneas con información incompleta
──────────────────────────────────────────────

PREGUNTA
──────────────────────────────────────────────
¿Cuál es tu primera acción?

OPCIONES (4)
A) [Opción correcta — no obvia]
B) [Error frecuente por traslado de práctica clínica habitual]  
C) [Opción parcialmente correcta — falta un paso crítico]
D) [Opción distractor — plausible pero equivocada en este protocolo]
──────────────────────────────────────────────

RETROALIMENTACIÓN (por opción)
✅ A) Correcto. [Razón técnica 2 líneas]. Guía SMV-H, Paso 2.
❌ B) Esta opción omite la notificación al CVOED. En el Nunca Jamás, 
     sin esa notificación no llega la cadena de apoyo de la RISS.
⚠️ C) Válido pero incompleto. Falta activar la noria de ambulancias 
     simultáneamente. En los primeros 15 min, la secuencia importa.
❌ D) Confunde el triage clínico habitual con el triage START de SMV. 
     En SMV el criterio es "puede sobrevivir con los recursos disponibles", 
     no "más grave primero".
```

**Principios de diseño de las opciones:**
- La opción correcta nunca es la más obvia ni la más "académica"
- Siempre hay al menos un distractor que traslada lógica clínica habitual (plausible en urgencias, incorrecto en SMV/EVAC)
- La retroalimentación de opciones incorrectas es tan larga como la de la correcta — el error enseña más
- Toda retroalimentación cita el documento fuente y la sección específica

### 4.4 Banco completo de preguntas por módulo

#### MÓDULO 0 — Diagnóstico inicial (10 preguntas)

| Código | Guía | Concepto medido | Nivel Bloom |
|--------|------|-----------------|-------------|
| D-01 | PH-RED/SCI-H | ¿Quién activa el plan y en qué condiciones? | Recordar |
| D-02 | PH-RED/SCI-H | ¿Cuál es la primera función que asume el jefe de turno según SCI-H? | Aplicar |
| D-03 | EVAC-H | ¿En qué grupo va un paciente con VM parámetros bajos y vasopresores leves? | Aplicar |
| D-04 | EVAC-H | Hay 3 pacientes Grupo 5. ¿Se evacúan en el primer movimiento? Justifica | Analizar |
| D-05 | SMV-H | ¿Cuál de estas condiciones activa el Código SMV? | Recordar |
| D-06 | SMV-H | Llegan 10 heridos por sus propios medios antes de notificación oficial. ¿Activas el plan? | Aplicar |
| D-07 | BCP-H | ¿Cuántos servicios críticos del Nunca Jamás tienen OTR documentado? | Recordar |
| D-08 | QBRNE | Llega una persona con quemaduras en brazos y mareo. ¿Tu primera acción? | Aplicar |
| D-09 | QBRNE | ¿Dónde estableces la zona de descontaminación en el Nunca Jamás? | Analizar |
| D-10 | SIMULACROS | ¿Qué diferencia hay entre un simulacro de gabinete y uno de campo? | Recordar |

#### MÓDULO 1 — PH-RED + SCI-H (8 preguntas)

| Código | Escenario | Nivel Bloom | Guía |
|--------|-----------|-------------|------|
| PD-M1-01 | Director recibe llamada CRUM: incidente en estadio cercano. ¿Qué activa primero? | Aplicar | PH-RED |
| PD-M1-02 | Hay 3 personas dando instrucciones simultáneas en urgencias. ¿Cuál es el problema SCI-H? | Analizar | SCI-H |
| PD-M1-03 | El jefe de turno nocturno está solo cuando llega la alerta. ¿Su primer paso según PH-RED? | Aplicar | PH-RED |
| PD-M1-04 | El PH-RED tiene 18 meses. No incluye protocolo FIFA. ¿Qué 3 riesgos concretos genera esto? | Analizar | PH-RED |
| PD-M1-05 | Son las 2 AM. El partido terminó hace 1 hora. ¿Cuáles condiciones mantienen el Nunca Jamás en alerta elevada? | Aplicar | PH-RED+SCI-H |
| PD-M1-06 | El área de Logística pide recursos al Puesto de Comando. ¿A quién reporta directamente? | Recordar/Aplicar | SCI-H |
| PD-M1-07 | El hospital activa Código Naranja. ¿Qué 3 acciones inmediatas toma el jefe de Medicina Interna? | Aplicar | SCI-H |
| PD-M1-08 | CVOED llama al Nunca Jamás pidiendo reporte de situación. ¿Quién responde y qué informa? | Aplicar | PH-RED |

#### MÓDULO 2 — EVAC-H (8 preguntas)

| Código | Escenario | Nivel Bloom | Criterio EVAC-H |
|--------|-----------|-------------|-----------------|
| PD-M2-01 | Cama 14: VM parámetros bajos, vasopresores leves (0.1 μg/kg/min). ¿Grupo de evacuación? | Aplicar | Grupo 3 |
| PD-M2-02 | Paciente en silla de ruedas, consciente, sin soporte. 3 días en Medicina Interna. ¿Grupo? | Aplicar | Grupo 2 |
| PD-M2-03 | UCI: 6 pacientes Grupo 4, solo 2 ambulancias disponibles. ¿Qué decides? | Analizar | Priorización recursos |
| PD-M2-04 | Alarma de incendio en piso 3. El ascensor funciona. ¿Qué tipo de evacuación y por qué? | Aplicar | Horizontal antes de vertical |
| PD-M2-05 | Paciente postrasplante hepático, día 2, UCI. ¿Evacuación inmediata o diferida? Justifica. | Analizar | Grupo 5 diferido |
| PD-M2-06 | 4 pacientes con discapacidad motriz no están en el censo de emergencias. ¿Riesgo y acción? | Analizar | INGRID-H + EVAC-H |
| PD-M2-07 | Faltan 10 minutos para las primeras víctimas del estadio. ¿Se puede evacuar urgencias simultáneamente? | Evaluar | Decisión compleja |
| PD-M2-08 | El paciente de cama 8 y su familia se niegan a ser evacuados. ¿Qué hace el personal? | Aplicar | Protocolo + ética |

#### MÓDULO 3 — SMV-H (8 preguntas)

| Código | Escenario | Nivel Bloom | Criterio SMV-H |
|--------|-----------|-------------|----------------|
| PD-M3-01 | CRUM confirma accidente en autopista, 18 heridos, llegan en 20 min. ¿Primera llamada? | Aplicar | Paso 1: notificación |
| PD-M3-02 | Llegan 20 heridos simultáneos sin notificación previa. ¿Esto activa el Código SMV? | Aplicar | Criterio arribo espontáneo |
| PD-M3-03 | ¿En qué grado activas el SMV para el Escenario 3 (120 lesionados, Nunca Jamás)? | Aplicar | Grado II o III según capacidad |
| PD-M3-04 | El director no está. El subdirector administrativo tampoco. ¿Quién declara el Código? | Analizar | Suplente designado |
| PD-M3-05 | ¿Qué haces primero: activar triage externo o suspender cirugías electivas? | Analizar | Secuencia de pasos SMV |
| PD-M3-06 | 20 pacientes rojos llenan urgencias. ¿Dónde van los 40 amarillos? | Aplicar | Áreas de expansión |
| PD-M3-07 | Los medios y familiares rodean el hospital. ¿Quién habla con ellos y qué dice? | Aplicar | Función Información Pública SCI-H |
| PD-M3-08 | 2 horas después, el arribo cesa. ¿Cuándo y cómo desescalas el SMV? | Evaluar | Fase de recuperación |

#### MÓDULOS 4, 5 y 6 — Especificados en sección 7 (ver abajo)

---

## 5. PRODUCTO B: ESCENARIO DE SIMULACIÓN HTML5

### 5.1 Concepto general del simulador

El simulador reproduce digitalmente la **dinámica de maqueta** observada en el taller (fotografías): un plano funcional del Hospital de Nunca Jamás con fichas de pacientes, recursos y roles que el usuario debe mover, asignar y decidir bajo presión de tiempo.

**Lo que el simulador hace que el PPTX no puede:**
- Avanza en tiempo real (el reloj corre)
- Genera consecuencias visibles de cada decisión (si no activaste la noria, 8 heridos esperan en la calle)
- Permite repetir el escenario con parámetros distintos
- Registra las decisiones para retroalimentación o evaluación
- Funciona sin facilitador presente

### 5.2 Los tres escenarios del simulador (derivados del PPTX)

#### ESCENARIO S1: "Sismo en el Nunca Jamás"
**Basado en:** Escenario 1 del PPTX (Evacuación hospitalaria)
**Guías:** EVAC-H + SCI-H + PH-RED
**Duración simulada:** T+0 a T+60 minutos
**Objetivo de aprendizaje:** Aplicar los criterios EVAC-H para clasificar y mover correctamente a los 22 pacientes del Nunca Jamás activos en ese turno, tomando decisiones de evacuación parcial o total en 20 minutos (tiempo real del usuario).

**Parámetros del escenario:**
- Hora de inicio: 10:15 h (turno matutino, máxima ocupación)
- Sismo 7.4, epicentro regional
- Daño estructural en torre de hospitalización
- Falla eléctrica intermitente (planta de emergencia funcional)
- Grietas reportadas en UCI y quirófanos
- 4 pacientes en VM: 2 con vasopresores (grupos 4 y 5), 2 en parámetros bajos (grupo 3)
- 1 cirugía en curso (paciente con tórax abierto)
- Protección Civil solicita valoración estructural — réplicas esperadas
- 3 pacientes con discapacidad motriz en piso 2 (no registrados en el censo)

**Inyectores activos en este escenario:**

| T+ | Canal | Mensaje | Respuesta esperada |
|----|-------|---------|-------------------|
| T+0 | Alarma visual + sonora | "Alerta sísmica. Movimiento detectado." | Activar protocolo EVAC-H |
| T+3 | Radio interno | "Torre de hospitalización: grieta visible en columna A-4. Piso 2." | Iniciar triage de evacuación |
| T+7 | Llamada directa | "Quirófano 1: tenemos un tórax abierto. ¿Evacuamos?" | Protocolo control de daños, no mover |
| T+12 | Mensaje escrito | "Protección Civil estima réplica de 5.8 en 20-30 min." | Acelerar decisión total vs. parcial |
| T+15 | Arribo físico | "Llegan 3 familiares gritando que sus pacientes están atrapados en piso 3." | Control de accesos, Función Seguridad |
| T+20 | Radio externo | "CVOED solicita reporte de estado en 5 minutos." | Función Enlace / Información Pública |
| T+30 | Radio interno | "La planta de emergencia presenta falla. Estamos en 20 min de autonomía de baterías." | Priorizar Grupo 4 y 5 para traslado |

**Decisiones críticas del usuario:**
1. ¿Evacuas TOTAL o PARCIAL? Criterios: daño estructural + tipo de amenaza
2. ¿En qué grupo clasificas a cada uno de los 8 pacientes de UCI?
3. ¿El paciente en cirugía (tórax abierto) es Grupo 4 o Grupo 5?
4. ¿Activas la noria de ambulancias ahora o esperas confirmación de la réplica?
5. ¿Cómo evacúas a los 3 pacientes con discapacidad no registrados?
6. ¿Quién responde al CVOED y qué información le das?

---

#### ESCENARIO S2: "Explosión + Réplica en Día de Partido"
**Basado en:** Escenario 2 del PPTX (EVAC-H + SMV-H simultáneo)
**Guías:** EVAC-H + SMV-H + SCI-H + BCP-H
**Duración simulada:** T+0 a T+90 minutos
**Objetivo de aprendizaje:** Coordinar simultáneamente la evacuación de urgencias y la activación del SMV sin colisionar los dos comandos, tomando decisiones de expansión de capacidad en los primeros 30 minutos.

**Parámetros del escenario:**
- Explosión por fuga de gas en mercado a 500 m del hospital
- 60 víctimas estimadas, 20 críticos confirmados por CRUM
- Réplica sísmica simultánea: cierre temporal de urgencias por riesgo estructural
- 20 pacientes graves arriban en los primeros 20 minutos
- Hospital en 85% de ocupación (el hospital está casi lleno — es día de partido)

**Inyectores activos:**

| T+ | Canal | Mensaje | Función SCI-H activada |
|----|-------|---------|----------------------|
| T+0 | Llamada CRUM | "Explosión en Mercado Central. 60 víctimas estimadas. Primeros heridos en 15 min." | Mando: declarar Código SMV |
| T+5 | Radio interno | "Urgencias reporta fisura en muro sur. Protección Civil pide cierre temporal." | Operaciones: evacuar urgencias |
| T+8 | Arribo | "Llegan 5 pacientes por sus propios medios. Ninguno descontaminado. Sin triage." | Operaciones: activar triage externo inmediato |
| T+12 | Llamada interna | "Cirugía: ¿cancelamos las 3 intervenciones programadas del turno?" | Mando: suspender electivos |
| T+18 | Radio externo | "CRUM confirma: hay posible contaminación por materiales de limpieza. No definido." | Seguridad: protocolo QBRNE parcial |
| T+22 | Llamada | "UCI: ¿podemos recibir 2 rojos más? Estamos a capacidad máxima." | Logística: expansión y referencia RISS |
| T+35 | Mensaje escrito | "Medios en puerta principal. Familias de heridos buscan información." | Información Pública: vocero único |
| T+45 | Radio CRUM | "Arribo de víctimas continuará 30 minutos más. Estiman 20 adicionales." | Planificación: PAI siguiente período |

**Decisiones críticas y dilemas del usuario:**
1. Comando unificado: ¿un solo CI para EVAC + SMV o dos comandos separados?
2. ¿Cuándo suspendes las cirugías electivas y cómo priorizas las de urgencia?
3. ¿Dónde pones el triage externo si urgencias está cerrada por riesgo estructural?
4. ¿Cómo asignas los binomios médico-enfermería entre evacuados críticos y heridos rojos entrantes?
5. ¿La posible contaminación química activa el protocolo QBRNE o esperás confirmación?
6. ¿Cuándo y a qué unidades de la RISS referencias pacientes amarillos?

---

#### ESCENARIO S3: "Cuartos de Final en el Nunca Jamás"
**Basado en:** Escenario 3 del PPTX (SMV máximo — estampida FIFA)
**Guías:** SMV-H + SCI-H + QBRNE + INGRID-H
**Duración simulada:** T+0 a T+120 minutos
**Objetivo de aprendizaje:** Activar y escalar correctamente el Código SMV ante un evento de máxima magnitud, con toma de decisiones complejas sobre expansión de capacidad, triage, comunicación externa y gestión de grupos vulnerables.

**Parámetros del escenario:**
- Partido de cuartos de final: >70,000 asistentes en estadio
- Rumor de explosión en puerta principal → pánico → estampida
- Caída en cascada y compresión masiva en escaleras externas
- T+15: >120 lesionados estimados
- Primeros 10 minutos: llegan 10 pacientes por medios propios antes de notificación
- CRUM confirma activación a T+12
- Composición de víctimas: 20 críticos (asfixia compresión, TCE, politrauma, paros recuperados) + 40 moderados (fracturas, trauma torácico) + 60 leves (contusiones, crisis ansiedad)
- 5-10 fallecidos estimados en sitio
- Medios de comunicación y familiares en exterior del hospital
- Rumor no confirmado de explosivo en estadio → posible QBRNE

**Inyectores activos:**

| T+ | Canal | Mensaje | Dilema pedagógico |
|----|-------|---------|------------------|
| T+0 | Llamada anónima | "Escuché que hubo explosión en el estadio. Hay muertos." | ¿Activas el plan sin confirmación oficial? |
| T+10 | Arribo físico | "Llegan 10 lesionados por sus propios medios. Nadie los notificó." | Criterio de activación por arribo espontáneo |
| T+12 | CRUM oficial | "Confirmamos SMV en estadio. 120+ víctimas. Primeros 30 llegarán en 8 min." | Grado de activación: ¿II o III? |
| T+15 | Radio interno | "Urgencias al 100%. 5 pacientes esperando camilla en acceso." | Expansión inmediata o filtro en triage |
| T+18 | Información Pública | "Cadena de televisión solicita declaración. Hay confusión sobre qué pasó." | Vocero único: ¿qué dice? ¿cuándo? |
| T+20 | Llamada | "El rumor del explosivo persiste. Un paciente llegó con quemaduras en manos." | ¿Activas QBRNE con evidencia incompleta? |
| T+25 | CRUM | "Confirman: no hay explosivo. Fue solo pánico masivo." | Desescalar QBRNE: ¿cuándo y cómo? |
| T+30 | Radio interno | "UCI llena. 3 paros recuperados necesitan UCI. No hay camas." | Dilema de asignación con recursos finitos |
| T+45 | Llamada RISS | "Hospital X puede recibir 8 amarillos. ¿Los mandamos?" | Referencia: ¿cuándo es el momento correcto? |
| T+60 | Radio CRUM | "Arribo disminuye. Estimamos 10-15 más en 30 min, luego cese." | ¿Cuándo inicias el desescalamiento? |

**Decisiones críticas y dilemas del usuario:**
1. ¿Activas el Código SMV antes de la confirmación oficial (basado en arribo espontáneo)?
2. ¿Grado I, II o III para este escenario? ¿Qué cambia entre grados?
3. ¿Cómo priorizas entre los 20 rojos cuando UCI ya está llena?
4. ¿Activas protocolo QBRNE por el rumor de explosivo? ¿Cuál es el umbral?
5. ¿Qué le dice el vocero oficial a los medios? (El rumor puede causar pánico secundario)
6. ¿Cuándo referencias a la RISS? ¿Qué pacientes van primero?
7. ¿Cómo atiendes a los 60 verdes (crisis de ansiedad) sin consumir recursos de triaje rojo?

---

### 5.3 Arquitectura del plano interactivo del hospital

El plano es el **corazón del simulador**. Basado en el croquis del taller, se representa como un mapa funcional (no arquitectónico) con las siguientes áreas clickeables:

```
┌────────────────────────────────────────────────────────────┐
│  ACCESO VEHICULAR (noria de ambulancias)                    │
├──────────────┬─────────────────────┬───────────────────────┤
│  TRIAGE      │   URGENCIAS         │  ÁREA DE EXPANSIÓN    │
│  EXTERNO     │   (39 camas)        │  (auditorios/aulas)   │
├──────────────┼─────────────────────┼───────────────────────┤
│  ÁREA NEGRA  │   UCI (8 camas)     │  QUIRÓFANOS           │
│  (cadáveres) │                     │                       │
├──────────────┼─────────────────────┼───────────────────────┤
│  PISO 1:     │   MEDICINA INTERNA  │  ÁREA DECONTAMINACIÓN │
│  CIRUGÍA     │   (100 camas)       │  (exterior / acceso)  │
├──────────────┼─────────────────────┼───────────────────────┤
│  PISO 2:     │   PEDIATRÍA         │  PUESTO DE COMANDO    │
│  CIRUGÍA     │   (30 camas)        │  (COE)                │
├──────────────┴─────────────────────┴───────────────────────┤
│  ZONA SEGURA EXTERNA (estacionamiento / área verde)         │
└────────────────────────────────────────────────────────────┘
```

**Cada área del plano tiene:**
- Estado actual (capacidad disponible / ocupada / cerrada)
- Icono de pacientes activos con su grupo EVAC-H o código de triage
- Indicador de recursos disponibles (ambulancias, ventiladores portátiles, personal)
- Alerta visual cuando supera capacidad crítica
- Tooltip con información relevante al hacer click

**Fichas de pacientes en el plano:**
Cada paciente activo en el escenario tiene una ficha accesible que muestra:
- Datos clínicos relevantes para la decisión (no el expediente completo — solo lo necesario)
- Grupo EVAC-H asignado (si ya fue clasificado por el usuario)
- Estado actual (estable / deteriorando / crítico)
- Necesidades especiales (discapacidad, idioma, edad)

---

## 6. INTEGRACIÓN TÉCNICA Y FLUJO DE USUARIO

### 6.1 Flujo de usuario para personal hospitalario (uso autónomo)

```
INICIO
   │
   ▼
┌─────────────────────────────────────────────────────┐
│  PANTALLA DE BIENVENIDA                              │
│  "Bienvenido al sistema de preparación FIFA 2026"    │
│  IMSS · Hospital de Nunca Jamás                      │
│  [Selecciona tu rol] [Selecciona tu turno]           │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│  MÓDULO 0: DIAGNÓSTICO (10 preguntas)                │
│  → Genera tu perfil de brechas personales            │
│  → Muestra qué módulos son prioridad para ti         │
└──────────────────────────┬──────────────────────────┘
                           │
                    ┌──────┴──────┐
                    ▼             ▼
              MÓDULOS           SIMULADOR
              1 a 6             S1, S2, S3
              │                  │
              └──────┬───────────┘
                     ▼
            EVALUACIÓN FINAL
            + TARJETA DE ACCIÓN
              DE TU ROL
```

### 6.2 Flujo de usuario para facilitadores (uso en taller)

```
TALLER PRESENCIAL
   │
   ▼
┌─────────────────────────────────────────────────────┐
│  MODO FACILITADOR (pantalla proyectada)              │
│  → Deshabilita cronómetro individual                 │
│  → Pausa entre inyectores para discusión grupal      │
│  → Muestra indicadores de debate: "¿Qué haría tu     │
│    equipo?"                                          │
│  → Registra decisiones del grupo (no individuo)      │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│  INFORME POST-SESIÓN (hot wash digital)              │
│  → ¿Qué se decidió bien? ¿Qué falló?                 │
│  → Lista de verificación de criterios CPES            │
│  → Formato de acción correctiva con responsable       │
└─────────────────────────────────────────────────────┘
```

### 6.3 Sistema de guardado y continuidad

**Restricción técnica del entorno IMSS:** Los sistemas hospitalarios con frecuencia bloquean localStorage o cookies. El diseño debe ser resiliente:

- **Opción A (preferida):** El usuario descarga su "código de progreso" al final de cada sesión — un string alfanumérico de 12 caracteres que puede ingresar en la siguiente sesión para continuar
- **Opción B (taller):** El facilitador proyecta un QR al inicio que lleva al escenario del día — no requiere historial
- **Opción C (evaluación):** El evaluador puede generar un PDF del desempeño al final de cualquier sesión completa

---

## 7. ESPECIFICACIONES DE CONTENIDO POR MÓDULO

### 7.1 MÓDULO 4 — BCP-H: "Qué No Puede Fallar"

**Pregunta ancla:** *El sistema está caído. El almacén tiene déficit del 56%. ¿Cuáles servicios protejo primero y por cuánto tiempo aguantan?*

**Contenidos:**
- Audio Pill 1: "Los servicios críticos no son todos los servicios" — qué es un OTR y cómo se calcula
- Audio Pill 2: "Ciberseguridad en día de partido" — ataques a sistemas clínicos como amenaza QBRNE híbrida
- Cápsula Visual 1: Tabla de servicios críticos del Nunca Jamás vs. tiempos de tolerancia máxima (OTR)
- Cápsula Visual 2: Diagrama de dependencias: ¿qué servicios colapsarán si falla la red eléctrica?
- Preguntas Desafío (8): Escenarios de falla parcial de sistemas y decisiones de continuidad
- Microescenario: "Ciberataque en día de semifinal" — el expediente electrónico no responde

**Preguntas Desafío M4:**

| Código | Escenario | Nivel Bloom |
|--------|-----------|-------------|
| PD-M4-01 | El sistema de laboratorio falla. UCI tiene 3 pacientes críticos. ¿Protocolo BCP? | Aplicar |
| PD-M4-02 | La farmacia reporta desabasto de vasopresores. ¿Cuál es el OTR de UCI? | Recordar/Aplicar |
| PD-M4-03 | El servidor del expediente electrónico fue hackeado. ¿Activas el BCP-H o esperas? | Analizar |
| PD-M4-04 | Falla eléctrica. La planta tiene 20 min de autonomía. ¿Qué desconectas primero? | Analizar |
| PD-M4-05 | 2 de 5 servicios tienen OTR documentado. ¿Cuáles 3 servicios faltantes ponen en mayor riesgo al hospital? | Evaluar |
| PD-M4-06 | El banco de sangre tiene reserva para 4 horas. Hay 8 pacientes en espera de cirugía. ¿Qué decides? | Evaluar |
| PD-M4-07 | El proveedor de gases medicinales no puede entregar en 48 h. ¿Cuál es tu protocolo? | Aplicar |
| PD-M4-08 | A las 72 h del SMV, ¿cuáles servicios deben estar operativos primero para retomar la normalidad? | Analizar |

---

### 7.2 MÓDULO 5 — QBRNE: "La Amenaza Que No Se Ve"

**Pregunta ancla:** *Llega un paciente con quemaduras y mareo que dice "no sé qué me pasó". ¿Qué haces antes de que entre al hospital?*

**Contenidos:**
- Audio Pill 1: "Q-B-R-N-E: cuál es cuál y por qué importa en la Copa" — tipos de agentes y escenarios FIFA
- Audio Pill 2: "La zona de descontaminación que el Nunca Jamás no tiene" — por qué se necesita antes del primer paciente
- Audio Pill 3: "ALARA y los límites de exposición" — protección del personal: ¿hasta dónde entras?
- Cápsula Visual 1: Zonas caliente/tibia/fría — qué pasa en cada zona y quién puede estar ahí
- Cápsula Visual 2: Algoritmo de descontaminación — secuencia paso a paso antes de ingreso
- Cápsula Visual 3: EPP por tipo de agente — qué nivel de protección para cada escenario
- Preguntas Desafío (8)
- Microescenario: "Amoniaco a 2 km del Nunca Jamás" — el inyector del CRUM llega incompleto

**Preguntas Desafío M5:**

| Código | Escenario | Nivel Bloom |
|--------|-----------|-------------|
| PD-M5-01 | Llega un paciente con síntomas de miosis, broncospasmo y olor a almendras. ¿Agente probable y primera acción? | Aplicar |
| PD-M5-02 | El paciente QBRNE llega por sus propios medios y ya está en urgencias. ¿Qué haces? | Analizar |
| PD-M5-03 | No hay zona de descontaminación establecida en el Nunca Jamás. ¿Dónde la improvisas? | Evaluar |
| PD-M5-04 | El CRUM reporta "posible" contaminación química. ¿Activas el protocolo completo o esperas confirmación? | Analizar |
| PD-M5-05 | ¿Qué nivel de EPP usa el personal que recibe al paciente Q en la zona tibia? | Aplicar |
| PD-M5-06 | Un enfermero quiere atender al paciente contaminado sin EPP porque "está grave y necesita ayuda". ¿Qué respondes? | Evaluar |
| PD-M5-07 | La CNSNS llama porque detectaron señal radiológica cerca del estadio. ¿Primera acción del hospital? | Aplicar |
| PD-M5-08 | ¿Cuándo puedes declarar que el riesgo QBRNE ha terminado y los protocolos de barrera pueden bajar? | Analizar |

---

### 7.3 MÓDULO 6 — Integrador + Simulacros: "El Día del Partido"

**Pregunta ancla:** *¿Puedes diseñar en 30 minutos un ejercicio que pruebe realmente si tu hospital está listo?*

**Contenidos:**
- Audio Pill 1: "Simulacro de gabinete vs. de campo: cuándo usar cada uno" — con ejemplo del Nunca Jamás
- Cápsula Visual 1: Mapa de elementos de un simulacro efectivo (los 7 componentes de la Guía SIMULACROS)
- Cápsula Visual 2: Lista de verificación ISH — módulo gestión de emergencias — ¿en qué puntaje está el Nunca Jamás?
- Cápsula Visual 3: 5 componentes INGRID-H — ¿qué del 35% de pacientes con discapacidad está cubierto?
- Preguntas Desafío (6)
- **Microescenario especial:** "Diseña el simulacro de los cuartos de final" — el usuario construye el escenario, define los inyectores y los criterios de evaluación (nivel Crear de Bloom)

---

## 8. ESPECIFICACIONES DEL SIMULADOR

### 8.1 Arquitectura de interfaz del simulador

**Pantalla de simulación — Zonas funcionales:**

```
┌────────────────────────────────────────────────────────────────────┐
│  BARRA SUPERIOR                                                     │
│  [Escenario: Cuartos de Final] [T+18 min] [Código: SMV Grado II]  │
│  [Pacientes tratados: 12] [Recursos disponibles: 4 UCI / 0 libres] │
├──────────────────────────────────┬─────────────────────────────────┤
│                                  │  PANEL DE INYECTORES            │
│  PLANO INTERACTIVO               │  ┌────────────────────────────┐ │
│  DEL HOSPITAL                    │  │ T+18 · CRUM (radio)        │ │
│  (croquis funcional clickeable)  │  │ "Hay rumor de explosivo en │ │
│                                  │  │  estadio. No confirmado."  │ │
│  [fichas de pacientes]           │  │ [¿Activas QBRNE?] [No aún] │ │
│  [recursos disponibles]          │  └────────────────────────────┘ │
│  [áreas coloreadas por estado]   │                                  │
│                                  │  PANEL DE DECISIONES ACTIVAS    │
│                                  │  □ Triage externo activo         │
│                                  │  □ Noria de ambulancias activa   │
│                                  │  □ Cirugías electivas suspendidas│
│                                  │  □ CVOED notificado              │
│                                  │  □ Vocero designado              │
├──────────────────────────────────┴─────────────────────────────────┤
│  BARRA DE ACCIONES RÁPIDAS                                          │
│  [Declarar SMV Grado] [Suspender electivos] [Llamar CRUM]          │
│  [Activar área expansión] [Asignar binomio] [Referir RISS]         │
└────────────────────────────────────────────────────────────────────┘
```

### 8.2 Sistema de consecuencias visibles

El simulador muestra en tiempo real las consecuencias de las decisiones del usuario:

| Decisión omitida | Consecuencia visible en simulador | Momento de aparición |
|------------------|-----------------------------------|---------------------|
| No activar triage externo | 8 pacientes acumulados en acceso vehicular sin clasificar | T+8 |
| No suspender cirugías electivas | Mensaje: "3 quirófanos ocupados con electivos, 0 disponibles para trauma rojo" | T+15 |
| No notificar al CVOED | A T+20, CVOED llama furioso solicitando reporte — pérdida de tiempo | T+20 |
| No activar noria de ambulancias | Colisión de vehículos en acceso. 6 min de retraso en próximos arribes | T+25 |
| No designar vocero | Cadena de televisión entra al hospital. Personal entrevistado da información contradictoria | T+30 |
| No activar área de expansión | "Urgencias colapsada. Pacientes amarillos sin atención 45 min." | T+35 |
| Activar QBRNE sin criterio | "Protocolo QBRNE activo. 40% del personal en EPP completo. UCI sin atención 12 min." | Inmediato |

### 8.3 Sistema de retroalimentación inteligente post-escenario

Al terminar cada escenario (o si el tiempo se agota), el simulador genera automáticamente:

**Reporte de desempeño:**
```
INFORME DE DESEMPEÑO — ESCENARIO S3
Hospital de Nunca Jamás · Copa Mundial FIFA 2026
────────────────────────────────────────────────

DECISIONES TOMADAS (15 de 22 disponibles)

✅ CORRECTO (9 decisiones)
  • Declaraste Código SMV antes de T+15 min ✓
  • Grado de activación correcto: Grado III ✓
  • Triage externo activado en T+8 ✓
  [...]

⚠️ PARCIAL (3 decisiones)
  • Suspendiste electivos en T+22 (2 min tarde — 
    con 2 min más de adelanto habrías tenido 
    1 quirófano libre para el paro recuperado #3) ⚠️

❌ OMITIDO (7 decisiones críticas)
  • No designaste vocero oficial. Consecuencia:
    información contradictoria en medios a T+30.
    Guía SMV-H establece: "Designar vocero único 
    preferentemente en los primeros 15 minutos."
  [...]

CRITERIOS CPES CUMPLIDOS: 12/18
CRITERIOS CRÍTICOS OMITIDOS: 3

SIGUIENTES PASOS RECOMENDADOS:
→ Revisa Audio Pill AP-M3-03: "El vocero en SMV"
→ Practica Escenario S3 variante B (más víctimas, menos tiempo)
→ Descarga Tarjeta de Acción para tu rol
```

### 8.4 Variantes de dificultad por escenario

Cada escenario tiene **tres variantes** configurables:

| Variante | Parámetro modificado | Para quién |
|----------|---------------------|------------|
| **A — Estándar** | Parámetros del PPTX base | Personal que completó el bloque temático |
| **B — Escalado** | +20 víctimas, -2 ambulancias, falla eléctrica añadida | Personal de turno de mando |
| **C — Nocturno** | Mismo escenario a las 3 AM, personal reducido 40%, director no está | Jefes de turno nocturno |

La variante Nocturna (C) fue diseñada específicamente para cubrir la brecha documentada: el personal de turno nocturno del Nunca Jamás no ha recibido capacitación SMV en el último año.

---

## 9. GAMIFICACIÓN Y EVALUACIÓN

### 9.1 Sistema de logros (no punitivo)

El sistema de gamificación es motivacional, no punitivo. No hay "game over":

| Logro | Criterio | Cómo se muestra |
|-------|----------|-----------------|
| ⚡ Respuesta rápida | Activaste el Código SMV antes de T+10 | Badge en perfil |
| 🧭 Mando claro | Usaste el SCI-H sin colisión de comandos | Badge en perfil |
| 👁️ Nadie atrás | Registraste y evacuaste a los 3 pacientes con discapacidad no registrados | Badge especial |
| 🔬 Protocolo QBRNE | Estableciste zona de descontaminación antes del primer paciente | Badge en perfil |
| 📋 Decisión documentada | Documentaste tu decisión sobre un paciente Grupo 5 | Badge ético |
| 🏥 Hospital en pie | Completaste el escenario sin colapso de UCI | Badge difícil |
| 🌙 Turno nocturno | Completaste la variante C solo | Badge especial |

### 9.2 Métricas de evaluación formativa (para el facilitador)

El modo facilitador puede ver en tiempo real o al final de la sesión:

**Dashboard de grupo:**
```
SESIÓN: Taller Facilitadores · 19 Feb 2026
Participantes: 24 · Escenario: S3 Cuartos de Final

DECISIONES CRÍTICAS — PORCENTAJE DEL GRUPO QUE LAS TOMÓ
──────────────────────────────────────────────────────
Declaró Código SMV                        ████████ 95%
Grado correcto (III vs II)                █████    58%
Triage externo antes de T+10             ███████  82%
Designó vocero oficial                   ██       24%  ← BRECHA
Activó QBRNE con evidencia incompleta    █████    61%  ← SOBREACTIVACIÓN
Documentó decisión Grupo 5               █        12%  ← BRECHA
──────────────────────────────────────────────────────

RECOMENDACIÓN AUTOMÁTICA:
→ Hot wash de 10 min sobre: vocero oficial, criterio QBRNE, ética Grupo 5
```

### 9.3 Sistema de evaluación sumativa (acreditación)

Para unidades que requieren evidencia de capacitación:

- **Evaluación sumativa:** Completar los 6 módulos + pasar la verificación de cierre de cada uno con ≥75% de respuestas correctas
- **Evidencia de simulacro:** Completar al menos un escenario (S1, S2 o S3) en cualquier variante
- **Certificado de participación:** PDF generado automáticamente con datos del usuario, módulos completados, fecha y nivel de desempeño
- **No hay repetición forzada:** Si falla un módulo, el usuario recibe retroalimentación y puede avanzar — el aprendizaje no se bloquea

---

## 10. DISEÑO VISUAL E IDENTIDAD IMSS

### 10.1 Sistema de color

| Uso | Color | Hex | Aplicación |
|-----|-------|-----|------------|
| Color primario institucional | Guinda IMSS | `#691C32` | Header, títulos principales, botones primarios |
| Color secundario | Verde IMSS | `#006657` | Elementos correctos, confirmaciones, progreso |
| Color acento | Dorado IMSS | `#BC955C` | Énfasis especial, logros, destacados |
| Fondo principal | Blanco neutro | `#FAFAFA` | Fondo de contenidos |
| Texto principal | Gris oscuro | `#1A1A1A` | Cuerpo de texto |
| Alerta crítica | Rojo emergencia | `#CC0000` | Inyectores críticos, alertas de tiempo |
| Triage rojo | Rojo SMV | `#D32F2F` | Pacientes rojos en el plano |
| Triage amarillo | Amarillo SMV | `#F9A825` | Pacientes amarillos en el plano |
| Triage verde | Verde triage | `#388E3C` | Pacientes verdes en el plano |
| Triage negro | Negro área | `#212121` | Área de fallecidos |

### 10.2 Tipografía

- **IBM Plex Sans** — cuerpo de texto, instrucciones, retroalimentación (legibilidad en pantalla)
- **Bebas Neue** — títulos de módulos, nombres de escenarios, encabezados de inyectores
- Tamaño mínimo de fuente: 16px para contenido principal (legibilidad en tablet)
- Sin fuentes script ni serif en elementos de interfaz operativa

### 10.3 Componentes de interfaz críticos

**Inyector de simulacro** (debe comunicar urgencia sin ser agresivo):
```
╔══════════════════════════════════════════════════════════╗
║  📻 T+20 MIN · RADIO CRUM                                ║
║                                                          ║
║  "Viento en dirección noreste. Primeras víctimas         ║
║  con signos de irritación ocular y disnea."              ║
║                                                          ║
║  [Activar QBRNE]    [Esperar más información]            ║
║  [Notificar CNSNS]  [Ver protocolo QBRNE]                ║
╚══════════════════════════════════════════════════════════╝
```

**Tarjeta de paciente en plano** (clic en ficha del plano):
```
┌─────────────────────────────────────┐
│  PACIENTE · CAMA UCI-3              │
│  VM parámetros bajos · FiO2 0.45    │
│  Vasopresores: 0.08 μg/kg/min       │
│  Discapacidad: motriz (silla de r.) │
│  Censo emergencias: ❌ NO registrado │
│                                     │
│  Grupo EVAC-H: [____?____]          │
│  [Clasificar]   [Ver criterios]     │
└─────────────────────────────────────┘
```

---

## 11. ARQUITECTURA TÉCNICA HTML5

### 11.1 Principios de arquitectura

- **Un archivo por producto:** `curso-interactivo-cpes.html` y `simulador-nunca-jamas.html`
- **Sin dependencias externas:** Todo CSS, JS y recursos embebidos en el HTML
- **Sin servidor ni backend:** Toda la lógica corre en el navegador del cliente
- **Sin SQLite-WASM ni IndexedDB:** El guardado de progreso usa el sistema de código alfanumérico (evita restricciones de red hospitalaria)
- **Compatible con Chromium 90+, Firefox 88+, Safari 14+:** Navegadores estándar del ecosistema IMSS

### 11.2 Estructura de datos del simulador (JSON embebido)

```javascript
// Estructura de un escenario
const escenario = {
  id: "S3",
  titulo: "Cuartos de Final en el Nunca Jamás",
  duracion_minutos: 120,
  guias: ["SMV-H", "SCI-H", "QBRNE", "INGRID-H"],
  
  estado_inicial: {
    ocupacion: {
      medicina_interna: { camas: 100, ocupadas: 92 },
      cirugia: { camas: 90, ocupadas: 78 },
      uci: { camas: 8, ocupadas: 7 },
      urgencias: { camas: 39, ocupadas: 35 }
    },
    recursos: {
      ambulancias: 2,
      ventiladores_portatiles: 1,
      personal_disponible: { medicos: 4, enfermeras: 8, administrativos: 2 }
    },
    alertas_activas: ["SMV_potencial"],
    codigo_smv: null
  },
  
  inyectores: [
    {
      t_plus: 0,
      canal: "llamada_telefonica",
      emisor: "CRUM",
      texto: "Confirmamos SMV en estadio. 120+ víctimas. Primeros 30 llegarán en 8 min.",
      respuesta_esperada: ["declarar_smv", "activar_sci_h"],
      consecuencia_si_omite: {
        t_plus: 15,
        evento: "colapso_urgencias",
        descripcion: "Sin declaratoria de SMV, no se suspendieron electivos. Urgencias colapsada."
      }
    }
    // ... más inyectores
  ],
  
  pacientes: [
    {
      id: "P001",
      ubicacion_inicial: "UCI-3",
      datos_clinicos: {
        vm: true, 
        parametros_vm: "bajos",
        vasopresores: true,
        dosis_vasopresores: "0.08 ug/kg/min",
        autonomia_movimiento: false,
        discapacidad: "motriz",
        registrado_censo_emergencias: false
      },
      grupo_evach_correcto: 3,
      visible_en_plano: true
    }
    // ... más pacientes
  ],
  
  decisiones_disponibles: [
    {
      id: "declarar_smv",
      etiqueta: "Declarar Código SMV",
      requiere_t_plus: 0,
      ventana_optima: [0, 15],
      consecuencia_tardia: "Por cada 5 min de retraso: -1 área de expansión habilitada"
    }
    // ... más decisiones
  ],
  
  criterios_evaluacion: [
    {
      id: "CE-01",
      guia: "SMV-H",
      descripcion: "Declarar Código SMV antes de T+15",
      peso: 2,
      verificacion: (estado) => estado.codigo_smv !== null && estado.t_actual <= 15
    }
    // ... más criterios
  ]
}
```

### 11.3 Módulos JavaScript del simulador

```javascript
// Motor principal del simulador
class SimuladorNuncaJamas {
  constructor(escenario, modo) { ... }
  
  iniciar() { ... }              // Arranca el reloj y el escenario
  procesarInyector(t_plus) { ... } // Muestra inyector y espera respuesta
  tomarDecision(decision_id) { ... } // Registra decisión y actualiza estado
  actualizarPlano() { ... }       // Redibuja el plano con nuevo estado
  calcularConsecuencias() { ... } // Aplica lógica de consecuencias diferidas
  generarInforme() { ... }        // Produce el reporte de desempeño
  
  // Modo facilitador
  pausar() { ... }
  avanzarAInyector(n) { ... }
  mostrarRespuestasGrupo() { ... }
}
```

### 11.4 Sistema de renderizado del plano

El plano del hospital se renderiza en **SVG** (no canvas) para:
- Escalabilidad perfecta en cualquier pantalla
- Accesibilidad nativa (alt text por área)
- Interactividad simple con event listeners
- Fácil actualización de colores de estado sin redibujado completo

Cada área del plano es un `<g>` SVG con:
- `data-area-id`: identificador para lógica JS
- `data-estado`: vacío/normal/lleno/cerrado/critico
- Clase CSS que determina el color del relleno según estado

---

## 12. PLAN DE PRODUCCIÓN

### 12.1 Priorización de producción

El criterio de priorización es: **qué necesita estar listo antes del primer partido FIFA**.

| Prioridad | Entregable | Justificación | Plazo estimado |
|-----------|-----------|---------------|----------------|
| **P0 — Crítico** | Simulador S3 (Escenario Cuartos de Final) | El escenario más representativo de la amenaza FIFA real | Semana 1-2 |
| **P0 — Crítico** | Módulo 3 (SMV-H) completo | La guía de mayor brecha en el turno nocturno | Semana 1-2 |
| **P1 — Alta** | Módulo 0 (Diagnóstico) completo | Necesario para medir brechas y priorizar producción siguiente | Semana 2 |
| **P1 — Alta** | Simulador S1 (EVAC-H) | Segunda amenaza más probable en día de partido | Semana 3 |
| **P1 — Alta** | Módulo 2 (EVAC-H) completo | Complemento indispensable al simulador S1 | Semana 3 |
| **P2 — Media** | Simulador S2 (EVAC+SMV) | Escenario más complejo — para personal de mando | Semana 4 |
| **P2 — Media** | Módulos 1, 4, 5 (PH-RED, BCP, QBRNE) | Bloques necesarios pero con menos brecha documentada | Semana 4-6 |
| **P3 — Normal** | Módulo 6 (Integrador) | Cierre del programa | Semana 6-8 |
| **P3 — Normal** | Variantes B y C de todos los escenarios | Escalado de complejidad | Semana 8-10 |

### 12.2 Hitos de producción

```
SEMANA 1 ────────────────────────────────────────────────
  □ Prototipo funcional del plano SVG del Nunca Jamás
  □ Motor de inyectores operativo (sin escenario completo)
  □ Módulo 0 (diagnóstico) — versión beta
  □ Banco de 24 preguntas desafío (M3 + M2 completos)

SEMANA 2 ────────────────────────────────────────────────
  □ Simulador S3 completo — versión beta
  □ Módulo 3 (SMV-H) completo con todas las piezas
  □ Prueba de usuario con facilitadores (feedback 48h)

SEMANA 3 ────────────────────────────────────────────────
  □ Simulador S1 completo
  □ Módulo 2 (EVAC-H) completo
  □ Revisión técnica de criterios clínicos EVAC-H (validación médica)

SEMANA 4 ────────────────────────────────────────────────
  □ Simulador S2 completo
  □ Módulos 1 y 4 completos
  □ Primera versión distribuible (USB / red interna)

SEMANAS 5-6 ─────────────────────────────────────────────
  □ Módulos 5 y 6 completos
  □ Sistema de informe post-escenario
  □ Modo facilitador completo

SEMANAS 7-10 ────────────────────────────────────────────
  □ Variantes B (escalado) de los 3 escenarios
  □ Variantes C (nocturno) de los 3 escenarios
  □ Dashboard de métricas para facilitadores
  □ Sistema de certificado PDF

ANTES DEL PRIMER PARTIDO FIFA ───────────────────────────
  □ Versión distribuible final en USB y red interna
  □ Manual del facilitador (1 página por escenario)
  □ QR de acceso a los escenarios en servicios críticos
```

### 12.3 Equipo requerido

| Rol | Responsabilidades en este proyecto | Horas estimadas |
|-----|-----------------------------------|-----------------|
| Diseñador instruccional (Kristhian) | Validación pedagógica, contenido técnico, preguntas desafío, retroalimentación | 40-50 h |
| Desarrollador HTML5/JS | Motor del simulador, plano SVG, sistema de inyectores, módulos del curso | 80-100 h |
| Médico revisor (CPES) | Validación de criterios clínicos (grupos EVAC-H, grados SMV, protocolos QBRNE) | 8-10 h |
| Facilitador piloto | Prueba de usuario del simulador en modo taller — retroalimentación | 4-6 h |

---

## 13. CRITERIOS DE ACEPTACIÓN Y CONTROL DE CALIDAD

### 13.1 Criterios de aceptación técnica

Todo HTML5 entregado debe pasar estos criterios antes de distribución:

- [ ] Abre sin errores en Chrome, Firefox y Safari sin conexión a internet
- [ ] No usa recursos externos (CDN, imágenes externas, fuentes online)
- [ ] Funciona en resolución 768×1024 (tablet) y 1366×768 (laptop)
- [ ] No usa localStorage ni IndexedDB (restricciones de red hospitalaria)
- [ ] Tiempo de carga inicial < 3 segundos en cualquier dispositivo
- [ ] Sin errores en consola de JavaScript
- [ ] El plano del hospital es legible y clickeable en pantalla de proyector

### 13.2 Criterios de aceptación pedagógica

Todo contenido debe pasar estos criterios antes de incluirse:

- [ ] Cada dato técnico cita el documento fuente y la sección específica
- [ ] Ningún criterio fijo es parafraseado vagamente (grupos EVAC-H, grados SMV, protocolos QBRNE son datos exactos)
- [ ] El nivel Bloom de cada pregunta fue explicitado y alcanza mínimo "Aplicar"
- [ ] La retroalimentación de opciones incorrectas es tan extensa como la de la correcta
- [ ] Al menos un elemento de cada módulo hace referencia directa al Hospital de Nunca Jamás
- [ ] El lenguaje usa imperativo y segunda persona en materiales para participantes
- [ ] Ningún material está fuera de los 13 documentos CPES-IMSS — si hay contenido externo está marcado como tal

### 13.3 Criterios de aceptación operativa (validación médica)

Los siguientes criterios son **no negociables** y requieren revisión de personal médico CPES:

- [ ] Los 5 grupos de evacuación EVAC-H corresponden exactamente a los criterios de la guía (PaO₂/FiO₂, PEEP, dosis vasopresores)
- [ ] Los 3 grados de activación SMV corresponden exactamente a los criterios de la Guía SMV-H Anexo 1
- [ ] Las zonas caliente/tibia/fría del protocolo QBRNE son correctas y consistentes
- [ ] Los principios ALARA y los niveles de EPP son coherentes con la Guía QBRNE
- [ ] Ningún inyector del simulador contradice un protocolo de las guías
- [ ] Las consecuencias de decisiones omitidas son realistas y proporcionales

### 13.4 Proceso de revisión y actualización

- **Revisión mínima:** Una vez al año o tras cualquier actualización de las Guías Operativas CPES
- **Revisión urgente:** Si se identifica un error en criterio clínico fijo — corrección en 48 horas
- **Responsable:** Coordinación de Proyectos Especiales en Salud, CPES-DPM
- **Control de versiones:** Cada archivo HTML incluye en el footer: versión, fecha y guías fuente consultadas

---

## APÉNDICES

### Apéndice A: Mapa completo de inyectores por escenario

*(Ver secciones 5.2 — Escenarios S1, S2, S3)*

### Apéndice B: Criterios de evaluación del simulador (derivados de guías CPES)

**Criterios SMV-H (Guía SMV-H, Pasos 1-6):**
1. Recepción de alerta y diagnóstico inicial documentado
2. Declaratoria de Código SMV por autoridad competente
3. Seguridad física del establecimiento — control de accesos
4. Expansión de capacidad — suspensión de electivos
5. Noria de ambulancias y triage externo operativos
6. Comunicación permanente con CRUM/CVOED

**Criterios EVAC-H (Guía EVAC-H, Procedimiento Operativo):**
1. Activación de alarma y cadena de llamadas
2. Triage de evacuación con 5 grupos correctamente asignados
3. Activación de brigadas por piso o área
4. Evacuación horizontal antes que vertical (cuando aplica)
5. Registro de pacientes con discapacidad (INGRID-H)
6. Documentación de decisiones sobre Grupo 5

**Criterios SCI-H (Documento SCI-H, Funciones 1-8):**
1. Mando único establecido — no colisión de comandos
2. Puesto de Comando definido y comunicado
3. Plan de Acción del Incidente (PAI) elaborado para el período
4. Función de Información Pública: vocero único designado
5. Función de Enlace: CVOED, CRUM, RISS contactados
6. Alcance de control respetado (máx. 5-7 subordinados por función)

### Apéndice C: Banco de fichas de pacientes del Hospital de Nunca Jamás

Los siguientes 22 pacientes están disponibles para los escenarios del simulador (selección por escenario):

| ID | Área | Condición clínica | Grupo EVAC-H | Discapacidad | Registrado |
|----|------|-------------------|--------------|--------------|------------|
| P001 | UCI-1 | VM parámetros bajos, vasopresores 0.08 | 3 | No | Sí |
| P002 | UCI-2 | VM parámetros altos, vasopresores 0.6+ | 5 | No | Sí |
| P003 | UCI-3 | VM parámetros bajos, sin vasopresores | 3 | Motriz | No ⚠️ |
| P004 | UCI-4 | VM no invasiva, sin vasopresores | 3 | No | Sí |
| P005 | UCI-5 | Paro recuperado, inestable, ECMO | 5 | No | Sí |
| P006 | UCI-6 | Post-trasplante hepático día 2, estable | 5 diferido | No | Sí |
| P007 | UCI-7 | Politrauma estabilizado, sin VM | 2 | No | Sí |
| P008 | UCI-8 | Sepsis controlada, sin soporte ventilatorio | 2 | No | Sí |
| P009 | Med-Int-A/12 | Cardiopatía crónica, prealta | 1 | Auditiva | No ⚠️ |
| P010 | Med-Int-A/23 | DM2 descompensada, obeso, no autónomo | 2 | Motriz | Sí |
| P011 | Med-Int-B/08 | Neumonía moderada, O2 suplementario | 2 | No | Sí |
| P012 | Med-Int-B/14 | Postoperatorio 48h, ambulatorio | 1 | No | Sí |
| P013 | Cir-1/03 | Postop cirugía mayor abdominal, estable | 2 | No | Sí |
| P014 | Cir-1/07 | En cirugía: tórax abierto (en curso) | Protocolo especial | No | N/A |
| P015 | Cir-2/11 | Trauma ortopédico, en silla de ruedas | 2 | Motriz | Sí |
| P016 | Cir-2/18 | Postop laparoscopía, prealta | 1 | No | Sí |
| P017 | Ped-1/04 | Niño 6 años, asma moderada, O2 | 2 | No | Sí |
| P018 | Ped-1/09 | Neonato en incubadora, sin soporte ventilatorio | 2 especial | No | Sí |
| P019 | Ped-2/02 | Adolescente 15 años, fractura, ambulatorio | 1 | No | Sí |
| P020 | Obs-A/07 | Adulto mayor, demencia, no autónomo | 2 | Intelectual | No ⚠️ |
| P021 | Obs-A/14 | Crisis hipertensiva, estabilizado | 1 | Visual | No ⚠️ |
| P022 | Choque/01 | Shock séptico, VM, vasopresores altos | 4 | No | Sí |

> ⚠️ Pacientes con discapacidad NO registrados en base de emergencias: 4 de 7 con discapacidad (57%) — refleja brecha INGRID-H documentada del Nunca Jamás

### Apéndice D: Glosario técnico del simulador

| Término en interfaz | Definición operativa | Guía fuente |
|--------------------|---------------------|-------------|
| Código SMV | Activación formal del Plan de Contingencia de Saldo Masivo de Víctimas | SMV-H, Sección 3.2 |
| Grado I/II/III | Niveles de activación de recursos según magnitud del SMV | SMV-H, Anexo 1 |
| Noria de ambulancias | Sistema de flujo unidireccional de vehículos para evitar colisiones | SMV-H + EVAC-H |
| Triage START | Sistema de clasificación rápida en SMV (no el triage clínico habitual) | SMV-H |
| Grupo 1-5 | Clasificación de pacientes para evacuación según criterios clínicos EVAC-H | EVAC-H, p.12-14 |
| OTR | Objetivo de Tiempo de Recuperación — tiempo máximo tolerable de interrupción de un servicio | BCP-H |
| Zona caliente/tibia/fría | Zonas de seguridad en incidente QBRNE | QBRNE |
| ALARA | "As Low As Reasonably Achievable" — principio de mínima exposición | QBRNE |
| PAI | Plan de Acción del Incidente — documento del CI en SCI-H | SCI-H |
| CVOED | Centro Virtual de Operaciones en Emergencias y Desastres IMSS (55 5262 5368) | PH-RED |
| CRUM | Centro Regulador de Urgencias Médicas | SMV-H + PH-RED |
| RISS | Red Integrada de Servicios de Salud | SMV-H |
| CENACOM | Centro Nacional de Comunicaciones de Protección Civil | PH-RED |

---

*Documento elaborado con base en el análisis del material del Taller de Formación de Facilitadores CPES-IMSS (19/02/2026) y los 13 documentos de la base documental autorizada.*

*Versión: 1.0 · Fecha: Marzo 2026 · Coordinación de Proyectos Especiales en Salud, CPES-DPM, IMSS*

---

**FIN DEL DOCUMENTO**
