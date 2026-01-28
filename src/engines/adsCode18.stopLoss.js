const { engineResult } = require("../core/engineResult");

module.exports = function adsCode18(context = {}) {
  const spendSoFar = Number(context.spendSoFar);
  const maxAllowedLoss = Number(context.maxAllowedLoss);
  const performanceTrend = context.performanceTrend;
  const daysRunning = Number(context.daysRunning || 0);

  if (!maxAllowedLoss || maxAllowedLoss <= 0) {
    return engineResult({
      engine: "AdsCode18_StopLoss",
      status: "FAIL",
      message: "Stop-loss not defined."
    });
  }

  if (spendSoFar >= maxAllowedLoss) {
    return engineResult({
      engine: "AdsCode18_StopLoss",
      status: "FAIL",
      message: "Max loss exceeded."
    });
  }

  if (performanceTrend === "DECLINING" && daysRunning >= 5) {
    return engineResult({
      engine: "AdsCode18_StopLoss",
      status: "FAIL",
      message: "Declining performance over multiple days."
    });
  }

  if (spendSoFar >= maxAllowedLoss * 0.7) {
    return engineResult({
      engine: "AdsCode18_StopLoss",
      status: "WARNING",
      score: 0.4,
      message: "Approaching stop-loss."
    });
  }

  return engineResult({
    engine: "AdsCode18_StopLoss",
    status: "PASS",
    score: 0.85,
    message: "Spend within safe limits."
  });
};
