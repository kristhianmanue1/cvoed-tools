# Architecture Decision Records - CVOED-Tools

Este directorio contiene los Architecture Decision Records (ADRs) que documentan las decisiones arquitectónicas significativas tomadas en CVOED-Tools.

## ¿Qué es un ADR?

Un Architecture Decision Record es:
- Un documento que describe una decisión arquitectónica significativa
- El contexto y las razones detrás de la decisión
- Las consecuencias de adoptar esa decisión
- Las alternativas consideradas

## ADRs de CVOED-Tools

### Aceptados

| ID | Título | Fecha | Estado |
|----|--------|-------|--------|
| [ADR-001](ADR-001-jest-testing-framework.md) | Jest Testing Framework | 2026-03-04 | ✅ Aceptado |
| [ADR-002](ADR-002-indexeddb-persistence.md) | IndexedDB para Persistencia | 2026-03-04 | ✅ Aceptado |
| [ADR-003](ADR-003-inline-architecture.md) | Arquitectura Inline/Autocontenida | 2026-03-04 | ✅ Aceptado |

## Plantilla de ADR

```markdown
# ADR-XXX: [Título de la Decisión]

## Status
[Propuesto/Aceptado/Deprecado/Reemplazado]

## Contexto
[Descripción del problema o situación que requiere una decisión]

## Decisión
[Descripción de la decisión tomada y su justificación]

## Consecuencias
- Positivas: [beneficios]
- Negativas: [costos o desventajas]

## Alternativas Consideradas
1. [Alternativa 1] - [Por qué no fue seleccionada]
2. [Alternativa 2] - [Por qué no fue seleccionada]

## Referencias
- [Links a recursos relevantes]
```

## Proceso de Creación de ADRs

1. **Propuesta**: Crear un ADR con status "Propuesto"
2. **Discusión**: Presentar al equipo para feedback
3. **Decisión**: Cambiar status a "Aceptado" o "Rechazado"
4. **Documentación**: Actualizar referencias en README y documentación

## Referencias

- [Michael Nygard's Architecture Decision Records](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ADR template by ThoughtWorks](https://www.thoughtworks.com/radar/techniques/pull-request)

---

*Última actualización: 2026-03-04*
