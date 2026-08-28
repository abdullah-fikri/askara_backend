const CareerApplication = require('../models/CareerApplication');
const Career = require('../models/Career');
const { uploadFileToStorage } = require('../utils/storage');

class CareerApplicationController {
  /**
   * Submit job application (Public)
   * Supports both multipart/form-data (with file) or JSON with pre-uploaded cv_url
   */
  static async submitApplication(req, res, next) {
    try {
      const {
        career_id,
        career_slug,
        full_name,
        email,
        phone,
        linkedin_url,
        portfolio_url,
        cover_letter,
        message,
      } = req.body;

      if (!full_name || !email || !phone) {
        return res.status(400).json({
          success: false,
          message: 'Full name, email address, and phone number are required.',
        });
      }

      let cv_url = req.body.cv_url;
      let cv_filename = req.body.cv_filename;

      // Handle direct file upload if present in multipart request
      if (req.file) {
        // Enforce 30MB limit
        if (req.file.size > 30 * 1024 * 1024) {
          return res.status(400).json({
            success: false,
            message: 'CV file size exceeds the maximum limit of 30MB.',
          });
        }

        const uploadResult = await uploadFileToStorage(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype || 'application/pdf',
          'cv'
        );

        cv_url = uploadResult.url;
        cv_filename = uploadResult.filename;
      }

      if (!cv_url) {
        return res.status(400).json({
          success: false,
          message: 'CV document is required. Please upload your CV / resume.',
        });
      }

      // Look up career title if available
      let career_title = req.body.career_title || null;
      let resolvedCareerId = career_id ? Number(career_id) : null;

      if (career_slug && !resolvedCareerId) {
        const found = await Career.findBySlug(career_slug);
        if (found) {
          resolvedCareerId = found.id;
          career_title = found.job_title_en || found.job_title_id;
        }
      } else if (resolvedCareerId && !career_title) {
        const found = await Career.findById(resolvedCareerId);
        if (found) {
          career_title = found.job_title_en || found.job_title_id;
        }
      }

      const application = await CareerApplication.create({
        career_id: resolvedCareerId,
        career_title: career_title || 'General Application',
        full_name,
        email,
        phone,
        linkedin_url: linkedin_url || null,
        portfolio_url: portfolio_url || null,
        cover_letter: cover_letter || message || null,
        cv_url,
        cv_filename: cv_filename || req.file?.originalname || 'Resume.pdf',
        status: 'submitted',
      });

      return res.status(201).json({
        success: true,
        message: 'Your application has been submitted successfully! We will review your profile soon.',
        data: application,
      });
    } catch (err) {
      console.error('[CareerApplication.submitApplication error]', err);
      next(err);
    }
  }

  /**
   * Get all applications (Admin)
   */
  static async getAll(req, res, next) {
    try {
      const { career_id, status } = req.query;
      const applications = await CareerApplication.findAll({ careerId: career_id, status });
      return res.json({ success: true, count: applications.length, data: applications });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get single application by ID (Admin)
   */
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const application = await CareerApplication.findById(id);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
      return res.json({ success: true, data: application });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update application status (Admin)
   */
  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
      }
      const updated = await CareerApplication.updateStatus(id, status);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
      return res.json({ success: true, message: 'Application status updated', data: updated });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Delete application and CV from Supabase Storage (Admin)
   */
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await CareerApplication.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
      return res.json({
        success: true,
        message: 'Application and associated CV document deleted successfully from Supabase Storage',
        data: deleted,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CareerApplicationController;
