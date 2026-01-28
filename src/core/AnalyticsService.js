// src/core/analyticsService.js

const supabase = require("../config/supabaseClient");

async function getDecisionSummary(userId) {
  const { data, error } = await supabase
    .from("decision_history")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  const total = data.length || 0;

  const count = (a) => data.filter(d => d.action === a).length;

  return {
    total,
    scale: count("SCALE"),
    run: count("RUN"),
    pause: count("PAUSE"),
    kill: count("KILL"),
    avgConfidence:
      total === 0 ? 0 :
      Number((data.reduce((s, d) => s + d.confidence, 0) / total).toFixed(2)),
    avgRisk:
      total === 0 ? 0 :
      Number((data.reduce((s, d) => s + d.risk, 0) / total).toFixed(2))
  };
}

module.exports = { getDecisionSummary };
