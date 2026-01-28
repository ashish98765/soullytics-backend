const { engineResult } = require("../core/engineResult");

module.exports = function adsCode26(context = {}) {
  const spend = Number(context.spend || 0);
  const dailyBudget = Number(context.dailyBudget || 0);
  const daysRunning = Number(context.daysRunning || 1);
  const conversions = Number(context.conversions || 0);

  const avgDailySpend = spend / daysRunning;

  if (avgDailySpend > dailyBudget * 0.9 && conversions === 0 && daysRunning >= 3) {
    return engineResult({
      engine: "AdsCode26_BurnRate",
      status: "FAIL",
      authority: 5,
      score: 1,
      message: "Rapid budget burn with no conversions."
    });
  }

  if (spend > dailyBudget * 3 && conversions < 2) {
    return engineResult({
      engine: "AdsCode26_BurnRate",
      status: "WARNING",
      authority: 4,
      score: 0.7,
      message: "High burn, low learning."
    });
  }

  return engineResult({
    engine: "AdsCode26_BurnRate",
    status: "PASS",
    authority: 2,
    score: 0.3,
    message: "Burn rate under control."
  });
};
