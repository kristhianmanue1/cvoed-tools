# ESPECIFICACIÓN PARA AGENTES DE IA
# TARJETAS DE ACCIÓN CPES-IMSS v2.0

**Tipo:** Instrucción técnica de renderizado multi-formato
**Consumidor:** Agentes de IA (LLM) que generan HTML5, PDF, DOCX
**Versión esquema:** 2.0
**Fecha:** 2026-02-27
**Programa:** CPES-IMSS · Copa Mundial FIFA 2026

---

## INSTRUCCIONES PARA EL AGENTE

Eres un agente de producción. Tu trabajo es recibir un objeto JSON con la estructura definida en esta especificación y generar una Tarjeta de Acción fiel al sistema de diseño descrito. Sigue estas reglas sin excepción:

1. **Lee el JSON completo** antes de renderizar.
2. **Aplica los tokens de diseño** exactamente como se definen (colores HEX, tamaños, pesos).
3. **Respeta la doble codificación** color + forma geométrica en todo indicador visual.
4. **Cero dependencias externas**: no uses Google Fonts, CDNs, Bootstrap, Tailwind ni ninguna librería externa. Todo es CSS vanilla + system fonts.
5. **Genera el formato solicitado** en `render.formatos_activos[]`. Si dice `["html"]`, genera solo HTML. Si dice `["html","pdf","docx"]`, genera los tres.
6. **Valida contra el checklist** (sección 12) antes de entregar.

---

## 1. CONTEXTO DEL PRODUCTO

Las Tarjetas de Acción son **herramientas de actuación bajo estrés** para personal hospitalario IMSS durante emergencias y simulacros relacionados con la Copa Mundial FIFA 2026 en México.

**No son material didáctico.** El usuario las consulta durante una emergencia real para saber exactamente qué hacer. Por eso: lenguaje imperativo, estructura visual clara, carga cognitiva mínima.

**Principio rector de diseño:**
> "En una emergencia, el diseño debe desaparecer para que la acción aparezca."

Esto significa: sin decoración, sin ornamentación, sin colores que no codifiquen función. El color institucional existe solo en la franja de encabezado/pie. El cuerpo es 100% funcional.

---

## 2. ESQUEMA JSON — ESTRUCTURA RAÍZ

```json
{
  "schema_version": "2.0",
  "programa": "CPES-IMSS-FIFA2026",
  "tipo_contenido": "tarjeta_accion",
  "metadatos": { },
  "tokens": { },
  "contenido": {
    "anverso": { },
    "reverso": { }
  },
  "render": { }
}
```

**Regla de procesamiento:** El agente DEBE leer `tokens` antes de procesar `contenido`. Los tokens definen TODOS los valores visuales. El contenido nunca contiene valores de estilo — solo datos y flags booleanos.

---

## 3. OBJETO `metadatos`

```json
"metadatos": {
  "codigo": "TA-B3-02",
  "version": "1.0",
  "fecha_creacion": "2026-02-27",
  "fecha_revision": "2026-06-01",
  "bloque": {
    "numero": 3,
    "nombre": "Saldo Masivo de Víctimas",
    "clave": "SMV-H"
  },
  "guias_fuente": ["SMV-H", "SCI-H"],
  "funcion_scih": "Operaciones",
  "nivel_audiencia": "intermedio",
  "contexto_uso": ["emergencia_real", "simulacro", "referencia_rapida"],
  "canal_distribucion": ["bolsillo_laminado", "whatsapp", "pantalla_servicio"],
  "responsable_contenido": "CPES - Coordinación de Proyectos Especiales en Salud",
  "validado_por": "",
  "notas_produccion": ""
}
```

### Enums válidos

| Campo | Valores permitidos |
|-------|--------------------|
| `funcion_scih` | `"Mando"` · `"Planificación"` · `"Operaciones"` · `"Logística"` · `"Administración_Finanzas"` · `"Seguridad"` · `"Información_Pública"` · `"Enlace"` |
| `nivel_audiencia` | `"base"` · `"intermedio"` · `"avanzado"` |
| `bloque.clave` | `"PH-RED"` · `"EVAC-H"` · `"SMV-H"` · `"BCP-H"` · `"QBRNE"` · `"SIMULACROS"` |
| `contexto_uso[]` | `"emergencia_real"` · `"simulacro"` · `"referencia_rapida"` · `"capacitacion"` |
| `canal_distribucion[]` | `"bolsillo_laminado"` · `"whatsapp"` · `"pantalla_servicio"` · `"tablero_pared"` · `"lms_digital"` |

---

## 4. OBJETO `tokens` — SISTEMA DE DISEÑO COMPLETO

Este objeto es la **única fuente de verdad** para todos los valores visuales. El agente NO debe hardcodear colores, tamaños ni fuentes fuera de lo que define `tokens`.

```json
"tokens": {

  "color": {
    "institucional": {
      "guinda":       { "hex": "#691C32", "rgb": [105, 28, 50],  "cmyk": [38, 93, 62, 45], "pantone": "7421 C", "uso": "Encabezado, franja superior. Gobierno de México 2024-2030" },
      "guinda_dark":  { "hex": "#4A1023", "rgb": [74, 16, 35],   "cmyk": [45, 96, 68, 58], "pantone": null,     "uso": "Gradiente encabezado extremo izquierdo" },
      "dorado":       { "hex": "#BC955C", "rgb": [188, 149, 92], "cmyk": [26, 40, 73, 3],  "pantone": "465 C",  "uso": "Escudo, acentos institucionales opcionales" },
      "verde_imss":   { "hex": "#006657", "rgb": [0, 102, 87],   "cmyk": [88, 34, 65, 27], "pantone": "561 C",  "uso": "Gradiente encabezado, números de paso, bordes de sección" },
      "negro":        { "hex": "#161A1D", "rgb": [22, 26, 29],   "cmyk": [77, 68, 63, 80], "pantone": "Neutral Black C", "uso": "No usado directamente; referencia institucional" }
    },
    "funcional": {
      "rojo":         { "hex": "#C41E3A", "rgb": [196, 30, 58],  "forma": "diamante",  "unicode": "◆", "unicode_code": "U+25C6", "significado": "Peligro / Crítico / Inmediato", "contraste_sobre_blanco": "5.6:1 AA" },
      "rojo_bg":      { "hex": "#FDF0F0", "uso": "Fondo sutil para alertas y escalamiento" },
      "rojo_border":  { "hex": "#E8A0A0", "uso": "Borde sutil de bloques de alerta" },
      "amarillo":     { "hex": "#D4940A", "rgb": [212, 148, 10], "forma": "triangulo", "unicode": "▲", "unicode_code": "U+25B2", "significado": "Precaución / Paso crítico", "contraste_sobre_blanco": "3.2:1 (solo textos grandes o sobre fondo oscuro)" },
      "amarillo_bg":  { "hex": "#FFF8E7", "uso": "Fondo de paso crítico" },
      "amarillo_border": { "hex": "#F0D070", "uso": "Borde de paso crítico" },
      "verde":        { "hex": "#1B7340", "rgb": [27, 115, 64],  "forma": "circulo",   "unicode": "●", "unicode_code": "U+25CF", "significado": "Seguro / OK / Leve", "contraste_sobre_blanco": "5.1:1 AA" },
      "verde_bg":     { "hex": "#F0F8F4", "uso": "Fondo verde sutil" },
      "azul":         { "hex": "#1A5276", "rgb": [26, 82, 118],  "forma": "cuadrado",  "unicode": "■", "unicode_code": "U+25A0", "significado": "Información / Comunicación / Referencia", "contraste_sobre_blanco": "7.2:1 AAA" },
      "azul_bg":      { "hex": "#EDF4FA", "uso": "Fondo bloques de información, contexto FIFA" },
      "azul_border":  { "hex": "#A8C8E0", "uso": "Borde bloques de información" },
      "negro":        { "hex": "#1A1A2E", "rgb": [26, 26, 46],   "forma": "cruz",      "unicode": "✕", "unicode_code": "U+2715", "significado": "Fallecido / Sin intervención / Expectante", "contraste_sobre_blanco": "14.8:1 AAA" },
      "gris":         { "hex": "#4A5568", "rgb": [74, 85, 104],  "forma": null,        "unicode": null, "significado": "Neutral / Continuidad operativa", "contraste_sobre_blanco": "5.9:1 AA" }
    },
    "estructura": {
      "bg_primary":    { "hex": "#FFFFFF", "uso": "Fondo principal de tarjeta" },
      "bg_secondary":  { "hex": "#F7F8FA", "uso": "Fondo alterno filas, fondo pasos normales" },
      "bg_tertiary":   { "hex": "#EDF0F4", "uso": "Fondo pie de tarjeta, fondo secciones" },
      "text_primary":  { "hex": "#1A1A2E", "contraste_sobre_blanco": "14.8:1 AAA", "uso": "Texto principal, nombres de rol, acciones" },
      "text_secondary": { "hex": "#4A5568", "contraste_sobre_blanco": "5.9:1 AA", "uso": "Subtítulos, funciones, metadatos intermedios" },
      "text_muted":    { "hex": "#6B7280", "contraste_sobre_blanco": "4.6:1 AA", "uso": "Pie de página, tiempos de referencia, notas" },
      "border_default": { "hex": "#D1D5DB", "uso": "Bordes de tablas, separadores principales" },
      "border_light":  { "hex": "#E5E7EB", "uso": "Bordes internos de filas, separadores sutiles" }
    }
  },

  "tipografia": {
    "familia_primaria": {
      "stack": "\"Segoe UI\", system-ui, -apple-system, \"Helvetica Neue\", Arial, sans-serif",
      "justificacion": "System fonts: cero descarga, disponibles en cualquier SO, legibilidad comprobada ISO 9241-303. NO usar Google Fonts en contexto hospitalario (firewalls IMSS bloquean CDNs)."
    },
    "familia_mono": {
      "stack": "\"Cascadia Code\", \"SF Mono\", \"Consolas\", ui-monospace, monospace",
      "uso": "Códigos de tarjeta, tiempos de referencia, teléfonos"
    },
    "escala": {
      "xs":   { "rem": "0.6875rem", "px_equiv": 11, "uso": "Pie de página, metadatos terciarios" },
      "sm":   { "rem": "0.75rem",   "px_equiv": 12, "uso": "Metadatos, textos de tabla, notas" },
      "base": { "rem": "0.875rem",  "px_equiv": 14, "uso": "Cuerpo principal en formato A5 / tarjeta" },
      "md":   { "rem": "1rem",      "px_equiv": 16, "uso": "Cuerpo en pantalla digital / responsivo" },
      "lg":   { "rem": "1.125rem",  "px_equiv": 18, "uso": "Subtítulos de sección" },
      "xl":   { "rem": "1.25rem",   "px_equiv": 20, "uso": "Nombre del rol en tarjeta" },
      "2xl":  { "rem": "1.5rem",    "px_equiv": 24, "uso": "Nombre del rol en pantalla completa" }
    },
    "pesos": {
      "normal": 400,
      "medium": 500,
      "semi":   600,
      "bold":   700
    },
    "line_height": {
      "tight":  1.3,
      "normal": 1.5,
      "relaxed": 1.6
    }
  },

  "espaciado": {
    "sp_1": { "rem": "0.25rem", "px": 4 },
    "sp_2": { "rem": "0.5rem",  "px": 8 },
    "sp_3": { "rem": "0.75rem", "px": 12 },
    "sp_4": { "rem": "1rem",    "px": 16 },
    "sp_5": { "rem": "1.25rem", "px": 20 },
    "sp_6": { "rem": "1.5rem",  "px": 24 }
  },

  "radios": {
    "sm": "3px",
    "md": "6px",
    "lg": "8px"
  },

  "sombras": {
    "card":     "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
    "elevated": "0 4px 16px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)"
  },

  "bloques": {
    "B1": { "guia": "PH-RED + SCI-H", "color_borde_lateral": "#691C32", "etiqueta": "MARCO GENERAL" },
    "B2": { "guia": "EVAC-H",         "color_borde_lateral": "#B45309", "etiqueta": "EVACUACIÓN" },
    "B3": { "guia": "SMV-H",          "color_borde_lateral": "#C41E3A", "etiqueta": "SALDO MASIVO" },
    "B4": { "guia": "BCP-H",          "color_borde_lateral": "#4A5568", "etiqueta": "CONTINUIDAD" },
    "B5": { "guia": "QBRNE",          "color_borde_lateral": "#6B21A8", "etiqueta": "AMENAZA QBRNE" },
    "B6": { "guia": "SIMULACROS",     "color_borde_lateral": "#1A5276", "etiqueta": "EVALUACIÓN" }
  },

  "formas_geometricas": {
    "diamante":  { "unicode": "◆", "code": "U+25C6", "significado": "Peligro / Crítico",   "color_asociado": "funcional.rojo" },
    "triangulo": { "unicode": "▲", "code": "U+25B2", "significado": "Precaución",           "color_asociado": "funcional.amarillo" },
    "circulo":   { "unicode": "●", "code": "U+25CF", "significado": "Seguro / OK",          "color_asociado": "funcional.verde" },
    "cuadrado":  { "unicode": "■", "code": "U+25A0", "significado": "Información",          "color_asociado": "funcional.azul" },
    "cruz":      { "unicode": "✕", "code": "U+2715", "significado": "Fallecido / Expectante", "color_asociado": "funcional.negro" }
  }
}
```

### Regla crítica: DOBLE CODIFICACIÓN

Cada indicador visual que transmite nivel de prioridad, severidad o estado DEBE incluir:
1. El **color** del token `funcional.*`
2. La **forma geométrica** correspondiente del token `formas_geometricas.*`

Nunca transmitas información solo por color. Esto es obligatorio para accesibilidad (WCAG 2.2 1.4.1) y para impresión en escala de grises.

---

## 5. OBJETO `contenido.anverso`

```json
"contenido": {
  "anverso": {
    "encabezado": {
      "nombre_rol": "Médico de Triage — Binomio Médico-Enfermería",
      "subtitulo_funcion": "Función SCI-H: Operaciones",
      "bloque_guia": "BLOQUE 3 · SMV-H",
      "bloque_clave": "B3"
    },

    "alerta_critica": {
      "visible": true,
      "texto": "Primero protégete. Si tú caes, el triage colapsa.",
      "nivel": "rojo"
    },

    "primeros_pasos": {
      "titulo_seccion": "PRIMEROS 15 MINUTOS",
      "instruccion_base": "Ejecuta en orden. No saltes pasos.",
      "pasos": [
        {
          "numero": 1,
          "accion": "Colócate el chaleco de TRIAGE y ubícate en el Área de Concentración de Víctimas (ACV).",
          "tiempo_referencia": "0–2 min",
          "critico": false
        },
        {
          "numero": 2,
          "accion": "Aplica triage START: evalúa respiración → circulación → estado neurológico. Asigna color.",
          "tiempo_referencia": "2–8 min",
          "critico": true
        },
        {
          "numero": 3,
          "accion": "Informa al Comandante del Incidente (CI): número de víctimas por categoría de color.",
          "tiempo_referencia": "8–10 min",
          "critico": true
        },
        {
          "numero": 4,
          "accion": "Dirige el flujo: ROJO → Área Roja. AMARILLO → Área Amarilla. NEGRO → Área de Espera Digna.",
          "tiempo_referencia": "10–13 min",
          "critico": false
        },
        {
          "numero": 5,
          "accion": "Registra en la tarjeta de triage. No traslades sin registro. Actualiza al CI cada 10 min.",
          "tiempo_referencia": "Continuo",
          "critico": false
        }
      ]
    },

    "tabla_referencia": {
      "visible": true,
      "titulo": "Clasificación Triage START",
      "columnas": ["Color", "Condición", "Acción inmediata"],
      "filas": [
        {
          "indicador": { "nivel": "rojo",     "forma": "diamante",  "etiqueta": "ROJO" },
          "celdas": ["Crítico tratable", "Traslado inmediato a quirófano / UCI"]
        },
        {
          "indicador": { "nivel": "amarillo", "forma": "triangulo", "etiqueta": "AMARILLO" },
          "celdas": ["Urgente diferible", "Tratamiento en 60 min"]
        },
        {
          "indicador": { "nivel": "verde",    "forma": "circulo",   "etiqueta": "VERDE" },
          "celdas": ["Leve / ambulatorio", "Área verde, reevalúa"]
        },
        {
          "indicador": { "nivel": "negro",    "forma": "cruz",      "etiqueta": "NEGRO" },
          "celdas": ["Sin signos de vida", "Área de espera digna, no resucitar"]
        }
      ],
      "nota_pie": "Reevalúa al ROJO cada 5 min. El estado puede cambiar."
    }
  }
}
```

### Reglas de contenido — Anverso

| Regla | Validación |
|-------|-----------|
| `pasos[]` tiene exactamente 5 elementos | `pasos.length === 5` |
| Todos los verbos en `accion` están en imperativo | Primera palabra: "Colócate", "Aplica", "Informa", "Dirige", "Registra" |
| Al menos 1 paso tiene `critico: true` | `pasos.filter(p => p.critico).length >= 1` |
| `alerta_critica.visible` es `true` si el bloque es SMV-H o QBRNE | Validar contra `metadatos.bloque.clave` |
| Si `tabla_referencia.visible` es `true`, debe tener mínimo 3 filas | `filas.length >= 3` |
| Cada fila de tabla tiene un objeto `indicador` con `nivel`, `forma`, `etiqueta` | Garantiza doble codificación |

---

## 6. OBJETO `contenido.reverso`

```json
  "reverso": {
    "tabla_comunicaciones": {
      "titulo": "A QUIÉN LLAMAS · EN QUÉ ORDEN",
      "titulo_nivel": "azul",
      "titulo_forma": "cuadrado",
      "columnas": ["#", "Destinatario", "Cuándo", "Para qué", "Canal"],
      "filas": [
        {
          "orden": 1,
          "destinatario": "Comandante del Incidente (CI)",
          "cuando": "Inmediato al completar primer ciclo de triage",
          "para_que": "Reportar número de víctimas por color",
          "canal": "Radio / presencial en PC"
        },
        {
          "orden": 2,
          "destinatario": "Jefe de Enfermería de Urgencias",
          "cuando": "Si víctimas superan capacidad del ACV",
          "para_que": "Solicitar personal adicional al área",
          "canal": "Teléfono directo / radio"
        },
        {
          "orden": 3,
          "destinatario": "Banco de Sangre",
          "cuando": "Más de 3 pacientes ROJO con sangrado activo",
          "para_que": "Activar protocolo de transfusión masiva",
          "canal": "Teléfono directo"
        },
        {
          "orden": 4,
          "destinatario": "CVOED",
          "cuando": "Si el CI lo indica o si supera capacidad hospitalaria",
          "para_que": "Notificación institucional, solicitar refuerzo",
          "canal": "55 5262 5368"
        }
      ]
    },

    "criterios_escalamiento": {
      "titulo": "ESCALA AL CI CUANDO...",
      "titulo_nivel": "rojo",
      "titulo_forma": "diamante",
      "items": [
        "Más de 20 víctimas en ACV y solo 1 médico de triage activo",
        "No hay área habilitada para ROJO en menos de 10 min",
        "El personal de triage empieza a cometer errores por saturación",
        "Sospecha de pacientes QBRNE entre las víctimas (síntomas inusuales, mismo cuadro)"
      ]
    },

    "directorio_emergencias": {
      "titulo": "DIRECTORIO RÁPIDO",
      "titulo_nivel": "azul",
      "titulo_forma": "cuadrado",
      "contactos": [
        {
          "nombre": "CVOED (24/7)",
          "telefono": "55 5262 5368",
          "whatsapp": "55 8003 5824",
          "email": "cvoed.coord@imss.gob.mx"
        },
        {
          "nombre": "Puesto de Comando (PC)",
          "telefono": "[completar por unidad]",
          "whatsapp": "",
          "email": ""
        },
        {
          "nombre": "Banco de Sangre",
          "telefono": "[completar por unidad]",
          "whatsapp": "",
          "email": ""
        }
      ]
    },

    "contexto_fifa": {
      "visible": true,
      "nivel": "azul",
      "etiqueta": "CONTEXTO FIFA 2026",
      "texto": "Día de partido: +40% urgencias. Activa SMV desde el primer indicio. No esperes confirmación del CRUM para preparar el ACV."
    },

    "pie_tarjeta": {
      "fuentes": "SMV-H · SCI-H (OPS)",
      "programa": "CPES-IMSS · Copa Mundial FIFA 2026",
      "version": "TA-B3-02 v1.0",
      "institucional": "Gobierno de México · IMSS",
      "qr_url": "https://cvoed.imss.gob.mx"
    }
  }
```

### Reglas de contenido — Reverso

| Regla | Validación |
|-------|-----------|
| `tabla_comunicaciones.filas[]` tiene mínimo 3 + CVOED al final | `filas.length >= 4 && filas[filas.length-1].destinatario === "CVOED"` |
| `criterios_escalamiento.items[]` tiene entre 3 y 5 elementos | `3 <= items.length <= 5` |
| Teléfono CVOED es exactamente `"55 5262 5368"` | Inmutable — no modificar |
| `contexto_fifa.texto` contiene dato cuantificable | Debe incluir un % o número específico |
| `pie_tarjeta.fuentes` cita al menos 1 guía CPES | Contiene "SMV-H" o "EVAC-H" o "PH-RED" etc. |

---

## 7. OBJETO `render` — INSTRUCCIONES POR FORMATO

```json
"render": {
  "formatos_activos": ["html", "pdf", "docx"],

  "html": {
    "idioma": "es-MX",
    "charset": "UTF-8",
    "viewport": "width=device-width, initial-scale=1.0",
    "dependencias_externas": false,
    "css_variables": true,
    "responsive": true,
    "breakpoints": {
      "mobile":  { "max_width_px": 480,  "descripcion": "Celular — vista WhatsApp / navegador móvil" },
      "tablet":  { "max_width_px": 768,  "descripcion": "Tablet — pantalla de servicio" },
      "desktop": { "max_width_px": 960,  "descripcion": "Escritorio — máximo ancho de tarjeta" }
    },
    "max_width_tarjeta_px": 680,
    "accesibilidad": {
      "aria_labels": true,
      "role_document": true,
      "role_alert_en_alerta_critica": true,
      "scope_col_en_tablas": true,
      "lang_attribute": "es-MX",
      "semantica_html5": true,
      "elementos_requeridos": ["article", "header", "main", "section", "footer", "h1", "h2", "h3", "ol", "table"]
    },
    "interaccion": {
      "boton_imprimir": true,
      "boton_whatsapp": true,
      "boton_imprimir_funcion": "window.print()"
    },
    "print_css": {
      "page_size": "A5 landscape",
      "margin": "8mm",
      "ocultar": [".tarjeta__acciones", ".presentation__title", ".presentation__subtitle", ".card-label"],
      "page_break": "cada tarjeta en página separada"
    }
  },

  "pdf": {
    "motor_recomendado": "weasyprint",
    "motor_alternativo": "reportlab",
    "pagina": {
      "tamanio": "A5",
      "orientacion": "landscape",
      "ancho_mm": 210,
      "alto_mm": 148
    },
    "margenes_mm": {
      "superior": 8,
      "inferior": 8,
      "izquierdo": 8,
      "derecho": 8
    },
    "zona_segura_mm": 5,
    "sangria_mm": 3,
    "resolucion_dpi": 300,
    "perfil_color": "CMYK ISO Coated v2 300%",
    "doble_cara": true,
    "qr_codigo": {
      "incluir": true,
      "tamanio_mm": 20,
      "posicion": "pie_derecho",
      "url": "referencia a pie_tarjeta.qr_url"
    },
    "laminado": {
      "tipo": "mate",
      "grosor_micras": 80,
      "ambas_caras": true
    },
    "papel": {
      "tipo": "couché mate",
      "gramaje_gsm": 300
    },
    "tipografia_minima_pt": {
      "pie_pagina": 7,
      "cuerpo": 9,
      "encabezados": 11
    },
    "accesible_pdf": true,
    "marca_agua": false,
    "compresion": "alta"
  },

  "docx": {
    "motor_recomendado": "python-docx",
    "pagina": {
      "tamanio": "A5",
      "orientacion": "landscape",
      "ancho_cm": 21.0,
      "alto_cm": 14.8
    },
    "margenes_cm": {
      "superior": 0.8,
      "inferior": 0.8,
      "izquierdo": 0.8,
      "derecho": 0.8
    },
    "fuente_principal": "Arial",
    "fuente_fallback": "Helvetica",
    "fuente_mono": "Consolas",
    "estilos": {
      "encabezado_institucional": {
        "fondo": "gradiente no disponible en DOCX — usar color sólido tokens.color.institucional.guinda.hex",
        "texto": "#FFFFFF",
        "fuente_size_pt": 10,
        "peso": "Bold",
        "alineacion": "center",
        "alto_fila_cm": 1.0
      },
      "nombre_rol": {
        "fuente_size_pt": 16,
        "peso": "Bold",
        "color": "tokens.color.estructura.text_primary.hex",
        "espacio_despues_pt": 4
      },
      "paso_normal": {
        "fondo": "tokens.color.estructura.bg_secondary.hex",
        "borde_izquierdo_pt": 3,
        "borde_izquierdo_color": "tokens.color.institucional.verde_imss.hex",
        "fuente_size_pt": 10,
        "interlineado": 1.4
      },
      "paso_critico": {
        "fondo": "tokens.color.funcional.amarillo_bg.hex",
        "borde_izquierdo_pt": 3,
        "borde_izquierdo_color": "tokens.color.funcional.amarillo.hex",
        "borde_contorno_pt": 0.5,
        "borde_contorno_color": "tokens.color.funcional.amarillo_border.hex",
        "fuente_size_pt": 10,
        "peso": "SemiBold"
      },
      "alerta_critica": {
        "fondo": "tokens.color.funcional.rojo_bg.hex",
        "borde_izquierdo_pt": 4,
        "borde_izquierdo_color": "tokens.color.funcional.rojo.hex",
        "texto_color": "tokens.color.funcional.rojo.hex",
        "peso": "Bold",
        "fuente_size_pt": 10
      },
      "tabla_encabezado": {
        "fondo": "tokens.color.institucional.verde_imss.hex",
        "texto": "#FFFFFF",
        "fuente_size_pt": 9,
        "peso": "SemiBold"
      },
      "tabla_fila_par": {
        "fondo": "tokens.color.estructura.bg_secondary.hex"
      },
      "pie_pagina": {
        "fuente_size_pt": 7,
        "color": "tokens.color.estructura.text_muted.hex",
        "alineacion": "center"
      }
    },
    "salto_pagina_entre_anverso_reverso": true
  }
}
```

---

## 8. INSTRUCCIONES DE RENDERIZADO POR COMPONENTE

Para cada componente, se especifica cómo renderizar en cada formato. El agente DEBE seguir estas instrucciones al pie de la letra.

### 8.1 Encabezado institucional

| Propiedad | HTML5 | PDF | DOCX |
|-----------|-------|-----|------|
| **Contenedor** | `<header class="tarjeta__header">` | Celda de tabla 100% ancho | Fila de tabla sin bordes |
| **Fondo** | `linear-gradient(135deg, var(--inst-guinda) 0%, var(--inst-guinda-dark) 40%, var(--inst-verde-imss) 100%)` | Gradiente CSS (WeasyPrint lo soporta) | Color sólido `#691C32` (DOCX no soporta gradientes) |
| **Altura** | `min-height: 44px` | 12mm | 1.0cm |
| **Layout** | `display: flex; justify-content: space-between; align-items: center` | Flexbox CSS | 2 celdas: izquierda (logo+programa) y derecha (código) |
| **Logo IMSS** | SVG inline: círculo 28px con check | Imagen vectorial incrustada | Imagen .png 28x28px incrustada |
| **Texto programa** | `font-size: var(--fs-sm); font-weight: var(--fw-semi); color: #FFFFFF` | 9pt Bold, blanco | 10pt Bold, blanco |
| **Código tarjeta** | `font-family: var(--font-mono); font-size: var(--fs-xs); background: rgba(255,255,255,0.15); padding: 2px 8px; border-radius: 3px` | Monospace 8pt, fondo semitransparente | Consolas 8pt, fondo gris claro |

### 8.2 Bloque de rol

| Propiedad | HTML5 | PDF | DOCX |
|-----------|-------|-----|------|
| **Fondo** | `var(--bg-secondary)` (#F7F8FA) | #F7F8FA | Sombreado de celda #F7F8FA |
| **Borde inferior** | `1px solid var(--border-light)` | 0.5pt #E5E7EB | Borde inferior de celda 0.5pt |
| **Nombre del rol** | `font-size: var(--fs-xl); font-weight: 700; color: var(--text-primary); line-height: 1.3` | 14pt Bold | 16pt Bold |
| **Badge de bloque** | `display: inline-flex; background: [tokens.bloques.BX.color_borde_lateral]; color: #FFF; padding: 2px 10px; border-radius: 10px; font-size: var(--fs-xs)` | Caja redondeada con color del bloque | Texto con sombreado de color del bloque |
| **Forma en badge** | Unicode `◆` antepuesto a "BLOQUE 3 · SMV-H" | Mismo | Mismo carácter Unicode |

### 8.3 Alerta crítica

Solo se renderiza si `alerta_critica.visible === true`.

| Propiedad | HTML5 | PDF | DOCX |
|-----------|-------|-----|------|
| **Contenedor** | `role="alert"` obligatorio | N/A | N/A |
| **Fondo** | `var(--fn-rojo-bg)` (#FDF0F0) | #FDF0F0 | Sombreado de celda #FDF0F0 |
| **Borde izquierdo** | `4px solid var(--fn-rojo)` (#C41E3A) | 1.5mm sólido #C41E3A | 4pt borde izquierdo #C41E3A |
| **Forma prefijo** | `◆` en color `var(--fn-rojo)`, `font-size: var(--fs-lg)` | ◆ rojo 12pt | ◆ rojo 12pt |
| **Texto** | `font-weight: 700; color: var(--fn-rojo); font-size: var(--fs-base)` | Bold 10pt #C41E3A | Bold 10pt #C41E3A |
| **NO hacer** | No usar fondo rojo sólido con texto blanco en el cuerpo. Reservar fondos oscuros solo para encabezado. | Mismo | Mismo |

### 8.4 Pasos numerados

| Propiedad | Paso normal | Paso crítico (`critico: true`) |
|-----------|-------------|-------------------------------|
| **Fondo** | `var(--bg-secondary)` (#F7F8FA) | `var(--fn-amarillo-bg)` (#FFF8E7) |
| **Borde izquierdo** | `3px solid var(--inst-verde-imss)` (#006657) | `3px solid var(--fn-amarillo)` (#D4940A) |
| **Borde contorno** | Ninguno | `1px solid var(--fn-amarillo-border)` (#F0D070) |
| **Número — fondo** | `var(--inst-verde-imss)` (#006657) | `var(--fn-rojo)` (#C41E3A) |
| **Número — forma** | Círculo 24px, texto blanco, Bold | Círculo 24px, texto blanco, Bold |
| **Marcador crítico** | No aplica | `◆` en `var(--fn-rojo)` antepuesto al texto de acción |
| **Peso texto** | `var(--fw-normal)` (400) | `var(--fw-semi)` (600) |
| **Tiempo** | `font-family: monospace; font-size: var(--fs-xs); color: var(--text-muted)` | Mismo |

**En DOCX:** Cada paso es una fila de tabla de 2 columnas (columna 1: número circular, columna 2: acción + tiempo). Aplicar sombreado de celda para fondo. Borde izquierdo como borde de celda izquierda.

**En PDF:** Mismo layout que HTML. WeasyPrint renderiza CSS flexbox correctamente.

### 8.5 Tabla de referencia (triage)

| Propiedad | Valor |
|-----------|-------|
| **Encabezado** | Fondo `tokens.color.institucional.verde_imss.hex`, texto blanco, `font-size: xs`, `font-weight: semi`, `text-transform: uppercase` |
| **Filas alternas** | Par: `tokens.color.estructura.bg_secondary.hex`. Impar: `tokens.color.estructura.bg_primary.hex` |
| **Columna "Color"** | Renderizar: `[forma_unicode] [ETIQUETA]`. Ejemplo: `◆ ROJO`. La forma hereda color de `tokens.color.funcional.[nivel].hex`. La etiqueta hereda mismo color. |
| **Nota pie** | `font-size: xs`, `color: text_muted`, `font-style: italic`, borde izquierdo 2px `border_default` |
| **Bordes** | Externo: `1px solid border_default`. Interno entre filas: `1px solid border_light` |
| **Border-radius** | Solo HTML: `var(--radius-md)` en contenedor con `overflow: hidden` |

### 8.6 Tabla de comunicaciones (reverso)

| Propiedad | Valor |
|-----------|-------|
| **Título** | Forma `■` + texto, color `tokens.color.funcional.azul.hex`, peso Bold |
| **Encabezado tabla** | Fondo `tokens.color.funcional.azul.hex`, texto blanco |
| **Filas alternas** | Par: `tokens.color.funcional.azul_bg.hex`. Impar: blanco |
| **Número de orden** | Círculo 20px, fondo `tokens.color.funcional.azul.hex`, texto blanco, Bold |
| **Canal (última columna)** | Si contiene número telefónico, usar `font-family: monospace; font-size: xs` |

**Responsivo móvil (≤480px):** Ocultar columna "Para qué" (4ta columna) para ahorrar espacio horizontal. Aplicar `display: none` en CSS media query.

### 8.7 Criterios de escalamiento

| Propiedad | Valor |
|-----------|-------|
| **Contenedor** | Fondo `funcional.rojo_bg`, borde izquierdo 4px `funcional.rojo`, `border-radius: 0 md md 0` |
| **Título** | `◆ ESCALA AL CI CUANDO...`, color `funcional.rojo`, peso Bold |
| **Items** | Lista con viñeta `·` (punto medio), `font-size: sm`, color `text_primary` |
| **Viñeta** | `::before content: "·"`, color `funcional.rojo`, Bold |

### 8.8 Directorio rápido

| Propiedad | Valor |
|-----------|-------|
| **Layout** | Filas flex con: nombre (min-width 120px, semi) + separador punteado (flex:1, `border-bottom: 1px dotted`) + contacto (mono, xs) |
| **En DOCX** | Tabla de 3 columnas sin bordes: nombre | ... | teléfono |
| **En PDF** | Mismo que HTML |
| **En móvil** | Stack vertical: nombre arriba, contacto abajo |

### 8.9 Contexto FIFA

Solo se renderiza si `contexto_fifa.visible === true`.

| Propiedad | Valor |
|-----------|-------|
| **Contenedor** | Fondo `funcional.azul_bg`, borde izquierdo 3px `funcional.azul`, `border-radius: 0 md md 0` |
| **Etiqueta** | `■ CONTEXTO FIFA 2026`, `font-size: xs`, `font-weight: semi`, color `funcional.azul`, `text-transform: uppercase`, `letter-spacing: 0.06em` |
| **Texto** | `font-size: sm`, color `text_primary`, `line-height: 1.45` |
| **NO usar** | Emojis (🏟️). Usar forma geométrica `■` del token. |

### 8.10 Pie de tarjeta

| Propiedad | Valor |
|-----------|-------|
| **Fondo** | `tokens.color.estructura.bg_tertiary.hex` |
| **Layout** | Flex: info a la izquierda, QR a la derecha |
| **Texto** | `font-size: xs`, `color: text_muted`, separadores ` · ` entre campos |
| **QR** | 48x48px (HTML), 20x20mm (PDF/impreso). Borde 1px `border_default`, radio `sm` |
| **Contenido QR** | URL de `pie_tarjeta.qr_url` |
| **En DOCX** | Tabla de 2 columnas sin bordes. Celda derecha: imagen QR generada con librería `qrcode` |

---

## 9. REGLAS RESPONSIVAS (HTML5)

```
┌────────────────────────────────────────────────────────┐
│ BREAKPOINT        │ CAMBIOS                            │
├────────────────────────────────────────────────────────┤
│ ≤ 480px (mobile)  │ · border-radius tarjeta: 0         │
│                   │ · Encabezado: flex-wrap: wrap       │
│                   │ · Nombre rol: font-size --fs-lg     │
│                   │ · Tabla comms: ocultar col 4        │
│                   │ · Directorio: stack vertical        │
│                   │ · Padding general: --sp-3           │
│                   │ · Sombra reducida a shadow_card     │
├────────────────────────────────────────────────────────┤
│ 481–768px (tablet)│ · max-width tarjeta: 100%           │
│                   │ · Nombre rol: font-size --fs-xl     │
│                   │ · Todo visible                      │
├────────────────────────────────────────────────────────┤
│ ≥ 769px (desktop) │ · max-width tarjeta: 680px          │
│                   │ · Sombra: shadow_elevated           │
│                   │ · Nombre rol: font-size --fs-xl     │
│                   │ · Todo visible                      │
└────────────────────────────────────────────────────────┘
```

**CSS media queries a generar:**

```css
/* Mobile */
@media (max-width: 480px) {
  .tarjeta { border-radius: 0; box-shadow: var(--shadow-card); }
  .tarjeta__header { padding: var(--sp-2) var(--sp-3); flex-wrap: wrap; }
  .tarjeta__rol-nombre { font-size: var(--fs-lg); }
  .tarjeta__seccion { padding: var(--sp-3); }
  .tabla-comms thead th:nth-child(4),
  .tabla-comms tbody td:nth-child(4) { display: none; }
  .directorio-item { flex-direction: column; gap: var(--sp-1); }
  .directorio-separador { display: none; }
}

/* Print */
@media print {
  @page { size: A5 landscape; margin: 8mm; }
  body { background: #FFF; }
  .tarjeta__acciones,
  .presentation__title,
  .presentation__subtitle,
  .card-label { display: none; }
  .tarjeta { box-shadow: none; border-radius: 0; border: 1px solid #CCC; page-break-inside: avoid; }
  .tarjeta + .tarjeta { page-break-before: always; }
}
```

---

## 10. ESTRUCTURA SEMÁNTICA HTML5

El agente DEBE generar esta estructura exacta de elementos. No se permiten `<div>` donde existe un elemento semántico equivalente.

```
article[role="document"][aria-label="Tarjeta de Acción {codigo} — {cara}"]
├── header.tarjeta__header
│   ├── div.tarjeta__header-left
│   │   ├── div.tarjeta__logo[aria-label="IMSS"][role="img"] → SVG inline
│   │   └── div.tarjeta__programa → texto
│   └── div.tarjeta__codigo[aria-label="Código de tarjeta"] → código mono
│
├── div.tarjeta__rol
│   ├── h1.tarjeta__rol-nombre → nombre_rol
│   └── div.tarjeta__rol-meta
│       ├── span.tarjeta__funcion → subtitulo_funcion
│       └── span.tarjeta__badge[aria-label="Bloque {n}: {nombre}"] → forma + bloque_guia
│
├── div.tarjeta__alerta[role="alert"] (si visible)
│   ├── span.tarjeta__alerta-icono[aria-hidden="true"] → ◆
│   └── p.tarjeta__alerta-texto → texto
│
├── section[aria-labelledby="primeros-15"]
│   ├── h2#primeros-15.tarjeta__seccion-titulo → titulo_seccion
│   ├── p.tarjeta__instruccion → instruccion_base
│   └── ol.pasos[role="list"]
│       └── li.paso[role="listitem"] (×5)
│           ├── span.paso__numero[aria-label="Paso {n}"] → número
│           └── div.paso__contenido
│               ├── p.paso__accion → accion (+ marcador ◆ si critico)
│               └── p.paso__tiempo[aria-label="Tiempo de referencia"] → tiempo
│
├── div.tarjeta__tabla-container (si tabla_referencia.visible)
│   ├── h3.tarjeta__tabla-titulo → titulo
│   ├── table.tabla-triage[aria-label="{titulo}"]
│   │   ├── thead > tr > th[scope="col"] (×columnas)
│   │   └── tbody > tr (×filas)
│   │       └── td → indicador (forma+color+etiqueta) + celdas
│   └── p.tabla-nota → nota_pie
│
├── footer.tarjeta__footer
│   ├── div.tarjeta__footer-info → fuentes · programa · version
│   └── div.tarjeta__footer-qr[aria-label="Código QR: {url}"] → QR
│
└── div.tarjeta__acciones[aria-label="Acciones"] (solo HTML digital)
    ├── button.btn-accion → Imprimir
    └── button.btn-accion → WhatsApp
```

---

## 11. PLANTILLA JSON MAESTRA VACÍA

Copiar y completar para cada tarjeta del catálogo:

```json
{
  "schema_version": "2.0",
  "programa": "CPES-IMSS-FIFA2026",
  "tipo_contenido": "tarjeta_accion",

  "metadatos": {
    "codigo": "TA-BX-0X",
    "version": "1.0",
    "fecha_creacion": "YYYY-MM-DD",
    "fecha_revision": "YYYY-MM-DD",
    "bloque": {
      "numero": 0,
      "nombre": "",
      "clave": ""
    },
    "guias_fuente": [],
    "funcion_scih": "",
    "nivel_audiencia": "base",
    "contexto_uso": ["emergencia_real", "simulacro"],
    "canal_distribucion": ["bolsillo_laminado"],
    "responsable_contenido": "CPES-IMSS",
    "validado_por": "",
    "notas_produccion": ""
  },

  "tokens": "REFERENCIA_GLOBAL: usar tokens del sistema de diseño v2.0 definidos en sección 4",

  "contenido": {
    "anverso": {
      "encabezado": {
        "nombre_rol": "",
        "subtitulo_funcion": "",
        "bloque_guia": "",
        "bloque_clave": "BX"
      },
      "alerta_critica": {
        "visible": false,
        "texto": "",
        "nivel": "rojo"
      },
      "primeros_pasos": {
        "titulo_seccion": "PRIMEROS 15 MINUTOS",
        "instruccion_base": "Ejecuta en orden. No saltes pasos.",
        "pasos": [
          { "numero": 1, "accion": "", "tiempo_referencia": "0–X min", "critico": false },
          { "numero": 2, "accion": "", "tiempo_referencia": "X–X min", "critico": false },
          { "numero": 3, "accion": "", "tiempo_referencia": "X–X min", "critico": false },
          { "numero": 4, "accion": "", "tiempo_referencia": "X–X min", "critico": false },
          { "numero": 5, "accion": "", "tiempo_referencia": "Continuo", "critico": false }
        ]
      },
      "tabla_referencia": {
        "visible": false,
        "titulo": "",
        "columnas": [],
        "filas": [
          {
            "indicador": { "nivel": "", "forma": "", "etiqueta": "" },
            "celdas": []
          }
        ],
        "nota_pie": ""
      }
    },

    "reverso": {
      "tabla_comunicaciones": {
        "titulo": "A QUIÉN LLAMAS · EN QUÉ ORDEN",
        "titulo_nivel": "azul",
        "titulo_forma": "cuadrado",
        "columnas": ["#", "Destinatario", "Cuándo", "Para qué", "Canal"],
        "filas": [
          { "orden": 1, "destinatario": "", "cuando": "", "para_que": "", "canal": "" },
          { "orden": 2, "destinatario": "", "cuando": "", "para_que": "", "canal": "" },
          { "orden": 3, "destinatario": "", "cuando": "", "para_que": "", "canal": "" },
          { "orden": 4, "destinatario": "CVOED", "cuando": "Si el CI lo indica", "para_que": "Notificación institucional", "canal": "55 5262 5368" }
        ]
      },
      "criterios_escalamiento": {
        "titulo": "ESCALA AL CI CUANDO...",
        "titulo_nivel": "rojo",
        "titulo_forma": "diamante",
        "items": []
      },
      "directorio_emergencias": {
        "titulo": "DIRECTORIO RÁPIDO",
        "titulo_nivel": "azul",
        "titulo_forma": "cuadrado",
        "contactos": [
          { "nombre": "CVOED (24/7)", "telefono": "55 5262 5368", "whatsapp": "55 8003 5824", "email": "cvoed.coord@imss.gob.mx" },
          { "nombre": "Puesto de Comando (PC)", "telefono": "[completar por unidad]", "whatsapp": "", "email": "" }
        ]
      },
      "contexto_fifa": {
        "visible": true,
        "nivel": "azul",
        "etiqueta": "CONTEXTO FIFA 2026",
        "texto": ""
      },
      "pie_tarjeta": {
        "fuentes": "",
        "programa": "CPES-IMSS · Copa Mundial FIFA 2026",
        "version": "",
        "institucional": "Gobierno de México · IMSS",
        "qr_url": "https://cvoed.imss.gob.mx"
      }
    }
  },

  "render": {
    "formatos_activos": ["html"],
    "html": {
      "idioma": "es-MX",
      "dependencias_externas": false,
      "responsive": true,
      "accesibilidad": { "aria_labels": true, "semantica_html5": true },
      "interaccion": { "boton_imprimir": true, "boton_whatsapp": true }
    }
  }
}
```

---

## 12. CHECKLIST DE VALIDACIÓN PARA EL AGENTE

Antes de entregar el archivo generado, valida TODOS estos criterios. Si alguno falla, corrige antes de entregar.

### A. Estructura de datos

| # | Validación | Expresión | Obligatorio |
|---|-----------|-----------|-------------|
| A1 | Código de tarjeta presente | `metadatos.codigo !== ""` | Sí |
| A2 | Exactamente 5 pasos | `contenido.anverso.primeros_pasos.pasos.length === 5` | Sí |
| A3 | Al menos 1 paso crítico | `pasos.filter(p => p.critico).length >= 1` | Sí |
| A4 | Verbos en imperativo | Primera palabra de cada `accion` es verbo imperativo | Sí |
| A5 | Comunicaciones ≥ 4 filas, CVOED al final | `filas.length >= 4 && filas.at(-1).destinatario === "CVOED"` | Sí |
| A6 | Escalamiento 3-5 items | `3 <= items.length <= 5` | Sí |
| A7 | Teléfono CVOED = `55 5262 5368` | Literal inmutable | Sí |
| A8 | Contexto FIFA con dato cuantificable | `texto` contiene % o cifra | Sí |
| A9 | Pie cita guía CPES | `fuentes` contiene clave de bloque | Sí |

### B. Diseño visual

| # | Validación | Obligatorio |
|---|-----------|-------------|
| B1 | Franja encabezado usa guinda→verde IMSS | Sí |
| B2 | Ningún color institucional en cuerpo funcional | Sí |
| B3 | Toda información visual tiene doble codificación (color + forma) | Sí |
| B4 | Funciona en escala de grises (formas distinguibles sin color) | Sí |
| B5 | Cero emojis como indicadores funcionales | Sí |
| B6 | Cero dependencias externas (fonts, CDN, frameworks) | Sí |
| B7 | Tipografía de sistema: stack `system-ui` | Sí |

### C. Accesibilidad

| # | Validación | Nivel WCAG |
|---|-----------|-----------|
| C1 | Contraste texto principal ≥ 4.5:1 | AA |
| C2 | Contraste texto secundario ≥ 4.5:1 | AA |
| C3 | `role="alert"` en alerta crítica | A |
| C4 | `scope="col"` en todas las `<th>` | A |
| C5 | `aria-label` en elementos interactivos y landmarks | AA |
| C6 | Estructura semántica HTML5 (article, header, section, footer) | A |
| C7 | `lang="es-MX"` en `<html>` | A |
| C8 | Información nunca transmitida solo por color | A |

### D. Formato específico

| # | Validación | Formato |
|---|-----------|---------|
| D1 | `@media print` oculta botones de acción | HTML |
| D2 | `@page size: A5 landscape` en print CSS | HTML |
| D3 | `@media (max-width: 480px)` oculta columna 4 de tabla comms | HTML |
| D4 | Tamaño página A5 landscape, márgenes 8mm | PDF |
| D5 | Tipografía mínima 7pt pie, 9pt cuerpo | PDF/DOCX |
| D6 | QR mínimo 20×20mm | PDF/DOCX |
| D7 | Salto de página entre anverso y reverso | DOCX |

---

## 13. CATÁLOGO DE 21 TARJETAS

| Código | Bloque | Rol | Función SCI-H | Nivel | Borde lateral |
|--------|--------|-----|---------------|-------|---------------|
| TA-B1-01 | B1 | Director de Hospital / Máxima autoridad presente | Mando | avanzado | `#691C32` |
| TA-B1-02 | B1 | Jefe de Turno — Primer Respondedor | Mando | intermedio | `#691C32` |
| TA-B1-03 | B1 | Comandante del Incidente (CI) | Mando | avanzado | `#691C32` |
| TA-B1-04 | B1 | Enlace CVOED — Notificación externa | Enlace | intermedio | `#691C32` |
| TA-B2-01 | B2 | Jefa/e de Piso — Evacuación | Operaciones | intermedio | `#B45309` |
| TA-B2-02 | B2 | Brigada de Evacuación — Líder | Operaciones | base | `#B45309` |
| TA-B2-03 | B2 | Médico de Guardia UCI — Grupos 3-4-5 | Operaciones | intermedio | `#B45309` |
| TA-B2-04 | B2 | Terapeuta Respiratorio — Soporte vital portátil | Operaciones | intermedio | `#B45309` |
| TA-B2-05 | B2 | Trabajo Social — Pacientes con discapacidad y familias | Operaciones | base | `#B45309` |
| TA-B3-01 | B3 | Director del Hospital / Comandante SMV | Mando | avanzado | `#C41E3A` |
| TA-B3-02 | B3 | Médico de Triage — Binomio Médico-Enfermería | Operaciones | intermedio | `#C41E3A` |
| TA-B3-03 | B3 | Jefe de Enfermería de Urgencias | Operaciones | intermedio | `#C41E3A` |
| TA-B3-04 | B3 | Responsable de Logística SMV | Logística | intermedio | `#C41E3A` |
| TA-B3-05 | B3 | Vocero Único — Comunicación interna y externa | Información_Pública | avanzado | `#C41E3A` |
| TA-B4-01 | B4 | Jefe de Conservación y Mantenimiento — Falla eléctrica | Logística | intermedio | `#4A5568` |
| TA-B4-02 | B4 | Responsable de Sistemas / TI — Falla tecnológica | Logística | intermedio | `#4A5568` |
| TA-B4-03 | B4 | Jefe de Abasto — Continuidad de insumos críticos | Logística | intermedio | `#4A5568` |
| TA-B5-01 | B5 | Médico de Urgencias — Primer contacto QBRNE | Operaciones | intermedio | `#6B21A8` |
| TA-B5-02 | B5 | Enfermería de Triaje — Sospecha QBRNE | Operaciones | base | `#6B21A8` |
| TA-B5-03 | B5 | Responsable de Zona de Descontaminación | Operaciones | intermedio | `#6B21A8` |
| TA-B5-04 | B5 | Oficial de Seguridad — Control de acceso QBRNE | Seguridad | intermedio | `#6B21A8` |

---

## 14. ANTI-PATRONES — LO QUE EL AGENTE NO DEBE HACER

| # | Anti-patrón | Por qué es incorrecto |
|---|------------|----------------------|
| 1 | Usar Google Fonts (`<link href="fonts.googleapis.com">`) | Falla en redes hospitalarias con firewall |
| 2 | Usar emojis como indicadores funcionales (⚠️ 📞 🏟️) | Renderizado inconsistente entre SO/impresoras |
| 3 | Usar Bootstrap, Tailwind, o cualquier framework CSS | Dependencia externa innecesaria, peso excesivo |
| 4 | Color institucional (guinda/verde IMSS) en el cuerpo funcional | Compite con colores funcionales ISO 3864 |
| 5 | Información transmitida solo por color sin forma geométrica | Falla para daltonismo (8% hombres) y print B&N |
| 6 | Fondo rojo sólido con texto blanco en el cuerpo de la tarjeta | Reservado exclusivamente para encabezado institucional |
| 7 | Textos menores a 9pt en cuerpo o 7pt en pie (impreso) | Ilegible post-laminado mate |
| 8 | `<div>` donde existe elemento semántico HTML5 | Viola accesibilidad WCAG 2.2 |
| 9 | Omitir `role="alert"` en alerta crítica | Lectores de pantalla no anunciarán la alerta |
| 10 | Modificar teléfono CVOED `55 5262 5368` | Dato institucional inmutable |
| 11 | Generar formato sin validar checklist sección 12 | Puede producir tarjeta no conforme |
| 12 | Usar `float` en lugar de `flexbox` para layout | Layout frágil, problemas de alineación |
| 13 | Añadir animaciones decorativas | Las tarjetas son herramientas de emergencia, no material promocional |
| 14 | Incluir ornamentación, texturas decorativas o viñetas florales | Contradice principio Rams: "tan poco diseño como posible" |

---

## 15. GLOSARIO TÉCNICO

| Término | Definición | Contexto de uso |
|---------|-----------|----------------|
| **SCI-H** | Sistema de Comando de Incidentes Hospitalario (basado en OPS/OMS) | Estructura organizacional de respuesta |
| **ACV** | Área de Concentración de Víctimas | Zona física donde se realiza triage |
| **CI** | Comandante del Incidente | Persona que lidera la respuesta |
| **CVOED** | Centro Virtual de Operaciones en Emergencias y Desastres | Centro de coordinación IMSS 24/7 |
| **PC** | Puesto de Comando | Ubicación física del CI |
| **SMV-H** | Saldo Masivo de Víctimas Hospitalario | Guía para eventos con múltiples heridos |
| **QBRNE** | Químico, Biológico, Radiológico, Nuclear, Explosivo | Amenazas especiales |
| **BCP-H** | Plan de Continuidad de Operaciones Hospitalario | Guía para fallas de infraestructura |
| **EVAC-H** | Evacuación Hospitalaria | Guía de evacuación |
| **PH-RED** | Plan Hospitalario de Respuesta a Emergencias y Desastres | Marco general |
| **START** | Simple Triage and Rapid Treatment | Sistema de triage prehospitalario |
| **CRUM** | Centro Regulador de Urgencias Médicas | Coordinación prehospitalaria |
| **Triage** | Clasificación de pacientes por prioridad de atención | Proceso clínico en emergencia |
| **ISO 3864** | Norma de colores y formas para señales de seguridad | Base del sistema cromático funcional |
| **ISO 7010** | Norma de símbolos gráficos de seguridad | Referencia para pictogramas |
| **WCAG 2.2** | Web Content Accessibility Guidelines | Estándar de accesibilidad web |
| **Doble codificación** | Color + forma geométrica para transmitir la misma información | Accesibilidad para daltonismo y print B&N |

---

## 16. VERSIONADO

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2026-02-26 | Esquema original con verde IMSS #006847, Google Fonts, emojis |
| 2.0 | 2026-02-27 | Rediseño Rams-Ive: identidad GobMx 2024-2030, ISO 3864 funcional, doble codificación, system fonts, cero dependencias, WCAG AAA, instrucciones multi-formato, responsive |

---

*Especificación generada por: CPES-IMSS · Programa de Microaprendizaje · Copa Mundial FIFA 2026*
*Sistema de diseño: Síntesis Rams-Ive para emergencias hospitalarias v2.0*
*Estándares: ISO 3864-1 · ISO 7010:2019 · WCAG 2.2 · Manual Identidad GobMx 2024-2030 · Manual IMSS-Bienestar 2024*
