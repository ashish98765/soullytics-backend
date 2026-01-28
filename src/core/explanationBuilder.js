function buildExplanation(decision, engineResults = []) {
  const passed = [];
  const warnings = [];
  const failed = [];

  engineResults.forEach(e => {
    if (e.status === "PASS") passed.push(e.message || e.engine);
    if (e.status === "WARNING") warnings.push(e.message || e.engine);
    if (e.status === "FAIL") failed.push(e.message || e.engine);
  });

  let primary = "Decision based on overall performance signals";

  if (decision.action === "SCALE")
    primary = "Strong performance signals detected";
  if (decision.action === "PAUSE")
    primary = "Performance instability detected";
  if (decision.action === "KILL")
    primary = "High risk and poor performance detected";
  if (decision.action === "RUN")
    primary = "Campaign is stable";

  return {
    primary,
    secondary: passed.slice(0, 3),
    warning: warnings[0] || (failed[0] || null),
    next_action: nextAction(decision.action)
  };
}

function nextAction(action) {
  if (action === "SCALE") return "Increase budget by 10–20%";
  if (action === "PAUSE") return "Fix creatives or targeting";
  if (action === "KILL") return "Stop campaign immediately";
  return "Continue monitoring";
}

module.exports = { buildExplanation };
