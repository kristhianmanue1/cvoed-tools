# Changelog - CVOED-Tools

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [1.1.0] - 2026-03-03

### Added
- Reorganización modular del código (ece-des/, dashboard/, tarjetas/, shared/)
- Sistema de migraciones de base de datos
- Código compartido extraído (utils.js, tokens.css)
- Scripts de utilidad (build.sh, verify-portability.sh)
- Documentación técnica V2 completa

### Changed
- Build system actualizado con soporte /*shared*/
- Eliminados ES6 modules para portabilidad
- Mejoras de seguridad XSS

### Fixed
- Corregido bug de rutas relativas en build.js
- Optimización de IndexedDB con throttling

## [1.0.0] - 2026-02-XX

### Added
- Release inicial para IMSS FIFA 2026
- 7 aplicaciones HTML5 portátiles
- ECE-DES: Expediente Clínico Electrónico
- Dashboard de reportes
- Motor de impresión de tarjetas START