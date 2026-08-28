const HeroSlide = require('../models/HeroSlide');
const ShowcaseSlide = require('../models/ShowcaseSlide');
const HomeSection = require('../models/HomeSection');

class HomepageController {
  // ==========================================
  // HERO SLIDES
  // ==========================================
  static async getHeroSlides(req, res, next) {
    try {
      const activeOnly = req.query.activeOnly === 'true' || req.query.activeOnly === '1';
      const slides = await HeroSlide.findAll({ activeOnly });
      return res.json({ success: true, count: slides.length, data: slides });
    } catch (err) {
      next(err);
    }
  }

  static async getHeroSlideById(req, res, next) {
    try {
      const { id } = req.params;
      const slide = await HeroSlide.findById(id);
      if (!slide) {
        return res.status(404).json({ success: false, message: 'Hero slide not found' });
      }
      return res.json({ success: true, data: slide });
    } catch (err) {
      next(err);
    }
  }

  static async createHeroSlide(req, res, next) {
    try {
      const {
        title_en,
        title_id,
        subtitle_en,
        subtitle_id,
        image,
        primary_btn_text_en,
        primary_btn_text_id,
        primary_btn_url,
        secondary_btn_text_en,
        secondary_btn_text_id,
        secondary_btn_url,
        sort_order,
        is_active
      } = req.body;

      if (!image) {
        return res.status(400).json({ success: false, message: 'Image is required for hero slide' });
      }

      const newSlide = await HeroSlide.create({
        title_en,
        title_id,
        subtitle_en,
        subtitle_id,
        image,
        primary_btn_text_en,
        primary_btn_text_id,
        primary_btn_url,
        secondary_btn_text_en,
        secondary_btn_text_id,
        secondary_btn_url,
        sort_order,
        is_active
      });

      return res.status(201).json({
        success: true,
        message: 'Hero slide created successfully',
        data: newSlide
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateHeroSlide(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await HeroSlide.update(id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Hero slide not found' });
      }
      return res.json({
        success: true,
        message: 'Hero slide updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteHeroSlide(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await HeroSlide.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Hero slide not found' });
      }
      return res.json({
        success: true,
        message: 'Hero slide deleted successfully',
        data: deleted
      });
    } catch (err) {
      next(err);
    }
  }

  static async reorderHeroSlides(req, res, next) {
    try {
      const { orderedIds } = req.body;
      if (!Array.isArray(orderedIds)) {
        return res.status(400).json({ success: false, message: 'orderedIds array is required' });
      }
      const updatedList = await HeroSlide.reorder(orderedIds);
      return res.json({ success: true, message: 'Hero slides reordered successfully', data: updatedList });
    } catch (err) {
      next(err);
    }
  }

  // ==========================================
  // SHOWCASE SLIDES & WHO WE ARE
  // ==========================================
  static async getShowcaseData(req, res, next) {
    try {
      const activeOnly = req.query.activeOnly === 'true' || req.query.activeOnly === '1';
      const [section, slides] = await Promise.all([
        HomeSection.getSection('who_we_are'),
        ShowcaseSlide.findAll({ activeOnly })
      ]);

      return res.json({
        success: true,
        data: {
          section: section || {
            section_key: 'who_we_are',
            tag_en: 'WHO WE ARE',
            tag_id: 'TENTANG KAMI',
            title_en: 'Dedicated to Advancing Food Quality & Lab Solutions',
            title_id: 'Berdedikasi Memajukan Kualitas Pangan & Solusi Laboratorium',
            description_en: 'PT Askara Tekno Pangan is an innovative provider of laboratory instruments, solutions, and services for food quality testing and research.',
            description_id: 'PT Askara Tekno Pangan adalah penyedia instrumen, solusi, dan layanan laboratorium inovatif untuk pengujian dan riset kualitas pangan.',
            button_text_en: 'Learn More',
            button_text_id: 'Pelajari Selengkapnya',
            button_url: '/about'
          },
          slides: slides || []
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateWhoWeAreSection(req, res, next) {
    try {
      const updatedSection = await HomeSection.updateSection('who_we_are', req.body);
      return res.json({
        success: true,
        message: 'Who We Are section updated successfully',
        data: updatedSection
      });
    } catch (err) {
      next(err);
    }
  }

  static async getShowcaseSlideById(req, res, next) {
    try {
      const { id } = req.params;
      const slide = await ShowcaseSlide.findById(id);
      if (!slide) {
        return res.status(404).json({ success: false, message: 'Showcase slide not found' });
      }
      return res.json({ success: true, data: slide });
    } catch (err) {
      next(err);
    }
  }


  static async createShowcaseSlide(req, res, next) {
    try {
      const {
        image,
        title_en,
        title_id,
        caption_en,
        caption_id,
        sort_order,
        is_active
      } = req.body;

      if (!image) {
        return res.status(400).json({ success: false, message: 'Image is required for showcase slide' });
      }

      const newSlide = await ShowcaseSlide.create({
        image,
        title_en,
        title_id,
        caption_en,
        caption_id,
        sort_order,
        is_active
      });

      return res.status(201).json({
        success: true,
        message: 'Showcase slide created successfully',
        data: newSlide
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateShowcaseSlide(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await ShowcaseSlide.update(id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Showcase slide not found' });
      }
      return res.json({
        success: true,
        message: 'Showcase slide updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteShowcaseSlide(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await ShowcaseSlide.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Showcase slide not found' });
      }
      return res.json({
        success: true,
        message: 'Showcase slide deleted successfully',
        data: deleted
      });
    } catch (err) {
      next(err);
    }
  }

  static async reorderShowcaseSlides(req, res, next) {
    try {
      const { orderedIds } = req.body;
      if (!Array.isArray(orderedIds)) {
        return res.status(400).json({ success: false, message: 'orderedIds array is required' });
      }
      const updatedList = await ShowcaseSlide.reorder(orderedIds);
      return res.json({ success: true, message: 'Showcase slides reordered successfully', data: updatedList });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = HomepageController;
