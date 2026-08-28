const Article = require('../models/Article');

class ArticleController {
  static async getAll(req, res, next) {
    try {
      const activeOnly = req.query.activeOnly === 'true' || req.query.activeOnly === '1';
      const limit = req.query.limit;
      const articles = await Article.findAll({ activeOnly, limit });
      return res.json({ success: true, count: articles.length, data: articles });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const article = await Article.findById(id);
      if (!article) {
        return res.status(404).json({ success: false, message: 'Article not found' });
      }
      return res.json({ success: true, data: article });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const { title_en, title_id, category_en, category_id, image, published_at, linkedin_url, is_active, sort_order } = req.body;
      if (!title_en) {
        return res.status(400).json({ success: false, message: 'title_en is required' });
      }

      const article = await Article.create({
        title_en,
        title_id,
        category_en,
        category_id,
        image,
        published_at,
        linkedin_url,
        is_active,
        sort_order
      });

      return res.status(201).json({ success: true, message: 'Article created successfully', data: article });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await Article.update(id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Article not found' });
      }
      return res.json({ success: true, message: 'Article updated successfully', data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await Article.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Article not found' });
      }
      return res.json({ success: true, message: 'Article deleted successfully', data: deleted });
    } catch (err) {
      next(err);
    }
  }

  static async reorder(req, res, next) {
    try {
      const { orderedIds } = req.body;
      if (!Array.isArray(orderedIds)) {
        return res.status(400).json({ success: false, message: 'orderedIds array is required' });
      }
      const updatedList = await Article.reorder(orderedIds);
      return res.json({ success: true, message: 'Articles reordered successfully', data: updatedList });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ArticleController;
