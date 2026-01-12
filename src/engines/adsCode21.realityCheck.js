const { engineResult } = require("../core/engineResult");

class RealityCheckEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const ctr = Number(this.context.ctr || 0);
    const cpc = Number(this.context.cpc || 0);
    const cpl = Number(this.context.cpl || 0);
    const conversionRate = Number(this.context.conversionRate || 0);
    const daysRunning = Number(this.context.daysRunning || 0);
    const volatility = Number(this.context.volatility || 0);
    const spendVelocity = Number(this.context.spendVelocity || 0);

    /**
     * 1️⃣ Fake signal trap
     * High CTR but zero learning = platform bait
     */
    if (ctr >= 2.5 && conversionRate === 0 && daysRunning >= 3) {
      return engineResult({
        engine: "AdsCode21_RealityCheck",
        status: "FAIL",
        impact: "HIGH",
        authority: 5,
        score: 0.9,
        message:
          "High CTR with zero conversions after learning window. Traffic illusion detected."
      });
    }

    /**
     * 2️⃣ Funnel economics mismatch
     */
    if (cpl > 0 && cpc > 0 && cpl / cpc > 6) {
      return engineResult({
        engine: "AdsCode21_RealityCheck",
        status: "WARNING",
        impact: "MEDIUM",
        authority: 4,
        score: 0.75,
        message:
          "CPL disproportionately higher than CPC. Funnel leakage or low intent traffic."
      });
    }

    /**
     * 3️⃣ Too early to trust
     */
    if (daysRunning < 3) {
      return engineResult({
        engine: "AdsCode21_RealityCheck",
        status: "WARNING",
        impact: "LOW",
        authority: 2,
        score: 0.55,
        message:
          "Campaign too new. Reality signal not yet stable."
      });
    }

    /**
     * 4️⃣ Platform push distortion
     */
    if (ctr > 3 && volatility > 0.6) {
      return engineResult({
        engine: "AdsCode21_RealityCheck",
        status: "WARNING",
        impact: "MEDIUM",
        authority: 4,
        score: 0.7,
        message:
          "CTR spike with high volatility. Possible platform distribution push."
      });
    }

    /**
     * 5️⃣ Burn velocity risk
     */
    if (spendVelocity > 1.5 && conversionRate < 0.5) {
      return engineResult({
        engine: "AdsCode21_RealityCheck",
        status: "FAIL",
        impact: "HIGH",
        authority: 5,
        score: 0.85,
        message:
          "Spend accelerating without conversion stability. Capital risk detected."
      });
    }

    /**
     * ✅ Reality confirmed
     */
    return engineResult({
      engine: "AdsCode21_RealityCheck",
      status: "PASS",
      impact: "LOW",
      authority: 2,
      score: 0.3,
      message:
        "Performance aligns with reality. Signals appear trustworthy."
    });
  }
}

module.exports = { RealityCheckEngine };
