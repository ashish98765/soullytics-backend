// src/engines/adsCode01.objectiveClarity.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class ObjectiveClarityEngine extends AdsCode {
  run() {
    const objective = this.context.objective;

    if (!objective) {
      return engineResult({
        engine: "AdsCode01_ObjectiveClarity",
        status: "FAIL",
        message: "Objective missing. System cannot decide ads without a clear goal."
      });
    }

    const allowedObjectives = ["LEADS", "SALES", "AWARENESS", "TRAFFIC"];

    if (!allowedObjectives.includes(objective)) {
      return engineResult({
        engine: "AdsCode01_ObjectiveClarity",
        status: "FAIL",
        message: `Invalid objective "${objective}". Must be one of ${allowedObjectives.join(", ")}.`
      });
    }

    return engineResult({
      engine: "AdsCode01_ObjectiveClarity",
      status: "PASS",
      score: 1,
      message: `Objective "${objective}" is clear and valid.`
    });
  }
}

module.exports = { ObjectiveClarityEngine };
