/**
 * Unit Tests for Shared Utils
 * IMSS FIFA 2026 - Shared Utilities
 */

import { escapeHTML, formatDate, generateFolio, TRIAGE_COLORS } from "@/src/shared/js/utils.js";

describe("escapeHTML", () => {
  beforeEach(() => {
    // Mock DOM environment
    document.createElement = jest.fn((tag) => ({
      textContent: "",
      innerHTML: "",
    }));
  });

  test("should escape HTML special characters", () => {
    const mockDiv = {
      textContent: "",
      innerHTML: "",
    };

    document.createElement.mockReturnValue(mockDiv);

    const input = '<script>alert("XSS")</script>';
    escapeHTML(input);

    expect(mockDiv.textContent).toBe(input);
  });

  test("should return empty string for null", () => {
    expect(escapeHTML(null)).toBe("");
  });

  test("should return empty string for undefined", () => {
    expect(escapeHTML(undefined)).toBe("");
  });

  test("should return empty string for empty string", () => {
    const mockDiv = { textContent: "", innerHTML: "" };
    document.createElement.mockReturnValue(mockDiv);

    expect(escapeHTML("")).toBe("");
  });
});

describe("formatDate", () => {
  beforeEach(() => {
    // Mock Date.prototype.toLocaleString
    const originaltoLocaleString = Date.prototype.toLocaleString;
    Date.prototype.toLocaleString = jest.fn(function () {
      return "10/03/26, 19:45";
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should format valid Date object", () => {
    const date = new Date("2026-03-10T19:45:00");

    const result = formatDate(date);

    expect(result).toContain("10");
    expect(result).toContain("19");
  });

  test("should format date string", () => {
    const result = formatDate("2026-03-10");

    expect(result).toBeTruthy();
  });

  test("should format timestamp", () => {
    const result = formatDate(1700000000000);

    expect(result).toBeTruthy();
  });

  test("should return '-' for null", () => {
    expect(formatDate(null)).toBe("-");
  });

  test("should return '-' for undefined", () => {
    expect(formatDate(undefined)).toBe("-");
  });

  test("should return '-' for empty string", () => {
    expect(formatDate("")).toBe("-");
  });

  test("should return '-' for invalid date", () => {
    const result = formatDate("invalid-date");

    expect(result).toBe("-");
  });
});

describe("generateFolio", () => {
  test("should generate folio with count 0", () => {
    expect(generateFolio(0)).toBe("P-001");
  });

  test("should generate folio with count 1", () => {
    expect(generateFolio(1)).toBe("P-002");
  });

  test("should generate folio with count 99", () => {
    expect(generateFolio(99)).toBe("P-100");
  });

  test("should generate folio with count 999", () => {
    expect(generateFolio(999)).toBe("P-1000");
  });

  test("should pad with zeros for small counts", () => {
    expect(generateFolio(5)).toBe("P-006");
    expect(generateFolio(9)).toBe("P-010");
  });

  test("should handle large counts", () => {
    expect(generateFolio(9999)).toBe("P-10000");
  });
});

describe("TRIAGE_COLORS", () => {
  test("should have ROJO color defined", () => {
    expect(TRIAGE_COLORS.ROJO).toBe("#dc3545");
  });

  test("should have AMARILLO color defined", () => {
    expect(TRIAGE_COLORS.AMARILLO).toBe("#ffc107");
  });

  test("should have VERDE color defined", () => {
    expect(TRIAGE_COLORS.VERDE).toBe("#28a745");
  });

  test("should have NEGRO color defined", () => {
    expect(TRIAGE_COLORS.NEGRO).toBe("#343a40");
  });

  test("should have all triage colors as valid hex", () => {
    const hexRegex = /^#[0-9A-F]{6}$/i;

    Object.values(TRIAGE_COLORS).forEach((color) => {
      expect(color).toMatch(hexRegex);
    });
  });
});
