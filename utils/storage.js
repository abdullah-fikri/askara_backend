const path = require('path');
const fs = require('fs');
const { supabase, isSupabaseConfigured } = require('../config/supabase');

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'askara';
const LOCAL_UPLOAD_DIR = path.join(__dirname, '../public/uploads');

// Ensure local fallback upload directory exists
if (!fs.existsSync(LOCAL_UPLOAD_DIR)) {
  fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
}

/**
 * Sanitize filename to be safe for S3 / Supabase storage
 */
function sanitizeFileName(originalName = 'file') {
  const ext = path.extname(originalName).toLowerCase();
  const base = path
    .basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
  return `${base || 'upload'}-${uniqueSuffix}${ext}`;
}

/**
 * Extract storage path (e.g. "assets/photo.png" or "cv/resume.pdf") from URL, path string, or object
 */
function extractStoragePath(fileUrlOrPath) {
  if (!fileUrlOrPath) return null;

  // If passed an object like { url: "..." }
  let target = fileUrlOrPath;
  if (typeof target === 'object' && target !== null && target.url) {
    target = target.url;
  }

  if (typeof target !== 'string') return null;

  const trimmed = target.trim();
  if (!trimmed) return null;

  // Remove any query parameters (e.g. ?token=... or ?t=...)
  const cleanUrl = trimmed.split('?')[0].split('#')[0];

  // If already relative storage path (e.g. "assets/..." or "cv/...")
  if (cleanUrl.startsWith('assets/') || cleanUrl.startsWith('cv/')) {
    return cleanUrl;
  }

  // If it's a Supabase storage URL:
  // e.g. https://<ref>.supabase.co/storage/v1/object/public/askara/assets/file.png
  // or https://<ref>.supabase.co/storage/v1/object/sign/askara/cv/file.pdf
  const supabasePattern = new RegExp(`(?:/object/(?:public|sign|authenticated)/${BUCKET_NAME}/)(assets/[^?#]+|cv/[^?#]+|[^?#]+)`);
  const match = cleanUrl.match(supabasePattern);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }

  // If it's a local upload path: e.g. "/uploads/file.png"
  if (cleanUrl.startsWith('/uploads/')) {
    return cleanUrl;
  }

  return null;
}

/**
 * Upload a file buffer to Supabase Storage with organized folder classification
 * @param {Buffer} fileBuffer - The binary file buffer
 * @param {string} originalFilename - Original filename
 * @param {string} mimetype - File MIME type (e.g. 'image/png', 'application/pdf')
 * @param {'assets' | 'cv'} folder - Destination folder in the bucket ('assets' or 'cv')
 * @returns {Promise<{ url: string, path: string, filename: string }>}
 */
async function uploadFileToStorage(fileBuffer, originalFilename, mimetype, folder = 'assets') {
  const targetFolder = folder === 'cv' ? 'cv' : 'assets';
  const cleanFilename = sanitizeFileName(originalFilename);
  const storagePath = `${targetFolder}/${cleanFilename}`;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, fileBuffer, {
          contentType: mimetype || 'application/octet-stream',
          upsert: true,
        });

      if (error) {
        console.error(`[Storage] Supabase upload failed for ${storagePath}:`, error.message);
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath);

      return {
        url: urlData.publicUrl,
        path: storagePath,
        filename: cleanFilename,
      };
    } catch (err) {
      console.warn(`[Storage] Falling back to local storage due to Supabase upload error:`, err.message);
    }
  }

  // Fallback to local storage if Supabase is unavailable
  const localFilePath = path.join(LOCAL_UPLOAD_DIR, cleanFilename);
  fs.writeFileSync(localFilePath, fileBuffer);

  return {
    url: `/uploads/${cleanFilename}`,
    path: `/uploads/${cleanFilename}`,
    filename: cleanFilename,
  };
}

/**
 * Delete a file from Supabase Storage (and local fallback if applicable)
 * @param {string|object} fileUrlOrPath - Public URL, relative path, or object { url: string }
 * @returns {Promise<boolean>}
 */
async function deleteFileFromStorage(fileUrlOrPath) {
  if (!fileUrlOrPath) return false;

  const storagePath = extractStoragePath(fileUrlOrPath);
  if (!storagePath) return false;

  // If local file path (/uploads/...)
  if (storagePath.startsWith('/uploads/')) {
    const filename = path.basename(storagePath);
    const localFilePath = path.join(LOCAL_UPLOAD_DIR, filename);
    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
        console.log(`[Storage] Deleted local file: ${filename}`);
        return true;
      } catch (err) {
        console.warn(`[Storage] Failed to delete local file ${filename}:`, err.message);
      }
    }
    return false;
  }

  // Supabase Storage file deletion
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([storagePath]);

      if (error) {
        console.warn(`[Storage] Failed to delete ${storagePath} from Supabase:`, error.message);
        return false;
      }

      console.log(`[Storage] Successfully deleted from Supabase: ${storagePath}`);
      return true;
    } catch (err) {
      console.warn(`[Storage] Error deleting ${storagePath}:`, err.message);
      return false;
    }
  }

  return false;
}

/**
 * Delete multiple files from Supabase Storage
 * @param {Array<string|object>} fileUrls - Array of public URLs, paths, or objects with .url
 */
async function deleteMultipleFilesFromStorage(fileUrls = []) {
  if (!Array.isArray(fileUrls) || fileUrls.length === 0) return;
  const validUrls = fileUrls
    .map((item) => (typeof item === 'object' && item !== null && item.url ? item.url : item))
    .filter(Boolean);
  await Promise.allSettled(validUrls.map((url) => deleteFileFromStorage(url)));
}

module.exports = {
  BUCKET_NAME,
  uploadFileToStorage,
  deleteFileFromStorage,
  deleteMultipleFilesFromStorage,
  extractStoragePath,
};
