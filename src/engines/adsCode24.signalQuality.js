const { engineResult } = require("../core/engineResult");

module.exports = function adsCode24(context = {}) {
  const ctr = Number(context.ctr || 0);
  const conversionRate = Number(context.conversionRate || 0);
  const avgSessionTime = Number(context.avgSessionTime || 0);
  const bounceRate = Number(context.bounceRate || 0);

  if (ctr >= 2 && conversionRate === 0 && avgSessionTime < 10) {
    return engineResult({
      engine: "AdsCode24_SignalQuality",
      status: "FAIL",
      score: 1,
      message: "High CTR with poor engagement. Misleading traffic."
    });
  }

  if (bounceRate > 0.85 || avgSessionTime < 20) {
    return engineResult({
      engine: "AdsCode24_SignalQuality",
      status: "WARNING",
      score: 0.6,
      message: "Weak intent signals detected."
    });
  }

  return engineResult({
    engine: "AdsCode24_SignalQuality",
    status: "PASS",
    score: 0.3,
    message: "Traffic quality healthy."
  });
};
