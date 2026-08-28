const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { seedDatabase } = require('../models/initialData');

async function run() {
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.SUPABASE_DB_URL;

  if (!dbUrl) {
    console.log('\n=============================================================');
    console.log('🚀 ASKARA DATABASE MIGRATION GUIDE');
    console.log('=============================================================');
    console.log('No direct PostgreSQL connection string (DATABASE_URL) found in .env.');
    console.log('\nOption 1: Add direct Postgres connection string to backend/.env:');
    console.log('  DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres');
    console.log('\nOption 2: Execute unified SQL schema directly in Supabase Dashboard:');
    console.log('  1. Open: Supabase Dashboard -> SQL Editor');
    console.log('  2. Paste contents of: backend/sql/schema.sql');
    console.log('  3. Click RUN.\n');
    console.log('=============================================================\n');
    return;
  }

  const { Client } = require('pg');
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('[Migration] Connecting to PostgreSQL database...');
    await client.connect();
    const sqlPath = path.join(__dirname, '../sql/schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('[Migration] Running unified schema.sql migrations...');
    await client.query(sql);
    console.log('[Migration] ✅ All tables, indexes, and RLS policies created/verified successfully!');

    console.log('[Migration] Syncing centralized initialData seeds...');
    await seedDatabase(client);
    console.log('[Migration] ✅ Migration and seeding finished successfully!');
  } catch (err) {
    console.error('[Migration Error]', err.message);
  } finally {
    await client.end();
  }
}

run();
