const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { seedDatabase } = require('../models/initialData');

async function runSeed() {
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.SUPABASE_DB_URL;

  if (!dbUrl) {
    console.log('\n=============================================================');
    console.log('🌱 ASKARA DATABASE SEEDER (Centralized in initialData.js)');
    console.log('=============================================================');
    console.log('❌ No direct PostgreSQL connection string (DATABASE_URL) found in backend/.env.');
    console.log('\nPlease add your PostgreSQL connection string to backend/.env:');
    console.log('  DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres\n');
    console.log('When running without direct DB URL, the application automatically');
    console.log('uses centralized in-memory fallback from backend/models/initialData.js.');
    console.log('=============================================================\n');
    process.exit(0);
  }

  let pg;
  try {
    pg = require('pg');
  } catch (err) {
    console.error('❌ "pg" library not found. Run "npm install pg"');
    process.exit(1);
  }

  const { Client } = pg;
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    await seedDatabase(client);

    console.log('\n🎉 All initial seed data has been populated successfully from initialData.js!\n');
  } catch (err) {
    console.error('❌ [Seed Error]', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSeed();
