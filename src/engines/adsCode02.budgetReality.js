const engineResult = require("../core/engineResult");

module.exports = function adsCode02_budgetReality(context) {
  const budget = Number(context.budget);
  const platform = context.platform;

  if (!budget || isNaN(budget)) {
    return engineResult({
      engine: "AdsCode02_BudgetReality",
      status: "FAIL",
      score: 0,
      message: "Invalid or missing budget"
    });
  }

  const min = {
    meta: 500,
    google: 800,
    youtube: 1000
  };

  const required = min[platform] || 500;

  if (budget < required) {
    return engineResult({
      engine: "AdsCode02_BudgetReality",
      status: "FAIL",
      score: 0.4,
      message: `Budget too low for ${platform}`
    });
  }

  return engineResult({
    engine: "AdsCode02_BudgetReality",
    status: "PASS",
    score: 0.8,
    message: "Budget is realistic"
  });
};
