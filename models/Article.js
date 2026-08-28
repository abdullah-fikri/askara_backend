const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { deleteFileFromStorage } = require('../utils/storage');
const { initialArticles } = require('./initialData');
const {
  adjustSequenceOnCreate,
  adjustSequenceOnUpdate,
  adjustSequenceOnDelete,
  batchReorder,
} = require('../utils/sequenceHelper');

let memoryArticles = [];

class Article {
  static async findAll({ activeOnly = false, limit = null } = {}) {
    if (isSupabaseConfigured()) {
      let query = supabase
        .from('articles')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('published_at', { ascending: false });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }
      if (limit) {
        query = query.limit(Number(limit));
      }

      const { data, error } = await query;
      if (error) {
        console.error('[Article.findAll] Supabase error:', error);
        return memoryArticles;
      }
      return data || [];
    }

    let list = [...memoryArticles];
    if (activeOnly) list = list.filter(a => a.is_active);
    list.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || new Date(b.published_at) - new Date(a.published_at));
    if (limit) list = list.slice(0, Number(limit));
    return list;
  }

  static async findById(id) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();
      return data || null;
    }
    return memoryArticles.find(a => a.id === Number(id)) || null;
  }

  static async create(payload) {
    const dataToInsert = {
      title_en: payload.title_en,
      title_id: payload.title_id || payload.title_en,
      category_en: payload.category_en || 'Food Safety',
      category_id: payload.category_id || payload.category_en || 'Keamanan Pangan',
      image: payload.image || null,
      published_at: payload.published_at || new Date().toISOString().split('T')[0],
      linkedin_url: payload.linkedin_url || null,
      is_active: payload.is_active !== undefined ? payload.is_active : true,
      sort_order: Number(payload.sort_order) || 0
    };

    let result = null;

    if (isSupabaseConfigured()) {
      const { data: latest } = await supabase
        .from('articles')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      const nextId = latest && latest.length > 0 && typeof latest[0].id === 'number'
        ? latest[0].id + 1
        : undefined;

      const payloadWithId = nextId ? { id: nextId, ...dataToInsert } : dataToInsert;

      const { data, error } = await supabase
        .from('articles')
        .insert([payloadWithId])
        .select()
        .single();

      if (error) {
        if (error.code === '23505' || error.message?.includes('duplicate key')) {
          const { data: allRows } = await supabase.from('articles').select('id');
          const maxId = allRows && allRows.length > 0 ? Math.max(...allRows.map(r => r.id)) + 1 : 1;
          const { data: retryData, error: retryError } = await supabase
            .from('articles')
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
      const newArticle = {
        id: memoryArticles.length ? Math.max(...memoryArticles.map(a => a.id)) + 1 : 1,
        ...dataToInsert,
        created_at: new Date().toISOString()
      };
      memoryArticles.push(newArticle);
      result = newArticle;
    }

    await adjustSequenceOnCreate('articles', memoryArticles, result.id, payload.sort_order);
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
        .from('articles')
        .update({ ...dataToUpdate, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      updated = data;
    } else {
      const index = memoryArticles.findIndex(a => a.id === Number(id));
      if (index !== -1) {
        memoryArticles[index] = {
          ...memoryArticles[index],
          ...dataToUpdate,
          updated_at: new Date().toISOString()
        };
        updated = memoryArticles[index];
      }
    }

    if (updated && payload.sort_order !== undefined) {
      await adjustSequenceOnUpdate('articles', memoryArticles, id, payload.sort_order);
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
        .from('articles')
        .delete()
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        deleted = data;
      }
    } else {
      const index = memoryArticles.findIndex(a => a.id === Number(id));
      if (index !== -1) {
        deleted = memoryArticles.splice(index, 1)[0];
      }
    }

    if (deleted && deleted.image) {
      await deleteFileFromStorage(deleted.image);
    }

    await adjustSequenceOnDelete('articles', memoryArticles);
    return deleted;
  }

  static async reorder(orderedIds) {
    await batchReorder('articles', memoryArticles, orderedIds);
    return await this.findAll();
  }
}

module.exports = Article;
