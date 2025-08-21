#!/usr/bin/env tsx

import * as dotenv from 'dotenv';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../src/core/infrastructure/database/schema';

// Load environment variables
dotenv.config();

interface Command {
  name: string;
  description: string;
  action: () => Promise<void>;
}

async function main() {
  const client = createClient({
    url: process.env.TURSO_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  const db = drizzle(client, { schema });

  const commands: Command[] = [
    {
      name: 'status',
      description: 'Show database status and table counts',
      action: async () => {
        console.log('📊 Database Status:');
        console.log('==================\n');
        
        const tables = await client.execute(`
          SELECT name FROM sqlite_master 
          WHERE type='table' AND name NOT LIKE 'sqlite_%'
          ORDER BY name
        `);
        
        for (const table of tables.rows) {
          const tableName = table.name as string;
          const count = await client.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
          console.log(`${tableName}: ${count.rows[0].count} records`);
        }
      }
    },
    {
      name: 'tables',
      description: 'List all tables with their schemas',
      action: async () => {
        console.log('📋 Database Tables:');
        console.log('==================\n');
        
        const tables = await client.execute(`
          SELECT name FROM sqlite_master 
          WHERE type='table' AND name NOT LIKE 'sqlite_%'
          ORDER BY name
        `);
        
        tables.rows.forEach((row, index) => {
          console.log(`${index + 1}. ${row.name}`);
        });
      }
    },
    {
      name: 'schema',
      description: 'Show detailed schema for a specific table',
      action: async () => {
        const tableName = process.argv[3];
        if (!tableName) {
          console.log('❌ Please specify a table name: npm run db:manager schema <table_name>');
          return;
        }
        
        console.log(`📊 Schema for ${tableName}:`);
        console.log('========================\n');
        
        const columns = await client.execute(`PRAGMA table_info(${tableName})`);
        columns.rows.forEach((col: any) => {
          const nullable = col.notnull === 0 ? 'NULL' : 'NOT NULL';
          const defaultValue = col.dflt_value ? ` DEFAULT ${col.dflt_value}` : '';
          console.log(`${col.name} (${col.type}) ${nullable}${defaultValue}`);
        });
      }
    },
    {
      name: 'query',
      description: 'Run a custom SQL query',
      action: async () => {
        const query = process.argv[3];
        if (!query) {
          console.log('❌ Please specify a query: npm run db:manager query "SELECT * FROM posts LIMIT 5"');
          return;
        }
        
        console.log(`🔍 Running query: ${query}`);
        console.log('=======================\n');
        
        try {
          const result = await client.execute(query);
          console.log('Results:', result.rows);
        } catch (error) {
          console.error('❌ Query failed:', error);
        }
      }
    },
    {
      name: 'clean',
      description: 'Clean all data (DANGEROUS - removes all records)',
      action: async () => {
        console.log('⚠️  WARNING: This will delete ALL data from the database!');
        console.log('Type "YES" to confirm:');
        
        // In a real implementation, you'd want to read from stdin
        // For now, we'll just show the warning
        console.log('❌ Clean operation requires interactive confirmation');
        console.log('💡 Use the query command instead: npm run db:manager query "DELETE FROM posts"');
      }
    },
    {
      name: 'help',
      description: 'Show this help message',
      action: async () => {
        console.log('🔧 Database Manager - Available Commands:');
        console.log('=========================================\n');
        
        commands.forEach(cmd => {
          console.log(`${cmd.name.padEnd(10)} - ${cmd.description}`);
        });
        
        console.log('\n💡 Usage: npm run db:manager <command> [args]');
        console.log('📖 Examples:');
        console.log('  npm run db:manager status');
        console.log('  npm run db:manager schema posts');
        console.log('  npm run db:manager query "SELECT COUNT(*) FROM posts"');
      }
    }
  ];

  const commandName = process.argv[2] || 'help';
  const command = commands.find(cmd => cmd.name === commandName);

  if (!command) {
    console.log(`❌ Unknown command: ${commandName}`);
    console.log('💡 Run "npm run db:manager help" for available commands');
    return;
  }

  try {
    await command.action();
  } catch (error) {
    console.error('❌ Command failed:', error);
  }
}

main();
