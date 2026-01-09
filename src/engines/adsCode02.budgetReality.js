// src/engines/adsCode02.budgetReality.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class BudgetRealityEngine extends AdsCode {
  run() {
    const budget = Number(this.context.budget);

    if (!budget || budget <= 0) {
      return engineResult({
        engine: "AdsCode02_BudgetReality",
        status: "FAIL",
        message: "Budget missing or zero. Ads cannot run without money."
      });
    }

    if (budget < 300) {
      return engineResult({
        engine: "AdsCode02_BudgetReality",
        status: "FAIL",
        message: `Budget ₹${budget} is too low to produce any meaningful ad data.`
      });
    }

    if (budget < 1000) {
      return engineResult({
        engine: "AdsCode02_BudgetReality",
        status: "WARNING",
        score: 0.4,
        message: `Budget ₹${budget} is low. Ads may run, but results will be unstable.`
      });
    }

    return engineResult({
      engine: "AdsCode02_BudgetReality",
      status: "PASS",
      score: 0.9,
      message: `Budget ₹${budget} is sufficient for controlled ad testing.`
    });
  }
}

module.exports = { BudgetRealityEngine };
