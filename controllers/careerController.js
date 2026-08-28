const Career = require('../models/Career');

class CareerController {
  static async getAll(req, res, next) {
    try {
      const activeOnly = req.query.activeOnly === 'true' || req.query.activeOnly === '1';
      const careers = await Career.findAll({ activeOnly });
      return res.json({ success: true, count: careers.length, data: careers });
    } catch (err) {
      next(err);
    }
  }

  static async getBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const career = await Career.findBySlug(slug);
      if (!career) {
        return res.status(404).json({ success: false, message: 'Career position not found' });
      }
      return res.json({ success: true, data: career });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const career = await Career.findById(id);
      if (!career) {
        return res.status(404).json({ success: false, message: 'Career position not found' });
      }
      return res.json({ success: true, data: career });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const { job_title_en } = req.body;
      if (!job_title_en) {
        return res.status(400).json({ success: false, message: 'job_title_en is required' });
      }

      const career = await Career.create(req.body);

      return res.status(201).json({ success: true, message: 'Career position created successfully', data: career });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await Career.update(id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Career not found' });
      }
      return res.json({ success: true, message: 'Career updated successfully', data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await Career.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Career not found' });
      }
      return res.json({ success: true, message: 'Career deleted successfully', data: deleted });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CareerController;
