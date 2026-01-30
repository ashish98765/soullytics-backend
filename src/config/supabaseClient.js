const { createClient } = require("@supabase/supabase-js");

/**
 * Supabase server-side client
 * Uses SERVICE ROLE KEY (never expose to frontend)
 */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase env variables missing");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
});

module.exports = supabase;
