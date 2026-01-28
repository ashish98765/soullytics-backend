const { engineResult } = require("../core/engineResult");

module.exports = function adsCode30(context = {}) {
  let riskProfile = context.riskProfile || "BALANCED";
  const overrideCount = Number(context.overrideCount || 0);
  const lastDecision = context.lastDecision || {};

  if (overrideCount >= 3) {
    riskProfile = "CONSERVATIVE";
  }

  if (riskProfile === "CONSERVATIVE" && lastDecision.status === "WARNING") {
    return engineResult({
      engine: "AdsCode30_FounderRiskProfile",
      status: "FAIL",
      score: 1,
      message: "Conservative risk profile with recent warning."
    });
  }

  if (riskProfile === "AGGRESSIVE" && overrideCount >= 1) {
    return engineResult({
      engine: "AdsCode30_FounderRiskProfile",
      status: "WARNING",
      score: 0.6,
      message: "Aggressive risk profile. Monitor closely."
    });
  }

  if (riskProfile === "BALANCED" && overrideCount >= 2) {
    return engineResult({
      engine: "AdsCode30_FounderRiskProfile",
      status: "WARNING",
      score: 0.7,
      message: "Balanced profile but repeated overrides."
    });
  }

  return engineResult({
    engine: "AdsCode30_FounderRiskProfile",
    status: "PASS",
    score: 0.3,
    message: "Risk profile aligned."
  });
};
