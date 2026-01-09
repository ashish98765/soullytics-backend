// src/engines/adsCode13.creativeFatigue.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class CreativeFatigueEngine extends AdsCode {
  run() {
    const creativeAgeDays = Number(this.context.creativeAgeDays);
    const frequency = Number(this.context.frequency);
    const isRepeatingCreative = this.context.isRepeatingCreative;

    if (!creativeAgeDays) {
      return engineResult({
        engine: "AdsCode13_CreativeFatigue",
        status: "FAIL",
        message: "Creative age missing. Fatigue cannot be evaluated."
      });
    }

    if (creativeAgeDays > 21) {
      return engineResult({
        engine: "AdsCode13_CreativeFatigue",
        status: "FAIL",
        message: "Creative is too old. Audience fatigue is guaranteed."
      });
    }

    if (frequency > 3 || isRepeatingCreative === true) {
      return engineResult({
        engine: "AdsCode13_CreativeFatigue",
        status: "WARNING",
        score: 0.5,
        message: "Creative fatigue signs detected. Performance may degrade."
      });
    }

    return engineResult({
      engine: "AdsCode13_CreativeFatigue",
      status: "PASS",
      score: 0.85,
      message: "Creative is fresh and unlikely to suffer fatigue."
    });
  }
}

module.exports = { CreativeFatigueEngine };
