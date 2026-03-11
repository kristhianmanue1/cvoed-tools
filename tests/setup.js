/**
 * Jest Setup File
 * Global test configuration and mocks
 */

// Mock Speech Synthesis API FIRST (before any imports)
class MockSpeechSynthesisUtterance {
  constructor(text) {
    this.text = text;
    this.lang = 'es-MX';
    this.rate = 1.0;
    this.pitch = 1.0;
    this.volume = 1.0;
    this.voice = null;
    this.onstart = null;
    this.onend = null;
    this.onerror = null;
  }
}

const mockSpeechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn(() => []),
  pending: false,
  speaking: false,
  paused: false,
};

global.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
global.speechSynthesis = mockSpeechSynthesis;

// Polyfill TextEncoder/TextDecoder for Node.js environment
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock window and document before jsdom environment is created
if (typeof global.window === "undefined") {
  global.window = {
    speechSynthesis: mockSpeechSynthesis,
  };
}

if (typeof global.document === "undefined") {
  global.document = {};
}

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: key => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: i => Object.keys(store)[i] || null,
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock indexedDB with fake-indexeddb
const FDBFactory = require("fake-indexeddb/lib/FDBFactory");
Object.defineProperty(window, "indexedDB", {
  value: new FDBFactory(),
  writable: true,
});

// Mock window.URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
global.URL.revokeObjectURL = jest.fn();

// Mock Blob
global.Blob = class Blob {
  constructor(parts, options) {
    this.parts = parts;
    this.options = options;
  }
};

// Mock alert, prompt, confirm (silent in tests)
global.alert = jest.fn();
global.prompt = jest.fn();
global.confirm = jest.fn();

// Mock console methods to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock SQL.js - we'll create a simple mock
class MockSQLDatabase {
  constructor(data) {
    this.data = data;
    this.tables = {
      pacientes: [],
      trazabilidad: [],
      operadores: [],
      auditoria: [],
    };
  }

  run(sql, params = []) {
    // Simple SQL parser for INSERT, UPDATE, CREATE
    if (sql.includes("INSERT INTO pacientes")) {
      // Mock insert
    } else if (sql.includes("INSERT INTO trazabilidad")) {
      // Mock insert
    } else if (sql.includes("INSERT INTO auditoria")) {
      // Mock insert
    } else if (sql.includes("CREATE TABLE")) {
      // Mock create table
    } else if (sql.includes("UPDATE")) {
      // Mock update
    }
  }

  prepare(sql) {
    return {
      step: jest.fn(() => false),
      getAsObject: jest.fn(() => ({})),
      bind: jest.fn(),
      free: jest.fn(),
    };
  }

  exec(sql) {
    // Mock exec
  }

  export() {
    return new Uint8Array([]);
  }
}

global.initSqlJs = jest.fn(() =>
  Promise.resolve({
    Database: MockSQLDatabase,
  })
);

// Mock XLSX library
global.XLSX = {
  utils: {
    book_new: jest.fn(() => ({})),
    json_to_sheet: jest.fn(() => ({})),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
};
