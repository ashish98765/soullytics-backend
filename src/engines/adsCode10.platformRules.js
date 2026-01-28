const engineResult = require("../core/engineResult");

module.exports = function adsCode10_platformRules(context) {
  const { platform, creativeFormat, objective } = context;

  if (!platform || !creativeFormat) {
    return engineResult({
      engine: "AdsCode10_PlatformRules",
      status: "FAIL",
      score: 0,
      message: "Platform or creative format missing"
    });
  }

  if (creativeFormat === "TEXT") {
    return engineResult({
      engine: "AdsCode10_PlatformRules",
      status: "FAIL",
      score: 0,
      message: "Text-only ads banned"
    });
  }

  if (platform === "GOOGLE" && creativeFormat === "VIDEO") {
    return engineResult({
      engine: "AdsCode10_PlatformRules",
      status: "FAIL",
      score: 0,
      message: "Google video requires YouTube"
    });
  }

  if (platform === "YOUTUBE" && creativeFormat !== "VIDEO") {
    return engineResult({
      engine: "AdsCode10_PlatformRules",
      status: "FAIL",
      score: 0,
      message: "YouTube supports video only"
    });
  }

  return engineResult({
    engine: "AdsCode10_PlatformRules",
    status: "PASS",
    score: 0.8,
    message: "Platform rules satisfied"
  });
};
