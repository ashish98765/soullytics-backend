const supabase = require("../config/supabaseClient");

async function updateEngineScores(engines = [], resultStatus) {
  for (const e of engines) {
    const { data, error } = await supabase
      .from("engine_scores")
      .select("*")
      .eq("engine_name", e.engine)
      .single();

    let total = 1, wins = 0, losses = 0;

    if (data) {
      total = data.total_runs + 1;
      wins = data.wins;
      losses = data.losses;
    }

    if (resultStatus === "WIN") wins++;
    if (resultStatus === "LOSS") losses++;

    const accuracy = wins / total;

    await supabase.from("engine_scores").upsert({
      engine_name: e.engine,
      total_runs: total,
      wins,
      losses,
      accuracy
    });
  }
}

module.exports = { updateEngineScores };
