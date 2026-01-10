// src/engines/adsCode39.coldStartImmunity.js

const { engineResult } = require("../core/engineResult");

class ColdStartImmunityEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const daysRunning = Number(this.context.daysRunning || 0);
    const conversions = Number(this.context.conversions || 0);
    const spend = Number(this.context.spend || 0);

    // ❄️ Cold start detected
    if (daysRunning < 5 && conversions === 0 && spend > 0) {
      return engineResult({
        engine: "AdsCode39_ColdStartImmunity",
        status: "WARNING",
        score: 0.8,
        message:
          "Cold start phase detected. System enforcing conservative execution."
      });
    }

    // ❌ Cold start + aggressive spend
    if (daysRunning < 3 && spend > 2 * (this.context.dailyBudget || 0)) {
      return engineResult({
        engine: "AdsCode39_ColdStartImmunity",
        status: "FAIL",
        score: 1,
        message:
          "Aggressive spend during cold start. Ads must not run."
      });
    }

    // ✅ Warmed up
    return engineResult({
      engine: "AdsCode39_ColdStartImmunity",
      status: "PASS",
      score: 0.3,
      message: "Account sufficiently warmed. No cold start risk."
    });
  }
}

module.exports = { ColdStartImmunityEngine };
