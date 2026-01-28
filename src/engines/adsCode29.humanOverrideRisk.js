const { engineResult } = require("../core/engineResult");

module.exports = function adsCode29(context = {}) {
  const overrideCount = Number(context.overrideCount || 0);
  const lastDecision = context.lastDecision || {};
  const lastWasWarning = lastDecision.status === "WARNING";

  if (overrideCount >= 3 && lastWasWarning) {
    return engineResult({
      engine: "AdsCode29_HumanOverrideRisk",
      status: "FAIL",
      score: 1,
      message: "Repeated human overrides detected."
    });
  }

  if (overrideCount >= 1 && lastWasWarning) {
    return engineResult({
      engine: "AdsCode29_HumanOverrideRisk",
      status: "WARNING",
      score: 0.7,
      message: "System warnings overridden."
    });
  }

  return engineResult({
    engine: "AdsCode29_HumanOverrideRisk",
    status: "PASS",
    score: 0.3,
    message: "No override risk detected."
  });
};
