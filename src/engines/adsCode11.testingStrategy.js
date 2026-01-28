const engineResult = require("../core/engineResult");

module.exports = function adsCode11_testingStrategy(context) {
  const { testingStrategy, budget } = context;

  if (!testingStrategy) {
    return engineResult({
      engine: "AdsCode11_TestingStrategy",
      status: "FAIL",
      score: 0,
      message: "Testing strategy missing"
    });
  }

  if (testingStrategy === "NONE") {
    return engineResult({
      engine: "AdsCode11_TestingStrategy",
      status: "FAIL",
      score: 0,
      message: "No testing strategy defined"
    });
  }

  if (testingStrategy === "SCALE" && budget < 3000) {
    return engineResult({
      engine: "AdsCode11_TestingStrategy",
      status: "FAIL",
      score: 0.3,
      message: "Scaling without budget"
    });
  }

  return engineResult({
    engine: "AdsCode11_TestingStrategy",
    status: "PASS",
    score: 0.75,
    message: "Testing strategy acceptable"
  });
};
