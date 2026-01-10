// src/engines/adsCode34.decisionEvolution.js

const { engineResult } = require("../core/engineResult");

class DecisionEvolutionEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const history = this.context.decisionHistory || [];

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

    // 🚨 Decision oscillation = instability
    if (unique.size > 1) {
      return engineResult({
        engine: "AdsCode34_DecisionEvolution",
        status: "WARNING",
        score: 0.7,
        message:
          "Decision instability detected across recent runs. Strategy not converging."
      });
    }

    return engineResult({
      engine: "AdsCode34_DecisionEvolution",
      status: "PASS",
      score: 0.3,
      message: "Decision trend is stable and converging."
    });
  }
}

module.exports = { DecisionEvolutionEngine };
