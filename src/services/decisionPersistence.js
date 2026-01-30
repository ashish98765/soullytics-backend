const supabase = require("../config/supabaseClient");

/**
 * Persist decision result to Supabase
 */
async function saveDecision({
  userId,
  platform,
  decision,
  rawInput,
}) {
  const { error } = await supabase
    .from("decisions")
    .insert({
      user_id: userId,
      platform,
      action: decision.action,
      confidence: decision.confidence,
      risk: decision.risk,
      reasons: decision.reasons || [],
      trace: decision.trace || [],
      raw_input: rawInput,
    });

  if (error) {
    console.error("SUPABASE_INSERT_FAILED:", error);
    throw new Error("Failed to persist decision");
  }
}

module.exports = { saveDecision };
