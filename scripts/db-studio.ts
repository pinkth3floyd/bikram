#!/usr/bin/env tsx

import * as dotenv from 'dotenv';
import { spawn } from 'child_process';

// Load environment variables
dotenv.config();

console.log('🔧 Starting Drizzle Studio with proper environment variables...');
console.log('📊 Database URL:', process.env.TURSO_URL ? 'SET' : 'NOT SET');
console.log('🔑 Auth Token:', process.env.TURSO_AUTH_TOKEN ? 'SET' : 'NOT SET');

// Set environment variables for the child process
const env = {
  ...process.env,
  TURSO_URL: process.env.TURSO_URL,
  TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
};

// Spawn drizzle-kit studio with proper environment
const studio = spawn('npx', ['drizzle-kit', 'studio'], {
  stdio: 'inherit',
  env,
  shell: true
});

studio.on('error', (error) => {
  console.error('❌ Failed to start Drizzle Studio:', error.message);
  process.exit(1);
});

studio.on('close', (code) => {
  console.log(`\n🔚 Drizzle Studio exited with code ${code}`);
  process.exit(code || 0);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping Drizzle Studio...');
  studio.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping Drizzle Studio...');
  studio.kill('SIGTERM');
});
