const express = require('express');
const router = express.Router();
const HomepageController = require('../controllers/homepageController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// ==========================================
// PUBLIC ROUTES
// ==========================================
// Hero slides (public active)
router.get('/hero', HomepageController.getHeroSlides);

// Showcase & Who We Are data (public active)
router.get('/showcase', HomepageController.getShowcaseData);

// ==========================================
// PROTECTED ADMIN ROUTES
// ==========================================
// Hero slides admin
router.get('/hero/admin', authenticateToken, HomepageController.getHeroSlides);
router.put('/hero/reorder', authenticateToken, HomepageController.reorderHeroSlides);
router.get('/hero/:id', HomepageController.getHeroSlideById);
router.post('/hero', authenticateToken, HomepageController.createHeroSlide);
router.put('/hero/:id', authenticateToken, HomepageController.updateHeroSlide);
router.delete('/hero/:id', authenticateToken, HomepageController.deleteHeroSlide);

// Showcase & Section admin
router.get('/showcase/admin', authenticateToken, HomepageController.getShowcaseData);
router.put('/showcase/slides/reorder', authenticateToken, HomepageController.reorderShowcaseSlides);
router.get('/showcase/slides/:id', HomepageController.getShowcaseSlideById);
router.put('/showcase/section', authenticateToken, HomepageController.updateWhoWeAreSection);
router.post('/showcase/slides', authenticateToken, HomepageController.createShowcaseSlide);
router.put('/showcase/slides/:id', authenticateToken, HomepageController.updateShowcaseSlide);
router.delete('/showcase/slides/:id', authenticateToken, HomepageController.deleteShowcaseSlide);


module.exports = router;
