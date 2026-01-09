// src/engines/adsCode11.testingStrategy.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class TestingStrategyEngine extends AdsCode {
  run() {
    const testingStrategy = this.context.testingStrategy;
    const budget = Number(this.context.budget);

    if (!testingStrategy) {
      return engineResult({
        engine: "AdsCode11_TestingStrategy",
        status: "FAIL",
        message: "Testing strategy missing. Ads without testing are blind bets."
      });
    }

    if (testingStrategy === "NONE") {
      return engineResult({
        engine: "AdsCode11_TestingStrategy",
        status: "FAIL",
        message: "No testing strategy defined. System refuses to gamble money."
      });
    }

    if (testingStrategy === "SCALE" && budget < 3000) {
      return engineResult({
        engine: "AdsCode11_TestingStrategy",
        status: "FAIL",
        message: "Scaling without sufficient budget is reckless."
      });
    }

    if (testingStrategy === "A_B" && budget < 1000) {
      return engineResult({
        engine: "AdsCode11_TestingStrategy",
        status: "WARNING",
        score: 0.5,
        message: "A/B testing with low budget may give noisy results."
      });
    }

    if (testingStrategy === "MULTI_VARIANT" && budget >= 2000) {
      return engineResult({
        engine: "AdsCode11_TestingStrategy",
        status: "PASS",
        score: 0.85,
        message: "Multi-variant testing with sufficient budget is healthy."
      });
    }

    return engineResult({
      engine: "AdsCode11_TestingStrategy",
      status: "PASS",
      score: 0.7,
      message: "Testing strategy is acceptable under current constraints."
    });
  }
}

module.exports = { TestingStrategyEngine };
