// src/engines/adsCode23.learningMemory.js

const { engineResult } = require("../core/engineResult");

class LearningMemoryEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const history = Array.isArray(this.context.historicalDecisions)
      ? this.context.historicalDecisions
      : [];

    const repeatCount = Number(this.context.repeatCount || 0);
    const lastOutcome = this.context.lastOutcome || null;

    // ❌ Same failed setup repeated
    if (lastOutcome === "FAIL" && repeatCount >= 1) {
      return engineResult({
        engine: "AdsCode23_LearningMemory",
        status: "FAIL",
        score: 1,
        message:
          "Previously failed setup is being repeated. Learning violated.",
      });
    }

    // ❌ Blind repetition
    if (repeatCount >= 3) {
      return engineResult({
        engine: "AdsCode23_LearningMemory",
        status: "FAIL",
        score: 1,
        message:
          "Same setup repeated multiple times. No learning detected.",
      });
    }

    // ⚠️ History exists but mixed outcomes
    if (history.length > 0 && repeatCount === 0) {
      return engineResult({
        engine: "AdsCode23_LearningMemory",
        status: "WARNING",
        score: 0.6,
        message:
          "Historical data exists. Ensure meaningful changes before proceeding.",
      });
    }

    // ✅ Fresh or improved setup
    return engineResult({
      engine: "AdsCode23_LearningMemory",
      status: "PASS",
      score: 0.3,
      message:
        "Learning intact. No conflicting historical repetition detected.",
    });
  }
}

module.exports = { LearningMemoryEngine };
