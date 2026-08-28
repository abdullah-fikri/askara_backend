const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { seedDatabase } = require('../models/initialData');

async function setupDatabase() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.SUPABASE_DB_URL;

  if (!connectionString) {
    console.log('\n❌ DATABASE_URL tidak ditemukan di backend/.env.');
    console.log('📌 Cara Penggunaan:');
    console.log('1. Buka Supabase Dashboard (https://supabase.com/dashboard)');
    console.log('2. Buka menu "SQL Editor" di sidebar kiri');
    console.log('3. Copy isi file "backend/sql/schema.sql" dan klik "Run"');
    console.log('4. Tambahkan DATABASE_URL ke backend/.env untuk menjalankan seed terpusat dari initialData.js\n');
    process.exit(0);
  }

  console.log('🔌 Menghubungkan ke PostgreSQL Supabase via DATABASE_URL...');
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, '../sql/schema.sql'), 'utf-8');

    console.log('⏳ Menjalankan schema.sql (membuat seluruh 11 tabel, indeks, dan security policy)...');
    await pool.query(schemaSql);
    console.log('✅ Schema tabel berhasil dibuat dan sinkron!');

    console.log('⏳ Menjalankan seed dari backend/models/initialData.js...');
    await seedDatabase(pool);
    console.log('✅ Seluruh data awal berhasil diisi ke PostgreSQL / Supabase!');

    console.log('\n🎉 Setup Database Askara Selesai 100%!\n');
  } catch (err) {
    console.error('❌ Gagal menjalankan setup database:', err.message);
  } finally {
    await pool.end();
  }
}

setupDatabase();
