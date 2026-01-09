// src/engines/adsCode08.ctaAggression.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class CTAAggressionEngine extends AdsCode {
  run() {
    const ctaType = this.context.ctaType;
    const audienceType = this.context.audienceType;

    if (!ctaType) {
      return engineResult({
        engine: "AdsCode08_CTAAggression",
        status: "FAIL",
        message: "CTA type missing. Conversion intent cannot be evaluated."
      });
    }

    if (!audienceType) {
      return engineResult({
        engine: "AdsCode08_CTAAggression",
        status: "FAIL",
        message: "Audience type missing. CTA aggressiveness cannot be judged."
      });
    }

    // Hard CTA rules
    if (ctaType === "HARD" && audienceType !== "HOT") {
      return engineResult({
        engine: "AdsCode08_CTAAggression",
        status: "FAIL",
        message: "Aggressive CTA on non-hot audience creates resistance."
      });
    }

    // Soft CTA under-selling
    if (ctaType === "SOFT" && audienceType === "HOT") {
      return engineResult({
        engine: "AdsCode08_CTAAggression",
        status: "WARNING",
        score: 0.5,
        message: "Soft CTA on hot audience may underutilize conversion intent."
      });
    }

    return engineResult({
      engine: "AdsCode08_CTAAggression",
      status: "PASS",
      score: 0.85,
      message: `CTA '${ctaType}' matches '${audienceType}' audience readiness.`
    });
  }
}

module.exports = { CTAAggressionEngine };
