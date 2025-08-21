#!/usr/bin/env tsx

import * as dotenv from 'dotenv';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../src/core/infrastructure/database/schema';

// Load environment variables
dotenv.config();

async function viewDatabase() {
  try {
    console.log('🔍 Database Viewer - Turso Database Inspection');
    console.log('==============================================\n');

    const client = createClient({
      url: process.env.TURSO_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    const db = drizzle(client, { schema });

    // 1. Check all tables
    console.log('📋 Database Tables:');
    console.log('-------------------');
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);
    
    tables.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.name}`);
    });

    // 2. Show table schemas
    console.log('\n📊 Table Schemas:');
    console.log('-----------------');
    
    for (const table of tables.rows) {
      const tableName = table.name as string;
      console.log(`\n🔸 ${tableName.toUpperCase()}:`);
      
      const columns = await client.execute(`PRAGMA table_info(${tableName})`);
      columns.rows.forEach((col: any) => {
        const nullable = col.notnull === 0 ? 'NULL' : 'NOT NULL';
        const defaultValue = col.dflt_value ? ` DEFAULT ${col.dflt_value}` : '';
        console.log(`   - ${col.name} (${col.type}) ${nullable}${defaultValue}`);
      });
    }

    // 3. Show record counts
    console.log('\n📈 Record Counts:');
    console.log('-----------------');
    
    for (const table of tables.rows) {
      const tableName = table.name as string;
      const count = await client.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
      console.log(`${tableName}: ${count.rows[0].count} records`);
    }

    // 4. Show recent posts (if any)
    console.log('\n📝 Recent Posts:');
    console.log('----------------');
    const posts = await client.execute(`
      SELECT id, author_id, type, privacy, created_at 
      FROM posts 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    if (posts.rows.length > 0) {
      posts.rows.forEach((post: any, index) => {
        console.log(`${index + 1}. [${post.type}] ${post.privacy} - ${post.author_id} (${post.created_at})`);
      });
    } else {
      console.log('No posts found');
    }

    // 5. Show recent comments (if any)
    console.log('\n💬 Recent Comments:');
    console.log('-------------------');
    const comments = await client.execute(`
      SELECT id, post_id, author_id, status, created_at 
      FROM comments 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    if (comments.rows.length > 0) {
      comments.rows.forEach((comment: any, index) => {
        console.log(`${index + 1}. [${comment.status}] ${comment.author_id} on ${comment.post_id} (${comment.created_at})`);
      });
    } else {
      console.log('No comments found');
    }

    // 6. Show recent likes (if any)
    console.log('\n❤️ Recent Likes:');
    console.log('----------------');
    const likes = await client.execute(`
      SELECT id, user_id, target_id, target_type, reaction, created_at 
      FROM likes 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    if (likes.rows.length > 0) {
      likes.rows.forEach((like: any, index) => {
        console.log(`${index + 1}. ${like.user_id} ${like.reaction} ${like.target_type} ${like.target_id} (${like.created_at})`);
      });
    } else {
      console.log('No likes found');
    }

    console.log('\n✅ Database inspection completed!');
    console.log('\n💡 Tips:');
    console.log('- Use the custom studio script: npm run db:studio');
    console.log('- Or use the original: npm run db:studio:original');
    console.log('- Run migrations: npm run db:migrate');

  } catch (error) {
    console.error('❌ Database inspection failed:', error);
    process.exit(1);
  }
}

viewDatabase();
