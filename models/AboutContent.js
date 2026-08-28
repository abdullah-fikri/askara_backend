const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { initialAboutContent } = require('./initialData');
const { isTableAvailable } = require('../utils/autoMigrate');

let memoryAboutContent = { ...initialAboutContent };

class AboutContent {
  static async get(key = 'main') {
    if (isSupabaseConfigured() && isTableAvailable('about_content')) {
      try {
        const { data, error } = await supabase
          .from('about_content')
          .select('*')
          .eq('key', key)
          .single();

        if (!error && data) {
          return {
            ...data,
            who_we_are_points_en: typeof data.who_we_are_points_en === 'string' ? JSON.parse(data.who_we_are_points_en) : (data.who_we_are_points_en || []),
            who_we_are_points_id: typeof data.who_we_are_points_id === 'string' ? JSON.parse(data.who_we_are_points_id) : (data.who_we_are_points_id || []),
            who_we_are_images: typeof data.who_we_are_images === 'string' ? JSON.parse(data.who_we_are_images) : (data.who_we_are_images || []),
            why_choose_reasons: typeof data.why_choose_reasons === 'string' ? JSON.parse(data.why_choose_reasons) : (data.why_choose_reasons || [])
          };
        }
      } catch (err) {
        // fallback to memory
      }
    }

    return memoryAboutContent;
  }

  static async update(payload, key = 'main') {
    const dataToSave = {
      hero_badge_en: payload.hero_badge_en ?? memoryAboutContent.hero_badge_en ?? '',
      hero_badge_id: payload.hero_badge_id ?? memoryAboutContent.hero_badge_id ?? '',
      hero_title_en: payload.hero_title_en ?? memoryAboutContent.hero_title_en ?? '',
      hero_title_id: payload.hero_title_id ?? memoryAboutContent.hero_title_id ?? '',
      hero_subtitle_en: payload.hero_subtitle_en ?? memoryAboutContent.hero_subtitle_en ?? '',
      hero_subtitle_id: payload.hero_subtitle_id ?? memoryAboutContent.hero_subtitle_id ?? '',

      who_we_are_tag_en: payload.who_we_are_tag_en ?? memoryAboutContent.who_we_are_tag_en ?? '',
      who_we_are_tag_id: payload.who_we_are_tag_id ?? memoryAboutContent.who_we_are_tag_id ?? '',
      who_we_are_heading_en: payload.who_we_are_heading_en ?? memoryAboutContent.who_we_are_heading_en ?? '',
      who_we_are_heading_id: payload.who_we_are_heading_id ?? memoryAboutContent.who_we_are_heading_id ?? '',
      who_we_are_p1_en: payload.who_we_are_p1_en ?? memoryAboutContent.who_we_are_p1_en ?? '',
      who_we_are_p1_id: payload.who_we_are_p1_id ?? memoryAboutContent.who_we_are_p1_id ?? '',
      who_we_are_p2_en: payload.who_we_are_p2_en ?? memoryAboutContent.who_we_are_p2_en ?? '',
      who_we_are_p2_id: payload.who_we_are_p2_id ?? memoryAboutContent.who_we_are_p2_id ?? '',
      who_we_are_points_en: payload.who_we_are_points_en ?? memoryAboutContent.who_we_are_points_en ?? [],
      who_we_are_points_id: payload.who_we_are_points_id ?? memoryAboutContent.who_we_are_points_id ?? [],
      who_we_are_images: payload.who_we_are_images ?? memoryAboutContent.who_we_are_images ?? [],

      why_choose_badge_en: payload.why_choose_badge_en ?? memoryAboutContent.why_choose_badge_en ?? '',
      why_choose_badge_id: payload.why_choose_badge_id ?? memoryAboutContent.why_choose_badge_id ?? '',
      why_choose_heading_en: payload.why_choose_heading_en ?? memoryAboutContent.why_choose_heading_en ?? '',
      why_choose_heading_id: payload.why_choose_heading_id ?? memoryAboutContent.why_choose_heading_id ?? '',
      why_choose_reasons: payload.why_choose_reasons ?? memoryAboutContent.why_choose_reasons ?? []
    };

    if (isSupabaseConfigured()) {
      try {
        const { data: existing } = await supabase
          .from('about_content')
          .select('id')
          .eq('key', key)
          .single();

        if (existing) {
          const { data, error } = await supabase
            .from('about_content')
            .update({ ...dataToSave, updated_at: new Date().toISOString() })
            .eq('key', key)
            .select()
            .single();

          if (!error && data) {
            memoryAboutContent = {
              ...data,
              who_we_are_points_en: typeof data.who_we_are_points_en === 'string' ? JSON.parse(data.who_we_are_points_en) : (data.who_we_are_points_en || []),
              who_we_are_points_id: typeof data.who_we_are_points_id === 'string' ? JSON.parse(data.who_we_are_points_id) : (data.who_we_are_points_id || []),
              who_we_are_images: typeof data.who_we_are_images === 'string' ? JSON.parse(data.who_we_are_images) : (data.who_we_are_images || []),
              why_choose_reasons: typeof data.why_choose_reasons === 'string' ? JSON.parse(data.why_choose_reasons) : (data.why_choose_reasons || [])
            };
            return memoryAboutContent;
          }
          if (error) {
            console.warn('[AboutContent.update] Supabase notice (using memory fallback):', error.message);
          }
        } else {
          const { data, error } = await supabase
            .from('about_content')
            .insert([{ key, ...dataToSave }])
            .select()
            .single();

          if (!error && data) {
            memoryAboutContent = {
              ...data,
              who_we_are_points_en: typeof data.who_we_are_points_en === 'string' ? JSON.parse(data.who_we_are_points_en) : (data.who_we_are_points_en || []),
              who_we_are_points_id: typeof data.who_we_are_points_id === 'string' ? JSON.parse(data.who_we_are_points_id) : (data.who_we_are_points_id || []),
              who_we_are_images: typeof data.who_we_are_images === 'string' ? JSON.parse(data.who_we_are_images) : (data.who_we_are_images || []),
              why_choose_reasons: typeof data.why_choose_reasons === 'string' ? JSON.parse(data.why_choose_reasons) : (data.why_choose_reasons || [])
            };
            return memoryAboutContent;
          }
          if (error) {
            console.warn('[AboutContent.update] Supabase notice (using memory fallback):', error.message);
          }
        }
      } catch (err) {
        console.warn('[AboutContent.update] Supabase upsert failed, fallback to memory:', err.message);
      }
    }

    memoryAboutContent = {
      ...memoryAboutContent,
      ...dataToSave,
      updated_at: new Date().toISOString()
    };
    return memoryAboutContent;
  }
}

module.exports = AboutContent;
