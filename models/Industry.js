const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { deleteFileFromStorage } = require('../utils/storage');
const { initialIndustries } = require('./initialData');
const { isTableAvailable } = require('../utils/autoMigrate');
const {
  adjustSequenceOnCreate,
  adjustSequenceOnUpdate,
  adjustSequenceOnDelete,
  batchReorder,
} = require('../utils/sequenceHelper');

let memoryIndustries = [...initialIndustries];

function normalizeArray(arr) {
  if (!arr) return [];
  if (Array.isArray(arr)) return arr;
  if (typeof arr === 'string') {
    try {
      const parsed = JSON.parse(arr);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return arr.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
}

function formatIndustry(ind) {
  if (!ind) return null;
  const name_en = ind.name_en || ind.title_en || '';
  const name_id = ind.name_id || ind.title_id || '';
  const icon = ind.icon || ind.icon_name || 'Factory';
  return {
    ...ind,
    name_en,
    name_id,
    title_en: name_en,
    title_id: name_id,
    icon,
    icon_name: icon,
    tags_en: normalizeArray(ind.tags_en),
    tags_id: normalizeArray(ind.tags_id)
  };
}

class Industry {
  static async findAll({ activeOnly = false, homepageOnly = false } = {}) {
    if (isSupabaseConfigured() && isTableAvailable('industries')) {
      try {
        let query = supabase
          .from('industries')
          .select('*')
          .order('sort_order', { ascending: true });

        if (activeOnly) {
          query = query.eq('is_active', true);
        }

        if (homepageOnly) {
          query = query.eq('show_on_homepage', true);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(formatIndustry);
        }
      } catch (err) {
        // fallback
      }
    }

    let list = [...memoryIndustries];
    if (activeOnly) list = list.filter(i => i.is_active);
    if (homepageOnly) list = list.filter(i => i.show_on_homepage);
    return list
      .map(formatIndustry)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  static async findById(id) {
    if (isSupabaseConfigured() && isTableAvailable('industries')) {
      try {
        const { data, error } = await supabase
          .from('industries')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) return formatIndustry(data);
      } catch (err) {
        // fallback
      }
    }
    const found = memoryIndustries.find(i => i.id === Number(id)) || null;
    return formatIndustry(found);
  }

  static async findBySlug(slug) {
    if (isSupabaseConfigured() && isTableAvailable('industries')) {
      try {
        const { data, error } = await supabase
          .from('industries')
          .select('*')
          .eq('slug', slug)
          .single();
        if (!error && data) return formatIndustry(data);
      } catch (err) {
        // fallback
      }
    }
    const found = memoryIndustries.find(i => i.slug === slug) || null;
    return formatIndustry(found);
  }

  static async create(payload) {
    const slug = payload.slug || (payload.name_en || payload.name_id || payload.title_en || 'industry')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const name_en = payload.name_en || payload.title_en || '';
    const name_id = payload.name_id || payload.title_id || '';
    const icon_name = payload.icon_name || payload.icon || 'Factory';

    const dataToInsert = {
      slug,
      icon_name,
      name_en,
      name_id,
      subtitle_en: payload.subtitle_en || null,
      subtitle_id: payload.subtitle_id || null,
      description_en: payload.description_en || null,
      description_id: payload.description_id || null,
      tags_en: normalizeArray(payload.tags_en),
      tags_id: normalizeArray(payload.tags_id),
      target_category_slug: payload.target_category_slug || 'instrument',
      show_on_homepage: payload.show_on_homepage !== undefined ? Boolean(payload.show_on_homepage) : true,
      is_active: payload.is_active !== undefined ? Boolean(payload.is_active) : true,
      sort_order: Number(payload.sort_order) || 0,
      created_at: new Date().toISOString()
    };

    let result = null;

    if (isSupabaseConfigured() && isTableAvailable('industries')) {
      try {
        const { data, error } = await supabase
          .from('industries')
          .insert([dataToInsert])
          .select()
          .single();

        if (!error && data) {
          result = formatIndustry(data);
          memoryIndustries.push(result);
        }
      } catch (err) {
        console.warn('[Industry.create] Supabase insert notice:', err.message);
      }
    }

    if (!result) {
      const newId = memoryIndustries.length ? Math.max(...memoryIndustries.map(i => i.id || 0)) + 1 : 1;
      result = formatIndustry({
        id: newId,
        ...dataToInsert
      });
      memoryIndustries.push(result);
    }

    await adjustSequenceOnCreate('industries', memoryIndustries, result.id, payload.sort_order);
    return (await this.findById(result.id)) || result;
  }

  static async update(id, payload) {
    const dataToUpdate = { ...payload };
    delete dataToUpdate.id;

    if (dataToUpdate.tags_en) dataToUpdate.tags_en = normalizeArray(dataToUpdate.tags_en);
    if (dataToUpdate.tags_id) dataToUpdate.tags_id = normalizeArray(dataToUpdate.tags_id);
    if (dataToUpdate.title_en && !dataToUpdate.name_en) dataToUpdate.name_en = dataToUpdate.title_en;
    if (dataToUpdate.title_id && !dataToUpdate.name_id) dataToUpdate.name_id = dataToUpdate.title_id;
    if (dataToUpdate.icon && !dataToUpdate.icon_name) dataToUpdate.icon_name = dataToUpdate.icon;
    if (dataToUpdate.sort_order !== undefined) dataToUpdate.sort_order = Number(dataToUpdate.sort_order);
    if (dataToUpdate.is_active !== undefined) dataToUpdate.is_active = Boolean(dataToUpdate.is_active);
    if (dataToUpdate.show_on_homepage !== undefined) dataToUpdate.show_on_homepage = Boolean(dataToUpdate.show_on_homepage);

    // Clean up old image if replaced
    if (dataToUpdate.image !== undefined) {
      try {
        const existing = await this.findById(id);
        if (existing && existing.image && existing.image !== dataToUpdate.image) {
          await deleteFileFromStorage(existing.image);
        }
      } catch (e) {
        // ignore
      }
    }

    dataToUpdate.updated_at = new Date().toISOString();

    let updated = null;

    if (isSupabaseConfigured() && isTableAvailable('industries')) {
      try {
        const { data, error } = await supabase
          .from('industries')
          .update(dataToUpdate)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          updated = formatIndustry(data);
          const index = memoryIndustries.findIndex(i => i.id === Number(id));
          if (index !== -1) memoryIndustries[index] = updated;
        }
      } catch (err) {
        console.warn('[Industry.update] Supabase update notice:', err.message);
      }
    }

    if (!updated) {
      const index = memoryIndustries.findIndex(i => i.id === Number(id));
      if (index !== -1) {
        memoryIndustries[index] = formatIndustry({
          ...memoryIndustries[index],
          ...dataToUpdate
        });
        updated = memoryIndustries[index];
      }
    }

    if (updated && payload.sort_order !== undefined) {
      await adjustSequenceOnUpdate('industries', memoryIndustries, id, payload.sort_order);
      updated = (await this.findById(id)) || updated;
    }

    return updated;
  }

  static async delete(id) {
    let deleted = null;
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('industries')
          .delete()
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          deleted = { ...data, tags_en: normalizeArray(data.tags_en), tags_id: normalizeArray(data.tags_id) };
        }
      } catch (err) {
        // ignore
      }
    }

    const index = memoryIndustries.findIndex(i => i.id === Number(id));
    if (index !== -1) {
      const removed = memoryIndustries.splice(index, 1)[0];
      if (!deleted) deleted = removed;
    }

    if (deleted && deleted.image) {
      await deleteFileFromStorage(deleted.image);
    }

    await adjustSequenceOnDelete('industries', memoryIndustries);
    return deleted;
  }

  static async reorder(orderedIds) {
    await batchReorder('industries', memoryIndustries, orderedIds);
    return await this.findAll();
  }
}

module.exports = Industry;
