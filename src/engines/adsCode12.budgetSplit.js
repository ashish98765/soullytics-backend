const engineResult = require("../core/engineResult");

module.exports = function adsCode12_budgetSplit(context) {
  const { totalBudget, testingBudget, scalingBudget, testingStrategy } = context;

  if (!totalBudget || totalBudget <= 0) {
    return engineResult({
      engine: "AdsCode12_BudgetSplit",
      status: "FAIL",
      score: 0,
      message: "Invalid total budget"
    });
  }

  if (testingBudget + scalingBudget !== totalBudget) {
    return engineResult({
      engine: "AdsCode12_BudgetSplit",
      status: "FAIL",
      score: 0,
      message: "Budget split mismatch"
    });
  }

  if (testingBudget / totalBudget < 0.3) {
    return engineResult({
      engine: "AdsCode12_BudgetSplit",
      status: "FAIL",
      score: 0.3,
      message: "Testing budget too low"
    });
  }

  if (scalingBudget > 0 && testingStrategy !== "SCALE") {
    return engineResult({
      engine: "AdsCode12_BudgetSplit",
      status: "FAIL",
      score: 0.4,
      message: "Scaling without scale strategy"
    });
  }

  return engineResult({
    engine: "AdsCode12_BudgetSplit",
    status: "PASS",
    score: 0.8,
    message: "Budget split disciplined"
  });
};
