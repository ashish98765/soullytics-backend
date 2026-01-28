const engineResult = require("../core/engineResult");

module.exports = function adsCode04_audienceTemperature(context) {
  const { audienceType, objective } = context;

  if (!audienceType || !objective) {
    return engineResult({
      engine: "AdsCode04_AudienceTemperature",
      status: "FAIL",
      message: "Audience type or objective missing"
    });
  }

  const map = {
    COLD: ["AWARENESS", "TRAFFIC"],
    WARM: ["LEADS", "TRAFFIC"],
    HOT: ["LEADS", "SALES"]
  };

  const allowed = map[audienceType];

  if (!allowed || !allowed.includes(objective)) {
    return engineResult({
      engine: "AdsCode04_AudienceTemperature",
      status: "FAIL",
      message: "Audience–objective mismatch"
    });
  }

  return engineResult({
    engine: "AdsCode04_AudienceTemperature",
    status: "PASS",
    score: 0.8,
    message: "Audience matches objective"
  });
};
