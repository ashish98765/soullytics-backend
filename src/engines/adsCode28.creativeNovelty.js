// src/engines/adsCode28.creativeNovelty.js

const { engineResult } = require("../core/engineResult");

class CreativeNoveltyEngine {
  constructor(context) {
    this.context = context;
  }

  run() {
    const creativeAgeDays = Number(this.context.creativeAgeDays || 0);
    const ctrTrend = Number(this.context.ctrTrend || 0); // % change
    const sameHookCount = Number(this.context.sameHookCount || 0);

    // 🚨 Creative totally stale
    if (creativeAgeDays > 21 && ctrTrend < -40) {
      return engineResult({
        engine: "AdsCode28_CreativeNovelty",
        status: "FAIL",
        score: 1,
        message:
          "Creative is stale. Long-running creative with heavy CTR decay."
      });
    }

    // ⚠️ Novelty wearing off
    if (creativeAgeDays > 14 || sameHookCount >= 3) {
      return engineResult({
        engine: "AdsCode28_CreativeNovelty",
        status: "WARNING",
        score: 0.6,
        message:
          "Creative novelty declining. Fresh hook or format recommended."
      });
    }

    // ✅ Creative still fresh
    return engineResult({
      engine: "AdsCode28_CreativeNovelty",
      status: "PASS",
      score: 0.3,
      message: "Creative still feels fresh to the audience."
    });
  }
}

module.exports = { CreativeNoveltyEngine };
