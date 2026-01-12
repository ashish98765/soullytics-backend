const { ObjectiveClarityEngine } = require("../adsCode01.objectiveClarity");
const { BudgetRealityEngine } = require("../adsCode02.budgetReality");

class ObjectiveBudgetEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    return [
      new ObjectiveClarityEngine(this.context).run(),
      new BudgetRealityEngine(this.context).run()
    ];
  }
}

module.exports = { ObjectiveBudgetEngine };
