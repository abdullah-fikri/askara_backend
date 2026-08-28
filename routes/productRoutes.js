const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Public
router.get('/', ProductController.getAll);
router.get('/featured', ProductController.getFeatured);
router.get('/id/:id', ProductController.getById);
router.get('/:slug', ProductController.getBySlug);

// Admin Protected
router.put('/reorder', authenticateToken, ProductController.reorder);
router.post('/', authenticateToken, ProductController.create);
router.put('/:id', authenticateToken, ProductController.update);
router.delete('/:id', authenticateToken, ProductController.delete);

module.exports = router;
