const { engineResult } = require("../core/engineResult");

module.exports = function adsCode15(context = {}) {
  const { accountAgeDays = 0, warningCount = 0, isNewProduct, testingStrategy } = context;

  if (accountAgeDays < 7)
    return engineResult({ engine: "AdsCode15_RiskDetection", status: "WARNING", score: 0.4, message: "New ad account risk." });

  if (warningCount >= 3)
    return engineResult({ engine: "AdsCode15_RiskDetection", status: "FAIL", message: "Multiple red flags." });

  if (isNewProduct && testingStrategy === "SCALE")
    return engineResult({ engine: "AdsCode15_RiskDetection", status: "FAIL", message: "Scaling unvalidated product." });

  return engineResult({ engine: "AdsCode15_RiskDetection", status: "PASS", score: 0.85, message: "Risk acceptable." });
};
