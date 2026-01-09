// src/engines/adsCode16.scalingReadiness.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class ScalingReadinessEngine extends AdsCode {
  run() {
    const testingComplete = this.context.testingComplete;
    const warningCount = Number(this.context.warningCount || 0);
    const performanceStable = this.context.performanceStable;
    const budget = Number(this.context.budget);

    if (testingComplete !== true) {
      return engineResult({
        engine: "AdsCode16_ScalingReadiness",
        status: "FAIL",
        message: "Testing not complete. Scaling is not allowed."
      });
    }

    if (warningCount >= 2) {
      return engineResult({
        engine: "AdsCode16_ScalingReadiness",
        status: "FAIL",
        message: "Multiple warnings present. Scaling is unsafe."
      });
    }

    if (performanceStable !== true) {
      return engineResult({
        engine: "AdsCode16_ScalingReadiness",
        status: "WARNING",
        score: 0.5,
        message: "Performance not stable yet. Scaling may increase volatility."
      });
    }

    if (budget < 3000) {
      return engineResult({
        engine: "AdsCode16_ScalingReadiness",
        status: "WARNING",
        score: 0.5,
        message: "Budget is low for meaningful scaling."
      });
    }

    return engineResult({
      engine: "AdsCode16_ScalingReadiness",
      status: "PASS",
      score: 0.9,
      message: "System is ready for controlled scaling."
    });
  }
}

module.exports = { ScalingReadinessEngine };
