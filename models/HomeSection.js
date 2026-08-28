const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { initialHomeSections } = require('./initialData');
const { isTableAvailable } = require('../utils/autoMigrate');

let memoryHomeSections = [...initialHomeSections];

class HomeSection {
  static async getSection(sectionKey = 'who_we_are') {
    if (isSupabaseConfigured() && isTableAvailable('home_sections')) {
      try {
        const { data, error } = await supabase
          .from('home_sections')
          .select('*')
          .eq('section_key', sectionKey)
          .single();

        if (!error && data) return data;
      } catch (err) {
        // fallback
      }
    }

    const found = memoryHomeSections.find(s => s.section_key === sectionKey);
    return found || null;
  }

  static async updateSection(sectionKey = 'who_we_are', payload) {
    const dataToSave = {
      tag_en: payload.tag_en || '',
      tag_id: payload.tag_id || '',
      title_en: payload.title_en || '',
      title_id: payload.title_id || '',
      description_en: payload.description_en || '',
      description_id: payload.description_id || '',
      button_text_en: payload.button_text_en || 'Learn More',
      button_text_id: payload.button_text_id || 'Pelajari Selengkapnya',
      button_url: payload.button_url || '/about'
    };

    if (isSupabaseConfigured()) {
      try {
        const { data: existing } = await supabase
          .from('home_sections')
          .select('id')
          .eq('section_key', sectionKey)
          .single();

        if (existing) {
          const { data, error } = await supabase
            .from('home_sections')
            .update({ ...dataToSave, updated_at: new Date().toISOString() })
            .eq('section_key', sectionKey)
            .select()
            .single();
          if (!error && data) return data;
          if (error) {
            console.warn('[HomeSection.updateSection] Supabase notice (using memory fallback):', error.message);
          }
        } else {
          const { data, error } = await supabase
            .from('home_sections')
            .insert([{ section_key: sectionKey, ...dataToSave }])
            .select()
            .single();
          if (!error && data) return data;
          if (error) {
            console.warn('[HomeSection.updateSection] Supabase notice (using memory fallback):', error.message);
          }
        }
      } catch (err) {
        console.warn('[HomeSection.updateSection] Supabase upsert failed, fallback to memory:', err.message);
      }
    }

    const index = memoryHomeSections.findIndex(s => s.section_key === sectionKey);
    if (index === -1) {
      const newSec = {
        id: memoryHomeSections.length + 1,
        section_key: sectionKey,
        ...dataToSave,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      memoryHomeSections.push(newSec);
      return newSec;
    }

    memoryHomeSections[index] = {
      ...memoryHomeSections[index],
      ...dataToSave,
      updated_at: new Date().toISOString()
    };
    return memoryHomeSections[index];
  }
}

module.exports = HomeSection;
