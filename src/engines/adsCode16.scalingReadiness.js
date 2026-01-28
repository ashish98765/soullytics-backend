const { engineResult } = require("../core/engineResult");

module.exports = function adsCode16(context = {}) {
  const testingComplete = context.testingComplete === true;
  const warningCount = Number(context.warningCount || 0);
  const performanceStable = context.performanceStable === true;
  const budget = Number(context.budget);

  if (!testingComplete) {
    return engineResult({
      engine: "AdsCode16_ScalingReadiness",
      status: "FAIL",
      message: "Testing not complete."
    });
  }

  if (warningCount >= 2) {
    return engineResult({
      engine: "AdsCode16_ScalingReadiness",
      status: "FAIL",
      message: "Too many warnings to scale."
    });
  }

  if (!performanceStable) {
    return engineResult({
      engine: "AdsCode16_ScalingReadiness",
      status: "WARNING",
      score: 0.5,
      message: "Performance not yet stable."
    });
  }

  if (budget < 3000) {
    return engineResult({
      engine: "AdsCode16_ScalingReadiness",
      status: "WARNING",
      score: 0.5,
      message: "Budget low for scaling."
    });
  }

  return engineResult({
    engine: "AdsCode16_ScalingReadiness",
    status: "PASS",
    score: 0.9,
    message: "Ready for controlled scaling."
  });
};
