// src/engines/adsCode22.feedbackLoop.js

const { engineResult } = require("../core/engineResult");

class FeedbackLoopEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const lastDecision = this.context.lastDecision || null;
    const lastStatus = lastDecision?.final_decision || null;
    const lastWarningsCount = Number(lastDecision?.warnings_count || 0);

    const changesApplied = this.context.changesApplied === true;
    const daysSinceLastDecision = Number(this.context.daysSinceLastDecision || 0);

    // ❌ Warning ignored previously
    if (lastWarningsCount > 0 && !changesApplied) {
      return engineResult({
        engine: "AdsCode22_FeedbackLoop",
        status: "FAIL",
        score: 1,
        message:
          "Previous warnings were ignored. No corrective changes applied.",
      });
    }

    // ❌ Pause ignored
    if (lastStatus === "PAUSE" && !changesApplied) {
      return engineResult({
        engine: "AdsCode22_FeedbackLoop",
        status: "FAIL",
        score: 1,
        message:
          "Previous PAUSE decision ignored. Same risky setup repeated.",
      });
    }

    // ⚠️ Too early to judge learning
    if (daysSinceLastDecision < 2) {
      return engineResult({
        engine: "AdsCode22_FeedbackLoop",
        status: "WARNING",
        score: 0.6,
        message:
          "Too early to evaluate feedback loop. Allow more time.",
      });
    }

    // ✅ Healthy feedback loop
    return engineResult({
      engine: "AdsCode22_FeedbackLoop",
      status: "PASS",
      score: 0.3,
      message:
        "Feedback loop healthy. System adapting based on history.",
    });
  }
}

module.exports = { FeedbackLoopEngine };
