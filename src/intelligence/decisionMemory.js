const supabase = require("../config/supabaseClient");

async function saveDecision({
  userId,
  platform,
  confidence,
  risk,
  explanation,
  metrics,
  pattern
}) {
  await supabase.from("decisions").insert({
    user_id: userId,
    platform,
    confidence,
    risk,
    reasons: explanation,
    trace: {
      metrics,
      pattern
    }
  });
}

module.exports = { saveDecision };
