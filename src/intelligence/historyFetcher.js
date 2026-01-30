const supabase = require("../config/supabaseClient");

async function getLastDecision(userId, platform) {
  const { data } = await supabase
    .from("decisions")
    .select("*")
    .eq("user_id", userId)
    .eq("platform", platform)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return data || null;
}

module.exports = { getLastDecision };
