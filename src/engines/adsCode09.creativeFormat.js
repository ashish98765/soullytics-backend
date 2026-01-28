const engineResult = require("../core/engineResult");

module.exports = function adsCode09_creativeFormat(context) {
  const { creativeFormat, objective } = context;

  if (!creativeFormat || !objective) {
    return engineResult({
      engine: "AdsCode09_CreativeFormat",
      status: "FAIL",
      score: 0,
      message: "Creative format or objective missing"
    });
  }

  if (creativeFormat === "TEXT") {
    return engineResult({
      engine: "AdsCode09_CreativeFormat",
      status: "FAIL",
      score: 0.2,
      message: "Text-only ads ineffective"
    });
  }

  const allowed = {
    AWARENESS: ["VIDEO", "IMAGE"],
    TRAFFIC: ["IMAGE", "CAROUSEL"],
    LEADS: ["IMAGE", "CAROUSEL"],
    SALES: ["VIDEO"]
  };

  if (!allowed[objective]?.includes(creativeFormat)) {
    return engineResult({
      engine: "AdsCode09_CreativeFormat",
      status: "FAIL",
      score: 0.4,
      message: "Creative format unsuitable"
    });
  }

  return engineResult({
    engine: "AdsCode09_CreativeFormat",
    status: "PASS",
    score: 0.85,
    message: "Creative format aligned"
  });
};
