const { PlatformSelectionEngine } = require("../adsCode03.platformSelection");
const { PlatformRulesEngine } = require("../adsCode10.platformRules");
const { PlatformBiasEngine } = require("../adsCode17.platformBias");

class PlatformRulesCoreEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    return [
      new PlatformSelectionEngine(this.context).run(),
      new PlatformRulesEngine(this.context).run(),
      new PlatformBiasEngine(this.context).run()
    ];
  }
}

module.exports = { PlatformRulesCoreEngine };
