const { engineResult } = require("../core/engineResult");

module.exports = function adsCode32(context = {}) {
  const warnings = (context.engineResults || []).filter(r => r.status === "WARNING");

  if (warnings.length === 0) {
    return engineResult({
      engine: "AdsCode32_Recommendation",
      status: "PASS",
      score: 0.3,
      message: "No recommendations needed."
    });
  }

  return engineResult({
    engine: "AdsCode32_Recommendation",
    status: "WARNING",
    score: 0.6,
    message: "Actionable recommendations generated.",
    data: {
      recommendations: warnings.map(w => w.message)
    }
  });
};
