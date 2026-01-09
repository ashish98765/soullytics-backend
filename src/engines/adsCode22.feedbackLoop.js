// src/engines/adsCode22.feedbackLoop.js

const { engineResult } = require("../core/engineResult");

class FeedbackLoopEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const previousDecision = this.context.previousDecision;
    const previousWarningsCount = Number(this.context.previousWarningsCount || 0);
    const changesApplied = this.context.changesApplied === true;
    const daysSinceLastDecision = Number(this.context.daysSinceLastDecision || 0);

    // 🚨 Ignored warnings
    if (previousWarningsCount >= 2 && !changesApplied) {
      return engineResult({
        engine: "AdsCode22_FeedbackLoop",
        status: "FAIL",
        score: 1,
        message: "Previous warnings ignored. System learning loop broken."
      });
    }

    // 🚨 Ignored pause
    if (previousDecision === "PAUSE" && !changesApplied) {
      return engineResult({
        engine: "AdsCode22_FeedbackLoop",
        status: "FAIL",
        score: 1,
        message: "Previous PAUSE decision ignored. Repeating same setup."
      });
    }

    // ⚠️ Too soon to judge learning
    if (daysSinceLastDecision < 2) {
      return engineResult({
        engine: "AdsCode22_FeedbackLoop",
        status: "WARNING",
        score: 0.7,
        message: "Too early to evaluate learning. Allow more time."
      });
    }

    return engineResult({
      engine: "AdsCode22_FeedbackLoop",
      status: "PASS",
      score: 0.3,
      message: "Feedback loop healthy. System is adapting."
    });
  }
}

module.exports = { FeedbackLoopEngine };
