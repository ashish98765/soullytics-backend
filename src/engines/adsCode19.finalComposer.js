// src/engines/adsCode19.finalComposer.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class FinalAdsComposer extends AdsCode {
  run() {
    const engineResults = this.context.engineResults;

    if (!Array.isArray(engineResults)) {
      return engineResult({
        engine: "AdsCode19_FinalComposer",
        status: "FAIL",
        message: "Engine results missing or invalid. Decision cannot be made."
      });
    }

    const failCount = engineResults.filter(r => r.status === "FAIL").length;
    const warningCount = engineResults.filter(r => r.status === "WARNING").length;

    if (failCount > 0) {
      return engineResult({
        engine: "AdsCode19_FinalComposer",
        status: "DO_NOT_RUN",
        message: "One or more critical failures detected. Ads must not run."
      });
    }

    if (warningCount >= 2) {
      return engineResult({
        engine: "AdsCode19_FinalComposer",
        status: "PAUSE",
        message: "Multiple warnings detected. Fix issues before running ads."
      });
    }

    return engineResult({
      engine: "AdsCode19_FinalComposer",
      status: "RUN",
      message: "All systems healthy. Ads are cleared to run."
    });
  }
}

module.exports = { FinalAdsComposer };
