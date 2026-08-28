const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Public
router.get('/', CategoryController.getAll);
router.get('/id/:id', CategoryController.getById);
router.get('/:slug', CategoryController.getBySlug);

// Admin Protected
router.put('/reorder', authenticateToken, CategoryController.reorder);
router.post('/', authenticateToken, CategoryController.create);
router.put('/:id', authenticateToken, CategoryController.update);
router.delete('/:id', authenticateToken, CategoryController.delete);

module.exports = router;
