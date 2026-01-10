// src/engines/adsCode29.humanOverrideRisk.js

const { engineResult } = require("../core/engineResult");

class HumanOverrideRiskEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const overrideCount = Number(this.context.overrideCount || 0);
    const lastDecision = this.context.lastDecision || null;
    const lastWasWarning = lastDecision?.status === "WARNING";

    // 🚨 Repeated override behaviour
    if (overrideCount >= 3 && lastWasWarning) {
      return engineResult({
        engine: "AdsCode29_HumanOverrideRisk",
        status: "FAIL",
        score: 1,
        message:
          "Repeated human overrides detected. High ego or panic-driven risk."
      });
    }

    // ⚠️ Early override signals
    if (overrideCount >= 1 && lastWasWarning) {
      return engineResult({
        engine: "AdsCode29_HumanOverrideRisk",
        status: "WARNING",
        score: 0.7,
        message:
          "System warnings overridden by human decision. Risk increasing."
      });
    }

    // ✅ No override risk
    return engineResult({
      engine: "AdsCode29_HumanOverrideRisk",
      status: "PASS",
      score: 0.3,
      message: "No harmful human override patterns detected."
    });
  }
}

module.exports = { HumanOverrideRiskEngine };
