const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFileToStorage, deleteFileFromStorage } = require('../utils/storage');

// Memory storage keeps the buffer in memory before piping directly to Supabase Storage
const storage = multer.memoryStorage();

// Multer instance for images (Assets folder) - Max 15MB
const uploadImage = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Multer instance for CVs and documents - Max 30MB (as requested)
const uploadDoc = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB
  fileFilter: (req, file, cb) => {
    const allowedMime = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/octet-stream',
    ];
    const allowedExts = ['.pdf', '.doc', '.docx'];
    const ext = (file.originalname.substring(file.originalname.lastIndexOf('.')) || '').toLowerCase();

    if (allowedMime.includes(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, or DOCX documents up to 30MB are allowed!'), false);
    }
  },
});

// Single image upload route -> saves to 'assets' folder in Supabase
router.post('/image', uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const result = await uploadFileToStorage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'assets'
    );

    return res.json({
      success: true,
      message: 'Image uploaded successfully to Supabase Storage (assets)',
      url: result.url,
      path: result.path,
      filename: result.filename,
    });
  } catch (err) {
    console.error('[Upload/image error]', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to upload image' });
  }
});

// Multiple images upload route -> saves to 'assets' folder in Supabase
router.post('/images', uploadImage.array('images', 30), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files uploaded' });
    }

    const uploadPromises = req.files.map((file) =>
      uploadFileToStorage(file.buffer, file.originalname, file.mimetype, 'assets')
    );

    const results = await Promise.all(uploadPromises);

    return res.json({
      success: true,
      message: `${results.length} images uploaded successfully to Supabase Storage (assets)`,
      files: results,
      urls: results.map((r) => r.url),
    });
  } catch (err) {
    console.error('[Upload/images error]', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to upload images' });
  }
});

// Alias for multiple files upload
router.post('/multiple', uploadImage.array('files', 30), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files uploaded' });
    }

    const uploadPromises = req.files.map((file) =>
      uploadFileToStorage(file.buffer, file.originalname, file.mimetype, 'assets')
    );

    const results = await Promise.all(uploadPromises);

    return res.json({
      success: true,
      message: `${results.length} images uploaded successfully to Supabase Storage (assets)`,
      files: results,
      urls: results.map((r) => r.url),
    });
  } catch (err) {
    console.error('[Upload/multiple error]', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to upload files' });
  }
});

// Single CV / Resume Document Upload route -> saves to 'cv' folder in Supabase (30MB max)
router.post('/cv', uploadDoc.single('cv'), async (req, res) => {
  try {
    const file = req.file || (req.files && req.files[0]);
    if (!file) {
      return res.status(400).json({ success: false, message: 'No CV document file uploaded' });
    }

    const result = await uploadFileToStorage(
      file.buffer,
      file.originalname,
      file.mimetype || 'application/pdf',
      'cv'
    );

    return res.json({
      success: true,
      message: 'CV uploaded successfully to Supabase Storage (cv)',
      url: result.url,
      path: result.path,
      filename: result.filename,
    });
  } catch (err) {
    console.error('[Upload/cv error]', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to upload CV' });
  }
});

// Delete file endpoint
router.delete('/file', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'File URL is required' });
    }
    const success = await deleteFileFromStorage(url);
    return res.json({ success, message: success ? 'File deleted from storage' : 'File not found or already deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
