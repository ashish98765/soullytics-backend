const { engineResult } = require("../core/engineResult");

module.exports = function adsCode14(context = {}) {
  const objective = context.objective;
  const expectedCPL = Number(context.expectedCPL);
  const expectedROAS = Number(context.expectedROAS);

  if (!objective) {
    return engineResult({
      engine: "AdsCode14_PerformanceExpectation",
      status: "FAIL",
      message: "Objective missing."
    });
  }

  if (objective === "LEADS" && expectedCPL) {
    if (expectedCPL < 150) {
      return engineResult({
        engine: "AdsCode14_PerformanceExpectation",
        status: "FAIL",
        message: "Expected CPL unrealistic."
      });
    }
    if (expectedCPL <= 300) {
      return engineResult({
        engine: "AdsCode14_PerformanceExpectation",
        status: "WARNING",
        score: 0.5,
        message: "Expected CPL optimistic."
      });
    }
  }

  if (objective === "SALES" && expectedROAS) {
    if (expectedROAS < 2) {
      return engineResult({
        engine: "AdsCode14_PerformanceExpectation",
        status: "FAIL",
        message: "Expected ROAS fantasy-level."
      });
    }
    if (expectedROAS <= 5) {
      return engineResult({
        engine: "AdsCode14_PerformanceExpectation",
        status: "WARNING",
        score: 0.5,
        message: "Expected ROAS optimistic."
      });
    }
  }

  return engineResult({
    engine: "AdsCode14_PerformanceExpectation",
    status: "PASS",
    score: 0.8,
    message: "Performance expectations realistic."
  });
};
