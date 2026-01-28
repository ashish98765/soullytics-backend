const { engineResult } = require("../core/engineResult");

module.exports = function adsCode20(context = {}) {
  const accountAgeDays = Number(context.accountAgeDays || 0);
  const pixelEventsCount = Number(context.pixelEventsCount || 0);
  const historicalSpend = Number(context.historicalSpend || 0);
  const conversionsCount = Number(context.conversionsCount || 0);

  if (
    accountAgeDays < 7 &&
    pixelEventsCount === 0 &&
    historicalSpend === 0 &&
    conversionsCount === 0
  ) {
    return engineResult({
      engine: "AdsCode20_ColdStartSafety",
      status: "FAIL",
      score: 1,
      message: "Absolute cold start detected."
    });
  }

  if (
    pixelEventsCount < 50 ||
    historicalSpend < 1000 ||
    conversionsCount < 5
  ) {
    return engineResult({
      engine: "AdsCode20_ColdStartSafety",
      status: "WARNING",
      score: 0.7,
      message: "Limited data. Only cautious testing allowed."
    });
  }

  return engineResult({
    engine: "AdsCode20_ColdStartSafety",
    status: "PASS",
    score: 0.8,
    message: "Cold start restrictions not required."
  });
};
