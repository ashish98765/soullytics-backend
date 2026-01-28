const { engineResult } = require("../core/engineResult");

module.exports = function adsCode39(context = {}) {
  const daysRunning = Number(context.daysRunning || 0);
  const conversions = Number(context.conversions || 0);
  const spend = Number(context.spend || 0);
  const dailyBudget = Number(context.dailyBudget || 0);

  if (daysRunning < 5 && conversions === 0 && spend > 0) {
    return engineResult({
      engine: "AdsCode39_ColdStartImmunity",
      status: "WARNING",
      score: 0.8,
      message: "Cold start phase active."
    });
  }

  if (daysRunning < 3 && spend > dailyBudget * 2) {
    return engineResult({
      engine: "AdsCode39_ColdStartImmunity",
      status: "FAIL",
      score: 1,
      message: "Aggressive spend during cold start."
    });
  }

  return engineResult({
    engine: "AdsCode39_ColdStartImmunity",
    status: "PASS",
    score: 0.3,
    message: "Account sufficiently warmed."
  });
};
