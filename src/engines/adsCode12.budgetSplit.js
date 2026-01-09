// src/engines/adsCode12.budgetSplit.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class BudgetSplitEngine extends AdsCode {
  run() {
    const totalBudget = Number(this.context.totalBudget);
    const testingBudget = Number(this.context.testingBudget);
    const scalingBudget = Number(this.context.scalingBudget);
    const testingStrategy = this.context.testingStrategy;

    if (!totalBudget || totalBudget <= 0) {
      return engineResult({
        engine: "AdsCode12_BudgetSplit",
        status: "FAIL",
        message: "Total budget missing or invalid."
      });
    }

    if (testingBudget + scalingBudget !== totalBudget) {
      return engineResult({
        engine: "AdsCode12_BudgetSplit",
        status: "FAIL",
        message: "Testing + scaling budget must equal total budget."
      });
    }

    const testingRatio = testingBudget / totalBudget;

    if (testingRatio < 0.3) {
      return engineResult({
        engine: "AdsCode12_BudgetSplit",
        status: "FAIL",
        message: "At least 30% budget must be allocated to testing."
      });
    }

    if (scalingBudget > 0 && testingStrategy !== "SCALE") {
      return engineResult({
        engine: "AdsCode12_BudgetSplit",
        status: "FAIL",
        message: "Scaling budget allocated without valid scaling strategy."
      });
    }

    return engineResult({
      engine: "AdsCode12_BudgetSplit",
      status: "PASS",
      score: 0.8,
      message: "Budget split is logical and disciplined."
    });
  }
}

module.exports = { BudgetSplitEngine };
