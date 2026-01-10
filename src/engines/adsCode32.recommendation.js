// src/engines/adsCode32.recommendation.js

const { engineResult } = require("../core/engineResult");

class RecommendationEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const warnings = (this.context.engineResults || []).filter(
      r => r.status === "WARNING"
    );

    if (warnings.length === 0) {
      return engineResult({
        engine: "AdsCode32_Recommendation",
        status: "PASS",
        score: 0.3,
        message: "No recommendations needed. System signals are clean."
      });
    }

    const recommendations = warnings.map(w => w.message);

    return engineResult({
      engine: "AdsCode32_Recommendation",
      status: "WARNING",
      score: 0.6,
      message: "Actionable recommendations generated.",
      data: {
        recommendations
      }
    });
  }
}

module.exports = { RecommendationEngine };
