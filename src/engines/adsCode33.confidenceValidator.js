const { engineResult } = require("../core/engineResult");

module.exports = function adsCode33(context = {}) {
  const score = Number(context.finalConfidence || 0);
  const failCount = (context.engineResults || []).filter(r => r.status === "FAIL").length;

  if (score >= 70 && failCount > 0) {
    return engineResult({
      engine: "AdsCode33_ConfidenceValidator",
      status: "FAIL",
      score: 1,
      message: "High confidence despite critical failures."
    });
  }

  if (score < 40 && failCount === 0) {
    return engineResult({
      engine: "AdsCode33_ConfidenceValidator",
      status: "WARNING",
      score: 0.7,
      message: "Low confidence without failures."
    });
  }

  return engineResult({
    engine: "AdsCode33_ConfidenceValidator",
    status: "PASS",
    score: 0.3,
    message: "Confidence validated."
  });
};
