// src/engines/adsCode15.riskDetection.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class RiskDetectionEngine extends AdsCode {
  run() {
    const accountAgeDays = Number(this.context.accountAgeDays);
    const warningCount = Number(this.context.warningCount || 0);
    const isNewProduct = this.context.isNewProduct;
    const testingStrategy = this.context.testingStrategy;

    if (accountAgeDays && accountAgeDays < 7) {
      return engineResult({
        engine: "AdsCode15_RiskDetection",
        status: "WARNING",
        score: 0.4,
        message: "Ad account is very new. Platform volatility risk detected."
      });
    }

    if (warningCount >= 3) {
      return engineResult({
        engine: "AdsCode15_RiskDetection",
        status: "FAIL",
        message: "Multiple red flags detected. Risk level unacceptable."
      });
    }

    if (isNewProduct === true && testingStrategy === "SCALE") {
      return engineResult({
        engine: "AdsCode15_RiskDetection",
        status: "FAIL",
        message: "Scaling a new product without validation is high-risk."
      });
    }

    if (warningCount > 0) {
      return engineResult({
        engine: "AdsCode15_RiskDetection",
        status: "WARNING",
        score: 0.6,
        message: "Some risk signals present. Proceed cautiously."
      });
    }

    return engineResult({
      engine: "AdsCode15_RiskDetection",
      status: "PASS",
      score: 0.85,
      message: "No major risk factors detected."
    });
  }
}

module.exports = { RiskDetectionEngine };
