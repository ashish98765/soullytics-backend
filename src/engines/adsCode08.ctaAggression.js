const engineResult = require("../core/engineResult");

module.exports = function adsCode08_ctaAggression(context) {
  const { ctaType, audienceType } = context;

  if (!ctaType || !audienceType) {
    return engineResult({
      engine: "AdsCode08_CTAAggression",
      status: "FAIL",
      score: 0,
      message: "CTA or audience missing"
    });
  }

  if (ctaType === "HARD" && audienceType !== "HOT") {
    return engineResult({
      engine: "AdsCode08_CTAAggression",
      status: "FAIL",
      score: 0.3,
      message: "Aggressive CTA on non-hot audience"
    });
  }

  if (ctaType === "SOFT" && audienceType === "HOT") {
    return engineResult({
      engine: "AdsCode08_CTAAggression",
      status: "WARNING",
      score: 0.5,
      message: "Soft CTA underutilizes hot audience"
    });
  }

  return engineResult({
    engine: "AdsCode08_CTAAggression",
    status: "PASS",
    score: 0.85,
    message: "CTA matches audience readiness"
  });
};
