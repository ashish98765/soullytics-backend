// src/engines/adsCode21.realityCheck.js

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

    // 🚨 False signal: clicks but no conversions
    if (ctr > 2 && conversionRate === 0) {
      return engineResult({
        engine: "AdsCode21_RealityCheck",
        status: "FAIL",
        score: 1,
        message: "High CTR with zero conversions. Traffic is misleading."
      });
    }

    // ⚠️ Cost mismatch
    if (cpc > 0 && cpl > cpc * 5) {
      return engineResult({
        engine: "AdsCode21_RealityCheck",
        status: "WARNING",
        score: 0.6,
        message: "CPL disproportionately high compared to CPC. Funnel may be broken."
      });
    }

    // ⚠️ Too early to judge
    if (daysRunning < 3) {
      return engineResult({
        engine: "AdsCode21_RealityCheck",
        status: "WARNING",
        score: 0.7,
        message: "Campaign is too new. Data not reliable yet."
      });
    }

    return engineResult({
      engine: "AdsCode21_RealityCheck",
      status: "PASS",
      score: 0.3,
      message: "Performance metrics align with reality."
    });
  }
}

module.exports = { RealityCheckEngine };
