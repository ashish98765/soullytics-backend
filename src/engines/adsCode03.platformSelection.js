// src/engines/adsCode03.platformSelection.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class PlatformSelectionEngine extends AdsCode {
  run() {
    const objective = this.context.objective;
    const platform = this.context.platform;

    if (!objective) {
      return engineResult({
        engine: "AdsCode03_PlatformSelection",
        status: "FAIL",
        message: "Objective missing. Platform cannot be selected blindly."
      });
    }

    if (!platform) {
      return engineResult({
        engine: "AdsCode03_PlatformSelection",
        status: "FAIL",
        message: "Platform missing. System cannot evaluate platform suitability."
      });
    }

    const allowedPlatformsByObjective = {
      LEADS: ["META", "GOOGLE"],
      SALES: ["GOOGLE"],
      AWARENESS: ["META", "YOUTUBE"],
      TRAFFIC: ["META", "GOOGLE"]
    };

    const allowedPlatforms = allowedPlatformsByObjective[objective];

    if (!allowedPlatforms) {
      return engineResult({
        engine: "AdsCode03_PlatformSelection",
        status: "FAIL",
        message: `Objective '${objective}' is not supported by the system.`
      });
    }

    if (!allowedPlatforms.includes(platform)) {
      return engineResult({
        engine: "AdsCode03_PlatformSelection",
        status: "FAIL",
        message: `Platform '${platform}' is not suitable for objective '${objective}'.`
      });
    }

    return engineResult({
      engine: "AdsCode03_PlatformSelection",
      status: "PASS",
      score: 0.85,
      message: `Platform '${platform}' is appropriate for objective '${objective}'.`
    });
  }
}

module.exports = { PlatformSelectionEngine };
