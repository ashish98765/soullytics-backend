// src/core/learningRepository.js

const supabase = require("../config/supabaseClient");

/**
 * Fetch last N decisions for a user (latest first).
 * Never throws — learning must NOT block decisions.
 */
async function fetchHistory(userId, limit = 20) {
  try {
    const { data, error } = await supabase
      .from("decisions")
      .select("action, confidence, risk, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

module.exports = { fetchHistory };
