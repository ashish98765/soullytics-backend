const { engineResult } = require("../core/engineResult");

module.exports = function adsCode38(context = {}) {
  const overrideCount = Number(context.overrideCount || 0);
  const trustScore = Number(context.trustScore || 0.5);

  if (overrideCount >= 3 && trustScore < 0.4) {
    return engineResult({
      engine: "AdsCode38_Permission",
      status: "FAIL",
      score: 1,
      message: "Override permission revoked."
    });
  }

  if (overrideCount >= 2 || trustScore < 0.6) {
    return engineResult({
      engine: "AdsCode38_Permission",
      status: "WARNING",
      score: 0.7,
      message: "Override permission restricted."
    });
  }

  return engineResult({
    engine: "AdsCode38_Permission",
    status: "PASS",
    score: 0.3,
    message: "Override permission granted."
  });
};
