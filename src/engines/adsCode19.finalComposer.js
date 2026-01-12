// src/engines/adsCode19.finalComposer.js

const { engineResult } = require("../core/engineResult");
const { AdsCode } = require("../core/adsCode.interface");

/**
 * FINAL DECISION COMPOSER
 * ----------------------
 * Capital-first, veto-based, authority-aware decision engine.
 * This engine NEVER guesses.
 */

class FinalAdsComposer extends AdsCode {
  run() {
    const engineResults = this.context.engineResults;

    if (!Array.isArray(engineResults) || engineResults.length === 0) {
      return engineResult({
        engine: "AdsCode19_FinalComposer",
        status: "DO_NOT_RUN",
        score: 0,
        message:
          "No engine results found. System refuses to decide without evidence."
      });
    }

    let weightedScore = 0;
    let authoritySum = 0;

    const failedEngines = [];
    const warningEngines = [];

    for (const r of engineResults) {
      const authority = r.authority || 1;
      const score = typeof r.score === "number" ? r.score : 0;

      weightedScore += score * authority;
      authoritySum += authority;

      if (r.status === "FAIL") failedEngines.push(r);
      if (r.status === "WARNING") warningEngines.push(r);
    }

    const confidence =
      authoritySum > 0 ? weightedScore / authoritySum : 0;

    /**
     * HARD VETO RULE
     * Any FAIL from high-authority engines blocks execution.
     */
    const hardFail = failedEngines.find(e => e.authority >= 7);

    if (hardFail) {
      return engineResult({
        engine: "AdsCode19_FinalComposer",
        status: "DO_NOT_RUN",
        score: Math.round(confidence * 100),
        message: `Blocked by ${hardFail.engine}. Capital protection override.`,
        meta: {
          veto: hardFail.engine,
          confidence
        }
      });
    }

    /**
     * WARNING LOGIC
     * Presence of warnings pauses automation.
     */
    if (warningEngines.length > 0) {
      return engineResult({
        engine: "AdsCode19_FinalComposer",
        status: "PAUSE",
        score: Math.round(confidence * 100),
        message:
          "Risk signals detected. Human review required before execution.",
        meta: {
          warnings: warningEngines.map(w => w.engine),
          confidence
        }
      });
    }

    /**
     * POSITIVE DECISION LOGIC
     */
    if (confidence >= 0.75) {
      return engineResult({
        engine: "AdsCode19_FinalComposer",
        status: "SCALE",
        score: Math.round(confidence * 100),
        message:
          "High confidence decision. Signals stable. Scaling permitted.",
        meta: { confidence }
      });
    }

    if (confidence >= 0.55) {
      return engineResult({
        engine: "AdsCode19_FinalComposer",
        status: "RUN",
        score: Math.round(confidence * 100),
        message:
          "Moderate confidence. Controlled execution approved.",
        meta: { confidence }
      });
    }

    /**
     * DEFAULT SAFE STATE
     */
    return engineResult({
      engine: "AdsCode19_FinalComposer",
      status: "PAUSE",
      score: Math.round(confidence * 100),
      message:
        "Confidence too low for safe execution. Waiting for more data.",
      meta: { confidence }
    });
  }
}

module.exports = { FinalAdsComposer };
