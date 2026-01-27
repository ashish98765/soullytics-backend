// src/core/decisionEngine.js

class DecisionEngine {
  constructor() {
    this.signals = [];
  }

  register(signal) {
    if (!signal) return;
    this.signals.push(signal);
  }

  resolve() {
    let score = 0;
    let risk = 0;
    let reasons = [];
    let confidenceSignals = 0;

    this.signals.forEach((s) => {
      if (typeof s.score === "number") score += s.score;
      if (typeof s.risk === "number") risk += s.risk;

      if (s.message) reasons.push(s.message);
      if (s.confidence) confidenceSignals += s.confidence;
    });

    const avgConfidence =
      this.signals.length > 0
        ? Math.min(1, confidenceSignals / this.signals.length)
        : 0.5;

    let action = "PAUSE";

    if (risk >= 70) action = "KILL";
    else if (score >= 70 && avgConfidence >= 0.7) action = "SCALE";
    else if (score >= 40) action = "RUN";

    return {
      action,
      score,
      risk,
      confidence: Number(avgConfidence.toFixed(2)),
      reasons
    };
  }
}

module.exports = DecisionEngine;
