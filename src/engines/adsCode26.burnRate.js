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

    // Capital destruction
    if (avgDailySpend > dailyBudget * 0.9 && conversions === 0 && daysRunning >= 3) {
      return engineResult({
        engine: "AdsCode26_BurnRate",
        status: "FAIL",
        impact: "HIGH",
        authority: 5,
        score: 1,
        message: "Budget burning rapidly with no conversions. Immediate stop required."
      });
    }

    // High burn, low learning
    if (spend > dailyBudget * 3 && conversions < 2) {
      return engineResult({
        engine: "AdsCode26_BurnRate",
        status: "WARNING",
        impact: "MEDIUM",
        authority: 4,
        score: 0.7,
        message: "High spend with minimal learning. Burn rate inefficient."
      });
    }

    return engineResult({
      engine: "AdsCode26_BurnRate",
      status: "PASS",
      impact: "LOW",
      authority: 2,
      score: 0.3,
      message: "Burn rate under control."
    });
  }
}

module.exports = { BurnRateEngine };
