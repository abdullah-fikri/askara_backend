const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { deleteFileFromStorage } = require('../utils/storage');
const { initialProducts } = require('./initialData');
const ProductCategory = require('./ProductCategory');
const {
  adjustSequenceOnCreate,
  adjustSequenceOnUpdate,
  adjustSequenceOnDelete,
  batchReorder,
} = require('../utils/sequenceHelper');

let memoryProducts = [];

class Product {
  static async findAll({ categorySlug, featuredOnly = false, activeOnly = false, search = '' } = {}) {
    if (isSupabaseConfigured()) {
      let query = supabase
        .from('products')
        .select(`
          *,
          product_category:product_categories(id, name_en, name_id, slug)
        `)
        .order('sort_order', { ascending: true });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }
      if (featuredOnly) {
        query = query.eq('is_featured', true);
      }
      if (categorySlug) {
        query = query.eq('category_slug', categorySlug);
      }
      if (search) {
        query = query.or(`name_en.ilike.%${search}%,name_id.ilike.%${search}%,principal.ilike.%${search}%,description_en.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('[Product.findAll] Supabase error:', error);
        return memoryProducts;
      }
      return data || [];
    }

    // Memory fallback
    let list = [...memoryProducts];
    if (activeOnly) list = list.filter(p => p.is_active);
    if (featuredOnly) list = list.filter(p => p.is_featured);
    if (categorySlug) list = list.filter(p => p.category_slug === categorySlug);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        (p.name_en && p.name_en.toLowerCase().includes(q)) ||
        (p.name_id && p.name_id.toLowerCase().includes(q)) ||
        (p.principal && p.principal.toLowerCase().includes(q)) ||
        (p.description_en && p.description_en.toLowerCase().includes(q))
      );
    }

    // Attach category object
    const categories = await ProductCategory.findAll();
    return list.map(p => ({
      ...p,
      product_category: categories.find(c => c.id === p.product_category_id || c.slug === p.category_slug) || null
    })).sort((a, b) => a.sort_order - b.sort_order);
  }

  static async findBySlug(slug, categorySlug = null) {
    if (isSupabaseConfigured()) {
      let query = supabase
        .from('products')
        .select(`
          *,
          product_category:product_categories(id, name_en, name_id, slug, description_en, description_id)
        `)
        .eq('slug', slug);

      if (categorySlug) {
        query = query.eq('category_slug', categorySlug);
      }

      const { data, error } = await query.single();
      if (error && error.code !== 'PGRST116') {
        console.error('[Product.findBySlug] Supabase error:', error);
      }
      return data || null;
    }

    const product = memoryProducts.find(p => p.slug === slug && (!categorySlug || p.category_slug === categorySlug));
    if (!product) return null;

    const categories = await ProductCategory.findAll();
    return {
      ...product,
      product_category: categories.find(c => c.id === product.product_category_id || c.slug === product.category_slug) || null
    };
  }

  static async findById(id) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_category:product_categories(id, name_en, name_id, slug)
        `)
        .eq('id', id)
        .single();
      return data || null;
    }
    const product = memoryProducts.find(p => p.id === Number(id));
    if (!product) return null;
    const categories = await ProductCategory.findAll();
    return {
      ...product,
      product_category: categories.find(c => c.id === product.product_category_id || c.slug === product.category_slug) || null
    };
  }

  static async create(payload) {
    const slug = payload.slug || payload.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const dataToInsert = {
      product_category_id: payload.product_category_id ? Number(payload.product_category_id) : null,
      category_slug: payload.category_slug || null,
      name_en: payload.name_en,
      name_id: payload.name_id || payload.name_en,
      slug,
      principal: payload.principal || null,
      short_description_en: payload.short_description_en || null,
      short_description_id: payload.short_description_id || null,
      description_en: payload.description_en || null,
      description_id: payload.description_id || null,
      image: payload.image || null,
      specifications: payload.specifications || null,
      applications_en: payload.applications_en || null,
      applications_id: payload.applications_id || null,
      features_en: payload.features_en || null,
      features_id: payload.features_id || null,
      brochure: payload.brochure || null,
      is_active: payload.is_active !== undefined ? payload.is_active : true,
      is_featured: payload.is_featured !== undefined ? payload.is_featured : false,
      sort_order: Number(payload.sort_order) || 0
    };

    let result = null;

    if (isSupabaseConfigured()) {
      const { data: latest } = await supabase
        .from('products')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      const nextId = latest && latest.length > 0 && typeof latest[0].id === 'number'
        ? latest[0].id + 1
        : undefined;

      const payloadWithId = nextId ? { id: nextId, ...dataToInsert } : dataToInsert;

      const { data, error } = await supabase
        .from('products')
        .insert([payloadWithId])
        .select()
        .single();

      if (error) {
        if (error.code === '23505' || error.message?.includes('duplicate key')) {
          const { data: allRows } = await supabase.from('products').select('id');
          const maxId = allRows && allRows.length > 0 ? Math.max(...allRows.map(r => r.id)) + 1 : 1;
          const { data: retryData, error: retryError } = await supabase
            .from('products')
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
      const newProd = {
        id: memoryProducts.length ? Math.max(...memoryProducts.map(p => p.id)) + 1 : 1,
        ...dataToInsert,
        created_at: new Date().toISOString()
      };
      memoryProducts.push(newProd);
      result = newProd;
    }

    await adjustSequenceOnCreate('products', memoryProducts, result.id, payload.sort_order);
    return (await this.findById(result.id)) || result;
  }

  static async update(id, payload) {
    const dataToUpdate = { ...payload };
    delete dataToUpdate.id;

    // Clean up replaced image or brochure
    try {
      const existing = await this.findById(id);
      if (existing) {
        if (dataToUpdate.image !== undefined && existing.image && existing.image !== dataToUpdate.image) {
          await deleteFileFromStorage(existing.image);
        }
        if (dataToUpdate.brochure !== undefined && existing.brochure && existing.brochure !== dataToUpdate.brochure) {
          await deleteFileFromStorage(existing.brochure);
        }
      }
    } catch (err) {
      // ignore
    }

    let updated = null;

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('products')
        .update({ ...dataToUpdate, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      updated = data;
    } else {
      const index = memoryProducts.findIndex(p => p.id === Number(id));
      if (index !== -1) {
        memoryProducts[index] = {
          ...memoryProducts[index],
          ...dataToUpdate,
          updated_at: new Date().toISOString()
        };
        updated = memoryProducts[index];
      }
    }

    if (updated && payload.sort_order !== undefined) {
      await adjustSequenceOnUpdate('products', memoryProducts, id, payload.sort_order);
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
        .from('products')
        .delete()
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        deleted = data;
      }
    } else {
      const index = memoryProducts.findIndex(p => p.id === Number(id));
      if (index !== -1) {
        deleted = memoryProducts.splice(index, 1)[0];
      }
    }

    if (deleted) {
      if (deleted.image) await deleteFileFromStorage(deleted.image);
      if (deleted.brochure) await deleteFileFromStorage(deleted.brochure);
    }

    await adjustSequenceOnDelete('products', memoryProducts);
    return deleted;
  }

  static async reorder(orderedIds) {
    await batchReorder('products', memoryProducts, orderedIds);
    return await this.findAll();
  }
}

module.exports = Product;
