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

  const badgeEn = payload.badge_en !== undefined ? payload.badge_en : payload.tag_en;
  if (badgeEn !== undefined) mapped.badge_en = badgeEn;

  const badgeId = payload.badge_id !== undefined ? payload.badge_id : payload.tag_id;
  if (badgeId !== undefined) mapped.badge_id = badgeId;

  const subtitleEn = payload.subtitle_en !== undefined ? payload.subtitle_en : payload.description_en;
  if (subtitleEn !== undefined) mapped.subtitle_en = subtitleEn;

  const subtitleId = payload.subtitle_id !== undefined ? payload.subtitle_id : payload.description_id;
  if (subtitleId !== undefined) mapped.subtitle_id = subtitleId;

  const ctaTextEn = payload.cta_text_en !== undefined ? payload.cta_text_en : payload.button_text_en;
  if (ctaTextEn !== undefined) mapped.cta_text_en = ctaTextEn;

  const ctaTextId = payload.cta_text_id !== undefined ? payload.cta_text_id : payload.button_text_id;
  if (ctaTextId !== undefined) mapped.cta_text_id = ctaTextId;

  const ctaLink = payload.cta_link !== undefined ? payload.cta_link : payload.button_url;
  if (ctaLink !== undefined) mapped.cta_link = ctaLink;

  return mapped;
}

let memoryHomeSections = initialHomeSections.map(formatSection);

class HomeSection {
  static async getSection(sectionKey = 'who_we_are') {
    if (isSupabaseConfigured() && isTableAvailable('home_sections')) {
      try {
        const { data, error } = await supabase
          .from('home_sections')
          .select('*')
          .or(`id.eq.${sectionKey},section_key.eq.${sectionKey}`)
          .maybeSingle();

        if (!error && data) return formatSection(data);
      } catch (err) {
        // fallback
      }
    }

    const found = memoryHomeSections.find(s => s.section_key === sectionKey || s.id === sectionKey);
    return formatSection(found) || null;
  }

  static async updateSection(sectionKey = 'who_we_are', payload) {
    const dataToSave = toSupabasePayload(payload);

    if (isSupabaseConfigured()) {
      try {
        const { data: existing } = await supabase
          .from('home_sections')
          .select('id')
          .or(`id.eq.${sectionKey},section_key.eq.${sectionKey}`)
          .maybeSingle();

        if (existing) {
          const { data, error } = await supabase
            .from('home_sections')
            .update({ ...dataToSave, updated_at: new Date().toISOString() })
            .eq('id', existing.id)
            .select()
            .single();
          if (!error && data) return formatSection(data);
          if (error) {
            console.warn('[HomeSection.updateSection] Supabase notice (using memory fallback):', error.message);
          }
        } else {
          const { data, error } = await supabase
            .from('home_sections')
            .insert([{ id: sectionKey, section_key: sectionKey, ...dataToSave }])
            .select()
            .single();
          if (!error && data) return formatSection(data);
          if (error) {
            console.warn('[HomeSection.updateSection] Supabase notice (using memory fallback):', error.message);
          }
        }
      } catch (err) {
        console.warn('[HomeSection.updateSection] Supabase upsert failed, fallback to memory:', err.message);
      }
    }

    const index = memoryHomeSections.findIndex(s => s.section_key === sectionKey || s.id === sectionKey);
    if (index === -1) {
      const newSec = formatSection({
        id: sectionKey,
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
