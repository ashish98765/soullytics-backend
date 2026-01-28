const engineResult = require("../core/engineResult");

module.exports = function adsCode03_platformSelection(context) {
  const { objective, platform } = context;

  if (!objective) {
    return engineResult({
      engine: "AdsCode03_PlatformSelection",
      status: "FAIL",
      score: 0,
      message: "Objective missing"
    });
  }

  if (!platform) {
    return engineResult({
      engine: "AdsCode03_PlatformSelection",
      status: "FAIL",
      score: 0,
      message: "Platform missing"
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
      score: 0,
      message: `Objective ${objective} not supported`
    });
  }

  if (!allowedPlatforms.includes(platform)) {
    return engineResult({
      engine: "AdsCode03_PlatformSelection",
      status: "FAIL",
      score: 0.4,
      message: `Platform ${platform} not suitable for objective ${objective}`
    });
  }

  return engineResult({
    engine: "AdsCode03_PlatformSelection",
    status: "PASS",
    score: 0.85,
    message: `Platform ${platform} is appropriate for objective ${objective}`
  });
};
