const { engineResult } = require("../core/engineResult");

class TemporalContextEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const { dayOfWeek, campaignAgeDays } = this.context;

    let bias = "NONE";
    if (dayOfWeek === "SUNDAY") bias = "WEEKEND_SPIKE";
    if (campaignAgeDays < 3) bias = "LEARNING_PHASE";

    return engineResult({
      engine: "adsCode49.temporalContextEngine",
      status: bias === "NONE" ? "PASS" : "WARNING",
      impact: "LOW",
      authority: 2,
      score: bias === "NONE" ? 0.2 : 0.6,
      message: bias === "NONE"
        ? "No temporal distortion detected"
        : `Temporal bias detected: ${bias}`
    });
  }
}

module.exports = { TemporalContextEngine };
