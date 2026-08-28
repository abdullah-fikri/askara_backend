const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { deleteFileFromStorage } = require('../utils/storage');
const { initialCategories } = require('./initialData');
const {
  adjustSequenceOnCreate,
  adjustSequenceOnUpdate,
  adjustSequenceOnDelete,
  batchReorder,
} = require('../utils/sequenceHelper');

let memoryCategories = [];

class ProductCategory {
  static async findAll({ activeOnly = false } = {}) {
    if (isSupabaseConfigured()) {
      let query = supabase
        .from('product_categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (activeOnly) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (error) {
        console.error('[Category.findAll] Supabase error:', error);
        return memoryCategories;
      }
      return data || [];
    }
    let list = [...memoryCategories];
    if (activeOnly) {
      list = list.filter(c => c.is_active);
    }
    return list.sort((a, b) => a.sort_order - b.sort_order);
  }

  static async findBySlug(slug) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error && error.code !== 'PGRST116') {
        console.error('[Category.findBySlug] Supabase error:', error);
      }
      return data || null;
    }
    return memoryCategories.find(c => c.slug === slug) || null;
  }

  static async findById(id) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('id', id)
        .single();
      return data || null;
    }
    return memoryCategories.find(c => c.id === Number(id)) || null;
  }

  static async create(payload) {
    const slug = payload.slug || payload.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const dataToInsert = {
      name_en: payload.name_en,
      name_id: payload.name_id || payload.name_en,
      slug,
      description_en: payload.description_en || null,
      description_id: payload.description_id || null,
      image: payload.image || null,
      is_active: payload.is_active !== undefined ? payload.is_active : true,
      sort_order: Number(payload.sort_order) || 0
    };

    let result = null;

    if (isSupabaseConfigured()) {
      const { data: latest } = await supabase
        .from('product_categories')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      const nextId = latest && latest.length > 0 && typeof latest[0].id === 'number'
        ? latest[0].id + 1
        : undefined;

      const payloadWithId = nextId ? { id: nextId, ...dataToInsert } : dataToInsert;

      const { data, error } = await supabase
        .from('product_categories')
        .insert([payloadWithId])
        .select()
        .single();

      if (error) {
        if (error.code === '23505' || error.message?.includes('duplicate key')) {
          const { data: allRows } = await supabase.from('product_categories').select('id');
          const maxId = allRows && allRows.length > 0 ? Math.max(...allRows.map(r => r.id)) + 1 : 1;
          const { data: retryData, error: retryError } = await supabase
            .from('product_categories')
            .insert([{ id: maxId, ...dataToInsert }])
            .select()
            .single();
          if (retryError) throw retryError;
          result = retryData;
        } else {
          throw error;
        }
      } else {
        result = data;
      }
    }

    if (!result) {
      const newCat = {
        id: memoryCategories.length ? Math.max(...memoryCategories.map(c => c.id)) + 1 : 1,
        ...dataToInsert,
        created_at: new Date().toISOString()
      };
      memoryCategories.push(newCat);
      result = newCat;
    }

    await adjustSequenceOnCreate('product_categories', memoryCategories, result.id, payload.sort_order);
    return (await this.findById(result.id)) || result;
  }

  static async update(id, payload) {
    const dataToUpdate = { ...payload };
    delete dataToUpdate.id;

    // Clean up replaced image
    try {
      if (dataToUpdate.image !== undefined) {
        const existing = await this.findById(id);
        if (existing && existing.image && existing.image !== dataToUpdate.image) {
          await deleteFileFromStorage(existing.image);
        }
      }
    } catch (err) {
      // ignore
    }

    let updated = null;

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('product_categories')
        .update({ ...dataToUpdate, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      updated = data;
    } else {
      const index = memoryCategories.findIndex(c => c.id === Number(id));
      if (index !== -1) {
        memoryCategories[index] = {
          ...memoryCategories[index],
          ...dataToUpdate,
          updated_at: new Date().toISOString()
        };
        updated = memoryCategories[index];
      }
    }

    if (updated && payload.sort_order !== undefined) {
      await adjustSequenceOnUpdate('product_categories', memoryCategories, id, payload.sort_order);
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
      const { data, error } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        deleted = data;
      }
    } else {
      const index = memoryCategories.findIndex(c => c.id === Number(id));
      if (index !== -1) {
        deleted = memoryCategories.splice(index, 1)[0];
      }
    }

    if (deleted && deleted.image) {
      await deleteFileFromStorage(deleted.image);
    }

    await adjustSequenceOnDelete('product_categories', memoryCategories);
    return deleted;
  }

  static async reorder(orderedIds) {
    await batchReorder('product_categories', memoryCategories, orderedIds);
    return await this.findAll();
  }
}

module.exports = ProductCategory;
