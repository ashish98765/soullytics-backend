const { engineResult } = require("../core/engineResult");

module.exports = function adsCode25(context = {}) {
  const clicks = Number(context.clicks || 0);
  const landingViews = Number(context.landingViews || 0);
  const conversions = Number(context.conversions || 0);
  const aov = Number(context.aov || 0);
  const cpl = Number(context.cpl || 0);

  if (clicks > 50 && landingViews / clicks < 0.5) {
    return engineResult({
      engine: "AdsCode25_FunnelIntegrity",
      status: "FAIL",
      authority: 4,
      score: 1,
      message: "Click-to-landing drop detected."
    });
  }

  if (landingViews > 100 && conversions === 0) {
    return engineResult({
      engine: "AdsCode25_FunnelIntegrity",
      status: "WARNING",
      authority: 3,
      score: 0.7,
      message: "Landing page receives traffic but no conversions."
    });
  }

  if (aov > 0 && cpl > aov * 0.6) {
    return engineResult({
      engine: "AdsCode25_FunnelIntegrity",
      status: "WARNING",
      authority: 3,
      score: 0.6,
      message: "Poor unit economics detected."
    });
  }

  return engineResult({
    engine: "AdsCode25_FunnelIntegrity",
    status: "PASS",
    authority: 2,
    score: 0.3,
    message: "Funnel integrity intact."
  });
};
