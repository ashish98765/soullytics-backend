const { DecisionEngine } = require("../decision.engine");

class DecisionCoreEngine {
  constructor() {
    this.engine = new DecisionEngine();
  }

  run(results) {
    results.flat().forEach(r => this.engine.register(r));
    return this.engine.resolve();
  }
}

module.exports = { DecisionCoreEngine };
