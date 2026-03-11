# Contributing to CVOED-Tools

¡Gracias por tu interés en contribuir a CVOED-Tools! Este documento proporciona directrices y estándares para contribuir al proyecto.

---

## 👥 Autores del Proyecto

**Dra. Carla Abril Perez Becerril**
- Coordinación de Proyectos Especiales en Salud (CPES)
- IMSS - Instituto Mexicano del Seguro Social
- Especialista en Medicina de Emergencia y Desastres

**Kristhian Manuel Jiménez Sánchez**
- Lead Developer & Software Architect
- IMSS - Instituto Mexicano del Seguro Social
- Especialista en Desarrollo Frontend y Sistemas de Información Hospitalaria

---

## 📜 Código de Conducta

Al participar en este proyecto, te comprometes a:

- Respetar a todos los contribuidores
- Ser inclusivo y acogedor
- Fomentar un ambiente colaborativo
- Aceptar críticas constructivas
- Enfocarse en lo mejor para la comunidad

---

## 🤝 Cómo Contribuir

### Reportar Bugs

1. Verifica que el bug no haya sido reportado
2. Usa el [Issue Tracker](https://github.com/IMSS-CPES/cvoed-tools/issues)
3. Incluye:
   - Título descriptivo
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Capturas de pantalla si aplica
   - Información del sistema (navegador, OS)

### Sugerir Features

1. Abre un Issue con la etiqueta `enhancement`
2. Explica el caso de uso claramente
3. Propone una solución si es posible
4. Considera el impacto en el sistema offline-first

### Enviar Pull Requests

1. **Fork** el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios con mensajes claros
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

---

## 📋 Estándares de Código

### JavaScript

- Usa ES2022+ features
- Sigue el estilo definido en `.eslintrc.js`
- Agrega JSDoc para funciones públicas
- Testing coverage >85% requerido

```javascript
/**
 * Registra un nuevo paciente en el sistema ECE-DES
 * @param {Object} patientData - Datos del paciente
 * @param {string} patientData.nombre - Nombre completo
 * @param {string} patientData.triage - Nivel de triage START
 * @returns {Promise<string>} Folio del paciente registrado
 */
async function registerPatient(patientData) {
  // Implementation
}
```

### HTML

- Usa HTML5 semántico
- Incluye metadatos de accesibilidad (ARIA)
- Comentarios de autoría requeridos:

```html
<!--
 CVOED-Tools - Suite Portátil de Herramientas Hospitalarias
 Componente: [Nombre del Componente]
 Autores: Dra. Carla Abril Perez Becerril, Kristhian Manuel Jiménez Sánchez
 Licencia: Apache License 2.0
 Contexto: Copa Mundial FIFA 2026 - IMSS CPES
 Fecha: [YYYY-MM-DD]
-->
<!DOCTYPE html>
<html lang="es-MX">
...
```

### CSS

- Usa variables CSS (custom properties)
- Sigue el sistema de tokens v2.0
- WCAG 2.2 AAA compliance (7:1+ contraste)
- Mobile-first responsive design

---

## 🧪 Testing

### Requisitos de Cobertura

| Métrica | Mínimo | Objetivo |
|---------|--------|----------|
| Statements | 70% | 85% |
| Branches | 60% | 70% |
| Functions | 70% | 75% |
| Lines | 70% | 85% |

### Tipos de Tests

1. **Unit Tests**: Lógica de negocio pura
2. **Integration Tests**: Módulos interactuando
3. **E2E Tests**: Flujos de usuario completos
4. **Performance Tests**: Tiempo de carga y renderizado

```bash
# Ejecutar tests
npm test

# Con coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

---

## 📝 Estilo de Commits

Usa mensajes de commit claros y descriptivos:

```
feat(ece-des): agregar validación de CURP

• Agrega validación de CURP en formulario de registro
• Implementa validación regex según estándar mexicano
• Agrega tests unitarios para validación

Closes #123
```

**Tipos permitidos:**
- `feat`: Nueva funcionalidad
- `fix`: Bug fix
- `docs`: Cambios en documentación
- `style`: Formato, missing semi colons, etc.
- `refactor`: Refactorización de código
- `test`: Agregar o actualizar tests
- `chore`: Actualizar tareas de build, config, etc.

---

## 🌐 Internacionalización

Este proyecto está en **español (México)**:
- Usa español en comentarios
- Terminología médica en español
- Fechas en formato DD/MM/YYYY
- Números con formato local de México

---

## ♿ Accesibilidad

### Requisitos Mínimos

- **Contraste:** WCAG AAA (7:1+)
- **Navegación:** Teclado completo
- **Lectores de pantalla:** ARIA labels
- **Texto:** Escalable sin romper layout

### Testing de Accesibilidad

```bash
# Verificar contraste
npm run test:a11y

# Verificar con linter
npm run lint:a11y
```

---

## 📦 Estructura del Proyecto

```
cvoed-tools/
├── src/                    # Código fuente
│   ├── ece-des/           # Módulo ECE-DES
│   ├── dashboard/         # Módulo Dashboard
│   ├── simulador/         # Módulo Simulador
│   ├── tarjetas/          # Módulo Tarjetas
│   ├── shared/            # Utilidades compartidas
│   └── config/            # Configuración
├── tests/                  # Tests
│   ├── unit/              # Unitarios
│   ├── integration/       # Integración
│   ├── e2e/               # End-to-end
│   └── performance/       # Rendimiento
├── docs/                   # Documentación
└── tools/                  # Scripts de utilidad
```

---

## 🔨 Proceso de Desarrollo

### Flujo de Trabajo

1. **Issue**: Abre o asigna un issue
2. **Branch**: Crea rama desde `develop`
3. **Develop**: Implementa con tests
4. **Test**: Ejecuta suite completa
5. **PR**: Abre Pull Request
6. **Review**: Espera aprobación
7. **Merge**: Merge a `develop`
8. **Deploy**: Deploy a `main` para release

### Branches

- `main`: Producción estable
- `develop`: Desarrollo activo
- `feature/*`: Nuevas features
- `fix/*`: Bug fixes
- `hotfix/*`: Fixes urgentes en producción
- `release/*`: Preparación de release

---

## 🚀 Release Process

### Versionado

Usamos [Semantic Versioning](https://semver.org/):
- **MAJOR**: Cambios breaking
- **MINOR**: Nuevas features backwards-compatible
- **PATCH**: Bug fixes backwards-compatible

### Checklist de Release

- [ ] Todos los tests pasan
- [ ] Cobertura >85%
- [ ] Documentación actualizada
- [ ] CHANGELOG.md actualizado
- [ ] Licencia verificada
- [ ] Créditos de autores incluidos
- [ ] Tested en Chrome, Firefox, Safari, Edge
- [ ] Verificado modo offline

---

## 📞 Contacto

Para preguntas sobre contribuciones:
- **Issues:** [GitHub Issues](https://github.com/IMSS-CPES/cvoed-tools/issues)
- **Email:** cpes@imss.gob.mx
- **Discusiones:** [GitHub Discussions](https://github.com/IMSS-CPES/cvoed-tools/discussions)

---

## 📄 Licencia

Al contribuir, acuerdas que tus contribuciones serán licenciadas bajo la **Apache License 2.0**.

---

## 🙏 Agradecimientos

Gracias a todos los contribuidores que hacen posible CVOED-Tools:

- Dra. Carla Abril Perez Becerril
- Kristhian Manuel Jiménez Sánchez
- Y todos los contribuidores de la comunidad

---

**¿Listo para contribuir?** Empieza buscando [Issues con label "good first issue"](https://github.com/IMSS-CPES/cvoed-tools/labels/good%20first%20issue)

**Creado por:** Dra. Carla Abril Perez Becerril & Kristhian Manuel Jiménez Sánchez
**Licencia:** Apache License 2.0
