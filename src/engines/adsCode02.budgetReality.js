// src/engines/adsCode02.budgetReality.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class BudgetRealityEngine extends AdsCode {
  run() {
    const budget = Number(this.context.budget);
    const platform = this.context.platform;

    if (!budget || isNaN(budget)) {
      return engineResult({
        engine: "AdsCode02_BudgetReality",
        status: "FAIL",
        message: "Budget missing or invalid. Ads cannot run without a real budget."
      });
    }

    const minimumBudgetByPlatform = {
      meta: 500,     // INR per day
      google: 800,
      youtube: 1000
    };

    const minRequired = minimumBudgetByPlatform[platform] || 500;

    if (budget < minRequired) {
      return engineResult({
        engine: "AdsCode02_BudgetReality",
        status: "FAIL",
        score: 0.9,
        message: `Budget too low for ${platform}. Minimum realistic budget is ₹${minRequired}/day.`
      });
    }

    return engineResult({
      engine: "AdsCode02_BudgetReality",
      status: "PASS",
      score: 0.2,
      message: `Budget ₹${budget}/day is realistic for ${platform}.`
    });
  }
}

module.exports = { BudgetRealityEngine };
