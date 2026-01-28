const supabase = require("../config/supabaseClient");

/**
 * Save every decision (user-level analytics)
 */
async function saveDecision(userId, decision, meta = {}) {
  if (!userId) return;

  await supabase.from("decisions").insert([
    {
      user_id: userId,
      action: decision.action,
      score: decision.score,
      risk: decision.risk,
      confidence: decision.confidence,
      final_status: decision.finalStatus,
      fail_count: meta.failCount || 0,
      engine_count: meta.total || 0,
      created_at: new Date().toISOString()
    }
  ]);
}

/**
 * Engine learning stats (global learning)
 */
async function updateEngineStats(results = []) {
  for (const r of results) {
    if (!r.engine) continue;

    await supabase.rpc("update_engine_stats", {
      engine_name: r.engine,
      status: r.status,
      confidence: r.confidence || 0
    });
  }
}

/**
 * Pattern detection (simple v1 – safe)
 */
async function detectPatterns(userId, data) {
  if (!userId) return;

  await supabase.from("decision_patterns").insert([
    {
      user_id: userId,
      action: data.action,
      created_at: new Date().toISOString()
    }
  ]);
}

module.exports = {
  saveDecision,
  updateEngineStats,
  detectPatterns
};
