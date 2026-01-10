// src/engines/adsCode30.founderRiskProfile.js

const { engineResult } = require("../core/engineResult");

class FounderRiskProfileEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    let riskProfile = this.context.riskProfile || "BALANCED";
    const overrideCount = Number(this.context.overrideCount || 0);
    const lastDecision = this.context.lastDecision || {};

    // 🔻 Auto downgrade if human keeps overriding system
    if (overrideCount >= 3) {
      riskProfile = "CONSERVATIVE";
    }

    // 🚨 Conservative founder + any warning = pause
    if (riskProfile === "CONSERVATIVE" && lastDecision.status === "WARNING") {
      return engineResult({
        engine: "AdsCode30_FounderRiskProfile",
        status: "FAIL",
        score: 1,
        message:
          "Conservative risk profile with recent warning. Ads should not proceed."
      });
    }

    // ⚠️ Aggressive founder tolerates more risk
    if (riskProfile === "AGGRESSIVE" && overrideCount >= 1) {
      return engineResult({
        engine: "AdsCode30_FounderRiskProfile",
        status: "WARNING",
        score: 0.6,
        message:
          "Aggressive risk profile detected. Monitor closely to avoid over-scaling."
      });
    }

    // ⚠️ Balanced founder, mixed signals
    if (riskProfile === "BALANCED" && overrideCount >= 2) {
      return engineResult({
        engine: "AdsCode30_FounderRiskProfile",
        status: "WARNING",
        score: 0.7,
        message:
          "Balanced risk profile but repeated overrides observed."
      });
    }

    // ✅ Risk profile acceptable
    return engineResult({
      engine: "AdsCode30_FounderRiskProfile",
      status: "PASS",
      score: 0.3,
      message:
        `Risk profile (${riskProfile}) aligned with system recommendations.`
    });
  }
}

module.exports = { FounderRiskProfileEngine };
