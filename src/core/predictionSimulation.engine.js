// src/core/predictionSimulation.engine.js

const { PredictionEngine } = require("../adsCode41.predictionEngine");
const { SimulationEngine } = require("../adsCode42.simulationEngine");
const { CounterfactualSimulationEngine } = require("../adsCode47.counterfactualSimulation");
const engineResult = require("./engineResult");

class PredictionSimulationEngine {
  constructor(context = {}) {
    this.context = context;
    this.engine = "predictionSimulation";
  }

  async run() {
    const results = [];

    try {
      const res = await new PredictionEngine(this.context).run();
      results.push(this._normalize("adsCode41_prediction", res));
    } catch (err) {
      results.push(
        engineResult({
          engine: "adsCode41_prediction",
          status: "FAIL",
          message: err.message || "Prediction failed",
          confidence: 0
        })
      );
    }

    try {
      const res = await new SimulationEngine(this.context).run();
      results.push(this._normalize("adsCode42_simulation", res));
    } catch (err) {
      results.push(
        engineResult({
          engine: "adsCode42_simulation",
          status: "FAIL",
          message: err.message || "Simulation failed",
          confidence: 0
        })
      );
    }

    try {
      const res = await new CounterfactualSimulationEngine(this.context).run();
      results.push(this._normalize("adsCode47_counterfactual", res));
    } catch (err) {
      results.push(
        engineResult({
          engine: "adsCode47_counterfactual",
          status: "FAIL",
          message: err.message || "Counterfactual simulation failed",
          confidence: 0
        })
      );
    }

    const failed = results.find(r => r.status === "FAIL");

    if (failed) {
      return engineResult({
        engine: this.engine,
        status: "WARNING",
        score: 0.3,
        message: "Prediction uncertainty high",
        meta: { results }
      });
    }

    return engineResult({
      engine: this.engine,
      status: "PASS",
      score: 0.7,
      confidence: 0.7,
      message: "Prediction stable",
      meta: { results }
    });
  }

  _normalize(engineName, res) {
    if (res && res.engine && res.status) return res;

    return engineResult({
      engine: engineName,
      status: res?.status || "PASS",
      score: res?.score ?? 0.5,
      confidence: res?.confidence ?? 0.5,
      message: res?.message || "OK",
      meta: res || {}
    });
  }
}

module.exports = PredictionSimulationEngine;
