const express = require('express');
const router = express.Router();
const InquiryController = require('../controllers/inquiryController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Public
router.post('/', InquiryController.create);

// Admin Protected
router.get('/', authenticateToken, InquiryController.getAll);
router.get('/:id', authenticateToken, InquiryController.getById);
router.patch('/:id/status', authenticateToken, InquiryController.updateStatus);
router.delete('/:id', authenticateToken, InquiryController.delete);

module.exports = router;
