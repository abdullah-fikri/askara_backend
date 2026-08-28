const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');

class ProductController {
  static async getAll(req, res, next) {
    try {
      const { category, featured, activeOnly, search } = req.query;
      const products = await Product.findAll({
        categorySlug: category,
        featuredOnly: featured === 'true' || featured === '1',
        activeOnly: activeOnly === 'true' || activeOnly === '1',
        search: search || ''
      });

      return res.json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (err) {
      next(err);
    }
  }

  static async getFeatured(req, res, next) {
    try {
      const products = await Product.findAll({
        featuredOnly: true,
        activeOnly: true
      });
      return res.json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (err) {
      next(err);
    }
  }

  static async getBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const { categorySlug } = req.query;
      const product = await Product.findBySlug(slug, categorySlug);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const {
        product_category_id,
        name_en,
        name_id,
        slug,
        principal,
        short_description_en,
        short_description_id,
        description_en,
        description_id,
        image,
        specifications,
        applications_en,
        applications_id,
        features_en,
        features_id,
        brochure,
        is_active,
        is_featured,
        sort_order
      } = req.body;

      if (!name_en) {
        return res.status(400).json({ success: false, message: 'name_en is required' });
      }

      // If category_slug not supplied, lookup from category_id
      let category_slug = req.body.category_slug;
      if (!category_slug && product_category_id) {
        const cat = await ProductCategory.findById(product_category_id);
        if (cat) category_slug = cat.slug;
      }

      const product = await Product.create({
        product_category_id,
        category_slug,
        name_en,
        name_id,
        slug,
        principal,
        short_description_en,
        short_description_id,
        description_en,
        description_id,
        image,
        specifications,
        applications_en,
        applications_id,
        features_en,
        features_id,
        brochure,
        is_active,
        is_featured,
        sort_order
      });

      return res.status(201).json({ success: true, message: 'Product created successfully', data: product });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const payload = { ...req.body };

      if (payload.product_category_id && !payload.category_slug) {
        const cat = await ProductCategory.findById(payload.product_category_id);
        if (cat) payload.category_slug = cat.slug;
      }

      const updated = await Product.update(id, payload);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, message: 'Product updated successfully', data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await Product.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, message: 'Product deleted successfully', data: deleted });
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
      const updatedList = await Product.reorder(orderedIds);
      return res.json({ success: true, message: 'Products reordered successfully', data: updatedList });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProductController;
