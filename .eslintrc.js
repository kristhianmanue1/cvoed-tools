module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true,
  },
  extends: [
    "airbnb-base",
    "prettier", // Always last - overrides conflicting rules
  ],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  globals: {
    // SQL.js
    initSqlJs: "readonly",
    SQL: "readonly",
    // XLSX
    XLSX: "readonly",
    // CONFIG (loaded from config.js)
    CONFIG: "readonly",
    // Migration functions (loaded from db-migrations.js)
    getDBVersion: "readonly",
    DB_SCHEMA_VERSION: "readonly",
    _backupDatabaseForMigration: "readonly",
    _migrateDatabase: "readonly",
    // AMD (for sql-wasm.js)
    define: "readonly",
    require: "readonly",
  },
  rules: {
    // Prettier integration
    "prettier/prettier": "error",

    // Reglas específicas para el proyecto
    "no-console": "off", // Permitir console en código hospitalario
    "no-alert": "off", // Permitir alerts en simulacros
    "max-len": "off", // Desactivar para líneas largas con SQL
    "no-param-reassign": "off", // Permitir reasignación de parámetros
    "consistent-return": "warn", // Warning en lugar de error
    // Reglas adicionales para archivos legados
    "no-underscore-dangle": "off", // Permitir _performSave y similares
    camelcase: "off", // Permitir snake_case para variables de base de datos
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }], // Warning para unused
    "no-plusplus": "off", // Permitir i++
    "vars-on-top": "off", // Permitir var en cualquier lugar
    "no-var": "off", // Permitir var
    "prefer-rest-params": "off", // Permitir arguments
    "no-use-before-define": "off", // Permitir uso antes de definición
    "no-cond-assign": "off", // Permitir asignación en condiciones
    "no-self-assign": "off", // Permitir auto-asignación
    "no-restricted-globals": "off", // Permitir isNaN
    "no-promise-executor-return": "off", // Permitir return en promise executor
    "no-return-assign": "off", // Permitir return con asignación
    "func-names": "off", // Permitir funciones sin nombre
    "prefer-arrow-callback": "off", // Permitir function expressions
    "no-bitwise": "off", // Permitir operadores bitwise para UUID
    "no-mixed-operators": "off", // Permitir mezcla de operadores
    "no-nested-ternary": "off", // Permitir ternarios anidados
    "prefer-destructuring": "off", // Desactivar para mejorar legibilidad
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".json"],
      },
    },
  },
};
