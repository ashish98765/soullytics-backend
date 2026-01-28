const engineResult = require("../core/engineResult");

module.exports = function adsCode07_emotionalIntensity(context) {
  const { emotionalIntensity, audienceType } = context;

  if (!emotionalIntensity) {
    return engineResult({
      engine: "AdsCode07_EmotionalIntensity",
      status: "FAIL",
      score: 0,
      message: "Emotional intensity missing"
    });
  }

  if (!audienceType) {
    return engineResult({
      engine: "AdsCode07_EmotionalIntensity",
      status: "FAIL",
      score: 0,
      message: "Audience type missing"
    });
  }

  if (emotionalIntensity === "LOW") {
    return engineResult({
      engine: "AdsCode07_EmotionalIntensity",
      status: "FAIL",
      score: 0.3,
      message: "Low emotional pull"
    });
  }

  if (emotionalIntensity === "HIGH" && audienceType === "COLD") {
    return engineResult({
      engine: "AdsCode07_EmotionalIntensity",
      status: "FAIL",
      score: 0.4,
      message: "High emotion on cold audience creates distrust"
    });
  }

  return engineResult({
    engine: "AdsCode07_EmotionalIntensity",
    status: "PASS",
    score: 0.8,
    message: "Emotional intensity calibrated"
  });
};
