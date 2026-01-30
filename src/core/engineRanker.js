const supabase = require("../config/supabaseClient");

/**
 * Returns engines sorted by performance score
 * High score engines run first
 */

async function rankEngines(engines = []) {
  const { data } = await supabase
    .from("engine_scores")
    .select("*");

  const scoreMap = {};
  if (data) {
    for (const row of data) {
      scoreMap[row.engine_name] = row.score;
    }
  }

  return engines.sort((a, b) => {
    const aScore = scoreMap[a.name] ?? 0;
    const bScore = scoreMap[b.name] ?? 0;
    return bScore - aScore;
  });
}

module.exports = rankEngines;
