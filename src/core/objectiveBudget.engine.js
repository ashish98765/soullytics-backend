// src/core/objectiveBudget.engine.js

const objectiveClarity = require("../engines/adsCode01.objectiveClarity");
const budgetReality = require("../engines/adsCode02.budgetReality");
const engineResult = require("./engineResult");

class ObjectiveBudgetEngine {
  constructor(context = {}) {
    this.context = context;
    this.engine = "objectiveBudget";
  }

  async run() {
    const results = [];

    try {
      const objective = await objectiveClarity.run(this.context);
      results.push(this._normalize("adsCode01_objectiveClarity", objective));
    } catch (err) {
      results.push(
        engineResult({
          engine: "adsCode01_objectiveClarity",
          status: "FAIL",
          message: err.message || "Objective clarity failed",
          confidence: 0
        })
      );
    }

    try {
      const budget = await budgetReality.run(this.context);
      results.push(this._normalize("adsCode02_budgetReality", budget));
    } catch (err) {
      results.push(
        engineResult({
          engine: "adsCode02_budgetReality",
          status: "FAIL",
          message: err.message || "Budget reality failed",
          confidence: 0
        })
      );
    }

    // overall validity
    const failed = results.find(r => r.status === "FAIL");

    if (failed) {
      return engineResult({
        engine: this.engine,
        status: "FAIL",
        score: 0,
        message: "Objective or budget validation failed",
        meta: { results }
      });
    }

    return engineResult({
      engine: this.engine,
      status: "PASS",
      score: 0.6,
      confidence: 0.6,
      message: "Objective and budget are aligned",
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

module.exports = ObjectiveBudgetEngine;
