// ECE-DES Aplicación Principal
// db-migrations.js se carga antes en el HTML, así que las funciones están disponibles
// config.js se carga antes en el HTML, así que CONFIG está disponible

const app = {
  db: null,
  session: {
    hospital: "",
    operador: "",
    rol: "",
    ingreso: null,
  },

  // Throttling para IndexedDB
  saveTimeout: null,
  saveThrottleMs: 2000, // Esperar 2s después del último cambio

  async init() {
    // Usar CONFIG para logging
    if (window.CONFIG) {
      CONFIG.info("Inicializando ECE-DES...", {
        NODE_ENV: CONFIG.NODE_ENV,
        DB_NAME: CONFIG.DB_NAME,
        DEBUG_MODE: CONFIG.DEBUG_MODE,
      });
    } else {
      console.log("Inicializando ECE-DES...");
    }

    // Inicializar estado del indicador de guardado
    const saveStatus = document.getElementById("save-status");
    if (saveStatus) {
      saveStatus.textContent = "";
    }

    // Debug info sobre el ambiente
    if (window.CONFIG && CONFIG.DEBUG_MODE) {
      CONFIG.debug("Configuración cargada", {
        NODE_ENV: CONFIG.NODE_ENV,
        DB_NAME: CONFIG.DB_NAME,
        PIN_HASHING: CONFIG.PIN_HASHING,
        WEB_WORKERS: CONFIG.WEB_WORKERS,
      });
    }

    // Cargar WASM de SQLite
    const config = {};
    if (window.SQL_WASM_URI) {
      config.locateFile = () => window.SQL_WASM_URI;
    }

    const SQL = await initSqlJs(config);

    // Intentar restaurar desde IndexedDB
    const savedData = await this.loadFromIndexedDB();
    if (savedData) {
      this.db = new SQL.Database(savedData);

      // Ejecutar migraciones automáticas
      try {
        const oldVersion = getDBVersion(this.db);
        if (oldVersion < DB_SCHEMA_VERSION) {
          // Backup antes de migrar
          _backupDatabaseForMigration(this.db);

          // Ejecutar migraciones
          const newVersion = _migrateDatabase(this.db);
          console.log(`Migración completada: v${oldVersion} -> v${newVersion}`);

          // Guardar versión migrada
          this.saveToIndexedDB();
        }
      } catch (e) {
        console.error("Error en migración:", e);
        alert("Error migrando base de datos. Se descargó un backup automáticamente.");
        throw e;
      }

      console.log("Base de datos restaurada desde IndexedDB.");
    } else {
      this.db = new SQL.Database();
      this.createSchema();

      // Inicializar versión
      _migrateDatabase(this.db);

      this.saveToIndexedDB();
      console.log("Base de datos nueva creada.");
    }

    this.checkSession();
  },

  createSchema() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS pacientes (
        id_interno TEXT PRIMARY KEY,
        folio_local TEXT UNIQUE,
        nombre TEXT,
        nss TEXT,
        edad_estimada INTEGER,
        sexo TEXT CHECK(sexo IN ('M','F','I')),
        pulsera_id TEXT,
        discapacidad TEXT,
        triage_inicial TEXT,
        triage_actual TEXT,
        area_actual TEXT,
        estado TEXT,
        procedencia TEXT,
        ts_ingreso TEXT NOT NULL,
        ts_ultima_mod TEXT,
        operador_registro TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS trazabilidad (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_paciente TEXT NOT NULL REFERENCES pacientes(id_interno),
        ts_evento TEXT NOT NULL,
        tipo_evento TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        valor_anterior TEXT,
        valor_nuevo TEXT,
        operador TEXT NOT NULL,
        area TEXT
      );
      
      CREATE TABLE IF NOT EXISTS operadores (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        rol TEXT NOT NULL,
        turno TEXT,
        pin_hash TEXT,
        activo INTEGER DEFAULT 1,
        ts_login TEXT
      );
      
      CREATE TABLE IF NOT EXISTS auditoria (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts TEXT NOT NULL,
        operador TEXT NOT NULL,
        accion TEXT NOT NULL,
        tabla_ref TEXT,
        id_ref TEXT,
        detalle TEXT
      );
    `);
  },

  // Manejo IndexedDB para persistir los UInt8Arrays (soporta > 5MB, a diferencia de localStorage)
  saveToIndexedDB() {
    // Clear timeout anterior
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Mostrar indicador "Guardando..."
    const saveStatus = document.getElementById("save-status");
    if (saveStatus) {
      saveStatus.textContent = "Guardando...";
      saveStatus.style.color = "var(--fn-azul)";
    }

    // Programar nuevo save
    this.saveTimeout = setTimeout(() => {
      this._performSave();
    }, this.saveThrottleMs);
  },

  _performSave() {
    return new Promise((resolve, reject) => {
      // Usar CONFIG.DB_NAME si está disponible, sino fallback
      const dbName = window.CONFIG ? CONFIG.DB_NAME : "ECEDES_DB";
      const dbVersion = window.CONFIG ? CONFIG.DB_VERSION : 1;

      if (window.CONFIG) {
        CONFIG.debug("Guardando en IndexedDB", { dbName, dbVersion });
      }

      const request = indexedDB.open(dbName, dbVersion);
      request.onupgradeneeded = e => {
        const idb = e.target.result;
        if (!idb.objectStoreNames.contains("sqlite_backup")) {
          idb.createObjectStore("sqlite_backup");
        }
      };
      request.onsuccess = e => {
        const idb = e.target.result;
        const tx = idb.transaction("sqlite_backup", "readwrite");
        const store = tx.objectStore("sqlite_backup");
        const data = this.db.export();
        store.put(data, "latest");
        tx.oncomplete = () => {
          idb.close();

          // Mostrar indicador "✓ Guardado"
          const saveStatus = document.getElementById("save-status");
          if (saveStatus) {
            saveStatus.textContent = "✓ Guardado";
            saveStatus.style.color = "var(--fn-verde)";
            // Ocultar después de 3 segundos
            setTimeout(() => {
              if (saveStatus.textContent === "✓ Guardado") {
                saveStatus.textContent = "";
              }
            }, 3000);
          }

          if (window.CONFIG) {
            CONFIG.debug("Guardado completado");
          }

          resolve();
        };
        tx.onerror = err => {
          const errorMsg = `Error al guardar en IndexedDB: ${err}`;
          if (window.CONFIG) {
            CONFIG.error(errorMsg, err);
          } else {
            console.error(errorMsg);
          }
          reject(err);
        };
      };
      request.onerror = e => {
        const errorMsg = "Error al abrir IndexedDB";
        if (window.CONFIG) {
          CONFIG.error(errorMsg, e);
        } else {
          console.error(errorMsg, e);
        }
        reject(e);
      };
    });
  },

  async loadFromIndexedDB() {
    return new Promise(resolve => {
      // Usar CONFIG.DB_NAME si está disponible
      const dbName = window.CONFIG ? CONFIG.DB_NAME : "ECEDES_DB";
      const dbVersion = window.CONFIG ? CONFIG.DB_VERSION : 1;

      if (window.CONFIG) {
        CONFIG.debug("Cargando desde IndexedDB", { dbName });
      }

      const request = indexedDB.open(dbName, dbVersion);
      request.onupgradeneeded = e => {
        const idb = e.target.result;
        if (!idb.objectStoreNames.contains("sqlite_backup")) {
          idb.createObjectStore("sqlite_backup");
        }
      };
      request.onsuccess = e => {
        const idb = e.target.result;
        const tx = idb.transaction("sqlite_backup", "readonly");
        const store = tx.objectStore("sqlite_backup");
        const getReq = store.get("latest");
        getReq.onsuccess = () => {
          idb.close();
          if (window.CONFIG && getReq.result) {
            CONFIG.debug("Datos cargados desde IndexedDB");
          }
          resolve(getReq.result);
        };
        getReq.onerror = () => {
          idb.close();
          if (window.CONFIG) {
            CONFIG.warn("Error al cargar desde IndexedDB, iniciando con DB vacía");
          }
          resolve(null);
        };
      };
      request.onerror = () => {
        if (window.CONFIG) {
          CONFIG.warn("Error al abrir IndexedDB, iniciando con DB vacía");
        }
        resolve(null); // Fallback a nueva DB
      };
    });
  },

  // Audit macro
  audit(accion, tabla_ref, id_ref, detalle) {
    this.db.run(
      "INSERT INTO auditoria (ts, operador, accion, tabla_ref, id_ref, detalle) VALUES (?, ?, ?, ?, ?, ?)",
      [new Date().toISOString(), this.session.operador, accion, tabla_ref, id_ref, detalle]
    );
    // Guarda offline siempre que modifiquemos base de datos
    this.saveToIndexedDB();
  },

  // Autenticación
  checkSession() {
    const savedHospital = localStorage.getItem("ecedes_hospital");
    const savedOperador = localStorage.getItem("ecedes_operador");
    if (savedHospital && savedOperador) {
      this.session.hospital = savedHospital;
      this.session.operador = savedOperador;
      document.getElementById("nav-hospital").innerText = savedHospital;
      document.getElementById("nav-operador").innerText = savedOperador;
      this.showApp();
      this.renderCensus();
    } else {
      this.showLogin();
    }
  },

  login() {
    const hosp = document.getElementById("login-hospital").value;
    const oper = document.getElementById("login-operador").value;
    const pin = document.getElementById("login-pin").value;

    if (!hosp || !oper || !pin) {
      alert("Llena todos los campos.");
      return;
    }

    // Auth dummy: No passwords on emergency, record name + PIN locally.
    this.session.hospital = hosp;
    this.session.operador = oper;
    localStorage.setItem("ecedes_hospital", hosp);
    localStorage.setItem("ecedes_operador", oper);

    this.audit("LOGIN", "operadores", "SESSION", `Intento de acceso PIN length: ${pin.length}`);

    document.getElementById("nav-hospital").innerText = hosp;
    document.getElementById("nav-operador").innerText = oper;

    this.showApp();
    this.renderCensus();
  },

  logout() {
    localStorage.removeItem("ecedes_operador");
    window.location.reload();
  },

  showLogin() {
    document.getElementById("view-login").classList.remove("hidden");
    document.getElementById("view-app").classList.add("hidden");
  },

  showApp() {
    document.getElementById("view-login").classList.add("hidden");
    document.getElementById("view-app").classList.remove("hidden");
  },

  // Registro de base Censo (Counts)
  renderCensus() {
    const counts = {
      rojo: 0,
      amarillo: 0,
      verde: 0,
      negro: 0,
    };

    const query = "SELECT triage_actual, COUNT(*) as c FROM pacientes GROUP BY triage_actual";
    const stmt = this.db.prepare(query);
    while (stmt.step()) {
      const row = stmt.getAsObject();
      if (row.triage_actual === "ROJO") counts.rojo = row.c;
      if (row.triage_actual === "AMARILLO") counts.amarillo = row.c;
      if (row.triage_actual === "VERDE") counts.verde = row.c;
      if (row.triage_actual === "NEGRO") counts.negro = row.c;
    }
    stmt.free();

    document.getElementById("count-rojo").innerText = counts.rojo;
    document.getElementById("count-amarillo").innerText = counts.amarillo;
    document.getElementById("count-verde").innerText = counts.verde;
    document.getElementById("count-negro").innerText = counts.negro;

    this.renderPatientTable();
  },

  renderPatientTable() {
    const tbody = document.getElementById("patients-table-body");
    tbody.innerHTML = "";

    const query =
      "SELECT id_interno, folio_local, nombre, triage_actual, area_actual, ts_ingreso FROM pacientes ORDER BY ts_ingreso DESC";
    const stmt = this.db.prepare(query);
    while (stmt.step()) {
      const row = stmt.getAsObject();

      let badge = "";
      if (row.triage_actual === "ROJO") badge = '<span style="color:var(--fn-rojo)">◆ ROJO</span>';
      if (row.triage_actual === "AMARILLO")
        badge = '<span style="color:var(--fn-amarillo)">▲ AMARILLLO</span>';
      if (row.triage_actual === "VERDE")
        badge = '<span style="color:var(--fn-verde)">● VERDE</span>';
      if (row.triage_actual === "NEGRO")
        badge = '<span style="color:var(--fn-negro)">✚ NEGRO</span>';

      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid var(--border-light)";

      // Crear celdas individualmente con textContent (XSS-safe)
      const tdFolio = document.createElement("td");
      tdFolio.style.padding = "10px";
      tdFolio.textContent = row.folio_local;

      const tdNombre = document.createElement("td");
      tdNombre.style.padding = "10px";
      tdNombre.style.fontWeight = "bold";
      tdNombre.textContent = row.nombre || "NN";

      const tdTriage = document.createElement("td");
      tdTriage.style.padding = "10px";
      tdTriage.innerHTML = badge; // badge es HTML seguro (generado internamente)

      const tdArea = document.createElement("td");
      tdArea.style.padding = "10px";
      tdArea.textContent = row.area_actual || "-";

      const tdIngreso = document.createElement("td");
      tdIngreso.style.padding = "10px";
      tdIngreso.textContent = new Date(row.ts_ingreso).toLocaleTimeString();

      const tdAccion = document.createElement("td");
      tdAccion.style.padding = "10px";
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.style.cssText =
        "background:var(--inst-dorado); color:white; padding:5px 10px; font-size:0.8rem;";
      btn.textContent = "VER DETALLE";
      btn.onclick = () => app.openExpediente(row.id_interno);
      tdAccion.appendChild(btn);

      tr.append(tdFolio, tdNombre, tdTriage, tdArea, tdIngreso, tdAccion);
      tbody.appendChild(tr);
    }
    stmt.free();
  },

  // MODAL EXPEDIENTE (Trazabilidad)
  currentPatientId: null,

  openExpediente(internalId) {
    this.currentPatientId = internalId;
    const stmt = this.db.prepare("SELECT * FROM pacientes WHERE id_interno = ?");
    stmt.bind([internalId]);
    if (stmt.step()) {
      const p = stmt.getAsObject();
      document.getElementById("exp-folio").innerText = p.folio_local;
      document.getElementById("exp-nombre").innerText = p.nombre || "NN";
      const uuidParts = p.id_interno.split("-");
      document.getElementById("exp-uuid").innerText = uuidParts[0];
      document.getElementById("exp-ingresoTs").innerText = new Date(p.ts_ingreso).toLocaleString();

      let b = p.triage_actual;
      if (b === "ROJO") b = "◆ ROJO (Crítico)";
      if (b === "AMARILLO") b = "▲ AMARILLO (Urgente)";
      if (b === "VERDE") b = "● VERDE (Menor)";
      if (b === "NEGRO") b = "✚ NEGRO (S/Vida)";
      document.getElementById("exp-triage-badge").innerText = b;

      // Fill Hybrid Profile Form fields
      document.getElementById("perfil-edad").value = p.edad_estimada || "";
      document.getElementById("perfil-sexo").value = p.sexo || "";
      document.getElementById("perfil-nss").value = p.nss || "";
      document.getElementById("perfil-discapacidad").value = p.discapacidad || "";

      this.renderTimeline(internalId);
      document.getElementById("modal-expediente").classList.remove("hidden");
    }
    stmt.free();
  },

  savePatientProfile() {
    if (!this.currentPatientId) return;

    const edad = document.getElementById("perfil-edad").value || null;
    const sexo = document.getElementById("perfil-sexo").value || null;
    const nss = document.getElementById("perfil-nss").value || null;
    const disc = document.getElementById("perfil-discapacidad").value || null;

    try {
      this.db.run(
        "UPDATE pacientes SET edad_estimada=?, sexo=?, nss=?, discapacidad=?, ts_ultima_mod=? WHERE id_interno=?",
        [edad, sexo, nss, disc, new Date().toISOString(), this.currentPatientId]
      );

      this.audit("UPDATE", "pacientes", this.currentPatientId, "Perfil demográfico actualizado");
      this.renderCensus();
      alert("Perfil guardado en el expediente.");
    } catch (e) {
      console.error(e);
      alert("Error guardando el perfil. Verifique los datos ingresados.");
    }
  },

  printPatientBadge() {
    if (!this.currentPatientId) return;

    const stmt = this.db.prepare("SELECT * FROM pacientes WHERE id_interno = ?");
    stmt.bind([this.currentPatientId]);
    stmt.step();
    const p = stmt.getAsObject();
    stmt.free();

    document.getElementById("badge-folio").textContent = p.folio_local;
    document.getElementById("badge-nombre").textContent = p.nombre || "No Identificado (NN)";
    document.getElementById("badge-edad").textContent = p.edad_estimada
      ? `${p.edad_estimada} años`
      : "N/D";
    document.getElementById("badge-sexo").textContent = p.sexo || "N/D";
    document.getElementById("badge-nss").textContent = p.nss || "N/D";
    document.getElementById("badge-ingreso").textContent = new Date(p.ts_ingreso).toLocaleString(
      "es-MX"
    );
    document.getElementById("badge-alertas").textContent = p.discapacidad || "Ninguna registrada";

    const header = document.getElementById("badge-color-header");
    header.textContent = `TRIAGE ${p.triage_actual}`;
    if (p.triage_actual === "ROJO") {
      header.style.backgroundColor = "#C41E3A";
      header.style.color = "white";
    }
    if (p.triage_actual === "AMARILLO") {
      header.style.backgroundColor = "#D4940A";
      header.style.color = "black";
    }
    if (p.triage_actual === "VERDE") {
      header.style.backgroundColor = "#1B7340";
      header.style.color = "white";
    }
    if (p.triage_actual === "NEGRO") {
      header.style.backgroundColor = "#1A1A2E";
      header.style.color = "white";
    }

    document.body.classList.add("print-badge-mode");
    setTimeout(() => {
      window.print();
      document.body.classList.remove("print-badge-mode");
    }, 500);
  },

  renderTimeline(internalId) {
    const tl = document.getElementById("exp-timeline");
    tl.innerHTML = "";
    const stmt = this.db.prepare(
      "SELECT * FROM trazabilidad WHERE id_paciente = ? ORDER BY ts_evento DESC"
    );
    stmt.bind([internalId]);
    while (stmt.step()) {
      const ev = stmt.getAsObject();
      const div = document.createElement("div");
      div.style.marginBottom = "15px";
      div.style.position = "relative";

      // Crear estructura con DOM API (XSS-safe)
      const dot = document.createElement("div");
      dot.style.cssText =
        "position:absolute; left:-25px; top:5px; width:10px; height:10px; border-radius:50%; background:var(--inst-dorado);";

      const meta = document.createElement("div");
      meta.style.cssText = "font-size:0.8rem; color:var(--text-muted);";
      meta.textContent = `${new Date(ev.ts_evento).toLocaleString()} - ${ev.operador}`;

      const content = document.createElement("div");
      content.innerHTML = `<strong style='color:var(--inst-guinda);'>${this.escapeHTML(ev.tipo_evento)}:</strong> ${this.escapeHTML(ev.descripcion)}`;

      if (ev.valor_nuevo && ev.tipo_evento === "TRIAGE_CHANGE") {
        const span = document.createElement("span");
        span.style.cssText = "background:var(--bg-tertiary); padding:2px 5px; border-radius:3px;";
        span.textContent = `→ ${ev.valor_nuevo}`;
        content.appendChild(document.createTextNode(" "));
        content.appendChild(span);
      }

      div.append(dot, meta, content);
      tl.appendChild(div);
    }
    stmt.free();
  },

  addClinicalEvent() {
    if (!this.currentPatientId) return;
    const tipo = document.getElementById("action-tipo").value;
    const det = document.getElementById("action-detalle").value;
    if (!det && tipo !== "TRIAGE_CHANGE") {
      alert("Falta descripción.");
      return;
    }

    let valorNuevo = null;
    if (tipo === "TRIAGE_CHANGE") {
      const t = prompt("Nuevo Triage (R/A/V/N):");
      if (!t) return;
      if (t.toUpperCase() === "R") valorNuevo = "ROJO";
      if (t.toUpperCase() === "A") valorNuevo = "AMARILLO";
      if (t.toUpperCase() === "V") valorNuevo = "VERDE";
      if (t.toUpperCase() === "N") valorNuevo = "NEGRO";

      if (valorNuevo) {
        this.db.run(
          "UPDATE pacientes SET triage_actual = ?, ts_ultima_mod = ? WHERE id_interno = ?",
          [valorNuevo, new Date().toISOString(), this.currentPatientId]
        );
      } else {
        alert("Opción inválida.");
        return;
      }
    }

    const ts = new Date().toISOString();
    this.db.run(
      "INSERT INTO trazabilidad (id_paciente, ts_evento, tipo_evento, descripcion, valor_nuevo, operador) VALUES (?, ?, ?, ?, ?, ?)",
      [this.currentPatientId, ts, tipo, det || "Cambio Triage", valorNuevo, this.session.operador]
    );

    this.audit(
      "EVENT_ADD",
      "trazabilidad",
      this.currentPatientId,
      `${tipo} adjuntado al expediente`
    );
    document.getElementById("action-detalle").value = "";
    this.renderTimeline(this.currentPatientId);
    this.renderCensus(); // Por si cambió de Triage
  },

  filterPatients() {
    const filter = document.getElementById("search-input").value.toUpperCase();
    const rows = document.getElementById("patients-table-body").getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
      const textContent = rows[i].textContent || rows[i].innerText;
      if (textContent.toUpperCase().indexOf(filter) > -1) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    }
  },

  // Generador ID
  generateUUID() {
    return "xxxx-xxxx-4xxx-yxxx".replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },

  /**
   * Escapa HTML para prevenir XSS
   * @param {string} str - String potencialmente inseguro
   * @returns {string} String escapado
   */
  escapeHTML(str) {
    if (str === null || str === undefined) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },

  // Patient Registration Modal stub
  showNewPatientModal() {
    // Generar Folio
    const stmt = this.db.prepare("SELECT count(*) as total FROM pacientes");
    stmt.step();
    const count = stmt.getAsObject().total + 1;
    stmt.free();

    const folioStr = `P-${count.toString().padStart(3, "0")}`;

    const nombre = prompt(
      `Nuevo Paciente [Folio: ${folioStr}]\nIngresa el nombre del paciente (vacío para 'NN'):`
    );

    // Triage prompt mock => for real deployment use the huge buttons UI as specified in design!
    const triageN = prompt(
      `Clasificación Triage START [Folio: ${folioStr}]\nOpciones:\nR: Rojo (Crítico)\nA: Amarillo (Urgente)\nV: Verde (Leve)\nN: Negro (S/Vida)`
    );
    let triageActual = "BLANCO";
    if (triageN?.toUpperCase() === "R") triageActual = "ROJO";
    if (triageN?.toUpperCase() === "A") triageActual = "AMARILLO";
    if (triageN?.toUpperCase() === "V") triageActual = "VERDE";
    if (triageN?.toUpperCase() === "N") triageActual = "NEGRO";

    if (triageActual !== "BLANCO") {
      const internalId = this.generateUUID();
      const ts = new Date().toISOString();

      this.db.run(
        "INSERT INTO pacientes (id_interno, folio_local, nombre, triage_inicial, triage_actual, estado, ts_ingreso, operador_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          internalId,
          folioStr,
          nombre || "NN",
          triageActual,
          triageActual,
          "ACTIVO",
          ts,
          this.session.operador,
        ]
      );

      this.db.run(
        "INSERT INTO trazabilidad (id_paciente, ts_evento, tipo_evento, descripcion, valor_nuevo, operador) VALUES (?, ?, ?, ?, ?, ?)",
        [internalId, ts, "INGRESO", "Registro inicial START", triageActual, this.session.operador]
      );

      this.audit("CREATE", "pacientes", folioStr, `Ingreso nuevo paciente triage ${triageActual}`);

      this.renderCensus();
    }
  },

  // Reporte Maestro Excel
  exportToExcel() {
    // Usar CONFIG para límites de exportación
    const maxRows = window.CONFIG ? CONFIG.EXPORT_MAX_ROWS : 50000;

    if (window.CONFIG) {
      CONFIG.debug("Iniciando exportación...", { maxRows });
    }

    // Verificar límite de filas
    const countStmt = this.db.prepare("SELECT count(*) as total FROM pacientes");
    countStmt.step();
    const totalCount = countStmt.getAsObject().total;
    countStmt.free();

    if (totalCount > maxRows) {
      const msg = `Demasiados pacientes (${totalCount}). Máximo: ${maxRows}`;
      if (window.CONFIG) {
        CONFIG.warn("Excede límite de exportación", { rows: totalCount, max: maxRows });
      }
      this.showNotification(msg, "warning");
      return;
    }

    const wb = XLSX.utils.book_new();

    // Hoja 1: Censo de Pacientes Puro
    const ws_pacientes_data = [];
    const q1 =
      "SELECT folio_local, nombre, edad_estimada, sexo, discapacidad, triage_inicial, triage_actual, area_actual, ts_ingreso FROM pacientes ORDER BY ts_ingreso ASC";
    const st1 = this.db.prepare(q1);
    while (st1.step()) ws_pacientes_data.push(st1.getAsObject());
    st1.free();
    const ws1 = XLSX.utils.json_to_sheet(ws_pacientes_data);
    XLSX.utils.book_append_sheet(wb, ws1, "Pacientes_CENSO");

    // Hoja 2: Todas las atenciones/eventos de trazabilidad
    const ws_traz_data = [];
    const q2 =
      "SELECT p.folio_local, t.ts_evento, t.tipo_evento, t.descripcion, t.valor_anterior, t.valor_nuevo, t.operador FROM trazabilidad t JOIN pacientes p ON t.id_paciente = p.id_interno ORDER BY t.ts_evento ASC";
    const st2 = this.db.prepare(q2);
    while (st2.step()) ws_traz_data.push(st2.getAsObject());
    st2.free();
    const ws2 = XLSX.utils.json_to_sheet(ws_traz_data);
    XLSX.utils.book_append_sheet(wb, ws2, "Trazabilidad_CLINICA");

    // Hoja 3: Auditoria Log RAW (Seguridad)
    const ws_audit_data = [];
    const st3 = this.db.prepare("SELECT * FROM auditoria");
    while (st3.step()) ws_audit_data.push(st3.getAsObject());
    st3.free();
    const ws3 = XLSX.utils.json_to_sheet(ws_audit_data);
    XLSX.utils.book_append_sheet(wb, ws3, "Sys_AUDITORIA");

    // Descarga Física
    XLSX.writeFile(wb, `ECE-DES_Resumen_${Date.now()}.xlsx`);
    this.audit("EXPORT", "DATABASE", "EXCEL", "Exportación maesta a SheetJS iniciada.");
  },

  // Backup Manual .db
  backupDatabase() {
    const array = this.db.export();
    const blob = new Blob([array], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ECE-DES-DB-${Date.now()}.sqlite`;
    a.click();
    window.URL.revokeObjectURL(url);
    this.audit("EXPORT", "DATABASE", "MANUAL", "Descarga de DB binaria exportada.");
  },
};

window.onload = () => {
  app.init();

  // Guardado forzado al cerrar
  window.addEventListener("beforeunload", () => {
    if (app.saveTimeout) {
      clearTimeout(app.saveTimeout);
      app._performSave().catch(err => {
        console.error("Error en guardado forzado:", err);
      });
    }
  });
};

// Funciones para manejo de indicador de guardado
function _showSaveStatus(status, message) {
  const saveStatus = document.getElementById("save-status");
  if (saveStatus) {
    saveStatus.textContent = message;
    saveStatus.className = "save-status";

    if (status === "saving") {
      saveStatus.classList.add("saving");
    } else if (status === "saved") {
      saveStatus.classList.add("saved");
    }
  }
}

function _hideSaveStatus() {
  const saveStatus = document.getElementById("save-status");
  if (saveStatus) {
    saveStatus.textContent = "";
    saveStatus.className = "save-status";
  }
}

// Funciones para notificaciones
function showNotification(message, type = "info") {
  // Eliminar notificaciones existentes
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach(n => n.remove());

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div style="display: flex; align-items: center;">
      ${type === "success" ? "✓" : type === "error" ? "✗" : "ℹ"}
      <span style="margin-left: 8px;">${message}</span>
    </div>
  `;

  document.body.appendChild(notification);

  // Autoeliminar después de 4 segundos
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Agregar animación de salida
const style = document.createElement("style");
style.textContent = `
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Override de funciones para mejor feedback
app.showNewPatientModal = function () {
  // Generar Folio
  const stmt = this.db.prepare("SELECT count(*) as total FROM pacientes");
  stmt.step();
  const count = stmt.getAsObject().total + 1;
  stmt.free();

  const folioStr = `P-${count.toString().padStart(3, "0")}`;

  const nombre = prompt(
    `Nuevo Paciente [Folio: ${folioStr}]\nIngresa el nombre del paciente (vacío para 'NN'):`
  );

  // Triage prompt mock => for real deployment use the huge buttons UI as specified in design!
  const triageN = prompt(
    `Clasificación Triage START [Folio: ${folioStr}]\nOpciones:\nR: Rojo (Crítico)\nA: Amarillo (Urgente)\nV: Verde (Leve)\nN: Negro (S/Vida)`
  );
  let triageActual = "BLANCO";
  if (triageN?.toUpperCase() === "R") triageActual = "ROJO";
  if (triageN?.toUpperCase() === "A") triageActual = "AMARILLO";
  if (triageN?.toUpperCase() === "V") triageActual = "VERDE";
  if (triageN?.toUpperCase() === "N") triageActual = "NEGRO";

  if (triageActual !== "BLANCO") {
    const internalId = this.generateUUID();
    const ts = new Date().toISOString();

    this.db.run(
      "INSERT INTO pacientes (id_interno, folio_local, nombre, triage_inicial, triage_actual, estado, ts_ingreso, operador_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        internalId,
        folioStr,
        nombre || "NN",
        triageActual,
        triageActual,
        "ACTIVO",
        ts,
        this.session.operador,
      ]
    );

    this.db.run(
      "INSERT INTO trazabilidad (id_paciente, ts_evento, tipo_evento, descripcion, valor_nuevo, operador) VALUES (?, ?, ?, ?, ?, ?)",
      [internalId, ts, "INGRESO", "Registro inicial START", triageActual, this.session.operador]
    );

    this.audit("CREATE", "pacientes", folioStr, `Ingreso nuevo paciente triage ${triageActual}`);

    // Mostrar notificación de éxito
    showNotification(`Paciente ${folioStr} registrado exitosamente`, "success");

    this.renderCensus();
  }
};

app.exportToExcel = function () {
  showNotification("Exportando Excel...", "info");

  // Usar CONFIG para límites de exportación
  const maxRows = window.CONFIG ? CONFIG.EXPORT_MAX_ROWS : 50000;

  if (window.CONFIG) {
    CONFIG.debug("Iniciando exportación...", { maxRows });
  }

  // Verificar límite de filas
  const countStmt = this.db.prepare("SELECT count(*) as total FROM pacientes");
  countStmt.step();
  const totalCount = countStmt.getAsObject().total;
  countStmt.free();

  if (totalCount > maxRows) {
    const msg = `Demasiados pacientes (${totalCount}). Máximo: ${maxRows}`;
    if (window.CONFIG) {
      CONFIG.warn("Excede límite de exportación", { rows: totalCount, max: maxRows });
    }
    showNotification(msg, "warning");
    return;
  }

  setTimeout(() => {
    const wb = XLSX.utils.book_new();

    // Hoja 1: Censo de Pacientes Puro
    const ws_pacientes_data = [];
    const q1 =
      "SELECT folio_local, nombre, edad_estimada, sexo, discapacidad, triage_inicial, triage_actual, area_actual, ts_ingreso FROM pacientes ORDER BY ts_ingreso ASC";
    const st1 = this.db.prepare(q1);
    while (st1.step()) ws_pacientes_data.push(st1.getAsObject());
    st1.free();
    const ws1 = XLSX.utils.json_to_sheet(ws_pacientes_data);
    XLSX.utils.book_append_sheet(wb, ws1, "Pacientes_CENSO");

    // Hoja 2: Todas las atenciones/eventos de trazabilidad
    const ws_traz_data = [];
    const q2 =
      "SELECT p.folio_local, t.ts_evento, t.tipo_evento, t.descripcion, t.valor_anterior, t.valor_nuevo, t.operador FROM trazabilidad t JOIN pacientes p ON t.id_paciente = p.id_interno ORDER BY t.ts_evento ASC";
    const st2 = this.db.prepare(q2);
    while (st2.step()) ws_traz_data.push(st2.getAsObject());
    st2.free();
    const ws2 = XLSX.utils.json_to_sheet(ws_traz_data);
    XLSX.utils.book_append_sheet(wb, ws2, "Trazabilidad_CLINICA");

    // Hoja 3: Auditoria Log RAW (Seguridad)
    const ws_audit_data = [];
    const st3 = this.db.prepare("SELECT * FROM auditoria");
    while (st3.step()) ws_audit_data.push(st3.getAsObject());
    st3.free();
    const ws3 = XLSX.utils.json_to_sheet(ws_audit_data);
    XLSX.utils.book_append_sheet(wb, ws3, "Sys_AUDITORIA");

    // Descarga Física
    XLSX.writeFile(wb, `ECE-DES_Resumen_${Date.now()}.xlsx`);
    this.audit("EXPORT", "DATABASE", "EXCEL", "Exportación maestra a SheetJS iniciada.");

    // Mostrar notificación de éxito
    showNotification("Excel exportado exitosamente", "success");
  }, 500);
};

// Override de renderPatientTable para mostrar mensaje cuando no hay pacientes
app.renderPatientTable = function () {
  const tbody = document.getElementById("patients-table-body");
  tbody.innerHTML = "";

  const query =
    "SELECT id_interno, folio_local, nombre, triage_actual, area_actual, ts_ingreso FROM pacientes ORDER BY ts_ingreso DESC";
  const stmt = this.db.prepare(query);

  let hasPatients = false;
  const rows = [];

  while (stmt.step()) {
    hasPatients = true;
    const row = stmt.getAsObject();
    rows.push(row);
  }
  stmt.free();

  if (!hasPatients) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td colspan="6" class="no-patients-message">
        <i>📋</i>
        <div>No hay pacientes registrados</div>
        <div style="font-size: 0.9rem; margin-top: 8px;">Haz clic en "NUEVO PACIENTE" para comenzar</div>
      </td>
    `;
    tbody.appendChild(tr);
    return;
  }

  rows.forEach(row => {
    let badge = "";
    if (row.triage_actual === "ROJO") badge = '<span style="color:var(--fn-rojo)">◆ ROJO</span>';
    if (row.triage_actual === "AMARILLO")
      badge = '<span style="color:var(--fn-amarillo)">▲ AMARILLO</span>';
    if (row.triage_actual === "VERDE") badge = '<span style="color:var(--fn-verde)">● VERDE</span>';
    if (row.triage_actual === "NEGRO") badge = '<span style="color:var(--fn-negro)">✚ NEGRO</span>';

    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid var(--border-light)";

    // Crear celdas individualmente con textContent (XSS-safe)
    const tdFolio = document.createElement("td");
    tdFolio.style.padding = "10px";
    tdFolio.textContent = row.folio_local;

    const tdNombre = document.createElement("td");
    tdNombre.style.padding = "10px";
    tdNombre.style.fontWeight = "bold";
    tdNombre.textContent = row.nombre || "NN";

    const tdTriage = document.createElement("td");
    tdTriage.style.padding = "10px";
    tdTriage.innerHTML = badge; // badge es HTML seguro (generado internamente)

    const tdArea = document.createElement("td");
    tdArea.style.padding = "10px";
    tdArea.textContent = row.area_actual || "-";

    const tdIngreso = document.createElement("td");
    tdIngreso.style.padding = "10px";
    tdIngreso.textContent = new Date(row.ts_ingreso).toLocaleTimeString();

    const tdAccion = document.createElement("td");
    tdAccion.style.padding = "10px";
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.style.cssText =
      "background:var(--inst-dorado); color:white; padding:5px 10px; font-size:0.8rem;";
    btn.textContent = "VER DETALLE";
    btn.onclick = () => app.openExpediente(row.id_interno);
    tdAccion.appendChild(btn);

    tr.append(tdFolio, tdNombre, tdTriage, tdArea, tdIngreso, tdAccion);
    tbody.appendChild(tr);
  });
};
