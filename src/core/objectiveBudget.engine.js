// src/core/objectiveBudget.engine.js

const objectiveClarity = require("../engines/adsCode01.objectiveClarity");
const budgetReality = require("../engines/adsCode02.budgetReality");

function run(context = {}) {
  const objectiveResult = objectiveClarity.run(context);
  const budgetResult = budgetReality.run(context);

  return {
    valid:
      objectiveResult.status !== "FAIL" &&
      budgetResult.status !== "FAIL",
    objective: objectiveResult,
    budget: budgetResult
  };
}

module.exports = { run };
