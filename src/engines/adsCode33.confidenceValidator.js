// src/engines/adsCode33.confidenceValidator.js

const { engineResult } = require("../core/engineResult");

class ConfidenceValidatorEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const confidence = Number(this.context.confidence || 0);
    const finalDecision = this.context.finalDecision;
    const warnings =
      this.context.engineResults?.filter(r => r.status === "WARNING") || [];

    // ❌ Overconfidence detected
    if (confidence >= 80 && warnings.length >= 2) {
      return engineResult({
        engine: "AdsCode33_ConfidenceValidator",
        status: "WARNING",
        score: 0.7,
        message:
          "High confidence despite multiple warnings. Possible overconfidence bias."
      });
    }

    // ❌ Under-confidence while RUN
    if (finalDecision === "RUN" && confidence < 40) {
      return engineResult({
        engine: "AdsCode33_ConfidenceValidator",
        status: "FAIL",
        score: 1,
        message:
          "System recommends RUN but confidence is very low. Risky execution."
      });
    }

    // ⚠ Conservative confidence
    if (finalDecision !== "RUN" && confidence > 70) {
      return engineResult({
        engine: "AdsCode33_ConfidenceValidator",
        status: "WARNING",
        score: 0.6,
        message:
          "Decision is conservative but confidence remains high. Recheck assumptions."
      });
    }

    // ✅ Confidence aligned
    return engineResult({
      engine: "AdsCode33_ConfidenceValidator",
      status: "PASS",
      score: 0.3,
      message: "Decision confidence is aligned with system signals."
    });
  }
}

module.exports = { ConfidenceValidatorEngine };
