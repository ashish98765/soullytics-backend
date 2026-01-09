// src/engines/adsCode07.emotionalIntensity.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class EmotionalIntensityEngine extends AdsCode {
  run() {
    const emotionalIntensity = this.context.emotionalIntensity;
    const audienceType = this.context.audienceType;

    if (!emotionalIntensity) {
      return engineResult({
        engine: "AdsCode07_EmotionalIntensity",
        status: "FAIL",
        message: "Emotional intensity missing. Ad emotional pull cannot be judged."
      });
    }

    if (!audienceType) {
      return engineResult({
        engine: "AdsCode07_EmotionalIntensity",
        status: "FAIL",
        message: "Audience type missing. Emotional calibration impossible."
      });
    }

    if (emotionalIntensity === "LOW") {
      return engineResult({
        engine: "AdsCode07_EmotionalIntensity",
        status: "FAIL",
        message: "Low emotional intensity. Ad will not register with users."
      });
    }

    if (emotionalIntensity === "HIGH" && audienceType === "COLD") {
      return engineResult({
        engine: "AdsCode07_EmotionalIntensity",
        status: "FAIL",
        message: "High emotional intensity on cold audience creates distrust."
      });
    }

    return engineResult({
      engine: "AdsCode07_EmotionalIntensity",
      status: "PASS",
      score: 0.8,
      message: `Emotional intensity '${emotionalIntensity}' is appropriate for '${audienceType}' audience.`
    });
  }
}

module.exports = { EmotionalIntensityEngine };
