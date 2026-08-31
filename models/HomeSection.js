const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { initialHomeSections } = require('./initialData');
const { isTableAvailable } = require('../utils/autoMigrate');

function formatSection(section) {
  if (!section) return null;
  const tagEn = section.tag_en || section.badge_en || 'WHO WE ARE';
  const tagId = section.tag_id || section.badge_id || 'TENTANG KAMI';
  const descEn = section.description_en || section.subtitle_en || '';
  const descId = section.description_id || section.subtitle_id || '';
  const btnTextEn = section.button_text_en || section.cta_text_en || 'Learn More';
  const btnTextId = section.button_text_id || section.cta_text_id || 'Pelajari Selengkapnya';
  const btnUrl = section.button_url || section.cta_link || '/about';

  return {
    ...section,
    tag_en: tagEn,
    tag_id: tagId,
    badge_en: tagEn,
    badge_id: tagId,
    description_en: descEn,
    description_id: descId,
    subtitle_en: descEn,
    subtitle_id: descId,
    button_text_en: btnTextEn,
    button_text_id: btnTextId,
    cta_text_en: btnTextEn,
    cta_text_id: btnTextId,
    button_url: btnUrl,
    cta_link: btnUrl,
  };
}

function toSupabasePayload(payload) {
  const mapped = {};
  if (payload.title_en !== undefined) mapped.title_en = payload.title_en;
  if (payload.title_id !== undefined) mapped.title_id = payload.title_id;

  const tagEn = payload.tag_en !== undefined ? payload.tag_en : payload.badge_en;
  if (tagEn !== undefined) {
    mapped.tag_en = tagEn;
    mapped.badge_en = tagEn;
  }

  const tagId = payload.tag_id !== undefined ? payload.tag_id : payload.badge_id;
  if (tagId !== undefined) {
    mapped.tag_id = tagId;
    mapped.badge_id = tagId;
  }

  const descEn = payload.description_en !== undefined ? payload.description_en : payload.subtitle_en;
  if (descEn !== undefined) {
    mapped.description_en = descEn;
    mapped.subtitle_en = descEn;
  }

  const descId = payload.description_id !== undefined ? payload.description_id : payload.subtitle_id;
  if (descId !== undefined) {
    mapped.description_id = descId;
    mapped.subtitle_id = descId;
  }

  const btnTextEn = payload.button_text_en !== undefined ? payload.button_text_en : payload.cta_text_en;
  if (btnTextEn !== undefined) {
    mapped.button_text_en = btnTextEn;
    mapped.cta_text_en = btnTextEn;
  }

  const btnTextId = payload.button_text_id !== undefined ? payload.button_text_id : payload.cta_text_id;
  if (btnTextId !== undefined) {
    mapped.button_text_id = btnTextId;
    mapped.cta_text_id = btnTextId;
  }

  const btnUrl = payload.button_url !== undefined ? payload.button_url : payload.cta_link;
  if (btnUrl !== undefined) {
    mapped.button_url = btnUrl;
    mapped.cta_link = btnUrl;
  }

  return mapped;
}

let memoryHomeSections = [];

class HomeSection {
  static async getSection(sectionKey = 'who_we_are') {
    if (isSupabaseConfigured() && isTableAvailable('home_sections')) {
      try {
        const { data, error } = await supabase
          .from('home_sections')
          .select('*')
          .eq('section_key', sectionKey)
          .maybeSingle();

        if (!error && data) return formatSection(data);
      } catch (err) {
        // fallback
      }
    }

    const found = memoryHomeSections.find(s => s.section_key === sectionKey || String(s.id) === String(sectionKey));
    return formatSection(found) || null;
  }

  static async updateSection(sectionKey = 'who_we_are', payload) {
    const dataToSave = toSupabasePayload(payload);

    if (isSupabaseConfigured() && isTableAvailable('home_sections')) {
      try {
        const { data: existing } = await supabase
          .from('home_sections')
          .select('id')
          .eq('section_key', sectionKey)
          .maybeSingle();

        if (existing && existing.id) {
          const { data, error } = await supabase
            .from('home_sections')
            .update({ ...dataToSave, updated_at: new Date().toISOString() })
            .eq('id', existing.id)
            .select()
            .single();
          if (!error && data) return formatSection(data);
          if (error) {
            console.warn('[HomeSection.updateSection] Supabase update error:', error.message);
          }
        } else {
          const { data, error } = await supabase
            .from('home_sections')
            .insert([{ section_key: sectionKey, ...dataToSave, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
            .select()
            .single();
          if (!error && data) return formatSection(data);
          if (error) {
            console.warn('[HomeSection.updateSection] Supabase insert error:', error.message);
          }
        }
      } catch (err) {
        console.warn('[HomeSection.updateSection] Supabase upsert failed, fallback to memory:', err.message);
      }
    }

    const index = memoryHomeSections.findIndex(s => s.section_key === sectionKey || String(s.id) === String(sectionKey));
    if (index === -1) {
      const newSec = formatSection({
        id: memoryHomeSections.length ? Math.max(...memoryHomeSections.map(s => Number(s.id) || 0)) + 1 : 1,
        section_key: sectionKey,
        ...dataToSave,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      memoryHomeSections.push(newSec);
      return newSec;
    }

    memoryHomeSections[index] = formatSection({
      ...memoryHomeSections[index],
      ...dataToSave,
      updated_at: new Date().toISOString()
    });
    return memoryHomeSections[index];
  }
}

module.exports = HomeSection;
