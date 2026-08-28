const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const Article = require('../models/Article');
const Career = require('../models/Career');
const Partner = require('../models/Partner');
const Inquiry = require('../models/Inquiry');

class StatsController {
  static async getOverview(req, res, next) {
    try {
      const [products, categories, articles, careers, partners, inquiries] = await Promise.all([
        Product.findAll(),
        ProductCategory.findAll(),
        Article.findAll(),
        Career.findAll(),
        Partner.findAll(),
        Inquiry.findAll()
      ]);

      const activeProducts = products.filter(p => p.is_active).length;
      const featuredProducts = products.filter(p => p.is_featured).length;
      const activeCareers = careers.filter(c => c.is_active).length;
      const newInquiries = inquiries.filter(i => i.status === 'new').length;

      return res.json({
        success: true,
        data: {
          totalProducts: products.length,
          activeProducts,
          featuredProducts,
          totalCategories: categories.length,
          totalArticles: articles.length,
          totalPartners: partners.length,
          totalCareers: careers.length,
          activeCareers,
          totalInquiries: inquiries.length,
          newInquiries,
          recentInquiries: inquiries.slice(0, 5),
          recentProducts: products.slice(0, 5)
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = StatsController;
