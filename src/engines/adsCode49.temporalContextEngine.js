const { engineResult } = require("../core/engineResult");

module.exports = function adsCode49(context = {}) {
  const { dayOfWeek, campaignAgeDays = 0 } = context;

  let bias = "NONE";
  if (dayOfWeek === "SUNDAY") bias = "WEEKEND_SPIKE";
  if (campaignAgeDays < 3) bias = "LEARNING_PHASE";

  return engineResult({
    engine: "AdsCode49_TemporalContext",
    status: bias === "NONE" ? "PASS" : "WARNING",
    impact: "LOW",
    authority: 2,
    score: bias === "NONE" ? 0.2 : 0.6,
    message:
      bias === "NONE"
        ? "No temporal distortion detected."
        : `Temporal bias detected: ${bias}`,
    bias
  });
};
