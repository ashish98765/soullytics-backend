const engineResult = require("../core/engineResult");

module.exports = function adsCode05_messageAudienceMatch(context) {
  const { audienceType, messageType } = context;

  if (!audienceType || !messageType) {
    return engineResult({
      engine: "AdsCode05_MessageAudienceMatch",
      status: "FAIL",
      message: "Audience or message type missing"
    });
  }

  const map = {
    COLD: ["EDUCATIONAL"],
    WARM: ["EDUCATIONAL", "PROBLEM_AWARE"],
    HOT: ["SOLUTION_AWARE", "DIRECT_OFFER"]
  };

  const allowed = map[audienceType];

  if (!allowed || !allowed.includes(messageType)) {
    return engineResult({
      engine: "AdsCode05_MessageAudienceMatch",
      status: "FAIL",
      message: "Message not suitable for audience"
    });
  }

  return engineResult({
    engine: "AdsCode05_MessageAudienceMatch",
    status: "PASS",
    score: 0.85,
    message: "Message matches audience"
  });
};
