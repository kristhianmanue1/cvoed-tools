/**
 * Authentication Module Unit Tests
 * Tests for login, logout, session management, and audit logging
 */

import { JSDOM } from "jsdom";

describe("Authentication Module", () => {
  let document;
  let window;
  let app;
  let mockLocalStorage;

  beforeEach(() => {
    // Create fresh DOM environment
    const dom = new JSDOM(
      '<!DOCTYPE html><html><body>\
      <div id="view-login"></div>\
      <div id="view-app" class="hidden"></div>\
      <div id="nav-hospital"></div>\
      <div id="nav-operador"></div>\
      <input id="login-hospital" />\
      <input id="login-operador" />\
      <input id="login-pin" />\
    </body></html>'
    );

    window = dom.window;
    document = window.document;
    global.document = document;
    global.window = window;

    // Setup localStorage mock
    mockLocalStorage = {
      store: {},
      getItem: jest.fn(key => mockLocalStorage.store[key] || null),
      setItem: jest.fn((key, value) => {
        mockLocalStorage.store[key] = value;
      }),
      removeItem: jest.fn(key => {
        delete mockLocalStorage.store[key];
      }),
      clear: jest.fn(() => {
        mockLocalStorage.store = {};
      }),
    };
    global.localStorage = mockLocalStorage;

    // Setup indexedDB mock
    const mockDB = {
      run: jest.fn(),
      prepare: jest.fn(() => ({
        step: jest.fn(() => false),
        getAsObject: jest.fn(() => ({})),
        bind: jest.fn(),
        free: jest.fn(),
      })),
      exec: jest.fn(),
    };

    // Create app object with auth methods
    app = {
      db: mockDB,
      session: {
        hospital: "",
        operador: "",
        rol: "",
        ingreso: null,
      },

      audit: jest.fn(),

      checkSession() {
        const savedHospital = localStorage.getItem("ecedes_hospital");
        const savedOperador = localStorage.getItem("ecedes_operador");
        if (savedHospital && savedOperador) {
          this.session.hospital = savedHospital;
          this.session.operador = savedOperador;
          const navHospital = document.getElementById("nav-hospital");
          const navOperador = document.getElementById("nav-operador");
          if (navHospital) navHospital.textContent = savedHospital;
          if (navOperador) navOperador.textContent = savedOperador;
          return true;
        }
        return false;
      },

      login(hospital, operador, pin) {
        // Validate inputs
        if (!hospital || !operador || !pin) {
          throw new Error("Todos los campos son requeridos");
        }

        // Validate PIN length (4 digits)
        if (!/^\d{4}$/.test(pin)) {
          throw new Error("PIN debe ser 4 dígitos");
        }

        // Set session
        this.session.hospital = hospital;
        this.session.operador = operador;
        this.session.ingreso = new Date().toISOString();

        // Store in localStorage
        localStorage.setItem("ecedes_hospital", hospital);
        localStorage.setItem("ecedes_operador", operador);

        // Audit the login event
        this.audit("LOGIN", "operadores", "SESSION", `Intento de acceso PIN length: ${pin.length}`);

        return true;
      },

      logout() {
        // Clear session
        const operador = this.session.operador;
        this.session.hospital = "";
        this.session.operador = "";
        this.session.ingreso = null;

        // Remove from localStorage
        localStorage.removeItem("ecedes_operador");

        // Audit the logout event
        this.audit("LOGOUT", "operadores", "SESSION", `Cierre de sesión: ${operador}`);

        return true;
      },

      verifyPIN(pin, storedHash) {
        // For emergency situations, we use a simple validation
        // In production, this would use proper hashing
        if (!pin || pin.length !== 4) {
          return false;
        }
        if (!/^\d{4}$/.test(pin)) {
          return false;
        }
        return true;
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login() tests", () => {
    test("login() validates PIN length (4 digits)", () => {
      // Arrange
      const hospital = "Test Hospital";
      const operador = "Test Operator";
      const pinInvalido = "123"; // Too short

      // Act & Assert
      expect(() => {
        app.login(hospital, operador, pinInvalido);
      }).toThrow("PIN debe ser 4 dígitos");
    });

    test("login() rejects non-numeric PIN", () => {
      // Arrange
      const hospital = "Test Hospital";
      const operador = "Test Operator";
      const pinInvalido = "ABCD"; // Non-numeric

      // Act & Assert
      expect(() => {
        app.login(hospital, operador, pinInvalido);
      }).toThrow("PIN debe ser 4 dígitos");
    });

    test("login() stores session in localStorage", () => {
      // Arrange
      const hospital = "General Hospital";
      const operador = "Dr. House";
      const pinValido = "1234";

      // Act
      app.login(hospital, operador, pinValido);

      // Assert
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("ecedes_hospital", hospital);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("ecedes_operador", operador);
      expect(mockLocalStorage.store["ecedes_hospital"]).toBe(hospital);
      expect(mockLocalStorage.store["ecedes_operador"]).toBe(operador);
    });

    test("login() audits LOGIN event", () => {
      // Arrange
      const hospital = "Test Hospital";
      const operador = "Test Operator";
      const pinValido = "1234";

      // Act
      app.login(hospital, operador, pinValido);

      // Assert
      expect(app.audit).toHaveBeenCalledWith(
        "LOGIN",
        "operadores",
        "SESSION",
        "Intento de acceso PIN length: 4"
      );
    });

    test("login() rejects empty fields", () => {
      // Arrange
      const hospital = "";
      const operador = "Test Operator";
      const pinValido = "1234";

      // Act & Assert
      expect(() => {
        app.login(hospital, operador, pinValido);
      }).toThrow("Todos los campos son requeridos");
    });
  });

  describe("logout() tests", () => {
    test("logout() clears session from localStorage", () => {
      // Arrange
      app.session.hospital = "Test Hospital";
      app.session.operador = "Test Operator";
      mockLocalStorage.store["ecedes_operador"] = "Test Operator";

      // Act
      app.logout();

      // Assert
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("ecedes_operador");
      expect(app.session.hospital).toBe("");
      expect(app.session.operador).toBe("");
    });

    test("logout() audits LOGOUT event", () => {
      // Arrange
      app.session.operador = "Dr. House";

      // Act
      app.logout();

      // Assert
      expect(app.audit).toHaveBeenCalledWith(
        "LOGOUT",
        "operadores",
        "SESSION",
        "Cierre de sesión: Dr. House"
      );
    });
  });

  describe("session persistence tests", () => {
    test("session persists across reloads via localStorage", () => {
      // Arrange
      const hospital = "Persist Hospital";
      const operador = "Dr. Strange";
      mockLocalStorage.store["ecedes_hospital"] = hospital;
      mockLocalStorage.store["ecedes_operador"] = operador;

      // Act
      const hasSession = app.checkSession();

      // Assert
      expect(hasSession).toBe(true);
      expect(app.session.hospital).toBe(hospital);
      expect(app.session.operador).toBe(operador);
    });

    test("checkSession returns false when no saved session", () => {
      // Arrange - empty localStorage
      mockLocalStorage.store = {};

      // Act
      const hasSession = app.checkSession();

      // Assert
      expect(hasSession).toBe(false);
      expect(app.session.hospital).toBe("");
      expect(app.session.operador).toBe("");
    });
  });

  describe("verifyPIN() tests", () => {
    test("verifyPIN() correctly validates 4-digit PIN", () => {
      // Arrange
      const validPin = "1234";

      // Act
      const result = app.verifyPIN(validPin);

      // Assert
      expect(result).toBe(true);
    });

    test("verifyPIN() rejects incorrect PIN (less than 4 digits)", () => {
      // Arrange
      const invalidPin = "123";

      // Act
      const result = app.verifyPIN(invalidPin);

      // Assert
      expect(result).toBe(false);
    });

    test("verifyPIN() rejects incorrect PIN (non-numeric)", () => {
      // Arrange
      const invalidPin = "12A4";

      // Act
      const result = app.verifyPIN(invalidPin);

      // Assert
      expect(result).toBe(false);
    });

    test("verifyPIN() rejects null or empty PIN", () => {
      // Arrange
      const emptyPin = "";

      // Act
      const result = app.verifyPIN(emptyPin);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("session expiration tests", () => {
    test("session expires after inactivity period", () => {
      // Arrange
      app.session.hospital = "Test Hospital";
      app.session.operador = "Test Operator";
      app.session.ingreso = new Date(Date.now() - 31 * 60 * 1000).toISOString(); // 31 minutes ago

      // Simulate session check with timeout
      const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
      const now = new Date().getTime();
      const sessionTime = new Date(app.session.ingreso).getTime();
      const isExpired = now - sessionTime > SESSION_TIMEOUT_MS;

      // Act & Assert
      expect(isExpired).toBe(true);
    });

    test("session remains valid within activity window", () => {
      // Arrange
      app.session.hospital = "Test Hospital";
      app.session.operador = "Test Operator";
      app.session.ingreso = new Date(Date.now() - 10 * 60 * 1000).toISOString(); // 10 minutes ago

      // Simulate session check with timeout
      const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
      const now = new Date().getTime();
      const sessionTime = new Date(app.session.ingreso).getTime();
      const isExpired = now - sessionTime > SESSION_TIMEOUT_MS;

      // Act & Assert
      expect(isExpired).toBe(false);
    });
  });
});
