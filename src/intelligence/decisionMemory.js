const supabase = require("../config/supabaseClient");

async function saveDecision({ userId, platform, result, metrics }) {
  await supabase.from("decisions").insert({
    user_id: userId,
    platform,
    confidence: result.confidence,
    risk: result.risk,
    reasons: result.reasons,
    trace: {
      metrics,
      pattern: result.pattern
    }
  });
}

module.exports = { saveDecision };
