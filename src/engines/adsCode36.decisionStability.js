// src/engines/adsCode36.decisionStability.js

const { engineResult } = require("../core/engineResult");

class DecisionStabilityEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const decisionHistory = Array.isArray(this.context.decisionHistory)
      ? this.context.decisionHistory
      : [];

    if (decisionHistory.length < 3) {
      return engineResult({
        engine: "AdsCode36_DecisionStability",
        status: "WARNING",
        score: 0.7,
        message: "Insufficient decision history to assess stability."
      });
    }

    const lastDecisions = decisionHistory.slice(-5).map(d => d.finalDecision);
    const uniqueDecisions = new Set(lastDecisions);

    // ❌ Flip-flopping detected
    if (uniqueDecisions.size >= 3) {
      return engineResult({
        engine: "AdsCode36_DecisionStability",
        status: "FAIL",
        score: 1,
        message: "Decision volatility detected. System signals are unstable."
      });
    }

    // ⚠ Mild instability
    if (uniqueDecisions.size === 2) {
      return engineResult({
        engine: "AdsCode36_DecisionStability",
        status: "WARNING",
        score: 0.6,
        message: "Minor decision oscillation observed. Monitor closely."
      });
    }

    // ✅ Stable decisions
    return engineResult({
      engine: "AdsCode36_DecisionStability",
      status: "PASS",
      score: 0.3,
      message: "Decision outputs remain stable across recent runs."
    });
  }
}

module.exports = { DecisionStabilityEngine };
