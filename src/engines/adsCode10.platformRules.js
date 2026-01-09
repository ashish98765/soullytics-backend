// src/engines/adsCode10.platformRules.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class PlatformRulesEngine extends AdsCode {
  run() {
    const platform = this.context.platform;
    const creativeFormat = this.context.creativeFormat;
    const objective = this.context.objective;

    if (!platform) {
      return engineResult({
        engine: "AdsCode10_PlatformRules",
        status: "FAIL",
        message: "Platform missing. Rule evaluation impossible."
      });
    }

    if (!creativeFormat) {
      return engineResult({
        engine: "AdsCode10_PlatformRules",
        status: "FAIL",
        message: "Creative format missing. Platform compliance unknown."
      });
    }

    // TEXT ads banned everywhere
    if (creativeFormat === "TEXT") {
      return engineResult({
        engine: "AdsCode10_PlatformRules",
        status: "FAIL",
        message: "Text-only ads violate platform effectiveness rules."
      });
    }

    // META rules
    if (platform === "META") {
      if (objective === "SALES" && creativeFormat === "IMAGE") {
        return engineResult({
          engine: "AdsCode10_PlatformRules",
          status: "WARNING",
          score: 0.6,
          message: "Sales via image on Meta is risky and often underperforms."
        });
      }
    }

    // GOOGLE rules
    if (platform === "GOOGLE") {
      if (objective === "AWARENESS") {
        return engineResult({
          engine: "AdsCode10_PlatformRules",
          status: "WARNING",
          score: 0.5,
          message: "Google is not ideal for pure awareness campaigns."
        });
      }
      if (creativeFormat === "VIDEO") {
        return engineResult({
          engine: "AdsCode10_PlatformRules",
          status: "FAIL",
          message: "Video ads on Google require YouTube placement."
        });
      }
    }

    // YOUTUBE rules
    if (platform === "YOUTUBE") {
      if (creativeFormat !== "VIDEO") {
        return engineResult({
          engine: "AdsCode10_PlatformRules",
          status: "FAIL",
          message: "YouTube supports only video creatives."
        });
      }
      if (objective === "SALES") {
        return engineResult({
          engine: "AdsCode10_PlatformRules",
          status: "WARNING",
          score: 0.6,
          message: "Direct sales on YouTube require strong trust layers."
        });
      }
    }

    return engineResult({
      engine: "AdsCode10_PlatformRules",
      status: "PASS",
      score: 0.8,
      message: "Creative complies with platform rules."
    });
  }
}

module.exports = { PlatformRulesEngine };
