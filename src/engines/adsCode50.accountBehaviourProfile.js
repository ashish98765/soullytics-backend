const { engineResult } = require("../core/engineResult");

class AccountBehaviorProfile {
  constructor(context) {
    this.context = context;
  }

  run() {
    const {
      overrideRate = 0,
      avgDecisionDelay = 0
    } = this.context;

    let profile = "BALANCED";
    if (overrideRate > 0.6) profile = "EMOTIONAL";
    if (avgDecisionDelay > 48) profile = "HESITANT";

    return engineResult({
      engine: "adsCode50.accountBehaviorProfile",
      status: "PASS",
      impact: "LOW",
      authority: 3,
      score: 0.5,
      message: `Account behavior classified as ${profile}`
    });
  }
}

module.exports = { AccountBehaviorProfile };
