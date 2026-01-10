// src/engines/adsCode25.funnelIntegrity.js

const { engineResult } = require("../core/engineResult");

class FunnelIntegrityEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const clicks = Number(this.context.clicks || 0);
    const landingViews = Number(this.context.landingViews || 0);
    const conversions = Number(this.context.conversions || 0);
    const cpl = Number(this.context.cpl || 0);
    const aov = Number(this.context.aov || 0);

    // 🚨 Clicks but users not reaching landing page
    if (clicks > 50 && landingViews / clicks < 0.5) {
      return engineResult({
        engine: "AdsCode25_FunnelIntegrity",
        status: "FAIL",
        score: 1,
        message:
          "High click drop before landing page. Funnel or tracking is broken."
      });
    }

    // ⚠️ Landing views but no conversions
    if (landingViews > 100 && conversions === 0) {
      return engineResult({
        engine: "AdsCode25_FunnelIntegrity",
        status: "WARNING",
        score: 0.7,
        message:
          "Users reach landing page but are not converting. Funnel needs optimization."
      });
    }

    // ⚠️ Economics broken
    if (aov > 0 && cpl > aov * 0.6) {
      return engineResult({
        engine: "AdsCode25_FunnelIntegrity",
        status: "WARNING",
        score: 0.6,
        message:
          "Cost per lead is too high relative to AOV. Funnel economics are weak."
      });
    }

    // ✅ Funnel healthy
    return engineResult({
      engine: "AdsCode25_FunnelIntegrity",
      status: "PASS",
      score: 0.3,
      message: "Funnel flow and economics look healthy."
    });
  }
}

module.exports = { FunnelIntegrityEngine };
