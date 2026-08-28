const ProductCategory = require('../models/ProductCategory');
const Product = require('../models/Product');

class CategoryController {
  static async getAll(req, res, next) {
    try {
      const activeOnly = req.query.activeOnly === 'true' || req.query.activeOnly === '1';
      const categories = await ProductCategory.findAll({ activeOnly });
      return res.json({ success: true, count: categories.length, data: categories });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await ProductCategory.findById(id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      return res.json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  }

  static async getBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const category = await ProductCategory.findBySlug(slug);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      const products = await Product.findAll({
        categorySlug: category.slug,
        activeOnly: req.query.includeInactive !== 'true'
      });

      return res.json({
        success: true,
        data: {
          ...category,
          products
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const { name_en, name_id, slug, description_en, description_id, image, is_active, sort_order } = req.body;
      if (!name_en) {
        return res.status(400).json({ success: false, message: 'name_en is required' });
      }

      const category = await ProductCategory.create({
        name_en,
        name_id,
        slug,
        description_en,
        description_id,
        image,
        is_active,
        sort_order
      });

      return res.status(201).json({ success: true, message: 'Category created successfully', data: category });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await ProductCategory.update(id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      return res.json({ success: true, message: 'Category updated successfully', data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await ProductCategory.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      return res.json({ success: true, message: 'Category deleted successfully', data: deleted });
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
      const updatedList = await ProductCategory.reorder(orderedIds);
      return res.json({ success: true, message: 'Categories reordered successfully', data: updatedList });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CategoryController;
