const { engineResult } = require("../core/engineResult");

module.exports = function adsCode47(context = {}) {
  const { burnRate = 0, decision = "PAUSE" } = context;

  const ignoreRisk =
    decision === "KILL" ? 0.85 :
    decision === "PAUSE" ? 0.6 :
    decision === "SCALE" ? 0.4 :
    0.25;

  const projectedLoss = burnRate * ignoreRisk;

  return engineResult({
    engine: "AdsCode47_CounterfactualSimulation",
    status: ignoreRisk > 0.7 ? "FAIL" : "WARNING",
    impact: ignoreRisk > 0.7 ? "HIGH" : "MEDIUM",
    authority: 4,
    score: Number(ignoreRisk.toFixed(2)),
    message: `Ignoring decision risks ${Math.round(projectedLoss * 100)}% capital erosion`
  });
};
