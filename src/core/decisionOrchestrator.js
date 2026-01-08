// src/core/decisionOrchestrator.js

const { DecisionEngine } = require("../engines/decision.engine");

/**
 * Orchestrates execution of Ads Codes 1–19
 */
class DecisionOrchestrator {
  constructor(adsCodes = []) {
    this.adsCodes = adsCodes;
    this.decisionEngine = new DecisionEngine();
  }

  async run(context) {
    this.decisionEngine.reset();

    for (const AdsCodeClass of this.adsCodes) {
      const adsCodeInstance = new AdsCodeClass(context);
      const result = await adsCodeInstance.run();

      this.decisionEngine.register(result);
    }

    return this.decisionEngine.resolve();
  }
}

module.exports = { DecisionOrchestrator };
