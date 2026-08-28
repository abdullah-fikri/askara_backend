const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { deleteFileFromStorage } = require('../utils/storage');

let memoryApplications = [];

class CareerApplication {
  static async findAll({ careerId = null, status = null } = {}) {
    if (isSupabaseConfigured()) {
      let query = supabase
        .from('career_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (careerId) {
        query = query.eq('career_id', Number(careerId));
      }
      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) {
        console.error('[CareerApplication.findAll] Supabase error:', error);
        return memoryApplications;
      }
      return data || [];
    }

    let list = [...memoryApplications];
    if (careerId) list = list.filter((a) => a.career_id === Number(careerId));
    if (status) list = list.filter((a) => a.status === status);
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  static async findById(id) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('career_applications')
        .select('*')
        .eq('id', id)
        .single();
      return data || null;
    }
    const item = memoryApplications.find((a) => a.id === Number(id));
    return item || null;
  }

  static async create(payload) {
    const dataToInsert = {
      career_id: payload.career_id ? Number(payload.career_id) : null,
      career_title: payload.career_title || null,
      full_name: payload.full_name,
      email: payload.email,
      phone: payload.phone,
      linkedin_url: payload.linkedin_url || null,
      portfolio_url: payload.portfolio_url || null,
      cover_letter: payload.cover_letter || payload.message || null,
      cv_url: payload.cv_url,
      cv_filename: payload.cv_filename || null,
      status: payload.status || 'submitted',
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('career_applications')
          .insert([dataToInsert])
          .select()
          .single();

        if (error) {
          console.warn('[CareerApplication.create] Supabase insert warning:', error.message);
          // Fallback if table doesn't exist yet
        } else {
          return data;
        }
      } catch (err) {
        console.warn('[CareerApplication.create] Supabase exception:', err.message);
      }
    }

    const newApp = {
      id: memoryApplications.length ? Math.max(...memoryApplications.map((a) => a.id)) + 1 : 1,
      ...dataToInsert,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryApplications.push(newApp);
    return newApp;
  }

  static async updateStatus(id, status) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('career_applications')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[CareerApplication.updateStatus] Supabase error:', err.message);
      }
    }

    const index = memoryApplications.findIndex((a) => a.id === Number(id));
    if (index === -1) return null;
    memoryApplications[index].status = status;
    memoryApplications[index].updated_at = new Date().toISOString();
    return memoryApplications[index];
  }

  static async delete(id) {
    let deletedItem = null;
    try {
      deletedItem = await this.findById(id);
    } catch (e) {}

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('career_applications')
          .delete()
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          deletedItem = data;
        }
      } catch (err) {
        console.warn('[CareerApplication.delete] Supabase error:', err.message);
      }
    }

    const index = memoryApplications.findIndex((a) => a.id === Number(id));
    if (index !== -1) {
      const removed = memoryApplications.splice(index, 1)[0];
      if (!deletedItem) deletedItem = removed;
    }

    // Delete CV file from Supabase Storage
    if (deletedItem && deletedItem.cv_url) {
      await deleteFileFromStorage(deletedItem.cv_url);
    }

    return deletedItem;
  }
}

module.exports = CareerApplication;
