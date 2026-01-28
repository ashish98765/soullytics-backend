function buildExplanation(decision, trace = []) {
  const engines = trace.engines || [];

  const positives = [];
  const warnings = [];

  engines.forEach(e => {
    if (e.status === "PASS" && e.message) positives.push(e.message);
    if (e.status === "FAIL" || e.status === "WARNING") {
      if (e.message) warnings.push(e.message);
    }
  });

  let primary_reason = "Decision based on overall performance signals";

  if (decision.action === "SCALE")
    primary_reason = "Strong performance signals detected";
  if (decision.action === "PAUSE")
    primary_reason = "Performance instability detected";
  if (decision.action === "KILL")
    primary_reason = "High risk and poor performance";
  if (decision.action === "RUN")
    primary_reason = "Campaign is stable";

  return {
    primary_reason,
    supporting_factors: positives.slice(0, 3),
    warning: warnings[0] || null,
    next_best_action: getNextAction(decision.action)
  };
}

function getNextAction(action) {
  if (action === "SCALE") return "Increase budget by 10–20%";
  if (action === "PAUSE") return "Fix creatives or targeting";
  if (action === "KILL") return "Stop campaign immediately";
  return "Continue monitoring";
}

module.exports = { buildExplanation };
