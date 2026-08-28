const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/statsController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/overview', authenticateToken, StatsController.getOverview);

module.exports = router;
