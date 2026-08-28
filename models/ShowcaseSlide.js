const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { deleteFileFromStorage } = require('../utils/storage');
const { initialShowcaseSlides } = require('./initialData');
const { isTableAvailable } = require('../utils/autoMigrate');
const {
  adjustSequenceOnCreate,
  adjustSequenceOnUpdate,
  adjustSequenceOnDelete,
  batchReorder,
} = require('../utils/sequenceHelper');

let memoryShowcaseSlides = [...initialShowcaseSlides];

class ShowcaseSlide {
  static async findAll({ activeOnly = false } = {}) {
    if (isSupabaseConfigured() && isTableAvailable('showcase_slides')) {
      try {
        let query = supabase
          .from('showcase_slides')
          .select('*')
          .order('sort_order', { ascending: true });

        if (activeOnly) {
          query = query.eq('is_active', true);
        }

        const { data, error } = await query;
        if (!error && data) {
          return data;
        }
      } catch (err) {
        // fallback
      }
    }

    let list = [...memoryShowcaseSlides];
    if (activeOnly) list = list.filter(s => s.is_active);
    return list.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  static async findById(id) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('showcase_slides')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) return data;
      } catch (err) {
        // fallback
      }
    }
    return memoryShowcaseSlides.find(s => s.id === Number(id)) || null;
  }

  static async create(payload) {
    const dataToInsert = {
      image: payload.image,
      title_en: payload.title_en || '',
      title_id: payload.title_id || '',
      caption_en: payload.caption_en || '',
      caption_id: payload.caption_id || '',
      sort_order: Number(payload.sort_order) || 0,
      is_active: payload.is_active !== undefined ? payload.is_active : true
    };

    let result = null;

    if (isSupabaseConfigured()) {
      try {
        const { data: latest } = await supabase
          .from('showcase_slides')
          .select('id')
          .order('id', { ascending: false })
          .limit(1);

        const nextId = latest && latest.length > 0 && typeof latest[0].id === 'number'
          ? latest[0].id + 1
          : undefined;

        const payloadWithId = nextId ? { id: nextId, ...dataToInsert } : dataToInsert;

        const { data, error } = await supabase
          .from('showcase_slides')
          .insert([payloadWithId])
          .select()
          .single();

        if (!error && data) {
          result = data;
        }
        if (error) {
          console.warn('[ShowcaseSlide.create] Supabase notice (using memory fallback):', error.message);
        }
      } catch (err) {
        console.warn('[ShowcaseSlide.create] Supabase insert failed, fallback to memory:', err.message);
      }
    }

    if (!result) {
      const newSlide = {
        id: memoryShowcaseSlides.length ? Math.max(...memoryShowcaseSlides.map(s => s.id)) + 1 : 1,
        ...dataToInsert,
        created_at: new Date().toISOString()
      };
      memoryShowcaseSlides.push(newSlide);
      result = newSlide;
    }

    await adjustSequenceOnCreate('showcase_slides', memoryShowcaseSlides, result.id, payload.sort_order);
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
      try {
        const { data, error } = await supabase
          .from('showcase_slides')
          .update({ ...dataToUpdate, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) updated = data;
        if (error) {
          console.warn('[ShowcaseSlide.update] Supabase notice (using memory fallback):', error.message);
        }
      } catch (err) {
        console.warn('[ShowcaseSlide.update] Supabase update failed, fallback to memory:', err.message);
      }
    }

    if (!updated) {
      const index = memoryShowcaseSlides.findIndex(s => s.id === Number(id));
      if (index !== -1) {
        memoryShowcaseSlides[index] = {
          ...memoryShowcaseSlides[index],
          ...dataToUpdate,
          updated_at: new Date().toISOString()
        };
        updated = memoryShowcaseSlides[index];
      }
    }

    if (updated && payload.sort_order !== undefined) {
      await adjustSequenceOnUpdate('showcase_slides', memoryShowcaseSlides, id, payload.sort_order);
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
          .from('showcase_slides')
          .delete()
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          deleted = data;
        }
      } catch (err) {
        console.warn('[ShowcaseSlide.delete] Supabase delete failed, fallback to memory:', err.message);
      }
    }

    const index = memoryShowcaseSlides.findIndex(s => s.id === Number(id));
    if (index !== -1) {
      const removed = memoryShowcaseSlides.splice(index, 1)[0];
      if (!deleted) deleted = removed;
    }

    if (deleted && deleted.image) {
      await deleteFileFromStorage(deleted.image);
    }

    await adjustSequenceOnDelete('showcase_slides', memoryShowcaseSlides);
    return deleted;
  }

  static async reorder(orderedIds) {
    await batchReorder('showcase_slides', memoryShowcaseSlides, orderedIds);
    return await this.findAll();
  }
}

module.exports = ShowcaseSlide;
