// src/engines/adsCode23.learningMemory.js

const { engineResult } = require("../core/engineResult");

class LearningMemoryEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const historicalDecisions = Array.isArray(this.context.historicalDecisions)
      ? this.context.historicalDecisions
      : [];

    const currentSetupHash = this.context.currentSetupHash;
    const lastOutcome = this.context.lastOutcome;
    const repeatCount = Number(this.context.repeatCount || 0);

    // 🚨 Repeating failed setup
    if (lastOutcome === "FAILURE" && repeatCount > 0) {
      return engineResult({
        engine: "AdsCode23_LearningMemory",
        status: "FAIL",
        score: 1,
        message: "Previously failed setup is being repeated. System refuses to retry blindly."
      });
    }

    // 🚨 Over-repeating same setup
    if (repeatCount >= 2) {
      return engineResult({
        engine: "AdsCode23_LearningMemory",
        status: "FAIL",
        score: 1,
        message: "Same setup repeated multiple times. No new learning expected."
      });
    }

    // ⚠️ History exists but mixed
    if (historicalDecisions.length > 0) {
      return engineResult({
        engine: "AdsCode23_LearningMemory",
        status: "WARNING",
        score: 0.6,
        message: "Historical data exists. Ensure setup changes before proceeding."
      });
    }

    // ✅ Fresh setup
    return engineResult({
      engine: "AdsCode23_LearningMemory",
      status: "PASS",
      score: 0.3,
      message: "No conflicting history. Safe to proceed."
    });
  }
}

module.exports = { LearningMemoryEngine };
