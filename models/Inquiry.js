const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { initialInquiries } = require('./initialData');

let memoryInquiries = [...initialInquiries];

class Inquiry {
  static async findAll({ status = null } = {}) {
    if (isSupabaseConfigured()) {
      let query = supabase
        .from('inquiries')
        .select(`
          *,
          product:products(id, name_en, name_id, slug, image)
        `)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) {
        console.error('[Inquiry.findAll] Supabase error:', error);
        return memoryInquiries;
      }
      return data || [];
    }

    let list = [...memoryInquiries];
    if (status) list = list.filter(i => i.status === status);
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  static async findById(id) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('id', id)
        .single();
      return data || null;
    }
    return memoryInquiries.find(i => i.id === Number(id)) || null;
  }

  static async create(payload) {
    const dataToInsert = {
      product_id: payload.product_id ? Number(payload.product_id) : null,
      product_name: payload.product_name || null,
      name: payload.name,
      company: payload.company || null,
      email: payload.email,
      phone: payload.phone || null,
      message: payload.message,
      status: 'new'
    };

    if (isSupabaseConfigured()) {
      const { data: latest } = await supabase
        .from('inquiries')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      const nextId = latest && latest.length > 0 && typeof latest[0].id === 'number'
        ? latest[0].id + 1
        : undefined;

      const payloadWithId = nextId ? { id: nextId, ...dataToInsert } : dataToInsert;

      const { data, error } = await supabase
        .from('inquiries')
        .insert([payloadWithId])
        .select()
        .single();

      if (error) {
        if (error.code === '23505' || error.message?.includes('duplicate key')) {
          const { data: allRows } = await supabase.from('inquiries').select('id');
          const maxId = allRows && allRows.length > 0 ? Math.max(...allRows.map(r => r.id)) + 1 : 1;
          const { data: retryData, error: retryError } = await supabase
            .from('inquiries')
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

    const newInquiry = {
      id: memoryInquiries.length ? Math.max(...memoryInquiries.map(i => i.id)) + 1 : 1,
      ...dataToInsert,
      created_at: new Date().toISOString()
    };
    memoryInquiries.push(newInquiry);
    return newInquiry;
  }

  static async updateStatus(id, status) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('inquiries')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const index = memoryInquiries.findIndex(i => i.id === Number(id));
    if (index === -1) return null;
    memoryInquiries[index] = {
      ...memoryInquiries[index],
      status,
      updated_at: new Date().toISOString()
    };
    return memoryInquiries[index];
  }

  static async delete(id) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const index = memoryInquiries.findIndex(i => i.id === Number(id));
    if (index === -1) return null;
    const removed = memoryInquiries.splice(index, 1);
    return removed[0];
  }
}

module.exports = Inquiry;
