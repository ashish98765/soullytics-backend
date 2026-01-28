const engineResult = require("../core/engineResult");

module.exports = function adsCode01_objectiveClarity(context) {
  const objective = context.objective;

  if (!objective) {
    return engineResult({
      engine: "AdsCode01_ObjectiveClarity",
      status: "FAIL",
      score: 0,
      message: "Objective missing"
    });
  }

  const allowed = ["LEADS", "SALES", "AWARENESS", "TRAFFIC"];

  if (!allowed.includes(objective)) {
    return engineResult({
      engine: "AdsCode01_ObjectiveClarity",
      status: "FAIL",
      score: 0,
      message: `Invalid objective ${objective}`
    });
  }

  return engineResult({
    engine: "AdsCode01_ObjectiveClarity",
    status: "PASS",
    score: 1,
    message: `Objective ${objective} is valid`
  });
};
