/**
 * ECE-DES | Lógica del Dashboard Directivo Offline
 */

const dash = {
  db: null,

  init() {
    console.log("Inicializando ECE-DES Dashboard...");

    // Usar variable global WASM base64 inyectada por build.js para evitar error CORS en file://
    const config = window.SQL_WASM_URI
      ? { locateFile: () => window.SQL_WASM_URI }
      : { locateFile: file => `js/${file}` };

    // Cargar motor SQL.js
    initSqlJs(config).then(SQL => {
      this.SQL = SQL;
      this.loadDatabase();
    });
  },

  loadDatabase() {
    // Cargar Base de Datos desde IndexedDB, creada por la app principal
    const request = indexedDB.open("ECEDES_DB", 1);

    request.onerror = event => {
      console.error("Error cargando IndexedDB en Dashboard", event);
      document.getElementById("dash-total").textContent = "Error DB";
    };

    request.onsuccess = event => {
      const idb = event.target.result;

      // Check if object store exists
      if (!idb.objectStoreNames.contains("sqlite_backup")) {
        console.warn("La Base de datos ECEDES_DB no existe aún. Abre la PWA principal primero.");
        document.getElementById("dash-total").textContent = "Sin Datos";
        return;
      }

      const trans = idb.transaction(["sqlite_backup"], "readonly");
      const store = trans.objectStore("sqlite_backup");
      const req = store.get("latest");

      req.onsuccess = e => {
        const data = e.target.result;
        if (data) {
          this.db = new this.SQL.Database(data);
          console.log("Base de datos conectada en Dashboard.");
          this.renderAll();
        } else {
          document.getElementById("dash-total").textContent = "0";
          console.warn("Sin datos en la base de datos local para el Dashboard.");
        }
      };
    };
  },

  renderAll() {
    this.renderKPIs();
    this.renderTriageChart();
    this.renderTimelineLog();
    this.renderPatientTable();
  },

  renderKPIs() {
    try {
      // Totales
      const stmtTot = this.db.prepare("SELECT COUNT(*) as t FROM pacientes;");
      stmtTot.step();
      document.getElementById("dash-total").textContent = stmtTot.getAsObject().t;
      stmtTot.free();

      // Críticos (Rojos)
      const stmtCrit = this.db.prepare(
        "SELECT COUNT(*) as cr FROM pacientes WHERE triage_actual='ROJO';"
      );
      stmtCrit.step();
      document.getElementById("dash-critical").textContent = stmtCrit.getAsObject().cr;
      stmtCrit.free();

      // Acciones Médicas (Trazabilidad)
      const stmtAct = this.db.prepare("SELECT COUNT(*) as tr FROM trazabilidad;");
      stmtAct.step();
      document.getElementById("dash-actions").textContent = stmtAct.getAsObject().tr;
      stmtAct.free();
    } catch (e) {
      console.error("Error calculando KPIs", e);
    }
  },

  renderTriageChart() {
    if (!this.db) return;
    const triageCounts = {
      ROJO: 0,
      AMARILLO: 0,
      VERDE: 0,
      NEGRO: 0,
    };
    let maxVal = 0;

    const stmt = this.db.prepare(
      "SELECT triage_actual, COUNT(*) as c FROM pacientes GROUP BY triage_actual;"
    );
    while (stmt.step()) {
      const row = stmt.getAsObject();
      if (triageCounts[row.triage_actual] !== undefined) {
        triageCounts[row.triage_actual] = row.c;
        if (row.c > maxVal) maxVal = row.c;
      }
    }
    stmt.free();

    // Evitar división por 0
    const scope = maxVal > 0 ? maxVal : 1;

    // Actualizar UI Barras CSS
    const colors = ["rojo", "amarillo", "verde", "negro"];
    const keys = ["ROJO", "AMARILLO", "VERDE", "NEGRO"];

    for (let i = 0; i < 4; i++) {
      const val = triageCounts[keys[i]];
      const percent = (val / scope) * 100;
      const bar = document.getElementById(`bar-${colors[i]}`);
      bar.style.height = `${percent}%`;
      bar.textContent = val;
      // Ocultar texto si es 0
      if (val === 0) {
        bar.style.height = "5px";
        bar.textContent = "";
      }
    }
  },

  renderTimelineLog() {
    const list = document.getElementById("latest-events");
    list.innerHTML = "";

    // Últimos 10 eventos
    const stmt = this.db.prepare("SELECT * FROM trazabilidad ORDER BY ts_evento DESC LIMIT 10;");
    let found = false;
    while (stmt.step()) {
      found = true;
      const row = stmt.getAsObject();
      const li = document.createElement("li");
      const timeStr = new Date(row.ts_evento).toLocaleTimeString("es-MX");
      const icon = row.tipo_accion === "TRIAGE_CHANGE" ? "⚠️" : "🩺";

      // XSS-safe: usar textContent para datos del usuario
      li.textContent = `${timeStr} - ${icon} [Paciente UID: ${row.id_paciente.substring(0, 6)}] ${row.tipo_accion || row.tipo_evento}: ${row.detalle}`;
      list.appendChild(li);
    }
    stmt.free();

    if (!found) {
      const emptyLi = document.createElement("li");
      emptyLi.style.textAlign = "center";
      emptyLi.textContent = "Sin historial reciente";
      list.appendChild(emptyLi);
    }
  },

  renderPatientTable() {
    const tbody = document.getElementById("dash-patients-table");
    tbody.innerHTML = "";

    const stmt = this.db.prepare("SELECT * FROM pacientes ORDER BY ts_ingreso DESC;");
    while (stmt.step()) {
      const p = stmt.getAsObject();
      const tr = document.createElement("tr");

      // Colores Triage Row
      let tcolor = "transparent";
      let fcolor = "black";
      if (p.triage_actual === "ROJO") {
        tcolor = "#C41E3A";
        fcolor = "white";
      }
      if (p.triage_actual === "AMARILLO") {
        tcolor = "#D4940A";
        fcolor = "black";
      }
      if (p.triage_actual === "VERDE") {
        tcolor = "#1B7340";
        fcolor = "white";
      }
      if (p.triage_actual === "NEGRO") {
        tcolor = "#1A1A2E";
        fcolor = "white";
      }

      // Crear celdas con textContent (XSS-safe)
      const createCell = (text, styles = "") => {
        const td = document.createElement("td");
        if (styles) td.style.cssText = styles;
        else td.style.padding = "10px";
        td.textContent = text;
        return td;
      };

      tr.append(
        createCell(p.id_interno.substring(0, 8), "padding:10px;"),
        createCell(p.folio_local, "padding:10px; font-weight:bold;"),
        createCell(
          p.triage_actual,
          `padding:10px; background-color:${tcolor}; color:${fcolor}; text-align:center; font-weight:bold; border-radius:4px;`
        ),
        createCell(p.edad_estimada || "-"),
        createCell(p.sexo || "-"),
        createCell(new Date(p.ts_ingreso).toLocaleString("es-MX")),
        createCell(p.ts_ultima_mod ? new Date(p.ts_ultima_mod).toLocaleString("es-MX") : "-")
      );
      tbody.appendChild(tr);
    }
    stmt.free();
  },
};

window.onload = () => {
  dash.init();
};
