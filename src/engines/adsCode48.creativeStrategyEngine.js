const { engineResult } = require("../core/engineResult");

class CreativeStrategyEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const {
      creativeFatigue = 0,
      hookStrength = 0,
      audienceTemperature = "COLD"
    } = this.context;

    let strategy = "MAINTAIN";
    if (creativeFatigue > 0.7) strategy = "REFRESH";
    if (hookStrength < 0.4) strategy = "HOOK_REWRITE";
    if (audienceTemperature === "HOT") strategy = "PROOF_FOCUSED";

    return engineResult({
      engine: "adsCode48.creativeStrategyEngine",
      status: "PASS",
      impact: "MEDIUM",
      authority: 3,
      score: 0.6,
      message: `Recommended creative strategy: ${strategy}`
    });
  }
}

module.exports = { CreativeStrategyEngine };
