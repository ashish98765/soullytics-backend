const { engineResult } = require("../core/engineResult");

module.exports = function adsCode37(context = {}) {
  const totalBudget = Number(context.totalBudget || 0);
  const spendSoFar = Number(context.spendSoFar || 0);
  const dailySpend = Number(context.dailySpend || 0);
  const conversions = Number(context.conversions || 0);
  const daysRunning = Number(context.daysRunning || 1);

  if (!totalBudget || totalBudget <= 0) {
    return engineResult({
      engine: "AdsCode37_CapitalProtection",
      status: "FAIL",
      score: 1,
      message: "Total budget undefined."
    });
  }

  const burnRate = spendSoFar / daysRunning;
  const remaining = totalBudget - spendSoFar;

  if (burnRate > dailySpend * 1.5 && conversions === 0) {
    return engineResult({
      engine: "AdsCode37_CapitalProtection",
      status: "FAIL",
      score: 1,
      message: "Capital bleeding without conversions."
    });
  }

  if (remaining < dailySpend * 2) {
    return engineResult({
      engine: "AdsCode37_CapitalProtection",
      status: "WARNING",
      score: 0.8,
      message: "Capital runway critically low."
    });
  }

  return engineResult({
    engine: "AdsCode37_CapitalProtection",
    status: "PASS",
    score: 0.3,
    message: "Capital exposure safe."
  });
};
