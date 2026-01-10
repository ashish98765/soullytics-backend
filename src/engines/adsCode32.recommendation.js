// src/engines/adsCode32.recommendation.js

const { engineResult } = require("../core/engineResult");

class RecommendationEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const finalDecision = this.context.finalDecision;
    const warnings = this.context.engineResults?.filter(
      r => r.status === "WARNING"
    ) || [];

    if (finalDecision === "DO_NOT_RUN") {
      return engineResult({
        engine: "AdsCode32_Recommendation",
        status: "FAIL",
        score: 1,
        data: {
          action: "STOP_ADS",
          recommendation:
            "Critical risks detected. Fix funnel, creative, or targeting before retrying."
        },
        message: "Do not run ads. Immediate corrective action required."
      });
    }

    if (finalDecision === "PAUSE") {
      return engineResult({
        engine: "AdsCode32_Recommendation",
        status: "WARNING",
        score: 0.6,
        data: {
          action: "PAUSE_AND_FIX",
          recommendation:
            warnings.length >= 2
              ? "Multiple warnings detected. Refresh creative or audience."
              : "Monitor closely and apply minor optimizations."
        },
        message: "Pause ads and apply recommended fixes."
      });
    }

    if (finalDecision === "RUN") {
      return engineResult({
        engine: "AdsCode32_Recommendation",
        status: "PASS",
        score: 0.3,
        data: {
          action: "SCALE_SAFELY",
          recommendation:
            "System healthy. Increase budget gradually (10–20%) and monitor."
        },
        message: "Ads cleared to run. Safe scaling recommended."
      });
    }

    return engineResult({
      engine: "AdsCode32_Recommendation",
      status: "WARNING",
      score: 0.5,
      message: "Unknown decision state. Manual review advised."
    });
  }
}

module.exports = { RecommendationEngine };
