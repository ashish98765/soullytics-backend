const { engineResult } = require("../core/engineResult");

module.exports = function adsCode17(context = {}) {
  const platform = context.platform;
  const objective = context.objective;
  const historicalPerformance = context.historicalPlatformPerformance;

  if (!platform || !objective) {
    return engineResult({
      engine: "AdsCode17_PlatformBias",
      status: "FAIL",
      message: "Platform or objective missing."
    });
  }

  if (historicalPerformance === "BAD") {
    return engineResult({
      engine: "AdsCode17_PlatformBias",
      status: "WARNING",
      score: 0.4,
      message: "Platform chosen despite poor history."
    });
  }

  if (historicalPerformance === "UNKNOWN") {
    return engineResult({
      engine: "AdsCode17_PlatformBias",
      status: "WARNING",
      score: 0.5,
      message: "No historical data available."
    });
  }

  return engineResult({
    engine: "AdsCode17_PlatformBias",
    status: "PASS",
    score: 0.8,
    message: "Platform selection appears unbiased."
  });
};
