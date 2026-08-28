const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/articleController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Public
router.get('/', ArticleController.getAll);
router.get('/:id', ArticleController.getById);

// Admin Protected
router.put('/reorder', authenticateToken, ArticleController.reorder);
router.post('/', authenticateToken, ArticleController.create);
router.put('/:id', authenticateToken, ArticleController.update);
router.delete('/:id', authenticateToken, ArticleController.delete);

module.exports = router;
