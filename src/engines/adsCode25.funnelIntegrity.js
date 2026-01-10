const { engineResult } = require("../core/engineResult");

class FunnelIntegrityEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const clicks = Number(this.context.clicks || 0);
    const landingViews = Number(this.context.landingViews || 0);
    const conversions = Number(this.context.conversions || 0);
    const aov = Number(this.context.aov || 0);
    const cpl = Number(this.context.cpl || 0);

    // Tracking or funnel broken
    if (clicks > 50 && landingViews / clicks < 0.5) {
      return engineResult({
        engine: "AdsCode25_FunnelIntegrity",
        status: "FAIL",
        impact: "HIGH",
        authority: 4,
        score: 1,
        message: "Click-to-landing drop detected. Funnel or tracking broken."
      });
    }

    // Users reach LP but don't convert
    if (landingViews > 100 && conversions === 0) {
      return engineResult({
        engine: "AdsCode25_FunnelIntegrity",
        status: "WARNING",
        impact: "MEDIUM",
        authority: 3,
        score: 0.7,
        message: "Landing page receives traffic but no conversions."
      });
    }

    // Bad unit economics
    if (aov > 0 && cpl > aov * 0.6) {
      return engineResult({
        engine: "AdsCode25_FunnelIntegrity",
        status: "WARNING",
        impact: "MEDIUM",
        authority: 3,
        score: 0.6,
        message: "Cost per lead too high relative to AOV."
      });
    }

    return engineResult({
      engine: "AdsCode25_FunnelIntegrity",
      status: "PASS",
      impact: "LOW",
      authority: 2,
      score: 0.3,
      message: "Funnel structure and economics are healthy."
    });
  }
}

module.exports = { FunnelIntegrityEngine };
