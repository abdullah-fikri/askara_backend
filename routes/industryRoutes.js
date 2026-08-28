const express = require('express');
const router = express.Router();
const industryController = require('../controllers/industryController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Public endpoints
router.get('/', industryController.getAllIndustries);
router.get('/homepage', industryController.getHomepageIndustries);
router.get('/:id', industryController.getIndustryById);

// Admin / protected endpoints
router.put('/reorder', authenticateToken, industryController.reorderIndustries);
router.post('/', authenticateToken, industryController.createIndustry);
router.put('/:id', authenticateToken, industryController.updateIndustry);
router.delete('/:id', authenticateToken, industryController.deleteIndustry);

module.exports = router;
