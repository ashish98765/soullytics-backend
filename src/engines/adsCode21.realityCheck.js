const { engineResult } = require("../core/engineResult");

class RealityCheckEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const ctr = Number(this.context.ctr || 0);
    const cpc = Number(this.context.cpc || 0);
    const cpl = Number(this.context.cpl || 0);
    const conversionRate = Number(this.context.conversionRate || 0);
    const daysRunning = Number(this.context.daysRunning || 0);

    // Fake signal trap
    if (ctr > 2 && conversionRate === 0 && daysRunning >= 3) {
      return engineResult({
        engine: "AdsCode21_RealityCheck",
        status: "FAIL",
        impact: "HIGH",
        authority: 4,
        score: 1,
        message: "High CTR with zero conversions after learning phase. Traffic is misleading."
      });
    }

    // Funnel economics mismatch
    if (cpc > 0 && cpl > cpc * 5) {
      return engineResult({
        engine: "AdsCode21_RealityCheck",
        status: "WARNING",
        impact: "MEDIUM",
        authority: 3,
        score: 0.7,
        message: "CPL disproportionately high vs CPC. Funnel leakage suspected."
      });
    }

    // Too early
    if (daysRunning < 3) {
      return engineResult({
        engine: "AdsCode21_RealityCheck",
        status: "WARNING",
        impact: "LOW",
        authority: 2,
        score: 0.5,
        message: "Campaign too new. Reality check deferred."
      });
    }

    return engineResult({
      engine: "AdsCode21_RealityCheck",
      status: "PASS",
      impact: "LOW",
      authority: 2,
      score: 0.3,
      message: "Performance aligns with reality."
    });
  }
}

module.exports = { RealityCheckEngine };
