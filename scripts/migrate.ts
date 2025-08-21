#!/usr/bin/env tsx

import { migrate } from 'drizzle-orm/libsql/migrator';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../src/core/infrastructure/database/schema';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  const TURSO_URL = process.env.TURSO_URL;
  const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

  if (!TURSO_URL || !TURSO_AUTH_TOKEN) {
    console.error('Missing required environment variables: TURSO_URL and TURSO_AUTH_TOKEN');
    process.exit(1);
  }

  try {
    console.log('Connecting to Turso database...');
    
    const client = createClient({
      url: TURSO_URL,
      authToken: TURSO_AUTH_TOKEN,
    });

    const db = drizzle(client, { schema });

    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });

    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();
