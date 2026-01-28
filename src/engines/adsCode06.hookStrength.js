const engineResult = require("../core/engineResult");

module.exports = function adsCode06_hookStrength(context) {
  const { hookType, audienceType } = context;

  if (!hookType) {
    return engineResult({
      engine: "AdsCode06_HookStrength",
      status: "FAIL",
      score: 0,
      message: "Hook type missing"
    });
  }

  if (hookType === "GENERIC") {
    return engineResult({
      engine: "AdsCode06_HookStrength",
      status: "FAIL",
      score: 0.2,
      message: "Generic hook detected"
    });
  }

  if (!audienceType) {
    return engineResult({
      engine: "AdsCode06_HookStrength",
      status: "FAIL",
      score: 0,
      message: "Audience type missing"
    });
  }

  const allowedHooks = {
    COLD: ["QUESTION", "PAIN_POINT"],
    WARM: ["QUESTION", "PAIN_POINT", "BOLD_STATEMENT"],
    HOT: ["PAIN_POINT", "BOLD_STATEMENT"]
  };

  if (!allowedHooks[audienceType]?.includes(hookType)) {
    return engineResult({
      engine: "AdsCode06_HookStrength",
      status: "FAIL",
      score: 0.4,
      message: `Hook ${hookType} weak for ${audienceType}`
    });
  }

  return engineResult({
    engine: "AdsCode06_HookStrength",
    status: "PASS",
    score: 0.85,
    message: "Hook strength is appropriate"
  });
};
