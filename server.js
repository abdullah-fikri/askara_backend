const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const { errorHandler, notFoundHandler } = require('./middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend (reflects origin dynamically for localhost, vercel, and custom domains)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    name: 'PT Askara Tekno Pangan API',
    version: '1.0.0',
    description: 'Express.js MVC API with Supabase / PostgreSQL',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/login',
      categories: '/api/categories',
      products: '/api/products',
      articles: '/api/articles',
      partners: '/api/partners',
      careers: '/api/careers',
      inquiries: '/api/inquiries',
      stats: '/api/stats/overview'
    }
  });
});

// Mount main API (both /api and direct / paths)
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Start server if not running in serverless / test mode
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  const { autoMigrate } = require('./utils/autoMigrate');
  app.listen(PORT, async () => {
    console.log(`🚀 Askara Express MVC Backend running on port ${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
    await autoMigrate().catch((err) => {
      console.warn('[Auto-Migrate] Warning:', err.message);
    });
  });
}

module.exports = app;
