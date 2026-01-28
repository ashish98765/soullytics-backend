const { engineResult } = require("../core/engineResult");

module.exports = function adsCode36(context = {}) {
  const history = Array.isArray(context.decisionHistory)
    ? context.decisionHistory
    : [];

  if (history.length < 3) {
    return engineResult({
      engine: "AdsCode36_DecisionStability",
      status: "WARNING",
      score: 0.7,
      message: "Insufficient history for stability check."
    });
  }

  const recent = history.slice(-5).map(d => d.finalDecision);
  const unique = new Set(recent);

  if (unique.size >= 3) {
    return engineResult({
      engine: "AdsCode36_DecisionStability",
      status: "FAIL",
      score: 1,
      message: "Decision volatility detected."
    });
  }

  if (unique.size === 2) {
    return engineResult({
      engine: "AdsCode36_DecisionStability",
      status: "WARNING",
      score: 0.6,
      message: "Minor oscillation observed."
    });
  }

  return engineResult({
    engine: "AdsCode36_DecisionStability",
    status: "PASS",
    score: 0.3,
    message: "Decisions stable."
  });
};
