// src/engines/adsCode27.audienceSaturation.js

const { engineResult } = require("../core/engineResult");

class AudienceSaturationEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const frequency = Number(this.context.frequency || 0);
    const ctr = Number(this.context.ctr || 0);
    const daysRunning = Number(this.context.daysRunning || 1);

    // 🚨 Audience completely saturated
    if (frequency >= 3.5 && ctr < 0.5) {
      return engineResult({
        engine: "AdsCode27_AudienceSaturation",
        status: "FAIL",
        score: 1,
        message:
          "Audience is saturated. High frequency with very low CTR. Stop or refresh audience."
      });
    }

    // ⚠️ Early fatigue signals
    if (frequency >= 2.5 && ctr < 1) {
      return engineResult({
        engine: "AdsCode27_AudienceSaturation",
        status: "WARNING",
        score: 0.6,
        message:
          "Audience fatigue detected. Consider creative or audience refresh."
      });
    }

    // ⚠️ Too early to judge saturation
    if (daysRunning < 3) {
      return engineResult({
        engine: "AdsCode27_AudienceSaturation",
        status: "WARNING",
        score: 0.7,
        message:
          "Campaign too new to confirm audience saturation."
      });
    }

    // ✅ Audience healthy
    return engineResult({
      engine: "AdsCode27_AudienceSaturation",
      status: "PASS",
      score: 0.3,
      message: "Audience engagement remains healthy."
    });
  }
}

module.exports = { AudienceSaturationEngine };
