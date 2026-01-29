// src/core/explainabilityEngine.js

class ExplainabilityEngine {
  static run(decision) {
    const explanations = [];
    const suggestions = new Set();

    // ---- Aggregate reasons from engines that influenced final action
    if (Array.isArray(decision.trace)) {
      decision.trace.forEach((engine) => {
        if (engine.action === decision.action) {
          (engine.reasons || []).forEach((r) => explanations.push(r));
          (engine.suggestions || []).forEach((s) => suggestions.add(s));
        }
      });
    }

    // ---- Global signals
    if (decision.risk >= 0.85) {
      explanations.push("High systemic risk detected across engines");
    }

    if (decision.confidence < 0.4) {
      explanations.push("Low confidence due to conflicting signals");
    }

    // ---- Action specific headline
    let headline;
    switch (decision.action) {
      case "RUN":
        headline = "Campaign signals are healthy";
        break;
      case "PAUSE":
        headline = "Risk detected — pausing to prevent waste";
        break;
      case "KILL":
        headline = "Critical risk detected — campaign stopped";
        break;
      default:
        headline = "Decision generated";
    }

    return {
      engine: "ExplainabilityEngine",
      action: decision.action,
      headline,
      confidence: decision.confidence,
      risk: decision.risk,
      why: explanations.slice(0, 5),
      suggested_fixes: Array.from(suggestions).slice(0, 5),
    };
  }
}

module.exports = ExplainabilityEngine;
