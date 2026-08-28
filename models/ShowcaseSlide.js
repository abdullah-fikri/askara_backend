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

function formatShowcaseSlide(slide) {
  if (!slide) return null;
  const captionEn = slide.caption_en || slide.desc_en || '';
  const captionId = slide.caption_id || slide.desc_id || '';
  return {
    ...slide,
    caption_en: captionEn,
    caption_id: captionId,
    desc_en: captionEn,
    desc_id: captionId,
  };
}

function toSupabasePayload(payload) {
  const mapped = {};
  if (payload.image !== undefined) mapped.image = payload.image;
  if (payload.title_en !== undefined) mapped.title_en = payload.title_en;
  if (payload.title_id !== undefined) mapped.title_id = payload.title_id;
  if (payload.tag_en !== undefined) mapped.tag_en = payload.tag_en;
  if (payload.tag_id !== undefined) mapped.tag_id = payload.tag_id;

  const descEn = payload.desc_en !== undefined ? payload.desc_en : payload.caption_en;
  if (descEn !== undefined) mapped.desc_en = descEn;

  const descId = payload.desc_id !== undefined ? payload.desc_id : payload.caption_id;
  if (descId !== undefined) mapped.desc_id = descId;

  if (payload.cta_text_en !== undefined) mapped.cta_text_en = payload.cta_text_en;
  if (payload.cta_text_id !== undefined) mapped.cta_text_id = payload.cta_text_id;
  if (payload.cta_link !== undefined) mapped.cta_link = payload.cta_link;

  if (payload.sort_order !== undefined) mapped.sort_order = Number(payload.sort_order) || 0;
  if (payload.is_active !== undefined) mapped.is_active = Boolean(payload.is_active);

  return mapped;
}

let memoryShowcaseSlides = [];

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
        if (!error && data !== null) {
          return data.map(formatShowcaseSlide);
        }
      } catch (err) {
        // fallback
      }
    }

    let list = [...memoryShowcaseSlides];
    if (activeOnly) list = list.filter(s => s.is_active);
    return list.map(formatShowcaseSlide).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  static async findById(id) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('showcase_slides')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) return formatShowcaseSlide(data);
      } catch (err) {
        // fallback
      }
    }
    const found = memoryShowcaseSlides.find(s => s.id === Number(id)) || null;
    return formatShowcaseSlide(found);
  }

  static async create(payload) {
    const dataToInsert = toSupabasePayload(payload);
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
          result = formatShowcaseSlide(data);
        }
        if (error) {
          console.warn('[ShowcaseSlide.create] Supabase notice (using memory fallback):', error.message);
        }
      } catch (err) {
        console.warn('[ShowcaseSlide.create] Supabase insert failed, fallback to memory:', err.message);
      }
    }

    if (!result) {
      const newSlide = formatShowcaseSlide({
        id: memoryShowcaseSlides.length ? Math.max(...memoryShowcaseSlides.map(s => s.id)) + 1 : 1,
        ...dataToInsert,
        created_at: new Date().toISOString()
      });
      memoryShowcaseSlides.push(newSlide);
      result = newSlide;
    }

    await adjustSequenceOnCreate('showcase_slides', memoryShowcaseSlides, result.id, payload.sort_order);
    return (await this.findById(result.id)) || result;
  }

  static async update(id, payload) {
    const dataToUpdate = toSupabasePayload(payload);

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
        if (!error && data) updated = formatShowcaseSlide(data);
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
        memoryShowcaseSlides[index] = formatShowcaseSlide({
          ...memoryShowcaseSlides[index],
          ...dataToUpdate,
          updated_at: new Date().toISOString()
        });
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
          deleted = formatShowcaseSlide(data);
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
