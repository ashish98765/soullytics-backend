const { engineResult } = require("../core/engineResult");

module.exports = function adsCode50(context = {}) {
  const {
    overrideRate = 0,
    avgDecisionDelay = 0
  } = context;

  let profile = "BALANCED";
  if (overrideRate > 0.6) profile = "EMOTIONAL";
  if (avgDecisionDelay > 48) profile = "HESITANT";

  return engineResult({
    engine: "AdsCode50_AccountBehaviourProfile",
    status: "PASS",
    impact: "LOW",
    authority: 3,
    score: 0.5,
    message: `Account behavior classified as ${profile}`,
    profile
  });
};
