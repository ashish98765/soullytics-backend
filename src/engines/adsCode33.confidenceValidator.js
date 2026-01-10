// src/engines/adsCode33.confidenceValidator.js

const { engineResult } = require("../core/engineResult");

class ConfidenceValidatorEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const score = Number(this.context.finalConfidence || 0);
    const failCount = (this.context.engineResults || []).filter(
      r => r.status === "FAIL"
    ).length;

    // ❌ High confidence but failures present → false confidence
    if (score >= 70 && failCount > 0) {
      return engineResult({
        engine: "AdsCode33_ConfidenceValidator",
        status: "FAIL",
        score: 1,
        message:
          "High confidence detected despite critical failures. Confidence is invalid."
      });
    }

    // ⚠️ Low confidence but no failures → uncertainty
    if (score < 40 && failCount === 0) {
      return engineResult({
        engine: "AdsCode33_ConfidenceValidator",
        status: "WARNING",
        score: 0.7,
        message:
          "Low confidence without failures. Data may be insufficient or noisy."
      });
    }

    return engineResult({
      engine: "AdsCode33_ConfidenceValidator",
      status: "PASS",
      score: 0.3,
      message: "Confidence level validated."
    });
  }
}

module.exports = { ConfidenceValidatorEngine };
