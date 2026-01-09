// src/engines/adsCode06.hookStrength.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class HookStrengthEngine extends AdsCode {
  run() {
    const hookType = this.context.hookType;
    const audienceType = this.context.audienceType;

    if (!hookType) {
      return engineResult({
        engine: "AdsCode06_HookStrength",
        status: "FAIL",
        message: "Hook type missing. Ad has no stopping power."
      });
    }

    if (hookType === "GENERIC") {
      return engineResult({
        engine: "AdsCode06_HookStrength",
        status: "FAIL",
        message: "Generic hook detected. Users will skip the ad."
      });
    }

    if (!audienceType) {
      return engineResult({
        engine: "AdsCode06_HookStrength",
        status: "FAIL",
        message: "Audience type missing. Hook strength cannot be evaluated."
      });
    }

    const allowedHooksByAudience = {
      COLD: ["QUESTION", "PAIN_POINT"],
      WARM: ["QUESTION", "PAIN_POINT", "BOLD_STATEMENT"],
      HOT: ["PAIN_POINT", "BOLD_STATEMENT"]
    };

    const allowedHooks = allowedHooksByAudience[audienceType];

    if (!allowedHooks) {
      return engineResult({
        engine: "AdsCode06_HookStrength",
        status: "FAIL",
        message: `Audience type '${audienceType}' is not supported.`
      });
    }

    if (!allowedHooks.includes(hookType)) {
      return engineResult({
        engine: "AdsCode06_HookStrength",
        status: "FAIL",
        message: `Hook type '${hookType}' is weak for '${audienceType}' audience.`
      });
    }

    return engineResult({
      engine: "AdsCode06_HookStrength",
      status: "PASS",
      score: 0.85,
      message: `Hook '${hookType}' is strong enough for '${audienceType}' audience.`
    });
  }
}

module.exports = { HookStrengthEngine };
