const fs = require('fs');
const path = require('path');
const { supabase, isSupabaseConfigured } = require('../config/supabase');
let pg = null;
try {
  pg = require('pg');
} catch (e) {
  // pg optional
}

const tableAvailability = {
  users: null,
  product_categories: null,
  products: null,
  articles: null,
  partners: null,
  careers: null,
  career_applications: null,
  inquiries: null,
  home_sections: null,
  hero_slides: null,
  showcase_slides: null,
  industries: null,
  about_content: null
};

/**
 * Checks or executes migrations on server boot
 */
async function autoMigrate() {
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.SUPABASE_DB_URL;

  // 1. Direct PostgreSQL Connection (if DATABASE_URL provided) -> Auto-Run unified schema.sql
  if (dbUrl && pg) {
    const { Client } = pg;
    const client = new Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false }
    });

    try {
      console.log('[Auto-Migrate] 🔄 Connecting to PostgreSQL to verify schema...');
      await client.connect();
      const sqlFile = path.join(__dirname, '../sql/schema.sql');
      if (fs.existsSync(sqlFile)) {
        const sql = fs.readFileSync(sqlFile, 'utf8');
        await client.query(sql);
        console.log('[Auto-Migrate] ✅ All PostgreSQL tables and schema definitions verified/applied successfully!');
      }
      await client.end();
      return;
    } catch (err) {
      console.warn('[Auto-Migrate] Direct PostgreSQL migration notice:', err.message);
      try {
        await client.end();
      } catch {}
    }
  }

  // 2. Supabase REST API Schema Verification
  if (isSupabaseConfigured()) {
    const tables = Object.keys(tableAvailability);
    const checks = await Promise.all(
      tables.map(async (tableName) => {
        try {
          const { error } = await supabase.from(tableName).select('id').limit(1);
          const isAvailable = !error || (error.code !== '42P01' && !error.message?.includes('schema cache'));
          tableAvailability[tableName] = isAvailable;
          return { tableName, isAvailable };
        } catch {
          tableAvailability[tableName] = false;
          return { tableName, isAvailable: false };
        }
      })
    );

    const activeTables = checks.filter(c => c.isAvailable).map(c => c.tableName);
    const memoryTables = checks.filter(c => !c.isAvailable).map(c => c.tableName);

    console.log('[Schema Health] Supabase Cloud Tables:');
    if (activeTables.length > 0) {
      console.log(`  ✓ Synced in Cloud: ${activeTables.join(', ')}`);
    }
    if (memoryTables.length > 0) {
      console.log(`  ⚡ In-Memory Fallback: ${memoryTables.join(', ')}`);
      console.log(`  💡 Tip: To sync tables to Supabase, run 'backend/sql/schema.sql' in Supabase SQL Editor or provide DATABASE_URL in .env`);
    }
  }
}

function isTableAvailable(tableName) {
  if (tableAvailability[tableName] === false) return false;
  return true;
}

module.exports = {
  autoMigrate,
  isTableAvailable
};
