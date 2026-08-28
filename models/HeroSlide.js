const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { deleteFileFromStorage } = require('../utils/storage');
const { initialHeroSlides } = require('./initialData');
const { isTableAvailable } = require('../utils/autoMigrate');
const {
  adjustSequenceOnCreate,
  adjustSequenceOnUpdate,
  adjustSequenceOnDelete,
  batchReorder,
} = require('../utils/sequenceHelper');

let memoryHeroSlides = [...initialHeroSlides];

class HeroSlide {
  static async findAll({ activeOnly = false } = {}) {
    if (isSupabaseConfigured() && isTableAvailable('hero_slides')) {
      try {
        let query = supabase
          .from('hero_slides')
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

    let list = [...memoryHeroSlides];
    if (activeOnly) list = list.filter(s => s.is_active);
    return list.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  static async findById(id) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('hero_slides')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) return data;
      } catch (err) {
        // fallback
      }
    }
    return memoryHeroSlides.find(s => s.id === Number(id)) || null;
  }

  static async create(payload) {
    const dataToInsert = {
      title_en: payload.title_en || '',
      title_id: payload.title_id || '',
      subtitle_en: payload.subtitle_en || '',
      subtitle_id: payload.subtitle_id || '',
      image: payload.image,
      primary_btn_text_en: payload.primary_btn_text_en || 'Explore Solutions',
      primary_btn_text_id: payload.primary_btn_text_id || 'Jelajahi Solusi',
      primary_btn_url: payload.primary_btn_url || '/products',
      secondary_btn_text_en: payload.secondary_btn_text_en || 'Contact Us',
      secondary_btn_text_id: payload.secondary_btn_text_id || 'Hubungi Kami',
      secondary_btn_url: payload.secondary_btn_url || '/contact',
      sort_order: Number(payload.sort_order) || 0,
      is_active: payload.is_active !== undefined ? payload.is_active : true
    };

    let result = null;

    if (isSupabaseConfigured()) {
      try {
        const { data: latest } = await supabase
          .from('hero_slides')
          .select('id')
          .order('id', { ascending: false })
          .limit(1);

        const nextId = latest && latest.length > 0 && typeof latest[0].id === 'number'
          ? latest[0].id + 1
          : undefined;

        const payloadWithId = nextId ? { id: nextId, ...dataToInsert } : dataToInsert;

        const { data, error } = await supabase
          .from('hero_slides')
          .insert([payloadWithId])
          .select()
          .single();

        if (!error && data) {
          result = data;
        }
        if (error) {
          console.warn('[HeroSlide.create] Supabase notice (using memory fallback):', error.message);
        }
      } catch (err) {
        console.warn('[HeroSlide.create] Supabase insert failed, fallback to memory:', err.message);
      }
    }

    if (!result) {
      const newSlide = {
        id: memoryHeroSlides.length ? Math.max(...memoryHeroSlides.map(s => s.id)) + 1 : 1,
        ...dataToInsert,
        created_at: new Date().toISOString()
      };
      memoryHeroSlides.push(newSlide);
      result = newSlide;
    }

    await adjustSequenceOnCreate('hero_slides', memoryHeroSlides, result.id, payload.sort_order);
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
          .from('hero_slides')
          .update({ ...dataToUpdate, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) updated = data;
        if (error) {
          console.warn('[HeroSlide.update] Supabase notice (using memory fallback):', error.message);
        }
      } catch (err) {
        console.warn('[HeroSlide.update] Supabase update failed, fallback to memory:', err.message);
      }
    }

    if (!updated) {
      const index = memoryHeroSlides.findIndex(s => s.id === Number(id));
      if (index !== -1) {
        memoryHeroSlides[index] = {
          ...memoryHeroSlides[index],
          ...dataToUpdate,
          updated_at: new Date().toISOString()
        };
        updated = memoryHeroSlides[index];
      }
    }

    if (updated && payload.sort_order !== undefined) {
      await adjustSequenceOnUpdate('hero_slides', memoryHeroSlides, id, payload.sort_order);
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
          .from('hero_slides')
          .delete()
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          deleted = data;
        }
      } catch (err) {
        console.warn('[HeroSlide.delete] Supabase delete failed, fallback to memory:', err.message);
      }
    }

    const index = memoryHeroSlides.findIndex(s => s.id === Number(id));
    if (index !== -1) {
      const removed = memoryHeroSlides.splice(index, 1)[0];
      if (!deleted) deleted = removed;
    }

    if (deleted && deleted.image) {
      await deleteFileFromStorage(deleted.image);
    }

    await adjustSequenceOnDelete('hero_slides', memoryHeroSlides);
    return deleted;
  }

  static async reorder(orderedIds) {
    await batchReorder('hero_slides', memoryHeroSlides, orderedIds);
    return await this.findAll();
  }
}

module.exports = HeroSlide;
