// src/engines/adsCode17.platformBias.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class PlatformBiasEngine extends AdsCode {
  run() {
    const platform = this.context.platform;
    const objective = this.context.objective;
    const historicalPerformance = this.context.historicalPlatformPerformance;

    if (!platform) {
      return engineResult({
        engine: "AdsCode17_PlatformBias",
        status: "FAIL",
        message: "Platform missing. Bias cannot be evaluated."
      });
    }

    if (!objective) {
      return engineResult({
        engine: "AdsCode17_PlatformBias",
        status: "FAIL",
        message: "Objective missing. Platform bias check impossible."
      });
    }

    if (historicalPerformance === "BAD") {
      return engineResult({
        engine: "AdsCode17_PlatformBias",
        status: "WARNING",
        score: 0.4,
        message: "Platform chosen despite poor historical performance."
      });
    }

    if (historicalPerformance === "UNKNOWN") {
      return engineResult({
        engine: "AdsCode17_PlatformBias",
        status: "WARNING",
        score: 0.5,
        message: "No historical data for platform. Decision may be biased."
      });
    }

    return engineResult({
      engine: "AdsCode17_PlatformBias",
      status: "PASS",
      score: 0.8,
      message: "Platform selection appears logic-driven, not biased."
    });
  }
}

module.exports = { PlatformBiasEngine };
