// src/core/decisionEngine.js

class DecisionEngine {
  static run({
    objectiveBudget,
    platformRules,
    creativeHealth,
    funnelHealth,
    capitalSafety,
    scaling,
    prediction
  }) {
    // hard stops
    if (!objectiveBudget.valid) {
      return { action: "STOP", confidence: 0.3 };
    }

    if (!platformRules.allowed) {
      return { action: "STOP", confidence: 0.3 };
    }

    if (!capitalSafety.safe) {
      return { action: "STOP", confidence: 0.2 };
    }

    // predictive caution
    if (prediction && prediction.riskLevel === "HIGH") {
      return { action: "PAUSE", confidence: 0.5 };
    }

    return {
      action: "RUN",
      confidence: 0.8
    };
  }
}

module.exports = DecisionEngine;
