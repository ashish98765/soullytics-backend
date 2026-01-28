const { engineResult } = require("../core/engineResult");

module.exports = function adsCode31(context = {}) {
  const history = Array.isArray(context.historicalDecisions)
    ? context.historicalDecisions
    : [];

  if (history.length === 0) {
    return engineResult({
      engine: "AdsCode31_TimeDecayLearning",
      status: "PASS",
      score: 0.2,
      authority: 2,
      message: "No historical data. No decay learning applied."
    });
  }

  const now = Date.now();
  let weightedFailures = 0;

  history.forEach(d => {
    if (d.finalDecision === "DO_NOT_RUN") return;
    const daysAgo = (now - new Date(d.created_at).getTime()) / (1000 * 60 * 60 * 24);
    let weight = 1;
    if (daysAgo > 90) weight = 0.3;
    else if (daysAgo > 30) weight = 0.6;
    weightedFailures += weight;
  });

  if (weightedFailures >= 2) {
    return engineResult({
      engine: "AdsCode31_TimeDecayLearning",
      status: "FAIL",
      authority: 4,
      score: 1,
      message: "Recent historical failures still carry weight."
    });
  }

  if (weightedFailures > 0) {
    return engineResult({
      engine: "AdsCode31_TimeDecayLearning",
      status: "WARNING",
      authority: 3,
      score: 0.6,
      message: "Past failures decaying in influence."
    });
  }

  return engineResult({
    engine: "AdsCode31_TimeDecayLearning",
    status: "PASS",
    authority: 2,
    score: 0.3,
    message: "Historical failures fully decayed."
  });
};
