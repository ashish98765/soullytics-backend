const supabase = require("../config/supabaseClient");

/**
 * Learning system:
 * SUCCESS  → engine rewarded
 * FAIL     → engine punished
 */
async function updateEngineScores(engines = [], resultStatus) {
  if (!engines.length) return;

  for (const engine of engines) {
    const engineName =
      typeof engine === "string" ? engine : engine.name;

    // Fetch existing row
    const { data: existing } = await supabase
      .from("engine_scores")
      .select("*")
      .eq("engine_name", engineName)
      .single();

    let score = existing?.score || 0;
    let success = existing?.success_count || 0;
    let fail = existing?.fail_count || 0;

    // Learning logic
    if (resultStatus === "SUCCESS") {
      score += 1;
      success += 1;
    } else if (resultStatus === "FAIL") {
      score -= 1;
      fail += 1;
    }

    await supabase.from("engine_scores").upsert({
      engine_name: engineName,
      score,
      success_count: success,
      fail_count: fail,
      last_updated: new Date().toISOString()
    });
  }
}

module.exports = { updateEngineScores };
