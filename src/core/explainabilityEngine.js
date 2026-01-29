// src/core/explainabilityEngine.js

class ExplainabilityEngine {
  constructor(context = {}) {
    this.context = context;
  }

  run(decision, trace) {
    const explanations = [];

    const metrics = this.context.metrics || {};

    if (metrics.ctr !== undefined && metrics.ctr < 0.5) {
      explanations.push("Low CTR indicates weak creative or audience mismatch");
    }

    if (
      metrics.cpa !== undefined &&
      this.context.expectedCPA !== undefined &&
      metrics.cpa > this.context.expectedCPA
    ) {
      explanations.push("CPA is higher than expected threshold");
    }

    if (
      this.context.budget !== undefined &&
      this.context.minimumBudget !== undefined &&
      this.context.budget < this.context.minimumBudget
    ) {
      explanations.push("Budget is too low for selected objective");
    }

    if (decision.risk >= 0.7) {
      explanations.push("High overall risk detected across engines");
    }

    if (decision.confidence < 0.4) {
      explanations.push("Low confidence due to unstable signals");
    }

    if (decision.action === "SCALE") {
      explanations.push("Strong performance justifies scaling");
    }

    if (decision.action === "PAUSE") {
      explanations.push("Pausing to prevent budget waste");
    }

    if (decision.action === "KILL") {
      explanations.push("Critical failure — stopping campaign");
    }

    return {
      engine: "ExplainabilityEngine",
      headline: decision.action,
      explanations,
      confidence: decision.confidence,
      enginesEvaluated: trace?.summary?.enginesEvaluated || 0
    };
  }
}

module.exports = ExplainabilityEngine;
