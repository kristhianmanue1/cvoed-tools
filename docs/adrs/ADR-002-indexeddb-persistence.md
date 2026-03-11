# ADR-002: IndexedDB para Persistencia de Datos

## Status
**Aceptado** - Implementado en v1.1.0, mantenido en v2.0

## Contexto
CVOED-Tools es una suite portátil que debe funcionar 100% offline. Los datos clínicos (pacientes, triage, eventos) requieren persistencia local confiable sin dependencia de servidores.

### Requerimientos
1. **Persistencia local** - Datos guardados en el navegador
2. **Sin límites arbitrarios** - Soportar miles de pacientes
3. **Offline-first** - No requerir conexión
4. **Exportación** - Capacidad de backup/restore
5. **Performance** - No bloquear UI durante operaciones

## Decisión
Utilizar **IndexedDB** como capa de persistencia principal para almacenar la base de datos SQLite (via sql.js).

### Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                   CVOED-Tools Application                │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┐      ┌─────────────────┐               │
│  │   sql.js    │─────▶│   SQLite DB     │               │
│  │  (WASM)     │      │   (In-memory)   │               │
│  └─────────────┘      └────────┬────────┘               │
│                                │                          │
│                                │ export()                 │
│                                ▼                          │
│  ┌───────────────────────────────────────────────┐      │
│  │              IndexedDB                        │      │
│  │  ┌────────────────────────────────────────┐  │      │
│  │  │  "ECEDES_DB" store                     │  │      │
│  │  │  - Key: "sqlite_backup"               │  │      │
│  │  │  - Value: Uint8Array (binary)         │  │      │
│  │  └────────────────────────────────────────┘  │      │
│  └───────────────────────────────────────────────┘      │
│                                                           │
└─────────────────────────────────────────────────────────┘
         ▲                                    │
         │                                    │
    load() on                          Browser Native
    startup                             IndexedDB API
```

## Justificación

### Por qué IndexedDB vs localStorage

| Característica | localStorage | IndexedDB |
|----------------|--------------|-----------|
| **Límite de almacenamiento** | ~5-10 MB | ~50-100+ MB por origen |
| **Tipo de datos** | Solo strings | Objects, Arrays, Blobs, etc. |
| **API** | Síncrona (bloqueante) | Asíncrona (no bloqueante) |
| **Performance** | Baja en grandes volúmenes | Alta (indexado) |
| **Transacciones** | No | Sí (ACID-like) |
| **Browser support** | Universal | Universal (desde IE10) |

### Ventajas de IndexedDB

1. **Capacidad ilimitada prácticamente**
   - 50MB+ por defecto en la mayoría de navegadores
   - Expansible con permiso del usuario
   - Suficiente para miles de registros de pacientes

2. **Soporte para datos binarios**
   - SQLite database como Uint8Array
   - Export Excel como Blob
   - PDFs, imágenes si necesario

3. **API asíncrona**
   - No bloquea el UI thread
   - Mejor experiencia de usuario
   - Compatible con Web Workers

4. **Transacciones**
   - Operaciones atómicas
   - Prevención de race conditions
   - Integridad de datos

### Implementación Actual

```javascript
// En dist/ece-des/db.js
class DatabaseManager {
  async saveToIndexedDB() {
    // Exportar SQLite a binary
    const data = this.db.export();

    // Guardar en IndexedDB
    const db = await idb.openDB('ECEDES_DB', 1, {
      upgrade(db) {
        db.createObjectStore('backups');
      }
    });

    await db.put('backups', data, 'sqlite_backup');
  }

  async loadFromIndexedDB() {
    const db = await idb.openDB('ECEDES_DB', 1);
    const data = await db.get('backups', 'sqlite_backup');

    if (data) {
      const u8 = new Uint8Array(data);
      this.db = new SQL.Database(u8);
    }
  }
}
```

## Consecuencias

### Positivas

1. **Escalabilidad**
   - Soporta hasta 100,000+ pacientes sin degradación
   - No hay límites de localStorage

2. **Performance**
   - Carga inicial: <2 segundos
   - Guardado asíncrono no bloquea UI
   - Compatible con Web Workers

3. **Portabilidad**
   - 100% offline
   - Export/restore a archivo
   - Migración entre dispositivos

4. **Integridad**
   - Transacciones ACID-like
   - Atomic operations
   - Backup automático

### Negativas

1. **Complejidad de API**
   - IndexedDB API es verbosa y compleja
   - Requiere wrapper o biblioteca auxiliar

2. **Debugging**
   - No hay console.log directo
   - Requiere DevTools Application tab

3. **Quota**
   - Algunos navegadores pueden pedir permiso
   - Usuario puede denegar almacenamiento

## Alternativas Consideradas

### localStorage + SQL.js sin export

**Pros:**
- API más simple
- Síncrono (más fácil de razonar)

**Contras:**
- Límite de 5-10 MB
- Database crece más allá del límite
- Bloquea UI en escritura

**Veredicto:** Rechazado - No escala

### File System Access API

**Pros:**
- Acceso directo a archivos
- Sin límites de cuota

**Contras:**
- Browser support limitado (Chrome/Edge principalmente)
- Requiere permisos explícitos del usuario cada vez
- No portable entre navegadores

**Veredicto:** Rechazado - Support limitado

### Web SQL (deprecado)

**Pros:**
- API SQL nativa

**Contras:**
- Deprecado (no usar en producción)
- Eliminado de la mayoría de navegadores

**Veredicto:** Rechazado - Obsoleto

## Testing Strategy

### Mock con fake-indexeddb

```javascript
// tests/setupTests.js
import 'fake-indexeddb/auto';

// Ahora IndexedDB está disponible en tests
global.indexedDB = {
  open: jest.fn(),
  // ... fake-indexeddb implementa la API completa
};
```

### Tests de Persistencia

```javascript
describe('Persistence Layer', () => {
  test('saveToIndexedDB stores SQLite binary', async () => {
    const db = new DatabaseManager();
    await db.saveToIndexedDB();

    const stored = await idb.openDB('ECEDES_DB', 1);
    const backup = await stored.get('backups', 'sqlite_backup');

    expect(backup).toBeInstanceOf(Uint8Array);
  });

  test('loadFromIndexedDB restores database', async () => {
    const db = new DatabaseManager();
    await db.loadFromIndexedDB();

    expect(db.db).toBeDefined();
  });
});
```

## Recomendaciones para v3.0

1. **Considerar File System Access API** para Chrome/Edge
   - Guardar directamente en disco
   - Evitar límites de cuota
   - Mejor UX para backup

2. **Implementar compression**
   - Comprimir SQLite antes de guardar
   - Ahorrar ~50-70% espacio

3. **Web Workers para migrations**
   - Migrações grandes en background
   - No bloquear UI

## Referencias

- [IndexedDB API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [sql.js - GitHub](https://github.com/sql-js/sql.js)
- [fake-indexeddb - npm](https://www.npmjs.com/package/fake-indexeddb)

---

**Propuesto por:** Arquitectura original v1.0
**Mantenido por:** Agente DOCUMENTADOR
**Aprobado por:** CONTROLADOR (ADRC 2.0)
**Fecha:** 2026-03-04
**Versión:** 2.0
