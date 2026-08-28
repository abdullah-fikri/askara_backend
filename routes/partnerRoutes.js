const express = require('express');
const router = express.Router();
const PartnerController = require('../controllers/partnerController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Public
router.get('/', PartnerController.getAll);
router.get('/:id', PartnerController.getById);

// Admin Protected
router.put('/reorder', authenticateToken, PartnerController.reorder);
router.post('/', authenticateToken, PartnerController.create);
router.put('/:id', authenticateToken, PartnerController.update);
router.delete('/:id', authenticateToken, PartnerController.delete);

module.exports = router;
