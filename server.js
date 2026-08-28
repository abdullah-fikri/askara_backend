const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const { errorHandler, notFoundHandler } = require('./middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

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

// Mount main API
app.use('/api', apiRoutes);

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
