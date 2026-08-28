const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const articleRoutes = require('./articleRoutes');
const partnerRoutes = require('./partnerRoutes');
const careerRoutes = require('./careerRoutes');
const inquiryRoutes = require('./inquiryRoutes');
const statsRoutes = require('./statsRoutes');
const uploadRoutes = require('./uploadRoutes');
const homepageRoutes = require('./homepageRoutes');
const industryRoutes = require('./industryRoutes');
const aboutRoutes = require('./aboutRoutes');

// Base health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PT Askara Tekno Pangan API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/articles', articleRoutes);
router.use('/partners', partnerRoutes);
router.use('/careers', careerRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/stats', statsRoutes);
router.use('/upload', uploadRoutes);
router.use('/homepage', homepageRoutes);
router.use('/industries', industryRoutes);
router.use('/about', aboutRoutes);

module.exports = router;

