// src/engines/adsCode26.burnRate.js

const { engineResult } = require("../core/engineResult");

class BurnRateEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const spend = Number(this.context.spend || 0);
    const dailyBudget = Number(this.context.dailyBudget || 0);
    const daysRunning = Number(this.context.daysRunning || 1);
    const conversions = Number(this.context.conversions || 0);

    const avgDailySpend = spend / daysRunning;

    // 🚨 Budget burning too fast without results
    if (avgDailySpend > dailyBudget * 0.9 && conversions === 0) {
      return engineResult({
        engine: "AdsCode26_BurnRate",
        status: "FAIL",
        score: 1,
        message:
          "Budget is burning rapidly with no conversions. Immediate stop recommended."
      });
    }

    // ⚠️ High burn, low learning
    if (spend > dailyBudget * 3 && conversions < 2) {
      return engineResult({
        engine: "AdsCode26_BurnRate",
        status: "WARNING",
        score: 0.7,
        message:
          "Significant budget spent with minimal learning. Burn rate is inefficient."
      });
    }

    // ✅ Burn rate acceptable
    return engineResult({
      engine: "AdsCode26_BurnRate",
      status: "PASS",
      score: 0.3,
      message: "Burn rate is under control relative to performance."
    });
  }
}

module.exports = { BurnRateEngine };
