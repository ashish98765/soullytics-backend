const supabase = require("../config/supabaseClient");

async function saveDecision(userId, decision, meta) {
  await supabase.from("decisions").insert({
    user_id: userId,
    action: decision.action,
    score: decision.score,
    risk: decision.risk,
    confidence: decision.confidence,
    final_status: decision.finalStatus,
    fail_count: meta.failCount,
    total_engines: meta.total
  });
}

async function updateEngineStats(results) {
  for (const r of results) {
    if (!r.engine) continue;

    if (r.status === "FAIL" || r.status === "WARNING") {
      await supabase.rpc("increment_engine_stat", {
        engine_name: r.engine,
        is_fail: r.status === "FAIL"
      });
    }
  }
}

async function detectPatterns(userId, decision) {
  if (decision.action === "PAUSE") {
    await supabase.from("decision_patterns").insert({
      user_id: userId,
      pattern: "REPEATED_PAUSE"
    });
  }
}

module.exports = {
  saveDecision,
  updateEngineStats,
  detectPatterns
};
