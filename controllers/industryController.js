const Industry = require('../models/Industry');

// GET /api/industries
exports.getAllIndustries = async (req, res, next) => {
  try {
    const activeOnly = req.query.activeOnly === 'true';
    const homepageOnly = req.query.homepageOnly === 'true';
    const industries = await Industry.findAll({ activeOnly, homepageOnly });
    res.json(industries);
  } catch (err) {
    next(err);
  }
};

// GET /api/industries/homepage
exports.getHomepageIndustries = async (req, res, next) => {
  try {
    const industries = await Industry.findAll({ activeOnly: true, homepageOnly: true });
    res.json(industries);
  } catch (err) {
    next(err);
  }
};

// GET /api/industries/:id
exports.getIndustryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let industry;
    if (isNaN(Number(id))) {
      industry = await Industry.findBySlug(id);
    } else {
      industry = await Industry.findById(id);
    }

    if (!industry) {
      return res.status(404).json({ message: 'Industry not found' });
    }
    res.json(industry);
  } catch (err) {
    next(err);
  }
};

// POST /api/industries
exports.createIndustry = async (req, res, next) => {
  try {
    const { title_en, title_id, description_en, description_id } = req.body;
    if (!title_en && !title_id) {
      return res.status(400).json({ message: 'Industry title is required' });
    }

    const industry = await Industry.create(req.body);
    res.status(201).json(industry);
  } catch (err) {
    next(err);
  }
};

// PUT /api/industries/:id
exports.updateIndustry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Industry.update(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Industry not found to update' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/industries/:id
exports.deleteIndustry = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Industry.delete(id);
    res.json({ message: 'Industry deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// PUT /api/industries/reorder
exports.reorderIndustries = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'orderedIds array is required' });
    }
    const updatedList = await Industry.reorder(orderedIds);
    res.json(updatedList);
  } catch (err) {
    next(err);
  }
};
