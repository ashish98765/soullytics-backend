const supabase = require("../config/supabaseClient");

/**
 * Updates engine scores based on outcome
 * WIN  -> +10
 * LOSS -> -15
 */

async function updateEngineScores(engines = [], resultStatus) {
  for (const engine of engines) {
    const { data } = await supabase
      .from("engine_scores")
      .select("*")
      .eq("engine_name", engine)
      .single();

    let score = data?.score ?? 0;
    let wins = data?.success_count ?? 0;
    let fails = data?.fail_count ?? 0;

    if (resultStatus === "WIN") {
      score += 10;
      wins += 1;
    }

    if (resultStatus === "LOSS") {
      score -= 15;
      fails += 1;
    }

    await supabase.from("engine_scores").upsert({
      engine_name: engine,
      score,
      success_count: wins,
      fail_count: fails,
      last_updated: new Date().toISOString()
    });
  }
}

module.exports = { updateEngineScores };
