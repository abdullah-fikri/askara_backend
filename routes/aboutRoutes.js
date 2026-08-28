const express = require('express');
const router = express.Router();
const AboutController = require('../controllers/aboutController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Public route to get About Us content
router.get('/', AboutController.getAboutContent);

// Protected admin route to update About Us content
router.put('/', authenticateToken, AboutController.updateAboutContent);

module.exports = router;
