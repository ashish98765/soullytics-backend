// src/engines/adsCode20.coldStartSafety.js

const { engineResult } = require("../core/engineResult");

class ColdStartSafetyEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const accountAgeDays = Number(this.context.accountAgeDays || 0);
    const pixelEventsCount = Number(this.context.pixelEventsCount || 0);
    const historicalSpend = Number(this.context.historicalSpend || 0);
    const conversionsCount = Number(this.context.conversionsCount || 0);

    // 🚨 Absolute cold start
    if (
      accountAgeDays < 7 &&
      pixelEventsCount === 0 &&
      historicalSpend === 0 &&
      conversionsCount === 0
    ) {
      return engineResult({
        engine: "AdsCode20_ColdStartSafety",
        status: "FAIL",
        score: 1,
        message: "Absolute cold start detected. Ads must not run. Collect data first."
      });
    }

    // ⚠️ Partial data, risky zone
    if (
      pixelEventsCount < 50 ||
      historicalSpend < 1000 ||
      conversionsCount < 5
    ) {
      return engineResult({
        engine: "AdsCode20_ColdStartSafety",
        status: "WARNING",
        score: 0.7,
        message: "Limited historical data. Allow only testing with restricted budget."
      });
    }

    // ✅ Safe zone
    return engineResult({
      engine: "AdsCode20_ColdStartSafety",
      status: "PASS",
      score: 0.3,
      message: "Sufficient data available. Cold start restrictions not required."
    });
  }
}

module.exports = { ColdStartSafetyEngine };
