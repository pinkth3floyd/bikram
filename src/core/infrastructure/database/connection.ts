import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// Database URLs and tokens from environment variables
const TURSO_URL = process.env.TURSO_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
const TURSO_URL_READONLY = process.env.TURSO_URL_READONLY;
const TURSO_AUTH_TOKEN_READONLY = process.env.TURSO_AUTH_TOKEN_READONLY;

if (!TURSO_URL || !TURSO_AUTH_TOKEN) {
  throw new Error('Missing required Turso database configuration. Please set TURSO_URL and TURSO_AUTH_TOKEN environment variables.');
}

// Create the main database client (read-write)
const client = createClient({
  url: TURSO_URL,
  authToken: TURSO_AUTH_TOKEN,
});

// Create the readonly database client if configured
const readonlyClient = TURSO_URL_READONLY && TURSO_AUTH_TOKEN_READONLY 
  ? createClient({
      url: TURSO_URL_READONLY,
      authToken: TURSO_AUTH_TOKEN_READONLY,
    })
  : null;

// Create Drizzle database instances
export const db = drizzle(client, { schema });
export const dbReadonly = readonlyClient ? drizzle(readonlyClient, { schema }) : null;

// Export the raw clients for direct access if needed
export { client, readonlyClient };

// Database connection status
export const getDatabaseStatus = async () => {
  try {
    await client.execute('SELECT 1');
    return {
      main: 'connected',
      readonly: readonlyClient ? 'connected' : 'not_configured',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      main: 'error',
      readonly: readonlyClient ? 'error' : 'not_configured',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
};

// Health check function
export const healthCheck = async () => {
  const status = await getDatabaseStatus();
  return status.main === 'connected';
};
