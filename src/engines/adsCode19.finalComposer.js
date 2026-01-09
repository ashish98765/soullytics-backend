// src/engines/adsCode19.finalComposer.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class FinalAdsComposer extends AdsCode {
  run() {
    const engineResults = this.context.engineResults;

    if (!Array.isArray(engineResults)) {
      return engineResult({
        engine: "AdsCode19_FinalComposer",
        status: "FAIL",
        score: 0,
        message: "Engine results missing or invalid."
      });
    }

    let score = 0;
    let maxScore = engineResults.length * 6;
    let failCount = 0;
    let warnCount = 0;

    for (const r of engineResults) {
      const status = r.status || "PASS";
      const impact = r.impact || "LOW";

      if (status === "FAIL") {
        failCount++;
        if (impact === "HIGH") score -= 8;
        else if (impact === "MEDIUM") score -= 5;
        else score -= 2;
      }

      if (status === "WARNING") {
        warnCount++;
        if (impact === "HIGH") score -= 4;
        else score -= 2;
      }

      if (status === "PASS") {
        if (impact === "HIGH") score += 6;
        else if (impact === "MEDIUM") score += 4;
        else score += 2;
      }
    }

    let confidence = Math.round((score / maxScore) * 100);
    confidence = Math.max(0, Math.min(confidence, 100));

    // FINAL DECISION LOGIC
    if (failCount > 0) {
      return engineResult({
        engine: "AdsCode19_FinalComposer",
        status: "DO_NOT_RUN",
        score: confidence,
        message: "Critical failures detected. Ads must not run."
      });
    }

    if (warnCount >= 2) {
      return engineResult({
        engine: "AdsCode19_FinalComposer",
        status: "PAUSE",
        score: confidence,
        message: "Multiple warnings detected. Review before running ads."
      });
    }

    return engineResult({
      engine: "AdsCode19_FinalComposer",
      status: "RUN",
      score: confidence,
      message: "System healthy. Ads cleared to run."
    });
  }
}

module.exports = { FinalAdsComposer };
