// src/engines/adsCode09.creativeFormat.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class CreativeFormatEngine extends AdsCode {
  run() {
    const creativeFormat = this.context.creativeFormat;
    const objective = this.context.objective;

    if (!creativeFormat) {
      return engineResult({
        engine: "AdsCode09_CreativeFormat",
        status: "FAIL",
        message: "Creative format missing. Ad format decision impossible."
      });
    }

    if (!objective) {
      return engineResult({
        engine: "AdsCode09_CreativeFormat",
        status: "FAIL",
        message: "Objective missing. Creative format cannot be evaluated."
      });
    }

    if (creativeFormat === "TEXT") {
      return engineResult({
        engine: "AdsCode09_CreativeFormat",
        status: "FAIL",
        message: "Text-only ads are ineffective in paid platforms."
      });
    }

    const allowedFormatsByObjective = {
      AWARENESS: ["VIDEO", "IMAGE"],
      TRAFFIC: ["IMAGE", "CAROUSEL"],
      LEADS: ["IMAGE", "CAROUSEL"],
      SALES: ["VIDEO"]
    };

    const allowedFormats = allowedFormatsByObjective[objective];

    if (!allowedFormats) {
      return engineResult({
        engine: "AdsCode09_CreativeFormat",
        status: "FAIL",
        message: `Objective '${objective}' is not supported by creative engine.`
      });
    }

    if (!allowedFormats.includes(creativeFormat)) {
      return engineResult({
        engine: "AdsCode09_CreativeFormat",
        status: "FAIL",
        message: `Creative format '${creativeFormat}' is unsuitable for '${objective}' objective.`
      });
    }

    return engineResult({
      engine: "AdsCode09_CreativeFormat",
      status: "PASS",
      score: 0.85,
      message: `Creative format '${creativeFormat}' fits '${objective}' objective.`
    });
  }
}

module.exports = { CreativeFormatEngine };
