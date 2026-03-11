// Utilidades compartidas para el sistema IMSS FIFA 2026

/**
 * Escapa caracteres HTML para prevenir XSS
 * @param {string} str - Cadena de entrada
 * @returns {string} - Cadena escapada
 */
function escapeHTML(str) {
  if (str === null || str === undefined) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Formatea una fecha para mostrar
 * @param {Date|string|number} date - Fecha a formatear
 * @returns {string} - Fecha formateada como cadena legible
 */
function formatDate(date) {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Genera un folio para paciente
 * @param {number} count - Número total de pacientes
 * @returns {string} - Folio generado (ej: P-001)
 */
function generateFolio(count) {
  return `P-${(count + 1).toString().padStart(3, "0")}`;
}

/**
 * Colores para el sistema de triaje
 */
const TRIAGE_COLORS = {
  ROJO: "#dc3545",
  AMARILLO: "#ffc107",
  VERDE: "#28a745",
  NEGRO: "#343a40",
};

// Exportar funciones y constantes
export { escapeHTML, formatDate, generateFolio, TRIAGE_COLORS };
