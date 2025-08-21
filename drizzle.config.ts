import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  schema: './src/core/infrastructure/database/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.TURSO_URL || 'file:./local.db',
    token: process.env.TURSO_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
});
