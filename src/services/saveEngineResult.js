const supabase = require("../lib/supabaseClient");

async function saveEngineResults(decisionId, engines = []) {
  if (!engines.length) return;

  const rows = engines.map(e => ({
    decision_id: decisionId,
    engine_name: e.name,
    group_name: e.group,
    severity: e.severity,
    score: e.score,
    message: e.message
  }));

  const { error } = await supabase
    .from("engine_results")
    .insert(rows);

  if (error) throw error;
}

module.exports = saveEngineResults;
