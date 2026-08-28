const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { initialCareers } = require('./initialData');

let memoryCareers = [...initialCareers];

function ensureSlug(item) {
  if (!item) return item;
  const slug = item.slug && item.slug.trim()
    ? item.slug
    : `${item.job_title_en || 'career'} ${item.location_en || ''}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
  return { ...item, slug };
}

class Career {
  static async findAll({ activeOnly = false } = {}) {
    if (isSupabaseConfigured()) {
      let query = supabase
        .from('careers')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) {
        console.error('[Career.findAll] Supabase error:', error);
        return memoryCareers.map(ensureSlug);
      }
      return (data || []).map(ensureSlug);
    }

    let list = [...memoryCareers];
    if (activeOnly) list = list.filter(c => c.is_active);
    return list.map(ensureSlug).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  static async findById(id) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('id', id)
        .single();
      return data ? ensureSlug(data) : null;
    }
    const item = memoryCareers.find(c => c.id === Number(id));
    return item ? ensureSlug(item) : null;
  }

  static async findBySlug(slug) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('careers')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        if (!error && data) return ensureSlug(data);
      } catch (err) {
        // Ignored if column doesn't exist
      }

      // Safe fallback: fetch all and match against calculated slug or ID
      const all = await this.findAll();
      const match = all.find(c => c.slug === slug || String(c.id) === String(slug));
      if (match) return match;
    }
    const list = memoryCareers.map(ensureSlug);
    return list.find(c => c.slug === slug || String(c.id) === String(slug)) || null;
  }
  static async create(payload) {
    const slug = payload.slug || (payload.job_title_en
      ? `${payload.job_title_en} ${payload.location_en || ''}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      : `career-${Date.now()}`);

    const dataToInsert = {
      slug,
      job_title_en: payload.job_title_en,
      job_title_id: payload.job_title_id || payload.job_title_en,
      department_en: payload.department_en || null,
      department_id: payload.department_id || null,
      location_en: payload.location_en || 'Jakarta, Indonesia',
      location_id: payload.location_id || payload.location_en || 'Jakarta, Indonesia',
      employment_type_en: payload.employment_type_en || 'Full-time',
      employment_type_id: payload.employment_type_id || 'Penuh Waktu',
      experience_level_en: payload.experience_level_en || null,
      experience_level_id: payload.experience_level_id || null,
      linkedin_url: payload.linkedin_url || null,
      description_en: payload.description_en || null,
      description_id: payload.description_id || null,
      responsibilities_en: payload.responsibilities_en || null,
      responsibilities_id: payload.responsibilities_id || null,
      requirements_en: payload.requirements_en || null,
      requirements_id: payload.requirements_id || null,
      benefits_en: payload.benefits_en || null,
      benefits_id: payload.benefits_id || null,
      salary_range: payload.salary_range || null,
      is_active: payload.is_active !== undefined ? payload.is_active : true
    };

    if (isSupabaseConfigured()) {
      const { data: latest } = await supabase
        .from('careers')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      const nextId = latest && latest.length > 0 && typeof latest[0].id === 'number'
        ? latest[0].id + 1
        : undefined;

      const payloadWithId = nextId ? { id: nextId, ...dataToInsert } : dataToInsert;

      const { data, error } = await supabase
        .from('careers')
        .insert([payloadWithId])
        .select()
        .single();

      if (error) {
        if (error.code === '23505' || error.message?.includes('duplicate key')) {
          const { data: allRows } = await supabase.from('careers').select('id');
          const maxId = allRows && allRows.length > 0 ? Math.max(...allRows.map(r => r.id)) + 1 : 1;
          const { data: retryData, error: retryError } = await supabase
            .from('careers')
            .insert([{ id: maxId, ...dataToInsert }])
            .select()
            .single();
          if (retryError) throw retryError;
          return retryData;
        }
        throw error;
      }
      return data;
    }

    const newCareer = {
      id: memoryCareers.length ? Math.max(...memoryCareers.map(c => c.id)) + 1 : 1,
      ...dataToInsert,
      created_at: new Date().toISOString()
    };
    memoryCareers.push(newCareer);
    return newCareer;
  }

  static async update(id, payload) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('careers')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const index = memoryCareers.findIndex(c => c.id === Number(id));
    if (index === -1) return null;
    memoryCareers[index] = {
      ...memoryCareers[index],
      ...payload,
      updated_at: new Date().toISOString()
    };
    return memoryCareers[index];
  }

  static async delete(id) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('careers')
        .delete()
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const index = memoryCareers.findIndex(c => c.id === Number(id));
    if (index === -1) return null;
    const removed = memoryCareers.splice(index, 1);
    return removed[0];
  }
}

module.exports = Career;
