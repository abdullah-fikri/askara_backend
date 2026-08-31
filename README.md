# PT Askara Tekno Pangan — Backend API Documentation

Production-grade **Express.js MVC Backend** for **PT Askara Tekno Pangan** powered by **Supabase (PostgreSQL)** and Node.js.

---

## 🌟 Key Architecture Highlights

- **Structured MVC Pattern**: Clear separation of concerns between Models, Controllers, Routes, Middlewares, and Utilities.
- **Resilient Dual-Mode Database Layer**:
  - **Supabase / PostgreSQL Mode**: High-performance relational database with DDL schemas, foreign keys, and indexes.
  - **In-Memory / Seed Fallback Mode**: Gracefully boots with built-in initial seed data when database credentials are not configured, ideal for offline development and testing.
- **Bulletproof CORS & Preflight**: Handles dynamic origins, credentials, custom headers, and immediate `OPTIONS` responses.
- **Enterprise Security**: Password hashing via `bcryptjs`, stateless authentication via `jsonwebtoken` (JWT Bearer tokens), and role-protected administrative endpoints.
- **Auto-Migration & Database Setup Scripts**: Automated schema synchronization on server startup, plus standalone CLI commands for migration and seeding.

---

## 📁 Directory Structure

```text
backend/
├── config/
│   └── supabase.js             # Supabase client initializer and connection fallback checker
│
├── controllers/                # Request handling & business logic
│   ├── authController.js       # Admin authentication & credentials management
│   ├── productController.js    # Products CRUD, spec parsing & category relations
│   ├── categoryController.js   # Product category hierarchy & reordering
│   ├── articleController.js    # Knowledge articles & LinkedIn publications
│   ├── partnerController.js    # Technology principals & photo gallery management
│   ├── careerController.js     # Vacancy listings & applicant submissions
│   ├── industryController.js   # Industry sectors & product category linkages
│   ├── homepageController.js   # Hero sliders, showcase slides & Who We Are section
│   ├── aboutController.js      # About Us hero, sliders, points & reasons
│   ├── inquiryController.js    # B2B inquiry tracking & WhatsApp quick-action
│   ├── statsController.js      # System analytics & overview metrics
│   └── uploadController.js     # Multipart file upload handler (Images, PDFs, CVs)
│
├── models/                     # Data access layer & in-memory fallback models
│   ├── User.js                 # Admin user account model
│   ├── Product.js              # Product entity model
│   ├── ProductCategory.js      # Product category entity model
│   ├── Article.js              # Article entity model
│   ├── Partner.js              # Principal entity model with documentation gallery
│   ├── Career.js               # Career listing model
│   ├── CareerApplication.js    # Candidate job application model
│   ├── Industry.js             # Industry sector model
│   ├── HeroSlide.js            # Homepage hero banner slide model
│   ├── ShowcaseSlide.js        # Homepage showcase slide model
│   ├── HomeSection.js          # Homepage Who We Are section model
│   ├── AboutContent.js         # About Us page content model
│   ├── Inquiry.js              # Contact message model
│   └── initialData.js          # Centralized seed dataset
│
├── routes/                     # REST API Route Declarations
│   ├── api.js                  # Master API aggregator (`/api/*`)
│   ├── authRoutes.js           # `/api/auth`
│   ├── productRoutes.js        # `/api/products`
│   ├── categoryRoutes.js       # `/api/categories`
│   ├── articleRoutes.js        # `/api/articles`
│   ├── partnerRoutes.js        # `/api/partners`
│   ├── careerRoutes.js         # `/api/careers`
│   ├── industryRoutes.js       # `/api/industries`
│   ├── homepageRoutes.js       # `/api/homepage`
│   ├── aboutRoutes.js          # `/api/about`
│   ├── inquiryRoutes.js        # `/api/inquiries`
│   ├── statsRoutes.js          # `/api/stats`
│   └── uploadRoutes.js         # `/api/upload`
│
├── middlewares/
│   ├── authMiddleware.js       # JWT Bearer token authentication & authorization
│   └── errorMiddleware.js      # Centralized error handler and 404 middleware
│
├── scripts/
│   ├── migrate.js              # Creates/updates PostgreSQL schema tables
│   ├── seed.js                 # Seeds PostgreSQL with full Askara dataset
│   └── setupDb.js              # Complete automated database provisioner (migrate + seed)
│
├── sql/
│   └── schema.sql              # Consolidated PostgreSQL DDL schema & indexes
│
├── public/
│   └── uploads/                # Local static file upload storage
│
├── utils/
│   ├── autoMigrate.js          # Automated database schema verification on boot
│   └── keepAliveScheduler.js   # Supabase pooler keep-alive cron job
│
├── server.js                   # Express application entry point
├── package.json                # Dependencies & scripts
└── vercel.json                 # Vercel serverless function deployment config
```

---

## 🛠️ Getting Started (Local Development)

### 1. Environment Configuration
Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase Credentials (Optional for local development, required for production Supabase DB)
SUPABASE_URL=https://your-supabase-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_ANON_KEY=your-supabase-anon-key

# JWT Secret for Admin Authentication
JWT_SECRET=askara-super-secret-jwt-key-2026-pt-askara-tekno-pangan
```

### 2. Install & Start Server
```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Or start in standard production mode
npm start
```

---

## 🗄️ Database Setup & CLI Scripts

### Setup Supabase / PostgreSQL:
1. In your Supabase project dashboard, open the **SQL Editor**.
2. Run the script found in `backend/sql/schema.sql`.
3. Alternatively, use the automated Node.js CLI tools:

```bash
# Run schema migrations only
npm run migrate

# Populate database with Askara initial seed data
npm run seed

# Run full setup (Migrate + Seed in one command)
npm run setup-db
```

---

## 📡 REST API Reference

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Login admin and receive JWT token | No |
| `GET` | `/api/auth/me` | Verify active session & retrieve user data | Yes (JWT) |
| `PUT` | `/api/auth/password` | Update admin password | Yes (JWT) |

### 2. Products (`/api/products`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Get all active products (supports `?category=`, `?featured=true`, `?search=`) | No |
| `GET` | `/api/products/featured` | Get featured products for homepage | No |
| `GET` | `/api/products/:idOrSlug` | Get product by ID or unique slug | No |
| `POST` | `/api/products` | Create new product | Yes (JWT) |
| `PUT` | `/api/products/:id` | Update product details | Yes (JWT) |
| `DELETE` | `/api/products/:id` | Delete product | Yes (JWT) |
| `PATCH` | `/api/products/:id/toggle` | Toggle active / featured status | Yes (JWT) |

### 3. Product Categories (`/api/categories`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Get all categories with product counts | No |
| `GET` | `/api/categories/:idOrSlug` | Get single category with its products | No |
| `POST` | `/api/categories` | Create new category | Yes (JWT) |
| `PUT` | `/api/categories/:id` | Update category details | Yes (JWT) |
| `DELETE` | `/api/categories/:id` | Delete category | Yes (JWT) |

### 4. Homepage CMS (`/api/homepage`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/homepage/hero` | Get all active hero slides | No |
| `POST` | `/api/homepage/hero` | Create hero slide | Yes (JWT) |
| `PUT` | `/api/homepage/hero/:id` | Update hero slide | Yes (JWT) |
| `DELETE` | `/api/homepage/hero/:id` | Delete hero slide | Yes (JWT) |
| `GET` | `/api/homepage/showcase` | Get showcase section and slides | No |
| `POST` | `/api/homepage/showcase` | Create showcase slide | Yes (JWT) |
| `PUT` | `/api/homepage/showcase/:id`| Update showcase slide | Yes (JWT) |
| `DELETE` | `/api/homepage/showcase/:id`| Delete showcase slide | Yes (JWT) |
| `PUT` | `/api/homepage/section/who_we_are` | Update Who We Are text and CTA | Yes (JWT) |

### 5. About Us CMS (`/api/about`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/about` | Get full About Us page configuration | No |
| `PUT` | `/api/about` | Update About Us page content & reasons | Yes (JWT) |

### 6. Industries (`/api/industries`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/industries` | Get all industries | No |
| `GET` | `/api/industries/homepage`| Get featured industries for homepage | No |
| `GET` | `/api/industries/:idOrSlug` | Get single industry | No |
| `POST` | `/api/industries` | Create industry sector | Yes (JWT) |
| `PUT` | `/api/industries/:id` | Update industry sector | Yes (JWT) |
| `DELETE` | `/api/industries/:id` | Delete industry sector | Yes (JWT) |

### 7. Principals & Partners (`/api/partners`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/partners` | Get all active partners | No |
| `GET` | `/api/partners/:idOrSlug` | Get single partner details & gallery | No |
| `POST` | `/api/partners` | Create partner | Yes (JWT) |
| `PUT` | `/api/partners/:id` | Update partner & documentation gallery | Yes (JWT) |
| `DELETE` | `/api/partners/:id` | Delete partner | Yes (JWT) |

### 8. Careers & Applications (`/api/careers`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/careers` | Get active job vacancies | No |
| `GET` | `/api/careers/:idOrSlug` | Get job vacancy details | No |
| `POST` | `/api/careers` | Create job vacancy | Yes (JWT) |
| `PUT` | `/api/careers/:id` | Update job vacancy | Yes (JWT) |
| `DELETE` | `/api/careers/:id` | Delete job vacancy | Yes (JWT) |
| `POST` | `/api/careers/apply` | Submit job application with CV | No |
| `GET` | `/api/careers/applications/all` | List candidate submissions | Yes (JWT) |

### 9. File Upload (`/api/upload`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | Upload image or document (`multipart/form-data`) | Yes (JWT) |

---

## 🔒 Security Best Practices

1. **Authorization**: Include the JWT Bearer token in the request header:
   ```http
   Authorization: Bearer <your_jwt_token>
   ```
2. **Payload Validation**: Input limits and sanitization are enforced across all write operations.
3. **Environment Security**: Keep `JWT_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` confidential in production environments.
