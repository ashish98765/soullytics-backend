// src/engines/adsCode04.audienceTemperature.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class AudienceTemperatureEngine extends AdsCode {
  run() {
    const audienceType = this.context.audienceType;
    const objective = this.context.objective;

    if (!audienceType) {
      return engineResult({
        engine: "AdsCode04_AudienceTemperature",
        status: "FAIL",
        message: "Audience type missing. Cannot judge ad readiness."
      });
    }

    if (!objective) {
      return engineResult({
        engine: "AdsCode04_AudienceTemperature",
        status: "FAIL",
        message: "Objective missing. Cannot match audience intent."
      });
    }

    const allowedObjectivesByAudience = {
      COLD: ["AWARENESS", "TRAFFIC"],
      WARM: ["LEADS", "TRAFFIC"],
      HOT: ["LEADS", "SALES"]
    };

    const allowedObjectives = allowedObjectivesByAudience[audienceType];

    if (!allowedObjectives) {
      return engineResult({
        engine: "AdsCode04_AudienceTemperature",
        status: "FAIL",
        message: `Audience type '${audienceType}' is not supported.`
      });
    }

    if (!allowedObjectives.includes(objective)) {
      return engineResult({
        engine: "AdsCode04_AudienceTemperature",
        status: "FAIL",
        message: `Objective '${objective}' is not suitable for '${audienceType}' audience.`
      });
    }

    return engineResult({
      engine: "AdsCode04_AudienceTemperature",
      status: "PASS",
      score: 0.8,
      message: `Audience '${audienceType}' matches objective '${objective}'.`
    });
  }
}

module.exports = { AudienceTemperatureEngine };
