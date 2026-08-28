const AboutContent = require('../models/AboutContent');

class AboutController {
  static async getAboutContent(req, res, next) {
    try {
      const content = await AboutContent.get('main');
      return res.json({
        success: true,
        data: content
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateAboutContent(req, res, next) {
    try {
      const updated = await AboutContent.update(req.body, 'main');
      return res.json({
        success: true,
        message: 'About page content updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AboutController;
