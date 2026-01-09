// src/engines/adsCode14.performanceExpectation.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class PerformanceExpectationEngine extends AdsCode {
  run() {
    const objective = this.context.objective;
    const expectedCPL = Number(this.context.expectedCPL);
    const expectedROAS = Number(this.context.expectedROAS);

    if (!objective) {
      return engineResult({
        engine: "AdsCode14_PerformanceExpectation",
        status: "FAIL",
        message: "Objective missing. Performance expectation cannot be evaluated."
      });
    }

    // Leads expectations
    if (objective === "LEADS" && expectedCPL) {
      if (expectedCPL <= 150) {
        return engineResult({
          engine: "AdsCode14_PerformanceExpectation",
          status: "FAIL",
          message: "Expected CPL is unrealistically low. Expectation detached from market reality."
        });
      }

      if (expectedCPL <= 300) {
        return engineResult({
          engine: "AdsCode14_PerformanceExpectation",
          status: "WARNING",
          score: 0.5,
          message: "Expected CPL is optimistic. Results may disappoint."
        });
      }
    }

    // Sales expectations
    if (objective === "SALES" && expectedROAS) {
      if (expectedROAS >= 8) {
        return engineResult({
          engine: "AdsCode14_PerformanceExpectation",
          status: "FAIL",
          message: "Expected ROAS is fantasy-level. Ads should not run on hope."
        });
      }

      if (expectedROAS >= 5) {
        return engineResult({
          engine: "AdsCode14_PerformanceExpectation",
          status: "WARNING",
          score: 0.5,
          message: "Expected ROAS is optimistic. Proceed with caution."
        });
      }
    }

    return engineResult({
      engine: "AdsCode14_PerformanceExpectation",
      status: "PASS",
      score: 0.8,
      message: "Performance expectations are within realistic bounds."
    });
  }
}

module.exports = { PerformanceExpectationEngine };
