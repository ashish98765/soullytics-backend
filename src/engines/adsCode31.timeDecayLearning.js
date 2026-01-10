// src/engines/adsCode31.timeDecayLearning.js

const { engineResult } = require("../core/engineResult");

class TimeDecayLearningEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const history = Array.isArray(this.context.historicalDecisions)
      ? this.context.historicalDecisions
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

    history.forEach(decision => {
      if (decision.final_decision !== "DO_NOT_RUN") return;

      const decisionTime = new Date(decision.created_at).getTime();
      const daysAgo = (now - decisionTime) / (1000 * 60 * 60 * 24);

      let weight = 1;
      if (daysAgo > 90) weight = 0.3;
      else if (daysAgo > 30) weight = 0.6;

      weightedFailures += weight;
    });

    if (weightedFailures >= 2) {
      return engineResult({
        engine: "AdsCode31_TimeDecayLearning",
        status: "FAIL",
        score: 1,
        authority: 4,
        message:
          "Recent historical failures carry strong weight. Ads should not proceed."
      });
    }

    if (weightedFailures > 0) {
      return engineResult({
        engine: "AdsCode31_TimeDecayLearning",
        status: "WARNING",
        score: 0.6,
        authority: 3,
        message:
          "Past failures detected but older ones are decaying in influence."
      });
    }

    return engineResult({
      engine: "AdsCode31_TimeDecayLearning",
      status: "PASS",
      score: 0.3,
      authority: 2,
      message: "Historical failures have decayed. Safe to proceed."
    });
  }
}

module.exports = { TimeDecayLearningEngine };
