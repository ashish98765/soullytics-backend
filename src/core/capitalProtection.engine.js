const { StopLossEngine } = require("../adsCode18.stopLoss");
const { CapitalProtectionEngine } = require("../adsCode37.capitalProtection");
const { HumanOverrideRiskEngine } = require("../adsCode29.humanOverrideRisk");

class CapitalProtectionCoreEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    return [
      new StopLossEngine(this.context).run(),
      new CapitalProtectionEngine(this.context).run(),
      new HumanOverrideRiskEngine(this.context).run()
    ];
  }
}

module.exports = { CapitalProtectionCoreEngine };
