// src/core/engineStatsStore.js
const supabase = require("../config/supabaseClient");

async function recordEngineStats(results = []) {
  for (const r of results) {
    if (!r.engine) continue;

    await supabase.from("engine_stats").insert({
      engine: r.engine,
      status: r.status,
      confidence: r.confidence ?? 0,
      created_at: new Date().toISOString()
    });
  }
}

module.exports = { recordEngineStats };
