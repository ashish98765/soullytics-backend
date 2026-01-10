// src/engines/adsCode19.finalComposer.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

class FinalAdsComposer extends AdsCode {
  run() {
    const engineResults = this.context.engineResults;

    if (!Array.isArray(engineResults) || engineResults.length === 0) {
      return engineResult({
        engine: "AdsCode19_FinalComposer",
        status: "FAIL",
        score: 0,
        message: "Engine results missing or invalid. System cannot decide."
      });
    }

    let failCount = 0;
    let warningCount = 0;

    let weightedScore = 0;
    let maxScore = 0;

    let hasCriticalFail = false;
    let humanOverrideRisk = false;

    for (const r of engineResults) {
      const status = r.status || "PASS";
      const score = Number(r.score ?? 0.3);

      // ---- Engine trust weighting ----
      let weight = 1;

      // Intelligence / learning engines = higher trust
      if (
        r.engine.includes("Reality") ||
        r.engine.includes("Learning") ||
        r.engine.includes("Feedback") ||
        r.engine.includes("Integrity") ||
        r.engine.includes("BurnRate") ||
        r.engine.includes("Risk")
      ) {
        weight = 1.5;
      }

      // Human override engines = high impact
      if (r.engine.includes("HumanOverride") || r.engine.includes("FounderRisk")) {
        weight = 1.8;
        if (status !== "PASS") humanOverrideRisk = true;
      }

      maxScore += 1 * weight;

      if (status === "FAIL") {
        failCount++;
        weightedScore -= 1.2 * weight;

        // Capital & safety fails are absolute veto
        if (
          r.engine.includes("StopLoss") ||
          r.engine.includes("BurnRate") ||
          r.engine.includes("Risk")
        ) {
          hasCriticalFail = true;
        }
      }

      if (status === "WARNING") {
        warningCount++;
        weightedScore -= 0.6 * weight;
      }

      if (status === "PASS") {
        weightedScore += score * weight;
      }
    }

    // ---- Normalize confidence ----
    let confidence = Math.round((weightedScore / maxScore) * 100);
    confidence = Math.max(0, Math.min(confidence, 100));

    // ---- FINAL DECISION LOGIC ----

    // ❌ Absolute stop
    if (hasCriticalFail || failCount >= 2) {
      return engineResult({
        engine: "AdsCode19_FinalComposer",
        status: "DO_NOT_RUN",
        score: confidence,
        message:
          "Critical failures detected. Capital or risk protection breached. Ads must not run."
      });
    }

    // ⚠️ Human override risk → force pause
    if (humanOverrideRisk && warningCount >= 1) {
      return engineResult({
        engine: "AdsCode19_FinalComposer",
        status: "PAUSE",
        score: confidence,
        message:
          "Human override risk detected with warnings. Pause recommended to prevent emotional loss."
      });
    }

    // ⚠️ Too many warnings
    if (warningCount >= 3) {
      return engineResult({
        engine: "AdsCode19_FinalComposer",
        status: "PAUSE",
        score: confidence,
        message:
          "Multiple warning signals detected. System advises pause and review."
      });
    }

    // ✅ Safe to run
    return engineResult({
      engine: "AdsCode19_FinalComposer",
      status: "RUN",
      score: confidence,
      message:
        "System stable. Risk acceptable. Ads cleared to run."
    });
  }
}

module.exports = { FinalAdsComposer };
