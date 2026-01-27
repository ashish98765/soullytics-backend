// src/core/explainabilityEngine.js

class ExplainabilityEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const explanations = [];

    if (this.context.metrics?.ctr < 0.5) {
      explanations.push("Low CTR indicates weak creative or audience mismatch");
    }

    if (this.context.metrics?.cpa > this.context.expectedCPA) {
      explanations.push("CPA higher than expected threshold");
    }

    if (this.context.budget < this.context.minimumBudget) {
      explanations.push("Budget too low for selected objective");
    }

    return {
      engine: "ExplainabilityEngine",
      score: 0,
      risk: explanations.length * 10,
      message: explanations.join(" | "),
      confidence: 0.6
    };
  }
}

module.exports = ExplainabilityEngine;
