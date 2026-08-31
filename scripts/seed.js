const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { seedDatabase, initialUsers, initialAboutContent } = require('../models/initialData');
const { supabase, isSupabaseConfigured } = require('../config/supabase');

async function runSeed() {
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.SUPABASE_DB_URL;

  // 1. Direct PostgreSQL Connection Mode (pg client)
  if (dbUrl) {
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
      console.log('🔌 Connecting to PostgreSQL database via DATABASE_URL...');
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
    return;
  }

  // 2. Supabase SDK Mode (Using SUPABASE_URL + SUPABASE_SECRET_KEY)
  if (isSupabaseConfigured()) {
    console.log('🔌 Seeding Supabase via Supabase API Key...');
    try {
      // Seed Admin User
      for (const u of initialUsers) {
        const { error } = await supabase.from('users').upsert({
          id: u.id,
          name: u.name,
          email: u.email,
          password_hash: u.password_hash,
          role: u.role,
          updated_at: new Date().toISOString()
        }, { onConflict: 'email' });
        if (error) {
          console.warn('⚠️ User seed warning (make sure schema.sql has been run in Supabase SQL Editor):', error.message);
        } else {
          console.log(`  ✓ Verified admin user: ${u.email}`);
        }
      }

      // Seed About Content
      if (initialAboutContent) {
        const { error: aboutErr } = await supabase.from('about_content').upsert({
          key: initialAboutContent.key,
          hero_badge_en: initialAboutContent.hero_badge_en,
          hero_badge_id: initialAboutContent.hero_badge_id,
          hero_title_en: initialAboutContent.hero_title_en,
          hero_title_id: initialAboutContent.hero_title_id,
          hero_subtitle_en: initialAboutContent.hero_subtitle_en,
          hero_subtitle_id: initialAboutContent.hero_subtitle_id,
          who_we_are_tag_en: initialAboutContent.who_we_are_tag_en,
          who_we_are_tag_id: initialAboutContent.who_we_are_tag_id,
          who_we_are_heading_en: initialAboutContent.who_we_are_heading_en,
          who_we_are_heading_id: initialAboutContent.who_we_are_heading_id,
          who_we_are_p1_en: initialAboutContent.who_we_are_p1_en,
          who_we_are_p1_id: initialAboutContent.who_we_are_p1_id,
          who_we_are_p2_en: initialAboutContent.who_we_are_p2_en,
          who_we_are_p2_id: initialAboutContent.who_we_are_p2_id,
          who_we_are_points_en: initialAboutContent.who_we_are_points_en,
          who_we_are_points_id: initialAboutContent.who_we_are_points_id,
          who_we_are_images: initialAboutContent.who_we_are_images,
          why_choose_badge_en: initialAboutContent.why_choose_badge_en,
          why_choose_badge_id: initialAboutContent.why_choose_badge_id,
          why_choose_heading_en: initialAboutContent.why_choose_heading_en,
          why_choose_heading_id: initialAboutContent.why_choose_heading_id,
          why_choose_reasons: initialAboutContent.why_choose_reasons,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

        if (aboutErr) {
          console.warn('⚠️ About content seed warning:', aboutErr.message);
        } else {
          console.log('  ✓ Verified About Us content');
        }
      }

      console.log('\n🎉 Supabase initial data verified successfully!\n');
    } catch (err) {
      console.error('❌ [Supabase Seed Error]', err.message);
    }
    return;
  }

  console.log('\n=============================================================');
  console.log('🌱 ASKARA DATABASE SEEDER (Centralized in initialData.js)');
  console.log('=============================================================');
  console.log('❌ No DATABASE_URL or SUPABASE_URL / SUPABASE_SECRET_KEY found in backend/.env.');
  console.log('=============================================================\n');
}

runSeed();
