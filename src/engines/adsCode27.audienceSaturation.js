const { engineResult } = require("../core/engineResult");

module.exports = function adsCode27(context = {}) {
  const frequency = Number(context.frequency || 0);
  const ctr = Number(context.ctr || 0);
  const daysRunning = Number(context.daysRunning || 1);

  if (frequency >= 3.5 && ctr < 0.5) {
    return engineResult({
      engine: "AdsCode27_AudienceSaturation",
      status: "FAIL",
      score: 1,
      message: "Audience saturated. Stop or refresh."
    });
  }

  if (frequency >= 2.5 && ctr < 1) {
    return engineResult({
      engine: "AdsCode27_AudienceSaturation",
      status: "WARNING",
      score: 0.6,
      message: "Early saturation signals detected."
    });
  }

  if (daysRunning < 3) {
    return engineResult({
      engine: "AdsCode27_AudienceSaturation",
      status: "WARNING",
      score: 0.7,
      message: "Too early to judge saturation."
    });
  }

  return engineResult({
    engine: "AdsCode27_AudienceSaturation",
    status: "PASS",
    score: 0.3,
    message: "Audience engagement healthy."
  });
};
