const express = require('express');
const router = express.Router();
const multer = require('multer');
const CareerController = require('../controllers/careerController');
const CareerApplicationController = require('../controllers/careerApplicationController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Multer in-memory storage for 30MB CV uploads
const uploadCV = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB Max CV size
  fileFilter: (req, file, cb) => {
    const allowedMime = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/octet-stream',
    ];
    const allowedExts = ['.pdf', '.doc', '.docx'];
    const ext = (file.originalname.substring(file.originalname.lastIndexOf('.')) || '').toLowerCase();

    if (allowedMime.includes(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, or DOCX documents up to 30MB are allowed!'), false);
    }
  },
});

// ==========================================
// Public Job Listings & Application Routes
// ==========================================
router.get('/', CareerController.getAll);
router.get('/:slug', CareerController.getBySlug);

// Job Application submission (Supports direct file upload in form field 'cv' or pre-uploaded URL)
router.post('/apply', uploadCV.single('cv'), CareerApplicationController.submitApplication);
router.post('/:slug/apply', uploadCV.single('cv'), CareerApplicationController.submitApplication);

// ==========================================
// Admin Career Positions Management
// ==========================================
router.post('/', authenticateToken, CareerController.create);
router.get('/admin/:id', authenticateToken, CareerController.getById);
router.put('/:id', authenticateToken, CareerController.update);
router.delete('/:id', authenticateToken, CareerController.delete);

// ==========================================
// Admin Candidate Applications Management
// ==========================================
router.get('/admin/applications/all', authenticateToken, CareerApplicationController.getAll);
router.get('/admin/applications/:id', authenticateToken, CareerApplicationController.getById);
router.put('/admin/applications/:id/status', authenticateToken, CareerApplicationController.updateStatus);
router.delete('/admin/applications/:id', authenticateToken, CareerApplicationController.delete);

module.exports = router;
