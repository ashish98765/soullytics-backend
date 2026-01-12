const { engineResult } = require("../core/engineResult");

class CounterfactualSimulation {
  constructor(context) {
    this.context = context;
  }

  run() {
    const { burnRate = 0, decision = "PAUSE" } = this.context;

    const ignoreRisk =
      decision === "KILL" ? 0.85 :
      decision === "PAUSE" ? 0.6 :
      decision === "SCALE" ? 0.4 : 0.25;

    const projectedLoss = burnRate * ignoreRisk;

    return engineResult({
      engine: "adsCode47.counterfactualSimulation",
      status: ignoreRisk > 0.7 ? "FAIL" : "WARNING",
      impact: ignoreRisk > 0.7 ? "HIGH" : "MEDIUM",
      authority: 4,
      score: ignoreRisk,
      message: `Ignoring decision risks ~${Math.round(projectedLoss * 100)}% capital erosion`
    });
  }
}

module.exports = { CounterfactualSimulation };
