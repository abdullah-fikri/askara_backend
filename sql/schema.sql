-- ====================================================================
-- PT ASKARA TEKNO PANGAN - COMPLETE CONSOLIDATED DATABASE SCHEMA
-- Supabase / PostgreSQL Schema Definition
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 1. USERS TABLE (Admin & Staff Authentication)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 2. PRODUCT CATEGORIES TABLE (Bilingual: EN & ID)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.product_categories (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_id VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description_en TEXT,
    description_id TEXT,
    image VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 3. PRODUCTS TABLE (Bilingual: EN & ID)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    product_category_id INT REFERENCES public.product_categories(id) ON DELETE SET NULL,
    category_slug VARCHAR(100),
    name_en VARCHAR(255) NOT NULL,
    name_id VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    principal VARCHAR(255),
    short_description_en TEXT,
    short_description_id TEXT,
    description_en TEXT,
    description_id TEXT,
    image VARCHAR(500),
    specifications TEXT,
    applications_en TEXT,
    applications_id TEXT,
    features_en TEXT,
    features_id TEXT,
    brochure VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 4. ARTICLES TABLE (Bilingual: EN & ID)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.articles (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(500) NOT NULL,
    title_id VARCHAR(500) NOT NULL,
    category_en VARCHAR(100),
    category_id VARCHAR(100),
    image VARCHAR(500),
    published_at DATE DEFAULT CURRENT_DATE,
    linkedin_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 5. PARTNERS & PRINCIPALS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    logo VARCHAR(500),
    country VARCHAR(255),
    category VARCHAR(255),
    description_en TEXT,
    description_id TEXT,
    documentation_gallery JSONB DEFAULT '[]'::jsonb,
    website_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 6. CAREERS TABLE (Bilingual: EN & ID)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.careers (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE,
    job_title_en VARCHAR(255) NOT NULL,
    job_title_id VARCHAR(255) NOT NULL,
    department_en VARCHAR(255),
    department_id VARCHAR(255),
    location_en VARCHAR(255) DEFAULT 'Jakarta, Indonesia',
    location_id VARCHAR(255) DEFAULT 'Jakarta, Indonesia',
    employment_type_en VARCHAR(100) DEFAULT 'Full-time',
    employment_type_id VARCHAR(100) DEFAULT 'Penuh Waktu',
    experience_level_en VARCHAR(100),
    experience_level_id VARCHAR(100),
    salary_range VARCHAR(100),
    description_en TEXT,
    description_id TEXT,
    responsibilities_en TEXT,
    responsibilities_id TEXT,
    requirements_en TEXT,
    requirements_id TEXT,
    benefits_en TEXT,
    benefits_id TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 7. CAREER APPLICATIONS TABLE (Candidate Job Applications & CVs)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.career_applications (
    id SERIAL PRIMARY KEY,
    career_id INT REFERENCES public.careers(id) ON DELETE SET NULL,
    career_title VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    linkedin_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    cover_letter TEXT,
    cv_url VARCHAR(1000) NOT NULL,
    cv_filename VARCHAR(255),
    status VARCHAR(50) DEFAULT 'submitted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 7. INQUIRIES & RFQ TABLE (Contact submissions)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.inquiries (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES public.products(id) ON DELETE SET NULL,
    product_name VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 8. HERO SLIDES TABLE (Homepage Hero Carousel)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id SERIAL PRIMARY KEY,
    badge_en VARCHAR(255),
    badge_id VARCHAR(255),
    title_en VARCHAR(500) NOT NULL,
    title_id VARCHAR(500) NOT NULL,
    subtitle_en TEXT,
    subtitle_id TEXT,
    image VARCHAR(500),
    tag_en VARCHAR(255),
    tag_id VARCHAR(255),
    primary_btn_text_en VARCHAR(255) DEFAULT 'Explore Solutions',
    primary_btn_text_id VARCHAR(255) DEFAULT 'Jelajahi Solusi',
    primary_btn_url VARCHAR(255) DEFAULT '/products',
    secondary_btn_text_en VARCHAR(255) DEFAULT 'Contact Us',
    secondary_btn_text_id VARCHAR(255) DEFAULT 'Hubungi Kami',
    secondary_btn_url VARCHAR(255) DEFAULT '/contact',
    primary_cta_text_en VARCHAR(255),
    primary_cta_text_id VARCHAR(255),
    primary_cta_link VARCHAR(255),
    secondary_cta_text_en VARCHAR(255),
    secondary_cta_text_id VARCHAR(255),
    secondary_cta_link VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 9. SHOWCASE SLIDES TABLE (Homepage Showcase Tabs / Carousel)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.showcase_slides (
    id SERIAL PRIMARY KEY,
    tag_en VARCHAR(255),
    tag_id VARCHAR(255),
    title_en VARCHAR(255) NOT NULL,
    title_id VARCHAR(255) NOT NULL,
    caption_en VARCHAR(500),
    caption_id VARCHAR(500),
    desc_en TEXT,
    desc_id TEXT,
    image VARCHAR(500) NOT NULL,
    cta_text_en VARCHAR(255),
    cta_text_id VARCHAR(255),
    cta_link VARCHAR(255),
    features_en JSONB DEFAULT '[]'::jsonb,
    features_id JSONB DEFAULT '[]'::jsonb,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 10. HOMEPAGE SECTIONS TABLE (Section Titles, Badges, Texts)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.home_sections (
    id SERIAL PRIMARY KEY,
    section_key VARCHAR(100) UNIQUE NOT NULL,
    badge_en VARCHAR(255),
    badge_id VARCHAR(255),
    tag_en VARCHAR(255),
    tag_id VARCHAR(255),
    title_en VARCHAR(500),
    title_id VARCHAR(500),
    subtitle_en TEXT,
    subtitle_id TEXT,
    description_en TEXT,
    description_id TEXT,
    button_text_en VARCHAR(255),
    button_text_id VARCHAR(255),
    button_url VARCHAR(255),
    cta_text_en VARCHAR(255),
    cta_text_id VARCHAR(255),
    cta_link VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 11. INDUSTRIES TABLE (Industries We Serve)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.industries (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    icon VARCHAR(100) DEFAULT 'Factory',
    icon_name VARCHAR(100) DEFAULT 'Factory',
    name_en VARCHAR(255),
    name_id VARCHAR(255),
    title_en VARCHAR(255),
    title_id VARCHAR(255),
    subtitle_en VARCHAR(255),
    subtitle_id VARCHAR(255),
    description_en TEXT,
    description_id TEXT,
    image VARCHAR(500),
    tags_en JSONB DEFAULT '[]'::jsonb,
    tags_id JSONB DEFAULT '[]'::jsonb,
    target_category_slug VARCHAR(100) DEFAULT 'instrument',
    show_on_homepage BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 12. ABOUT US CONTENT TABLE (Company Information & Dynamic Content)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.about_content (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL DEFAULT 'main',
    hero_badge_en VARCHAR(255),
    hero_badge_id VARCHAR(255),
    hero_title_en VARCHAR(500),
    hero_title_id VARCHAR(500),
    hero_subtitle_en TEXT,
    hero_subtitle_id TEXT,
    who_we_are_tag_en VARCHAR(255),
    who_we_are_tag_id VARCHAR(255),
    who_we_are_heading_en VARCHAR(500),
    who_we_are_heading_id VARCHAR(500),
    who_we_are_p1_en TEXT,
    who_we_are_p1_id TEXT,
    who_we_are_p2_en TEXT,
    who_we_are_p2_id TEXT,
    who_we_are_points_en JSONB DEFAULT '[]'::jsonb,
    who_we_are_points_id JSONB DEFAULT '[]'::jsonb,
    who_we_are_images JSONB DEFAULT '[]'::jsonb,
    why_choose_badge_en VARCHAR(255),
    why_choose_badge_id VARCHAR(255),
    why_choose_heading_en VARCHAR(500),
    why_choose_heading_id VARCHAR(500),
    why_choose_reasons JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- SAFE COLUMN MIGRATIONS (Ensure columns exist on pre-existing tables)
-- ====================================================================
ALTER TABLE IF EXISTS public.home_sections ADD COLUMN IF NOT EXISTS section_key VARCHAR(100);
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS department_en VARCHAR(255);
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS department_id VARCHAR(255);
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS experience_level_en VARCHAR(100);
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS experience_level_id VARCHAR(100);
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS responsibilities_en TEXT;
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS responsibilities_id TEXT;
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS requirements_en TEXT;
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS requirements_id TEXT;
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS benefits_en TEXT;
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS benefits_id TEXT;
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS salary_range VARCHAR(100);
ALTER TABLE IF EXISTS public.partners ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE IF EXISTS public.partners ADD COLUMN IF NOT EXISTS documentation_gallery JSONB DEFAULT '[]'::jsonb;
ALTER TABLE IF EXISTS public.industries ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE IF EXISTS public.industries ADD COLUMN IF NOT EXISTS icon VARCHAR(100) DEFAULT 'Factory';
ALTER TABLE IF EXISTS public.industries ADD COLUMN IF NOT EXISTS icon_name VARCHAR(100) DEFAULT 'Factory';
ALTER TABLE IF EXISTS public.industries ADD COLUMN IF NOT EXISTS tags_en JSONB DEFAULT '[]'::jsonb;
ALTER TABLE IF EXISTS public.industries ADD COLUMN IF NOT EXISTS tags_id JSONB DEFAULT '[]'::jsonb;
ALTER TABLE IF EXISTS public.industries ADD COLUMN IF NOT EXISTS show_on_homepage BOOLEAN DEFAULT TRUE;
ALTER TABLE IF EXISTS public.products ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE IF EXISTS public.products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS public.product_categories ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- ====================================================================
-- HIGH PERFORMANCE INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(product_category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active_featured ON public.products(is_active, is_featured);
CREATE INDEX IF NOT EXISTS idx_articles_active ON public.articles(is_active, published_at);
CREATE INDEX IF NOT EXISTS idx_partners_slug ON public.partners(slug);
CREATE INDEX IF NOT EXISTS idx_partners_active ON public.partners(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_careers_slug ON public.careers(slug);
CREATE INDEX IF NOT EXISTS idx_careers_active ON public.careers(is_active);
CREATE INDEX IF NOT EXISTS idx_career_applications_career ON public.career_applications(career_id);
CREATE INDEX IF NOT EXISTS idx_career_applications_email ON public.career_applications(email);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON public.hero_slides(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_showcase_slides_active ON public.showcase_slides(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_home_sections_key ON public.home_sections(section_key);
CREATE INDEX IF NOT EXISTS idx_industries_slug ON public.industries(slug);
CREATE INDEX IF NOT EXISTS idx_industries_homepage ON public.industries(show_on_homepage, is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_about_content_key ON public.about_content(key);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) & PUBLIC READ POLICIES (SUPABASE)
-- ====================================================================
ALTER TABLE IF EXISTS public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.showcase_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.home_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.about_content ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Public read policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_categories' AND policyname = 'Public read product_categories') THEN
        CREATE POLICY "Public read product_categories" ON public.product_categories FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Public read products') THEN
        CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Public read articles') THEN
        CREATE POLICY "Public read articles" ON public.articles FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'partners' AND policyname = 'Public read partners') THEN
        CREATE POLICY "Public read partners" ON public.partners FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'careers' AND policyname = 'Public read careers') THEN
        CREATE POLICY "Public read careers" ON public.careers FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'hero_slides' AND policyname = 'Public read hero_slides') THEN
        CREATE POLICY "Public read hero_slides" ON public.hero_slides FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'showcase_slides' AND policyname = 'Public read showcase_slides') THEN
        CREATE POLICY "Public read showcase_slides" ON public.showcase_slides FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'home_sections' AND policyname = 'Public read home_sections') THEN
        CREATE POLICY "Public read home_sections" ON public.home_sections FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'industries' AND policyname = 'Public read industries') THEN
        CREATE POLICY "Public read industries" ON public.industries FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'about_content' AND policyname = 'Public read about_content') THEN
        CREATE POLICY "Public read about_content" ON public.about_content FOR SELECT USING (true);
    END IF;
    -- Public insert policy for inquiries (contact form / RFQ)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'inquiries' AND policyname = 'Public insert inquiries') THEN
        CREATE POLICY "Public insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
    END IF;
    -- Public insert policy for career applications
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'career_applications' AND policyname = 'Public insert career_applications') THEN
        CREATE POLICY "Public insert career_applications" ON public.career_applications FOR INSERT WITH CHECK (true);
    END IF;
END $$;
