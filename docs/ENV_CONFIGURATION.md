# Environment Configuration

## Overview

CVOED-Tools uses a flexible environment configuration system that allows different settings for development, testing, and production environments.

## Environment Files

Three environment template files are provided:

- `.env.development` - Development environment settings
- `.env.test` - Testing environment settings
- `.env.production` - Production environment settings

## Configuration Options

### Application Settings

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/test/production) | `development` |
| `APP_NAME` | Application name | `CVOED-Tools` |
| `APP_VERSION` | Current version | `2.0.0` |
| `API_URL` | API endpoint URL | `http://localhost:8000` |

### Feature Flags

| Variable | Description | Default |
|----------|-------------|---------|
| `FEATURE_PIN_HASHING` | Enable PIN hashing | `true` |
| `FEATURE_WEB_WORKERS` | Enable Web Workers | `true` |
| `FEATURE_DARK_MODE` | Enable dark mode | `true` |
| `FEATURE_DEBUG_MODE` | Enable debug mode | `true` (dev), `false` (prod) |

### Database Settings

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_NAME` | IndexedDB database name | `ECEDES_DB` |
| `DB_VERSION` | Database schema version | `1` |
| `DB_TIMEOUT` | Database operation timeout (ms) | `5000` |

### Export Settings

| Variable | Description | Default |
|----------|-------------|---------|
| `EXPORT_MAX_ROWS` | Maximum rows for Excel export | `10000` (dev), `50000` (prod) |
| `EXPORT_TIMEOUT` | Export operation timeout (ms) | `30000` (dev), `60000` (prod) |

### Session Settings

| Variable | Description | Default |
|----------|-------------|---------|
| `SESSION_TIMEOUT` | User session timeout (ms) | `3600000` (1 hour) |
| `SESSION_WARNING` | Session warning time (ms) | `300000` (5 min) |

### Logging Settings

| Variable | Description | Default |
|----------|-------------|---------|
| `LOG_LEVEL` | Logging level (debug/info/warn/error) | `debug` (dev), `warn` (prod) |
| `LOG_TO_CONSOLE` | Enable console logging | `true` (dev), `false` (prod) |

## Usage

### In Node.js (Build Scripts, Tests)

```javascript
const ENV = require('./src/config/env');

if (ENV.isDevelopment()) {
  console.log('Running in development mode');
}

if (ENV.DEBUG_MODE) {
  console.debug('Debug information');
}
```

### In Browser (ECE-DES Application)

The `CONFIG` object is automatically available in the browser:

```javascript
// Check environment
if (CONFIG.isDevelopment()) {
  CONFIG.debug('Development mode active');
}

// Use logging
CONFIG.info('Application started', { version: CONFIG.APP_VERSION });
CONFIG.warn('Warning message');
CONFIG.error('Error occurred', { error: details });

// Get configuration values
const dbName = CONFIG.get('DB_NAME');
const maxRows = CONFIG.EXPORT_MAX_ROWS;
```

## Environment Detection

The browser-based `CONFIG` automatically detects the environment:

- **Development**: `localhost`, `127.0.0.1`, or port 8000
- **Test**: URL contains `?test=true`
- **Production**: Any other hostname

## NPM Scripts

```bash
# Set active environment
npm run env:dev    # Use .env.development
npm run env:prod   # Use .env.production
npm run env:test   # Use .env.test

# Run tests with test environment
npm test           # Automatically sets NODE_ENV=test

# Build for specific environment
npm run build:dev  # Development build
npm run build      # Production build
```

## Adding New Configuration

1. Add the variable to all three `.env.*` files
2. Add the property to `src/config/env.js` (Node.js)
3. Add the property to `src/ece-des/js/config.js` (Browser)
4. Update this documentation

## Security Notes

- Never commit `.env` files with sensitive data
- Use `.env.local` for local overrides (gitignored)
- Production secrets should be injected at runtime
- PIN hashing is always enabled for security

## Testing

Run the config module tests:

```bash
npm test tests/unit/config.test.js
```

Coverage report should show >90% for the config module.
