module.exports = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/tests/setup.js"],
  setupFilesAfterEnv: [],
  moduleNameMapper: {
    // More specific patterns first - Jest evaluates in order
    "^@/src/simulador/js/(.*)$": "<rootDir>/src/simulador/js/$1",
    "^@/src/(.*)$": "<rootDir>/src/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/tests/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  collectCoverageFrom: [
    "<rootDir>/src/**/*.js",
    "!**/*.test.js",
    "!**/*.spec.js",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!<rootDir>/src/shared/js/sql-wasm.js", // Excluir WebAssembly
    "!<rootDir>/src/shared/js/xlsx.full.min.js", // Excluir librería externa
  ],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 45,
      lines: 50,
      statements: 50,
    },
  },
  testMatch: [
    "**/tests/unit/**/*.test.js",
    "**/tests/integration/**/*.test.js",
    "**/tests/performance/**/*.test.js",
    "**/tests/**/*.spec.js",
  ],
  reporters: [
    "default",
    [
      "jest-html-reporters",
      {
        publicPath: "tests/coverage",
        filename: "report.html",
        expand: true,
      },
    ],
  ],
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testTimeout: 10000,
};
