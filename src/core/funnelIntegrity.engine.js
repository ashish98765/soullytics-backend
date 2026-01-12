const { FunnelIntegrityEngine } = require("../adsCode25.funnelIntegrity");
const { PerformanceExpectationEngine } = require("../adsCode14.performanceExpectation");

class FunnelIntegrityCoreEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    return [
      new FunnelIntegrityEngine(this.context).run(),
      new PerformanceExpectationEngine(this.context).run()
    ];
  }
}

module.exports = { FunnelIntegrityCoreEngine };
