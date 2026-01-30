const supabase = require("../config/supabaseClient");
const outcomeImpact = require("./outcomeImpact");

/**
 * Learns from outcome magnitude, not just win/loss
 */
async function updateEngineScores(engines = [], resultStatus, outcomeMetrics = {}) {
  const impact = outcomeImpact(outcomeMetrics);

  for (const engine of engines) {
    const engineName = typeof engine === "string" ? engine : engine.name;

    const { data } = await supabase
      .from("engine_scores")
      .select("*")
      .eq("engine_name", engineName)
      .single();

    let total = data?.total_runs || 0;
    let wins = data?.wins || 0;
    let losses = data?.losses || 0;
    let avgImpact = data?.avg_impact || 0;
    let confidenceBias = data?.confidence_bias || 0;

    total += 1;
    if (resultStatus === "SUCCESS") wins += 1;
    if (resultStatus === "FAIL") losses += 1;

    // moving average for impact
    avgImpact = (avgImpact * (total - 1) + impact) / total;

    // confidence bias learning
    if (impact < -0.3) confidenceBias -= 0.05;
    if (impact > 0.3) confidenceBias += 0.05;

    // cold start safety
    let accuracy = total < 5 ? 0.5 : wins / total;

    await supabase.from("engine_scores").upsert({
      engine_name: engineName,
      total_runs: total,
      wins,
      losses,
      accuracy,
      avg_impact: Number(avgImpact.toFixed(3)),
      confidence_bias: Number(confidenceBias.toFixed(3)),
      last_used: new Date().toISOString()
    });
  }
}

module.exports = { updateEngineScores };
