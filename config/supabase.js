const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";

let supabase = null;

if (supabaseUrl && supabaseKey) {
    try {
        supabase = createClient(supabaseUrl, supabaseKey, {
            auth: { persistSession: false },
        });
        console.log("[Database] Connected to Supabase at:", supabaseUrl);
    } catch (err) {
        console.warn(
            "[Database] Failed to initialize Supabase client:",
            err.message,
        );
    }
} else {
    console.log(
        "[Database] SUPABASE_URL / SUPABASE_KEY not provided. Operating in Memory/Local Mode with initial seed data.",
    );
}

module.exports = {
    supabase,
    isSupabaseConfigured: () => Boolean(supabase),
};
