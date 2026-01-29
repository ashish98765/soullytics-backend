// src/core/decisionEngine.js

class DecisionEngine {
  constructor() {
    this.signals = [];
  }

  register(signal) {
    if (!signal || typeof signal !== "object") return;
    this.signals.push(signal);
  }

  resolve() {
    let score = 0;
    let risk = 0;
    let confidenceSum = 0;
    const reasons = [];

    for (const s of this.signals) {
      if (typeof s.score === "number") score += s.score;
      if (typeof s.risk === "number") risk += s.risk;
      if (typeof s.confidence === "number") confidenceSum += s.confidence;
      if (s.message) reasons.push(s.message);
    }

    const count = this.signals.length || 1;
    const confidence = clamp(confidenceSum / count, 0, 1);
    risk = clamp(risk, 0, 1);

    let action = "PAUSE";
    if (risk >= 0.7) action = "KILL";
    else if (score >= 70 && confidence >= 0.7) action = "SCALE";
    else if (score >= 40) action = "RUN";

    return {
      action,
      score,
      risk,
      confidence,
      reasons
    };
  }
}

function clamp(v, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

module.exports = DecisionEngine;
