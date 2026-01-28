const { engineResult } = require("../core/engineResult");

module.exports = function adsCode15(context = {}) {
  const accountAgeDays = Number(context.accountAgeDays || 0);
  const warningCount = Number(context.warningCount || 0);
  const isNewProduct = context.isNewProduct === true;
  const testingStrategy = context.testingStrategy;

  if (accountAgeDays < 7) {
    return engineResult({
      engine: "AdsCode15_RiskDetection",
      status: "WARNING",
      score: 0.4,
      message: "Very new ad account."
    });
  }

  if (warningCount >= 3) {
    return engineResult({
      engine: "AdsCode15_RiskDetection",
      status: "FAIL",
      message: "Multiple risk signals detected."
    });
  }

  if (isNewProduct && testingStrategy === "SCALE") {
    return engineResult({
      engine: "AdsCode15_RiskDetection",
      status: "FAIL",
      message: "Scaling new product without validation."
    });
  }

  return engineResult({
    engine: "AdsCode15_RiskDetection",
    status: "PASS",
    score: 0.85,
    message: "Risk levels acceptable."
  });
};
