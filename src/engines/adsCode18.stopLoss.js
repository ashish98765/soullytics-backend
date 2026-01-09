// src/engines/adsCode18.stopLoss.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class StopLossEngine extends AdsCode {
  run() {
    const spendSoFar = Number(this.context.spendSoFar || 0);
    const maxAllowedLoss = Number(this.context.maxAllowedLoss);
    const performanceTrend = this.context.performanceTrend;
    const daysRunning = Number(this.context.daysRunning || 0);

    if (!maxAllowedLoss || maxAllowedLoss <= 0) {
      return engineResult({
        engine: "AdsCode18_StopLoss",
        status: "FAIL",
        message: "Max allowed loss not defined. System cannot protect capital."
      });
    }

    if (spendSoFar >= maxAllowedLoss) {
      return engineResult({
        engine: "AdsCode18_StopLoss",
        status: "FAIL",
        message: "Spend has crossed maximum allowed loss. Ads must stop immediately."
      });
    }

    if (performanceTrend === "DECLINING" && daysRunning >= 5) {
      return engineResult({
        engine: "AdsCode18_StopLoss",
        status: "FAIL",
        message: "Performance declining for multiple days. Continuing ads will burn money."
      });
    }

    if (spendSoFar >= maxAllowedLoss * 0.7) {
      return engineResult({
        engine: "AdsCode18_StopLoss",
        status: "WARNING",
        score: 0.4,
        message: "Spend approaching stop-loss threshold. Prepare to stop."
      });
    }

    if (performanceTrend === "FLAT") {
      return engineResult({
        engine: "AdsCode18_StopLoss",
        status: "WARNING",
        score: 0.5,
        message: "Performance flat. Watch closely for decline."
      });
    }

    return engineResult({
      engine: "AdsCode18_StopLoss",
      status: "PASS",
      score: 0.85,
      message: "Spend and performance within safe limits."
    });
  }
}

module.exports = { StopLossEngine };
