const bcrypt = require('bcryptjs');

// Pre-hashed 'admin123'
const defaultAdminHash = bcrypt.hashSync('admin123', 10);

// ====================================================================
// 1. USERS SEED (Admin Login Credentials)
// ====================================================================
const initialUsers = [
  {
    id: 1,
    name: 'Askara Administrator',
    email: 'admin@askara.co.id',
    password_hash: defaultAdminHash,
    role: 'admin',
    created_at: new Date().toISOString()
  }
];

// ====================================================================
// 2. PRODUCT CATEGORIES (Empty by default - Managed via Admin)
// ====================================================================
const initialCategories = [];

// ====================================================================
// 3. PRODUCTS (Empty by default - Managed via Admin)
// ====================================================================
const initialProducts = [];

// ====================================================================
// 4. PARTNERS & PRINCIPALS (Empty by default - Managed via Admin)
// ====================================================================
const initialPartners = [];

// ====================================================================
// 5. ARTICLES (Empty by default - Managed via Admin)
// ====================================================================
const initialArticles = [];

// ====================================================================
// 6. CAREERS (Empty by default - Managed via Admin)
// ====================================================================
const initialCareers = [];

// ====================================================================
// 7. INQUIRIES (Empty by default)
// ====================================================================
const initialInquiries = [];

// ====================================================================
// 8. HERO SLIDES (Empty by default - Managed via Admin)
// ====================================================================
const initialHeroSlides = [];

// ====================================================================
// 9. SHOWCASE SLIDES (Empty by default - Managed via Admin)
// ====================================================================
const initialShowcaseSlides = [];

// ====================================================================
// 10. HOMEPAGE SECTIONS (Empty by default - Managed via Admin)
// ====================================================================
const initialHomeSections = [];

// ====================================================================
// 11. INDUSTRIES (Empty by default - Managed via Admin)
// ====================================================================
const initialIndustries = [];

// ====================================================================
// 12. ABOUT US CONTENT (Singleton Base Configuration)
// ====================================================================
const initialAboutContent = {
  id: 1,
  key: 'main',
  hero_badge_en: 'ABOUT PT ASKARA TEKNO PANGAN',
  hero_badge_id: 'TENTANG PT ASKARA TEKNO PANGAN',
  hero_title_en: 'Pioneering Laboratory Excellence & Quality Solutions Across Indonesia',
  hero_title_id: 'Memelopori Keunggulan Laboratorium & Solusi Kualitas di Seluruh Indonesia',
  hero_subtitle_en: 'Authorized distributor of world-class analytical instruments, rapid food safety testing kits, and specialized water treatment solutions.',
  hero_subtitle_id: 'Distributor resmi instrumen analitis kelas dunia, kit uji cepat keamanan pangan, dan solusi pengolahan air khusus.',
  who_we_are_tag_en: 'WHO WE ARE',
  who_we_are_tag_id: 'TENTANG KAMI',
  who_we_are_heading_en: 'Delivering Precision, Integrity, and Value to Food & Beverage Industries',
  who_we_are_heading_id: 'Menghadirkan Presisi, Integritas, dan Nilai bagi Industri Makanan & Minuman',
  who_we_are_p1_en: 'PT Askara Tekno Pangan is an authorized Indonesian distributor specializing in advanced analytical chemistry instruments, rapid test kits, microbiological media, and industrial water treatment systems.',
  who_we_are_p1_id: 'PT Askara Tekno Pangan adalah distributor resmi di Indonesia yang mengkhususkan diri pada instrumen kimia analitis canggih, kit uji cepat, media mikrobiologi, dan sistem pengolahan air industri.',
  who_we_are_p2_en: 'With our headquarters in Jakarta and service coverage across Indonesia, we partner with leading global principals to provide reliable technologies, application training, and after-sales support.',
  who_we_are_p2_id: 'Berpusat di Jakarta dengan cakupan layanan ke seluruh Indonesia, kami bermitra dengan prinsipal global terkemuka untuk menghadirkan teknologi andal, pelatihan aplikasi, serta layanan purna jual profesional.',
  who_we_are_points_en: [
    'Authorized distribution partnerships with world-renowned principals',
    'Comprehensive after-sales service and scheduled preventative maintenance',
    'Full certification compliance (ISO, AOAC, CE, Halal assurance)',
    'Experienced application scientists and factory-trained technical support'
  ],
  who_we_are_points_id: [
    'Kemitraan distribusi resmi dengan prinsipal terkemuka dunia',
    'Layanan purna jual menyeluruh dan pemeliharaan preventif berkala',
    'Kepatuhan standar mutu lengkap (ISO, AOAC, CE, jaminan Halal)',
    'Spesialis aplikasi berpengalaman dan teknisi bersertifikasi pabrik'
  ],
  who_we_are_images: [
    '/images/header.png',
    '/images/y15.png',
    '/images/gluten.png'
  ],
  why_choose_badge_en: 'OUR CORE ADVANTAGES',
  why_choose_badge_id: 'KEUNGGULAN UTAMA KAMI',
  why_choose_heading_en: 'Why Indonesian Industries Trust Askara',
  why_choose_heading_id: 'Mengapa Industri Indonesia Memilih Askara',
  why_choose_reasons: [
    {
      icon: 'ShieldCheck',
      title_en: 'Authorized Global Partners',
      title_id: 'Prinsipal Global Resmi',
      desc_en: 'Direct authorization from leading manufacturers ensuring authentic equipment and manufacturer warranty.',
      desc_id: 'Otorisasi langsung dari produsen terkemuka menjamin keaslian alat dan garansi resmi pabrikan.'
    },
    {
      icon: 'Award',
      title_en: 'Certified Quality Standards',
      title_id: 'Standar Mutu Bersertifikasi',
      desc_en: 'Products certified by AOAC, ISO, and CE ensuring analytical accuracy and regulatory compliance.',
      desc_id: 'Produk bersertifikasi AOAC, ISO, dan CE menjamin akurasi analitis dan kepatuhan regulasi.'
    },
    {
      icon: 'Wrench',
      title_en: 'Installation & Training',
      title_id: 'Instalasi & Pelatihan',
      desc_en: 'Professional installation, application support, and user training by experienced specialists.',
      desc_id: 'Instalasi profesional, dukungan aplikasi, dan pelatihan pengguna oleh spesialis berpengalaman.'
    },
    {
      icon: 'Headphones',
      title_en: 'Technical Support',
      title_id: 'Dukungan Teknis Handal',
      desc_en: 'Reliable after-sales service and scheduled maintenance to support long-term laboratory operations.',
      desc_id: 'Layanan purna jual responsif dan pemeliharaan berkala untuk mendukung kelancaran operasional laboratorium.'
    }
  ]
};

// ====================================================================
// PROGRAMMATIC DATABASE SEEDER HELPER
// ====================================================================
/**
 * Seeds initial user/admin into a PostgreSQL client/pool if needed
 * @param {import('pg').Client | import('pg').Pool} client - Connected pg client or pool
 */
async function seedDatabase(client) {
  console.log('🌱 [Seeder] Starting database verification from initialData.js...');

  // 1. Users (Admin user only)
  for (const u of initialUsers) {
    await client.query(
      `INSERT INTO users (id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         password_hash = EXCLUDED.password_hash,
         role = EXCLUDED.role`,
      [u.id, u.name, u.email, u.password_hash, u.role]
    );
  }
  console.log(`  ✓ Verified ${initialUsers.length} admin user`);

  // 2. Product Categories
  if (initialCategories.length > 0) {
    for (const c of initialCategories) {
      await client.query(
        `INSERT INTO product_categories (id, name_en, name_id, slug, description_en, description_id, image, is_active, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (slug) DO UPDATE SET
           name_en = EXCLUDED.name_en,
           name_id = EXCLUDED.name_id,
           description_en = EXCLUDED.description_en,
           description_id = EXCLUDED.description_id,
           image = EXCLUDED.image,
           is_active = EXCLUDED.is_active,
           sort_order = EXCLUDED.sort_order`,
        [c.id, c.name_en, c.name_id, c.slug, c.description_en, c.description_id, c.image, c.is_active, c.sort_order]
      );
    }
    console.log(`  ✓ Seeded ${initialCategories.length} product categories`);
  }

  // 3. Products
  if (initialProducts.length > 0) {
    for (const p of initialProducts) {
      await client.query(
        `INSERT INTO products (
           id, product_category_id, category_slug, name_en, name_id, slug, principal,
           short_description_en, short_description_id, description_en, description_id,
           image, specifications, applications_en, applications_id, features_en, features_id,
           brochure, is_active, is_featured, sort_order
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
         ON CONFLICT (slug) DO UPDATE SET
           product_category_id = EXCLUDED.product_category_id,
           category_slug = EXCLUDED.category_slug,
           name_en = EXCLUDED.name_en,
           name_id = EXCLUDED.name_id,
           principal = EXCLUDED.principal,
           short_description_en = EXCLUDED.short_description_en,
           short_description_id = EXCLUDED.short_description_id,
           description_en = EXCLUDED.description_en,
           description_id = EXCLUDED.description_id,
           image = EXCLUDED.image,
           specifications = EXCLUDED.specifications,
           applications_en = EXCLUDED.applications_en,
           applications_id = EXCLUDED.applications_id,
           features_en = EXCLUDED.features_en,
           features_id = EXCLUDED.features_id,
           is_active = EXCLUDED.is_active,
           is_featured = EXCLUDED.is_featured,
           sort_order = EXCLUDED.sort_order`,
        [
          p.id, p.product_category_id, p.category_slug, p.name_en, p.name_id, p.slug, p.principal,
          p.short_description_en, p.short_description_id, p.description_en, p.description_id,
          p.image, p.specifications, p.applications_en, p.applications_id, p.features_en, p.features_id,
          p.brochure, p.is_active, p.is_featured, p.sort_order
        ]
      );
    }
    console.log(`  ✓ Seeded ${initialProducts.length} products`);
  }

  // 4. Partners
  if (initialPartners.length > 0) {
    for (const part of initialPartners) {
      await client.query(
        `INSERT INTO partners (id, name, slug, logo, country, category, description_en, description_id, documentation_gallery, website_url, is_active, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11, $12)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           slug = EXCLUDED.slug,
           logo = EXCLUDED.logo,
           country = EXCLUDED.country,
           category = EXCLUDED.category,
           description_en = EXCLUDED.description_en,
           description_id = EXCLUDED.description_id,
           documentation_gallery = EXCLUDED.documentation_gallery,
           website_url = EXCLUDED.website_url,
           is_active = EXCLUDED.is_active,
           sort_order = EXCLUDED.sort_order`,
        [
          part.id, part.name, part.slug, part.logo, part.country, part.category,
          part.description_en, part.description_id, JSON.stringify(part.documentation_gallery || []),
          part.website_url, part.is_active, part.sort_order
        ]
      );
    }
    console.log(`  ✓ Seeded ${initialPartners.length} partners`);
  }

  // 5. Articles
  if (initialArticles.length > 0) {
    for (const art of initialArticles) {
      await client.query(
        `INSERT INTO articles (id, title_en, title_id, category_en, category_id, image, published_at, linkedin_url, is_active, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO UPDATE SET
           title_en = EXCLUDED.title_en,
           title_id = EXCLUDED.title_id,
           category_en = EXCLUDED.category_en,
           category_id = EXCLUDED.category_id,
           image = EXCLUDED.image,
           published_at = EXCLUDED.published_at,
           linkedin_url = EXCLUDED.linkedin_url,
           is_active = EXCLUDED.is_active,
           sort_order = EXCLUDED.sort_order`,
        [
          art.id, art.title_en, art.title_id, art.category_en, art.category_id, art.image,
          art.published_at, art.linkedin_url, art.is_active, art.sort_order
        ]
      );
    }
    console.log(`  ✓ Seeded ${initialArticles.length} articles`);
  }

  // 6. Careers
  if (initialCareers.length > 0) {
    for (const car of initialCareers) {
      await client.query(
        `INSERT INTO careers (
           id, slug, job_title_en, job_title_id, department_en, department_id,
           location_en, location_id, employment_type_en, employment_type_id,
           experience_level_en, experience_level_id, salary_range, description_en, description_id,
           responsibilities_en, responsibilities_id, requirements_en, requirements_id,
           benefits_en, benefits_id, is_active
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
         ON CONFLICT (id) DO UPDATE SET
           slug = EXCLUDED.slug,
           job_title_en = EXCLUDED.job_title_en,
           job_title_id = EXCLUDED.job_title_id,
           department_en = EXCLUDED.department_en,
           department_id = EXCLUDED.department_id,
           location_en = EXCLUDED.location_en,
           location_id = EXCLUDED.location_id,
           employment_type_en = EXCLUDED.employment_type_en,
           employment_type_id = EXCLUDED.employment_type_id,
           experience_level_en = EXCLUDED.experience_level_en,
           experience_level_id = EXCLUDED.experience_level_id,
           salary_range = EXCLUDED.salary_range,
           description_en = EXCLUDED.description_en,
           description_id = EXCLUDED.description_id,
           responsibilities_en = EXCLUDED.responsibilities_en,
           responsibilities_id = EXCLUDED.responsibilities_id,
           requirements_en = EXCLUDED.requirements_en,
           requirements_id = EXCLUDED.requirements_id,
           benefits_en = EXCLUDED.benefits_en,
           benefits_id = EXCLUDED.benefits_id,
           is_active = EXCLUDED.is_active`,
        [
          car.id, car.slug, car.job_title_en, car.job_title_id, car.department_en, car.department_id,
          car.location_en, car.location_id, car.employment_type_en, car.employment_type_id,
          car.experience_level_en, car.experience_level_id, car.salary_range, car.description_en, car.description_id,
          car.responsibilities_en, car.responsibilities_id, car.requirements_en, car.requirements_id,
          car.benefits_en, car.benefits_id, car.is_active
        ]
      );
    }
    console.log(`  ✓ Seeded ${initialCareers.length} careers`);
  }

  // 7. Hero Slides
  if (initialHeroSlides.length > 0) {
    for (const s of initialHeroSlides) {
      await client.query(
        `INSERT INTO hero_slides (
           id, badge_en, badge_id, title_en, title_id, subtitle_en, subtitle_id, image,
           tag_en, tag_id, primary_btn_text_en, primary_btn_text_id, primary_btn_url,
           secondary_btn_text_en, secondary_btn_text_id, secondary_btn_url,
           primary_cta_text_en, primary_cta_text_id, primary_cta_link,
           secondary_cta_text_en, secondary_cta_text_id, secondary_cta_link,
           sort_order, is_active
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
         ON CONFLICT (id) DO UPDATE SET
           badge_en = EXCLUDED.badge_en,
           badge_id = EXCLUDED.badge_id,
           title_en = EXCLUDED.title_en,
           title_id = EXCLUDED.title_id,
           subtitle_en = EXCLUDED.subtitle_en,
           subtitle_id = EXCLUDED.subtitle_id,
           image = EXCLUDED.image,
           tag_en = EXCLUDED.tag_en,
           tag_id = EXCLUDED.tag_id,
           primary_btn_text_en = EXCLUDED.primary_btn_text_en,
           primary_btn_text_id = EXCLUDED.primary_btn_text_id,
           primary_btn_url = EXCLUDED.primary_btn_url,
           secondary_btn_text_en = EXCLUDED.secondary_btn_text_en,
           secondary_btn_text_id = EXCLUDED.secondary_btn_text_id,
           secondary_btn_url = EXCLUDED.secondary_btn_url,
           primary_cta_text_en = EXCLUDED.primary_cta_text_en,
           primary_cta_text_id = EXCLUDED.primary_cta_text_id,
           primary_cta_link = EXCLUDED.primary_cta_link,
           secondary_cta_text_en = EXCLUDED.secondary_cta_text_en,
           secondary_cta_text_id = EXCLUDED.secondary_cta_text_id,
           secondary_cta_link = EXCLUDED.secondary_cta_link,
           sort_order = EXCLUDED.sort_order,
           is_active = EXCLUDED.is_active`,
        [
          s.id, s.badge_en, s.badge_id, s.title_en, s.title_id, s.subtitle_en, s.subtitle_id, s.image,
          s.tag_en, s.tag_id, s.primary_btn_text_en, s.primary_btn_text_id, s.primary_btn_url,
          s.secondary_btn_text_en, s.secondary_btn_text_id, s.secondary_btn_url,
          s.primary_cta_text_en, s.primary_cta_text_id, s.primary_cta_link,
          s.secondary_cta_text_en, s.secondary_cta_text_id, s.secondary_cta_link,
          s.sort_order, s.is_active
        ]
      );
    }
    console.log(`  ✓ Seeded ${initialHeroSlides.length} hero slides`);
  }

  // 8. Showcase Slides
  if (initialShowcaseSlides.length > 0) {
    for (const sc of initialShowcaseSlides) {
      await client.query(
        `INSERT INTO showcase_slides (
           id, tag_en, tag_id, title_en, title_id, caption_en, caption_id,
           desc_en, desc_id, image, cta_text_en, cta_text_id, cta_link,
           features_en, features_id, sort_order, is_active
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14::jsonb, $15::jsonb, $16, $17)
         ON CONFLICT (id) DO UPDATE SET
           tag_en = EXCLUDED.tag_en,
           tag_id = EXCLUDED.tag_id,
           title_en = EXCLUDED.title_en,
           title_id = EXCLUDED.title_id,
           caption_en = EXCLUDED.caption_en,
           caption_id = EXCLUDED.caption_id,
           desc_en = EXCLUDED.desc_en,
           desc_id = EXCLUDED.desc_id,
           image = EXCLUDED.image,
           cta_text_en = EXCLUDED.cta_text_en,
           cta_text_id = EXCLUDED.cta_text_id,
           cta_link = EXCLUDED.cta_link,
           features_en = EXCLUDED.features_en,
           features_id = EXCLUDED.features_id,
           sort_order = EXCLUDED.sort_order,
           is_active = EXCLUDED.is_active`,
        [
          sc.id, sc.tag_en, sc.tag_id, sc.title_en, sc.title_id, sc.caption_en, sc.caption_id,
          sc.desc_en, sc.desc_id, sc.image, sc.cta_text_en, sc.cta_text_id, sc.cta_link,
          JSON.stringify(sc.features_en || []), JSON.stringify(sc.features_id || []),
          sc.sort_order, sc.is_active
        ]
      );
    }
    console.log(`  ✓ Seeded ${initialShowcaseSlides.length} showcase slides`);
  }

  // 9. Home Sections
  if (initialHomeSections.length > 0) {
    for (const hs of initialHomeSections) {
      await client.query(
        `INSERT INTO home_sections (
           id, section_key, badge_en, badge_id, tag_en, tag_id,
           title_en, title_id, subtitle_en, subtitle_id, description_en, description_id,
           button_text_en, button_text_id, button_url, cta_text_en, cta_text_id, cta_link
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
         ON CONFLICT (section_key) DO UPDATE SET
           badge_en = EXCLUDED.badge_en,
           badge_id = EXCLUDED.badge_id,
           tag_en = EXCLUDED.tag_en,
           tag_id = EXCLUDED.tag_id,
           title_en = EXCLUDED.title_en,
           title_id = EXCLUDED.title_id,
           subtitle_en = EXCLUDED.subtitle_en,
           subtitle_id = EXCLUDED.subtitle_id,
           description_en = EXCLUDED.description_en,
           description_id = EXCLUDED.description_id,
           button_text_en = EXCLUDED.button_text_en,
           button_text_id = EXCLUDED.button_text_id,
           button_url = EXCLUDED.button_url,
           cta_text_en = EXCLUDED.cta_text_en,
           cta_text_id = EXCLUDED.cta_text_id,
           cta_link = EXCLUDED.cta_link`,
        [
          hs.id, hs.section_key, hs.badge_en, hs.badge_id, hs.tag_en, hs.tag_id,
          hs.title_en, hs.title_id, hs.subtitle_en, hs.subtitle_id, hs.description_en, hs.description_id,
          hs.button_text_en, hs.button_text_id, hs.button_url, hs.cta_text_en, hs.cta_text_id, hs.cta_link
        ]
      );
    }
    console.log(`  ✓ Seeded ${initialHomeSections.length} home sections`);
  }

  // 10. Industries
  if (initialIndustries.length > 0) {
    for (const ind of initialIndustries) {
      await client.query(
        `INSERT INTO industries (
           id, slug, icon, icon_name, name_en, name_id, title_en, title_id,
           subtitle_en, subtitle_id, description_en, description_id, image,
           tags_en, tags_id, target_category_slug, show_on_homepage, sort_order, is_active
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14::jsonb, $15::jsonb, $16, $17, $18, $19)
         ON CONFLICT (slug) DO UPDATE SET
           icon = EXCLUDED.icon,
           icon_name = EXCLUDED.icon_name,
           name_en = EXCLUDED.name_en,
           name_id = EXCLUDED.name_id,
           title_en = EXCLUDED.title_en,
           title_id = EXCLUDED.title_id,
           subtitle_en = EXCLUDED.subtitle_en,
           subtitle_id = EXCLUDED.subtitle_id,
           description_en = EXCLUDED.description_en,
           description_id = EXCLUDED.description_id,
           image = EXCLUDED.image,
           tags_en = EXCLUDED.tags_en,
           tags_id = EXCLUDED.tags_id,
           target_category_slug = EXCLUDED.target_category_slug,
           show_on_homepage = EXCLUDED.show_on_homepage,
           sort_order = EXCLUDED.sort_order,
           is_active = EXCLUDED.is_active`,
        [
          ind.id, ind.slug, ind.icon, ind.icon_name, ind.name_en, ind.name_id,
          ind.title_en, ind.title_id, ind.subtitle_en, ind.subtitle_id,
          ind.description_en, ind.description_id, ind.image,
          JSON.stringify(ind.tags_en || []), JSON.stringify(ind.tags_id || []),
          ind.target_category_slug, ind.show_on_homepage, ind.sort_order, ind.is_active
        ]
      );
    }
    console.log(`  ✓ Seeded ${initialIndustries.length} industries`);
  }

  // 11. About Us Content
  await client.query(
    `INSERT INTO about_content (
       key, hero_badge_en, hero_badge_id, hero_title_en, hero_title_id, hero_subtitle_en, hero_subtitle_id,
       who_we_are_tag_en, who_we_are_tag_id, who_we_are_heading_en, who_we_are_heading_id,
       who_we_are_p1_en, who_we_are_p1_id, who_we_are_p2_en, who_we_are_p2_id,
       who_we_are_points_en, who_we_are_points_id, who_we_are_images,
       why_choose_badge_en, why_choose_badge_id, why_choose_heading_en, why_choose_heading_id,
       why_choose_reasons
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7,
       $8, $9, $10, $11,
       $12, $13, $14, $15,
       $16::jsonb, $17::jsonb, $18::jsonb,
       $19, $20, $21, $22,
       $23::jsonb
     )
     ON CONFLICT (key) DO UPDATE SET
       hero_badge_en = EXCLUDED.hero_badge_en,
       hero_badge_id = EXCLUDED.hero_badge_id,
       hero_title_en = EXCLUDED.hero_title_en,
       hero_title_id = EXCLUDED.hero_title_id,
       hero_subtitle_en = EXCLUDED.hero_subtitle_en,
       hero_subtitle_id = EXCLUDED.hero_subtitle_id,
       who_we_are_tag_en = EXCLUDED.who_we_are_tag_en,
       who_we_are_tag_id = EXCLUDED.who_we_are_tag_id,
       who_we_are_heading_en = EXCLUDED.who_we_are_heading_en,
       who_we_are_heading_id = EXCLUDED.who_we_are_heading_id,
       who_we_are_p1_en = EXCLUDED.who_we_are_p1_en,
       who_we_are_p1_id = EXCLUDED.who_we_are_p1_id,
       who_we_are_p2_en = EXCLUDED.who_we_are_p2_en,
       who_we_are_p2_id = EXCLUDED.who_we_are_p2_id,
       who_we_are_points_en = EXCLUDED.who_we_are_points_en,
       who_we_are_points_id = EXCLUDED.who_we_are_points_id,
       who_we_are_images = EXCLUDED.who_we_are_images,
       why_choose_badge_en = EXCLUDED.why_choose_badge_en,
       why_choose_badge_id = EXCLUDED.why_choose_badge_id,
       why_choose_heading_en = EXCLUDED.why_choose_heading_en,
       why_choose_heading_id = EXCLUDED.why_choose_heading_id,
       why_choose_reasons = EXCLUDED.why_choose_reasons`,
    [
      initialAboutContent.key,
      initialAboutContent.hero_badge_en,
      initialAboutContent.hero_badge_id,
      initialAboutContent.hero_title_en,
      initialAboutContent.hero_title_id,
      initialAboutContent.hero_subtitle_en,
      initialAboutContent.hero_subtitle_id,
      initialAboutContent.who_we_are_tag_en,
      initialAboutContent.who_we_are_tag_id,
      initialAboutContent.who_we_are_heading_en,
      initialAboutContent.who_we_are_heading_id,
      initialAboutContent.who_we_are_p1_en,
      initialAboutContent.who_we_are_p1_id,
      initialAboutContent.who_we_are_p2_en,
      initialAboutContent.who_we_are_p2_id,
      JSON.stringify(initialAboutContent.who_we_are_points_en || []),
      JSON.stringify(initialAboutContent.who_we_are_points_id || []),
      JSON.stringify(initialAboutContent.who_we_are_images || []),
      initialAboutContent.why_choose_badge_en,
      initialAboutContent.why_choose_badge_id,
      initialAboutContent.why_choose_heading_en,
      initialAboutContent.why_choose_heading_id,
      JSON.stringify(initialAboutContent.why_choose_reasons || [])
    ]
  );
  console.log('  ✓ Verified about content');

  // Reset sequence IDs for serial columns to prevent collision on future inserts
  const tablesWithSerial = ['users', 'product_categories', 'products', 'partners', 'articles', 'careers', 'hero_slides', 'showcase_slides', 'home_sections', 'industries', 'inquiries', 'about_content'];
  for (const t of tablesWithSerial) {
    try {
      await client.query(`SELECT setval(pg_get_serial_sequence('${t}', 'id'), coalesce(max(id), 1)) FROM ${t}`);
    } catch {}
  }

  console.log('✅ [Seeder] Database verification completed!');
}

module.exports = {
  initialUsers,
  initialCategories,
  initialProducts,
  initialPartners,
  initialArticles,
  initialCareers,
  initialInquiries,
  initialHeroSlides,
  initialShowcaseSlides,
  initialHomeSections,
  initialIndustries,
  initialAboutContent,
  seedDatabase
};
