const { engineResult } = require("../core/engineResult");

module.exports = function adsCode14(context = {}) {
  const { objective, expectedCPL, expectedROAS } = context;

  if (!objective)
    return engineResult({ engine: "AdsCode14_PerformanceExpectation", status: "FAIL", message: "Objective missing." });

  if (objective === "LEADS" && expectedCPL < 150)
    return engineResult({ engine: "AdsCode14_PerformanceExpectation", status: "FAIL", message: "Unrealistic CPL." });

  if (objective === "SALES" && expectedROAS < 2)
    return engineResult({ engine: "AdsCode14_PerformanceExpectation", status: "FAIL", message: "Fantasy ROAS." });

  return engineResult({ engine: "AdsCode14_PerformanceExpectation", status: "PASS", score: 0.8, message: "Expectations realistic." });
};
