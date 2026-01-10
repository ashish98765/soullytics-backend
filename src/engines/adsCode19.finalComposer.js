// src/engines/adsCode19.finalComposer.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class FinalAdsComposer extends AdsCode {
  run() {
    const engineResults = this.context.engineResults;

    if (!Array.isArray(engineResults) || engineResults.length === 0) {
      return engineResult({
        engine: "AdsCode19_FinalComposer",
        status: "DO_NOT_RUN",
        score: 0,
        message: "No engine results found. System refuses to decide blindly."
      });
    }

    // 🚨 HARD FAIL RULE (absolute veto)
    const failedEngine = engineResults.find(r => r.status === "FAIL");

    if (failedEngine) {
      return engineResult({
        engine: "AdsCode19_FinalComposer",
        status: "DO_NOT_RUN",
        score: 0,
        message: `Engine ${failedEngine.engine} failed. Ads are BLOCKED.`
      });
    }

    // ⚠️ WARNINGS → PAUSE
    const warningCount = engineResults.filter(r => r.status === "WARNING").length;

    if (warningCount >= 1) {
      return engineResult({
        engine: "AdsCode19_FinalComposer",
        status: "PAUSE",
        score: 50,
        message: "Warnings detected. Human review required before running ads."
      });
    }

    // ✅ ALL PASS → RUN
    return engineResult({
      engine: "AdsCode19_FinalComposer",
      status: "RUN",
      score: 90,
      message: "All engines passed. Ads cleared to run safely."
    });
  }
}

module.exports = { FinalAdsComposer };
