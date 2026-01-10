// src/engines/adsCode40.externalRealityAnchor.js

const { engineResult } = require("../core/engineResult");

class ExternalRealityAnchorEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const ctr = Number(this.context.ctr || 0);
    const cpl = Number(this.context.cpl || 0);

    // Benchmarks (can later come from DB / API)
    const industryCTR = Number(this.context.industryCTR || 1.2);
    const industryCPL = Number(this.context.industryCPL || 100);

    // ❌ Performance detached from reality
    if (ctr < industryCTR * 0.4 && cpl > industryCPL * 1.8) {
      return engineResult({
        engine: "AdsCode40_RealityAnchor",
        status: "FAIL",
        score: 1,
        message:
          "Performance far worse than industry benchmarks. Reality mismatch."
      });
    }

    // ⚠️ Slight deviation
    if (ctr < industryCTR * 0.7 || cpl > industryCPL * 1.3) {
      return engineResult({
        engine: "AdsCode40_RealityAnchor",
        status: "WARNING",
        score: 0.6,
        message:
          "Performance deviates from market norms. Monitor carefully."
      });
    }

    // ✅ Anchored to reality
    return engineResult({
      engine: "AdsCode40_RealityAnchor",
      status: "PASS",
      score: 0.3,
      message: "Performance aligned with external benchmarks."
    });
  }
}

module.exports = { ExternalRealityAnchorEngine };
