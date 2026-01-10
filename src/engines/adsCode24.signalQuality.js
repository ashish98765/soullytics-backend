// src/engines/adsCode24.signalQuality.js

const { engineResult } = require("../core/engineResult");

class SignalQualityEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const ctr = Number(this.context.ctr || 0);
    const conversionRate = Number(this.context.conversionRate || 0);
    const avgSessionTime = Number(this.context.avgSessionTime || 0); // seconds
    const bounceRate = Number(this.context.bounceRate || 0); // 0–1

    // 🚨 Fake / curiosity traffic
    if (ctr >= 2 && conversionRate === 0 && avgSessionTime < 10) {
      return engineResult({
        engine: "AdsCode24_SignalQuality",
        status: "FAIL",
        score: 1,
        message:
          "High CTR but zero conversions and very low session time. Traffic quality is poor or misleading."
      });
    }

    // ⚠️ Weak intent signals
    if (bounceRate > 0.85 || avgSessionTime < 20) {
      return engineResult({
        engine: "AdsCode24_SignalQuality",
        status: "WARNING",
        score: 0.6,
        message:
          "Traffic engagement is weak. Audience intent may be low."
      });
    }

    // ✅ Clean signal
    return engineResult({
      engine: "AdsCode24_SignalQuality",
      status: "PASS",
      score: 0.3,
      message: "Traffic signals look healthy and intentional."
    });
  }
}

module.exports = { SignalQualityEngine };
