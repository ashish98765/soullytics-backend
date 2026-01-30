const supabase = require("../config/supabaseClient");

async function updateEngineScores(engines = [], resultStatus) {
  for (const engine of engines) {
    const { data } = await supabase
      .from("engine_scores")
      .select("*")
      .eq("engine_name", engine)
      .single();

    let total = 1;
    let wins = 0;
    let losses = 0;

    if (data) {
      total = data.total_runs + 1;
      wins = data.wins;
      losses = data.losses;
    }

    if (resultStatus === "WIN") wins++;
    if (resultStatus === "LOSS") losses++;

    let accuracy = wins / total;
    if (total < 5) accuracy = 0.5; // ❄️ cold start protection

    await supabase.from("engine_scores").upsert({
      engine_name: engine,
      total_runs: total,
      wins,
      losses,
      accuracy,
      last_used: new Date().toISOString()
    });
  }
}

module.exports = { updateEngineScores };
