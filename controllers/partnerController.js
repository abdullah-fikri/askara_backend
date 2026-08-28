const Partner = require('../models/Partner');

class PartnerController {
  static async getAll(req, res, next) {
    try {
      const activeOnly = req.query.activeOnly === 'true' || req.query.activeOnly === '1';
      const partners = await Partner.findAll({ activeOnly });
      return res.json({ success: true, count: partners.length, data: partners });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      let partner = null;
      if (isNaN(Number(id))) {
        partner = await Partner.findBySlug(id);
      } else {
        partner = await Partner.findById(id);
        if (!partner) {
          partner = await Partner.findBySlug(id);
        }
      }

      if (!partner) {
        return res.status(404).json({ success: false, message: 'Partner / Principal not found' });
      }
      return res.json({ success: true, data: partner });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, message: 'Partner name is required' });
      }

      const partner = await Partner.create(req.body);
      return res.status(201).json({ success: true, message: 'Partner created successfully', data: partner });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await Partner.update(id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Partner not found' });
      }
      return res.json({ success: true, message: 'Partner updated successfully', data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await Partner.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Partner not found' });
      }
      return res.json({ success: true, message: 'Partner deleted successfully', data: deleted });
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
      const updatedList = await Partner.reorder(orderedIds);
      return res.json({ success: true, message: 'Partners reordered successfully', data: updatedList });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PartnerController;
