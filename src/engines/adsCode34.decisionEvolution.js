const { engineResult } = require("../core/engineResult");

module.exports = function adsCode34(context = {}) {
  const history = context.decisionHistory || [];

  if (history.length < 3) {
    return engineResult({
      engine: "AdsCode34_DecisionEvolution",
      status: "PASS",
      score: 0.3,
      message: "Insufficient history for evolution analysis."
    });
  }

  const lastThree = history.slice(-3).map(d => d.finalDecision);
  const unique = new Set(lastThree);

  if (unique.size > 1) {
    return engineResult({
      engine: "AdsCode34_DecisionEvolution",
      status: "WARNING",
      score: 0.7,
      message: "Decision instability detected."
    });
  }

  return engineResult({
    engine: "AdsCode34_DecisionEvolution",
    status: "PASS",
    score: 0.3,
    message: "Decision trend stable."
  });
};
