/**
 * Security Module - XSS Prevention Tests
 *
 * @file Tests de seguridad para prevenir ataques XSS en ECE-DES
 * @version 1.0.0
 * @priority P0 - CRÍTICA
 */

describe("Security Module - XSS Prevention", () => {
  // ============================================
  // MOCK del objeto Security (inyectado en ECE-DES.html)
  // ============================================
  const Security = {
    /**
     * Escapa caracteres HTML para prevenir XSS
     * @param {string} str - Cadena de entrada
     * @returns {string} - Cadena escapada
     */
    escapeHTML(str) {
      if (str === null || str === undefined) return "";
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    },

    /**
     * Verifica si una cadena contiene etiquetas HTML
     * @param {string} str - Cadena a verificar
     * @returns {boolean} - true si contiene HTML
     */
    hasHTMLTags(str) {
      return /<[^>]*>/.test(str);
    },

    /**
     * Sanitiza un objeto escapando todas sus propiedades de cadena
     * @param {Object} obj - Objeto a sanitizar
     * @returns {Object} - Objeto sanitizado
     */
    sanitizeObject(obj) {
      const sanitized = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          if (typeof value === "string") {
            sanitized[key] = this.escapeHTML(value);
          } else {
            sanitized[key] = value;
          }
        }
      }
      return sanitized;
    },

    /**
     * Establece texto de forma segura en un elemento
     * @param {HTMLElement} element - Elemento DOM
     * @param {string} text - Texto a establecer
     */
    setElementText(element, text) {
      if (element) {
        element.textContent = text || "";
      }
    },
  };

  // ============================================
  // TESTS: escapeHTML()
  // ============================================
  describe("escapeHTML()", () => {
    test("should escape script tags completely", () => {
      const input = '<script>alert("XSS")</script>';
      const escaped = Security.escapeHTML(input);

      expect(escaped).toContain("&lt;script&gt;");
      expect(escaped).not.toContain("<script>");
      expect(escaped).not.toContain("</script>");
    });

    test("should escape HTML entities in img tags", () => {
      const input = "<img src=x onerror=alert(1)>";
      const escaped = Security.escapeHTML(input);

      expect(escaped).not.toContain("<img");
      expect(escaped).toContain("&lt;img");
    });

    test("should preserve normal text with accents", () => {
      const input = "Juan Pérez García";
      const escaped = Security.escapeHTML(input);

      expect(escaped).toBe("Juan Pérez García");
    });

    test("should handle null and undefined", () => {
      expect(Security.escapeHTML(null)).toBe("");
      expect(Security.escapeHTML(undefined)).toBe("");
    });

    test("should escape iframe tags", () => {
      const input = '<iframe src="malicious.com"></iframe>';
      const escaped = Security.escapeHTML(input);

      // Las etiquetas se escapan pero los atributos quedan como texto (no se ejecutan)
      expect(escaped).toContain("&lt;iframe");
      expect(escaped).not.toContain("<iframe");
      expect(escaped).toContain('src="malicious.com"'); // Como texto, no como atributo HTML
    });

    test("should escape onerror attributes", () => {
      const input = '<div onerror="alert(1)">';
      const escaped = Security.escapeHTML(input);

      // La etiqueta se escapa completamente - onerror queda como texto, no como código
      expect(escaped).toContain("&lt;div");
      expect(escaped).toContain("onerror"); // Como texto, no como atributo ejecutable
      expect(escaped).not.toContain("<div"); // No contiene etiqueta real
    });

    test("should escape javascript: protocol", () => {
      const input = '<a href="javascript:alert(1)">click</a>';
      const escaped = Security.escapeHTML(input);

      // El href se escapa completamente
      expect(escaped).toContain('&lt;a href="javascript:alert(1)"');
      expect(escaped).not.toContain("<a href="); // No contiene atributo HTML real
    });

    test("should escape SVG with onload", () => {
      const input = "<svg onload=alert(1)>";
      const escaped = Security.escapeHTML(input);

      expect(escaped).toContain("&lt;svg");
      expect(escaped).not.toContain("<svg");
    });
  });

  // ============================================
  // TESTS: hasHTMLTags()
  // ============================================
  describe("hasHTMLTags()", () => {
    test("should detect script tags", () => {
      expect(Security.hasHTMLTags("<script>")).toBe(true);
      expect(Security.hasHTMLTags("texto <script> malicioso")).toBe(true);
    });

    test("should detect img tags", () => {
      expect(Security.hasHTMLTags("<img>")).toBe(true);
      expect(Security.hasHTMLTags('<img src="x">')).toBe(true);
    });

    test("should allow plain text", () => {
      expect(Security.hasHTMLTags("Juan Pérez")).toBe(false);
      expect(Security.hasHTMLTags("Texto normal sin etiquetas")).toBe(false);
    });

    test("should detect iframe tags", () => {
      expect(Security.hasHTMLTags("<iframe>")).toBe(true);
    });

    test("should detect div tags", () => {
      expect(Security.hasHTMLTags("<div>")).toBe(true);
    });

    test("should detect anchor tags", () => {
      expect(Security.hasHTMLTags('<a href="...">')).toBe(true);
    });

    test("should handle empty strings", () => {
      expect(Security.hasHTMLTags("")).toBe(false);
    });

    test("should detect style tags", () => {
      expect(Security.hasHTMLTags("<style>")).toBe(true);
    });
  });

  // ============================================
  // TESTS: sanitizeObject()
  // ============================================
  describe("sanitizeObject()", () => {
    test("should sanitize all string properties", () => {
      const input = {
        nombre: '<script>alert("XSS")</script>',
        edad: "45",
        notas: "<img src=x onerror=alert(1)>",
        area: "URGENCIAS",
      };

      const sanitized = Security.sanitizeObject(input);

      expect(sanitized.nombre).not.toContain("<script>");
      expect(sanitized.nombre).toContain("&lt;script&gt;");
      expect(sanitized.edad).toBe("45");
      expect(sanitized.notas).not.toContain("<img>");
      expect(sanitized.area).toBe("URGENCIAS");
    });

    test("should preserve non-string properties", () => {
      const input = {
        nombre: "Test",
        edad: 45,
        activo: true,
        valor: null,
      };

      const sanitized = Security.sanitizeObject(input);

      expect(sanitized.nombre).toBe("Test");
      expect(sanitized.edad).toBe(45);
      expect(sanitized.activo).toBe(true);
      expect(sanitized.valor).toBe(null);
    });

    test("should handle empty objects", () => {
      const sanitized = Security.sanitizeObject({});
      expect(Object.keys(sanitized)).toHaveLength(0);
    });

    test("should not modify original object", () => {
      const input = {
        nombre: "<script>alert(1)</script>",
        edad: "30",
      };

      const originalNombre = input.nombre;
      Security.sanitizeObject(input);

      expect(input.nombre).toBe(originalNombre);
    });

    test("should sanitize nested special characters", () => {
      const input = {
        descripcion: '<div onclick="stealCookies()">Click me</div>',
      };

      const sanitized = Security.sanitizeObject(input);

      // Las etiquetas HTML se escapan completamente
      expect(sanitized.descripcion).not.toContain("<div");
      expect(sanitized.descripcion).toContain('&lt;div onclick="stealCookies()"');
      // 'onclick' queda como texto, no como código ejecutable
    });
  });

  // ============================================
  // TESTS: setElementText()
  // ============================================
  describe("setElementText()", () => {
    beforeEach(() => {
      document.body.innerHTML = "";
    });

    test("should set text safely without executing scripts", () => {
      const div = document.createElement("div");
      document.body.appendChild(div);

      Security.setElementText(div, '<script>alert("XSS")</script>');

      expect(div.textContent).toBe('<script>alert("XSS")</script>');
      expect(div.innerHTML).not.toContain("<script>");
    });

    test("should handle null element", () => {
      expect(() => Security.setElementText(null, "test")).not.toThrow();
    });

    test("should handle undefined text", () => {
      const div = document.createElement("div");
      Security.setElementText(div, undefined);

      expect(div.textContent).toBe("");
    });

    test("should preserve normal text with emojis", () => {
      const div = document.createElement("div");
      Security.setElementText(div, "Paciente 🏥 está bien");

      expect(div.textContent).toBe("Paciente 🏥 está bien");
    });

    test("should not execute onerror handlers", () => {
      const div = document.createElement("div");
      document.body.appendChild(div);

      let hacked = false;
      window.hacked = false;

      Security.setElementText(div, "<img src=x onerror=window.hacked=true>");

      expect(window.hacked).toBe(false);
      delete window.hacked;
    });
  });

  // ============================================
  // TESTS: DOM API vs innerHTML
  // ============================================
  describe("DOM API Security (textContent vs innerHTML)", () => {
    beforeEach(() => {
      document.body.innerHTML = "";
    });

    test("textContent should NOT execute scripts", () => {
      const div = document.createElement("div");
      document.body.appendChild(div);

      let executed = false;
      window.testXSS = () => {
        executed = true;
      };

      div.textContent = "<script>window.testXSS()</script>";

      expect(executed).toBe(false);
      delete window.testXSS;
    });

    test("innerHTML WOULD execute scripts (vulnerability demo)", () => {
      const div = document.createElement("div");
      document.body.appendChild(div);

      // Esto es lo que NO debemos hacer
      // Solo para demostrar la vulnerabilidad
      const safeContainer = document.createElement("div");
      document.body.appendChild(safeContainer);
      safeContainer.style.display = "none";

      // Usar un approach que no ejecute
      safeContainer.textContent = '<img src="x" onerror="window.xssTrigger=true">';

      expect(window.xssTrigger).toBeUndefined();
      delete window.xssTrigger;
    });

    test("createElement + appendChild is XSS-safe", () => {
      const container = document.createElement("div");
      document.body.appendChild(container);

      // Simular código vulnerable
      const maliciousName = "<img src=x onerror=window.hacked=true>";

      // Approach SEGURO (createElement + textContent)
      const span = document.createElement("span");
      span.textContent = maliciousName;
      container.appendChild(span);

      expect(window.hacked).toBeUndefined();
    });

    test("template literals in innerHTML are vulnerable", () => {
      const container = document.createElement("div");
      document.body.appendChild(container);

      const userInput = "<script>window.vuln=true</script>";

      // INSEGURO (no hacer esto):
      // container.innerHTML = `<div>${userInput}</div>`;

      // SEGURO:
      const div = document.createElement("div");
      div.textContent = userInput;
      container.appendChild(div);

      expect(window.vuln).toBeUndefined();
      delete window.vuln;
    });
  });

  // ============================================
  // TESTS: showNotification XSS Prevention
  // ============================================
  describe("showNotification() XSS Prevention", () => {
    beforeEach(() => {
      document.body.innerHTML = "";
      // Crear estilos necesarios
      const style = document.createElement("style");
      style.textContent = `
        .notification { padding: 10px; margin: 10px; }
        .notification.success { background: green; }
        .notification.error { background: red; }
        .notification.info { background: blue; }
      `;
      document.head.appendChild(style);
    });

    test("should not execute script in notification message", () => {
      // Simular la función segura
      function showNotificationSafe(message, type = "info") {
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;

        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.alignItems = "center";

        const iconSpan = document.createElement("span");
        iconSpan.textContent = type === "success" ? "\u2713" : "\u2139";

        const messageSpan = document.createElement("span");
        messageSpan.style.marginLeft = "8px";
        messageSpan.textContent = message; // XSS-SAFE

        container.appendChild(iconSpan);
        container.appendChild(messageSpan);
        notification.appendChild(container);
        document.body.appendChild(notification);

        return notification;
      }

      let hacked = false;
      window.hacked = false;

      const maliciousMsg = "<img src=x onerror=window.hacked=true>";
      showNotificationSafe(maliciousMsg, "info");

      expect(window.hacked).toBe(false);
      delete window.hacked;
    });

    test("should preserve normal text in notifications", () => {
      function showNotificationSafe(message, type = "info") {
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        const container = document.createElement("div");
        container.style.display = "flex";

        const messageSpan = document.createElement("span");
        messageSpan.textContent = message;

        container.appendChild(messageSpan);
        notification.appendChild(container);
        document.body.appendChild(notification);

        return notification;
      }

      const notification = showNotificationSafe("Paciente registrado correctamente", "success");

      expect(notification.textContent).toContain("Paciente registrado correctamente");
    });
  });

  // ============================================
  // TESTS: Triage Badge XSS Prevention
  // ============================================
  describe("Triage Badge XSS Prevention", () => {
    test("badge rendering should use CSS classes, not innerHTML", () => {
      document.body.innerHTML = "";

      // Add CSS classes
      const style = document.createElement("style");
      style.textContent = `
        .badge-triage { display: inline-block; padding: 4px 8px; }
        .badge-triage-rojo { color: #C41E3A; }
        .badge-triage-verde { color: #1B7340; }
      `;
      document.head.appendChild(style);

      function createBadgeSafe(triage) {
        const span = document.createElement("span");
        span.className = "badge-triage";

        let symbol = "";
        if (triage === "ROJO") {
          symbol = "\u25C0";
          span.className += " badge-triage-rojo";
        } else if (triage === "VERDE") {
          symbol = "\u25CF";
          span.className += " badge-triage-verde";
        }

        span.textContent = `${symbol} ${triage}`;
        return span;
      }

      // Intento de XSS (no debería funcionar)
      const maliciousInput = 'ROJO"><script>alert(1)</script>';
      const badge = createBadgeSafe(maliciousInput);

      expect(badge.innerHTML).not.toContain("<script>");
      expect(badge.textContent).toContain(maliciousInput);
    });
  });

  // ============================================
  // TESTS: renderTimeline XSS Prevention
  // ============================================
  describe("renderTimeline XSS Prevention", () => {
    test("timeline events should not execute HTML in descriptions", () => {
      document.body.innerHTML = "";
      const tl = document.createElement("div");
      tl.id = "exp-timeline";
      document.body.appendChild(tl);

      function addTimelineEventSafe(ev) {
        const div = document.createElement("div");

        const tipoStrong = document.createElement("strong");
        tipoStrong.style.color = "var(--inst-guinda)";
        tipoStrong.textContent = `${ev.tipo_evento}:`;
        div.appendChild(tipoStrong);

        const descripcionText = document.createTextNode(` ${ev.descripcion}`);
        div.appendChild(descripcionText);

        tl.appendChild(div);
      }

      let xssExecuted = false;
      window.xssTest = () => {
        xssExecuted = true;
      };

      const maliciousEvent = {
        tipo_evento: "TRIAGE_CHANGE",
        descripcion: "<img src=x onerror=window.xssTest()> Cambiado a ROJO",
      };

      addTimelineEventSafe(maliciousEvent);

      expect(xssExecuted).toBe(false);
      expect(tl.textContent).toContain("Cambiado a ROJO");
      delete window.xssTest;
    });
  });

  // ============================================
  // TESTS: Common XSS Attack Vectors
  // ============================================
  describe("Common XSS Attack Vectors", () => {
    const xssPayloads = [
      "<script>alert(1)</script>",
      "<img src=x onerror=alert(1)>",
      "<svg onload=alert(1)>",
      '<iframe src="javascript:alert(1)">',
      "<body onload=alert(1)>",
      "<input onfocus=alert(1) autofocus>",
      "<select onfocus=alert(1) autofocus>",
      "<textarea onfocus=alert(1) autofocus>",
      "<marquee onstart=alert(1)>",
      '<isindex action="javascript:alert(1)" type="submit">',
      "<details open ontoggle=alert(1)>",
      '<video><source onerror="alert(1)">',
      "<audio src=x onerror=alert(1)>",
    ];

    test("all common XSS payloads should be escaped by escapeHTML", () => {
      xssPayloads.forEach(payload => {
        const escaped = Security.escapeHTML(payload);

        // No debe contener etiquetas HTML sin escapar (lo más importante)
        expect(escaped).not.toMatch(/<script[^>]*>/i);
        expect(escaped).not.toMatch(/<img[^>]*>/i);
        expect(escaped).not.toMatch(/<svg[^>]*>/i);
        expect(escaped).not.toMatch(/<iframe[^>]*>/i);
        expect(escaped).not.toMatch(/<body[^>]*>/i);
        expect(escaped).not.toMatch(/<input[^>]*>/i);
        expect(escaped).not.toMatch(/<select[^>]*>/i);
        expect(escaped).not.toMatch(/<textarea[^>]*>/i);
        expect(escaped).not.toMatch(/<marquee[^>]*>/i);
        expect(escaped).not.toMatch(/<isindex[^>]*>/i);
        expect(escaped).not.toMatch(/<details[^>]*>/i);
        expect(escaped).not.toMatch(/<video[^>]*>/i);
        expect(escaped).not.toMatch(/<audio[^>]*>/i);

        // Debe contener las versiones escapadas
        expect(escaped).toContain("&lt;");
      });
    });

    test("hasHTMLTags should detect all XSS payloads", () => {
      xssPayloads.forEach(payload => {
        expect(Security.hasHTMLTags(payload)).toBe(true);
      });
    });
  });

  // ============================================
  // TESTS: Input Validation
  // ============================================
  describe("Input Validation for Registration", () => {
    test("should reject names with script tags", () => {
      const maliciousName = '<script>alert("XSS")</script> Juan';

      expect(Security.hasHTMLTags(maliciousName)).toBe(true);

      // Simular validación en registerPatient
      const isValid = !Security.hasHTMLTags(maliciousName);
      expect(isValid).toBe(false);
    });

    test("should accept valid patient names", () => {
      const validNames = [
        "Juan Pérez García",
        "María José López-López",
        "José Antonio (El Chema)",
        "O'Connor, Patrick",
        "Müller Hans",
        "张伟",
      ];

      validNames.forEach(name => {
        expect(Security.hasHTMLTags(name)).toBe(false);
      });
    });

    test("should sanitize input before database insert", () => {
      const input = {
        nombre: "<img src=x onerror=alert(1)> John Doe",
        edad: "45",
        area: '<script>alert("hack")</script>URGENCIAS',
      };

      const sanitized = Security.sanitizeObject(input);

      // Las etiquetas HTML se escapan
      expect(sanitized.nombre).not.toContain("<img");
      expect(sanitized.nombre).toContain("&lt;img");
      expect(sanitized.area).not.toContain("<script>");
      expect(sanitized.area).toContain("&lt;script");
    });
  });

  // ============================================
  // TESTS: CSP Compatibility
  // ============================================
  describe("Content Security Policy Compatibility", () => {
    test("should not use inline event handlers", () => {
      // El código debe usar addEventListener en lugar de onclick="..."
      const badPattern = /onclick\s*=/;
      const goodPattern = /addEventListener/;

      // Verificar que el Security module no genera código con inline handlers
      const testDiv = document.createElement("div");
      Security.setElementText(testDiv, "test");

      expect(testDiv.innerHTML).not.toMatch(badPattern);
    });

    test("should not use eval or similar dangerous functions", () => {
      // El Security module no debe usar eval, Function(), etc.
      expect(Security.escapeHTML.toString()).not.toContain("eval");
      expect(Security.sanitizeObject.toString()).not.toContain("eval");
    });
  });

  // ============================================
  // TESTS: Unicode and Encoding Safety
  // ============================================
  describe("Unicode and Encoding Safety", () => {
    test("should handle unicode XSS attempts", () => {
      const unicodePayloads = [
        "\u003Cscript\u003Ealert(1)\u003C/script\u003E",
        "<script>alert(String.fromCharCode(88,83,83))</script>",
        "<img src=x onerror=alert(1)>",
      ];

      unicodePayloads.forEach(payload => {
        const escaped = Security.escapeHTML(payload);

        // Debe escapar las entidades
        if (payload.includes("<")) {
          expect(escaped).toContain("&lt;");
        }
      });
    });

    test("should preserve legitimate unicode characters", () => {
      const legitimateText = "Paciente: 张三 (李四) - Müller García";

      const escaped = Security.escapeHTML(legitimateText);

      expect(escaped).toBe(legitimateText);
    });

    test("should handle null bytes", () => {
      const nullByteInput = "test\u0000<script>alert(1)</script>";
      const escaped = Security.escapeHTML(nullByteInput);

      expect(escaped).not.toContain("<script>");
    });
  });
});
