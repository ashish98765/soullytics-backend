const { engineResult } = require("../core/engineResult");

class DecisionConfidenceScore {
  constructor(context) {
    this.context = context;
  }

  run() {
    const {
      signalStrength = 0,
      stabilityScore = 0,
      dataReliability = 0,
      predictionVariance = 0.5,
      finalDecision = "PAUSE"
    } = this.context;

    const base =
      signalStrength * 0.35 +
      stabilityScore * 0.35 +
      dataReliability * 0.2 +
      (1 - predictionVariance) * 0.1;

    const confidenceScore = Math.min(Math.max(base, 0), 1);

    let band = "LOW";
    if (confidenceScore > 0.75) band = "HIGH";
    else if (confidenceScore > 0.5) band = "MEDIUM";

    return engineResult({
      engine: "adsCode46.decisionConfidenceScore",
      status: band,
      impact: band,
      authority: 5,
      score: confidenceScore,
      message: `Decision confidence is ${band}`
    });
  }
}

module.exports = { DecisionConfidenceScore };
