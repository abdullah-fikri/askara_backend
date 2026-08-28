const Inquiry = require('../models/Inquiry');
const Product = require('../models/Product');

class InquiryController {
  static async getAll(req, res, next) {
    try {
      const { status } = req.query;
      const inquiries = await Inquiry.findAll({ status });
      return res.json({ success: true, count: inquiries.length, data: inquiries });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const inquiry = await Inquiry.findById(id);
      if (!inquiry) {
        return res.status(404).json({ success: false, message: 'Inquiry not found' });
      }
      return res.json({ success: true, data: inquiry });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const { product_id, name, company, email, phone, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and message are required.'
        });
      }

      let product_name = req.body.product_name;
      if (!product_name && product_id) {
        const prod = await Product.findById(product_id);
        if (prod) product_name = prod.name_en;
      }

      const inquiry = await Inquiry.create({
        product_id,
        product_name,
        name,
        company,
        email,
        phone,
        message
      });

      return res.status(201).json({
        success: true,
        message: 'Thank you! Your inquiry has been submitted successfully.',
        data: inquiry
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ success: false, message: 'status is required' });
      }

      const updated = await Inquiry.updateStatus(id, status);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Inquiry not found' });
      }

      return res.json({ success: true, message: 'Inquiry status updated', data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await Inquiry.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Inquiry not found' });
      }
      return res.json({ success: true, message: 'Inquiry deleted', data: deleted });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = InquiryController;
