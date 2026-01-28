const { engineResult } = require("../core/engineResult");

module.exports = function adsCode13(context = {}) {
  const { creativeAgeDays, frequency, isRepeatingCreative } = context;

  if (!creativeAgeDays)
    return engineResult({ engine: "AdsCode13_CreativeFatigue", status: "FAIL", message: "Creative age missing." });

  if (creativeAgeDays > 21)
    return engineResult({ engine: "AdsCode13_CreativeFatigue", status: "FAIL", message: "Creative too old. Fatigue guaranteed." });

  if (frequency > 3 || isRepeatingCreative)
    return engineResult({ engine: "AdsCode13_CreativeFatigue", status: "WARNING", score: 0.5, message: "Fatigue signals detected." });

  return engineResult({ engine: "AdsCode13_CreativeFatigue", status: "PASS", score: 0.85, message: "Creative is fresh." });
};
