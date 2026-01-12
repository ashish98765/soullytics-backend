const { PredictionEngine } = require("../adsCode41.predictionEngine");
const { SimulationEngine } = require("../adsCode42.simulationEngine");
const { CounterfactualSimulationEngine } = require("../adsCode47.counterfactualSimulation");

class PredictionSimulationEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    return [
      new PredictionEngine(this.context).run(),
      new SimulationEngine(this.context).run(),
      new CounterfactualSimulationEngine(this.context).run()
    ];
  }
}

module.exports = { PredictionSimulationEngine };
