// src/engines/adsCode37.capitalProtection.js

const { engineResult } = require("../core/engineResult");

class CapitalProtectionEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const totalBudget = Number(this.context.totalBudget || 0);
    const spendSoFar = Number(this.context.spendSoFar || 0);
    const dailySpend = Number(this.context.dailySpend || 0);
    const conversions = Number(this.context.conversions || 0);
    const daysRunning = Number(this.context.daysRunning || 1);

    if (!totalBudget || totalBudget <= 0) {
      return engineResult({
        engine: "AdsCode37_CapitalProtection",
        status: "FAIL",
        score: 1,
        message: "Total budget undefined. Capital protection impossible."
      });
    }

    const burnRate = spendSoFar / daysRunning;
    const remainingBudget = totalBudget - spendSoFar;

    // ❌ Capital bleeding
    if (burnRate > dailySpend * 1.5 && conversions === 0) {
      return engineResult({
        engine: "AdsCode37_CapitalProtection",
        status: "FAIL",
        score: 1,
        message: "Capital burn accelerating with zero conversions. Immediate stop required."
      });
    }

    // ⚠ Runway critically low
    if (remainingBudget < dailySpend * 2) {
      return engineResult({
        engine: "AdsCode37_CapitalProtection",
        status: "WARNING",
        score: 0.8,
        message: "Remaining budget critically low. Capital runway at risk."
      });
    }

    // ✅ Capital safe
    return engineResult({
      engine: "AdsCode37_CapitalProtection",
      status: "PASS",
      score: 0.3,
      message: "Capital exposure within acceptable risk boundaries."
    });
  }
}

module.exports = { CapitalProtectionEngine };
