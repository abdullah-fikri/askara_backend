const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { deleteFileFromStorage, deleteMultipleFilesFromStorage } = require('../utils/storage');
const { initialPartners } = require('./initialData');
const {
  adjustSequenceOnCreate,
  adjustSequenceOnUpdate,
  adjustSequenceOnDelete,
  batchReorder,
} = require('../utils/sequenceHelper');

let memoryPartners = [...initialPartners];

function normalizeGallery(gallery) {
  if (!gallery) return [];
  if (Array.isArray(gallery)) return gallery;
  if (typeof gallery === 'string') {
    try {
      const parsed = JSON.parse(gallery);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function ensureSlug(partner) {
  if (partner.slug && partner.slug.trim()) return partner.slug.trim();
  return (partner.name || 'principal')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function formatPartner(p) {
  if (!p) return null;
  return {
    ...p,
    slug: ensureSlug(p),
    documentation_gallery: normalizeGallery(p.documentation_gallery)
  };
}

class Partner {
  static async findAll({ activeOnly = false } = {}) {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('partners')
          .select('*')
          .order('sort_order', { ascending: true });

        if (activeOnly) {
          query = query.eq('is_active', true);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(formatPartner);
        }
      } catch (err) {
        console.warn('[Partner.findAll] Supabase query failed, falling back to memory:', err.message);
      }
    }

    let list = [...memoryPartners];
    if (activeOnly) list = list.filter(p => p.is_active);
    return list
      .map(formatPartner)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  static async findById(id) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) {
          return formatPartner(data);
        }
      } catch (err) {
        // fallback
      }
    }
    const found = memoryPartners.find(p => p.id === Number(id)) || null;
    return formatPartner(found);
  }

  static async findBySlug(slug) {
    if (isSupabaseConfigured()) {
      try {
        // First try finding by slug column
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .eq('slug', slug)
          .single();
        if (!error && data) {
          return formatPartner(data);
        }

        // If numeric slug, try by ID
        if (!isNaN(Number(slug))) {
          const { data: byId } = await supabase
            .from('partners')
            .select('*')
            .eq('id', Number(slug))
            .single();
          if (byId) return formatPartner(byId);
        }

        // Fallback: search all rows if slug column wasn't in DB yet
        const { data: allRows } = await supabase.from('partners').select('*');
        if (allRows) {
          const matched = allRows.find(p => ensureSlug(p) === slug || p.id === Number(slug));
          if (matched) return formatPartner(matched);
        }
      } catch (err) {
        // fallback
      }
    }
    const found =
      memoryPartners.find(p => ensureSlug(p) === slug) ||
      memoryPartners.find(p => p.slug === slug) ||
      memoryPartners.find(p => p.id === Number(slug)) ||
      null;
    return formatPartner(found);
  }

  static async create(payload) {
    const slug = payload.slug || (payload.name || 'principal')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const dataToInsert = {
      name: payload.name,
      slug,
      logo: payload.logo || null,
      country: payload.country || null,
      category: payload.category || null,
      description_en: payload.description_en || null,
      description_id: payload.description_id || null,
      documentation_gallery: normalizeGallery(payload.documentation_gallery),
      website_url: payload.website_url || null,
      is_active: payload.is_active !== undefined ? Boolean(payload.is_active) : true,
      sort_order: Number(payload.sort_order) || 0,
      created_at: new Date().toISOString()
    };

    let result = null;

    if (isSupabaseConfigured()) {
      try {
        const { data: latest } = await supabase
          .from('partners')
          .select('id')
          .order('id', { ascending: false })
          .limit(1);

        const nextId = latest && latest.length > 0 && typeof latest[0].id === 'number'
          ? latest[0].id + 1
          : undefined;

        const payloadWithId = nextId ? { id: nextId, ...dataToInsert } : dataToInsert;

        const { data, error } = await supabase
          .from('partners')
          .insert([payloadWithId])
          .select()
          .single();

        if (!error && data) {
          result = { ...data, documentation_gallery: normalizeGallery(data.documentation_gallery) };
          memoryPartners.push(result);
        }
      } catch (err) {
        console.warn('[Partner.create] Supabase insert failed, falling back to memory:', err.message);
      }
    }

    if (!result) {
      const newId = memoryPartners.length ? Math.max(...memoryPartners.map(p => p.id || 0)) + 1 : 1;
      result = {
        id: newId,
        ...dataToInsert
      };
      memoryPartners.push(result);
    }

    await adjustSequenceOnCreate('partners', memoryPartners, result.id, payload.sort_order);
    return (await this.findById(result.id)) || result;
  }

  static async update(id, payload) {
    const dataToUpdate = { ...payload };
    delete dataToUpdate.id;

    if (dataToUpdate.documentation_gallery !== undefined) {
      dataToUpdate.documentation_gallery = normalizeGallery(dataToUpdate.documentation_gallery);
    }
    if (dataToUpdate.sort_order !== undefined) {
      dataToUpdate.sort_order = Number(dataToUpdate.sort_order);
    }
    if (dataToUpdate.is_active !== undefined) {
      dataToUpdate.is_active = Boolean(dataToUpdate.is_active);
    }

    // Clean up replaced logo or removed gallery photos
    try {
      const existing = await this.findById(id);
      if (existing) {
        if (dataToUpdate.logo !== undefined && existing.logo && existing.logo !== dataToUpdate.logo) {
          await deleteFileFromStorage(existing.logo);
        }

        if (dataToUpdate.documentation_gallery !== undefined && Array.isArray(existing.documentation_gallery)) {
          const newUrls = new Set((dataToUpdate.documentation_gallery || []).map(item => (typeof item === 'object' ? item?.url : item)).filter(Boolean));
          const removedPhotos = existing.documentation_gallery
            .map(item => (typeof item === 'object' ? item?.url : item))
            .filter(url => url && !newUrls.has(url));

          if (removedPhotos.length > 0) {
            await deleteMultipleFilesFromStorage(removedPhotos);
          }
        }
      }
    } catch (err) {
      // ignore
    }

    dataToUpdate.updated_at = new Date().toISOString();

    let updated = null;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('partners')
          .update(dataToUpdate)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          updated = { ...data, documentation_gallery: normalizeGallery(data.documentation_gallery) };
          const index = memoryPartners.findIndex(p => p.id === Number(id));
          if (index !== -1) memoryPartners[index] = updated;
        }
      } catch (err) {
        console.warn('[Partner.update] Supabase update failed, falling back to memory:', err.message);
      }
    }

    if (!updated) {
      const index = memoryPartners.findIndex(p => p.id === Number(id));
      if (index !== -1) {
        memoryPartners[index] = {
          ...memoryPartners[index],
          ...dataToUpdate
        };
        updated = memoryPartners[index];
      }
    }

    if (updated && payload.sort_order !== undefined) {
      await adjustSequenceOnUpdate('partners', memoryPartners, id, payload.sort_order);
      updated = (await this.findById(id)) || updated;
    }

    return updated;
  }

  static async delete(id) {
    let deleted = null;
    try {
      deleted = await this.findById(id);
    } catch (e) {}

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('partners')
          .delete()
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          deleted = { ...data, documentation_gallery: normalizeGallery(data.documentation_gallery) };
        }
      } catch (err) {
        // ignore
      }
    }

    const index = memoryPartners.findIndex(p => p.id === Number(id));
    if (index !== -1) {
      const removed = memoryPartners.splice(index, 1)[0];
      if (!deleted) deleted = removed;
    }

    if (deleted) {
      if (deleted.logo) await deleteFileFromStorage(deleted.logo);
      if (Array.isArray(deleted.documentation_gallery) && deleted.documentation_gallery.length > 0) {
        await deleteMultipleFilesFromStorage(deleted.documentation_gallery);
      }
    }

    await adjustSequenceOnDelete('partners', memoryPartners);
    return deleted;
  }

  static async reorder(orderedIds) {
    await batchReorder('partners', memoryPartners, orderedIds);
    return await this.findAll();
  }
}

module.exports = Partner;
